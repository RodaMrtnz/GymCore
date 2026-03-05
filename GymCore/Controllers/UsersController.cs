using GymCore.Application.DTOs.Users;
using GymCore.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace GymCore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase

{

    private readonly IUserService _users;
    private readonly IConfiguration _configuration;


    public UsersController(IUserService users, IConfiguration configuration)
    {
        _users = users;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _users.GetAllAsync());

    [HttpGet("trainers")]
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
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Aquí deberías validar las credenciales usando tu IUserService
        var user = await _users.AuthenticateAsync(request.Email, request.Password);
        if (user == null)
            return Unauthorized("Invalid credentials");

        // Genera el token JWT
        var token = GenerateJwtToken(user);

        return Ok(new { token });
    }
    private string GenerateJwtToken(UserResponse user)
    {
        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
            throw new InvalidOperationException("JWT Key is not configured.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        if (string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(audience))
            throw new InvalidOperationException("JWT Issuer or Audience is not configured.");

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}