
using GymCore.Application.DTOs.Users;
using GymCore.Domain.Entities;


namespace GymCore.Application.Interfaces;

public interface IUserService
{
    IEnumerable<UserResponse> GetAll();
    IEnumerable<TrainerResponse> GetAllTrainers();
    UserResponse? GetById(Guid id);
    UserResponse Create(CreateUserRequest request);

    void AssignTrainer(AssignTrainerRequest request);
    Trainer? GetTrainerById(Guid id);
    Client? GetClientById(Guid id);
}