namespace MyBlog.Core.Entities;

public class SidebarSection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Store items as JSON or comma-separated string
    public string Icon { get; set; } = string.Empty;
    public int Order { get; set; }
    public string ComponentType { get; set; } = "List"; // List, Tags, or Text
}
