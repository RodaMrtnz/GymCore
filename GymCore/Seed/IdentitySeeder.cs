using Microsoft.AspNetCore.Identity;

public static class IdentitySeeder
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = { "Client", "Trainer", "Staff", "Admin" };

        foreach (var role in roles)
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
    }
}