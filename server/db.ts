import { and, asc, count, desc, eq, gte, isNull, like, lte, not, or, sql, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, patrimonioItems, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Patrimônio Queries ───────────────────────────────────────────────────────

export interface PatrimonioFilters {
  search?: string;
  setor?: string;
  local?: string;
  status?: "localizado" | "nao_localizado";
  tipo?: "informatica" | "mobiliario" | "eletrodomestico" | "veiculo" | "outros";
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// Cache simples em memória para evitar roundtrips repetidos
const _cache = new Map<string, { data: any; ts: number }>();
function cacheGet<T>(key: string, ttlMs: number): T | null {
  const entry = _cache.get(key);
  if (entry && Date.now() - entry.ts < ttlMs) return entry.data as T;
  return null;
}
function cacheSet(key: string, data: any) {
  _cache.set(key, { data, ts: Date.now() });
}
export function invalidatePatrimonioCache() {
  _cache.clear();
}

export async function getPatrimonioItems(filters: PatrimonioFilters = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const {
    search,
    setor,
    local,
    status,
    tipo,
    dataInicio,
    dataFim,
    page = 1,
    pageSize = 25,
    sortBy = "patrimonio",
    sortDir = "asc",
  } = filters;

  const conditions = [];

  if (search) {
    const trimmed = search.trim();
    // Busca numérica exata por número de patrimônio (usa índice)
    const numSearch = Number(trimmed);
    if (!isNaN(numSearch) && trimmed !== "") {
      conditions.push(eq(patrimonioItems.patrimonio, numSearch));
    } else {
      // Busca textual: usa LIKE %termo% apenas em descricao (mais relevante)
      // e prefixo em setor/local para aproveitar índices parcialmente
      conditions.push(
        or(
          like(patrimonioItems.descricao, `%${trimmed}%`),
          like(patrimonioItems.setor, `${trimmed}%`),
          like(patrimonioItems.local, `${trimmed}%`)
        )
      );
    }
  }
  if (setor) conditions.push(eq(patrimonioItems.setor, setor));
  if (local) conditions.push(eq(patrimonioItems.local, local));
  if (status) conditions.push(eq(patrimonioItems.status, status));
  if (tipo) conditions.push(eq(patrimonioItems.tipo, tipo));
  if (dataInicio) conditions.push(gte(patrimonioItems.dataIncorporacao, new Date(dataInicio)));
  if (dataFim) conditions.push(lte(patrimonioItems.dataIncorporacao, new Date(dataFim)));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const colMap: Record<string, any> = {
    patrimonio: patrimonioItems.patrimonio,
    descricao: patrimonioItems.descricao,
    setor: patrimonioItems.setor,
    local: patrimonioItems.local,
    dataIncorporacao: patrimonioItems.dataIncorporacao,
    valor: patrimonioItems.valor,
    status: patrimonioItems.status,
    tipo: patrimonioItems.tipo,
  };

  const orderCol = colMap[sortBy] ?? patrimonioItems.patrimonio;
  const orderFn = sortDir === "desc" ? desc : asc;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(patrimonioItems)
      .where(where)
      .orderBy(orderFn(orderCol))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: count() }).from(patrimonioItems).where(where),
  ]);

  return { items, total: totalResult[0]?.count ?? 0 };
}

interface KPIResult {
  total: number;
  byStatus: { status: string; total: number }[];
  byTipo: { tipo: string; total: number }[];
  valorNaoLocalizado: number;
  valorTotal: number;
  valorLocalizado: number;
}

