
using GymCore.Application.DTOs.Users;


namespace GymCore.Application.Interfaces;

public interface IUserService
{
    IEnumerable<UserResponse> GetAll();
    IEnumerable<TrainerResponse> GetAllTrainers();
    UserResponse? GetById(Guid id);
    UserResponse Create(CreateUserRequest request);

    void AssignTrainer(AssignTrainerRequest request);
}