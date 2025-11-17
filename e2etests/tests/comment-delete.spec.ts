import { test, expect } from '@playwright/test';
import { loginWith, createComment } from './helper';

test.describe('Eliminar Comentarios', () => {
  
  test.beforeEach(async ({ page, request }) => {
    // Resetear la base de datos antes de cada test
    await request.post("/api/testing/reset");
  });

  test.afterEach(async ({ request }) => {
    // Limpiar después de cada test
    await request.post("/api/testing/reset");
  });

  test('usuario puede eliminar su propio comentario [DEBUG]', async ({ page }) => {
    await loginWith(page, 'user1', 'user123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    const textoComentario = `Mi comentario para eliminar - ${Date.now()}`;
    await createComment(page, textoComentario, 5);
    
    await expect(page.getByText(textoComentario)).toBeVisible();
    
    // VER CUÁNTOS BOTONES DE DELETE HAY
    const deleteButtons = page.getByTestId(/delete-comment-/);
    const count = await deleteButtons.count();
    console.log(`🔍 Hay ${count} botones de eliminar en la página`);
    
    // VER CUÁNTOS COMENTARIOS HAY
    const comentarios = page.getByTestId(/comment-paper-/);
    const commentCount = await comentarios.count();
    console.log(`🔍 Hay ${commentCount} comentarios en la página`);
    
    // Interceptar peticiones de red
    page.on('response', response => {
      if (response.url().includes('/api/comments/')) {
        console.log(`🌐 ${response.request().method()} ${response.url()} - Status: ${response.status()}`);
      }
    });
    
    page.once('dialog', dialog => {
      console.log(`💬 Diálogo apareció: "${dialog.message()}"`);
      dialog.accept();
    });
    
    await page.getByTestId(/delete-comment-/).first().click();
    
    // Esperar un momento para ver las peticiones
    await page.waitForTimeout(1000);
    
    await expect(page.getByText(textoComentario)).not.toBeVisible();
  });

  test('usuario puede eliminar su propio comentario', async ({ page }) => {
    await loginWith(page, 'user1', 'user123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    const textoComentario = `Mi comentario para eliminar - ${Date.now()}`;
    await createComment(page, textoComentario, 5);
    
    await expect(page.getByText(textoComentario)).toBeVisible();
    
    page.once('dialog', dialog => dialog.accept());
    
    // Buscar el Paper que contiene nuestro texto y clickear su botón
    const comentarioPaper = page.locator('[data-testid^="comment-paper-"]', { 
      has: page.getByText(textoComentario) 
    });
    
    await comentarioPaper.getByTestId(/delete-comment-/).click();
    
    await expect(page.getByText(textoComentario)).not.toBeVisible();
  });

  test('el contador de comentarios se actualiza al eliminar', async ({ page }) => {
    await loginWith(page, 'user1', 'user123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    const textoComentario = `Comentario temporal - ${Date.now()}`;
    await createComment(page, textoComentario, 4);
    
    // Después de crear, debe haber 1 comentario
    await expect(page.getByText(/Comentarios \(1\)/)).toBeVisible();
    
    page.once('dialog', dialog => dialog.accept());
    
    const comentarioPaper = page.locator('[data-testid^="comment-paper-"]', { 
      has: page.getByText(textoComentario) 
    });
    
    await comentarioPaper.getByTestId(/delete-comment-/).click();
    
    // Después de eliminar, debe haber 0 comentarios
    await expect(page.getByText(textoComentario)).not.toBeVisible();
    await expect(page.getByText(/Comentarios \(0\)/)).toBeVisible();
  });

  test('admin puede eliminar comentarios de otros usuarios', async ({ page }) => {
    // Crear comentario como user1
    await loginWith(page, 'user1', 'user123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    const textoComentario = `Comentario de user1 - ${Date.now()}`;
    await createComment(page, textoComentario, 3);
    
    await page.waitForTimeout(300);
    await expect(page.getByText(textoComentario)).toBeVisible();
    
    // Logout usando el navbar
    await page.getByText('Sesión').click();
    
    // ESPERAR a que la página de login cargue completamente
    await page.waitForURL('/login');
    await page.waitForTimeout(300);
    
    // Ahora sí hacer logout
    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
    
    // Esperar a que el logout se complete
    await page.waitForTimeout(300);
    
    // Login como admin
    await loginWith(page, 'admin', 'admin123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    await page.waitForTimeout(300);
    await expect(page.getByText(textoComentario)).toBeVisible();
    
    // Admin elimina el comentario
    page.once('dialog', dialog => dialog.accept());
    
    const comentarioPaper = page.locator('[data-testid^="comment-paper-"]', { 
      has: page.getByText(textoComentario) 
    });
    
    await comentarioPaper.getByTestId(/delete-comment-/).click();
    
    await page.waitForTimeout(500);
    await expect(page.getByText(textoComentario)).not.toBeVisible();
  });

  test('se requiere confirmación antes de eliminar', async ({ page }) => {
    await loginWith(page, 'user1', 'user123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    const textoComentario = `Comentario para cancelar - ${Date.now()}`;
    await createComment(page, textoComentario, 2);
    
    // CANCELAR la eliminación
    page.once('dialog', dialog => dialog.dismiss());
    
    const comentarioPaper = page.locator('[data-testid^="comment-paper-"]', { 
      has: page.getByText(textoComentario) 
    });
    
    await comentarioPaper.getByTestId(/delete-comment-/).click();
    
    // El comentario debe seguir visible porque cancelamos
    await expect(page.getByText(textoComentario)).toBeVisible();
  });

  test('comentarios anónimos pueden ser eliminados por su autor', async ({ page }) => {
    await loginWith(page, 'user1', 'user123');
    await page.goto('/');
    await page.getByTestId(/ramo-card-CC/).first().click();
    
    // Expandir la sección de agregar comentario
    await page.getByText('Agregar comentario').click();
    
    // Activar el switch de anónimo
    await page.getByLabel(/Comentar como anónimo/i).click();
    
    // Seleccionar dificultad
    await page.getByTestId('difficulty-3').click();
    
    // Escribir comentario
    const textoAnonimo = `Comentario anónimo - ${Date.now()}`;
    await page.getByLabel('Tu comentario').fill(textoAnonimo);
    
    // Publicar
    await page.getByRole('button', { name: 'Publicar comentario' }).click();
    
    // Verificar que aparece
    await expect(page.getByText(textoAnonimo)).toBeVisible();
    
    // Eliminar
    page.once('dialog', dialog => dialog.accept());
    
    const comentarioPaper = page.locator('[data-testid^="comment-paper-"]', { 
      has: page.getByText(textoAnonimo) 
    });
    
    await comentarioPaper.getByTestId(/delete-comment-/).click();
    
    // Verificar que se eliminó
    await expect(page.getByText(textoAnonimo)).not.toBeVisible();
  });
});