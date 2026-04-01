# 📋 TODO — DETRAN-RJ Patrimônio Dashboard

> Rastreamento de funcionalidades, bugs e melhorias do sistema.
> Última atualização: 2026-04-01

---

## ✅ Funcionalidades Concluídas

### 🏗️ Infraestrutura
- [x] Scaffold React 19 + Tailwind 4 + Express 4 + tRPC 11
- [x] Drizzle ORM com MySQL/TiDB
- [x] Autenticação local com JWT (independente do Manus OAuth)
- [x] Roles: `admin` e `user` com proteção de rotas
- [x] Subdomínio `pat.moisescosta.org` configurado e ativo
- [x] Domínios `moisescosta.org` e `www.moisescosta.org` configurados

### 🗄️ Banco de Dados
- [x] Tabela `patrimonio_items` com 1207 registros importados
- [x] Tabela `app_users` com usuários admin, moises.costa, Pedro.Bizarelli
- [x] Tabela `system_logs` para auditoria de ações
- [x] Tabela `transferencias` e `transferencia_itens`
- [x] Tabela `levantamento_anual` e `levantamento_fotos`
- [x] Campo `andar` adicionado ao `patrimonio_items`

### 🎨 Identidade Visual
- [x] Paleta DETRAN-RJ: azul `#1A73C4`, verde `#1B8A5A`, gradiente diagonal
- [x] Tipografia Inter (Google Fonts)
- [x] Splash screen animada com logo DETRAN-RJ
- [x] Favicon com logo DETRAN-RJ (gradiente azul-verde)
- [x] CSS global com efeitos 3D, bordas de realce, glass cards, animações
- [x] Page headers com gradiente e ícones DETRAN

### 📊 Dashboard
- [x] KPIs: total, localizados, não localizados, valor total
- [x] Gráfico de barras por setor
- [x] Timeline de incorporações
- [x] Valor total do acervo e valor localizado

### 🏛️ Patrimônios (`/patrimonio`)
- [x] Listagem com paginação, busca e filtros
- [x] Submenus: Localizados (`/localizados`) e Não Localizados (`/nao-localizados`)
- [x] Modal de novo patrimônio com upload de imagem no topo
- [x] Modal de detalhe com edição inline e galeria de fotos
- [x] Ordenação por todos os campos (ascendente/descendente)
- [x] Filtros avançados: setor, status, tipo, valor mín/máx, andar
- [x] QR Code por patrimônio (gerar, baixar PNG, imprimir)
- [x] Botão "Identificar como Localizado"

### 🔄 Transferência (`/transferencia`)
- [x] Formulário com 4 seções colapsáveis (Origem, Destino, Itens, Assinatura)
- [x] Busca e seleção de patrimônios para transferência
- [x] Geração de Guia de Transferência em PDF com identidade DETRAN-RJ

### 📈 Relatórios (`/relatorios`)
- [x] Filtros por setor, status e tipo
- [x] Exportação em CSV (UTF-8, separador ponto-e-vírgula)
- [x] Exportação em XLSX (cabeçalho colorido DETRAN-RJ)
- [x] Exportação em PDF (logo, data, filtros aplicados)
- [x] Preview dos dados antes da exportação

### 📅 Levantamento Anual (`/levantamento`)
- [x] Registro de conferência anual com seletor de ano
- [x] Upload de fotos via S3
- [x] Visualização em modal/lightbox

### 🛡️ Painel Admin (`/admin`)
- [x] Gestão de usuários: criar, editar, ativar/desativar, redefinir senha
- [x] Logs de atividade com filtros
- [x] Visível apenas para `role=admin`

### 👤 Perfil do Usuário (`/perfil`)
- [x] Edição de nome, e-mail, cargo, setor, ID funcional
- [x] Alteração de senha com confirmação
- [x] Toggle de tema claro/escuro
- [x] Solicitação de alteração de cargo/setor (requer aprovação do admin)
- [x] Toggle de Tutorial de Boas-vindas (ativar/desativar onboarding)

