# DETRAN-RJ Patrimônio Dashboard - TODO

## Backend
- [x] Schema do banco: tabela `patrimonio_items` com todos os campos
- [x] Migração SQL aplicada via webdev_execute_sql
- [x] Helper de query em server/db.ts
- [x] Router tRPC: listagem com paginação/filtros, KPIs, gráficos
- [x] Seed script para importar dados da planilha Excel (1207 registros importados)

## Frontend - Estrutura
- [x] index.css com tema DETRAN-RJ (CSS variables, Roboto, degradês)
- [x] SplashScreen animada (logo, barra de progresso degradê, fade-out)
- [x] DashboardLayout customizado (sidebar escura, logo D, item ativo borda verde)
- [x] App.tsx com rotas: /, /patrimonio, /graficos

## Frontend - Páginas
- [x] Dashboard principal com cards KPI (total, por setor, valor não localizado, distribuição local)
- [x] Tabela interativa com busca, filtros (setor/local/data) e paginação
- [x] Badges coloridos de status (localizado/não localizado) e tipo de bem
- [x] Gráfico de barras: distribuição por setor
- [x] Gráfico de linha: timeline de incorporações

## Assets
- [x] Upload logo DETRAN-RJ para CDN
- [x] Favicon configurado

## Testes
- [x] Vitest para routers de patrimônio (10 testes passando)
- [x] Checkpoint final

## Correções Mobile (v2)
- [x] Sidebar: no mobile deve iniciar fechada e abrir como drawer (overlay) ao clicar no hamburguer
- [x] Sidebar: botão de colapso (desktop) não deve aparecer no mobile
- [x] Tabela: layout responsivo com scroll horizontal e colunas adaptadas para mobile
- [x] Tabela: campos não devem ser cortados — usar layout de card no mobile
- [x] Filtros: reorganizar para mobile (stacked)

## Melhorias v3
- [x] Investigar e corrigir exibição de valores (campo valor no banco e conversão numérica)
- [x] Modal/drawer de detalhe do item: todas as informações + histórico visual
- [x] Dashboard: adicionar KPI de valor total do acervo e valor total localizado
- [x] Listagem: colunas mais relevantes em destaque, clique em qualquer linha abre modal
- [x] Corrigir valor nos cards mobile da listagem

## Melhorias v4
- [x] Sidebar: submenu "Levantamento" com itens Localizados e Não Localizados
- [x] Rotas /localizados e /nao-localizados com listagem pré-filtrada
- [x] Backend: mutation para criar novo item patrimonial
- [x] Backend: mutation para marcar item como localizado
- [x] Modal "Registrar Novo Patrimônio" com formulário completo
- [x] Botão "Identificar como Localizado" no modal de detalhe
- [x] Botão flutuante/fixo "Novo Patrimônio" na listagem
- [x] Feedback visual (toast) após registrar ou localizar item

## Correções v4
- [x] Diagnosticar e corrigir valor zerado nos bens localizados (planilha fonte só tem valor para não localizados)
- [x] Dashboard: seção de valores em bloco separado com mais espaçamento
- [x] Dashboard: grid de contagens (3 cards) separado do grid de valores (3 cards)

## Correções v5
- [x] Diagnosticar e corrigir lentidão na listagem (índices, query, payload)
- [x] Dashboard: valor localizado = valorTotal - valorNaoLocalizado (cálculo fixo)

## Documentação v6
- [x] README.md completo e detalhado
- [x] Commit e push no GitHub

## Correções v7
- [x] Corrigir erro de carregamento na página Todos os Bens (status vazio enviado como string vazia)
- [x] Adicionar ordenação por valor (maior→menor / menor→maior) e por todas as colunas

## Correções v8
- [x] Corrigir repositório GitHub (repositório privado, push forcável com checkpoint)
- [x] Corrigir @import Roboto fora de ordem no CSS
- [x] Validar correção do status vazio na listagem

## Sprint v9 — Login JWT, Levantamento Anual, Polimento Visual

### Backend
- [x] Schema: tabela `app_users` (login simplificado, sem Manus OAuth)
- [x] Schema: tabela `levantamento_anual` e `levantamento_fotos`
- [x] Router: auth.login / auth.me / auth.logout (JWT simples)
- [x] Seed: usuários admin, moises.costa, pedro.bizarelli (senha 123)
- [x] Router: levantamento CRUD (criar, listar, editar, excluir)
- [x] Router: upload de imagem (S3), otimização e thumbnail

### Frontend — Login
- [x] Tela de login DETRAN-RJ (nova home, gradiente, logo, formulário)
- [x] Contexto de autenticação local (JWT no localStorage)
- [x] Proteção de rotas (redirect para /login se não autenticado)
- [x] Header com nome do usuário logado e botão logout

