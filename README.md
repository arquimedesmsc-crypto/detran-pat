# 🏛️ DETRAN-RJ — Sistema de Gestão Patrimonial

<p align="center">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663443081896/qQEWeHKIjJGFtIer.jpg" alt="Logo DETRAN-RJ" width="140" />
</p>

<p align="center">
  <strong>📊 Dashboard web interativo para levantamento, controle e visualização do acervo patrimonial</strong><br/>
  <em>Levantamento 2025/2026 · 1.207 bens cadastrados · Identidade visual oficial DETRAN-RJ</em>
</p>

<p align="center">
  <a href="#-visão-geral">Visão Geral</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-stack-tecnológico">Stack</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-documentação">Documentação</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🎯 Visão Geral

O **Sistema de Gestão Patrimonial do DETRAN-RJ** é uma aplicação web full-stack desenvolvida para digitalizar, organizar e visualizar o levantamento patrimonial 2025/2026 do Departamento de Trânsito do Estado do Rio de Janeiro. O sistema foi construído com tecnologia moderna, escalável e segura, utilizando React 19, Express 4, tRPC 11 e MySQL 8.

**Status:** ✅ Em produção  
**Versão:** 1.0.0  
**Última atualização:** 08/04/2026  
**Equipe:** DTIC — Divisão de Tecnologia da Informação

### Destaques

✅ **1.207 registros** importados da planilha oficial de levantamento  
✅ **10 módulos funcionais** — Dashboard, Patrimônios, Transferência, Relatórios, Levantamento Anual, Admin, Perfil, Ajuda, Onboarding, i18n  
✅ **Painel interativo** com identidade visual institucional DETRAN-RJ  
✅ **Suporte multilíngue** — Português (PT) e Inglês (EN)  
✅ **Mobile-first** — funciona perfeitamente em smartphones e tablets  
✅ **Performance otimizada** — índices de banco de dados e cache inteligente  
✅ **Segurança** — autenticação JWT, roles (admin/user), auditoria completa  
✅ **Testes** — 36 testes unitários + testes E2E com Playwright  
✅ **Fácil manutenção** — código limpo, testado e documentado  

---

## ✨ Funcionalidades

### 📈 Dashboard Principal

O painel inicial apresenta **blocos de KPIs** com visualizações interativas:

| Métrica | Valor | Status |
|---|---|---|
| Total de itens | 1.207 | ✅ |
| Itens localizados | 985 (82%) | ✅ |
| Itens não localizados | 222 (18%) | ⚠️ |
| Valor total do acervo | R$ 34.388,41 | ✅ |
| Valor localizado | ~R$ 28.900,00 | ✅ |

Visualizações: 📊 Gráfico de pizza (status) + 📊 Gráfico de barras (setores) + 📅 Timeline de incorporações

### 📋 Levantamento Patrimonial (`/patrimonio`)

**Funcionalidades:**
- Listagem com paginação (50 itens por página)
- Busca em tempo real por número de tombo, descrição, setor
- Filtros avançados: setor, status, tipo, valor mín/máx, andar
- Ordenação por qualquer coluna (ascendente/descendente)
- Submenus: Localizados (`/localizados`) e Não Localizados (`/nao-localizados`)
- Modal de novo patrimônio com upload de imagem
- Modal de detalhe com edição inline e galeria de fotos
- QR Code por patrimônio (gerar, baixar PNG, imprimir)
- Botão "Identificar como Localizado"

### 🔄 Transferência (`/transferencia`)

**Funcionalidades:**
- Formulário com 4 seções colapsáveis (Origem, Destino, Itens, Assinatura)
- Busca e seleção de patrimônios para transferência
- Geração de Guia de Transferência em PDF com identidade DETRAN-RJ
- Assinatura digital (preparado para integração)
- Histórico de transferências com status

### 📈 Relatórios (`/relatorios`)

