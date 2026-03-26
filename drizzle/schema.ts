import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, date } from "drizzle-orm/mysql-core";

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
