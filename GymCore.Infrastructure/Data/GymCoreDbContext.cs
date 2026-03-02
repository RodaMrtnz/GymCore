using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using GymCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;

public class GymCoreDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public GymCoreDbContext(DbContextOptions<GymCoreDbContext> options)
        : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Discriminator (TPH) para User / Client / Trainer
        builder.Entity<User>()
            .HasDiscriminator<string>("UserType")
            .HasValue<User>("User")
            .HasValue<Client>("Client")
            .HasValue<Trainer>("Trainer");

        builder.Entity<User>()
             .Property("UserType")
             .HasMaxLength(20);
        builder.Entity<User>()
            .HasIndex("UserType");

        builder.Entity<Trainer>()
            .HasMany(t => t.Clients)
            .WithOne(c => c.Trainer)
            .HasForeignKey(c => c.TrainerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Trainer> Trainers => Set<Trainer>();
    public async Task SeedRoles(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = { "Client", "Trainer", "Staff", "Admin" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }
    // Agrega tus DbSet personalizados aquí cuando los modelos estén listos
}
