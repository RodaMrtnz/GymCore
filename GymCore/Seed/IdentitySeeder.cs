using GymCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class IdentitySeeder
{
    public static async Task SeedUsersAndRolesAsync(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = { "Client", "Trainer", "Staff", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        var adminEmail = "admin@example.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new User
            {
                UserName = "admin",
                Email = adminEmail,
                FullName = "Admin User",
                CreatedAt = DateTime.UtcNow
            };
            await userManager.CreateAsync(admin, "Admin123!");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Seed Staff user
        var staffEmail = "staff@example.com";
        if (await userManager.FindByEmailAsync(staffEmail) == null)
        {
            var staff = new User
            {
                UserName = "staff",
                Email = staffEmail,
                FullName = "Staff User",
                CreatedAt = DateTime.UtcNow
            };
            await userManager.CreateAsync(staff, "Staff123!");
            await userManager.AddToRoleAsync(staff, "Staff");
        }
        var trainerEmail = "trainer@example.com";
        var existingTrainerUser = await userManager.FindByEmailAsync(trainerEmail);
        var trainerTypedExists = await userManager.Users
            .OfType<Trainer>()
            .AnyAsync(t => t.Email == trainerEmail);

        if (existingTrainerUser != null && !trainerTypedExists)
        {
            await userManager.DeleteAsync(existingTrainerUser);
            existingTrainerUser = null;
        }

        if (existingTrainerUser == null)
        {
            var trainer = new Trainer
            {
                UserName = "trainer",
                Email = trainerEmail,
                FullName = "Trainer User",
                CreatedAt = DateTime.UtcNow,
                CreatedRoutines = new List<Routine>(),
            };
            await userManager.CreateAsync(trainer, "Trainer123!");
            await userManager.AddToRoleAsync(trainer, "Trainer");
        }

        // Seed Client user
        var clientEmail = "client@example.com";
        var existingClientUser = await userManager.FindByEmailAsync(clientEmail);
        var clientTypedExists = await userManager.Users
            .OfType<Client>()
            .AnyAsync(c => c.Email == clientEmail);

        if (existingClientUser != null && !clientTypedExists)
        {
            await userManager.DeleteAsync(existingClientUser);
            existingClientUser = null;
        }

        if (existingClientUser == null)
        {
            var client = new Client
            {
                UserName = "client",
                Email = clientEmail,
                FullName = "Client User",
                CreatedAt = DateTime.UtcNow,
                PreviousRoutines = new List<Routine>(),
            };
            await userManager.CreateAsync(client, "Client123!");
            await userManager.AddToRoleAsync(client, "Client");
        }
    }
    
}