import { Page } from '@playwright/test';

export const loginWith = async (page: Page, username: string, password: string) => {
  await page.goto('/login');
  await page.getByLabel('Usuario').fill(username);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
};

export const createComment = async (page: Page, content: string, difficulty: number) => {
  // Expandir la sección de agregar comentario
  await page.getByText('Agregar comentario').click();
  
  // Seleccionar nivel de dificultad usando data-testid
  await page.getByTestId(`difficulty-${difficulty}`).click();
  
  // Escribir el comentario
  await page.getByLabel('Tu comentario').fill(content);
  
  // Publicar
  await page.getByRole('button', { name: 'Publicar comentario' }).click();
};