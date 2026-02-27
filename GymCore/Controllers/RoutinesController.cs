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

    public RoutinesController(IRoutineService routineService)
    {
        _routineService = routineService;
    }

    [Authorize(Roles = "Trainer")]
    [HttpGet]
   public IActionResult GetAll()
        => Ok(_routineService.GetAll());

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id)
    {
        try
        {
            var routine = _routineService.GetById(id);
        return routine is null ? NotFound() : Ok(routine);
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
    [Authorize(Roles = "Client")]
    [HttpGet("my-routines/{clientId:guid}")]
    public IActionResult GetMyRoutines(Guid clientId)
    {
        try
        {
            var routines = _routineService.GetMyRoutines(clientId);
            return Ok(routines);
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
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [Authorize(Roles = "Trainer")]
    [HttpPost]
    public IActionResult Create(CreateRoutineRequest request)
    {
        try
        {
            var created = _routineService.Create(request);
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

    [Authorize(Roles = "Trainer")]
    [HttpPut("assign-routine")]
    public IActionResult AssignRoutine(AssignRoutineRequest request)
    {
        try
        {
            _routineService.AssignRoutine(request);
            return NoContent();
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
    [Authorize(Roles = "Trainer")]
    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        try
        {
            var deleted = _routineService.Delete(id);
            return Ok(deleted);
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
}
