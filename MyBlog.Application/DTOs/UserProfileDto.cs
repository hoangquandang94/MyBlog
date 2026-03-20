namespace MyBlog.Application.DTOs;

public record UserProfileDto(
    string FullName,
    string JobTitle,
    string Bio,
    string ThemeColor,
    string? ProfilePictureUrl = null
);