export async function getPatrimonioKPIs(): Promise<KPIResult | null> {
  const CACHE_KEY = "kpis";
  const cached = cacheGet<KPIResult>(CACHE_KEY, 30_000);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return null;

  const [totals, byStatus, byTipo, valorNaoLocalizado, valorTotal] = await Promise.all([
    db.select({ total: count() }).from(patrimonioItems),
    db
      .select({ status: patrimonioItems.status, total: count() })
      .from(patrimonioItems)
      .groupBy(patrimonioItems.status),
    db
      .select({ tipo: patrimonioItems.tipo, total: count() })
      .from(patrimonioItems)
      .groupBy(patrimonioItems.tipo),
    db
      .select({ totalValor: sum(patrimonioItems.valor) })
      .from(patrimonioItems)
      .where(eq(patrimonioItems.status, "nao_localizado")),
    db
      .select({ totalValor: sum(patrimonioItems.valor) })
      .from(patrimonioItems),
  ]);

  const vTotal = Number(valorTotal[0]?.totalValor ?? 0);
  const vNaoLocalizado = Number(valorNaoLocalizado[0]?.totalValor ?? 0);
  // Valor localizado = total declarado - não localizado (planilha só declara valor para não localizados)
  const vLocalizado = vTotal - vNaoLocalizado;

  const result = {
    total: totals[0]?.total ?? 0,
    byStatus,
    byTipo,
    valorNaoLocalizado: vNaoLocalizado,
    valorTotal: vTotal,
    valorLocalizado: vLocalizado,
  };

  cacheSet(CACHE_KEY, result);
  return result;
}

export async function getPatrimonioBySetor() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({ setor: patrimonioItems.setor, total: count() })
    .from(patrimonioItems)
    .where(not(isNull(patrimonioItems.setor)))
    .groupBy(patrimonioItems.setor)
    .orderBy(desc(count()))
    .limit(15);
}

export async function getPatrimonioTimeline() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      mes: sql<string>`DATE_FORMAT(data_incorporacao, '%Y-%m')`,
      total: count(),
    })
    .from(patrimonioItems)
    .where(not(isNull(patrimonioItems.dataIncorporacao)))
    .groupBy(sql`DATE_FORMAT(data_incorporacao, '%Y-%m')`)
    .orderBy(sql`DATE_FORMAT(data_incorporacao, '%Y-%m')`);
}

export async function getSetoresList() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .selectDistinct({ setor: patrimonioItems.setor })
    .from(patrimonioItems)
    .where(not(isNull(patrimonioItems.setor)))
    .orderBy(asc(patrimonioItems.setor));

  return result.map((r) => r.setor).filter(Boolean) as string[];
}

export async function getLocaisList() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .selectDistinct({ local: patrimonioItems.local })
    .from(patrimonioItems)
    .where(not(isNull(patrimonioItems.local)))
    .orderBy(asc(patrimonioItems.local));

  return result.map((r) => r.local).filter(Boolean) as string[];
}

