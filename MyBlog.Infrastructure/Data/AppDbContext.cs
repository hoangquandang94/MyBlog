using Microsoft.EntityFrameworkCore;
using MyBlog.Core.Entities;

namespace MyBlog.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<User> Users => Set<User>();
    public DbSet<SidebarSection> SidebarSections => Set<SidebarSection>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Ensure some basic configuration
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
    }
}
