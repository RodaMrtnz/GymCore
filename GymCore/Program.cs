using GymCore.Application.Interfaces;
using GymCore.Application.Services;
using GymCore.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DbContext (IdentityDbContext)
builder.Services.AddDbContext<GymCoreDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GymCoreDB")));

// Identity (necesario para UserManager/RoleManager)
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.User.RequireUniqueEmail = true;
    // opcional: reglas de password
    // options.Password.RequiredLength = 8;
    // options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<GymCoreDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = "tu_issuer",
        ValidAudience = "tu_audience",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("I7v$2pL!9zQw@4eR8sT#1xYc6bN%5uJm"))
    };
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI Application Services
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Seed roles (API layer)
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await IdentitySeeder.SeedRolesAsync(roleManager);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();