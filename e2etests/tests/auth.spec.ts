import { test, expect } from '@playwright/test';
import { loginWith } from './helper';

test.describe('Autenticación', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('debe hacer login exitoso con credenciales correctas', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
    await expect(page.getByText('Sesión de usuario admin iniciada correctamente')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar Sesión' })).toBeVisible();
  });

  test('debe mostrar error con credenciales incorrectas', async ({ page }) => {
    await page.getByLabel('Usuario').fill('usuarioInvalido');
    await page.getByLabel('Contraseña').fill('passwordIncorrecto');
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    await expect(page.getByText('Bienvenido 👋')).not.toBeVisible();
    await expect(page.getByLabel('Usuario')).toBeVisible();
  });

  test('debe poder hacer logout después de login', async ({ page }) => {
    await loginWith(page, 'admin', 'admin123');
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
    
    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
    
    await expect(page.getByLabel('Usuario')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByText(/Sesión cerrada/)).toBeVisible();
  });

  test('debe registrar un nuevo usuario', async ({ page }) => {
    const randomUsername = `testuser_${Date.now()}`;
    
    await page.getByLabel('Usuario').fill(randomUsername);
    await page.getByLabel('Contraseña').fill('testpass123');
    await page.getByRole('button', { name: 'Registrar' }).click();
    
    await expect(page.getByText('Usuario registrado correctamente.')).toBeVisible();
    await expect(page.getByLabel('Usuario')).toHaveValue('');
  });

});