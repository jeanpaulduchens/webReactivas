# Tests E2E con Playwright

Este directorio contiene los tests end-to-end (E2E) del sistema de reservas de barbería, implementados con [Playwright](https://playwright.dev/).

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- MongoDB corriendo (localmente o con Docker)
- Backend y Frontend del proyecto configurados

## 📦 Instalación

```bash
cd e2etests
npm install
```

Esto instalará Playwright y sus dependencias, incluyendo los navegadores necesarios.

## 🚀 Ejecutar los Tests

### Ejecutar todos los tests

```bash
npm test
```

Este comando:
- Iniciará automáticamente el backend (puerto 3001) y frontend (puerto 5173)
- Ejecutará todos los tests E2E
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

### Ejecutar tests en modo headed (con navegador visible)

```bash
npm run test:headed
```

Útil para ver qué está haciendo el navegador durante la ejecución.

### Ejecutar tests en modo debug

```bash
npm run test:debug
```

Abre Playwright Inspector para depurar paso a paso.

### Ver reporte HTML

```bash
npm run test:report
```

Abre el reporte HTML de la última ejecución de tests.

## 📁 Estructura de Tests

```
e2etests/
├── tests/
│   ├── login.spec.ts              # Tests de login y acceso protegido
│   └── reservations-crud.spec.ts  # Tests de CRUD de reservas
├── playwright.config.ts           # Configuración de Playwright
├── tsconfig.json                  # Configuración de TypeScript
├── package.json
└── README.md
```

## 🧪 Tests Implementados

### 1. Login y Acceso Protegido (`login.spec.ts`)

- ✅ Redirección a login cuando se accede a ruta protegida sin autenticación
- ✅ Error con credenciales inválidas
- ✅ Login exitoso y redirección
- ✅ Acceso a rutas protegidas después del login
- ✅ Persistencia de sesión al recargar la página

**Cobertura:**
- Validación de rutas protegidas
- Flujo completo de autenticación
- Manejo de errores de login
- Persistencia de sesión con localStorage
- Tokens CSRF y cookies

### 2. CRUD de Reservas (`reservations-crud.spec.ts`)

- ✅ **CREATE**: Crear una nueva reserva desde la UI
- ✅ **READ**: Listar las reservas del usuario
- ✅ **UPDATE**: Actualizar una reserva existente (hora, estado)
- ✅ **DELETE**: Eliminar una reserva existente
- ✅ Flujo completo de CRUD en la UI

**Cobertura:**
- Creación de reservas mediante interfaz gráfica con calendario y selección de horarios
- Listado y visualización de reservas del usuario autenticado
- Actualización de reservas mediante API (cambio de hora y estado)
- Eliminación de reservas mediante API con validación de permisos
- Flujo completo end-to-end de gestión de reservas

## ⚙️ Configuración

La configuración de Playwright se encuentra en `playwright.config.ts`. Por defecto:

- **Base URL**: `http://localhost:5173` (frontend)
- **Navegador**: Chromium
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

## 🔍 Debugging

### Ver qué está pasando

1. Usa `npm run test:headed` para ver el navegador
2. Usa `npm run test:ui` para la interfaz gráfica
3. Usa `npm run test:debug` para depurar paso a paso

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

## 📝 Notas Importantes

- Los tests crean usuarios de prueba automáticamente con timestamps únicos para evitar conflictos
- Los datos de prueba se limpian entre tests (cookies y localStorage)
- **Asegúrate de que MongoDB esté corriendo antes de ejecutar los tests**
- Los tests esperan automáticamente a que los servidores estén listos
- Los selectores se actualizaron para coincidir con la UI actual del proyecto
- Los tests son independientes y pueden ejecutarse en cualquier orden
- Las reservas se crean con estado `confirmed` para que aparezcan en las vistas del barbero

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

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev/)
- [Guía de mejores prácticas](https://playwright.dev/docs/best-practices)
- [API de Playwright](https://playwright.dev/docs/api/class-test)
- [Guía de selectores](https://playwright.dev/docs/selectors)

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

