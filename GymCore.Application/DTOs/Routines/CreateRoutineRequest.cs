using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace GymCore.Application.DTOs.Routines
{
    public class CreateRoutineRequest
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        public Guid TrainerId { get; set; }
    }
}