export async function marcarLocalizado(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(patrimonioItems)
    .set({ status: "localizado" })
    .where(eq(patrimonioItems.id, id));

  const result = await db
    .select()
    .from(patrimonioItems)
    .where(eq(patrimonioItems.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createPatrimonioItem(data: {
  patrimonio: number;
  descricao: string;
  setor?: string;
  local?: string;
  dataIncorporacao?: string;
  valor?: number;
  status?: "localizado" | "nao_localizado";
  tipo?: "informatica" | "mobiliario" | "eletrodomestico" | "veiculo" | "outros";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const insertData: any = {
    patrimonio: data.patrimonio,
    descricao: data.descricao,
    status: data.status ?? "nao_localizado",
    tipo: data.tipo ?? "outros",
  };

  if (data.setor) insertData.setor = data.setor;
  if (data.local) insertData.local = data.local;
  if (data.valor !== undefined && data.valor !== null) insertData.valor = String(data.valor);
  if (data.dataIncorporacao) insertData.dataIncorporacao = new Date(data.dataIncorporacao);

  const result = await db.insert(patrimonioItems).values(insertData);
  const insertId = (result as any)[0]?.insertId;

  if (insertId) {
    const created = await db
      .select()
      .from(patrimonioItems)
      .where(eq(patrimonioItems.id, insertId))
      .limit(1);
    return created[0] ?? null;
  }
  return null;
}

// ─── App Auth (JWT simplificado) ─────────────────────────────────────────────
import { createHash } from "crypto";
import { appUsers, levantamentoAnual, levantamentoFotos } from "../drizzle/schema";

function hashPassword(password: string): string {
  return createHash("sha256").update(password + ":detran2025").digest("hex");
}

export async function loginAppUser(username: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const hash = hashPassword(password);
  const result = await db
    .select()
    .from(appUsers)
    .where(and(eq(appUsers.username, username), eq(appUsers.passwordHash, hash), eq(appUsers.ativo, true)))
    .limit(1);

  if (!result[0]) return null;

  // Atualizar lastLogin
  await db.update(appUsers).set({ lastLogin: new Date() }).where(eq(appUsers.id, result[0].id));

  return result[0];
}

export async function getAppUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(appUsers).where(eq(appUsers.id, id)).limit(1);
  return result[0] ?? null;
}

// ─── Levantamento Anual ───────────────────────────────────────────────────────

export async function getLevantamentoAnual(ano?: number) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (ano) conditions.push(eq(levantamentoAnual.ano, ano));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(levantamentoAnual)
    .where(where)
    .orderBy(desc(levantamentoAnual.dataRegistro));
}

export async function createLevantamentoItem(data: {
  ano: number;
  patrimonio: number;
  descricao: string;
  setor?: string;
  local?: string;
  status?: "localizado" | "nao_localizado" | "em_verificacao";
  tipo?: "informatica" | "mobiliario" | "eletrodomestico" | "veiculo" | "outros";
  observacao?: string;
  responsavel?: string;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(levantamentoAnual).values({
    ano: data.ano,
    patrimonio: data.patrimonio,
    descricao: data.descricao,
    setor: data.setor,
    local: data.local,
    status: data.status ?? "em_verificacao",
    tipo: data.tipo ?? "outros",
    observacao: data.observacao,
    responsavel: data.responsavel,
    createdBy: data.createdBy,
  });

  const insertId = (result as any)[0]?.insertId;
  if (insertId) {
    const created = await db
      .select()
      .from(levantamentoAnual)
      .where(eq(levantamentoAnual.id, insertId))
      .limit(1);
    return created[0] ?? null;
  }
  return null;
}

export async function updateLevantamentoStatus(id: number, status: "localizado" | "nao_localizado" | "em_verificacao") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(levantamentoAnual).set({ status }).where(eq(levantamentoAnual.id, id));
}

export async function deleteLevantamentoItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Deletar fotos primeiro
  await db.delete(levantamentoFotos).where(eq(levantamentoFotos.levantamentoId, id));
  await db.delete(levantamentoAnual).where(eq(levantamentoAnual.id, id));
}

export async function addLevantamentoFoto(data: {
  levantamentoId: number;
  url: string;
  thumbUrl?: string;
  fileKey: string;
  mimeType?: string;
  tamanhoBytes?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(levantamentoFotos).values({
    levantamentoId: data.levantamentoId,
    url: data.url,
    thumbUrl: data.thumbUrl,
    fileKey: data.fileKey,
    mimeType: data.mimeType ?? "image/jpeg",
    tamanhoBytes: data.tamanhoBytes,
  });

  const insertId = (result as any)[0]?.insertId;
  if (insertId) {
    const created = await db
      .select()
      .from(levantamentoFotos)
      .where(eq(levantamentoFotos.id, insertId))
      .limit(1);
    return created[0] ?? null;
  }
  return null;
}

export async function getLevantamentoFotos(levantamentoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(levantamentoFotos)
    .where(eq(levantamentoFotos.levantamentoId, levantamentoId))
    .orderBy(asc(levantamentoFotos.createdAt));
}

export async function getLevantamentoAnosDisponiveis() {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .selectDistinct({ ano: levantamentoAnual.ano })
    .from(levantamentoAnual)
    .orderBy(desc(levantamentoAnual.ano));
  return result.map((r) => r.ano);
}

// ─── Admin — Gestão de Usuários ───────────────────────────────────────────────
import { systemLogs } from "../drizzle/schema";

export async function listAppUsers() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: appUsers.id,
      username: appUsers.username,
      displayName: appUsers.displayName,
      cargo: appUsers.cargo,
      idFuncional: appUsers.idFuncional,
      setor: appUsers.setor,
      email: appUsers.email,
      role: appUsers.role,
      ativo: appUsers.ativo,
      createdAt: appUsers.createdAt,
      lastLogin: appUsers.lastLogin,
    })
    .from(appUsers)
    .orderBy(asc(appUsers.displayName));
}

