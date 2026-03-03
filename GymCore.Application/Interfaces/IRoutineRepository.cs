using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Domain.Entities;

namespace GymCore.Application.Interfaces
{
    public interface IRoutineRepository
    {
        Task<Routine?> GetByIdAsync(Guid id);
        Task<List<Routine>> GetAllAsync();
        Task AddAsync(Routine routine);
        Task DeleteAsync(Routine routine);
        Task SaveChangesAsync();
    }
}
