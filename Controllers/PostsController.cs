using Microsoft.AspNetCore.Mvc;

namespace hvfc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private static readonly List<Post> Posts = new()
    {
        new Post { Id = 1, Title = "First Post", Content = "This is the content of the first post", AuthorId = 1, CreatedAt = DateTime.Now.AddDays(-5) },
        new Post { Id = 2, Title = "Second Post", Content = "This is the content of the second post", AuthorId = 2, CreatedAt = DateTime.Now.AddDays(-3) },
        new Post { Id = 3, Title = "Third Post", Content = "This is the content of the third post", AuthorId = 1, CreatedAt = DateTime.Now.AddDays(-1) }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Post>> GetPosts()
    {
        return Ok(Posts);
    }

    [HttpGet("{id}")]
    public ActionResult<Post> GetPost(int id)
    {
        var post = Posts.FirstOrDefault(p => p.Id == id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }
        return Ok(post);
    }

    [HttpPost]
    public ActionResult<Post> CreatePost([FromBody] CreatePostRequest request)
    {
        var newPost = new Post
        {
            Id = Posts.Max(p => p.Id) + 1,
            Title = request.Title,
            Content = request.Content,
            AuthorId = request.AuthorId,
            CreatedAt = DateTime.Now
        };

        Posts.Add(newPost);
        return CreatedAtAction(nameof(GetPost), new { id = newPost.Id }, newPost);
    }

    [HttpPut("{id}")]
    public ActionResult<Post> UpdatePost(int id, [FromBody] UpdatePostRequest request)
    {
        var post = Posts.FirstOrDefault(p => p.Id == id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        post.Title = request.Title;
        post.Content = request.Content;
        post.AuthorId = request.AuthorId;

        return Ok(post);
    }

    [HttpDelete("{id}")]
    public ActionResult DeletePost(int id)
    {
        var post = Posts.FirstOrDefault(p => p.Id == id);
        if (post == null)
        {
            return NotFound(new { message = "Post not found" });
        }

        Posts.Remove(post);
        return NoContent();
    }
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePostRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
}

public class UpdatePostRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
}