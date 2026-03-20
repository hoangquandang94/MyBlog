using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.Interfaces;
using MyBlog.Core.Entities;

namespace MyBlog.API.Controllers;

[ApiController]
[Route("api/experiences")]
[Authorize]
public class ExperienceController(IRepository<Experience> repository) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var experiences = await repository.GetAllAsync();
        return Ok(experiences.OrderByDescending(e => e.StartDate));
    }

    [HttpPost]
    public async Task<IActionResult> Create(Experience experience)
    {
        await repository.AddAsync(experience);
        return Ok(experience);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Experience experience)
    {
        if (id != experience.Id) return BadRequest();
        await repository.UpdateAsync(experience);
        return Ok(experience);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var experience = (await repository.GetAllAsync()).FirstOrDefault(e => e.Id == id);
        if (experience == null) return NotFound();
        await repository.DeleteAsync(experience);
        return Ok();
    }
}
