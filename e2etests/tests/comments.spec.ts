import { test, expect } from '@playwright/test';
import { loginWith, createComment } from './helper';

test.describe('Comentarios', () => {
  
  test.beforeEach(async ({ page, request }) => {
    // Resetear la BD para empezar limpio
    await request.post("/api/testing/reset");
    
    // Navegar a la página principal
    await page.goto("/");
    
    // Hacer login
    await loginWith(page, 'admin', 'admin123');
    await expect(page.getByText('Bienvenido 👋')).toBeVisible();
    
    // Navegar a la lista de ramos
    await page.getByText('Dificultad de Ramos DCC').click();
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
    
    // Seleccionar primer ramo
    const primerRamo = page.getByTestId(/ramo-card-CC/).first();
    await primerRamo.click();
    
    // Esperar a que cargue la página de detalle
    await expect(page.getByText('Agregar comentario')).toBeVisible();
  });

  // Limpiar después de cada test
  test.afterEach(async ({ request }) => {
    await request.post("/api/testing/reset");
  });

  test('debe crear un comentario exitosamente', async ({ page }) => {
    const comentarioTexto = `Este es un comentario de prueba E2E - ${Date.now()}`;
    
    await page.getByText('Agregar comentario').click();
    await expect(page.getByLabel('Tu comentario')).toBeVisible();
    
    await page.getByTestId('difficulty-5').click();
    await expect(page.getByText('Algo difícil', { exact: true })).toBeVisible();
    
    await page.getByLabel('Tu comentario').fill(comentarioTexto);
    await page.getByRole('button', { name: 'Publicar comentario' }).click();
    
    await expect(page.getByText(comentarioTexto)).toBeVisible();
    // FIX: Usar .first() porque puede haber "admin" en múltiples lugares
    await expect(page.getByText('admin').first()).toBeVisible();
    // FIX: Usar .first() en caso de que haya múltiples elementos con "Algo difícil (5/7)"
    await expect(page.getByText('Algo difícil (5/7)').first()).toBeVisible();
  });

  test('debe crear un comentario anónimo', async ({ page }) => {
    const comentarioTexto = `Comentario anónimo E2E - ${Date.now()}`;
    
    await page.getByText('Agregar comentario').click();
    await expect(page.getByLabel('Tu comentario')).toBeVisible();
    
    await page.getByTestId('difficulty-3').click();
    await page.getByLabel('Comentar como anónimo').click();
    await page.getByLabel('Tu comentario').fill(comentarioTexto);
    await page.getByRole('button', { name: 'Publicar comentario' }).click();
    
    await expect(page.getByText(comentarioTexto)).toBeVisible();
    // FIX: Usar .first() para obtener el PRIMER "Anónimo" dentro de la sección
    const comentariosSection = page.locator('h5').filter({ hasText: 'Comentarios' }).locator('xpath=following-sibling::*[1]');
    await expect(comentariosSection.getByText('Anónimo').first()).toBeVisible();
  });

  test('el comentario debe persistir después de recargar la página (F5)', async ({ page }) => {
    const comentarioTexto = `Comentario persistente E2E - ${Date.now()}`;
    
    await createComment(page, comentarioTexto, 4);
    await expect(page.getByText(comentarioTexto)).toBeVisible();
    
    await page.reload();
    await expect(page.getByText('Agregar comentario')).toBeVisible();
    await expect(page.getByText(comentarioTexto)).toBeVisible();
  });

  test('debe requerir seleccionar dificultad antes de publicar', async ({ page }) => {
    await page.getByText('Agregar comentario').click();
    await expect(page.getByLabel('Tu comentario')).toBeVisible();
    
    await page.getByLabel('Tu comentario').fill('Comentario sin dificultad');
    
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('selecciona una dificultad');
      await dialog.accept();
    });
    
    await page.getByRole('button', { name: 'Publicar comentario' }).click();
    
    // Limpiar el textarea
    await page.getByLabel('Tu comentario').fill('');
    
    // El comentario no debe estar publicado
    const comentariosSection = page.locator('h5').filter({ hasText: 'Comentarios' }).locator('xpath=following-sibling::*[1]');
    await expect(comentariosSection.getByText('Comentario sin dificultad')).not.toBeVisible();
  });

  test('debe mostrar el contador de comentarios correcto', async ({ page }) => {
    const comentariosText = await page.getByText(/Comentarios \(\d+\)/).textContent();
    const initialCount = parseInt(comentariosText?.match(/\d+/)?.[0] || '0');
    
    const comentarioTexto = `Comentario contador - ${Date.now()}`;
    await createComment(page, comentarioTexto, 2);
    
    await expect(page.getByText(`Comentarios (${initialCount + 1})`)).toBeVisible();
  });

});