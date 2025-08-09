using Microsoft.AspNetCore.Mvc;

namespace hvfc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private static readonly List<Post> Posts = new()
    {
        new Post 
        { 
            Id = 1, 
            Title = "Breaking Personal Records at the 2024 Spring Meet", 
            Content = "The Hudson Valley Flying Circus community came together for our annual Spring Meet last weekend, and what an incredible display of athletic prowess we witnessed! The weather couldn't have been more perfect – sunny skies with just a gentle breeze that provided ideal conditions for pole vaulting.\n\nOur star athlete, Sarah Mitchell, absolutely shattered her personal best by clearing 4.2 meters, a height that puts her in contention for regional competitions. Sarah has been training with our head coach, Mike Rodriguez, for the past two years, and her dedication to perfecting her technique has clearly paid off. \"I've been working specifically on my approach run timing and pole plant position,\" Sarah explained after her record-breaking vault. \"The countless hours of practice and video analysis with Coach Mike have really helped me understand the mechanics behind a successful vault.\"\n\nThe junior division also saw remarkable performances, with three athletes clearing personal bests. Tommy Chen, at just 16 years old, cleared 3.1 meters – an impressive height that showcases the bright future of pole vaulting in our region. The progression we're seeing in our youth program is particularly exciting, as these young athletes are building strong technical foundations that will serve them well as they continue to develop.\n\nBeyond the individual achievements, what struck us most was the supportive atmosphere throughout the meet. Competitors cheered for each other, shared equipment, and offered technique tips – truly embodying the spirit of our Flying Circus community. This camaraderie is what makes our meets special and keeps athletes coming back year after year.",
            AuthorId = 1, 
            CreatedAt = new DateTime(2024, 3, 15) 
        },
        new Post 
        { 
            Id = 2, 
            Title = "Technical Tips: Mastering the Perfect Pole Plant", 
            Content = "One of the most critical aspects of pole vaulting that often gets overlooked by beginners is the pole plant. This fundamental technique can make or break your vault, yet it's one of the most challenging skills to master. Today, we're breaking down the essential elements of a perfect pole plant that will help elevate your performance to new heights.\n\nThe pole plant begins well before you reach the box – it starts with your approach run. Your final six steps are crucial for setting up the perfect plant angle. As you accelerate down the runway, your pole should gradually rise from the carrying position to the plant position. The key is maintaining a smooth, consistent rhythm while keeping your eyes focused on the back of the box, not on the pole itself.\n\nTiming is everything when it comes to the actual plant. The pole should enter the box at approximately a 20-degree angle, with the plant occurring just as your second-to-last step hits the ground. This timing allows you to maintain your forward momentum while beginning the pole's bend. A common mistake we see is athletes planting too early or too late, which disrupts the energy transfer from the approach run to the pole.\n\nYour grip position plays a crucial role in plant success. Your top hand should be positioned according to your height and strength level – typically somewhere between 12 to 15 hand-widths from the bottom of the pole for intermediate vaulters. During the plant, think about driving the pole forward and up, not down into the box. This motion helps maintain the pole's momentum and sets you up for an efficient swing-up phase. Remember, the pole plant is just the beginning of your vault – master this foundation, and you'll see significant improvements in your overall performance.",
            AuthorId = 1, 
            CreatedAt = new DateTime(2024, 3, 8) 
        },
        new Post 
        { 
            Id = 3, 
            Title = "Welcome New Members: Building Our Pole Vaulting Community", 
            Content = "We're thrilled to announce that the Hudson Valley Flying Circus has welcomed fifteen new members this season! Our growing community now includes athletes ranging from complete beginners to experienced vaulters looking to train in a supportive, technical environment. This expansion reflects not only the increasing popularity of pole vaulting in our region but also the reputation we've built as a premier training facility.\n\nOur newest members come from diverse backgrounds – high school students looking to make their track teams, college athletes seeking to improve their technique during off-season, recreational athletes wanting to try something new and challenging, and even a few former gymnasts drawn to the acrobatic aspects of pole vaulting. What unites them all is a shared enthusiasm for learning this technically demanding but incredibly rewarding sport.\n\nTo help integrate our new members, we've implemented a structured onboarding program. Each newcomer is paired with an experienced vaulter as a mentor, ensuring they have guidance both on and off the runway. Our beginner sessions now include dedicated time for fundamental drills, safety protocols, and equipment familiarization. We believe that building confidence and competence in the basics creates a solid foundation for future progression.\n\nThe energy that new members bring to our training sessions has been remarkable. Their fresh perspective and eagerness to learn has reinvigorated our entire community. Veteran members have stepped up as teachers and encouragers, creating an environment where everyone feels supported in their pole vaulting journey. If you're interested in joining our Flying Circus family, we meet every Tuesday and Thursday evening at 6 PM, and Saturday mornings at 9 AM. Come experience the thrill of pole vaulting with us – we'd love to help you discover just how high you can soar!",
            AuthorId = 2, 
            CreatedAt = new DateTime(2024, 2, 28) 
        }
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