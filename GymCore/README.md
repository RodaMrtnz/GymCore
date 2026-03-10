# GymCore API

GymCore backend built with ASP.NET Core 8, Identity + JWT, and SQL Server (LocalDB).

## Requirements

- .NET SDK 8+
- SQL Server LocalDB (or update the connection string)

## Configuration

File: `appsettings.json`

```json
{
  "ConnectionStrings": {
    "GymCoreDB": "Server=(localdb)\\MSSQLLocalDB;Database=GymCoreDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "Jwt": {
    "Issuer": "tu_issuer",
    "Audience": "tu_audience",
    "Key": "I7v$2pL!9zQw@4eR8sT#1xYc6bN%5uJm"
  }
}
```

## Run the API

From `c:\Users\Usuario\Downloads\GymCore`:

```powershell
dotnet build GymCore\GymCore.sln
dotnet run --project GymCore\GymCore.API.csproj
```

Default Development URLs:

- API: `http://localhost:5156`
- Swagger: `http://localhost:5156/swagger`

## CORS

The API allows frontend dev origins:

- `http://localhost:5173`
- `http://localhost:5174`

## Seed Users

Created automatically on startup (if they do not exist):

- Admin: `admin@example.com` / `Admin123!`
- Staff: `staff@example.com` / `Staff123!`
- Trainer: `trainer@example.com` / `Trainer123!`
- Client: `client@example.com` / `Client123!`

## Login

`POST /api/users/login`

Request body:

```json
{
  "email": "client@example.com",
  "password": "Client123!"
}
```

Response:

```json
{
  "token": "<jwt>"
}
```

Use this token in `Authorization: Bearer <jwt>`.

## Key Roles and Permissions

- Create user: `POST /api/users` -> `Staff, Admin`
- Create trainer: `POST /api/users/trainer` -> `Staff, Admin`
- Assign trainer: `PUT /api/users/assign-trainer` -> `Staff, Admin`
- Update user: `PUT /api/users/{id}` -> `Client, Staff, Admin`
  - `Staff/Admin`: can update any user.
  - `Client`: can only update their own `id` (validated against JWT `sub` claim).
- Get client by id: `GET /api/users/client/{id}` -> `Admin, Staff, Trainer, Client`
  - `Admin/Staff/Trainer`: can query clients.
  - `Client`: can only query their own `id`.

## Serialization Note

To avoid JSON cycles (`Client -> Trainer -> Clients -> ...`),
`GET /api/users/client/{id}` returns `ClientResponse` (a flat DTO), not the full EF entity graph.

## Troubleshooting

### Build Error: DLL files locked (MSB3021 / MSB3027)

If the API is running, it can lock output files and break `dotnet build`.

1. Stop the API process.
2. Build again.

Example:

```powershell
Stop-Process -Id <PID> -Force
dotnet build GymCore\GymCore.sln
```

### NU1603 Warnings

These are package resolution warnings (`8.0.3` -> `8.1.0`) and they do not block execution.