using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GymCore.Domain.Entities
{
    public class Routine
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        public Guid TrainerId { get; set; }
        public Trainer? Trainer { get; set; }
    }
}
