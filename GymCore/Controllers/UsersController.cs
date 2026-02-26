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

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id)
    {
        var user = _users.GetById(id);
        return user is null ? NotFound() : Ok(user);
    }
    [Authorize(Roles ="Staff,Admin")]
    [HttpPost]
    public IActionResult Create([FromBody] CreateUserRequest request)
    {
        var created = _users.Create(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}