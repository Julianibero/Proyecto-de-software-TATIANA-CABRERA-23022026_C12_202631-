/**
 * @file e2e.spec.js
 * @description Pruebas End-to-End con Playwright
 * Entregable 2 - Talento Sin Fronteras
 * Escenarios: Registro, Login, Gestión de proyectos
 */

const { test, expect } = require("@playwright/test");

// URL base del frontend en producción
const BASE_URL = "https://talento-sin-fronteras.vercel.app";

// Datos de prueba E2E
const testUser = {
  nombre: "Usuario E2E",
  email: `e2e_${Date.now()}@test.com`,
  password: "E2E_Password123!",
  rol: "creador",
};

// ─── E2E-01: Flujo completo de Registro ──────────────────────────────────────
test.describe("🌐 E2E-01: Registro de nuevo usuario", () => {
  test("Usuario se registra exitosamente desde el formulario web", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/register`);

    // Verificar que la página de registro cargó
    await expect(page).toHaveTitle(/talento|registro|sin fronteras/i);

    // Llenar el formulario
    await page.fill('[name="nombre"], #nombre, [placeholder*="nombre"]', testUser.nombre);
    await page.fill('[name="email"], #email, [type="email"]', testUser.email);
    await page.fill('[name="password"], #password, [type="password"]', testUser.password);

    // Seleccionar rol si existe el campo
    const rolSelect = page.locator('select[name="rol"], #rol');
    if (await rolSelect.isVisible()) {
      await rolSelect.selectOption("creador");
    }

    // Enviar formulario
    await page.click('[type="submit"], button:has-text("Registrar"), button:has-text("Crear cuenta")');

    // Verificar redirección o mensaje de éxito
    await expect(
      page.locator("text=/bienvenido|registro exitoso|cuenta creada/i")
    ).toBeVisible({ timeout: 8000 }).catch(async () => {
      // Si redirige al login o al dashboard, también es éxito
      await expect(page).toHaveURL(/login|dashboard|home|perfil/i);
    });
  });

  test("El formulario muestra error si el email ya está registrado", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/register`);

    // Intentar registrar con email ya usado
    await page.fill('[name="email"], #email, [type="email"]', "ya_registrado@test.com");
    await page.fill('[name="password"], [type="password"]', "AlgunaPass123!");
    await page.fill('[name="nombre"], #nombre', "Duplicado");

    await page.click('[type="submit"], button:has-text("Registrar")');

    await expect(
      page.locator("text=/ya existe|email en uso|registrado/i")
    ).toBeVisible({ timeout: 6000 });
  });
});

// ─── E2E-02: Flujo completo de Login ─────────────────────────────────────────
test.describe("🌐 E2E-02: Login de usuario", () => {
  test("Usuario inicia sesión y accede al dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('[name="email"], [type="email"]', testUser.email);
    await page.fill('[name="password"], [type="password"]', testUser.password);

    await page.click('[type="submit"], button:has-text("Ingresar"), button:has-text("Login"), button:has-text("Entrar")');

    // Verificar acceso al área protegida
    await expect(page).toHaveURL(/dashboard|home|perfil|proyectos/i, {
      timeout: 10000,
    });

    // Verificar que el nombre del usuario aparece en la UI
    await expect(
      page.locator(`text=${testUser.nombre}`).or(
        page.locator("[data-testid='user-name']")
      )
    ).toBeVisible({ timeout: 5000 });
  });

  test("Login con credenciales incorrectas muestra mensaje de error", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('[type="email"]', "falso@email.com");
    await page.fill('[type="password"]', "WrongPass999");

    await page.click('[type="submit"], button:has-text("Ingresar")');

    await expect(
      page.locator("text=/contraseña incorrecta|credenciales inválidas|error/i")
    ).toBeVisible({ timeout: 6000 });

    // Verificar que NO redirigió
    await expect(page).toHaveURL(/login/i);
  });

  test("Sesión persiste después de recargar la página", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[type="email"]', testUser.email);
    await page.fill('[type="password"]', testUser.password);
    await page.click('[type="submit"]');

    await page.waitForURL(/dashboard|home|proyectos/i);
    await page.reload();

    // Después de recargar debe seguir autenticado
    await expect(page).not.toHaveURL(/login/i);
  });
});

// ─── E2E-03: Creación y visualización de proyecto ─────────────────────────────
test.describe("🌐 E2E-03: Gestión de proyectos", () => {
  // Hook para autenticar antes de cada prueba
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[type="email"]', testUser.email);
    await page.fill('[type="password"]', testUser.password);
    await page.click('[type="submit"]');
    await page.waitForURL(/dashboard|home|proyectos/i);
  });

  test("Usuario crea un nuevo proyecto desde el formulario", async ({
    page,
  }) => {
    // Navegar a crear proyecto
    await page.click('a:has-text("Nuevo proyecto"), button:has-text("Crear proyecto"), [href*="nuevo"]');

    await page.fill('[name="titulo"], #titulo', "Proyecto E2E Test");
    await page.fill('[name="descripcion"], #descripcion, textarea', "Proyecto creado durante prueba E2E automatizada con Playwright.");

    // Campo de tecnologías (puede ser input de texto o tags)
    const techInput = page.locator('[name="tecnologias"], #tecnologias, [placeholder*="tecnolog"]');
    if (await techInput.isVisible()) {
      await techInput.fill("React, Node.js, MongoDB");
    }

    await page.click('[type="submit"], button:has-text("Publicar"), button:has-text("Crear")');

    // Verificar que el proyecto aparece en la lista
    await expect(
      page.locator("text=Proyecto E2E Test")
    ).toBeVisible({ timeout: 8000 });
  });

  test("El listado de proyectos muestra tarjetas con título y descripción", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/proyectos`);

    // Verificar que hay al menos una tarjeta de proyecto
    const cards = page.locator("[data-testid='proyecto-card'], .project-card, .card");
    await expect(cards.first()).toBeVisible({ timeout: 6000 });

    // Verificar estructura mínima de la tarjeta
    const firstCard = cards.first();
    await expect(firstCard).toContainText(/.+/); // Tiene algún texto
  });

  test("Usuario puede ver el detalle de un proyecto", async ({ page }) => {
    await page.goto(`${BASE_URL}/proyectos`);

    // Hacer clic en el primer proyecto disponible
    await page.click(".project-card:first-child, [data-testid='proyecto-card']:first-child, a[href*='/proyectos/']");

    // Verificar que cargó la página de detalle
    await expect(page).toHaveURL(/\/proyectos\/.+/i);
    await expect(page.locator("h1, h2")).toBeVisible();
  });
});
