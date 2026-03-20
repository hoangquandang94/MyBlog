using MyBlog.Application.DTOs;

namespace MyBlog.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto);
}
