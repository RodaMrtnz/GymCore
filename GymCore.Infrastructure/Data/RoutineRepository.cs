using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GymCore.Application.Interfaces;
using GymCore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GymCore.Infrastructure.Data
{
    public class RoutineRepository : IRoutineRepository
    {
        private readonly GymCoreDbContext _context;

        public RoutineRepository(GymCoreDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Routine routine)
          => await _context.Set<Routine>().AddAsync(routine);

        public Task DeleteAsync(Routine routine)
        {
            _context.Set<Routine>().Remove(routine);
            return Task.CompletedTask;
        }

        public async Task<List<Routine>> GetAllAsync()
            => await _context.Set<Routine>().ToListAsync();

        public async Task<Routine?> GetByIdAsync(Guid id)
            => await _context.Set<Routine>().FindAsync(id);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
