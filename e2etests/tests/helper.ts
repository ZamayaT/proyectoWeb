import { Page, expect } from '@playwright/test';

export const loginWith = async (page: Page, username: string, password: string) => {
  await page.goto('/login');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  
  // Esperar a que aparezca el mensaje de bienvenida (señal de login exitoso)
  await expect(page.getByText('Bienvenido 👋')).toBeVisible({ timeout: 10000 });
  
  // Dar tiempo para que React procese y guarde el token
  await page.waitForTimeout(1000);
};

export const createComment = async (page: Page, content: string, difficulty: number) => {
  await page.getByText('Agregar comentario').click();
  await page.getByTestId(`difficulty-${difficulty}`).click();
  await page.getByLabel('Tu comentario').fill(content);
  await page.getByRole('button', { name: 'Publicar comentario' }).click();
  
  // Esperar a que el comentario aparezca en la página
  await page.waitForTimeout(1000);
};