# ============================================================
# DETRAN-RJ Patrimônio — Script de Sincronização Git
# Repositório: https://github.com/arquimedesmsc-crypto/detran-pat
# ============================================================
# Como usar:
#   1. Abra o PowerShell nesta pasta
#   2. Execute: .\sincronizar.ps1
#   3. Escolha a opção desejada
# ============================================================

$REPO_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$REPO_URL = "https://github.com/arquimedesmsc-crypto/detran-pat"

function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "  ║   🏛️  DETRAN-RJ — Sincronização Patrimônio   ║" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  📁 Pasta: $REPO_DIR" -ForegroundColor Gray
    Write-Host "  🌐 GitHub: $REPO_URL" -ForegroundColor Gray
    Write-Host ""
}

function Get-GitStatus {
    Write-Host "  📊 Status atual do repositório:" -ForegroundColor Yellow
    Write-Host ""
    Set-Location $REPO_DIR
    git status --short
    Write-Host ""
    Write-Host "  📋 Últimos 5 commits:" -ForegroundColor Yellow
    git log --oneline -5
    Write-Host ""
}

function Sync-FromGitHub {
    Write-Host "  ⬇️  Baixando atualizações do GitHub..." -ForegroundColor Green
    Set-Location $REPO_DIR
    git fetch origin
    $behind = git rev-list HEAD..origin/main --count
    if ($behind -gt 0) {
        Write-Host "  ✅ $behind novo(s) commit(s) disponível(is). Atualizando..." -ForegroundColor Green
        git pull origin main
        Write-Host ""
        Write-Host "  ✅ Pasta local atualizada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "  ✅ Pasta já está atualizada. Nenhuma mudança." -ForegroundColor Green
    }
    Write-Host ""
}

function Send-ToGitHub {
    Set-Location $REPO_DIR
    $changes = git status --short
    if (-not $changes) {
        Write-Host "  ℹ️  Nenhuma alteração local para enviar." -ForegroundColor Yellow
        Write-Host ""
        return
    }
    Write-Host "  📝 Arquivos modificados:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $msg = Read-Host "  💬 Mensagem do commit (Enter para usar data/hora)"
    if (-not $msg) {
        $msg = "Atualização: $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
    }
    git add .
    git commit -m $msg
    Write-Host ""
    Write-Host "  ⬆️  Enviando para o GitHub..." -ForegroundColor Green
    git push origin main
    Write-Host ""
    Write-Host "  ✅ Alterações enviadas com sucesso!" -ForegroundColor Green
    Write-Host ""
}

function Open-GitHub {
    Start-Process $REPO_URL
    Write-Host "  🌐 Abrindo repositório no navegador..." -ForegroundColor Green
    Write-Host ""
}

# ─── Menu Principal ───────────────────────────────────────────
Write-Header
Get-GitStatus

Write-Host "  O que deseja fazer?" -ForegroundColor White
Write-Host ""
Write-Host "  [1] ⬇️  Baixar atualizações do GitHub (git pull)" -ForegroundColor Cyan
Write-Host "  [2] ⬆️  Enviar alterações para o GitHub (git push)" -ForegroundColor Cyan
Write-Host "  [3] 🔄 Sincronização completa (pull + push)" -ForegroundColor Cyan
Write-Host "  [4] 📊 Ver status detalhado" -ForegroundColor Cyan
Write-Host "  [5] 🌐 Abrir repositório no GitHub" -ForegroundColor Cyan
Write-Host "  [0] ❌ Sair" -ForegroundColor Gray
Write-Host ""

$opcao = Read-Host "  Escolha uma opção"

switch ($opcao) {
    "1" {
        Write-Header
        Sync-FromGitHub
    }
    "2" {
        Write-Header
        Send-ToGitHub
    }
    "3" {
        Write-Header
        Sync-FromGitHub
        Send-ToGitHub
    }
    "4" {
        Write-Header
        Set-Location $REPO_DIR
        git status
        Write-Host ""
        git log --oneline -10
        Write-Host ""
    }
    "5" {
        Open-GitHub
    }
    "0" {
        Write-Host "  👋 Até logo!" -ForegroundColor Gray
    }
    default {
        Write-Host "  ⚠️  Opção inválida." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  Pressione qualquer tecla para fechar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
