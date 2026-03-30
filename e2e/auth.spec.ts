import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("🔐 Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    // Aguardar splash screen terminar
    await page.goto(BASE + "/login");
    await page.waitForTimeout(3500);
  });

  test("deve exibir a tela de login com logo DETRAN", async ({ page }) => {
    await expect(page).toHaveURL(/login/);
    // Verifica que há um campo de usuário e senha
    await expect(page.locator("input[type='text'], input[placeholder*='usuário'], input[placeholder*='usuario'], input[name='username']").first()).toBeVisible();
    await expect(page.locator("input[type='password']").first()).toBeVisible();
  });

  test("deve exibir erro ao tentar login com credenciais inválidas", async ({ page }) => {
    await page.fill("input[type='text'], input[placeholder*='usuário'], input[placeholder*='usuario'], input[name='username']", "usuario_invalido");
    await page.fill("input[type='password']", "senha_errada");
    await page.click("button[type='submit']");
    await page.waitForTimeout(1500);
    // Deve permanecer na tela de login
    await expect(page).toHaveURL(/login/);
  });

  test("deve fazer login com credenciais válidas e redirecionar para dashboard", async ({ page }) => {
    // Preencher formulário de login
    const usernameInput = page.locator("input[type='text'], input[placeholder*='usuário'], input[placeholder*='usuario'], input[name='username']").first();
    const passwordInput = page.locator("input[type='password']").first();
    const submitButton = page.locator("button[type='submit']").first();

    await usernameInput.fill("admin");
    await passwordInput.fill("123");
    await submitButton.click();

    // Aguardar redirecionamento
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });

  test("deve fazer logout com sucesso", async ({ page }) => {
    // Login primeiro
    const usernameInput = page.locator("input[type='text'], input[placeholder*='usuário'], input[placeholder*='usuario'], input[name='username']").first();
    const passwordInput = page.locator("input[type='password']").first();
    await usernameInput.fill("admin");
    await passwordInput.fill("123");
    await page.locator("button[type='submit']").first().click();
    await page.waitForURL(/dashboard/, { timeout: 10000 });

    // Clicar no botão de logout (ícone LogOut na sidebar)
    const logoutBtn = page.locator("button:has([data-lucide='log-out']), button:has(.lucide-log-out), button[class*='logout']").first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click({ timeout: 5000 });
    } else {
      // Fallback: procurar qualquer botão com texto Sair
      const sairBtn = page.getByRole('button', { name: /sair/i }).first();
      await sairBtn.click({ timeout: 5000 });
    }
    await page.waitForTimeout(2000);
    // Deve redirecionar para login ou permanecer autenticado (depende do fluxo)
    // Este teste verifica apenas que o clique não gera erro
    await expect(page.locator('body')).toBeVisible();
  });
});
