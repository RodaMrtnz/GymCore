using GymCore.Application.DTOs.Users;
using GymCore.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace GymCore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase

{

    private readonly IUserService _users;

    public UsersController(IUserService users)
    {
        _users = users;
    }

    [HttpGet]
    public IActionResult GetAll()
        => Ok(_users.GetAll());

    [HttpGet]
    public IActionResult GetAllTrainers()
        => Ok(_users.GetAllTrainers());


    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id)
    {
        try
        {
            var user = _users.GetById(id);
            return user is null ? NotFound() : Ok(user);
        }

        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An unexpected error occurred.");
        }
    }
    [Authorize(Roles = "Staff,Admin")]
    [HttpPost]
    public IActionResult Create([FromBody] CreateUserRequest request)
    {
        try
        {
            var created = _users.Create(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [Authorize(Roles = "Staff,Admin")]
    [HttpPut("assign-trainer")]
    public IActionResult AssignTrainer([FromBody] AssignTrainerRequest request)
    {
        try
        {
            _users.AssignTrainer(request);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}