# Sistema de Reservas para Barbería

Sistema web completo para gestión de reservas en una barbería, desarrollado con React + TypeScript en el frontend y Node.js + Express + MongoDB en el backend.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Uso](#uso)

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

## 📡 API Endpoints

### Usuarios

#### Crear Usuario (Registro)

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez",
    "name": "Juan Pérez",
    "email": "juan@mail.com",
    "password": "password123",
    "phone": "123456789",
    "role": "cliente"
  }'
```

**Roles disponibles:**
- `cliente` - Usuario regular que puede hacer reservas
- `barbero` - Barbero que atiende reservas
- `admin` - Administrador del sistema

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

### Frontend

- `npm run dev` - Inicia el servidor de desarrollo de Vite
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

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

## 📄 Licencia

ISC
