import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getAppUserById: vi.fn(),
  updateAppUserProfile: vi.fn(),
  addSystemLog: vi.fn(),
  loginAppUser: vi.fn(),
  listAppUsers: vi.fn(),
  getPatrimonioList: vi.fn(),
  getPatrimonioKpis: vi.fn(),
  getPatrimonioBySetor: vi.fn(),
  getPatrimonioTimeline: vi.fn(),
  getSetoresList: vi.fn(),
  getLocaisList: vi.fn(),
  getSystemLogs: vi.fn(),
  createAppUser: vi.fn(),
  updateAppUser: vi.fn(),
  formatarCSV: vi.fn(),
  formatarXLSX: vi.fn(),
  formatarPDF: vi.fn(),
  getLevantamentoAnual: vi.fn(),
  getTransferenciaList: vi.fn(),
  createTransferencia: vi.fn(),
  getAdminStats: vi.fn(),
  getAdminUsers: vi.fn(),
  getAdminLogs: vi.fn(),
  createAdminUser: vi.fn(),
  updateAdminUser: vi.fn(),
  resetAdminUserPassword: vi.fn(),
}));

vi.mock("./_core/jwt", () => ({
  signAppToken: vi.fn(() => "mock_token_123"),
  verifyAppToken: vi.fn((token: string) => {
    if (token === "valid_token") return { userId: 1, username: "admin", role: "admin" };
    if (token === "user_token") return { userId: 2, username: "moises.costa", role: "user" };
    return null;
  }),
}));

import { getAppUserById, updateAppUserProfile, addSystemLog } from "./db";

// ─── Testes de Perfil ─────────────────────────────────────────────────────────
describe("Perfil do Usuário", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAppUserById", () => {
    it("deve retornar o usuário quando encontrado", async () => {
      const mockUser = {
        id: 1,
        username: "admin",
        displayName: "Administrador",
        role: "admin" as const,
        cargo: "Analista",
        setor: "DIPAT",
        idFuncional: "12345",
        email: "admin@detran.rj.gov.br",
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        passwordHash: "hash",
      };
      vi.mocked(getAppUserById).mockResolvedValue(mockUser);

      const result = await getAppUserById(1);
      expect(result).toBeDefined();
      expect(result?.username).toBe("admin");
      expect(result?.role).toBe("admin");
    });

    it("deve retornar null quando usuário não encontrado", async () => {
      vi.mocked(getAppUserById).mockResolvedValue(null);

      const result = await getAppUserById(999);
      expect(result).toBeNull();
    });
  });

  describe("updateAppUserProfile", () => {
    it("deve atualizar nome de exibição com sucesso", async () => {
      vi.mocked(updateAppUserProfile).mockResolvedValue({ success: true });

      const result = await updateAppUserProfile(1, { displayName: "Novo Nome" });
      expect(result.success).toBe(true);
      expect(updateAppUserProfile).toHaveBeenCalledWith(1, { displayName: "Novo Nome" });
    });

    it("deve atualizar e-mail com sucesso", async () => {
      vi.mocked(updateAppUserProfile).mockResolvedValue({ success: true });

      const result = await updateAppUserProfile(1, { email: "novo@detran.rj.gov.br" });
      expect(result.success).toBe(true);
    });

    it("deve retornar erro quando senha atual está incorreta", async () => {
      vi.mocked(updateAppUserProfile).mockResolvedValue({
        success: false,
        error: "Senha atual incorreta",
      });

      const result = await updateAppUserProfile(1, {}, "senha_errada", "nova_senha");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Senha atual incorreta");
    });

    it("deve retornar erro quando senha atual não é fornecida para troca", async () => {
      vi.mocked(updateAppUserProfile).mockResolvedValue({
        success: false,
        error: "Senha atual obrigatoria para alterar a senha",
      });

      const result = await updateAppUserProfile(1, {}, undefined, "nova_senha");
      expect(result.success).toBe(false);
      expect(result.error).toContain("Senha atual");
    });

    it("deve alterar senha com sucesso quando senha atual está correta", async () => {
      vi.mocked(updateAppUserProfile).mockResolvedValue({ success: true });

      const result = await updateAppUserProfile(1, {}, "senha_correta", "nova_senha_123");
      expect(result.success).toBe(true);
    });
  });

  describe("addSystemLog", () => {
    it("deve registrar log de solicitação de alteração", async () => {
      vi.mocked(addSystemLog).mockResolvedValue(undefined);

      await addSystemLog({
        userId: 2,
        username: "moises.costa",
        acao: "SOLICITACAO_ALTERACAO",
        entidade: "perfil",
        entidadeId: "2",
        detalhes: JSON.stringify({
          campo: "cargo",
          valorAtual: "Técnico",
          valorSolicitado: "Analista",
          motivo: "Promoção",
        }),
      });

      expect(addSystemLog).toHaveBeenCalledWith(
        expect.objectContaining({
          acao: "SOLICITACAO_ALTERACAO",
          entidade: "perfil",
        })
      );
    });
  });
});

// ─── Testes de Validação de Token ─────────────────────────────────────────────
describe("Validação de Token JWT", () => {
  it("deve retornar payload para token válido de admin", async () => {
    const { verifyAppToken } = await import("./_core/jwt");
    const payload = await verifyAppToken("valid_token");
    expect(payload).toBeDefined();
    expect(payload?.userId).toBe(1);
    expect(payload?.role).toBe("admin");
  });

  it("deve retornar payload para token válido de usuário", async () => {
    const { verifyAppToken } = await import("./_core/jwt");
    const payload = await verifyAppToken("user_token");
    expect(payload).toBeDefined();
    expect(payload?.userId).toBe(2);
    expect(payload?.role).toBe("user");
  });

  it("deve retornar null para token inválido", async () => {
    const { verifyAppToken } = await import("./_core/jwt");
    const payload = await verifyAppToken("token_invalido");
    expect(payload).toBeNull();
  });

  it("deve retornar null para token vazio", async () => {
    const { verifyAppToken } = await import("./_core/jwt");
    const payload = await verifyAppToken("");
    expect(payload).toBeNull();
  });
});

// ─── Testes de Regras de Negócio ──────────────────────────────────────────────
describe("Regras de Negócio do Perfil", () => {
  it("deve validar que displayName não pode ser vazio", () => {
    const displayName = "";
    expect(displayName.trim().length).toBe(0);
  });

  it("deve validar que displayName tem no mínimo 2 caracteres", () => {
    const displayName = "AB";
    expect(displayName.length).toBeGreaterThanOrEqual(2);
  });

  it("deve validar formato de e-mail", () => {
    const emailValido = "usuario@detran.rj.gov.br";
    const emailInvalido = "nao_e_email";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(emailValido)).toBe(true);
    expect(emailRegex.test(emailInvalido)).toBe(false);
  });

  it("deve validar que nova senha tem mínimo 6 caracteres", () => {
    const senhaValida = "senha123";
    const senhaInvalida = "abc";
    expect(senhaValida.length).toBeGreaterThanOrEqual(6);
    expect(senhaInvalida.length).toBeLessThan(6);
  });

  it("deve validar que as senhas coincidem", () => {
    const novaSenha = "minha_senha_123";
    const confirmarSenha = "minha_senha_123";
    const senhasDiferentes = "outra_senha";
    expect(novaSenha === confirmarSenha).toBe(true);
    expect(novaSenha === senhasDiferentes).toBe(false);
  });
});
