using MyBlog.Core.Entities;

namespace MyBlog.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
