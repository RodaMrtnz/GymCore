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
        Task<IEnumerable<RoutineResponse>> GetAll();
        
        Task<RoutineResponse?> GetById(Guid id);
        Task<RoutineResponse> Create(CreateRoutineRequest request);
        
        void AssignRoutine(AssignRoutineRequest request);
        Task<IEnumerable<RoutineResponse>> GetMyRoutines(Guid clientId);
        Task<IEnumerable<RoutineResponse>> GetTrainerRoutines(Guid trainerId);

        void Delete(Guid id);

    }
}