### Frontend — Levantamento Anual
- [x] Página /levantamento-anual com seletor de ano
- [x] Formulário de novo item com upload de foto (câmera + galeria)
- [x] Visualização de fotos em modal/lightbox
- [x] Otimização de imagem no frontend antes do upload

### Frontend — Polimento Visual
- [x] Cards com efeito 3D (transform perspective, hover lift)
- [x] Transições suaves em todos os cards (200ms ease)
- [x] Sombras coloridas nos cards KPI (box-shadow com cor do card)
- [x] Detalhes gráficos: gradiente nos ícones, bordas animadas
- [x] Diálogos de confirmação para ações importantes
- [x] Identidade visual consistente em todos os botões e menus
- [x] Micro-animações: hover, focus, active states

### Skill
- [x] Criar skill detran-ui-components com padrões de botões, cards, telas (integrado ao detran-design-system)

## Sprint v10 — QR Code, Guia de Transferência, Admin, Relatórios

### Backend
- [ ] Schema: tabela `system_logs` (ação, usuário, entidade, detalhes, timestamp)
- [ ] Schema: atualizar `app_users` com cargo, id_funcional, setor
- [ ] Seed: atualizar moises.costa com dados completos (Moisés da Silva Costa, ATI, ID:5028399-5)
- [ ] Router: admin.listUsers / createUser / updateUser / toggleActive
- [ ] Router: admin.logs (listar logs de alteração do sistema)
- [ ] Router: transferencia.criar / listar / pdf

### Frontend — QR Code
- [ ] Modal de QR Code por patrimônio (gerar, visualizar, baixar PNG, imprimir)
- [ ] QR Code contém: número do patrimônio, descrição, setor e URL do sistema
- [ ] Botão "QR Code" na tabela e no modal de detalhe do item

### Frontend — Guia de Transferência
- [ ] Página /transferencia com formulário: origem, destino, itens, responsável
- [ ] Seletor de usuário signatário com carimbo automático (nome, cargo, ID funcional)
- [ ] Geração de PDF com identidade visual DETRAN-RJ (logo, gradiente, tabela de itens)
- [ ] PDF inclui: carimbo do signatário, data/hora, número do protocolo

### Frontend — Painel Admin
- [ ] Rota /admin protegida por role=admin
- [ ] Seção: gestão de usuários (criar, editar, ativar/desativar, redefinir senha)
- [ ] Seção: logs de alteração (tabela com filtros por usuário/ação/data)
- [ ] Seção: configurações gerais do sistema (nome, ano do levantamento)
- [ ] Item "Admin" na sidebar visível apenas para role=admin

### Frontend — Relatórios (substituir Gráficos)
- [ ] Página /relatorios com seletor de tipo de exportação
- [ ] Exportar CSV: todos os campos, separador ponto-e-vírgula, encoding UTF-8
- [ ] Exportar XLSX: planilha formatada com cabeçalho colorido DETRAN-RJ
- [ ] Exportar PDF: relatório tabular com logo, data e filtros aplicados
- [ ] Filtros antes da exportação: setor, status, tipo, período

### Polimento Visual
- [ ] Consistência de botões em todas as telas (usar .btn-detran / .btn-danger)
- [ ] Sidebar: item Admin com ícone de escudo, visível só para admin
- [ ] Sidebar: renomear "Gráficos" para "Relatórios"
- [ ] Transições de página (fade entre rotas)

## Correção Urgente — Sidebar
- [x] Corrigir menu de navegação lateral sumido (desktop e mobile)
- [x] Criar tabelas no banco: app_users, system_logs, transferencias, transferencia_itens
- [x] Inserir usuários padrão: admin, moises.costa, Pedro.Bizarelli
- [x] QR Code modal implementado (gerar, baixar PNG, imprimir)
- [x] Seção Transferência no menu lateral (visível para todos os 3 usuários)
- [x] Página /transferencia com formulário e geração de PDF
- [x] Painel Admin (/admin) com gestão de usuários e logs (visível apenas para admin)


## Sprint v11 — Exportação de Relatórios (CSV, XLSX, PDF)

### Backend
- [x] Router: patrimonio.export (query com filtros, retorna CSV/XLSX/PDF)
- [x] Helpers: formatarCSV, formatarXLSX, formatarPDF com identidade visual DETRAN-RJ
- [x] Testes unitários para funções de exportação (19 testes passando)

### Frontend — Página Relatórios
- [x] Rota /relatorios com formulário de filtros (setor, status, tipo)
- [x] Seletor de formato de exportação (CSV, XLSX, PDF)
- [x] Botão "Exportar" que dispara download do arquivo
- [x] Preview dos dados que serão exportados (tabela com filtros aplicados)
- [x] Item "Relatórios" no menu lateral com ícone BarChart3

