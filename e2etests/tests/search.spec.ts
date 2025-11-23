import { test, expect } from '@playwright/test';

test.describe('Búsqueda de Ramos', () => {
  
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await page.goto("/");
    await expect(page.getByText('Ramos disponibles')).toBeVisible();
  });

  test.afterEach(async ({ request }) => {
    await request.post("/api/testing/reset");
  });

  test('debe buscar ramos por nombre', async ({ page }) => {
    // Contar ramos iniciales
    const ramosInicialesCount = await page.getByTestId(/ramo-card-/).count();
    expect(ramosInicialesCount).toBeGreaterThan(0);
    
    // Buscar por nombre
    await page.getByTestId('search-input').fill('Algoritmos');
    
    // Verificar que se filtran los resultados
    const ramosFiltrados = page.getByTestId(/ramo-card-/);
    const countFiltrado = await ramosFiltrados.count();
    
    // Debe haber al menos un resultado
    expect(countFiltrado).toBeGreaterThan(0);
    expect(countFiltrado).toBeLessThan(ramosInicialesCount);
    
    // Verificar que todos contienen "Algoritmos"
    for (let i = 0; i < countFiltrado; i++) {
      const ramoText = await ramosFiltrados.nth(i).textContent();
      expect(ramoText?.toLowerCase()).toContain('algoritmo');
    }
  });

  test('debe buscar ramos por código', async ({ page }) => {
    // Buscar por código (ej: CC3001)
    await page.getByTestId('search-input').fill('CC3001');
    
    // Verificar resultados
    const ramosFiltrados = page.getByTestId(/ramo-card-/);
    const count = await ramosFiltrados.count();
    
    // Debería encontrar exactamente ese ramo
    expect(count).toBeGreaterThanOrEqual(1);
    
    // Verificar que contiene el código
    const primerRamo = await ramosFiltrados.first().textContent();
    expect(primerRamo).toContain('CC3001');
  });

  test('debe mostrar sin resultados cuando no hay coincidencias', async ({ page }) => {
    // Buscar algo que no existe
    await page.getByTestId('search-input').fill('XXXNOEXISTE999');
    
    // No deberían aparecer ramos
    const ramosVisibles = page.getByTestId(/ramo-card-/);
    const count = await ramosVisibles.count();
    expect(count).toBe(0);
  });

  test('debe limpiar búsqueda y mostrar todos los ramos', async ({ page }) => {
    // Contar total inicial
    const totalInicial = await page.getByTestId(/ramo-card-/).count();
    
    // Buscar algo específico
    await page.getByTestId('search-input').fill('Estructuras');
    const filtrados = await page.getByTestId(/ramo-card-/).count();
    expect(filtrados).toBeLessThan(totalInicial);
    
    // Limpiar búsqueda
    await page.getByTestId('search-input').clear();
    
    // Deberían volver todos los ramos
    const totalFinal = await page.getByTestId(/ramo-card-/).count();
    expect(totalFinal).toBe(totalInicial);
  });

  test('búsqueda debe ser case-insensitive', async ({ page }) => {
    // Buscar en mayúsculas
    await page.getByTestId('search-input').fill('ALGORITMOS');
    const countMayus = await page.getByTestId(/ramo-card-/).count();
    
    // Limpiar y buscar en minúsculas
    await page.getByTestId('search-input').clear();
    await page.getByTestId('search-input').fill('algoritmos');
    const countMinus = await page.getByTestId(/ramo-card-/).count();
    
    // Deben dar el mismo resultado
    expect(countMayus).toBe(countMinus);
    expect(countMayus).toBeGreaterThan(0);
  });

  test('búsqueda funciona con filtro de tipo aplicado', async ({ page }) => {
    // Aplicar filtro de electivos
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Electivos' }).click();
    
    // Contar electivos
    const electivosTotal = await page.getByTestId(/ramo-card-/).count();
    
    // Buscar entre los electivos
    await page.getByTestId('search-input').fill('Taller');
    
    // Verificar que solo muestra electivos que coinciden
    const electivosFiltrados = await page.getByTestId(/ramo-card-/).count();
    expect(electivosFiltrados).toBeLessThan(electivosTotal);
    
    // Verificar que todos son electivos Y contienen "Taller"
    for (let i = 0; i < electivosFiltrados; i++) {
      const ramoText = await page.getByTestId(/ramo-card-/).nth(i).textContent();
      expect(ramoText).toContain('Electivo');
      expect(ramoText?.toLowerCase()).toContain('taller');
    }
  });
});