import { test, expect, Page } from "@playwright/test";

const BASE = "http://localhost:3000";

// Helper para fazer login
async function loginAs(page: Page, username: string, password: string) {
  await page.goto(BASE + "/login");
  await page.waitForTimeout(3500); // splash screen
  const usernameInput = page.locator("input[type='text'], input[name='username']").first();
  const passwordInput = page.locator("input[type='password']").first();
  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await page.locator("button[type='submit']").first().click();
  await page.waitForURL(/dashboard/, { timeout: 10000 });
}

test.describe("🧭 Navegação Principal", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin", "123");
  });

  test("deve exibir o menu lateral após login", async ({ page }) => {
    // Sidebar deve estar visível
    await expect(page.locator("nav, aside, [data-sidebar]").first()).toBeVisible();
  });

  test("deve navegar para a página de Patrimônios", async ({ page }) => {
    await page.click("a[href='/patrimonio'], a[href*='patrimonio']");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/patrimonio/);
  });

  test("deve navegar para a página de Transferência", async ({ page }) => {
    await page.click("a[href='/transferencia']");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/transferencia/);
  });

  test("deve navegar para a página de Relatórios", async ({ page }) => {
    await page.click("a[href='/relatorios']");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/relatorios/);
  });

  test("deve navegar para a página de Ajuda", async ({ page }) => {
    await page.click("a[href='/ajuda']");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/ajuda/);
  });

  test("deve navegar para o Painel Admin (usuário admin)", async ({ page }) => {
    await page.click("a[href='/admin']");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/admin/);
  });

  test("deve navegar para Meu Perfil", async ({ page }) => {
    await page.click("a[href='/perfil']");
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/perfil/);
  });
});

test.describe("📊 Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin", "123");
  });

  test("deve exibir KPIs no dashboard", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForTimeout(2000);
    // Verifica que há pelo menos um card de KPI
    const cards = page.locator(".card, [class*='card'], [class*='kpi']");
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
  });

  test("deve exibir gráficos no dashboard", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForTimeout(2000);
    // Verifica que há elementos de gráfico
    const charts = page.locator("canvas, svg[class*='recharts'], [class*='chart']");
    await expect(charts.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("📋 Patrimônios", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin", "123");
    await page.goto(BASE + "/patrimonio");
    await page.waitForTimeout(2000);
  });

  test("deve exibir a tabela de patrimônios", async ({ page }) => {
    const table = page.locator("table, [role='table']").first();
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test("deve exibir campo de busca", async ({ page }) => {
    const searchInput = page.locator("input[placeholder*='buscar'], input[placeholder*='pesquisar'], input[type='search']").first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
  });

  test("deve filtrar patrimônios ao digitar na busca", async ({ page }) => {
    const searchInput = page.locator("input[placeholder*='buscar'], input[placeholder*='pesquisar'], input[type='search']").first();
    await searchInput.fill("computador");
    await page.waitForTimeout(1000);
    // Tabela deve atualizar (não verificamos o conteúdo exato pois depende dos dados)
    await expect(page.locator("table, [role='table']").first()).toBeVisible();
  });
});

test.describe("🔄 Transferência", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin", "123");
    await page.goto(BASE + "/transferencia");
    await page.waitForTimeout(2000);
  });

  test("deve exibir o formulário de transferência", async ({ page }) => {
    // Verifica que há seções colapsáveis
    const sections = page.locator("[class*='accordion'], [class*='collapsible'], button[class*='trigger']");
    await expect(sections.first()).toBeVisible({ timeout: 5000 });
  });

  test("deve exibir botão de gerar PDF", async ({ page }) => {
    const pdfButton = page.locator("button:has-text('PDF'), button:has-text('Gerar'), button:has-text('Emitir')").first();
    await expect(pdfButton).toBeVisible({ timeout: 5000 });
  });
});

test.describe("📈 Relatórios", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin", "123");
    await page.goto(BASE + "/relatorios");
    await page.waitForTimeout(2000);
  });

  test("deve exibir os filtros de relatório", async ({ page }) => {
    // Verifica que há selects de filtro
    const selects = page.locator("select, [role='combobox']");
    await expect(selects.first()).toBeVisible({ timeout: 5000 });
  });

  test("deve exibir os botões de exportação", async ({ page }) => {
    const exportButtons = page.locator("button:has-text('CSV'), button:has-text('XLSX'), button:has-text('PDF')");
    await expect(exportButtons.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("🛡️ Controle de Acesso", () => {
  test("usuário não-admin não deve ver o menu Admin", async ({ page }) => {
    await loginAs(page, "moises.costa", "123");
    // Verifica que o link /admin não está no menu
    const adminLink = page.locator("a[href='/admin']");
    await expect(adminLink).not.toBeVisible();
  });

  test("usuário não autenticado deve ser redirecionado para login", async ({ page }) => {
    // Limpar cookies
    await page.context().clearCookies();
    await page.goto(BASE + "/dashboard");
    await page.waitForTimeout(3500);
    await expect(page).toHaveURL(/login/);
  });
});