### 🎓 Onboarding e Ajuda
- [x] Onboarding automático na primeira visita (localStorage)
- [x] Tour interativo em 5 passos
- [x] OnboardingModal fullscreen com 11 slides animados cobrindo todas as funcionalidades
- [x] Campo `onboarding_enabled` no banco de dados (tabela `app_users`)
- [x] Toggle de onboarding na página de Perfil (ativar/desativar)
- [x] Botão "Reativar e ver tutorial agora" no perfil
- [x] Integração automática no App.tsx com lógica de exibição por sessão
- [x] Página de Ajuda (`/ajuda`) com FAQ em 5 categorias, busca em tempo real
- [x] Componente `ConfirmDialog` reutilizável com 6 variantes

### 🧪 Testes
- [x] 36 testes unitários passando (4 arquivos)
- [x] Testes E2E com Playwright (auth + navegação)
- [x] Scripts `test:e2e` e `test:all` no `package.json`

### 📚 Documentação
- [x] `CHANGELOG.md` com histórico completo de versões
- [x] `todo.md` atualizado com status final

---

## 🔮 Backlog — Próximas Funcionalidades

- [ ] **Histórico de transferências** — Listar guias emitidas com status (rascunho/emitida/concluída) e reimpressão
- [ ] **Aprovação de solicitações de perfil** — Admin aprova alterações de cargo/setor solicitadas por usuários
- [ ] **Notificações por e-mail** — Ao emitir transferência, notificar setor destino automaticamente
- [ ] **Dashboard de auditoria** — Gráficos de atividade no Painel Admin (usuários mais ativos, ações frequentes)
- [ ] **Importação em lote** — Upload de planilha Excel para cadastro massivo de patrimônios
- [ ] **Relatório de depreciação** — Cálculo automático de depreciação por tipo de bem
- [ ] **Integração com SEI** — Vincular processos SEI-RJ aos patrimônios

---

## 🧪 Cobertura de Testes

| Arquivo | Testes | Status |
|---|---|---|
| `server/auth.logout.test.ts` | 1 | ✅ |
| `server/patrimonio.test.ts` | 9 | ✅ |
| `server/export.test.ts` | 12 | ✅ |
| `server/perfil.test.ts` | 14 | ✅ |
| `e2e/auth.spec.ts` | 4 | ✅ |
| `e2e/navigation.spec.ts` | 12 | 🔄 Requer servidor ativo |
| **Total unitários** | **36** | **✅ Todos passando** |

---

## 👥 Usuários do Sistema

| Usuário | Senha | Role | Acesso |
|---|---|---|---|
| `admin` | `123` | `admin` | Todos os módulos + Administração |
| `moises.costa` | `123` | `user` | Patrimônios, Transferência, Relatórios, Perfil |
| `Pedro.Bizarelli` | `123` | `user` | Patrimônios, Transferência, Relatórios, Perfil |

---

## 🌐 Domínios

| Domínio | Tipo | Status |
|---|---|---|
| `pat.moisescosta.org` | Customizado (principal) | ✅ Ativo |
| `www.moisescosta.org` | Customizado | ✅ Ativo |
| `moisescosta.org` | Customizado | ✅ Ativo |
| `detrandash-otclswdp.manus.space` | Manus (legado) | ⚠️ Removido do acesso público |


## ✅ Sprint v17 — Onboarding Visual Completo DETRAN-RJ

- [x] Recriar OnboardingModal como overlay fullscreen com slides animados
- [x] Slide 1: Boas-vindas com logo DETRAN, gradiente e animação de entrada
- [x] Slide 2: Dashboard — preview visual com KPIs e gráficos
- [x] Slide 3: Patrimônios — preview da tabela com filtros e QR Code
- [x] Slide 4: Transferência — preview do formulário e PDF
- [x] Slide 5: Relatórios — preview dos formatos de exportação
- [x] Slide 6: Perfil e Admin — preview das configurações
- [x] Slides 7-11: Funcionalidades avançadas (QR Code, Levantamento Anual, Ajuda, Conclusão)
- [x] Indicadores de progresso (dots) com animação
- [x] Persistência via banco de dados (campo `onboarding_enabled`)
- [x] Toggle de onboarding na página de Perfil
- [x] Responsivo mobile-first
- [x] 36 testes unitários passando após implementação

## ✅ Sprint v18 — Onboarding Permanente a Cada Login

- [x] Remover controle de sessionStorage/localStorage do onboarding
- [x] Exibir onboarding toda vez que o usuário fizer login (não apenas uma vez por sessão)
- [x] Respeitar apenas o campo `onboarding_enabled` do banco para controle de exibição
