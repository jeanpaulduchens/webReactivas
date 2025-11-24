import { test, expect } from '@playwright/test';

test.describe('CRUD de Reservas', () => {
  let testUser: { username: string; password: string; email: string };
  let testServiceId: string;

  test.beforeAll(async ({ request }) => {
    // Crear usuario de prueba único para esta ejecución
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
        phone: '123456789'
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
    await page.fill('input[placeholder="tu_contraseña"]', testUser.password);
    await page.locator('form >> button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 5000 });

    // Navegar a la página de reservas
    await page.goto('/reservas');
    await expect(page.locator('h2:has-text("Reservas")')).toBeVisible();

    // El servicio ya debería estar seleccionado (primero por defecto)
    // Verificar que muestra info del usuario autenticado
    await expect(page.getByText('Reservando como:')).toBeVisible();

    // Esperar a que el calendario cargue (tiene un grid de 7 columnas para los días)
    await page.waitForSelector('.grid.grid-cols-7', { timeout: 5000 });

    // Seleccionar el primer día disponible del mes (que no esté deshabilitado ni sea del mes anterior/siguiente)
    const availableDay = page.locator('.grid.grid-cols-7 >> button:not([disabled])').filter({ hasText: /^(2[5-9]|30|1)$/ }).first();
    await availableDay.click();

    // Esperar a que carguen los horarios
    await page.waitForTimeout(500);

    // Seleccionar el primer horario disponible (que no esté deshabilitado)
    // Los horarios están en botones que muestran formato HH:MM
    const availableSlot = page.locator('button:not([disabled])').filter({ hasText: /^\d{2}:\d{2}$/ }).first();
    await expect(availableSlot).toBeVisible({ timeout: 5000 });
    await availableSlot.click();

    // Confirmar la reserva
    await page.locator('button:has-text("Confirmar Reserva")').click();

    // Manejar el alert
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    // Esperar redirección a mis-reservas
    await page.waitForURL(/\/mis-reservas/, { timeout: 5000 });
  });

  test('debe listar las reservas del usuario (READ)', async ({ page, request }) => {
    // Hacer login a través de la API para obtener cookies
    const loginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const csrfToken = loginResponse.headers()['x-csrf-token'];

    // Crear reserva mediante API (ahora solo necesita serviceId, date, time)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    await request.post('http://localhost:3001/api/reservations', {
      headers: {
        'X-CSRF-Token': csrfToken || ''
      },
      data: {
        serviceId: testServiceId,
        date: tomorrowStr,
        time: '10:00',
        status: 'confirmed'
      }
    });

    // Hacer login en la UI
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', testUser.username);
    await page.fill('input[placeholder="tu_contraseña"]', testUser.password);
    await page.locator('form >> button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 5000 });

    // Navegar a mis reservas
    await page.goto('/mis-reservas');
    await expect(page.locator('h2:has-text("Mis Reservas")').or(page.locator('h3:has-text("Mis Reservas")'))).toBeVisible({ timeout: 10000 });

    // Verificar que la tabla está visible
    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });

    // Verificar que hay al menos una fila en la tabla (excluyendo el header)
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    // Verificar que aparece la hora de la reserva
    await expect(page.locator('text=10:00')).toBeVisible();
  });

  test('debe actualizar una reserva existente (UPDATE)', async ({ request }) => {
    // Hacer login
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
        'X-CSRF-Token': csrfToken || ''
      },
      data: {
        serviceId: testServiceId,
        date: tomorrowStr,
        time: '10:00',
        status: 'confirmed'
      }
    });

    expect(createResponse.ok()).toBeTruthy();
    const reservation = await createResponse.json();
    const reservationId = reservation._id || reservation.id;

    // Actualizar la reserva (cambiar hora)
    const updateResponse = await request.put(`http://localhost:3001/api/reservations/${reservationId}`, {
      headers: {
        'X-CSRF-Token': csrfToken || ''
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

  test('debe eliminar una reserva existente (DELETE)', async ({ request }) => {
    // Hacer login
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
        'X-CSRF-Token': csrfToken || ''
      },
      data: {
        serviceId: testServiceId,
        date: tomorrowStr,
        time: '11:00',
        status: 'confirmed'
      }
    });

    expect(createResponse.ok()).toBeTruthy();
    const reservation = await createResponse.json();
    const reservationId = reservation._id || reservation.id;

    // Eliminar la reserva
    const deleteResponse = await request.delete(`http://localhost:3001/api/reservations/${reservationId}`, {
      headers: {
        'X-CSRF-Token': csrfToken || ''
      }
    });

    expect(deleteResponse.status()).toBe(204);

    // Verificar que la reserva ya no existe
    const getResponse = await request.get(`http://localhost:3001/api/reservations/${reservationId}`, {
      headers: {
        'X-CSRF-Token': csrfToken || ''
      }
    });
    expect([404, 400]).toContain(getResponse.status());
  });

  test('debe completar el flujo completo de CRUD en la UI', async ({ page }) => {
    // Hacer login
    await page.goto('/login');
    await page.fill('input[placeholder="tu_usuario"]', testUser.username);
    await page.fill('input[placeholder="tu_contraseña"]', testUser.password);
    await page.locator('form >> button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 5000 });

    // CREATE: Crear una reserva
    await page.goto('/reservas');
    
    // Verificar que muestra info del usuario
    await expect(page.getByText('Reservando como:')).toBeVisible();

    // Esperar a que el calendario cargue (tiene un grid de 7 columnas para los días)
    await page.waitForSelector('.grid.grid-cols-7', { timeout: 5000 });

    // Seleccionar el primer día disponible
    const availableDay = page.locator('.grid.grid-cols-7 >> button:not([disabled])').filter({ hasText: /^(2[5-9]|30|1)$/ }).first();
    await availableDay.click();

    // Esperar a que carguen los horarios
    await page.waitForTimeout(500);

    // Seleccionar horario disponible
    const availableSlot = page.locator('button:not([disabled])').filter({ hasText: /^\d{2}:\d{2}$/ }).first();
    await expect(availableSlot).toBeVisible({ timeout: 5000 });
    await availableSlot.click();

    // Confirmar
    await page.locator('button:has-text("Confirmar Reserva")').click();
    
    // Manejar alert si existe
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // READ: Verificar que la reserva aparece en mis reservas
    await page.waitForURL(/\/mis-reservas/, { timeout: 5000 });
    await expect(page.locator('h2:has-text("Mis Reservas")')).toBeVisible({ timeout: 5000 });
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table', { timeout: 5000 });
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Verificar que hay al menos una fila en la tabla
    const rows = await page.locator('tbody tr').count();
    // Verificar que hay al menos una fila en la tabla
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    // Verificar que aparece la hora seleccionada
    if (selectedTime) {
      await expect(page.locator(`text=${selectedTime.trim()}`)).toBeVisible();
    }
  });
});

