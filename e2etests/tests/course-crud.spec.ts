import { test, expect } from '@playwright/test';
import { loginWith } from './helper';

test.describe('CRUD de Cursos (Admin)', () => {
  
  test.beforeEach(async ({ request }) => {
    await request.post("/api/testing/reset");
  });

  test.afterEach(async ({ request }) => {
    await request.post("/api/testing/reset");
  });

  test.describe('Acceso protegido al panel de administración', () => {
    
    test('admin puede acceder al panel de administración', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      
      // Navegar al panel de admin
      await page.getByText('Panel de administrador').click();
      
      // Verificar que está en la página de admin
      await expect(page).toHaveURL('/admin');
      await expect(page.getByText('Administrar Ramos')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Agregar ramo' })).toBeVisible();
    });

    test('usuario normal no ve el link al panel de administración', async ({ page }) => {
      await loginWith(page, 'user1', 'user123');
      
      // Ir a la página principal
      await page.goto('/');
      
      // El link "Panel de administrador" no debería estar visible para usuarios normales
      await expect(page.getByText('Panel de administrador')).not.toBeVisible();
    });

    test('usuario no autenticado no puede crear cursos', async ({ page }) => {
      // Acceder directamente sin login
      await page.goto('/admin');
      
      // La página se muestra, pero al intentar crear debería fallar
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      await page.getByLabel('Nombre').fill('Curso sin auth');
      await page.getByLabel('Código').fill('NOAUTH');
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      // No debería aparecer "Ramo agregado" porque el backend rechaza la petición
      await expect(page.getByText('Ramo agregado')).not.toBeVisible();
    });
  });

  test.describe('Crear curso (CREATE)', () => {
    
    test('admin puede crear un nuevo curso obligatorio', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      await expect(page.getByText('Administrar Ramos')).toBeVisible();
      
      // Abrir formulario de agregar
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      // Llenar el formulario
      const timestamp = Date.now();
      const nombreCurso = `Curso de Prueba E2E ${timestamp}`;
      const codigoCurso = `TEST${timestamp}`;
      
      await page.getByLabel('Nombre').fill(nombreCurso);
      await page.getByLabel('Código').fill(codigoCurso);
      // El checkbox "Obligatorio" está marcado por defecto
      
      // Crear el curso
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      // Verificar mensaje de éxito
      await expect(page.getByText('Ramo agregado')).toBeVisible();
      
      // Verificar que aparece en la lista
      await expect(page.getByText(codigoCurso)).toBeVisible();
      await expect(page.getByText(nombreCurso)).toBeVisible();
    });

    test('admin puede crear un curso electivo', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      const timestamp = Date.now();
      const nombreCurso = `Electivo E2E ${timestamp}`;
      const codigoCurso = `ELEC${timestamp}`;
      
      await page.getByLabel('Nombre').fill(nombreCurso);
      await page.getByLabel('Código').fill(codigoCurso);
      
      // Desmarcar "Obligatorio" para hacerlo electivo
      await page.getByLabel('Obligatorio').click();
      
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      await expect(page.getByText('Ramo agregado')).toBeVisible();
      await expect(page.getByText(nombreCurso)).toBeVisible();
    });

    test('no permite crear curso sin nombre o código', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      // Intentar crear sin llenar campos
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      // Debería mostrar mensaje de error
      await expect(page.getByText('Nombre y codigo requeridos')).toBeVisible();
    });

    test('admin puede cancelar la creación de curso', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      // Abrir formulario
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      await expect(page.getByLabel('Nombre')).toBeVisible();
      
      // Cancelar
      await page.getByRole('button', { name: 'Cancelar' }).click();
      
      // El formulario debería cerrarse
      await expect(page.getByLabel('Nombre')).not.toBeVisible();
    });
  });

  test.describe('Listar cursos (READ)', () => {
    
    test('admin puede ver la lista de cursos', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      // Verificar que se muestran cursos existentes
      await expect(page.getByText('CC1000')).toBeVisible();
      await expect(page.getByText('CC3001')).toBeVisible();
      
      // Verificar que cada curso tiene botones de acción
      const primerCurso = page.locator('li').first();
      await expect(primerCurso.getByRole('button', { name: 'Eliminar' })).toBeVisible();
      await expect(primerCurso.getByRole('button', { name: 'Editar' })).toBeVisible();
    });
  });

  test.describe('Editar curso (UPDATE)', () => {
    
    test('admin puede editar el nombre de un curso', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      await expect(page.getByText('Administrar Ramos')).toBeVisible();
      
      // Primero crear un curso para editarlo
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      const timestamp = Date.now();
      const nombreOriginal = `Curso Original ${timestamp}`;
      const codigoCurso = `EDIT${timestamp}`;
      
      await page.getByLabel('Nombre').fill(nombreOriginal);
      await page.getByLabel('Código').fill(codigoCurso);
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      await expect(page.getByText(nombreOriginal)).toBeVisible();
      
      // Abrir modal de edición
      const courseRow = page.locator('li', { hasText: codigoCurso });
      await courseRow.getByRole('button', { name: 'Editar' }).click();
      
      // Verificar que el modal se abre con los datos actuales
      await expect(page.getByRole('textbox', { name: 'Nombre' })).toHaveValue(nombreOriginal);
      
      // Cambiar el nombre
      const nombreNuevo = `Curso Editado ${timestamp}`;
      await page.getByRole('textbox', { name: 'Nombre' }).clear();
      await page.getByRole('textbox', { name: 'Nombre' }).fill(nombreNuevo);
      
      // Manejar el alert de confirmación
      page.once('dialog', dialog => dialog.accept());
      
      // Guardar cambios
      await page.getByRole('button', { name: 'Actualizar' }).click();
      
      // Verificar que el nombre cambió en la lista
      await expect(page.getByText(nombreNuevo)).toBeVisible();
      await expect(page.getByText(nombreOriginal)).not.toBeVisible();
    });

    test('admin puede cambiar un curso de obligatorio a electivo', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      // Crear un curso obligatorio
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      const timestamp = Date.now();
      const nombreCurso = `Curso Tipo ${timestamp}`;
      const codigoCurso = `TIPO${timestamp}`;
      
      await page.getByLabel('Nombre').fill(nombreCurso);
      await page.getByLabel('Código').fill(codigoCurso);
      // Por defecto es obligatorio
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      await expect(page.getByText(nombreCurso)).toBeVisible();
      
      // Abrir modal de edición
      const courseRow = page.locator('li', { hasText: codigoCurso });
      await courseRow.getByRole('button', { name: 'Editar' }).click();
      
      // Cambiar a electivo (desmarcar obligatorio)
      await page.getByLabel('Obligatorio').click();
      
      page.once('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Actualizar' }).click();
      
      // El curso debería seguir en la lista
      await expect(page.getByText(nombreCurso)).toBeVisible();
    });

    test('admin puede cerrar el modal sin guardar cambios', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      // Abrir modal del primer curso
      const primerCurso = page.locator('li').first();
      const nombreOriginal = await primerCurso.locator('span').first().textContent();
      
      await primerCurso.getByRole('button', { name: 'Editar' }).click();
      
      // Cambiar el nombre pero no guardar
      await page.getByRole('textbox', { name: 'Nombre' }).clear();
      await page.getByRole('textbox', { name: 'Nombre' }).fill('Nombre que no se guardará');
      
      // Cerrar el modal haciendo click fuera (o presionando Escape)
      await page.keyboard.press('Escape');
      
      // El nombre original debería mantenerse
      await expect(page.getByText(nombreOriginal || '')).toBeVisible();
    });
  });

  test.describe('Eliminar curso (DELETE)', () => {
    
    test('admin puede eliminar un curso', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      await expect(page.getByText('Administrar Ramos')).toBeVisible();
      
      // Primero crear un curso para eliminarlo
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      const timestamp = Date.now();
      const nombreCurso = `Curso para eliminar ${timestamp}`;
      const codigoCurso = `DEL${timestamp}`;
      
      await page.getByLabel('Nombre').fill(nombreCurso);
      await page.getByLabel('Código').fill(codigoCurso);
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      await expect(page.getByText(nombreCurso)).toBeVisible();
      
      // Encontrar la fila del curso
      const courseRow = page.locator('li', { hasText: codigoCurso });
      
      // Manejar los diálogos (confirm + alert)
      page.once('dialog', dialog => dialog.accept()); // Confirmar eliminación
      
      await courseRow.getByRole('button', { name: 'Eliminar' }).click();
      
      // Manejar el alert de éxito
      page.once('dialog', dialog => dialog.accept());
      
      // Verificar que ya no aparece
      await expect(page.getByText(nombreCurso)).not.toBeVisible();
    });

    test('cancelar eliminación mantiene el curso', async ({ page }) => {
      await loginWith(page, 'admin', 'admin123');
      await page.getByText('Panel de administrador').click();
      
      // Crear un curso
      await page.getByRole('button', { name: 'Agregar ramo' }).click();
      
      const timestamp = Date.now();
      const nombreCurso = `Curso para cancelar ${timestamp}`;
      const codigoCurso = `CANC${timestamp}`;
      
      await page.getByLabel('Nombre').fill(nombreCurso);
      await page.getByLabel('Código').fill(codigoCurso);
      await page.getByRole('button', { name: 'Crear ramo' }).click();
      
      await expect(page.getByText(nombreCurso)).toBeVisible();
      
      // Intentar eliminar pero cancelar
      const courseRow = page.locator('li', { hasText: codigoCurso });
      
      page.once('dialog', dialog => dialog.dismiss()); // Cancelar
      await courseRow.getByRole('button', { name: 'Eliminar' }).click();
      
      // El curso debe seguir visible
      await expect(page.getByText(nombreCurso)).toBeVisible();
    });
  });
});