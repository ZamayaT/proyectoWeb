import { test, expect } from '@playwright/test';
import { loginWith } from './helper';

test.describe('Navegación', () => {
  
  test.beforeEach(async ({ page, request }) => {
    // Resetear la BD para empezar limpio
    await request.post("/api/testing/reset");
  });

  test.afterEach(async ({ request }) => {
    await request.post("/api/testing/reset");
  });

  test('debe mostrar la página de ramos cuando se accede a la raíz', async ({ page }) => {
    // La raíz muestra los ramos disponibles
    await page.goto("/");
    
    // Debería ver el título de ramos
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
  });

  test('debe navegar a login al hacer click en "Sesión"', async ({ page }) => {
    await page.goto("/");
    
    // Click en el link "Sesión" - usar getByText en lugar de getByRole
    await page.getByText('Sesión').click();
    
    // Debería estar en /login
    await expect(page).toHaveURL('/login');
    
    // Debería ver el formulario de login
    await expect(page.getByText('Iniciar Sesión')).toBeVisible();
    await expect(page.getByLabel('Usuario')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
  });

  test('debe hacer login correctamente y mostrar bienvenida', async ({ page }) => {
    await page.goto("/login");
    
    // Llenar formulario
    await page.getByLabel('Usuario').fill('admin');
    await page.getByLabel('Contraseña').fill('admin123');
    
    // Presionar ENTRAR (nota: en mayúsculas)
    await page.getByRole('button', { name: 'ENTRAR' }).click();
    
    // Después del login, debería ver "Bienvenido 👋"
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
    
    // Debería estar en /login (NO redirige automáticamente)
    await expect(page).toHaveURL('/login');
  });

  test('debe navegar de login a lista de ramos al hacer click en "Lista de Ramos"', async ({ page }) => {
    // Login primero
    await loginWith(page, 'admin', 'admin123');
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
    
    // Click en "Lista de Ramos" en el header (es un link)
    await page.getByRole('link', { name: 'Lista de Ramos' }).click();
    
    // Debería estar en / (raíz)
    await expect(page).toHaveURL('/');
    
    // Debería ver los ramos
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
  });

  test('debe navegar de lista de ramos a detalle de ramo', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    
    // Click en "Lista de Ramos" para ir a la lista
    await page.getByRole('link', { name: 'Lista de Ramos' }).click();
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
    
    // Hacer click en el primer ramo
    const primerRamo = page.getByTestId(/ramo-card-CC/).first();
    await primerRamo.click();
    
    // Debería estar en la página de detalle
    await expect(page.getByText('Agregar comentario')).toBeVisible();
  });

  test('debe volver de detalle de ramo a lista de ramos', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    
    // Ir a la lista
    await page.getByRole('link', { name: 'Lista de Ramos' }).click();
    
    // Navegar a un ramo
    const primerRamo = page.getByTestId(/ramo-card-CC/).first();
    await primerRamo.click();
    await expect(page.getByText('Agregar comentario')).toBeVisible();
    
    // Hacer click en el botón volver - usar getByText en lugar de getByRole
    await page.getByText('Volver').click();
    
    // Debería estar de vuelta en la lista
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
  });

  test('debe navegar desde el header al hacer click en "Dificultad de Ramos DCC"', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    
    // Ir a la lista
    await page.getByRole('link', { name: 'Lista de Ramos' }).click();
    
    // Navegar a un ramo
    const primerRamo = page.getByTestId(/ramo-card-CC/).first();
    await primerRamo.click();
    await expect(page.getByText('Agregar comentario')).toBeVisible();
    
    // Hacer click en "Dificultad de Ramos DCC" en el header
    await page.getByText('Dificultad de Ramos DCC').click();
    
    // Debería estar en la lista de ramos
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
  });

  test('debe mostrar bienvenida con usuario después del login', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    
    // Debería mostrar "Bienvenido 👋"
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
  });

  test('debe permitir logout desde la bienvenida', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
    
    // Hacer click en "CERRAR Sesión"
    await page.getByRole('button', { name: 'CERRAR Sesión' }).click();
    
    // Debería volver a login
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Iniciar Sesión')).toBeVisible();
  });

});