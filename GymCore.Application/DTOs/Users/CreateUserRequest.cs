using System.ComponentModel.DataAnnotations;
using GymCore.Domain.Enums;

namespace GymCore.Application.DTOs.Users;

public class CreateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    [Required]
    public string Email { get; set; } = string.Empty;
    [Required]
    public UserRole Role { get; set; } = UserRole.Client;
}