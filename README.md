# 🚗 DETRAN-RJ — Sistema de Gestão Patrimonial

<p align="center">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663443081896/qQEWeHKIjJGFtIer.jpg" alt="Logo DETRAN-RJ" width="140" />
</p>

<p align="center">
  <strong>📊 Dashboard web interativo para levantamento, controle e visualização do acervo patrimonial</strong><br/>
  <em>Levantamento 2025/2026 · 1.207 bens cadastrados · Identidade visual oficial DETRAN-RJ</em>
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-stack-tecnológico">Stack</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🎯 Visão Geral

O **Sistema de Gestão Patrimonial do DETRAN-RJ** é uma aplicação web full-stack desenvolvida para digitalizar, organizar e visualizar o levantamento patrimonial 2025/2026 do Departamento de Trânsito do Estado do Rio de Janeiro.

✅ **1.207 registros** importados da planilha oficial de levantamento  
✅ **Painel interativo** com identidade visual institucional  
✅ **Mobile-first** — funciona perfeitamente em smartphones e tablets  
✅ **Performance otimizada** — índices de banco de dados e cache inteligente  
✅ **Fácil manutenção** — código limpo, testado e documentado  

---

## ✨ Funcionalidades

### 📈 Dashboard Principal
O painel inicial apresenta **dois blocos de KPIs** separados visualmente:

| Bloco | Métricas |
|-------|----------|
| **Quantitativo** | ✓ Total de itens (1.207) · ✓ Localizados (985 — 82%) · ✓ Não localizados (222 — 18%) |
| **Valores** | ✓ Valor total do acervo (R$ 34.388,41) · ✓ Valor não localizado · ✓ Valor localizado (calculado) |

Abaixo dos KPIs: 📊 gráfico de pizza com distribuição por status + 📊 gráfico de barras com os 10 setores com maior quantidade de bens.

---

### 📋 Levantamento Patrimonial

**3 rotas de navegação** na sidebar:
- 🟢 **Todos os Bens** — visualiza os 1.207 registros
- ✅ **Localizados** — 985 bens confirmados
- ⚠️ **Não Localizados** — 222 bens a encontrar

**Recursos de busca e filtro:**
- 🔍 Busca por texto (número do patrimônio, descrição, setor)
- 🎯 Filtros combinados (setor, tipo de bem, status)
- 📄 Paginação com 25 itens por página
- 🔀 **Ordenação clicável** em todas as colunas (Patrimônio, Descrição, Setor, Local, Data, Valor)

**Visualização responsiva:**
- 🖥️ **Desktop:** tabela completa com todas as informações
- 📱 **Mobile:** cards expandidos para evitar corte de dados

---

### 🔍 Modal de Detalhe

Ao clicar em qualquer item, um modal centralizado exibe:
- 📌 Número do patrimônio
- 📝 Descrição completa
- 🏷️ Categoria com ícone
- 🏢 Setor e local
- 📅 Data de incorporação
- 💰 Valor formatado em R$
- ✓/⚠️ Badge de status

**Ação rápida:** Botão "Marcar como Localizado" para bens não encontrados — atualiza em tempo real e invalida o cache dos KPIs.

---

### ➕ Registrar Novo Patrimônio

Botão de ação flutuante (sidebar no desktop, topbar no mobile) abre formulário completo:
- 🔢 Número do patrimônio
- 📝 Descrição
- 🏷️ Tipo (Informática, Mobiliário, Eletrodoméstico, Veículo, Outros)
- ✓/⚠️ Status inicial
- 🏢 Setor com autocomplete
- 📍 Local
- 📅 Data de incorporação
- 💵 Valor

---

### 📊 Gráficos e Análises

**3 visualizações interativas:**

| Gráfico | Descrição |
|---------|-----------|
| 📊 **Barras Horizontais** | Distribuição por setor (top 15) |
| 📈 **Timeline** | Incorporações por mês/ano |
| 🥧 **Pizza** | Distribuição por tipo de bem |

