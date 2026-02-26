using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace GymCore.Application.DTOs.Users
{
    public class AssignTrainerRequest
    {
        [Required]
        public Guid ClientId { get; set; }

        [Required]
        public Guid TrainerId { get; set; }
    }
}
