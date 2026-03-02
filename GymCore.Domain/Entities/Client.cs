using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GymCore.Domain.Entities
{
    public class Client : User
    {
        public Guid? TrainerId { get; set; }
        public Trainer? Trainer { get; set; }
        public Routine? TodaysRoutine { get; set; }
        public List<Routine> PreviousRoutines { get; set; } = new();
    }
}
