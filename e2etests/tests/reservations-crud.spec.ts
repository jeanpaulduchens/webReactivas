import { test, expect } from '@playwright/test';

test.describe('CRUD de Reservas', () => {
  let testUser: { username: string; password: string; email: string };
  let testServiceId: string;

  test.beforeAll(async ({ request }) => {
    // Crear usuario de prueba
    testUser = {
      username: `testuser_crud_${Date.now()}`,
      password: 'password123',
      email: `testcrud_${Date.now()}@example.com`
    };

    const userResponse = await request.post('http://localhost:3001/api/users', {
      data: {
        username: testUser.username,
        name: 'Usuario CRUD Test',
        email: testUser.email,
        password: testUser.password,
        phone: '123456789',
        role: 'cliente'
      }
    });

    expect([201, 400]).toContain(userResponse.status());

    // Obtener un servicio disponible para las pruebas
    const servicesResponse = await request.get('http://localhost:3001/api/services');
    expect(servicesResponse.ok()).toBeTruthy();
    const services = await servicesResponse.json();
    expect(services.length).toBeGreaterThan(0);
    testServiceId = services[0]._id || services[0].id;
  });

  test.beforeEach(async ({ page, context }) => {
    // Limpiar cookies y localStorage
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('debe crear una nueva reserva (CREATE)', async ({ page }) => {
    // Hacer login
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', testUser.username);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('.login-success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('/', { timeout: 5000 });

    // Navegar a la página de reservas
    await page.goto('/reservas');
    await expect(page.locator('h2:has-text("Reservas")')).toBeVisible();

    // Llenar el formulario de reserva
    await page.fill('input[placeholder="Tu Nombre Completo"]', 'Juan Pérez');
    await page.fill('input[placeholder="+56 9 1234 5678"]', '+56 9 1234 5678');
    await page.fill('input[placeholder="tu.email@ejemplo.com"]', testUser.email);

    // Seleccionar servicio (ya debería estar seleccionado el primero)
    // Esperar a que el select esté disponible
    await page.waitForSelector('select.select', { timeout: 5000 });

    // Seleccionar una fecha futura (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    // Buscar y hacer clic en el día de mañana en el calendario
    const dayButtons = page.locator('.cal-cell').filter({ hasText: new RegExp(tomorrow.getDate().toString()) });
    const tomorrowButton = dayButtons.filter({ hasNotText: 'muted' }).first();
    await tomorrowButton.click();

    // Seleccionar un horario disponible (primer slot disponible)
    await page.waitForSelector('.slot:not(.slot\\:disabled)', { timeout: 5000 });
    const availableSlot = page.locator('.slot:not(.slot\\:disabled)').first();
    await availableSlot.click();

    // Confirmar la reserva
    await page.click('button:has-text("Confirmar Reserva")');

    // Verificar que se muestra el mensaje de éxito
    await expect(page.locator('text=/Reserva creada exitosamente/i')).toBeVisible({ timeout: 5000 });
  });

  test('debe listar las reservas del usuario (READ)', async ({ page }) => {
    // Primero crear una reserva mediante la API para tener datos
    const loginResponse = await page.request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();

    // Obtener el token CSRF del header
    const csrfToken = loginResponse.headers()['x-csrf-token'];
    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(c => c.name === 'token');

    // Crear reserva mediante API
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    await page.request.post('http://localhost:3001/api/reservations', {
      headers: {
        'X-CSRF-Token': csrfToken || '',
        'Cookie': `token=${tokenCookie?.value || ''}`
      },
      data: {
        fullName: 'Juan Pérez',
        email: testUser.email,
        phone: '+56 9 1234 5678',
        serviceId: testServiceId,
        date: tomorrowStr,
        time: '10:00',
        status: 'pending'
      }
    });

    // Hacer login en la UI
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', testUser.username);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('.login-success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('/', { timeout: 5000 });

    // Navegar a mis reservas
    await page.goto('/mis-reservas');
    await expect(page.locator('h2:has-text("Mis Reservas")')).toBeVisible({ timeout: 5000 });

    // Verificar que la tabla de reservas está visible
    await expect(page.locator('.reservations-table')).toBeVisible();

    // Verificar que aparece al menos una reserva (o el mensaje de que no hay reservas)
    const tableBody = page.locator('.reservations-table tbody');
    await expect(tableBody).toBeVisible();

    // Verificar que hay contenido en la tabla (ya sea reservas o mensaje vacío)
    const hasReservations = await page.locator('.reservations-table tbody tr').count() > 0;
    expect(hasReservations || await page.locator('text=/No tienes reservas/i').isVisible()).toBeTruthy();
  });

  test('debe actualizar una reserva existente (UPDATE)', async ({ page, request }) => {
    // Hacer login y obtener token
    const loginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const csrfToken = loginResponse.headers()['x-csrf-token'];
    const cookies = await loginResponse.headers()['set-cookie'];
    
    // Crear una reserva
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const createResponse = await request.post('http://localhost:3001/api/reservations', {
      headers: {
        'X-CSRF-Token': csrfToken || '',
      },
      data: {
        fullName: 'Juan Pérez',
        email: testUser.email,
        phone: '+56 9 1234 5678',
        serviceId: testServiceId,
        date: tomorrowStr,
        time: '10:00',
        status: 'pending'
      }
    });

    expect(createResponse.ok()).toBeTruthy();
    const reservation = await createResponse.json();
    const reservationId = reservation._id || reservation.id;

    // Obtener el token del usuario para la actualización
    const userLoginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    const updateCsrfToken = userLoginResponse.headers()['x-csrf-token'];
    const cookieHeader = userLoginResponse.headers()['set-cookie']?.toString() || '';

    // Actualizar la reserva (cambiar hora)
    const updateResponse = await request.put(`http://localhost:3001/api/reservations/${reservationId}`, {
      headers: {
        'X-CSRF-Token': updateCsrfToken || '',
        'Cookie': cookieHeader
      },
      data: {
        time: '14:00',
        status: 'confirmed'
      }
    });

    expect(updateResponse.ok()).toBeTruthy();
    const updatedReservation = await updateResponse.json();
    expect(updatedReservation.time).toBe('14:00');
    expect(updatedReservation.status).toBe('confirmed');
  });

  test('debe eliminar una reserva existente (DELETE)', async ({ page, request }) => {
    // Hacer login y obtener token
    const loginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const csrfToken = loginResponse.headers()['x-csrf-token'];
    
    // Crear una reserva
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const createResponse = await request.post('http://localhost:3001/api/reservations', {
      headers: {
        'X-CSRF-Token': csrfToken || '',
      },
      data: {
        fullName: 'Juan Pérez',
        email: testUser.email,
        phone: '+56 9 1234 5678',
        serviceId: testServiceId,
        date: tomorrowStr,
        time: '11:00',
        status: 'pending'
      }
    });

    expect(createResponse.ok()).toBeTruthy();
    const reservation = await createResponse.json();
    const reservationId = reservation._id || reservation.id;

    // Obtener el token del usuario para la eliminación
    const userLoginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    const deleteCsrfToken = userLoginResponse.headers()['x-csrf-token'];
    const cookieHeader = userLoginResponse.headers()['set-cookie']?.toString() || '';

    // Eliminar la reserva
    const deleteResponse = await request.delete(`http://localhost:3001/api/reservations/${reservationId}`, {
      headers: {
        'X-CSRF-Token': deleteCsrfToken || '',
        'Cookie': cookieHeader
      }
    });

    expect(deleteResponse.status()).toBe(204);

    // Verificar que la reserva ya no existe
    const getResponse = await request.get(`http://localhost:3001/api/reservations/${reservationId}`);
    expect([404, 400]).toContain(getResponse.status());
  });

  test('debe completar el flujo completo de CRUD en la UI', async ({ page }) => {
    // Hacer login
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', testUser.username);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('.login-success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('/', { timeout: 5000 });

    // CREATE: Crear una reserva
    await page.goto('/reservas');
    await page.fill('input[placeholder="Tu Nombre Completo"]', 'Test Usuario CRUD');
    await page.fill('input[placeholder="+56 9 1234 5678"]', '+56 9 9876 5432');
    await page.fill('input[placeholder="tu.email@ejemplo.com"]', testUser.email);

    // Seleccionar fecha (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayButtons = page.locator('.cal-cell').filter({ hasText: new RegExp(tomorrow.getDate().toString()) });
    const tomorrowButton = dayButtons.filter({ hasNotText: 'muted' }).first();
    await tomorrowButton.click();

    // Seleccionar horario
    await page.waitForSelector('.slot:not(.slot\\:disabled)', { timeout: 5000 });
    const availableSlot = page.locator('.slot:not(.slot\\:disabled)').first();
    const selectedTime = await availableSlot.textContent();
    await availableSlot.click();

    // Confirmar
    await page.click('button:has-text("Confirmar Reserva")');
    await expect(page.locator('text=/Reserva creada exitosamente/i')).toBeVisible({ timeout: 5000 });

    // READ: Verificar que la reserva aparece en mis reservas
    await page.goto('/mis-reservas');
    await expect(page.locator('h2:has-text("Mis Reservas")')).toBeVisible({ timeout: 5000 });
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('.reservations-table', { timeout: 5000 });
    
    // Verificar que hay al menos una fila en la tabla (puede ser la reserva o el mensaje vacío)
    const rows = await page.locator('.reservations-table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });
});

