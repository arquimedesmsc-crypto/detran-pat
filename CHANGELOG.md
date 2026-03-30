# 📋 CHANGELOG — DETRAN-RJ Patrimônio Dashboard

> Histórico completo de versões, funcionalidades implementadas e correções aplicadas.
> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [v15] — 2026-03-30 — Onboarding, Design e Domínio

### ✨ Adicionado
- **Onboarding automático** — Exibido na primeira visita do usuário (localStorage), com tour interativo em 5 passos
- **Página de Ajuda** (`/ajuda`) — FAQ estruturado em 5 categorias com busca em tempo real, 20+ perguntas e seção de contato
- **Favicon DETRAN-RJ** — Substituição da favicon genérica pelo logotipo com gradiente azul-verde oficial
- **Subdomínio `pat.moisescosta.org`** — Sistema publicado e acessível via domínio customizado
- **Registro DNS `pat`** — Adicionado ao painel de domínios Manus apontando para `104.18.26.246`

### 🔧 Alterado
- Onboarding removido do menu lateral (agora é automático)
- Página de Ajuda completamente redesenhada com identidade visual DETRAN-RJ
- DNS principal `detrandash-otclswdp.manus.space` removido do acesso público

---

## [v14] — 2026-03-30 — Identidade Visual, Perfil e Confirmações

### ✨ Adicionado
- **Página de Perfil** (`/perfil`) — Edição de nome, e-mail, cargo, setor, ID funcional e senha; solicitação de alteração de cargo/setor com aprovação do admin
- **Componente `ConfirmDialog`** — Modal de confirmação reutilizável com 6 variantes (danger, warning, success, info, transfer, logout) e hook `useConfirmDialog`
- **Toggle de tema** — Suporte a tema claro/escuro na página de Perfil
- **Item "Meu Perfil"** no menu lateral

### 🔧 Alterado
- CSS global aprimorado com efeitos 3D, bordas de realce, glass cards, page headers com gradiente, badges de status e animações de entrada
- Tipografia refinada com Inter (Google Fonts) e hierarquia visual consistente
- Ícones com gradiente DETRAN-RJ em todos os page headers

### 🐛 Corrigido
- Função `updateAppUserProfile` no `db.ts` — estrutura `try/catch` corrigida
- Tipos TypeScript do router `perfil` sincronizados com o schema

---

## [v13] — 2026-03-29 — Ordenação e Filtros Avançados

### ✨ Adicionado
- **Campo `andar`** na tabela `patrimonio_items` — migração Drizzle aplicada
- **Filtros avançados** na aba Patrimônios: valor mínimo, valor máximo, andar
- **Ordenação completa** por: número de patrimônio, descrição, setor, local, andar, data, valor, tipo e status
- **Indicadores visuais** de ordenação (setas ascendente/descendente nas colunas)
- **Coluna "Andar"** adicionada à tabela desktop

### 🔧 Alterado
- Schema do `patrimonio.list` no `routers.ts` atualizado com `andar`, `valorMin`, `valorMax`
- `colMap` no `db.ts` atualizado para suportar ordenação por `andar`
- Interface `PatrimonioFilters` expandida com novos campos

---

## [v12] — 2026-03-29 — UX Improvements

### ✨ Adicionado
- **Upload de imagem no topo** do formulário de novo patrimônio — com preview e remoção
- **Seção Transferência** completamente reorganizada com 4 seções colapsáveis:
  - Origem (setor, local)
  - Destino (setor, local)
  - Itens (busca e seleção de patrimônios)
  - Assinatura (signatário, cargo, ID funcional, observações)

### 🔧 Alterado
- Menu lateral: "Levantamento" renomeado para **"Patrimônios"**
- Submenus "Localizados" e "Não Localizados" mantidos sob "Patrimônios"

---

## [v11] — 2026-03-28 — Exportação de Relatórios

### ✨ Adicionado
- **Página Relatórios** (`/relatorios`) com filtros por setor, status e tipo
- **Exportação em CSV** — com cabeçalhos e formatação UTF-8
- **Exportação em XLSX** — com formatação DETRAN-RJ (cabeçalho colorido, colunas ajustadas)
- **Exportação em PDF** — com cabeçalho institucional, logo e rodapé
- **Item "Relatórios"** no menu lateral com ícone `BarChart3`
- **19 testes unitários** para funções de exportação (todos passando)

### 🔧 Alterado
- Funções `formatarCSV`, `formatarXLSX`, `formatarPDF` adicionadas ao `db.ts`
- Formatação de moeda (R$) e data (DD/MM/YYYY) padronizadas nos relatórios

---

## [v10] — 2026-03-28 — Painel Admin e Seção Transferência

### ✨ Adicionado
- **Painel Admin** (`/admin`) — Gestão de usuários (criar, editar, ativar/desativar, redefinir senha) e logs de atividade; visível apenas para `role=admin`
- **Seção Transferência** (`/transferencia`) no menu lateral — visível para todos os usuários
- **Guia de Transferência em PDF** — formulário completo com geração de documento institucional
- **Router `admin`** no `routers.ts` com procedures de gestão de usuários e logs

