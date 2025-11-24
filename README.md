# Sistema de Reservas para Barbería

Sistema web completo para gestión de reservas en una barbería, desarrollado con React + TypeScript en el frontend y Node.js + Express + MongoDB en el backend.

## 📋 Tabla de Contenidos

- [Tema General del Proyecto](#tema-general-del-proyecto)
- [Estructura del Estado Global](#estructura-del-estado-global)
- [Mapa de Rutas y Flujo de Autenticación](#mapa-de-rutas-y-flujo-de-autenticación)
- [Tests E2E](#tests-e2e)
- [Librería de Estilos](#librería-de-estilos)
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Uso](#uso)

## 🎯 Tema General del Proyecto

Este proyecto es un **Sistema de Gestión de Reservas para Barbería** que permite:

- **Clientes**: Registrarse, ver servicios disponibles, hacer reservas seleccionando barbero, fecha y hora, y gestionar sus reservas (ver, cancelar).
- **Barberos**: Ver sus reservas confirmadas del día, editar reservas (cambiar fecha/hora) y cancelar reservas asignadas.
- **Administradores**: Crear y gestionar usuarios (clientes, barberos y otros administradores) desde un panel de administración.

El sistema maneja tres roles principales (`cliente`, `barbero`, `admin`) con diferentes permisos y vistas según el rol del usuario autenticado.

## 🗂️ Estructura del Estado Global

El proyecto utiliza **Zustand** (v5.0.8) como librería de manejo de estado global. Se implementaron tres stores principales:

### 1. `authStore` (`frontend/src/stores/authStore.ts`)
Gestiona el estado de autenticación del usuario:
- **Estado**: `user`, `isAuthenticated`, `csrfToken`, `isLoading`, `error`
- **Acciones**:
  - `login()`: Inicia sesión con credenciales
  - `logout()`: Cierra sesión y limpia el estado
  - `restoreSession()`: Restaura la sesión desde localStorage
  - `setUser()`: Actualiza el usuario actual
  - `clearError()`: Limpia errores
- **Persistencia**: Usa `zustand/middleware/persist` para guardar en `localStorage`

### 2. `reservationsStore` (`frontend/src/stores/reservationsStore.ts`)
Gestiona las reservas tanto para clientes como para barberos:
- **Estado para Clientes**:
  - `clientReservations`: Lista de reservas del cliente
  - `clientLoading`, `clientError`
- **Estado para Barberos**:
  - `barberReservations`: Lista de reservas del barbero por fecha
  - `barberLoading`, `barberError`, `selectedDate`
- **Acciones para Clientes**:
  - `fetchClientReservations()`: Obtiene todas las reservas del cliente
  - `updateClientReservation()`: Actualiza una reserva del cliente
  - `deleteClientReservation()`: Cancela una reserva del cliente
- **Acciones para Barberos**:
  - `fetchBarberReservations(date)`: Obtiene reservas del barbero para una fecha
  - `updateBarberReservation()`: Actualiza una reserva (fecha/hora/estado)
  - `cancelBarberReservation()`: Cancela una reserva asignada al barbero

### 3. `usersStore` (`frontend/src/stores/usersStore.ts`)
Gestiona los usuarios en el panel de administración:
- **Estado**: `users`, `loading`, `error`, `successMessage`
- **Acciones**:
  - `fetchUsers()`: Obtiene todos los usuarios
  - `createUser()`: Crea un nuevo usuario (solo admin)
  - `clearError()`, `clearSuccess()`: Limpia mensajes

Todos los stores se exportan desde `frontend/src/stores/index.ts` para facilitar su importación.

## 🗺️ Mapa de Rutas y Flujo de Autenticación

### Rutas Públicas
- `/` - Página principal (lista de servicios)
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios (solo clientes)

### Rutas Protegidas (Requieren Autenticación)
- `/reservas` - Crear una nueva reserva
  - Protegida por `ProtectedRoute`
  - Requiere usuario autenticado (cualquier rol)
- `/mis-reservas` - Ver y gestionar reservas propias
  - Protegida por `ProtectedRoute`
  - Vista diferente según el rol:
    - **Cliente**: Lista todas sus reservas con opción de cancelar
    - **Barbero**: Vista de calendario con reservas del día seleccionado, permite editar y cancelar

### Rutas de Administración (Requieren Rol Admin)
- `/admin/usuarios` - Panel de administración de usuarios
  - Protegida por `AdminRoute`
  - Permite crear usuarios con cualquier rol (cliente, barbero, admin)
  - Lista todos los usuarios del sistema

### Flujo de Autenticación

1. **Inicio de Sesión**:
   - Usuario ingresa credenciales en `/login`
   - Backend valida y retorna JWT token + CSRF token
   - `authStore.login()` guarda tokens y datos del usuario
   - Redirección a página principal o ruta protegida solicitada

2. **Protección de Rutas**:
   - `ProtectedRoute` verifica `isAuthenticated` del `authStore`
   - Si no está autenticado, redirige a `/login`
   - `AdminRoute` además verifica que `user.role === 'admin'`

3. **Restauración de Sesión**:
   - Al cargar la app, `AppWithAuth` llama a `restoreSession()`
   - Verifica tokens en `localStorage` y valida con el backend
   - Si la sesión es válida, restaura el estado de autenticación

4. **Cierre de Sesión**:
   - `authStore.logout()` limpia tokens y estado
   - Elimina datos de `localStorage`
   - Redirige a página principal

### Componentes de Protección
- `ProtectedRoute`: Verifica autenticación, redirige a `/login` si no está autenticado
- `AdminRoute`: Verifica autenticación Y rol admin, redirige a `/` si no es admin

## 🧪 Tests E2E

### Herramienta Utilizada
El proyecto utiliza **Playwright** para tests end-to-end. Los tests se encuentran en la carpeta `e2etests/` y se ejecutan de forma independiente.

### Configuración
- **Base URL**: `http://localhost:5173` (frontend)
- **Web Server**: Configurado para iniciar automáticamente backend (puerto 3001) y frontend (puerto 5173)
- **Navegadores**: Chromium, Firefox, WebKit (configurables)

### Flujos Cubiertos

#### 1. Login y Acceso Protegido (`e2etests/tests/login.spec.ts`)
- ✅ **Redirección a login**: Verifica que al acceder a rutas protegidas sin autenticación, se redirige a `/login`
- ✅ **Credenciales inválidas**: Prueba el manejo de errores con credenciales incorrectas
- ✅ **Login exitoso**: Valida el flujo completo de login y redirección a página principal
- ✅ **Acceso a rutas protegidas**: Verifica que después del login se puede acceder a rutas protegidas
- ✅ **Persistencia de sesión**: Comprueba que la sesión se mantiene al recargar la página

#### 2. CRUD de Reservas (`e2etests/tests/reservations-crud.spec.ts`)
- ✅ **CREATE**: Crea una nueva reserva desde la UI (selecciona servicio, barbero, fecha y hora)
- ✅ **READ**: Lista las reservas del usuario autenticado
- ✅ **UPDATE**: Actualiza una reserva existente (cambia hora y estado)
- ✅ **DELETE**: Elimina una reserva existente
- ✅ **Flujo completo**: Ejecuta un flujo completo de CRUD en la UI

### Ejecución de Tests
```bash
cd e2etests
npm install
npm test              # Ejecuta todos los tests en modo headless
npm run test:ui       # Abre la UI de Playwright
npm run test:headed   # Ejecuta con navegador visible
npm run test:debug    # Modo debug con inspector
```

Los tests crean usuarios de prueba automáticamente y esperan a que los servidores estén listos antes de ejecutarse.

## 🎨 Librería de Estilos

### Tailwind CSS v4
El proyecto utiliza **Tailwind CSS v4.1.17** como framework de estilos utilitarios.

### Configuración Personalizada
El tema se define en `frontend/src/style.css` y `frontend/tailwind.config.js`:

```css
@theme {
  --color-primary: #1e3a8a;        /* Azul principal */
  --color-primary-600: #1f4aa6;     /* Azul más oscuro para hover */
  --color-muted: #6b7280;          /* Gris para texto secundario */
  --color-bg: #f5f6fa;             /* Fondo gris claro */
  --radius-card: 14px;             /* Radio de borde para tarjetas */
  --shadow-card: 0 6px 18px rgba(16, 24, 40, 0.08); /* Sombra suave */
}
```

### Decisiones de Diseño

1. **Sistema de Colores**:
   - **Primario**: Azul (`#1e3a8a`) para botones principales y elementos destacados
   - **Muted**: Gris para texto secundario y elementos deshabilitados
   - **Estados**: Verde para confirmado, rojo para cancelado, amarillo para pendiente

2. **Componentes Reutilizables**:
   - Tarjetas con `rounded-card` (14px) y `shadow-card` para profundidad
   - Botones con estados hover usando `primary-600`
   - Inputs con focus states usando `border-indigo-300` y sombras

3. **Layout**:
   - Grid system de Tailwind para layouts responsivos
   - Espaciado consistente usando las utilidades de Tailwind
   - Diseño mobile-first

4. **Tipografía**:
   - Tamaños de fuente escalables usando clases de Tailwind
   - Pesos de fuente: `font-bold` para títulos, `font-semibold` para subtítulos

5. **Interactividad**:
   - Transiciones suaves en botones y elementos interactivos
   - Estados hover claramente definidos
   - Feedback visual inmediato en acciones del usuario

## 🔧 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- MongoDB (v6 o superior)

## 📁 Estructura del Proyecto

```
.
├── backend/          # API REST con Express y TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
└── frontend/         # Aplicación React con TypeScript
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   └── types/
    └── package.json
```

## 📦 Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## ⚙️ Configuración

### Backend

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
HOST=localhost
PORT=3001
MONGODB_URI=mongodb://localhost:27017/myapp
MONGODB_DBNAME=mybarbershop
JWT_SECRET=tu-secreto-super-seguro-cambia-en-produccion
```

### Frontend

El frontend está configurado para conectarse al backend en `http://localhost:3001` por defecto. Si necesitas cambiar esto, modifica las configuraciones en los archivos de la carpeta `src/api/`.

## 🚀 Ejecución

### Paso 1: Iniciar MongoDB

Asegúrate de que MongoDB esté ejecutándose:

```bash
# Linux/Mac
sudo systemctl start mongod

# O si usas Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Paso 2: Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Paso 3: Iniciar el Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

## 🚧 Build

```bash
cd backend
npm run build:ui
npm run build
npm start
```


## 📡 API Endpoints

### Usuarios

#### Crear Usuario (Registro Público - Solo Clientes)

Este endpoint solo permite crear usuarios con rol `cliente`. Para crear barberos o admins, usar el endpoint `/api/users/admin`.

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez",
    "name": "Juan Pérez",
    "email": "juan@mail.com",
    "password": "password123",
    "phone": "123456789"
  }'
```

**Nota:** El rol siempre será `cliente` para este endpoint, incluso si se intenta especificar otro rol.

#### Crear el Primer Administrador

Este endpoint solo funciona si NO existe ningún admin en el sistema. Úsalo para crear el primer administrador.

```bash
curl -X POST http://localhost:3001/api/users/first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "name": "Administrador Principal",
    "email": "admin@mail.com",
    "password": "password123",
    "phone": "123456789"
  }'
```

**Nota:** Este endpoint solo funciona una vez. Después de crear el primer admin, debes usar `/api/users/admin` con autenticación.

#### Crear Usuario como Admin (Requiere Autenticación Admin)

Este endpoint permite a los administradores crear usuarios con cualquier rol (cliente, barbero, admin).

```bash
curl -X POST http://localhost:3001/api/users/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "X-CSRF-Token: TU_CSRF_TOKEN" \
  -d '{
    "username": "barbero1",
    "name": "Barbero Ejemplo",
    "email": "barbero@mail.com",
    "password": "password123",
    "phone": "123456789",
    "role": "barbero"
  }'
```

**Roles disponibles:**
- `cliente` - Usuario regular que puede hacer reservas
- `barbero` - Barbero que atiende reservas (solo puede ser creado por admin)
- `admin` - Administrador del sistema (solo puede ser creado por otro admin)

**Requisitos:**
- Debes estar autenticado como `admin`
- El token JWT debe estar en las cookies
- El CSRF token debe estar en el header `X-CSRF-Token`

#### Login

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez",
    "password": "password123"
  }'
```

Respuesta de ejemplo:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "juanperez",
  "name": "Juan Pérez",
  "role": "cliente"
}
```

### Servicios

#### Obtener todos los servicios

```bash
curl http://localhost:3001/api/services
```

### Reservas

#### Crear una reserva (requiere autenticación)

```bash
curl -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "serviceId": "ID_DEL_SERVICIO",
    "barberId": "ID_DEL_BARBERO",
    "date": "2025-10-25",
    "time": "14:00"
  }'
```

#### Obtener mis reservas (requiere autenticación)

```bash
curl http://localhost:3001/api/reservations \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

### Horarios

#### Obtener horarios disponibles de un barbero

```bash
curl http://localhost:3001/api/hours?barberId=ID_DEL_BARBERO&date=2025-10-25
```

## 🎯 Uso

### Flujo de Usuario Cliente

1. **Registro**: Crear una cuenta con rol "cliente"
2. **Login**: Iniciar sesión para obtener el token JWT
3. **Ver Servicios**: Explorar los servicios disponibles
4. **Hacer Reserva**: Seleccionar servicio, barbero, fecha y hora
5. **Ver Mis Reservas**: Consultar las reservas realizadas

### Ejemplo Completo con curl

```bash
# 1. Crear usuario
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "maria",
    "name": "María García",
    "email": "maria@mail.com",
    "password": "segura123",
    "phone": "987654321",
    "role": "cliente"
  }'

# 2. Hacer login y guardar el token
TOKEN=$(curl -s -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "maria",
    "password": "segura123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Ver servicios disponibles
curl http://localhost:3001/api/services

# 4. Crear una reserva (usando el token obtenido)
curl -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "serviceId": "SERVICE_ID_AQUI",
    "barberId": "BARBER_ID_AQUI",
    "date": "2025-10-25",
    "time": "15:00"
  }'

# 5. Ver mis reservas
curl http://localhost:3001/api/reservations \
  -H "Authorization: Bearer $TOKEN"
```

## 🛠️ Scripts Disponibles

### Backend

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run build` - Compila el código TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm test` - Ejecuta los tests
- `npm run build:ui` - Buildea el frontend y lo deja en `dist`

### Frontend

- `npm run dev` - Inicia el servidor de desarrollo de Vite
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🧪 Tests E2E

El proyecto incluye tests end-to-end (E2E) implementados con **Playwright** que validan el funcionamiento completo de la aplicación.

### Casos Cubiertos

Los tests se encuentran en la carpeta `e2etests/` y cubren los siguientes casos mínimos:

1. **Login + Acceso Protegido** (`e2etests/tests/login.spec.ts`)
   - Redirección a login cuando se accede a ruta protegida sin autenticación
   - Manejo de credenciales inválidas
   - Login exitoso y acceso a rutas protegidas
   - Persistencia de sesión

2. **CRUD sobre Reservas** (`e2etests/tests/reservations-crud.spec.ts`)
   - **CREATE**: Crear una nueva reserva desde la UI
   - **READ**: Listar las reservas del usuario
   - **UPDATE**: Actualizar una reserva existente
   - **DELETE**: Eliminar una reserva existente
   - Flujo completo de CRUD en la UI

### Ejecución Rápida

```bash
cd e2etests
npm install
npm test
```

### Comandos Disponibles

- `npm test` - Ejecuta todos los tests en modo headless
- `npm run test:ui` - Abre la interfaz gráfica de Playwright (recomendado para desarrollo)
- `npm run test:headed` - Ejecuta con el navegador visible
- `npm run test:debug` - Modo debug con Playwright Inspector
- `npm run test:report` - Ver el reporte HTML de la última ejecución

### Configuración

Los tests están configurados para:
- Iniciar automáticamente el backend (puerto 3001) y frontend (puerto 5173)
- Ejecutarse en Chromium por defecto
- Generar reportes HTML con screenshots en caso de fallos

**Para información detallada sobre los tests E2E, configuración avanzada, debugging y solución de problemas, consulta el [README de e2etests](e2etests/README.md).**

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas usando bcrypt
- Las rutas protegidas requieren un token JWT válido
- El token se envía en el header `Authorization: Bearer <token>`
- Cambia el `JWT_SECRET` en producción por un valor seguro

## 📝 Notas Adicionales

- El backend incluye un sistema de seed para servicios iniciales
- Los tokens JWT expiran según la configuración del servidor
- Asegúrate de tener MongoDB corriendo antes de iniciar el backend
- En desarrollo, CORS está configurado para aceptar peticiones del frontend

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Deploy
fullstack.dcc.uchile.cl:7130

## 📄 Licencia

ISC
