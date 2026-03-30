# 🔄 Guia de Sincronização — DETRAN Patrimônio

## 📋 Visão Geral

Este projeto está conectado ao GitHub e ao servidor Manus. A sincronização funciona assim:

```
Seu Computador  ←──git pull──→  GitHub  ←──git push──→  Manus (servidor)
```

---

## 🚀 Uso Rápido

### Opção 1 — Duplo clique (mais fácil)
Dê duplo clique no arquivo **`SINCRONIZAR.bat`** nesta pasta.

### Opção 2 — PowerShell
```powershell
# Abra o PowerShell nesta pasta e execute:
.\sincronizar.ps1
```

### Opção 3 — Comandos Git diretos
```bash
# Baixar atualizações do GitHub
git pull origin main

# Enviar suas alterações para o GitHub
git add .
git commit -m "Descrição da alteração"
git push origin main
```

---

## 📁 Estrutura do Projeto

```
Patrimonio/
├── client/               ← Frontend React
│   └── src/
│       ├── pages/        ← Dashboard, Levantamento, Gráficos
│       ├── components/   ← Sidebar, Modal, Cards
│       └── index.css     ← Tema DETRAN-RJ
├── server/               ← Backend Express + tRPC
│   ├── routers.ts        ← API endpoints
│   └── db.ts             ← Queries do banco
├── drizzle/              ← Schema do banco de dados
│   └── schema.ts
├── seed-patrimonio.mjs   ← Script de importação de dados
├── README.md             ← Documentação completa
├── sincronizar.ps1       ← Script de sincronização
└── SINCRONIZAR.bat       ← Atalho para sincronizar
```

---

## 🌐 Links Importantes

| Recurso | URL |
|---------|-----|
| 🌐 Sistema online | https://detran-pat.manus.space |
| 📦 Repositório GitHub | https://github.com/arquimedesmsc-crypto/detran-pat |
| 🖥️ Painel Manus | https://manus.im |

---

## 🔄 Fluxo de Trabalho Recomendado

### Quando o Manus faz alterações no servidor:
1. Abra o `SINCRONIZAR.bat`
2. Escolha opção **[1] Baixar atualizações do GitHub**
3. Os arquivos locais serão atualizados automaticamente

### Quando você faz alterações locais:
1. Edite os arquivos desejados
2. Abra o `SINCRONIZAR.bat`
3. Escolha opção **[2] Enviar alterações para o GitHub**
4. Digite uma mensagem descritiva (ex: "Adicionar nova planilha")
5. As alterações ficam disponíveis no GitHub

### Sincronização completa (recomendado):
1. Abra o `SINCRONIZAR.bat`
2. Escolha opção **[3] Sincronização completa**
3. Baixa e envia em uma única operação

---

## ⚠️ Situações Comuns

### "Conflito de arquivos"
Ocorre quando o mesmo arquivo foi alterado em dois lugares. Solução:
```bash
git stash          # Salva suas alterações temporariamente
git pull           # Baixa a versão do servidor
git stash pop      # Reaplicar suas alterações
```

### "Permissão negada no push"
O repositório está configurado com token de acesso. Se expirar:
1. Acesse github.com → Settings → Developer settings → Personal access tokens
2. Gere um novo token com permissão `repo`
3. Use o token como senha ao fazer push

### Verificar se está sincronizado
```bash
git status         # Mostra arquivos modificados
git log --oneline -5  # Mostra últimos 5 commits
```

---

## 📞 Suporte

Em caso de dúvidas, acesse o Manus e descreva o problema. O histórico completo do projeto está preservado no Git.

---

*Última atualização: Março 2026 — DETRAN-RJ / DTIC Patrimônio*
