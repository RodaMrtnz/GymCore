using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Domain.Enums;

namespace GymCore.Application.DTOs.Users
{
    public class TrainerResponse
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Trainer;
        public DateTime CreatedAt { get; set; }
        public List<Guid> ClientIds { get; set; } = new(); // IDs de los clientes asignados
        public List<Guid> CreatedRoutineIds { get; set; } = new(); // IDs de rutinas creadas
    }
}
