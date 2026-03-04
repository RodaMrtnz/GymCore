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
    public async Task<IActionResult> GetAll()
        => Ok(await _users.GetAllAsync());

    [HttpGet]
    public async Task<IActionResult> GetAllTrainers()
        => Ok(await _users.GetAllTrainersAsync());


    [HttpGet("client/{id:guid}")]
    public async Task<IActionResult> GetClientById(Guid id)
    {
        try
        {
            var client = await _users.GetClientByIdAsync(id);
            return client is null ? NotFound() : Ok(client);
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
    [HttpGet("trainer/{id:guid}")]
    public async Task<IActionResult> GetTrainerById(Guid id)
    {
        try
        {
            var trainer = await _users.GetTrainerByIdAsync(id);
            return trainer is null ? NotFound() : Ok(trainer);
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
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        try
        {
            var created = await _users.CreateAsync(request);
        return CreatedAtAction(nameof(GetClientById), new { id = created.Id }, created);
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
    [HttpPost("trainer")]
    public async Task<IActionResult> CreateTrainer([FromBody] CreateUserRequest request)
    {
        try
        {
            var created = await _users.CreateAsync(request);
            return CreatedAtAction(nameof(GetTrainerById), new { id = created.Id }, created);
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
    public async Task<IActionResult> AssignTrainer([FromBody] AssignTrainerRequest request)
    {
        try
        {
            await _users.AssignTrainerAsync(request);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}