export async function createAppUser(data: {
  username: string;
  password: string;
  displayName: string;
  cargo?: string;
  idFuncional?: string;
  setor?: string;
  email?: string;
  role?: "admin" | "user";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const passwordHash = hashPassword(data.password);
  const result = await db.insert(appUsers).values({
    username: data.username,
    passwordHash,
    displayName: data.displayName,
    cargo: data.cargo ?? null,
    idFuncional: data.idFuncional ?? null,
    setor: data.setor ?? null,
    email: data.email ?? null,
    role: data.role ?? "user",
    ativo: true,
  });
  const insertId = (result as any)[0]?.insertId;
  if (insertId) {
    const created = await db.select().from(appUsers).where(eq(appUsers.id, insertId)).limit(1);
    return created[0] ?? null;
  }
  return null;
}

export async function updateAppUser(id: number, data: {
  displayName?: string;
  cargo?: string;
  idFuncional?: string;
  setor?: string;
  email?: string;
  role?: "admin" | "user";
  ativo?: boolean;
  password?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: any = {};
  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.cargo !== undefined) updateData.cargo = data.cargo;
  if (data.idFuncional !== undefined) updateData.idFuncional = data.idFuncional;
  if (data.setor !== undefined) updateData.setor = data.setor;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.ativo !== undefined) updateData.ativo = data.ativo;
  if (data.password) updateData.passwordHash = hashPassword(data.password);
  if (Object.keys(updateData).length === 0) return null;
  await db.update(appUsers).set(updateData).where(eq(appUsers.id, id));
  const updated = await db.select().from(appUsers).where(eq(appUsers.id, id)).limit(1);
  return updated[0] ?? null;
}

// ─── Admin — Logs do Sistema ──────────────────────────────────────────────────

