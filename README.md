# MuniGO — Frontend

SPA municipal para la gestión de trámites, citas, inspecciones y notificaciones del Area de Desarrollo Económico y la Subgerencia de Comercialización de los Olivos.

## Despliegue

- **URL**: https://munigo-frontend-production.up.railway.app/
- **Plataforma**: Railway

## Stack

- **React** 19.2
- **TypeScript** 6.0
- **Vite** 8.1
- **Tailwind CSS** v4
- **React Router** v7
- **Supabase JS** (almacenamiento de documentos)
- **pnpm** (gestor de paquetes)

## Estructura del proyecto

```
munigo-frontend/
├── src/
│   ├── main.tsx                 # Entry point (ErrorBoundary > Router > AuthProvider)
│   ├── App.tsx                  # Definición de rutas
│   ├── index.css                # Tokens de diseño Tailwind v4
│   ├── types/                   # Tipos TypeScript (auth, procedure, appointment, organization, notification)
│   ├── contexts/                # React Contexts (AuthContext)
│   ├── hooks/                   # Hooks personalizados (useAuth)
│   ├── lib/                     # Cliente API, servicios, cliente Supabase
│   ├── layouts/                 # MainLayout, DashboardLayout, AuthLayout
│   ├── components/              # Componentes compartidos (Sidebar, ProtectedRoute, ErrorBoundary, etc.)
│   │   ├── procedures/          # CaseFileCard, CaseFileModal, etc.
│   │   ├── appointments/        # AppointmentCard, CancelAppointmentModal, RescheduleModal
│   │   ├── organizations/       # CompanyCard, EstablishmentCard, etc.
│   │   └── notifications/       # NotificationCard, NotificationEmptyState
│   └── pages/                   # Páginas organizadas por rol
│       ├── home/                # Home (landing)
│       ├── auth/                # Login, Register
│       ├── citizen/             # Tramites, CaseFileDetail, Appointments, Notifications, Organizations
│       ├── employee/            # Panel, CaseFileReview, Historial, InspectorPanel, AppointmentCalendar
│       └── manager/             # ManagerDashboard, ManagerCaseFiles, ManagerEmployees, ManagerRequirements
├── public/                      # Assets estáticos (logo, icono)
├── nginx.conf                   # Configuración nginx para SPA
├── Dockerfile                   # Build multi-stage (Node 22 + nginx)
├── vite.config.ts               # Vite + React + Tailwind + proxy
└── index.html                   # Entry HTML (lang="es", título "MuniGO")
```

## Rutas por rol

### Ciudadano

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/tramites` | Tramites | Lista de expedientes del ciudadano |
| `/tramites/:id` | CaseFileDetail | Detalle de expediente con requisitos, documentos y descarga de licencia |
| `/appointments` | Appointments | Gestión de citas (confirmar, cancelar, reprogramar) |
| `/notifications` | Notifications | Notificaciones del ciudadano |
| `/organizations` | Organizations | Empresas y establecimientos |

### Funcionario

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/panel` | Panel | Revisión de expedientes pendientes |
| `/panel/:id` | CaseFileReview | Revisión detallada de un expediente |
| `/historial-tramites` | Historial | Historial de expedientes |
| `/calendario` | AppointmentCalendar | Calendario de citas |

### Inspector

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/inspector` | InspectorPanel | Inspecciones asignadas |
| `/inspector/:id` | InspectionDetail | Detalle de inspección |
| `/historial-inspecciones` | InspectionHistory | Historial de inspecciones |
| `/calendario` | AppointmentCalendar | Calendario de citas |

### Gerente

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/gerente/dashboard` | ManagerDashboard | Dashboard con estadísticas |
| `/gerente/expedientes` | ManagerCaseFiles | Gestión de expedientes |
| `/gerente/expedientes/:id` | ManagerCaseFileDetail | Detalle de expediente con descarga de licencia |
| `/gerente/empleados` | ManagerEmployees | Gestión de empleados (CRUD) |
| `/gerente/requisitos` | ManagerRequirements | Gestión de requisitos por tipo de trámite |

### Públicas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Home | Landing page |
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro de ciudadano |
| `/unauthorized` | Unauthorized | Acceso no autorizado |

## Autenticación

### Flujo JWT

1. El ciudadano se autentica con **tipo de documento + número de documento + contraseña**
2. El backend retorna `access_token` (1h) y `refresh_token` (7d)
3. Los tokens se almacenan en `localStorage`
4. Cada petición API incluye `Authorization: Bearer <access_token>`
5. Si se recibe un 401, se intenta renovar el token automáticamente con el refresh token
6. Si la renovación fallia, se redirige al login

### Componentes de protección

