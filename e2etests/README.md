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

### 2. CRUD de Reservas (`reservations-crud.spec.ts`)

- ✅ **CREATE**: Crear una nueva reserva desde la UI
- ✅ **READ**: Listar las reservas del usuario
- ✅ **UPDATE**: Actualizar una reserva existente (hora, estado)
- ✅ **DELETE**: Eliminar una reserva existente
- ✅ Flujo completo de CRUD en la UI

## ⚙️ Configuración

La configuración de Playwright se encuentra en `playwright.config.ts`. Por defecto:

- **Base URL**: `http://localhost:5173` (frontend)
- **Navegador**: Chromium
- **Servidores**: Se inician automáticamente el backend y frontend antes de los tests
- **Timeouts**: Configurados para esperar la carga de los servidores

### Personalizar la configuración

Puedes modificar `playwright.config.ts` para:
- Cambiar el navegador (Firefox, WebKit)
- Ajustar timeouts
- Configurar diferentes entornos
- Agregar más opciones de reporte

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

## 📝 Notas

- Los tests crean usuarios de prueba automáticamente
- Los datos de prueba se limpian entre tests cuando es posible
- Asegúrate de que MongoDB esté corriendo antes de ejecutar los tests
- Los tests esperan automáticamente a que los servidores estén listos

## 🐛 Solución de Problemas

### Error: "Cannot connect to Docker daemon"

Si estás usando MongoDB con Docker, asegúrate de que Docker Desktop esté corriendo.

### Error: "Port 3001 or 5173 already in use"

Los servidores ya están corriendo. Los tests intentarán reutilizarlos. Si hay problemas, detén los servidores manualmente y vuelve a ejecutar los tests.

### Tests fallan por timeouts

- Verifica que MongoDB esté corriendo
- Aumenta los timeouts en `playwright.config.ts`
- Verifica que el backend y frontend se inicien correctamente

## 📚 Recursos

- [Documentación de Playwright](https://playwright.dev/)
- [Guía de mejores prácticas](https://playwright.dev/docs/best-practices)
- [API de Playwright](https://playwright.dev/docs/api/class-test)

