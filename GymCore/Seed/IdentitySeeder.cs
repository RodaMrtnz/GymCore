using GymCore.Domain.Entities;
using Microsoft.AspNetCore.Identity;

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

    }
    
}