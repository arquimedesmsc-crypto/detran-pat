import { createConnection } from 'mysql2/promise';
import { createHash } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

// Usar SHA-256 simples (compatível sem bcrypt em ESM puro)
function hashPassword(password) {
  return createHash('sha256').update(password + ':detran2025').digest('hex');
}

const users = [
  {
    username: 'admin',
    password: '123',
    displayName: 'Administrador',
    role: 'admin',
  },
  {
    username: 'moises.costa',
    password: '123',
    displayName: 'Moises Costa',
    role: 'user',
  },
  {
    username: 'pedro.bizarelli',
    password: '123',
    displayName: 'Pedro Bizarelli',
    role: 'user',
  },
];

async function seed() {
  const conn = await createConnection(process.env.DATABASE_URL);
  console.log('✅ Conectado ao banco de dados');

  for (const u of users) {
    const hash = hashPassword(u.password);
    try {
      await conn.execute(
        `INSERT INTO app_users (username, password_hash, display_name, role, ativo)
         VALUES (?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE
           password_hash = VALUES(password_hash),
           display_name = VALUES(display_name),
           role = VALUES(role)`,
        [u.username, hash, u.displayName, u.role]
      );
      console.log(`✅ Usuário criado/atualizado: ${u.username} (${u.role})`);
    } catch (err) {
      console.error(`❌ Erro ao criar ${u.username}:`, err.message);
    }
  }

  await conn.end();
  console.log('\n✅ Seed de usuários concluído!');
  console.log('   admin / 123');
  console.log('   moises.costa / 123');
  console.log('   pedro.bizarelli / 123');
}

seed().catch(console.error);