✅ Todos responsivos · ✅ Cores da identidade visual DETRAN-RJ · ✅ Biblioteca Recharts

---

## 🎨 Identidade Visual

| Elemento | Cor | Uso |
|----------|-----|-----|
| 🔵 **Azul Primário** | `#1A73C4` | Headers, botões, links |
| 🟢 **Verde** | `#1B8A5A` | Status "Localizado", destaques |
| 🟡 **Âmbar** | `#D4A017` | Status "Não Localizado", avisos |
| 🔷 **Azul Escuro** | `#1B4F72` | Sidebar, backgrounds |

**Tipografia:** Roboto (400, 500, 700, 900)  
**Degradês:** 135° nos headers (azul → verde)  
**Logo:** D estilizado do DETRAN-RJ na sidebar

---

## 🛠️ Stack Tecnológico

### Frontend
- ⚛️ **React 19** — UI moderna e reativa
- 🎨 **Tailwind CSS 4** — estilos utilitários
- 📦 **shadcn/ui** — componentes acessíveis
- 📊 **Recharts** — gráficos interativos
- 🔗 **tRPC Client** — chamadas RPC type-safe

### Backend
- 🚀 **Express 4** — servidor HTTP
- 🔗 **tRPC 11** — API RPC com tipos
- 🗄️ **Drizzle ORM** — queries SQL type-safe
- 🐘 **MySQL/TiDB** — banco de dados
- 🔐 **Manus OAuth** — autenticação

### Ferramentas
- 🧪 **Vitest** — testes unitários (10 testes passando)
- 📝 **TypeScript 5.9** — type safety
- 🎯 **Vite 7** — build rápido
- 📦 **pnpm** — gerenciador de pacotes

---

## 📊 Modelo de Dados

### Tabela `patrimonio_items`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | Chave primária |
| `patrimonio` | INT | Número único do bem |
| `descricao` | TEXT | Descrição completa |
| `tipo` | ENUM | informatica, mobiliario, eletrodomestico, veiculo, outros |
| `status` | ENUM | localizado, nao_localizado |
| `setor` | VARCHAR | Departamento responsável |
| `local` | VARCHAR | Localização física |
| `dataIncorporacao` | DATE | Data de entrada no acervo |
| `valor` | DECIMAL | Valor declarado (apenas não localizados) |

**Índices:** patrimonio, status, setor, tipo (otimizados para buscas)

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- MySQL 8+ ou TiDB

### Passos

```bash
# 1️⃣ Clonar repositório
git clone https://github.com/arquimedesmsc-crypto/detran-pat.git
cd detran-patrimonio-dashboard

# 2️⃣ Instalar dependências
pnpm install

# 3️⃣ Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4️⃣ Executar migrations do banco
pnpm db:push

# 5️⃣ Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse em `http://localhost:3000` 🎉

---

## 📖 Uso

### Desenvolvimento

```bash
# ✅ Iniciar servidor (com hot reload)
pnpm dev

# 🧪 Rodar testes
pnpm test

# 🔍 Verificar tipos TypeScript
pnpm check

# 📝 Formatar código
pnpm format
```

### Produção

```bash
# 🏗️ Build
pnpm build

# 🚀 Iniciar servidor
pnpm start
```

---

## 🔌 API tRPC

### Procedures Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `patrimonio.list` | Query | Listar bens com filtros, busca, ordenação e paginação |
| `patrimonio.kpis` | Query | KPIs: total, status, valores (com cache 30s) |
| `patrimonio.bySetor` | Query | Distribuição por setor (top 15) |
| `patrimonio.timeline` | Query | Timeline de incorporações por mês |
| `patrimonio.setores` | Query | Lista de setores únicos |
| `patrimonio.locais` | Query | Lista de locais únicos |
| `patrimonio.criar` | Mutation | Registrar novo bem |
| `patrimonio.marcarLocalizado` | Mutation | Atualizar status para localizado |

**Exemplo de uso:**
```typescript
const { data } = trpc.patrimonio.list.useQuery({
  search: "cadeira",
  setor: "DTIC",
  status: "nao_localizado",
  sortBy: "valor",
  sortDir: "desc",
  page: 1,
  pageSize: 25,
});
```

