
using GymCore.Application.DTOs.Users;

namespace GymCore.Application.Interfaces;

public interface IUserService
{
    IEnumerable<UserResponse> GetAll();
    UserResponse? GetById(Guid id);
    UserResponse Create(CreateUserRequest request);
}