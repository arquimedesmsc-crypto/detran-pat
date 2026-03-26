import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db helpers
vi.mock("./db", () => ({
  getPatrimonioItems: vi.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        patrimonio: 12345,
        descricao: "Computador Desktop",
        setor: "15 DSI",
        local: "Sala TI",
        dataIncorporacao: new Date("2025-06-01"),
        valor: "3500.00",
        status: "localizado",
        tipo: "informatica",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 1,
  }),
  getPatrimonioKPIs: vi.fn().mockResolvedValue({
    total: 1207,
    byStatus: [
      { status: "localizado", total: 985 },
      { status: "nao_localizado", total: 222 },
    ],
    byTipo: [
      { tipo: "mobiliario", total: 514 },
      { tipo: "informatica", total: 482 },
    ],
    valorNaoLocalizado: 15432.50,
  }),
  getPatrimonioBySetor: vi.fn().mockResolvedValue([
    { setor: "12 DAT", total: 203 },
    { setor: "15 DSI", total: 170 },
  ]),
  getPatrimonioTimeline: vi.fn().mockResolvedValue([
    { mes: "2025-06", total: 45 },
    { mes: "2025-07", total: 62 },
  ]),
  getSetoresList: vi.fn().mockResolvedValue(["12 DAT", "15 DSI", "DTIC LEVANTAMENTO"]),
  getLocaisList: vi.fn().mockResolvedValue(["Sala TI", "Arquivo", "Recepção"]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("patrimonio.list", () => {
  it("retorna itens e total", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.patrimonio.list({ page: 1, pageSize: 50 });
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].patrimonio).toBe(12345);
  });

  it("aceita filtros de busca", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.patrimonio.list({
      search: "Computador",
      setor: "15 DSI",
      status: "localizado",
      tipo: "informatica",
      page: 1,
      pageSize: 50,
    });
    expect(result).toBeDefined();
    expect(result.items).toBeDefined();
  });

  it("valida pageSize máximo de 200", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.patrimonio.list({ page: 1, pageSize: 201 })
    ).rejects.toThrow();
  });
});

describe("patrimonio.kpis", () => {
  it("retorna KPIs com total e distribuições", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const kpis = await caller.patrimonio.kpis();
    expect(kpis?.total).toBe(1207);
    expect(kpis?.byStatus).toHaveLength(2);
    expect(kpis?.byTipo).toHaveLength(2);
    expect(kpis?.valorNaoLocalizado).toBe(15432.50);
  });
});

describe("patrimonio.bySetor", () => {
  it("retorna distribuição por setor", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.patrimonio.bySetor();
    expect(result).toHaveLength(2);
    expect(result[0].setor).toBe("12 DAT");
    expect(result[0].total).toBe(203);
  });
});

describe("patrimonio.timeline", () => {
  it("retorna dados de timeline por mês", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.patrimonio.timeline();
    expect(result).toHaveLength(2);
    expect(result[0].mes).toBe("2025-06");
  });
});

describe("patrimonio.setores", () => {
  it("retorna lista de setores únicos", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.patrimonio.setores();
    expect(result).toContain("12 DAT");
    expect(result).toContain("15 DSI");
  });
});

describe("patrimonio.locais", () => {
  it("retorna lista de locais únicos", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.patrimonio.locais();
    expect(result).toContain("Sala TI");
  });
});

describe("auth.logout", () => {
  it("limpa o cookie de sessão", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
