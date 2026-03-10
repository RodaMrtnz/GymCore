# GymCore API

Backend de GymCore construido con ASP.NET Core 8, Identity + JWT y SQL Server (LocalDB).

## Requisitos

- .NET SDK 8+
- SQL Server LocalDB (o cambiar connection string)

## Configuracion

Archivo: `appsettings.json`

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

## Levantar API

Desde `c:\Users\Usuario\Downloads\GymCore`:

```powershell
dotnet build GymCore\GymCore.sln
dotnet run --project GymCore\GymCore.API.csproj
```

Por defecto en Development:

- API: `http://localhost:5156`
- Swagger: `http://localhost:5156/swagger`

## CORS

La API permite origenes de frontend:

- `http://localhost:5173`
- `http://localhost:5174`

## Usuarios seed

Se crean automaticamente al iniciar (si no existen):

- Admin: `admin@example.com` / `Admin123!`
- Staff: `staff@example.com` / `Staff123!`
- Trainer: `trainer@example.com` / `Trainer123!`
- Client: `client@example.com` / `Client123!`

## Login

`POST /api/users/login`

Body:

```json
{
	"email": "client@example.com",
	"password": "Client123!"
}
```

Respuesta:

```json
{
	"token": "<jwt>"
}
```

Usar ese token en `Authorization: Bearer <jwt>`.

## Roles y permisos clave

- Crear usuario: `POST /api/users` -> `Staff, Admin`
- Crear trainer: `POST /api/users/trainer` -> `Staff, Admin`
- Asignar trainer: `PUT /api/users/assign-trainer` -> `Staff, Admin`
- Editar usuario: `PUT /api/users/{id}` -> `Client, Staff, Admin`
	- `Staff/Admin`: pueden editar cualquier usuario.
	- `Client`: solo puede editar su propio `id` (se valida contra claim `sub` del JWT).
- Ver client por id: `GET /api/users/client/{id}` -> `Admin, Staff, Trainer, Client`
	- `Admin/Staff/Trainer`: pueden consultar.
	- `Client`: solo su propio `id`.

## Nota sobre serializacion

Para evitar ciclos de serializacion (`Client -> Trainer -> Clients -> ...`),
`GET /api/users/client/{id}` devuelve `ClientResponse` (DTO plano), no la entidad EF completa.

## Troubleshooting

### Error en build: archivos DLL bloqueados (MSB3021 / MSB3027)

Si tenes una API corriendo, puede bloquear archivos de salida y romper la build.

1. Cerrar el proceso de la API.
2. Volver a compilar.

Ejemplo:

```powershell
Stop-Process -Id <PID> -Force
dotnet build GymCore\GymCore.sln
```

### Warnings NU1603

Son advertencias de resolucion de version (`8.0.3` -> `8.1.0`) y no impiden ejecutar.