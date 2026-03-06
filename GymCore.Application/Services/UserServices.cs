using GymCore.Application.DTOs.Users;
using GymCore.Application.Interfaces;
using GymCore.Domain.Entities;
using GymCore.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GymCore.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public UserService(
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<IEnumerable<UserResponse>> GetAllAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        return users.Select(MapToResponse);
    }

    public async Task<IEnumerable<TrainerResponse>> GetAllTrainersAsync()
    {
        var trainers = await _userManager.Users
            .OfType<Trainer>()
            .ToListAsync();

        return trainers.Select(MapToTrainerResponse);
    }

    public async Task<IEnumerable<UserResponse>> GetAllClientsAsync()
    {
        var clients = await _userManager.Users
            .OfType<Client>()
            .ToListAsync();

        return clients.Select(MapToResponse);
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("FullName is required.");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required.");

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            throw new ArgumentException("Email already exists.");

        // Crear instancia según tipo (TPH)
        User user = request.Role switch
        {
            Domain.Enums.UserRole.Client => new Client(),
            Domain.Enums.UserRole.Trainer => new Trainer(),
            _ => new User()
        };

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.UserName = request.Email; // mejor usar email como username
        user.CreatedAt = DateTime.UtcNow;

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        var roleName = request.Role.ToString();
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            var createRole = await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            if (!createRole.Succeeded)
                throw new Exception(string.Join(", ", createRole.Errors.Select(e => e.Description)));
        }

        var roleResult = await _userManager.AddToRoleAsync(user, roleName);
        if (!roleResult.Succeeded)
            throw new Exception(string.Join(", ", roleResult.Errors.Select(e => e.Description)));

        return MapToResponse(user);
    }

    public async Task AssignTrainerAsync(AssignTrainerRequest request)
    {
        var trainer = await _userManager.Users
            .OfType<Trainer>()
            .FirstOrDefaultAsync(t => t.Id == request.TrainerId);

        var client = await _userManager.Users
            .OfType<Client>()
            .FirstOrDefaultAsync(c => c.Id == request.ClientId);

        if (trainer == null)
            throw new ArgumentException("Trainer not found.");
        if (client == null)
            throw new ArgumentException("Client not found.");

        // Requiere Client.TrainerId
        client.TrainerId = trainer.Id;

        var updateResult = await _userManager.UpdateAsync(client);
        if (!updateResult.Succeeded)
            throw new Exception(string.Join(", ", updateResult.Errors.Select(e => e.Description)));
    }

    public async Task<Trainer?> GetTrainerByIdAsync(Guid id)
    {
        // Nota: Include puede funcionar si la relación está mapeada por EF
        return await _userManager.Users
            .OfType<Trainer>()
            .Include(t => t.Clients)
            .FirstOrDefaultAsync(t => t.Id == id);
    }


    public async Task<Client?> GetClientByIdAsync(Guid id)
    {
        return await _userManager.Users
            .OfType<Client>()
            .Include(c => c.Trainer)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AssignRoleAsync(User user, string role)
    {
        var result = await _userManager.AddToRoleAsync(user, role);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    private static UserResponse MapToResponse(User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email!,
        Role = u switch
        {
            Client => Domain.Enums.UserRole.Client,
            Trainer => Domain.Enums.UserRole.Trainer,
            _ => Domain.Enums.UserRole.Client
        },
        CreatedAt = u.CreatedAt
    };
    private static TrainerResponse MapToTrainerResponse(Trainer t) => new()
    {
        Id = t.Id,
        FullName = t.FullName,
        Email = t.Email!,
        CreatedAt = t.CreatedAt,
        ClientIds = t.Clients?.Select(c => c.Id).ToList() ?? new List<Guid>(),
        CreatedRoutineIds = t.CreatedRoutines?.Select(r => r.Id).ToList() ?? new List<Guid>()
    };
    public async Task<UserResponse?> AuthenticateAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return null;

        var isValid = await _userManager.CheckPasswordAsync(user, password);
        if (!isValid) return null;

        var roles = await _userManager.GetRolesAsync(user);
        UserRole roleEnum = UserRole.Client; // Valor por defecto

        if (roles.Contains(UserRole.Trainer.ToString()))
            roleEnum = UserRole.Trainer;
        else if (roles.Contains(UserRole.Staff.ToString()))
            roleEnum = UserRole.Staff;
        else if (roles.Contains(UserRole.Admin.ToString()))
            roleEnum = UserRole.Admin;

        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Role = roleEnum,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<TrainerResponse?> GetTrainerResponseByIdAsync(Guid id)
    {
        var trainer = await _userManager.Users
        .OfType<Trainer>()
        .Include(t => t.Clients)
        .Include(t => t.CreatedRoutines)
        .FirstOrDefaultAsync(t => t.Id == id);

        if (trainer == null)
            return null;

        return MapToTrainerResponse(trainer);
    }

    public async Task<IEnumerable<TrainerResponse>> GetAllTrainerResponsesAsync()
    {
        var trainers = await _userManager.Users
        .OfType<Trainer>()
        .Include(t => t.Clients)
        .Include(t => t.CreatedRoutines)
        .ToListAsync();

        return trainers.Select(MapToTrainerResponse);
    }

    public async Task<TrainerResponse> CreateTrainerAsync(CreateTrainerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("FullName is required.");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required.");

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            throw new ArgumentException("Email already exists.");

        
        var trainer = new Trainer
        {
            FullName = request.FullName,
            Email = request.Email,
            UserName = string.IsNullOrWhiteSpace(request.UserName) ? request.Email : request.UserName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(trainer, request.Password);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        var roleName = "Trainer";
        if (!await _roleManager.RoleExistsAsync(roleName))
            await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));

        await _userManager.AddToRoleAsync(trainer, roleName);

        return MapToTrainerResponse(trainer);
    }
}