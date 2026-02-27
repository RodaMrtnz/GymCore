using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Application.Interfaces;
using GymCore.Domain.Entities;
using GymCore.Application.DTOs.Users;
using GymCore.Application.DTOs.Routines;

namespace GymCore.Application.Services
{
    public class RoutineService : IRoutineService
    {
        private readonly IUserService _userService;
        private static readonly List<Routine> _routines = new();


        public RoutineService(IUserService userService)
        {
            _userService = userService;
        }

        public void AssignRoutine(AssignRoutineRequest request)
        {
            var routine = _routines.FirstOrDefault(r => r.Id == request.RoutineId);
            if (routine == null)
                throw new ArgumentException("Routine not found.");

            var trainer = _userService.GetTrainerById(routine.TrainerId);
            if (trainer == null)
                throw new ArgumentException("Trainer not found.");

            var client = trainer.Clients.FirstOrDefault(c => c.Id == request.ClientId);
            if (client == null)
                throw new ArgumentException("Client not assigned to this trainer.");

         
            if (!trainer.CreatedRoutines.Any(r => r.Id == routine.Id))
                throw new ArgumentException("Routine not created by this trainer.");

        
            if (client.TodaysRoutine != null)
                throw new ArgumentException("Client already has a routine assigned for today.");

            client.TodaysRoutine = routine;
        }

        public RoutineResponse Create(CreateRoutineRequest request)
        {
            var trainer = _userService.GetTrainerById(request.TrainerId);
            if (trainer == null)
                throw new ArgumentException("Trainer not found.");

            
            var routine = new Routine
            {
                Id = Guid.NewGuid(),
                Name = request.Nombre,
                Description = request.Descripcion,
                Date = DateTime.UtcNow,
                TrainerId = trainer.Id,
                Trainer = trainer
            };

            _routines.Add(routine);
            trainer.CreatedRoutines.Add(routine);

            return MapToResponse(routine, trainer);
        }
        private static RoutineResponse MapToResponse(Routine routine, Trainer trainer)
        {
            return new RoutineResponse
            {
                Id = routine.Id,
                Name = routine.Name,
                Description = routine.Description,
                TrainerId = routine.TrainerId
            };
        }
        
        }

        public IEnumerable<RoutineResponse> GetAll()
        {
            return _routines.Select(r => MapToResponse(r, _userService.GetTrainerById(r.TrainerId)!));
        }

        public IEnumerable<TrainerResponse> GetAvailableTrainers()
        {
            return _userService.GetAllTrainers();
        }

        public RoutineResponse? GetById(Guid id)
        {
            return _routines.Where(r => r.Id == id)
                .Select(r => MapToResponse(r, _userService.GetTrainerById(r.TrainerId)!))
                .FirstOrDefault();
        }
    }
}
