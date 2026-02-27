using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Application.Interfaces;
using GymCore.Domain.Entities;
using GymCore.Application.DTOs.Users;

namespace GymCore.Application.Services
{
    public class RoutineService : IRoutineService
    {
        private readonly IUserService _userService;

        public RoutineService(IUserService userService)
        {
            _userService = userService;
        }

        public IEnumerable<TrainerResponse> GetAvailableTrainers()
        {
            return _userService.GetAllTrainers();
        }

    }
}
