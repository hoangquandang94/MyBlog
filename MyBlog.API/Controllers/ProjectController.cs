using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.Interfaces;
using MyBlog.Core.Entities;

namespace MyBlog.API.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectController(IRepository<Project> repository) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var projects = await repository.GetAllAsync();
        return Ok(projects.OrderByDescending(p => p.CreatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> Create(Project project)
    {
        await repository.AddAsync(project);
        return Ok(project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Project project)
    {
        if (id != project.Id) return BadRequest();
        await repository.UpdateAsync(project);
        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var project = (await repository.GetAllAsync()).FirstOrDefault(p => p.Id == id);
        if (project == null) return NotFound();
        await repository.DeleteAsync(project);
        return Ok();
    }
}
