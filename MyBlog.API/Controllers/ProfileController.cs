using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.DTOs;
using MyBlog.Application.Interfaces;
using MyBlog.Core.Entities;

namespace MyBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(IRepository<User> userRepository, IWebHostEnvironment environment) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProfile()
    {
        var users = await userRepository.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Username == "admin"); // Multi-tenant not implemented yet
        if (user == null) return NotFound();

        return Ok(new {
            user.FullName,
            user.JobTitle,
            user.Bio,
            user.ProfilePictureUrl,
            user.ThemeColor
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(UserProfileDto profileDto)
    {
        var users = await userRepository.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Username == User.Identity?.Name);
        if (user == null) return NotFound();

        user.FullName = profileDto.FullName;
        user.JobTitle = profileDto.JobTitle;
        user.Bio = profileDto.Bio;
        user.ThemeColor = profileDto.ThemeColor;
        if (!string.IsNullOrEmpty(profileDto.ProfilePictureUrl)) 
            user.ProfilePictureUrl = profileDto.ProfilePictureUrl;

        await userRepository.UpdateAsync(user);
        return Ok(user);
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file uploaded.");

        var users = await userRepository.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Username == User.Identity?.Name);
        if (user == null) return NotFound();

        var webRootPath = environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsPath = Path.Combine(webRootPath, "uploads");
        if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        user.ProfilePictureUrl = $"/uploads/{fileName}";
        await userRepository.UpdateAsync(user);

        return Ok(new { url = user.ProfilePictureUrl });
    }
}
