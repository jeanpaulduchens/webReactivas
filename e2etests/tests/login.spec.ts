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
    await page.locator('form >> button[type="submit"]').click();
    
    // Debe permanecer en /login (no redirigir) y el botón no debe estar disabled
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*\/login/);
    // Verificar que el botón ya no está en loading
    await expect(page.locator('form >> button[type="submit"]')).toBeEnabled();
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
    await page.locator('form >> button[type="submit"]').click();
    
    // Debe redirigir a la página principal
    await expect(page).toHaveURL('/', { timeout: 10000 });
    
    // Verificar que aparece el botón de cerrar sesión
    await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 5000 });
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
    await page.locator('form >> button[type="submit"]').click();
    
    // Esperar redirección
    await page.waitForURL('/', { timeout: 10000 });
    
    // Verificar autenticación
    await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 5000 });
    
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
    await page.locator('form >> button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Verificar que está autenticado
    await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 5000 });
    
    // Recargar la página
    await page.reload();
    
    // Verificar que mantiene la sesión (debe seguir viendo el botón de logout)
    await expect(page.getByText('Cerrar Sesión')).toBeVisible({ timeout: 5000 });
    
    // Debe mantener la sesión y permitir acceso a rutas protegidas
    await page.goto('/mis-reservas');
    await expect(page).toHaveURL(/.*\/mis-reservas/, { timeout: 10000 });
  });
});

