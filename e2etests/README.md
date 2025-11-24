# Tests E2E con Playwright

Este directorio contiene los tests end-to-end (E2E) del sistema de reservas de barbería, implementados con [Playwright](https://playwright.dev/).

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecutar los Tests](#ejecutar-los-tests)
- [Tests Implementados](#tests-implementados)
- [Configuración](#configuración)
- [Debugging](#debugging)
- [Solución de Problemas](#solución-de-problemas)
- [Mejores Prácticas](#mejores-prácticas)

## 🔧 Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **MongoDB** corriendo (localmente o con Docker)
- Backend y Frontend del proyecto configurados y funcionando

## 📦 Instalación

```bash
cd e2etests
npm install
```

Esto instalará Playwright y sus dependencias, incluyendo los navegadores necesarios (Chromium, Firefox, WebKit).

## 🚀 Ejecutar los Tests

### Ejecutar todos los tests (modo headless)

```bash
npm test
```

Este comando:
- Iniciará automáticamente el backend (puerto 3001) y frontend (puerto 5173)
- Ejecutará todos los tests E2E en modo headless
- Generará un reporte HTML con los resultados

### Ejecutar tests en modo UI (recomendado para desarrollo)

```bash
npm run test:ui
```

Abre una interfaz gráfica donde puedes:
- Ver los tests en tiempo real
- Ejecutar tests individuales
- Ver screenshots y videos de las ejecuciones
- Depurar tests fácilmente

### Ejecutar tests con el navegador visible

```bash
npm run test:headed
```

Útil para ver qué está haciendo el navegador durante la ejecución.

### Ejecutar tests en modo debug

```bash
npm run test:debug
```

Abre Playwright Inspector para depurar paso a paso.

### Ver el reporte HTML de la última ejecución

```bash
npm run test:report
```

Abre el reporte HTML interactivo con los resultados de la última ejecución.

## 🧪 Tests Implementados

### 1. Login y Acceso Protegido (`tests/login.spec.ts`)

Cubre el flujo completo de autenticación y protección de rutas:

- ✅ **Redirección a login**: Verifica que al acceder a rutas protegidas sin autenticación, se redirige automáticamente a `/login`
- ✅ **Credenciales inválidas**: Prueba el manejo de errores con credenciales incorrectas
- ✅ **Login exitoso**: Valida el flujo completo de login y redirección a página principal
- ✅ **Acceso a rutas protegidas**: Verifica que después del login se puede acceder a rutas protegidas
- ✅ **Persistencia de sesión**: Comprueba que la sesión se mantiene al recargar la página

**Cobertura técnica:**
- Validación de rutas protegidas con `ProtectedRoute`
- Flujo completo de autenticación con JWT y CSRF tokens
- Manejo de errores de login
- Persistencia de sesión con `localStorage` y cookies
- Tokens CSRF y cookies de autenticación

### 2. CRUD de Reservas (`tests/reservations-crud.spec.ts`)

Cubre todas las operaciones CRUD sobre la entidad de reservas:

- ✅ **CREATE**: Crear una nueva reserva desde la UI
  - Selección de servicio desde la lista
  - Selección de barbero
  - Selección de fecha mediante calendario
  - Selección de hora disponible
  - Confirmación de la reserva
  
- ✅ **READ**: Listar las reservas del usuario autenticado
  - Visualización de todas las reservas del usuario
  - Verificación de datos mostrados (fecha, hora, servicio, estado)
  
- ✅ **UPDATE**: Actualizar una reserva existente
  - Cambio de hora de la reserva
  - Cambio de estado de la reserva
  - Verificación de actualización en la UI
  
- ✅ **DELETE**: Eliminar una reserva existente
  - Cancelación de reserva mediante API
  - Verificación de eliminación en la lista
  
- ✅ **Flujo completo**: Ejecuta un flujo completo de CRUD en la UI
  - Crea una reserva
  - La lista
  - La actualiza
  - La elimina
  - Verifica cada paso en la interfaz

**Cobertura técnica:**
- Creación de reservas mediante interfaz gráfica con calendario y selección de horarios
- Listado y visualización de reservas del usuario autenticado
- Actualización de reservas mediante API (cambio de hora y estado)
- Eliminación de reservas mediante API con validación de permisos
- Flujo completo end-to-end de gestión de reservas

## ⚙️ Configuración

La configuración de Playwright se encuentra en `playwright.config.ts`. Por defecto:

- **Base URL**: `http://localhost:5173` (frontend)
- **Navegador**: Chromium (configurable para Firefox o WebKit)
- **Servidores**: Se inician automáticamente el backend y frontend antes de los tests
- **Timeouts**: Configurados para esperar la carga de los servidores (120 segundos)
- **Reintentos**: 2 reintentos en CI, 0 en local
- **Screenshots**: Solo en caso de fallo
- **Trazas**: Solo en el primer reintento
- **Paralelización**: Completa en local, secuencial en CI

### Personalizar la configuración

Puedes modificar `playwright.config.ts` para:
- Cambiar el navegador (Firefox, WebKit)
- Ajustar timeouts
- Configurar diferentes entornos
- Agregar más opciones de reporte
- Configurar workers paralelos

Ejemplo para ejecutar en múltiples navegadores:

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

## 🔍 Debugging

### Ver qué está pasando

1. **Modo headed**: Usa `npm run test:headed` para ver el navegador en acción
2. **Modo UI**: Usa `npm run test:ui` para la interfaz gráfica interactiva
3. **Modo debug**: Usa `npm run test:debug` para depurar paso a paso con Playwright Inspector

### Screenshots y Videos

Los screenshots se capturan automáticamente cuando un test falla. Los videos se pueden habilitar en `playwright.config.ts` agregando:

```typescript
use: {
  video: 'on',
  // ...
}
```

### Logs y trazas

Playwright genera trazas automáticamente en el primer reintento. Puedes verlas abriendo el reporte HTML:

```bash
npm run test:report
```

Las trazas incluyen:
- Capturas de pantalla en cada paso
- Network requests y responses
- Console logs
- Timeline de ejecución

## 📝 Notas Importantes

- **Usuarios de prueba**: Los tests crean usuarios de prueba automáticamente con timestamps únicos para evitar conflictos
- **Limpieza de datos**: Los datos de prueba se limpian entre tests (cookies y localStorage)
- **MongoDB requerido**: Asegúrate de que MongoDB esté corriendo antes de ejecutar los tests
- **Inicio automático**: Los tests esperan automáticamente a que los servidores estén listos
- **Selectores actualizados**: Los selectores se actualizaron para coincidir con la UI actual del proyecto
- **Tests independientes**: Los tests son independientes y pueden ejecutarse en cualquier orden
- **Estado de reservas**: Las reservas se crean con estado `confirmed` para que aparezcan en las vistas del barbero

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

Asegúrate de que MongoDB esté corriendo:

```bash
# Linux/Mac
sudo systemctl start mongod

# O con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Error: "Port 3001 or 5173 already in use"

Los servidores ya están corriendo. Los tests intentarán reutilizarlos gracias a `reuseExistingServer: true`. Si hay problemas, detén los servidores manualmente y vuelve a ejecutar los tests.

### Tests fallan por timeouts

- Verifica que MongoDB esté corriendo
- Aumenta los timeouts en `playwright.config.ts`
- Verifica que el backend y frontend se inicien correctamente
- Revisa los archivos `.env` en backend y frontend

### Error: "Cannot find module '@playwright/test'"

Asegúrate de instalar las dependencias:

```bash
npm install
```

### Los selectores no encuentran elementos

Los selectores se actualizaron para coincidir con la UI actual. Si la UI cambia en el futuro, puede que necesites actualizar los selectores en los archivos `.spec.ts`. Los selectores principales usados son:

- `input[placeholder="tu_usuario"]` y `input[placeholder="tu_contraseña"]` para login
- `button:has-text(":")` para horarios disponibles
- `table` para listado de reservas
- Patrones de texto flexibles con regex para mensajes

## 🚦 Mejores Prácticas

1. **Ejecuta los tests frecuentemente** durante el desarrollo
2. **Usa `test:ui`** para debugging interactivo
3. **Revisa los screenshots** cuando un test falla
4. **Mantén los tests independientes** entre sí
5. **Actualiza los selectores** si la UI cambia
6. **Documenta tests complejos** con comentarios claros
7. **Usa datos de prueba únicos** para evitar conflictos
8. **Limpia el estado** entre tests cuando sea necesario

## 📁 Estructura de Tests

```
e2etests/
├── tests/
│   ├── login.spec.ts              # Tests de login y acceso protegido
│   └── reservations-crud.spec.ts # Tests de CRUD de reservas
├── playwright.config.ts           # Configuración de Playwright
├── tsconfig.json                  # Configuración de TypeScript
├── package.json
└── README.md                      # Este archivo
```

## 🔄 Integración Continua

Los tests están configurados para ejecutarse en CI con:
- 2 reintentos automáticos
- Ejecución en un solo worker (secuencial)
- Sin reutilización de servidores existentes

Para configurar en tu CI, asegúrate de:
1. Instalar dependencias: `npm install`
2. Tener MongoDB disponible
3. Configurar las variables de entorno necesarias
4. Ejecutar: `npm test`

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev/)
- [Guía de mejores prácticas](https://playwright.dev/docs/best-practices)
- [API de Playwright](https://playwright.dev/docs/api/class-test)
- [Guía de selectores](https://playwright.dev/docs/selectors)
- [Guía de debugging](https://playwright.dev/docs/debug)
