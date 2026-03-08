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
        private readonly IRoutineRepository _routineRepository;


        public RoutineService(IUserService userService, IRoutineRepository routineRepository)
        {

            _userService = userService;
            _routineRepository = routineRepository;
        }

        public async Task AssignRoutine(AssignRoutineRequest request)
        {
            var routine = await _routineRepository.GetByIdAsync(request.RoutineId);
            if (routine == null)
                throw new ArgumentException("Routine not found.");

            var trainer = await _userService.GetTrainerByIdAsync(routine.TrainerId);
            if (trainer == null)
                throw new ArgumentException("Trainer not found.");

            var client = trainer.Clients.FirstOrDefault(c => c.Id == request.ClientId);
            if (client == null)
                throw new ArgumentException("Client not assigned to this trainer.");


            if (!trainer.CreatedRoutines.Any(r => r.Id == routine.Id))
                throw new ArgumentException("Routine not created by this trainer.");

            if (client.TodaysRoutine != null && client.TodaysRoutine.Date.Date != DateTime.UtcNow.Date)
            {
                client.PreviousRoutines.Add(client.TodaysRoutine);
                client.TodaysRoutine = null;
            }
            if (client.TodaysRoutine != null && client.TodaysRoutine.Date.Date == DateTime.UtcNow.Date)
                throw new ArgumentException("Client already has a routine assigned for today.");

            routine.Date = DateTime.UtcNow;
            client.TodaysRoutine = routine;

            await _routineRepository.SaveChangesAsync();
        }

        public async Task<RoutineResponse> Create(CreateRoutineRequest request)
        {
            var trainer = await _userService.GetTrainerByIdAsync(request.TrainerId);
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

            await _routineRepository.AddAsync(routine);
            await _routineRepository.SaveChangesAsync();
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
                Date = routine.Date,
                TrainerId = routine.TrainerId
            };
        }


        public async Task<IEnumerable<RoutineResponse>> GetAll()
        {
            var routines = await _routineRepository.GetAllAsync();
            var trainers = await _userService.GetAllTrainersAsync();
            var responses = await Task.WhenAll(routines.Select(async r =>
            {
                var trainer = await _userService.GetTrainerByIdAsync(r.TrainerId);
                return MapToResponse(r, trainer!);
            }));

            return responses;
        }


        public async Task<RoutineResponse?> GetById(Guid id)
        {
            var rutine = await _routineRepository.GetByIdAsync(id);
            if (rutine == null)
                return null;
            var trainer = await _userService.GetTrainerByIdAsync(rutine.TrainerId);
            return MapToResponse(rutine, trainer!);

        }

        public async Task<IEnumerable<RoutineResponse>> GetMyRoutines(Guid clientId)
        {
            var client = await _userService.GetClientByIdAsync(clientId);
            if (client == null)
                throw new ArgumentException("Client not found.");
            var routines = client.PreviousRoutines;
            var responses = await Task.WhenAll(routines.Select(async r =>
            {
                var trainer = await _userService.GetTrainerByIdAsync(r.TrainerId);
                return MapToResponse(r, trainer!);
            }));

            return responses;

        }

        public async Task<IEnumerable<RoutineResponse>> GetTrainerRoutines(Guid trainerId)
        {
            var trainer = await _userService.GetTrainerByIdAsync(trainerId);
            if (trainer == null)
                throw new ArgumentException("Trainer not found.");

            var routines = (await _routineRepository.GetAllAsync())
                .Where(r => r.TrainerId == trainerId)
                .ToList();

            var responses = routines.Select(r => MapToResponse(r, trainer)).ToList();
            return responses;
        }

        public async Task Delete(Guid id)
        {
            var routine = await _routineRepository.GetByIdAsync(id);
            if (routine == null)
                throw new ArgumentException("Routine not found.");
            var trainer = await _userService.GetTrainerByIdAsync(routine.TrainerId);
            if (trainer != null)
                trainer.CreatedRoutines.RemoveAll(r => r.Id == routine.Id);
            await _routineRepository.DeleteAsync(routine);
            await _routineRepository.SaveChangesAsync();
        }

    }
}
