using MyBlog.Application.DTOs;
using MyBlog.Application.Interfaces;
using MyBlog.Core.Entities;

namespace MyBlog.Application.Services;

public class AuthService(IRepository<User> userRepository, IJwtService jwtService) : IAuthService
{
    public async Task<AuthResponseDto?> AuthenticateAsync(LoginDto loginDto)
    {
        var users = await userRepository.GetAllAsync();
        // In real world, use a real hasher. For simplicity we assume plain or basic hash here.
        var user = users.FirstOrDefault(u => u.Username == loginDto.Username && u.PasswordHash == loginDto.Password);
        
        if (user == null) return null;

        var token = jwtService.GenerateToken(user);
        return new AuthResponseDto(token, user.Username);
    }
}
