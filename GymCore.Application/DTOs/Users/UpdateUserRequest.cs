namespace GymCore.Application.DTOs.Users;

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? UserName { get; set; }
}