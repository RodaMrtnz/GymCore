
using GymCore.Application.DTOs.Users;
using GymCore.Application.Interfaces;
using GymCore.Domain.Entities;

namespace GymCore.Application.Services;

public class UserService : IUserService
{
    // In-memory store (por ahora)
    private static readonly List<User> _users = new();

    public IEnumerable<UserResponse> GetAll()
        => _users.Select(MapToResponse);

    public UserResponse? GetById(Guid id)
        => _users.Where(u => u.Id == id).Select(MapToResponse).FirstOrDefault();

    public UserResponse Create(CreateUserRequest request)
    {
        
        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException("FullName is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required.");

        if (_users.Any(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
            throw new ArgumentException("Email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            Role = request.Role
        };

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
}