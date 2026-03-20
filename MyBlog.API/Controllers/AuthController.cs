using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.DTOs;
using MyBlog.Application.Interfaces;

namespace MyBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var response = await authService.AuthenticateAsync(loginDto);
        if (response == null) return Unauthorized(new { message = "Invalid credentials" });
        return Ok(response);
    }
}
