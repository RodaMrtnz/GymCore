
using GymCore.Application.DTOs.Users;
using GymCore.Application.Interfaces;
using GymCore.Domain.Entities;

namespace GymCore.Application.Services;

public class UserService : IUserService
{
    // In-memory store (por ahora)
    private static readonly List<User> _users = new();
    private static readonly List<Client> _clients = new();
    private static readonly List<Trainer> _trainers = new();

    public IEnumerable<UserResponse> GetAll()
        => _users.Select(MapToResponse);

    public IEnumerable<TrainerResponse> GetAllTrainers()
        => _trainers.Select(MapToResponse);

    public UserResponse? GetById(Guid id)
        => _users.Where(u => u.Id == id).Select(MapToResponse).FirstOrDefault();

    public UserResponse Create(CreateUserRequest request)
    {

        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("FullName is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.");

        if (_clients.Any(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
            throw new ArgumentException("Email already exists.");

        User user;
        if (request.Role == Domain.Enums.UserRole.Client)
        {
            user = new Client
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                Role = request.Role
            };
            _clients.Add((Client)user);
        }
        else if (request.Role == Domain.Enums.UserRole.Trainer)
        {
            user = new Trainer
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                Role = request.Role
            };
            _trainers.Add((Trainer)user);
        }
        else
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                Role = request.Role
            };
        }
        _users.Add(user);
        return MapToResponse(user);
    }

    private static UserResponse MapToResponse(User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt
    };
    private static TrainerResponse MapToResponse(Trainer t) => new()
    {
        Id = t.Id,
        FullName = t.FullName,
        Email = t.Email,
        Role = t.Role,
        CreatedAt = t.CreatedAt,
        ClientIds = t.Clients.Select(c => c.Id).ToList(),
        CreatedRoutineIds = t.CreatedRoutines.Select(r => r.Id).ToList()
    };

    public void AssignTrainer(AssignTrainerRequest request)
    {
        var trainer = _trainers.FirstOrDefault(t => t.Id == request.TrainerId);
        var client = _clients.FirstOrDefault(c => c.Id == request.ClientId);

        if (trainer == null)
            throw new ArgumentException("Trainer not found.");
        if (client == null)
            throw new ArgumentException("Client not found.");

        if (!trainer.Clients.Any(c => c.Id == client.Id))
            trainer.Clients.Add(client);
    }
}