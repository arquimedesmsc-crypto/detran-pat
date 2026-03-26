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
    pageSize = 50,
    sortBy = "patrimonio",
    sortDir = "asc",
  } = filters;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(patrimonioItems.descricao, `%${search}%`),
        like(patrimonioItems.setor, `%${search}%`),
        like(patrimonioItems.local, `%${search}%`),
        sql`CAST(${patrimonioItems.patrimonio} AS CHAR) LIKE ${`%${search}%`}`
      )
    );
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

export async function getPatrimonioKPIs() {
  const db = await getDb();
  if (!db) return null;

  const [totals, byStatus, byTipo, valorNaoLocalizado, valorTotal, valorLocalizado] = await Promise.all([
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
    db
      .select({ totalValor: sum(patrimonioItems.valor) })
      .from(patrimonioItems)
      .where(eq(patrimonioItems.status, "localizado")),
  ]);

  return {
    total: totals[0]?.total ?? 0,
    byStatus,
    byTipo,
    valorNaoLocalizado: Number(valorNaoLocalizado[0]?.totalValor ?? 0),
    valorTotal: Number(valorTotal[0]?.totalValor ?? 0),
    valorLocalizado: Number(valorLocalizado[0]?.totalValor ?? 0),
  };
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