### 🔧 Alterado
- Helpers de admin adicionados ao `db.ts`: `getAdminStats`, `getAdminUsers`, `getAdminLogs`, `createAdminUser`, `updateAdminUser`, `resetAdminUserPassword`

---

## [v9] — 2026-03-27 — QR Code

### ✨ Adicionado
- **Componente `QRCodeModal`** — Geração de QR code para cada patrimônio com opções de download PNG e impressão
- **Botão "QR Code"** no modal de detalhe de patrimônio
- Biblioteca `qrcode` instalada

---

## [v8] — 2026-03-27 — Correção de Sidebar e Banco de Dados

### 🐛 Corrigido
- **Menu lateral** restaurado em desktop e mobile — `Patrimonio.tsx` e `Graficos.tsx` agora envolvidos pelo `PatrimonioLayout`
- **Tabelas do banco** criadas: `app_users`, `system_logs`, `transferencias`, `transferencia_itens`
- **Usuários padrão** inseridos: `admin` (senha: 123), `moises.costa` (senha: 123), `Pedro.Bizarelli` (senha: 123)

---

## [v7] — 2026-03-26 — Levantamento Anual e Fotos

### ✨ Adicionado
- **Levantamento Anual** (`/levantamento`) — Registro de conferência anual com status por setor
- **Upload de fotos** para patrimônios via S3
- **Modal de detalhe** com galeria de imagens

---

## [v6] — 2026-03-26 — Dashboard e KPIs

### ✨ Adicionado
- **Dashboard** (`/dashboard`) com KPIs: total de patrimônios, localizados, não localizados, valor total
- **Gráficos** de distribuição por setor e timeline de cadastros
- **Splash screen** com identidade visual DETRAN-RJ

---

## [v5] — 2026-03-26 — Autenticação Local

### ✨ Adicionado
- **Login local** com JWT próprio (independente do Manus OAuth)
- **Contexto `AppAuthContext`** para gerenciar estado de autenticação
- **Roles**: `admin` e `user`
- **Proteção de rotas** com `ProtectedRoute`

---

## [v4] — 2026-03-26 — Patrimônios: Localizados e Não Localizados

### ✨ Adicionado
- **Página Localizados** (`/localizados`) — Filtro de patrimônios com status "localizado"
- **Página Não Localizados** (`/nao-localizados`) — Filtro de patrimônios com status "não localizado"
- **Submenus** no menu lateral sob "Patrimônios"

---

## [v3] — 2026-03-26 — CRUD de Patrimônios

### ✨ Adicionado
- **Tabela `patrimonio_items`** no schema Drizzle
- **Modal de novo patrimônio** com campos: número, descrição, tipo, setor, local, valor, status
- **Modal de detalhe** com edição inline
- **Paginação** e **busca** na lista de patrimônios

---

## [v2] — 2026-03-26 — Layout e Identidade Visual

### ✨ Adicionado
- **`PatrimonioLayout`** — Sidebar de navegação com identidade DETRAN-RJ
- **Paleta de cores** oficial: azul `#1A73C4`, verde `#1B8A5A`, gradiente diagonal
- **Tipografia** Inter (Google Fonts)
- **Logo DETRAN-RJ** no topo da sidebar

---

## [v1] — 2026-03-26 — Inicialização do Projeto

### ✨ Adicionado
- Scaffold inicial com React 19 + Tailwind 4 + Express 4 + tRPC 11
- Manus OAuth configurado
- Drizzle ORM com MySQL/TiDB
- Estrutura de pastas: `client/`, `server/`, `drizzle/`, `shared/`

---

## 🧪 Cobertura de Testes

| Arquivo | Testes | Status |
|---|---|---|
| `server/auth.logout.test.ts` | 1 | ✅ Passando |
| `server/patrimonio.test.ts` | 9 | ✅ Passando |
| `server/export.test.ts` | 12 | ✅ Passando |
| `server/perfil.test.ts` | 14 | ✅ Passando |
| `e2e/auth.spec.ts` | 4 | ✅ Passando |
| `e2e/navigation.spec.ts` | 12 | 🔄 Requer servidor ativo |
| **Total unitários** | **36** | ✅ |

---

## 🗺️ Domínios Configurados

| Domínio | Tipo | Status |
|---|---|---|
| `pat.moisescosta.org` | Customizado (principal) | ✅ Ativo |
| `www.moisescosta.org` | Customizado | ✅ Ativo |
| `moisescosta.org` | Customizado | ✅ Ativo |
| `detrandash-otclswdp.manus.space` | Manus (legado) | ⚠️ Removido do acesso público |

---

## 👥 Usuários Padrão

| Usuário | Senha | Role | Acesso |
|---|---|---|---|
| `admin` | `123` | `admin` | Todos os módulos + Administração |
| `moises.costa` | `123` | `user` | Patrimônios, Transferência, Relatórios, Perfil |
| `Pedro.Bizarelli` | `123` | `user` | Patrimônios, Transferência, Relatórios, Perfil |