### Polimento
- [x] Renomear "Gráficos" para "Relatórios" no menu lateral
- [x] Formatação de moeda (R$) nos relatórios
- [x] Formatação de data (DD/MM/YYYY) nos relatórios


## Sprint v12 — UX Improvements (Menu, Formulários, Transferência)

### Frontend — Menu Lateral
- [x] Renomear "Levantamento" para "Patrimônios" no menu lateral
- [x] Manter submenus "Localizados" e "Não Localizados" sob "Patrimônios"

### Frontend — Formulário Novo Patrimônio
- [x] Mover upload de imagem para o topo do formulário (antes de outros campos)
- [x] Exibir preview da imagem selecionada
- [x] Botão para remover imagem selecionada

### Frontend — Aba Transferência
- [x] Reorganizar com dropdowns para agrupar informações
- [x] Seção 1: Origem (setor origem, local origem)
- [x] Seção 2: Destino (setor destino, local destino)
- [x] Seção 3: Itens (busca e seleção de patrimônios)
- [x] Seção 4: Assinatura (signatário, cargo, ID funcional, observações)
- [x] Dropdowns colapsáveis para melhor organização visual


## Sprint v13 — Ordenação, Filtros Avançados e Domínio Customizado

### Frontend — Aba Patrimônios (Ordenação e Filtros)
- [x] Adicionar seletor de ordenação (ascendente, descendente, por valor, por andar, por número, alfabética)
- [x] Implementar filtro expandido com múltiplas opções (setor, status, tipo, valor mín/máx, andar)
- [x] Botão para limpar todos os filtros
- [x] Indicador visual de ordenação (setas ascendente/descendente)

### Backend — Suporte a Ordenação e Filtros
- [x] Adicionar campo andar ao schema de patrimônio
- [x] Adicionar parâmetros de ordenação ao trpc.patrimonio.list
- [x] Adicionar parâmetros de filtro expandido (setor, status, tipo, valor, andar)
- [x] Atualizar colMap para suportar ordenação por andar

### Infraestrutura — Domínio Customizado
- [x] Domínios configurados: moisescosta.org, www.moisescosta.org
- [ ] Configurar subdomínio www.pat.moisescosta.org
- [ ] Apontar www.pat.moisescosta.org para o dashboard


## Sprint v14 — Onboarding Completo do Sistema

### Frontend — Página de Onboarding
- [ ] Rota /onboarding com guias visuais dos principais recursos
- [ ] Cards com ícones explicando: Dashboard, Patrimônios, Transferência, Relatórios, Admin
- [ ] Botões "Começar" que levam para cada seção
- [ ] Indicador de progresso (step 1/5, 2/5, etc)
- [ ] Botão "Pular" para usuários experientes

### Frontend — Tour Guiado (Spotlight)
- [ ] Implementar biblioteca de spotlight (highlight de elementos)
- [ ] Tour automático na primeira visita (pode ser desativado)
- [ ] Guias contextuais: Dashboard → Patrimônios → Transferência → Relatórios
- [ ] Tooltips explicativos em cada funcionalidade

### Frontend — Página de Ajuda (Help)
- [ ] Rota /ajuda com FAQ estruturado por seção
- [ ] Vídeos em embed (YouTube ou hospedados) mostrando fluxos principais
- [ ] Screenshots anotadas das principais telas
- [ ] Busca dentro da FAQ
- [ ] Links para contato/suporte

### Frontend — Modais de Boas-vindas
- [ ] Modal na primeira visita: "Bem-vindo ao DETRAN Patrimônio"
- [ ] Dicas contextuais ao abrir cada seção pela primeira vez
- [ ] Botão "Mostrar dica novamente" para usuários que fecharam
- [ ] Armazenar preferências no localStorage (não mostrar mais)

### Backend
- [ ] Adicionar tabela `user_preferences` para armazenar onboarding_completed, tour_completed
- [ ] Mutation: marcar onboarding como concluído
- [ ] Query: verificar status do onboarding do usuário

### Polimento
- [ ] Animações suaves nas transições de onboarding
- [ ] Responsivo para mobile (cards em coluna única)
- [ ] Acessibilidade: ARIA labels, navegação por teclado


## Sprint v15 — Onboarding Automático, Design Melhorado e Favicon

- [x] Onboarding automático na primeira visita (localStorage para rastrear)
- [x] Remover item "Guia de Boas-vindas" do menu lateral
- [x] Melhorar página de Ajuda com design DETRAN-RJ (cores, cards, ícones, busca, 5 categorias)
- [x] Adicionar favicon com logo DETRAN (gradiente azul-verde com letra D)
