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
