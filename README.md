# GymCore

GymCore is a full-stack training management project with:

- A .NET 8 Web API backend (ASP.NET Core + Identity + JWT)
- A React + Vite frontend

## Repository Structure

- `GymCore/` -> Backend API project
- `GymCore.Application/` -> Application layer (services, DTOs, interfaces)
- `GymCore.Domain/` -> Domain entities and enums
- `GymCore.Infrastructure/` -> EF Core infrastructure and data access
- `frontend/gymcore-frontend/` -> Frontend app

## Quick Start

### 1. Backend

From the repository root:

```powershell
dotnet build GymCore\GymCore.sln
dotnet run --project GymCore\GymCore.API.csproj
```

Default local URL:

- `http://localhost:5156`
- Swagger: `http://localhost:5156/swagger`

### 2. Frontend

From `frontend/gymcore-frontend`:

```powershell
npm install
npm run dev
```

Default local URL:

- `http://localhost:5173`

## Documentation

- Backend details, API setup, auth, roles, and troubleshooting:
  See `GymCore/README.md`

## Notes

- CORS is configured for frontend dev origins (`5173`, `5174`).
- Seed users are created at startup in development.
