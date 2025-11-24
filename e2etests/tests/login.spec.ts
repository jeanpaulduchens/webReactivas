import { test, expect } from '@playwright/test';

test.describe('Login y Acceso Protegido', () => {
  test.beforeEach(async ({ page, context }) => {
    // Limpiar cookies y localStorage antes de cada test
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('debe redirigir a login cuando se intenta acceder a ruta protegida sin autenticación', async ({ page }) => {
    // Intentar acceder directamente a una ruta protegida
    await page.goto('/reservas');
    
    // Debe redirigir a la página de login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    
    // Llenar el formulario con credenciales inválidas
    await page.fill('input[placeholder="tu_usuario"]', 'usuario_inexistente');
    await page.fill('input[placeholder="tu_contraseña"]', 'password_incorrecto');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Debe mostrar un mensaje de error (el texto puede variar)
    await expect(page.locator('text=/error|inválid|incorrect|wrong/i')).toBeVisible({ timeout: 5000 });
  });

  test('debe hacer login exitoso y redirigir a la página principal', async ({ page }) => {
    // Primero necesitamos crear un usuario de prueba
    const response = await page.request.post('http://localhost:3001/api/users', {
      data: {
        username: 'testuser_e2e',
        name: 'Usuario Test E2E',
        email: 'teste2e@example.com',
        password: 'password123',
        phone: '123456789'
      }
    });

    // Si el usuario ya existe, continuamos (código 400 o 201)
    expect([201, 400]).toContain(response.status());

    // Ahora intentamos hacer login
    await page.goto('/login');
    
    await page.fill('input[placeholder="tu_usuario"]', 'testuser_e2e');
    await page.fill('input[placeholder="tu_contraseña"]', 'password123');
    
    // Esperar a que el botón esté habilitado
    await page.waitForSelector('button:has-text("Iniciar Sesión"):not([disabled])');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Debe mostrar mensaje de éxito
    await expect(page.locator('text=/login exitoso|éxito/i')).toBeVisible({ timeout: 10000 });
    
    // Esperar a que se guarde el token en localStorage
    await page.waitForFunction(() => {
      return localStorage.getItem('csrfToken') !== null;
    }, { timeout: 5000 });
    
    // Debe redirigir a la página principal
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('debe permitir acceso a rutas protegidas después del login', async ({ page }) => {
    // Crear usuario de prueba
    await page.request.post('http://localhost:3001/api/users', {
      data: {
        username: 'testuser_protected',
        name: 'Usuario Protected',
        email: 'testprotected@example.com',
        password: 'password123',
        phone: '123456789'
      }
    });

    // Hacer login
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', 'testuser_protected');
    await page.fill('input[placeholder="tu_contraseña"]', 'password123');
    await page.waitForSelector('button:has-text("Iniciar Sesión"):not([disabled])');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar a que se complete el login
    await expect(page.locator('text=/login exitoso|éxito/i')).toBeVisible({ timeout: 10000 });
    await page.waitForURL('/', { timeout: 10000 });
    
    // Esperar a que el token esté en localStorage
    await page.waitForFunction(() => {
      return localStorage.getItem('csrfToken') !== null;
    }, { timeout: 5000 });
    
    // Intentar acceder a una ruta protegida
    await page.goto('/reservas');
    
    // Debe permitir el acceso (no debe redirigir a login)
    await expect(page).toHaveURL(/.*\/reservas/, { timeout: 10000 });
    await expect(page.locator('h2:has-text("Reservas")')).toBeVisible({ timeout: 5000 });
  });

  test('debe mantener la sesión al recargar la página', async ({ page }) => {
    // Crear usuario de prueba
    await page.request.post('http://localhost:3001/api/users', {
      data: {
        username: 'testuser_session',
        name: 'Usuario Session',
        email: 'testsession@example.com',
        password: 'password123',
        phone: '123456789'
      }
    });

    // Hacer login
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', 'testuser_session');
    await page.fill('input[placeholder="tu_contraseña"]', 'password123');
    await page.waitForSelector('button:has-text("Iniciar Sesión"):not([disabled])');
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('text=/login exitoso|éxito/i')).toBeVisible({ timeout: 10000 });
    await page.waitForURL('/', { timeout: 10000 });
    
    // Esperar a que el token esté guardado
    await page.waitForFunction(() => {
      return localStorage.getItem('csrfToken') !== null;
    }, { timeout: 5000 });
    
    // Recargar la página
    await page.reload();
    
    // Verificar que el token sigue ahí
    const token = await page.evaluate(() => localStorage.getItem('csrfToken'));
    expect(token).not.toBeNull();
    
    // Debe mantener la sesión y permitir acceso a rutas protegidas
    await page.goto('/mis-reservas');
    await expect(page).toHaveURL(/.*\/mis-reservas/, { timeout: 10000 });
  });
});

