
using GymCore.Application.DTOs.Users;
using GymCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;


namespace GymCore.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetAllAsync();
    Task<IEnumerable<TrainerResponse>> GetAllTrainersAsync();
    Task<IEnumerable<UserResponse>> GetAllClientsAsync();
    Task<UserResponse> CreateAsync(CreateUserRequest request);

    Task AssignTrainerAsync(AssignTrainerRequest request);

    Task<Trainer?> GetTrainerByIdAsync(Guid id);

    Task<Client?> GetClientByIdAsync(Guid id);

    Task AssignRoleAsync(User user, string role);

    Task<UserResponse?> AuthenticateAsync(string email, string password);

}