- **`GuestRoute`**: Solo accesible para usuarios no autenticados (login/register). Si ya está autenticado, redirige a `/`.
- **`ProtectedRoute`**: Requiere autenticación. Accepta `allowedRoles` y `allowedPositions` para controlar acceso por rol y posición.
- **`ErrorBoundary`**: Captura errores de renderizado y muestra una UI de error amigable.

## Servicios API

Todos los servicios usan el helper `apiRequest<T>()` que adjunta automáticamente el JWT y maneja la renovación de tokens.

| Servicio | Funciones principales |
|----------|----------------------|
| `auth.service.ts` | `register`, `login`, `logout`, `getMe` |
| `case-file.service.ts` | CRUD de expedientes, `submit`, `uploadDocument` (Supabase), `getRequirements`, `downloadLicense` |
| `company.service.ts` | CRUD de empresas, `searchCompanies`, `addCitizenToCompany` |
| `establishment.service.ts` | CRUD de establecimientos |
| `employee.service.ts` | CRUD de empleados, `getPendingReview`, `getDashboard`, `assignInspector`, `approveDocuments`, `setCaseFileStatus` |
| `appointment.service.ts` | `getAll`, `confirm`, `cancel`, `reschedule`, `respondReschedule`, `getAvailableSlots`, `getCalendar` |
| `inspection.service.ts` | `getMyInspections`, `getInspectionHistory`, `completeInspection` |
| `notification.service.ts` | `getAll`, `markAsRead`, `markAllAsRead` |
| `requirement.service.ts` | CRUD de requisitos por tipo de trámite |

## Subida de documentos

Los documentos se suben directamente a **Supabase Storage** desde el navegador:

1. El ciudadano selecciona un archivo (PDF, PNG o JPEG, máx. 20MB)
2. Se sube al bucket `documents` de Supabase en la ruta `documents/{procedureRequirementId}/{timestamp}_{filename}`
3. Se obtiene la URL pública del archivo
4. Se registra la URL en el backend vía la API

El bucket `documents` es **público** (lectura sin autenticación) y tiene una política de escritura que permite a cualquier usuario autenticado subir archivos.

## Desarrollo local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
copy .env.example .env         # Editar con tus valores

# 3. Iniciar servidor de desarrollo
pnpm dev
```

El servidor de desarrollo estará disponible en `http://localhost:5173`.

### Proxy al backend

Vite está configurado para proxitar las peticiones `/api` y `/media` a `http://localhost:8080` (el backend Django).

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true },
    '/media': { target: 'http://localhost:8080', changeOrigin: true },
  },
}
```

En producción, el frontend llama directamente al backend usando `VITE_API_URL` (las peticiones no pasan por nginx).

## Variables de entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `VITE_API_URL` | URL base del backend (sin `/api`) | No | `/api` (relativo, usa proxy en dev) |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | Sí | — |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Sí | — |
| `PORT` | Puerto de nginx (en Docker) | No | `80` |

> **Importante:** Las variables `VITE_*` se inyectan como `ARG`/`ENV` en el Dockerfile porque Vite las ingesta en tiempo de compilación.

## Docker

El frontend usa un **build multi-stage**:

1. **Etapa de build**: Node 22 Alpine + pnpm → `pnpm build` → genera `dist/`
2. **Etapa de producción**: nginx Alpine → sirve `dist/` con SPA routing

```bash
# Construir imagen
docker build \
  --build-arg VITE_API_URL=https://tu-backend.railway.app \
  --build-arg VITE_SUPABASE_URL=https://tu-proyecto.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=tu-clave-anon \
  -t munigo-frontend .

# Ejecutar
docker run -p 80:80 munigo-frontend
```

### nginx.conf

- `try_files $uri $uri/ /index.html` — SPA fallback para rutas del cliente
- Archivos estáticos (JS, CSS, imágenes, fuentes) se cachean por 1 año con `Cache-Control: public, immutable`

## Code quality

| Herramienta | Uso |
|-------------|-----|
| **ESLint** 10 | Linting con `typescript-eslint` y `react-hooks` |
| **oxlint** | Linting rápido con plugins React + TypeScript + OXC |
| **Prettier** | Formateo: sin punto y coma, comillas simples, trailing commas, 100 chars, 2 espacios |

```bash
pnpm lint        # Verificar lint
pnpm lint:fix    # Auto-fix
pnpm format      # Formatear con Prettier
pnpm build       # Type-check + build de producción
```

## Tema personalizado (Tailwind v4)

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #0B508C;        /* Azul principal */
  --color-primary-hover: #094070;  /* Azul hover */
  --color-accent: #F26B1D;         /* Naranja acento */
  --color-surface: #F0F2F5;        /* Gris claro fondo */
  --color-txt: #1C1C1E;           /* Texto oscuro */
  --color-txt-muted: #6B6B6F;     /* Texto secundario */
  --color-border: #E2E2E4;        /* Bordes */
}
```