**Funcionalidades:**
- Filtros por setor, status e tipo
- Exportação em CSV (UTF-8, separador ponto-e-vírgula)
- Exportação em XLSX (cabeçalho colorido DETRAN-RJ)
- Exportação em PDF (logo, data, filtros aplicados)
- Preview dos dados antes da exportação
- Relatório de depreciação (preparado)

### 📅 Levantamento Anual (`/levantamento`)

**Funcionalidades:**
- Registro de conferência anual com seletor de ano
- Upload de fotos via S3
- Visualização em modal/lightbox
- Rastreamento de conformidade

### 🛡️ Painel Admin (`/admin`)

**Funcionalidades (apenas para role=admin):**
- Gestão de usuários: criar, editar, ativar/desativar, redefinir senha
- Logs de atividade com filtros por usuário, ação, data
- Dashboard de auditoria (preparado)
- Aprovação de solicitações de perfil (preparado)

### 👤 Perfil do Usuário (`/perfil`)

**Funcionalidades:**
- Edição de nome, e-mail, cargo, setor, ID funcional
- Alteração de senha com confirmação
- Toggle de tema claro/escuro
- Seletor de idioma (PT/EN)
- Solicitação de alteração de cargo/setor (requer aprovação do admin)
- Toggle de Tutorial de Boas-vindas (ativar/desativar onboarding)

### 🎓 Onboarding e Ajuda

**Funcionalidades:**
- OnboardingModal fullscreen com 11 slides animados cobrindo todas as funcionalidades
- Exibido automaticamente a cada login (respeitando preferência do usuário)
- Campo `onboarding_enabled` no banco de dados por usuário
- Toggle de onboarding na página de Perfil (ativar/desativar)
- Botão "Reativar e ver tutorial agora" no perfil
- Página de Ajuda (`/ajuda`) com FAQ em 5 categorias
- Busca em tempo real na FAQ

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19.2.1** — Framework UI principal
- **Tailwind CSS 4.1.14** — Estilização utilitária
- **Vite 7.1.7** — Build tool e dev server
- **TypeScript 5.9.3** — Type safety
- **Wouter 3.3.5** — Roteamento client-side
- **React Hook Form 7.64.0** — Gerenciamento de formulários
- **Zod 4.1.12** — Validação de schemas
- **Recharts 2.15.2** — Gráficos e visualizações
- **Lucide React 0.453.0** — Ícones SVG
- **Framer Motion 12.23.22** — Animações
- **Sonner 2.0.7** — Toast notifications
- **shadcn/ui** — Componentes reutilizáveis

### Backend

- **Express 4.21.2** — Framework HTTP
- **tRPC 11.6.0** — RPC type-safe
- **Drizzle ORM 0.44.5** — ORM para banco de dados
- **MySQL2 3.15.0** — Driver MySQL
- **bcryptjs 3.0.3** — Hash de senhas
- **Jose 6.1.0** — JWT signing/verification
- **AWS SDK S3 3.693.0** — Upload de arquivos para S3
- **jsPDF 4.2.1** — Geração de PDFs
- **ExcelJS 4.4.0** — Geração de planilhas Excel
- **QRCode 1.5.4** — Geração de QR codes

### DevOps e Testes

- **Vitest 2.1.4** — Testes unitários
- **Playwright 1.58.2** — Testes E2E
- **Drizzle Kit 0.31.4** — Gerenciamento de migrações
- **Prettier 3.6.2** — Formatação de código
- **ESBuild 0.25.0** — Bundler rápido

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ ou TiDB
- Git

### Passos

