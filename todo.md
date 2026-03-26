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
