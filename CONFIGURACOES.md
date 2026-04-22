# Configurações Técnicas — DETRAN-RJ Patrimônio Dashboard

**Versão:** 1.0.0  
**Última atualização:** 08/04/2026  
**Ambiente:** Produção + Desenvolvimento  
**Autor:** Moisés da Silva Costa (ID: 5028399-5)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Banco de Dados](#banco-de-dados)
4. [Portas e Serviços](#portas-e-serviços)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Domínios e SSL](#domínios-e-ssl)
7. [Infraestrutura e Deployment](#infraestrutura-e-deployment)
8. [Scripts e Comandos](#scripts-e-comandos)
9. [Segurança](#segurança)
10. [Monitoramento e Logs](#monitoramento-e-logs)

---

## Visão Geral

O **DETRAN-RJ Patrimônio Dashboard** é um sistema web de gestão de patrimônio desenvolvido com tecnologia moderna, escalável e segura. O projeto utiliza uma arquitetura de três camadas: frontend React, backend Express com tRPC, e banco de dados MySQL/TiDB.

**Características principais:**
- Frontend: React 19 com Tailwind CSS 4 e componentes shadcn/ui
- Backend: Express 4 com tRPC 11 para RPC type-safe
- Banco de dados: MySQL 8+ ou TiDB (compatível)
- Autenticação: JWT com roles (admin/user)
- Armazenamento: AWS S3 para arquivos estáticos
- Hospedagem: Manus Platform (produção) + Sandbox (desenvolvimento)

---

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Propósito |
|---|---|---|
| React | 19.2.1 | Framework UI principal |
| React DOM | 19.2.1 | Renderização DOM |
| Tailwind CSS | 4.1.14 | Estilização utilitária |
| Vite | 7.1.7 | Build tool e dev server |
| TypeScript | 5.9.3 | Type safety |
| Wouter | 3.3.5 | Roteamento client-side |
| React Hook Form | 7.64.0 | Gerenciamento de formulários |
| Zod | 4.1.12 | Validação de schemas |
| Recharts | 2.15.2 | Gráficos e visualizações |
| Lucide React | 0.453.0 | Ícones SVG |
| Framer Motion | 12.23.22 | Animações |
| Sonner | 2.0.7 | Toast notifications |
| Next Themes | 0.4.6 | Gerenciamento de temas (claro/escuro) |

### Backend

| Tecnologia | Versão | Propósito |
|---|---|---|
| Express | 4.21.2 | Framework HTTP |
| tRPC | 11.6.0 | RPC type-safe |
| Drizzle ORM | 0.44.5 | ORM para banco de dados |
| MySQL2 | 3.15.0 | Driver MySQL |
| bcryptjs | 3.0.3 | Hash de senhas |
| Jose | 6.1.0 | JWT signing/verification |
| Cookie | 1.0.2 | Gerenciamento de cookies |
| AWS SDK S3 | 3.693.0 | Upload de arquivos para S3 |
| jsPDF | 4.2.1 | Geração de PDFs |
| jsPDF AutoTable | 5.0.7 | Tabelas em PDFs |
| ExcelJS | 4.4.0 | Geração de planilhas Excel |
| XLSX | 0.18.5 | Leitura/escrita de Excel |
| QRCode | 1.5.4 | Geração de QR codes |
| PDFKit | 0.18.0 | Geração de PDFs (alternativa) |

### DevOps e Testes

| Tecnologia | Versão | Propósito |
|---|---|---|
| Vitest | 2.1.4 | Testes unitários |
| Playwright | 1.58.2 | Testes E2E |
| TSX | 4.19.1 | Execução de TypeScript |
| ESBuild | 0.25.0 | Bundler rápido |
| Prettier | 3.6.2 | Formatação de código |
| Drizzle Kit | 0.31.4 | Gerenciamento de migrações |
| Autoprefixer | 10.4.20 | Prefixos CSS automáticos |
| PostCSS | 8.4.47 | Processamento de CSS |

---

## Banco de Dados

### Tipo e Versão

**Banco:** MySQL 8.0+ ou TiDB (compatível)  
**Dialeto:** MySQL (Drizzle ORM)  
**Encoding:** UTF-8MB4  
**Timezone:** UTC

### Tabelas Principais

| Tabela | Registros | Propósito |
|---|---|---|
| `app_users` | ~5 | Usuários do sistema (admin, user) |
| `patrimonio_items` | 1.207 | Bens patrimoniais cadastrados |
| `transferencias` | ~50 | Guias de transferência emitidas |
| `transferencia_itens` | ~200 | Itens dentro de cada transferência |
| `levantamento_anual` | ~100 | Conferências anuais de patrimônio |
| `levantamento_fotos` | ~500 | Fotos do levantamento anual |
| `system_logs` | ~10.000 | Auditoria de ações do sistema |

### Campos Principais

**app_users:**
- `id` (UUID)
- `username` (string, único)
- `email` (string, único)
- `password_hash` (bcrypt)
- `display_name` (string)
- `role` (enum: admin | user)
- `cargo` (string)
- `setor` (string)
- `id_funcional` (string)
- `theme` (enum: light | dark)
- `onboarding_enabled` (boolean, default: true)
- `language` (enum: pt | en, default: pt)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**patrimonio_items:**
- `id` (UUID)
- `numero_tombo` (string, único)
- `descricao` (text)
- `tipo` (string)
- `setor` (string)
- `status` (enum: localizado | nao_localizado)
- `valor_aquisicao` (decimal)
- `data_incorporacao` (date)
- `andar` (integer)
- `foto_url` (string, S3)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Migrações

As migrações são gerenciadas via **Drizzle Kit**. Todos os arquivos SQL estão em `/drizzle/`:

```bash
# Gerar migração
pnpm drizzle-kit generate

# Aplicar migração
pnpm db:push
```

---

## Portas e Serviços

### Desenvolvimento

| Serviço | Porta | Protocolo | Status |
|---|---|---|---|
| Vite Dev Server | 5173 | HTTP | ✅ Ativo |
| Express Backend | 3000 | HTTP | ✅ Ativo |
| Playwright (E2E) | 3100+ | HTTP | 🔄 Sob demanda |

### Produção (Manus Platform)

| Serviço | Domínio | Protocolo | Status |
|---|---|---|---|
| Frontend + Backend | pat.moisescosta.org | HTTPS | ✅ Ativo |
| Frontend + Backend | detran-pat.manus.space | HTTPS | ✅ Ativo |
| Alias | moisescosta.org | HTTPS | ✅ Ativo |
| Alias | www.moisescosta.org | HTTPS | ✅ Ativo |

### Sandbox (Desenvolvimento Remoto)

| Serviço | URL | Protocolo | Status |
|---|---|---|---|
| Dev Server | https://3000-ila91su980yi8tspbxjp0-2f289002.us1.manus.computer | HTTPS | ✅ Ativo |

---

## Variáveis de Ambiente

### Variáveis Obrigatórias

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@host:3306/detran_patrimonio

# Autenticação JWT
JWT_SECRET=your-secret-key-min-32-chars

# OAuth Manus (se integrado)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Informações do Proprietário
OWNER_NAME=Moisés da Silva Costa
OWNER_OPEN_ID=your-open-id

# AWS S3 (para upload de arquivos)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=detran-patrimonio-bucket
AWS_S3_REGION=us-east-1

# Manus Built-in APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
```

### Variáveis Opcionais

```env
# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Aplicação
VITE_APP_TITLE=DETRAN-RJ Patrimônio
VITE_APP_LOGO=https://cdn.example.com/logo.png

# Ambiente
NODE_ENV=production
PORT=3000
```

### Variáveis Internas (Manus Platform)

Estas variáveis são injetadas automaticamente pela plataforma Manus:

- `BUILT_IN_FORGE_API_KEY` — Token para APIs internas
- `BUILT_IN_FORGE_API_URL` — URL base das APIs
- `JWT_SECRET` — Chave para assinar JWTs
- `OAUTH_SERVER_URL` — URL do servidor OAuth
- `OWNER_NAME` — Nome do proprietário do projeto
- `OWNER_OPEN_ID` — ID único do proprietário
- `VITE_ANALYTICS_ENDPOINT` — Endpoint de analytics
- `VITE_ANALYTICS_WEBSITE_ID` — ID do website para analytics
- `VITE_APP_ID` — ID da aplicação
- `VITE_APP_LOGO` — URL do logo da aplicação
- `VITE_APP_TITLE` — Título da aplicação
- `VITE_FRONTEND_FORGE_API_KEY` — Token para frontend
- `VITE_FRONTEND_FORGE_API_URL` — URL para frontend
- `VITE_OAUTH_PORTAL_URL` — URL do portal OAuth

---

## Domínios e SSL

### Domínios Ativos

| Domínio | Tipo | SSL | Status | Apontamento |
|---|---|---|---|---|
| pat.moisescosta.org | Customizado | ✅ Let's Encrypt | ✅ Ativo | Manus Platform |
| moisescosta.org | Customizado | ✅ Let's Encrypt | ✅ Ativo | Manus Platform |
| www.moisescosta.org | Customizado | ✅ Let's Encrypt | ✅ Ativo | Manus Platform |
| detran-pat.manus.space | Manus (legado) | ✅ Manus SSL | ⚠️ Removido | Manus Platform |

### Certificados SSL

- **Provedor:** Let's Encrypt (customizados) + Manus (legado)
- **Renovação:** Automática (Let's Encrypt)
- **Validade:** 90 dias
- **Próxima renovação:** Automática antes do vencimento

### DNS

```
pat.moisescosta.org          → Manus Platform (CNAME)
moisescosta.org              → Manus Platform (CNAME)
www.moisescosta.org          → Manus Platform (CNAME)
detran-pat.manus.space       → Manus Platform (CNAME)
```

---

## Infraestrutura e Deployment

### Ambiente de Produção

**Plataforma:** Manus Platform  
**Região:** US-East-1 (padrão)  
**Tipo de instância:** Shared (escalável)  
**Banco de dados:** Managed MySQL (Manus)  
**Armazenamento:** AWS S3 (integrado)  
**CDN:** Cloudflare (automático)

### Ambiente de Desenvolvimento

**Plataforma:** Manus Sandbox  
**Sistema operacional:** Ubuntu 22.04 LTS  
**Runtime:** Node.js 22.13.0  
**Gerenciador de pacotes:** pnpm 10.4.1  
**Banco de dados:** MySQL 8.0 (local)

### Deployment Pipeline

```
1. Commit no GitHub (branch main)
   ↓
2. Manus Platform detecta mudanças
   ↓
3. Build: pnpm build
   ↓
4. Testes: pnpm test:all
   ↓
5. Deploy automático
   ↓
6. Atualização de domínios
   ↓
7. Verificação de saúde
```

---

## Scripts e Comandos

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

### Testes

```bash
# Executar testes unitários
pnpm test

# Executar testes E2E
pnpm test:e2e

# Executar testes E2E com UI
pnpm test:e2e:ui

# Executar todos os testes
pnpm test:all
```

### Banco de Dados

```bash
# Gerar migração
pnpm drizzle-kit generate

# Aplicar migração
pnpm db:push

# Visualizar banco de dados (Drizzle Studio)
pnpm drizzle-kit studio
```

---

## Segurança

### Autenticação

- **Tipo:** JWT (JSON Web Tokens)
- **Algoritmo:** HS256 (HMAC SHA-256)
- **Duração:** 24 horas
- **Refresh:** Automático via cookie seguro
- **Armazenamento:** HttpOnly cookie (não acessível via JavaScript)

### Senhas

- **Hash:** bcryptjs (rounds: 10)
- **Validação:** Mínimo 8 caracteres
- **Reset:** Via email (não implementado ainda)

### Roles e Permissões

| Role | Acesso |
|---|---|
| `admin` | Todos os módulos + Painel Administrativo |
| `user` | Patrimônios, Transferência, Relatórios, Perfil |

### CORS

```javascript
// Configurado para aceitar requisições de:
- pat.moisescosta.org
- moisescosta.org
- www.moisescosta.org
- localhost:3000 (desenvolvimento)
- localhost:5173 (Vite dev)
```

### Variáveis Sensíveis

- `JWT_SECRET` — Nunca commitar no Git
- `DATABASE_URL` — Nunca commitar no Git
- `AWS_SECRET_ACCESS_KEY` — Nunca commitar no Git
- Usar `webdev_request_secrets` para gerenciar

---

## Monitoramento e Logs

### Logs do Sistema

| Arquivo | Localização | Conteúdo |
|---|---|---|
| Server Log | `.manus-logs/devserver.log` | Startup, HMR, warnings |
| Browser Console | `.manus-logs/browserConsole.log` | console.log/warn/error |
| Network Requests | `.manus-logs/networkRequests.log` | HTTP requests (fetch/XHR) |
| Session Replay | `.manus-logs/sessionReplay.log` | User interactions |

### Auditoria

Todas as ações do usuário são registradas na tabela `system_logs`:

```sql
SELECT * FROM system_logs 
WHERE user_id = 'user-id' 
ORDER BY created_at DESC 
LIMIT 100;
```

### Métricas

- **Total de patrimônios:** 1.207 itens
- **Taxa de localização:** ~85%
- **Usuários ativos:** ~5 (admin + 4 users)
- **Transferências mensais:** ~50 guias
- **Tempo de resposta:** <200ms (p95)

### Health Checks

```bash
# Verificar saúde do servidor
curl https://pat.moisescosta.org/api/health

# Resposta esperada
{
  "status": "ok",
  "timestamp": "2026-04-08T03:34:20.957Z",
  "version": "1.0.0"
}
```

---

## Contatos e Suporte

| Função | Nome | Email | Telefone |
|---|---|---|---|
| Desenvolvedor | Moisés da Silva Costa | moises.costa@detran.rj.gov.br | (21) 9999-9999 |
| Gestora | Michelle Ferreira | michelle.ferreira@detran.rj.gov.br | (21) 8888-8888 |
| Infraestrutura | Alexandre Mattiole | alexandre.mattiole@detran.rj.gov.br | (21) 7777-7777 |
| Patrimônio | Pedro Bizarelli | pedro.bizarelli@detran.rj.gov.br | (21) 6666-6666 |

---

## Referências

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [tRPC Documentation](https://trpc.io)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com)
- [Express.js Documentation](https://expressjs.com)
- [MySQL 8.0 Documentation](https://dev.mysql.com/doc/refman/8.0/en/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Manus Platform Documentation](https://docs.manus.im)

---

**Documento gerado em:** 08/04/2026  
**Versão:** 1.0.0  
**Autor:** Moisés da Silva Costa (ID: 5028399-5)  
**Equipe:** DTIC — DETRAN-RJ
