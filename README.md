# Web Reactivas - Sistema de Reservas para Barbería

Una aplicación web reactiva para gestionar reservas de servicios de barbería, construida con React, TypeScript y JSON Server.

## Descripción

Este proyecto consiste en una aplicación full-stack que permite:
- Visualizar servicios disponibles de barbería
- Realizar reservas de citas
- Gestionar horarios y disponibilidad
- Interfaz reactiva con React y TypeScript

## Arquitectura del Proyecto

```
webReactivas/
├── frontend/          # Aplicación React con TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── types/         # Definiciones TypeScript
│   │   ├── api/           # Configuración de API
│   │   └── css/           # Estilos CSS
│   └── package.json
├── backend/           # API Mock con JSON Server
│   ├── db.json           # Base de datos JSON
│   └── package.json
└── README.md
```

## Cómo levantar el proyecto

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jeanpaulduchens/webReactivas.git
   cd webReactivas
   ```

2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Ejecutar el proyecto

El proyecto requiere ejecutar tanto el backend como el frontend simultáneamente.

#### Opción 1: Terminales separadas (Recomendado)

**Terminal 1 - Backend (JSON Server):**
```bash
cd backend
npm run server
```
El servidor estará disponible en: `http://localhost:3001`

**Terminal 2 - Frontend (React):**
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

#### Opción 2: Comandos en background

```bash
# Desde la raíz del proyecto
cd backend && npm run server &
cd frontend && npm run dev
```

### URLs de acceso

- **Frontend (Aplicación principal):** http://localhost:5173
- **Backend (API JSON Server):** http://localhost:3001

## Scripts disponibles

### Frontend
- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción

### Backend
- `npm run server` - Ejecuta JSON Server en el puerto 3001

## Tecnologías utilizadas

### Frontend
- **React 19** - Biblioteca para interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de build y desarrollo
- **React Calendar** - Componente de calendario
- **Axios** - Cliente HTTP para API calls
- **React Router Dom** - Navegación entre rutas

### Backend
- **JSON Server** - API REST mock basada en JSON

## Configuración adicional

### Aliases de importación (Vite)
El proyecto usa aliases para facilitar las importaciones:
- `@` → `./src`
- `@components` → `./src/components`
- `@types` → `./src/types`
- `@api` → `./src/api`
- `@css` → `./src/css`

---

**¿Problemas para levantar el proyecto?**
- Asegúrate de tener Node.js 18+ instalado
- Verifica que los puertos 3001 y 5173 estén disponibles
- Ejecuta `npm install` en ambas carpetas (frontend y backend)
- Si persisten los problemas, revisa la consola para errores específicos
