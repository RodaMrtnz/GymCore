using GymCore.Application.Interfaces;
using GymCore.Application.DTOs.Routines;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace GymCore.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RoutinesController : ControllerBase
{
    private readonly IRoutineService _routineService;
    private readonly ILogger<UsersController> _logger;


    public RoutinesController(IRoutineService routineService, ILogger<UsersController> logger)
    {
        _routineService = routineService;
        _logger = logger;
    }

    [Authorize(Roles = "Trainer, Admin")]
    [HttpGet]
   public async Task<IActionResult> GetAll()
        => Ok(await _routineService.GetAll());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var routine = await _routineService.GetById(id);
        return routine is null ? NotFound() : Ok(routine);
        }

        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in GetById");

            return StatusCode(500, "An unexpected error occurred.");
        }
    }
    [Authorize(Roles = "Client")]
    [HttpGet("my-routines/{clientId:guid}")]
    public async Task<IActionResult> GetMyRoutines(Guid clientId)
    {
        try
        {
            var routines = await _routineService.GetMyRoutines(clientId);
            return Ok(routines);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in GetMyRoutines");

            return StatusCode(500, "An unexpected error occurred.");
        }
    }
    [Authorize(Roles = "Trainer")]
    [HttpGet("trainer-routines/{trainerId:guid}")]
    public IActionResult GetTrainerRoutines(Guid trainerId)
    {
        try
        {
            var routines = _routineService.GetTrainerRoutines(trainerId);
            return Ok(routines);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in GetTrainerRoutines");

            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [Authorize(Roles = "Trainer, Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateRoutineRequest request)
    {
        try
        {
            var created = await _routineService.Create(request);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in Create");

            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [Authorize(Roles = "Trainer")]
    [HttpPut("assign-routine")]
    public async Task<IActionResult> AssignRoutine(AssignRoutineRequest request)
    {
        try
        {
            await _routineService.AssignRoutine(request);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in AssignRoutine");

            return StatusCode(500, "An unexpected error occurred.");
        }
    }
    [Authorize(Roles = "Trainer")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _routineService.Delete(id);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in Delete");

            return StatusCode(500, "An unexpected error occurred.");
        }
    }
}
