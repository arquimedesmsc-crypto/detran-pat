# DETRAN-RJ — Sistema de Gestão Patrimonial

<p align="center">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663443081896/qQEWeHKIjJGFtIer.jpg" alt="Logo DETRAN-RJ" width="120" />
</p>

<p align="center">
  <strong>Dashboard web para levantamento, controle e visualização do acervo patrimonial do DETRAN-RJ</strong><br/>
  Levantamento 2025/2026 · 1.207 bens cadastrados · Identidade visual oficial
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tRPC-11-398CCB" alt="tRPC" />
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-MySQL-C5F74F" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Vitest-10_testes-6E9F18" alt="Vitest" />
</p>

---

## Visão Geral

O **Sistema de Gestão Patrimonial do DETRAN-RJ** é uma aplicação web full-stack desenvolvida para digitalizar, organizar e visualizar o levantamento patrimonial 2025/2026 do Departamento de Trânsito do Estado do Rio de Janeiro. O sistema importou **1.207 registros** da planilha oficial de levantamento (`Levantamento202526-01-26.xlsx`) e os disponibiliza em um painel interativo com identidade visual institucional.

O projeto foi construído com foco em **usabilidade mobile-first**, **performance de consulta** e **facilidade de manutenção**, permitindo que a equipe de patrimônio localize, registre e acompanhe bens sem depender de planilhas estáticas.

---

## Funcionalidades

### Dashboard Principal
O painel inicial apresenta dois blocos de KPIs separados visualmente. O primeiro bloco exibe o **quantitativo do acervo**: total de itens (1.207), itens localizados (985, representando 82% do acervo) e itens não localizados (222, 18%). O segundo bloco apresenta os **valores declarados**: valor total do acervo (R$ 34.388,41), valor dos bens não localizados e valor estimado dos bens localizados, calculado como a diferença entre o total e o não localizado — metodologia adotada porque a planilha fonte registra valor apenas para bens não encontrados.

Abaixo dos KPIs, o dashboard exibe um gráfico de pizza com a distribuição por status e um gráfico de barras com os 10 setores com maior quantidade de bens.

### Levantamento Patrimonial
A listagem de bens é acessível por três rotas distintas na sidebar: **Todos os Bens**, **Localizados** e **Não Localizados**. Cada rota pré-filtra os registros e exibe um cabeçalho com gradiente colorido correspondente ao status (azul para todos, verde para localizados, âmbar para não localizados).

A listagem oferece busca por texto (número do patrimônio, descrição ou setor), filtros combinados por setor, tipo de bem e status, além de paginação com 25 itens por página. No **desktop**, os dados são exibidos em tabela com colunas ordenáveis. No **mobile**, cada item é renderizado como um card expandido para evitar o corte de informações.

### Modal de Detalhe
Ao clicar em qualquer linha da tabela ou card mobile, um modal centralizado exibe todas as informações do bem: número do patrimônio, descrição completa, categoria com ícone, setor, local, data de incorporação, valor formatado em R$ e badge de status. O modal também apresenta um botão **"Marcar como Localizado"** para bens não encontrados, que atualiza o status em tempo real e invalida o cache dos KPIs.

### Registrar Novo Patrimônio
Um botão de ação flutuante na sidebar (desktop) e na topbar (mobile) abre um formulário modal completo para cadastrar novos bens. Os campos incluem número do patrimônio, descrição, tipo (Informática, Mobiliário, Eletrodoméstico, Veículo, Outros), status inicial, setor com autocomplete, local, data de incorporação e valor.

### Gráficos e Análises
A página de gráficos apresenta três visualizações: distribuição horizontal por setor (top 15), timeline de incorporações por mês/ano e distribuição por tipo de bem em gráfico de pizza. Todos os gráficos são responsivos e utilizam a biblioteca Recharts com as cores da identidade visual DETRAN-RJ.

---

## Identidade Visual

O sistema aplica a identidade visual oficial do DETRAN-RJ em todos os componentes:

| Elemento | Valor |
|---|---|
| Azul primário | `#1A73C4` |
| Verde institucional | `#1B8A5A` |
| Azul escuro (sidebar) | `#0D1B2A` |
| Gradiente padrão | `135deg, #1A73C4 → #1B8A5A` |
| Tipografia | Roboto (Google Fonts) |
| Logo | D bicolor (azul + verde) |

A **splash screen** exibe o logo DETRAN-RJ centralizado com uma barra de progresso animada em gradiente azul→verde, seguida de fade-out suave antes de revelar o dashboard. A **sidebar** utiliza fundo escuro (`#0D1B2A`) com o item de navegação ativo destacado por uma borda esquerda verde e fundo levemente iluminado.

---

## Arquitetura Técnica

O projeto segue uma arquitetura **monorepo full-stack** com cliente React e servidor Express comunicando-se exclusivamente via **tRPC**, garantindo tipagem de ponta a ponta sem contratos REST manuais.

