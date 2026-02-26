using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GymCore.Domain.Entities
{
    public class Trainer : User
    {
        public List<Client> Clients { get; set; } = new();
        public List<Routine> CreatedRoutines { get; set; } = new();
    }
}
