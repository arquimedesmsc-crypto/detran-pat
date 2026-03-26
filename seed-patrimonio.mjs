import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  const data = JSON.parse(readFileSync("/home/ubuntu/patrimonio_data.json", "utf-8"));

  console.log(`Importando ${data.length} registros...`);

  // Inserir em lotes de 100
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map((item) => ({
      patrimonio: item.patrimonio,
      descricao: item.descricao,
      setor: item.setor,
      local: item.local,
      dataIncorporacao: item.data ? new Date(item.data) : null,
      valor: item.valor ? String(item.valor) : null,
      status: item.status,
      tipo: item.tipo,
    }));

    // Usar INSERT direto via SQL para evitar problemas de tipo
    for (const v of values) {
      await connection.execute(
        `INSERT INTO patrimonio_items (patrimonio, descricao, setor, local, data_incorporacao, valor, status, tipo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.patrimonio, v.descricao, v.setor, v.local, v.dataIncorporacao, v.valor, v.status, v.tipo]
      );
    }

    inserted += batch.length;
    console.log(`Inseridos: ${inserted}/${data.length}`);
  }

  console.log("Seed concluído!");
  await connection.end();
}

main().catch(console.error);