```
detran-patrimonio-dashboard/
├── client/                     # Frontend React 19 + Vite 7
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatrimonioLayout.tsx      # Layout principal com sidebar responsiva
│   │   │   ├── PatrimonioDetailModal.tsx # Modal de detalhe do bem
│   │   │   ├── NovoPatrimonioModal.tsx   # Formulário de cadastro
│   │   │   └── SplashScreen.tsx         # Tela de carregamento animada
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx            # KPIs e gráficos resumidos
│   │   │   ├── Patrimonio.tsx           # Listagem com filtros (componente base)
│   │   │   ├── Localizados.tsx          # Listagem pré-filtrada: localizados
│   │   │   ├── NaoLocalizados.tsx       # Listagem pré-filtrada: não localizados
│   │   │   └── Graficos.tsx             # Gráficos detalhados
│   │   ├── index.css                    # Tema DETRAN-RJ (CSS variables + Roboto)
│   │   └── App.tsx                      # Roteamento (wouter)
├── server/
│   ├── routers.ts                       # Endpoints tRPC (patrimônio + auth)
│   ├── db.ts                            # Helpers de query + cache em memória
│   └── patrimonio.test.ts               # 10 testes Vitest
├── drizzle/
│   └── schema.ts                        # Schema das tabelas (users + patrimonio_items)
└── seed-patrimonio.mjs                  # Script de importação da planilha Excel
```

### Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend framework | React | 19 |
| Build tool | Vite | 7 |
| Estilização | Tailwind CSS | 4 |
| Componentes UI | shadcn/ui + Radix UI | — |
| Gráficos | Recharts | 2.15 |
| Roteamento client | wouter | 3.3 |
| Backend framework | Express | 4 |
| API layer | tRPC | 11 |
| ORM | Drizzle ORM | 0.44 |
| Banco de dados | MySQL / TiDB | — |
| Linguagem | TypeScript | 5.9 |
| Testes | Vitest | 2.1 |
| Gerenciador de pacotes | pnpm | 10 |

---

## Modelo de Dados

### Tabela `patrimonio_items`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Chave primária |
| `patrimonio` | `INT NOT NULL` | Número do tombamento patrimonial |
| `descricao` | `TEXT` | Descrição do bem |
| `setor` | `VARCHAR(255)` | Setor responsável pelo bem |
| `local` | `VARCHAR(255)` | Localização física |
| `data_incorporacao` | `DATE` | Data de entrada no acervo |
| `valor` | `DECIMAL(12,2)` | Valor declarado (preenchido apenas para não localizados) |
| `status` | `ENUM('localizado','nao_localizado')` | Status de localização |
| `tipo` | `ENUM('informatica','mobiliario','eletrodomestico','veiculo','outros')` | Categoria do bem |
| `createdAt` | `TIMESTAMP` | Data de criação do registro |
| `updatedAt` | `TIMESTAMP` | Última atualização |

**Índices criados para performance:**

| Índice | Coluna | Tipo |
|---|---|---|
| `PRIMARY` | `id` | BTREE (clustered) |
| `idx_patrimonio_status` | `status` | BTREE |
| `idx_patrimonio_setor` | `setor` | BTREE |
| `idx_patrimonio_tipo` | `tipo` | BTREE |
| `idx_patrimonio_patrimonio` | `patrimonio` | BTREE |

---

## API tRPC

Todos os endpoints estão sob o namespace `patrimonio.*`:

| Procedure | Tipo | Descrição |
|---|---|---|
| `patrimonio.list` | Query | Listagem paginada com filtros (search, setor, status, tipo, datas) |
| `patrimonio.kpis` | Query | KPIs agregados: totais, por status, por tipo e valores |
| `patrimonio.bySetor` | Query | Contagem agrupada por setor (top 15) |
| `patrimonio.timeline` | Query | Incorporações agrupadas por mês/ano |
| `patrimonio.setores` | Query | Lista distinta de setores (para autocomplete) |
| `patrimonio.locais` | Query | Lista distinta de locais (para autocomplete) |
| `patrimonio.marcarLocalizado` | Mutation | Atualiza status de um bem para "localizado" |
| `patrimonio.criar` | Mutation | Cadastra novo item patrimonial |

---

## Performance

O sistema implementa três estratégias para garantir carregamento rápido mesmo com 1.207+ registros:

**Índices no banco de dados** — as colunas mais usadas em filtros (`status`, `setor`, `tipo`, `patrimonio`) possuem índices BTREE, reduzindo o custo de varredura nas queries de listagem e contagem.

**Cache em memória no servidor** — os KPIs (totais, valores, distribuições) são cacheados por 30 segundos no processo Node.js, evitando 5 roundtrips ao banco a cada requisição de dashboard. O cache é invalidado automaticamente ao criar ou localizar um bem.

