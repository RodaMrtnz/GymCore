using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Application.DTOs.Routines;

namespace GymCore.Application.Interfaces
{
    public interface IRoutineService
    {
        IEnumerable<RoutineResponse> GetAll();
        
        RoutineResponse? GetById(Guid id);
        RoutineResponse Create(CreateRoutineRequest request);
        
        void AssignRoutine(AssignRoutineRequest request);
    }
}
