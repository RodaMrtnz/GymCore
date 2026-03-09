using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Domain.Entities;
using GymCore.Application.DTOs.Routines;

namespace GymCore.Application.DTOs.Users
{
    public class ClientResponse
    {
        public Guid Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? TrainerId { get; set; }
        public RoutineResponse? TodaysRoutine { get; set; }
    }
}