**staleTime no cliente** — as queries tRPC no React utilizam `staleTime: 30_000`, impedindo refetch desnecessário ao navegar entre páginas dentro da janela de cache.

**Busca otimizada** — buscas numéricas (número do patrimônio) utilizam igualdade exata aproveitando o índice. Buscas textuais utilizam `LIKE` apenas na descrição, evitando varredura em múltiplas colunas simultaneamente.

---

## Importação de Dados

O script `seed-patrimonio.mjs` realiza a importação da planilha Excel original para o banco de dados. Ele lê o arquivo `Levantamento202526-01-26.xlsx`, normaliza os dados (tipos de bem, status, datas, valores) e insere os registros em lote.

```bash
node seed-patrimonio.mjs
```

> **Nota:** A planilha fonte registra valor monetário **apenas para bens não localizados**. Por isso, o campo `valor` dos bens localizados é `NULL` no banco, e o "Valor Localizado" exibido no Dashboard é calculado como `valorTotal − valorNaoLocalizado`.

---

## Como Executar Localmente

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- MySQL 8+ ou TiDB (variável `DATABASE_URL`)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/arquimedesmsc-crypto/detran-pat.git
cd detran-pat

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com DATABASE_URL, JWT_SECRET etc.

# Aplicar schema no banco
pnpm db:push

# Importar dados da planilha (opcional, requer o arquivo .xlsx)
node seed-patrimonio.mjs

# Iniciar em modo desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`.

### Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia servidor de desenvolvimento com hot-reload |
| `pnpm build` | Compila frontend (Vite) e backend (esbuild) para produção |
| `pnpm start` | Inicia servidor em modo produção |
| `pnpm test` | Executa suíte de testes Vitest |
| `pnpm check` | Verificação de tipos TypeScript |
| `pnpm format` | Formata código com Prettier |
| `pnpm db:push` | Gera e aplica migrations Drizzle |

---

## Testes

O projeto mantém uma suíte de **10 testes automatizados** com Vitest cobrindo os principais fluxos do backend:

```bash
pnpm test

# Resultado esperado:
# ✓ server/patrimonio.test.ts (9 tests)
# ✓ server/auth.logout.test.ts (1 test)
# Test Files  2 passed (2)
#      Tests  10 passed (10)
```

Os testes cobrem: listagem com e sem filtros, paginação, busca por texto, filtro por status, filtro por tipo, KPIs (totais e valores), mutation de marcar como localizado, mutation de criar novo item e fluxo de logout com limpeza de cookie.

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | String de conexão MySQL/TiDB |
| `JWT_SECRET` | Sim | Segredo para assinatura de cookies de sessão |
| `VITE_APP_ID` | Sim | ID da aplicação OAuth |
| `OAUTH_SERVER_URL` | Sim | URL base do servidor OAuth |
| `VITE_OAUTH_PORTAL_URL` | Sim | URL do portal de login OAuth (frontend) |
| `OWNER_OPEN_ID` | Não | OpenID do proprietário (recebe role admin) |
| `OWNER_NAME` | Não | Nome do proprietário |

---

## Histórico de Versões

| Versão | Commit | Descrição |
|---|---|---|
| v1 | `24c36724` | Scaffold inicial do projeto |
| v2 | `42da5ea3` | Sidebar responsiva mobile + layout de cards na listagem |
| v3 | `7864c851` | Modal de detalhe + valores corrigidos no Dashboard |
| v4 | `1f75c33d` | Submenus Localizados/Não Localizados + modal de cadastro + botão localizar |
| v5 | `3bc0c117` | Índices no banco + cache de KPIs + valor localizado calculado corretamente |

---

## Roadmap

As funcionalidades abaixo foram identificadas como próximas evoluções naturais do sistema:

**Exportação de relatórios** — botão nas páginas de Localizados e Não Localizados para baixar os registros filtrados em formato Excel ou PDF, atendendo à necessidade de prestação de contas em reuniões gerenciais.

**Importação de novas planilhas** — tela de upload para atualizar o levantamento sem depender de script manual, com prévia dos dados e confirmação antes da importação.

**Histórico de alterações** — registro de quem alterou o status de um bem e quando, criando uma trilha de auditoria para o controle patrimonial.

**Campo de observações** — texto livre por item para registrar notas como "encontrado no depósito 3, aguardando etiquetagem".

---

## Estrutura do Repositório GitHub

```
arquimedesmsc-crypto/detran-pat
├── main        ← branch principal (produção)
```

O repositório é sincronizado automaticamente a cada checkpoint salvo pela plataforma Manus.

---

## Licença

Projeto desenvolvido para uso interno do **DETRAN-RJ — Departamento de Trânsito do Estado do Rio de Janeiro**. Todos os direitos reservados.

---

<p align="center">
  Desenvolvido com ❤️ para o DETRAN-RJ · Levantamento Patrimonial 2025/2026
</p>
