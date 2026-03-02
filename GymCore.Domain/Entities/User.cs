using GymCore.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
namespace GymCore.Domain.Entities;

public class User: IdentityUser<Guid>
{
   
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}