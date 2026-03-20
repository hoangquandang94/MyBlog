using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.Interfaces;
using MyBlog.Core.Entities;

namespace MyBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogPostsController(IRepository<BlogPost> repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await repository.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var post = await repository.GetByIdAsync(id);
        return post == null ? NotFound() : Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(BlogPost post)
    {
        await repository.AddAsync(post);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, BlogPost post)
    {
        if (id != post.Id) return BadRequest();
        await repository.UpdateAsync(post);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var post = await repository.GetByIdAsync(id);
        if (post == null) return NotFound();
        await repository.DeleteAsync(post);
        return NoContent();
    }
}
