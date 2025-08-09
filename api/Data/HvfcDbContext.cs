using Microsoft.EntityFrameworkCore;
using hvfc.Controllers;

namespace hvfc.Data;

public class HvfcDbContext : DbContext
{
    public HvfcDbContext(DbContextOptions<HvfcDbContext> options) : base(options)
    {
    }

    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
        });

        // Posts will be loaded from JSON file via the PostsLoaderService
        // No seed data needed here
    }
}