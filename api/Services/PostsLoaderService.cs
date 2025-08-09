using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using hvfc.Controllers;
using hvfc.Data;

namespace hvfc.Services;

public class CustomDateTimeConverter : JsonConverter<DateTime>
{
    private readonly string _format = "yyyy-MM-dd HH:mm:ss";

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var dateString = reader.GetString();
        if (DateTime.TryParseExact(dateString, _format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            return date;
        }
        return DateTime.Now; // Fallback
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(_format, CultureInfo.InvariantCulture));
    }
}

public class PostsLoaderService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<PostsLoaderService> _logger;
    private DateTime _lastFileWriteTime = DateTime.MinValue;
    private readonly string _jsonFilePath;

    public PostsLoaderService(IServiceProvider serviceProvider, ILogger<PostsLoaderService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "../posts.json");
        
        // Try alternative paths if file doesn't exist
        if (!File.Exists(_jsonFilePath))
        {
            _jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "posts.json");
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Initial load
        await LoadPostsFromJson();

        // Poll for changes every minute
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                await CheckForFileChanges();
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in PostsLoaderService polling loop");
            }
        }
    }

    private async Task CheckForFileChanges()
    {
        try
        {
            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogWarning("Posts JSON file not found at: {FilePath}", _jsonFilePath);
                return;
            }

            var fileInfo = new FileInfo(_jsonFilePath);
            if (fileInfo.LastWriteTime > _lastFileWriteTime)
            {
                _logger.LogInformation("Posts JSON file has been updated. Reloading posts...");
                await LoadPostsFromJson();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking for file changes");
        }
    }

    private async Task LoadPostsFromJson()
    {
        try
        {
            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogWarning("Posts JSON file not found at: {FilePath}", _jsonFilePath);
                return;
            }

            var jsonString = await File.ReadAllTextAsync(_jsonFilePath);
            
            // Deserialize the posts from the "posts" property
            var jsonStructure = JsonSerializer.Deserialize<JsonDocument>(jsonString);
            if (jsonStructure?.RootElement.TryGetProperty("posts", out var postsProperty) != true)
            {
                _logger.LogWarning("No 'posts' property found in JSON file");
                return;
            }

            var posts = JsonSerializer.Deserialize<List<Post>>(postsProperty.GetRawText(), new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new CustomDateTimeConverter() }
            });

            if (posts == null || !posts.Any())
            {
                _logger.LogWarning("No posts found in JSON file or failed to deserialize");
                return;
            }

            // Filter out invalid posts
            var validPosts = posts.Where(p => p.Id > 0 && !string.IsNullOrEmpty(p.Title))
                                 .ToList();

            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<HvfcDbContext>();

            // Clear existing posts and add new ones
            context.Posts.RemoveRange(context.Posts);
            await context.Posts.AddRangeAsync(validPosts);
            await context.SaveChangesAsync();

            // Update file write time
            var fileInfo = new FileInfo(_jsonFilePath);
            _lastFileWriteTime = fileInfo.LastWriteTime;

            _logger.LogInformation("Successfully loaded {Count} posts from JSON file", validPosts.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading posts from JSON file: {FilePath}", _jsonFilePath);
        }
    }
}