export async function getSystemLogs(filters: {
  userId?: number;
  acao?: string;
  entidade?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const { userId, acao, entidade, page = 1, pageSize = 50 } = filters;
  const conditions = [];
  if (userId) conditions.push(eq(systemLogs.userId, userId));
  if (acao) conditions.push(eq(systemLogs.acao, acao));
  if (entidade) conditions.push(eq(systemLogs.entidade, entidade));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [items, countResult] = await Promise.all([
    db.select().from(systemLogs).where(where).orderBy(desc(systemLogs.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ count: sql`COUNT(*)` }).from(systemLogs).where(where),
  ]);
  return { items, total: Number((countResult[0] as any)?.count ?? 0) };
}

export async function addSystemLog(data: {
  userId?: number;
  username?: string;
  acao: string;
  entidade?: string;
  entidadeId?: string;
  detalhes?: string;
  ip?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(systemLogs).values({
    userId: data.userId ?? null,
    username: data.username ?? null,
    acao: data.acao,
    entidade: data.entidade ?? null,
    entidadeId: data.entidadeId ?? null,
    detalhes: data.detalhes ?? null,
    ip: data.ip ?? null,
  });
}


// ─── Exportação de Relatórios ──────────────────────────────────────────────────

export function formatarCSV(items: any[]): string {
  if (items.length === 0) return "";

  // Cabeçalho
  const headers = [
    "Patrimônio",
    "Descrição",
    "Setor",
    "Local",
    "Data Incorporação",
    "Valor (R$)",
    "Status",
    "Tipo",
  ];

  // Linhas
  const rows = items.map((item) => [
    item.patrimonio,
    `"${(item.descricao || "").replace(/"/g, '""')}"`, // Escapar aspas duplas
    item.setor || "",
    item.local || "",
    item.dataIncorporacao ? new Date(item.dataIncorporacao).toLocaleDateString("pt-BR") : "",
    item.valor ? Number(item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "",
    item.status === "localizado" ? "Localizado" : "Não Localizado",
    item.tipo || "",
  ]);

  // Montar CSV
  const csv = [
    headers.join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\n");

  return csv;
}

export async function formatarXLSX(items: any[]): Promise<Buffer> {
  // Usar ExcelJS para gerar XLSX
  const ExcelJS = require("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Patrimônio");

  // Cabeçalho
  const headers = [
    "Patrimônio",
    "Descrição",
    "Setor",
    "Local",
    "Data Incorporação",
    "Valor (R$)",
    "Status",
    "Tipo",
  ];

  worksheet.addRow(headers);

  // Estilo do cabeçalho
  const headerRow = worksheet.getRow(1);
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1A73C4" }, // Azul DETRAN
  };
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.alignment = { horizontal: "center", vertical: "center" };

  // Adicionar dados
  items.forEach((item) => {
    worksheet.addRow([
      item.patrimonio,
      item.descricao || "",
      item.setor || "",
      item.local || "",
      item.dataIncorporacao ? new Date(item.dataIncorporacao).toLocaleDateString("pt-BR") : "",
      item.valor ? Number(item.valor) : 0,
      item.status === "localizado" ? "Localizado" : "Não Localizado",
      item.tipo || "",
    ]);
  });

  // Ajustar largura das colunas
  worksheet.columns.forEach((col: any) => {
    col.width = 18;
  });

  // Formatar coluna de valor como moeda
  worksheet.getColumn(6).numFmt = '"R$" #,##0.00';

  // Gerar buffer
  return await workbook.xlsx.writeBuffer();
}

export async function formatarPDF(items: any[], logoUrl?: string): Promise<Buffer> {
  // Usar PDFKit para gerar PDF
  const PDFDocument = require("pdfkit");
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  // Cabeçalho
  if (logoUrl) {
    try {
      // Tentar carregar logo (opcional)
      doc.image(logoUrl, 40, 40, { width: 50 });
    } catch (e) {
      // Logo não disponível, continuar sem
    }
  }

  doc.fontSize(16).font("Helvetica-Bold").text("DETRAN-RJ", 100, 50);
  doc.fontSize(10).font("Helvetica").text("Sistema de Patrimônio", 100, 68);
  doc.fontSize(10).text(`Relatório gerado em ${new Date().toLocaleDateString("pt-BR")}`, 100, 82);

  // Linha divisória
  doc.moveTo(40, 110).lineTo(555, 110).stroke();

  // Tabela
  const tableTop = 130;
  const rowHeight = 20;
  const colWidths = [60, 150, 80, 60, 60, 45];
  const headers = ["Patrimônio", "Descrição", "Setor", "Status", "Tipo", "Valor"];

  // Cabeçalho da tabela
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#1A73C4");
  let x = 40;
  headers.forEach((header, i) => {
    doc.text(header, x, tableTop, { width: colWidths[i], align: "left" });
    x += colWidths[i];
  });

  // Linha divisória
  doc.moveTo(40, tableTop + 15).lineTo(555, tableTop + 15).stroke();

  // Dados
  doc.fontSize(8).font("Helvetica").fillColor("#000000");
  let y = tableTop + 20;

  items.slice(0, 50).forEach((item, idx) => {
    // Quebra de página se necessário
    if (y > 750) {
      doc.addPage();
      y = 40;
    }

    x = 40;
    const rowData = [
      String(item.patrimonio),
      (item.descricao || "").substring(0, 30),
      item.setor || "",
      item.status === "localizado" ? "Loc." : "Não Loc.",
      item.tipo || "",
      item.valor ? `R$ ${Number(item.valor).toFixed(2)}` : "—",
    ];

    rowData.forEach((data, i) => {
      doc.text(data, x, y, { width: colWidths[i], align: "left" });
      x += colWidths[i];
    });

    // Linha de separação entre linhas
    if (idx % 2 === 0) {
      doc.fillColor("#f0f0f0").rect(40, y - 5, 515, rowHeight).fill();
      doc.fillColor("#000000");
    }

    y += rowHeight;
  });

  // Rodapé
  doc.fontSize(8).fillColor("#999999").text(`Total de registros: ${items.length}`, 40, 780, { align: "center" });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
