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
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('text=/login exitoso|éxito/i')).toBeVisible({ timeout: 10000 });
    await page.waitForURL('/', { timeout: 10000 });

    // Navegar a la página de reservas
    await page.goto('/reservas');
    await expect(page.locator('h2:has-text("Reservas")')).toBeVisible();

    // Verificar que el servicio está seleccionado
    await page.waitForSelector('select', { timeout: 5000 });
    const selectedService = await page.locator('select').inputValue();
    expect(selectedService).toBeTruthy();

    // Seleccionar una fecha futura (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNumber = tomorrow.getDate().toString();
    
    // Buscar el botón del día en el calendario
    const calendarButtons = page.locator('button').filter({ hasText: new RegExp(`^${dayNumber}$`) });
    const enabledButtons = calendarButtons.filter({ hasNot: page.locator('[disabled]') });
    const tomorrowButton = enabledButtons.first();
    await tomorrowButton.click({ timeout: 10000 });

    // Esperar a que aparezcan los slots de horarios
    await page.waitForSelector('button:has-text(":")', { timeout: 10000 });

    // Seleccionar el primer horario disponible que no esté deshabilitado
    const availableSlots = page.locator('button:has-text(":")').filter({ hasNot: page.locator('[disabled]') });
    const firstAvailableSlot = availableSlots.first();
    await firstAvailableSlot.click();

    // Confirmar la reserva
    await page.click('button:has-text("Confirmar Reserva")');

    // Verificar que se muestra mensaje de éxito o se redirige a mis reservas
    await expect(page.locator('text=/reserva creada|exitoso|success/i').or(page.locator('h2:has-text("Mis Reservas")'))).toBeVisible({ timeout: 10000 });
  });

  test('debe listar las reservas del usuario (READ)', async ({ page, request }) => {
    // Hacer login mediante API para obtener token
    const loginResponse = await request.post('http://localhost:3001/api/login', {
      data: {
        username: testUser.username,
        password: testUser.password
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const csrfToken = loginResponse.headers()['x-csrf-token'];

    // Crear reserva mediante API
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
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('text=/login exitoso|éxito/i')).toBeVisible({ timeout: 10000 });
    await page.waitForURL('/', { timeout: 10000 });

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
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('text=/login exitoso|éxito/i')).toBeVisible({ timeout: 10000 });
    await page.waitForURL('/', { timeout: 10000 });

    // CREATE: Crear una reserva
    await page.goto('/reservas');
    await page.waitForSelector('select', { timeout: 5000 });

    // Seleccionar fecha (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNumber = tomorrow.getDate().toString();
    
    // Buscar el botón del día en el calendario
    const calendarButtons = page.locator('button').filter({ hasText: new RegExp(`^${dayNumber}$`) });
    const enabledButtons = calendarButtons.filter({ hasNot: page.locator('[disabled]') });
    const tomorrowButton = enabledButtons.first();
    await tomorrowButton.click({ timeout: 10000 });

    // Seleccionar horario
    await page.waitForSelector('button:has-text(":")', { timeout: 10000 });
    const availableSlots = page.locator('button:has-text(":")').filter({ hasNot: page.locator('[disabled]') });
    const firstSlot = availableSlots.first();
    const selectedTime = await firstSlot.textContent();
    await firstSlot.click();

    // Confirmar
    await page.click('button:has-text("Confirmar Reserva")');
    
    // Esperar confirmación o redirección
    await page.waitForURL(/.*\/mis-reservas|.*/, { timeout: 10000 });

    // READ: Verificar que la reserva aparece en mis reservas
    await page.goto('/mis-reservas');
    await expect(page.locator('h2:has-text("Mis Reservas")').or(page.locator('h3:has-text("Mis Reservas")'))).toBeVisible({ timeout: 10000 });
    
    // Esperar a que la tabla se cargue
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Verificar que hay al menos una fila en la tabla
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);

    // Verificar que aparece la hora seleccionada
    if (selectedTime) {
      await expect(page.locator(`text=${selectedTime.trim()}`)).toBeVisible();
    }
  });
});

