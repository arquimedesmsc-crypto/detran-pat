import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── App Users (login simplificado JWT) ───────────────────────
export const appUsers = mysqlTable("app_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export type AppUser = typeof appUsers.$inferSelect;
export type InsertAppUser = typeof appUsers.$inferInsert;

// ─── Patrimônio Items ──────────────────────────────────────────
export const patrimonioItems = mysqlTable("patrimonio_items", {
  id: int("id").autoincrement().primaryKey(),
  patrimonio: int("patrimonio").notNull(),
  descricao: text("descricao"),
  setor: varchar("setor", { length: 255 }),
  local: varchar("local", { length: 255 }),
  dataIncorporacao: date("data_incorporacao"),
  valor: decimal("valor", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["localizado", "nao_localizado"]).default("nao_localizado").notNull(),
  tipo: mysqlEnum("tipo", ["informatica", "mobiliario", "eletrodomestico", "veiculo", "outros"]).default("outros").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PatrimonioItem = typeof patrimonioItems.$inferSelect;
export type InsertPatrimonioItem = typeof patrimonioItems.$inferInsert;

// ─── Levantamento Anual ────────────────────────────────────────
export const levantamentoAnual = mysqlTable("levantamento_anual", {
  id: int("id").autoincrement().primaryKey(),
  ano: int("ano").notNull(),
  patrimonio: int("patrimonio").notNull(),
  descricao: text("descricao").notNull(),
  setor: varchar("setor", { length: 255 }),
  local: varchar("local", { length: 255 }),
  status: mysqlEnum("status", ["localizado", "nao_localizado", "em_verificacao"]).default("em_verificacao").notNull(),
  tipo: mysqlEnum("tipo", ["informatica", "mobiliario", "eletrodomestico", "veiculo", "outros"]).default("outros").notNull(),
  observacao: text("observacao"),
  responsavel: varchar("responsavel", { length: 128 }),
  dataRegistro: timestamp("data_registro").defaultNow().notNull(),
  createdBy: int("created_by"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LevantamentoAnual = typeof levantamentoAnual.$inferSelect;
export type InsertLevantamentoAnual = typeof levantamentoAnual.$inferInsert;

// ─── Levantamento Fotos ────────────────────────────────────────
export const levantamentoFotos = mysqlTable("levantamento_fotos", {
  id: int("id").autoincrement().primaryKey(),
  levantamentoId: int("levantamento_id").notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  thumbUrl: varchar("thumb_url", { length: 1024 }),
  fileKey: varchar("file_key", { length: 512 }).notNull(),
  mimeType: varchar("mime_type", { length: 64 }).default("image/jpeg"),
  tamanhoBytes: int("tamanho_bytes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LevantamentoFoto = typeof levantamentoFotos.$inferSelect;
export type InsertLevantamentoFoto = typeof levantamentoFotos.$inferInsert;