---

## ⚡ Performance

✅ **Índices de banco:** status, setor, tipo, patrimônio  
✅ **Cache em memória:** KPIs com TTL de 30 segundos  
✅ **Busca otimizada:** numérica usa índice direto, textual com LIKE prefixo  
✅ **Paginação:** 25 itens por página (reduzido de 50)  
✅ **staleTime:** 15 segundos no frontend para evitar refetch desnecessário  

---

## 🧪 Testes

**10 testes passando:**
- ✅ `patrimonio.test.ts` — 9 testes de routers
- ✅ `auth.logout.test.ts` — 1 teste de logout

```bash
# Rodar testes
pnpm test

# Com cobertura
pnpm test -- --coverage
```

---

## 📝 Histórico de Versões

| Versão | Data | Destaques |
|--------|------|-----------|
| **v6** | 26/03 | ✅ README completo · ✅ Commit no GitHub |
| **v5** | 26/03 | ⚡ Performance: índices, cache 30s, busca otimizada |
| **v4** | 26/03 | 📋 Submenus (Localizados/Não Localizados) · ➕ Modal de cadastro |
| **v3** | 26/03 | 🔍 Modal de detalhe · 💰 Valores corrigidos |
| **v2** | 26/03 | 📱 Responsividade mobile completa |
| **v1** | 26/03 | 🎉 Lançamento: splash screen, dashboard, tabela, gráficos |

---

## 🗺️ Roadmap

### 🔜 Próximas Funcionalidades

- ⏳ **Exportar em Excel/PDF** — baixar listagem filtrada para relatórios
- ⏳ **Histórico de alterações** — auditoria de quem marcou como localizado e quando
- ⏳ **Importação de planilha** — upload de `.xlsx` com prévia antes de confirmar
- ⏳ **Busca por descrição aprimorada** — sugestões automáticas e múltiplos termos
- ⏳ **Modo de edição inline** — atualizar setor/local direto na tabela
- ⏳ **Notificações em tempo real** — alertas quando um bem é localizado

---

## 📋 Requisitos Funcionais

| Requisito | Status | Descrição |
|-----------|--------|-----------|
| Importar 1.207 registros | ✅ | Dados da planilha Excel integrados |
| Dashboard com KPIs | ✅ | 6 KPIs: total, localizados, não localizados, valores |
| Tabela interativa | ✅ | Busca, filtros, paginação, ordenação |
| Gráficos | ✅ | Barras, linha, pizza com Recharts |
| Identidade visual | ✅ | Cores, tipografia, degradês DETRAN-RJ |
| Responsividade mobile | ✅ | Sidebar drawer, cards em mobile |
| Modal de detalhe | ✅ | Todas as informações do bem |
| Cadastro de novo bem | ✅ | Formulário completo com validação |
| Marcar como localizado | ✅ | Atualiza status em tempo real |
| Testes | ✅ | 10 testes Vitest passando |

---

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Por favor:

1. 🔀 Faça um fork do repositório
2. 🌿 Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. 💾 Commit suas mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. 📤 Push para a branch (`git push origin feature/nova-funcionalidade`)
5. 🔄 Abra um Pull Request

---

## 📄 Licença

Este projeto é licenciado sob a **MIT License** — veja o arquivo `LICENSE` para detalhes.

---

## 👥 Autores

- **Desenvolvido com Manus** 🤖
- **Identidade Visual:** DETRAN-RJ
- **Levantamento Patrimonial:** 2025/2026

---

## 📞 Suporte

Encontrou um problema? 🐛

- 📧 Abra uma issue no GitHub
- 💬 Consulte a documentação no README
- 🔗 Visite o repositório: https://github.com/arquimedesmsc-crypto/detran-pat

---

<p align="center">
  <strong>Desenvolvido com ❤️ para o DETRAN-RJ</strong><br/>
  <em>Tornando a gestão patrimonial simples, rápida e visual</em>
</p>