```bash
# 1. Clonar repositório
git clone https://github.com/arquimedesmsc-crypto/detran-pat.git
cd detran-patrimonio-dashboard

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações (DATABASE_URL, JWT_SECRET, etc.)

# 4. Executar migrações do banco de dados
pnpm db:push

# 5. Iniciar servidor de desenvolvimento
pnpm dev

# 6. Abrir no navegador
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

---

## 📖 Uso

### Login

**Usuários padrão:**

| Usuário | Senha | Role | Acesso |
|---|---|---|---|
| `admin` | `123` | admin | Todos os módulos + Admin |
| `moises.costa` | `123` | user | Patrimônios, Transferência, Relatórios, Perfil |
| `Pedro.Bizarelli` | `123` | user | Patrimônios, Transferência, Relatórios, Perfil |

### Navegação

- **Dashboard** — Visão geral com KPIs e gráficos
- **Patrimônios** — Listagem, filtros, busca, QR Code
- **Transferência** — Emissão de guias de transferência
- **Relatórios** — Exportação em CSV, XLSX, PDF
- **Levantamento** — Conferência anual com fotos
- **Admin** — Gestão de usuários e logs (apenas admin)
- **Perfil** — Edição de dados, tema, idioma, onboarding
- **Ajuda** — FAQ com busca

---

## 🧪 Testes

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

**Cobertura:** 36 testes unitários + 16 testes E2E  
**Status:** ✅ Todos passando

---

## 📚 Documentação

Para informações técnicas completas, consulte:

- **[CONFIGURACOES.md](./CONFIGURACOES.md)** — Banco de dados, portas, variáveis de ambiente, infraestrutura
- **[CHANGELOG.md](./CHANGELOG.md)** — Histórico de versões e atualizações
- **[todo.md](./todo.md)** — Status de funcionalidades e roadmap

---

## 🗺️ Roadmap

### Sprint v21 — Histórico de Transferências

- [ ] Criar rota `/historico-transferencias`
- [ ] Listagem com status (rascunho/emitida/concluída)
- [ ] Botão de reimpressão em PDF
- [ ] Filtros por data, setor, status

### Sprint v22 — Aprovação de Solicitações

- [ ] Interface no Painel Admin
- [ ] Visualização de solicitações pendentes
- [ ] Aprovação/rejeição com comentários
- [ ] Notificação por e-mail ao usuário

### Sprint v23 — Importação em Lote

- [ ] Upload de planilha Excel
- [ ] Validação de dados
- [ ] Cadastro massivo de patrimônios
- [ ] Relatório de importação

### Sprint v24 — Integração com SEI

- [ ] Vinculação de processos SEI-RJ aos patrimônios
- [ ] Consulta de processos via API SEI
- [ ] Rastreamento de documentação

---

## 🔐 Segurança

- **Autenticação:** JWT com HttpOnly cookies
- **Senhas:** bcryptjs (10 rounds)
- **Roles:** admin | user
- **CORS:** Configurado para domínios autorizados
- **Auditoria:** Todas as ações registradas em `system_logs`
- **S3:** Acesso via presigned URLs com expiração

---

## 📊 Estatísticas

| Métrica | Valor |
|---|---|
| Linhas de código | ~15.000 |
| Arquivos | ~120 |
| Testes | 52 (36 unitários + 16 E2E) |
| Componentes React | ~40 |
| Endpoints tRPC | ~30 |
| Tabelas de banco | 8 |
| Usuários | ~5 |
| Patrimônios | 1.207 |

---

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

---

## 📞 Contatos

| Função | Nome | Email |
|---|---|---|
| Desenvolvedor | Moisés da Silva Costa | moises.costa@detran.rj.gov.br |
| Gestora | Michelle Ferreira | michelle.ferreira@detran.rj.gov.br |
| Infraestrutura | Alexandre Mattiole | alexandre.mattiole@detran.rj.gov.br |
| Patrimônio | Pedro Bizarelli | pedro.bizarelli@detran.rj.gov.br |

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- **DETRAN-RJ** — Instituição responsável
- **DTIC** — Divisão de Tecnologia da Informação
- **Manus Platform** — Infraestrutura e hospedagem
- **React, Express, Tailwind** — Comunidades open-source

---

**Desenvolvido com ❤️ por Moisés da Silva Costa (ID: 5028399-5)**  
**Última atualização:** 08/04/2026  
**Versão:** 1.0.0
