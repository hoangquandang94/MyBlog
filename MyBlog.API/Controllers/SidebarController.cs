using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.Interfaces;
using MyBlog.Core.Entities;

namespace MyBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SidebarController(IRepository<SidebarSection> sidebarRepository) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var sections = await sidebarRepository.GetAllAsync();
        return Ok(sections.OrderBy(s => s.Order));
    }

    [HttpPost]
    public async Task<IActionResult> Create(SidebarSection section)
    {
        await sidebarRepository.AddAsync(section);
        return Ok(section);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, SidebarSection section)
    {
        if (id != section.Id) return BadRequest();
        await sidebarRepository.UpdateAsync(section);
        return Ok(section);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var section = await sidebarRepository.GetByIdAsync(id);
        if (section == null) return NotFound();
        await sidebarRepository.DeleteAsync(section);
        return Ok();
    }
}
