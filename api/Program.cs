using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add Entity Framework
builder.Services.AddDbContext<hvfc.Data.HvfcDbContext>(options =>
    options.UseInMemoryDatabase("HvfcDb"));

// Add Posts Loader Service
builder.Services.AddHostedService<hvfc.Services.PostsLoaderService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure database is created (posts will be loaded by PostsLoaderService)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<hvfc.Data.HvfcDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Don't use HTTPS redirection in production (nginx handles SSL)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Use CORS only in development
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowAngularClient");
}

// In production, use forwarded headers from Nginx
if (!app.Environment.IsDevelopment())
{
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | 
                          Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto
    });
}

// Serve static files (Angular app)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.MapControllers();

// Fallback to index.html for Angular routes (SPA support)
app.MapFallbackToFile("index.html");

app.Run();
