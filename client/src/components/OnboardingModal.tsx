import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  BarChart3,
  Shield,
  User,
  HelpCircle,
  QrCode,
  FileDown,
  Search,
  Filter,
  SortAsc,
  Camera,
  ClipboardList,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

// ─── Slides ──────────────────────────────────────────────────────────────────

const SLIDES = [
  // 0 — Boas-vindas
  {
    id: "welcome",
    title: "Bem-vindo ao Sistema de Patrimônio",
    subtitle: "DETRAN-RJ · Gestão Patrimonial 2025/2026",
    description:
      "Este tour interativo apresenta todas as funcionalidades disponíveis. Você pode navegar livremente pelos slides ou pular a qualquer momento.",
    gradient: "from-[#1B4F72] via-[#1A73C4] to-[#1B8A5A]",
    accent: "#1A73C4",
    illustration: (
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-28 h-28 rounded-3xl shadow-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
        >
          <img src={LOGO_URL} alt="DETRAN-RJ" className="w-20 h-20 object-contain" />
        </div>
        <div className="flex gap-3">
          {["Dashboard", "Patrimônios", "Transferência", "Relatórios"].map((label) => (
            <div
              key={label}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 1 — Dashboard
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Visão geral em tempo real",
    description:
      "Acompanhe os indicadores principais do acervo patrimonial: total de itens, valor total, percentual localizado e distribuição por setor — tudo em um único painel.",
    gradient: "from-[#1B4F72] to-[#1A73C4]",
    accent: "#1A73C4",
    illustration: (
      <div className="w-full max-w-sm space-y-3">
        {[
          { label: "Total de Patrimônios", value: "1.207", color: "#1A73C4", icon: Package },
          { label: "Valor Total do Acervo", value: "R$ 4,2M", color: "#1B8A5A", icon: BarChart3 },
          { label: "Itens Localizados", value: "94,3%", color: "#D97706", icon: CheckCircle2 },
          { label: "Setores Ativos", value: "18", color: "#7C3AED", icon: ClipboardList },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: color }}
            >
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/70 text-xs">{label}</div>
              <div className="text-white font-bold text-lg leading-tight">{value}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },

  // 2 — Patrimônios
  {
    id: "patrimonios",
    title: "Gestão de Patrimônios",
    subtitle: "Inventário completo e organizado",
    description:
      "Visualize, busque e gerencie todos os bens do DETRAN-RJ. Filtre por setor, status, tipo, valor e andar. Ordene por qualquer coluna de forma ascendente ou descendente.",
    gradient: "from-[#1B8A5A] to-[#059669]",
    accent: "#1B8A5A",
    illustration: (
      <div className="w-full max-w-sm space-y-2">
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          {/* Barra de busca simulada */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Search size={14} className="text-white/70" />
            <span className="text-white/60 text-xs">Buscar por número, descrição…</span>
          </div>
          {/* Filtros simulados */}
          <div className="flex gap-2 flex-wrap">
            {["Setor", "Status", "Tipo", "Valor", "Andar"].map((f) => (
              <div
                key={f}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white/80"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Filter size={10} />
                {f}
              </div>
            ))}
          </div>
          {/* Linhas da tabela simuladas */}
          {[
            { num: "001234", desc: "Computador Dell", setor: "TI", status: "Localizado" },
            { num: "001235", desc: "Cadeira Executiva", setor: "RH", status: "Localizado" },
            { num: "001236", desc: "Impressora HP", setor: "ADM", status: "Não Localizado" },
          ].map((row) => (
            <div
              key={row.num}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <span className="text-white/60 text-xs font-mono w-14">{row.num}</span>
              <span className="text-white text-xs flex-1 truncate">{row.desc}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: row.status === "Localizado" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
                  color: row.status === "Localizado" ? "#6EE7B7" : "#FCA5A5",
                }}
              >
                {row.status === "Localizado" ? "✓" : "✗"}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/80"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <SortAsc size={12} /> Ordenar
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/80"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <QrCode size={12} /> QR Code
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/80"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Camera size={12} /> Foto
          </div>
        </div>
      </div>
    ),
  },

  // 3 — QR Code
  {
    id: "qrcode",
    title: "QR Code por Patrimônio",
    subtitle: "Identificação rápida e rastreável",
    description:
      "Cada bem possui um QR Code único que pode ser gerado, baixado em PNG ou impresso diretamente. Facilita a identificação física durante levantamentos e auditorias.",
    gradient: "from-[#1B4F72] to-[#7C3AED]",
    accent: "#7C3AED",
    illustration: (
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-40 h-40 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{ background: "rgba(255,255,255,0.95)" }}
        >
          {/* QR Code simulado com SVG */}
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Cantos */}
            <rect x="5" y="5" width="30" height="30" rx="4" fill="#1B4F72" />
            <rect x="10" y="10" width="20" height="20" rx="2" fill="white" />
            <rect x="14" y="14" width="12" height="12" rx="1" fill="#1B4F72" />
            <rect x="65" y="5" width="30" height="30" rx="4" fill="#1B4F72" />
            <rect x="70" y="10" width="20" height="20" rx="2" fill="white" />
            <rect x="74" y="14" width="12" height="12" rx="1" fill="#1B4F72" />
            <rect x="5" y="65" width="30" height="30" rx="4" fill="#1B4F72" />
            <rect x="10" y="70" width="20" height="20" rx="2" fill="white" />
            <rect x="14" y="74" width="12" height="12" rx="1" fill="#1B4F72" />
            {/* Módulos centrais */}
            {[40,45,50,55,60].map(x => [40,45,50,55,60].map(y => (
              Math.random() > 0.5 ? <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1A73C4" /> : null
            )))}
            <rect x="40" y="40" width="4" height="4" fill="#1A73C4" />
            <rect x="48" y="40" width="4" height="4" fill="#1A73C4" />
            <rect x="56" y="40" width="4" height="4" fill="#1A73C4" />
            <rect x="44" y="44" width="4" height="4" fill="#1B8A5A" />
            <rect x="52" y="44" width="4" height="4" fill="#1B8A5A" />
            <rect x="40" y="48" width="4" height="4" fill="#1A73C4" />
            <rect x="48" y="48" width="4" height="4" fill="#1A73C4" />
            <rect x="56" y="48" width="4" height="4" fill="#1A73C4" />
            <rect x="44" y="52" width="4" height="4" fill="#1B8A5A" />
            <rect x="52" y="52" width="4" height="4" fill="#1A73C4" />
            <rect x="40" y="56" width="4" height="4" fill="#1A73C4" />
            <rect x="48" y="56" width="4" height="4" fill="#1B8A5A" />
            <rect x="56" y="56" width="4" height="4" fill="#1A73C4" />
          </svg>
        </div>
        <div className="flex gap-2">
          {[
            { icon: FileDown, label: "Baixar PNG" },
            { icon: QrCode, label: "Imprimir" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-medium"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <Icon size={14} />
              {label}
            </div>
          ))}
        </div>
        <div className="text-white/70 text-xs text-center">
          Patrimônio Nº 001234 · DETRAN-RJ
        </div>
      </div>
    ),
  },

  // 4 — Levantamento Anual
  {
    id: "levantamento",
    title: "Levantamento Anual",
    subtitle: "Conferência física do acervo",
    description:
      "Registre a conferência anual dos bens patrimoniais com upload de fotos comprobatórias. Selecione o ano, marque os itens conferidos e documente com imagens.",
    gradient: "from-[#D97706] to-[#B45309]",
    accent: "#D97706",
    illustration: (
      <div className="w-full max-w-sm space-y-3">
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold text-sm">Levantamento 2025/2026</span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(16,185,129,0.3)", color: "#6EE7B7" }}
            >
              Em andamento
            </span>
          </div>
          {/* Barra de progresso */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Progresso</span>
              <span>847 / 1.207</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{ width: "70%", background: "linear-gradient(90deg, #D97706, #F59E0B)" }}
              />
            </div>
          </div>
          {/* Fotos simuladas */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Camera size={20} className="text-white/60" />
              </div>
            ))}
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center border-2 border-dashed border-white/30 cursor-pointer"
            >
              <span className="text-white/50 text-2xl">+</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 5 — Transferência
  {
    id: "transferencia",
    title: "Guia de Transferência",
    subtitle: "Movimentação formal de bens",
    description:
      "Crie guias de transferência com formulário estruturado em 4 seções: Origem, Destino, Itens e Assinatura. Gere o documento em PDF com identidade visual DETRAN-RJ.",
    gradient: "from-[#7C3AED] to-[#5B21B6]",
    accent: "#7C3AED",
    illustration: (
      <div className="w-full max-w-sm space-y-2">
        {[
          { num: "1", title: "Origem", desc: "Setor e responsável de origem", icon: "📤", done: true },
          { num: "2", title: "Destino", desc: "Setor e responsável de destino", icon: "📥", done: true },
          { num: "3", title: "Itens", desc: "Patrimônios a transferir", icon: "📦", done: false },
          { num: "4", title: "Assinatura", desc: "Signatário e observações", icon: "✍️", done: false },
        ].map(({ num, title, desc, icon, done }) => (
          <div
            key={num}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: done ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                color: done ? "#7C3AED" : "white",
              }}
            >
              {done ? "✓" : num}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm">{icon} {title}</div>
              <div className="text-white/60 text-xs truncate">{desc}</div>
            </div>
          </div>
        ))}
        <div
          className="flex items-center justify-center gap-2 rounded-xl p-3 mt-1"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <FileDown size={16} className="text-white" />
          <span className="text-white font-semibold text-sm">Gerar PDF com Logo DETRAN-RJ</span>
        </div>
      </div>
    ),
  },

  // 6 — Relatórios
  {
    id: "relatorios",
    title: "Exportação de Relatórios",
    subtitle: "Dados em múltiplos formatos",
    description:
      "Exporte o inventário patrimonial com filtros por setor, status e tipo. Escolha entre CSV, XLSX (formatado com identidade DETRAN) ou PDF com cabeçalho oficial.",
    gradient: "from-[#0891B2] to-[#0E7490]",
    accent: "#0891B2",
    illustration: (
      <div className="w-full max-w-sm space-y-3">
        {/* Filtros */}
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div className="text-white/70 text-xs font-medium mb-2">Filtros aplicados:</div>
          <div className="flex flex-wrap gap-2">
            {["Setor: TI", "Status: Localizado", "Tipo: Equipamento"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs text-white font-medium"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                {tag} ×
              </span>
            ))}
          </div>
        </div>
        {/* Formatos */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { fmt: "CSV", color: "#1B8A5A", desc: "Planilha simples" },
            { fmt: "XLSX", color: "#1A73C4", desc: "Excel formatado" },
            { fmt: "PDF", color: "#DC2626", desc: "Documento oficial" },
          ].map(({ fmt, color, desc }) => (
            <div
              key={fmt}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-1 font-bold text-white text-sm"
                style={{ background: color }}
              >
                {fmt}
              </div>
              <div className="text-white/70 text-xs">{desc}</div>
            </div>
          ))}
        </div>
        <div
          className="flex items-center gap-2 rounded-xl p-3"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <FileDown size={16} className="text-white" />
          <span className="text-white text-sm font-medium">Exportar 342 registros</span>
        </div>
      </div>
    ),
  },

  // 7 — Perfil do Usuário
  {
    id: "perfil",
    title: "Perfil do Usuário",
    subtitle: "Personalize sua experiência",
    description:
      "Edite seus dados pessoais, altere a senha, defina cargo e setor. Ative ou desative o tema escuro e configure se deseja ver este tour ao entrar no sistema.",
    gradient: "from-[#1B4F72] to-[#1A73C4]",
    accent: "#1A73C4",
    illustration: (
      <div className="w-full max-w-sm space-y-3">
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          {/* Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1A73C4, #1B8A5A)" }}
            >
              M
            </div>
            <div>
              <div className="text-white font-semibold">Moises Costa</div>
              <div className="text-white/60 text-xs">moises.costa · Analista</div>
            </div>
          </div>
          {/* Campos */}
          {[
            { label: "Nome", value: "Moises Costa" },
            { label: "Cargo", value: "Analista de TI" },
            { label: "Setor", value: "Tecnologia da Informação" },
          ].map(({ label, value }) => (
            <div key={label} className="mb-2">
              <div className="text-white/50 text-xs mb-0.5">{label}</div>
              <div
                className="rounded-lg px-3 py-1.5 text-white text-sm"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {value}
              </div>
            </div>
          ))}
          {/* Toggle tema */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-white/70 text-xs">Tema escuro</span>
            <div
              className="w-10 h-5 rounded-full flex items-center px-0.5"
              style={{ background: "#1B8A5A" }}
            >
              <div className="w-4 h-4 rounded-full bg-white ml-auto" />
            </div>
          </div>
          {/* Toggle onboarding */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-white/70 text-xs">Exibir tour ao entrar</span>
            <div
              className="w-10 h-5 rounded-full flex items-center px-0.5"
              style={{ background: "#1A73C4" }}
            >
              <div className="w-4 h-4 rounded-full bg-white ml-auto" />
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 8 — Painel Admin
  {
    id: "admin",
    title: "Painel Administrativo",
    subtitle: "Controle total do sistema",
    description:
      "Exclusivo para administradores. Gerencie usuários, defina permissões, redefina senhas, ative ou desative contas e acompanhe os logs de todas as ações realizadas no sistema.",
    gradient: "from-[#DC2626] to-[#991B1B]",
    accent: "#DC2626",
    illustration: (
      <div className="w-full max-w-sm space-y-2">
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div className="text-white/70 text-xs font-medium mb-2">Usuários do Sistema</div>
          {[
            { name: "admin", role: "Administrador", active: true },
            { name: "moises.costa", role: "Analista", active: true },
            { name: "Pedro.Bizarelli", role: "Técnico", active: true },
          ].map(({ name, role, active }) => (
            <div
              key={name}
              className="flex items-center gap-2 py-1.5 border-b border-white/10 last:border-0"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1A73C4, #1B8A5A)" }}
              >
                {name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium">{name}</div>
                <div className="text-white/50 text-xs">{role}</div>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: active ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
                  color: active ? "#6EE7B7" : "#FCA5A5",
                }}
              >
                {active ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div className="text-white/70 text-xs font-medium mb-2">Logs Recentes</div>
          {[
            "admin criou usuário Pedro.Bizarelli",
            "moises.costa exportou relatório CSV",
            "admin redefiniu senha de moises.costa",
          ].map((log) => (
            <div key={log} className="text-white/60 text-xs py-0.5 truncate">
              • {log}
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 9 — Ajuda
  {
    id: "ajuda",
    title: "Central de Ajuda",
    subtitle: "Suporte sempre disponível",
    description:
      "Acesse o FAQ com mais de 20 perguntas frequentes organizadas por categoria. Busque respostas em tempo real, consulte guias de uso e entre em contato com o suporte.",
    gradient: "from-[#1B4F72] to-[#1B8A5A]",
    accent: "#1B8A5A",
    illustration: (
      <div className="w-full max-w-sm space-y-3">
        {/* Busca */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <Search size={16} className="text-white/70" />
          <span className="text-white/50 text-sm">Buscar no FAQ…</span>
        </div>
        {/* Categorias */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard },
            { label: "Patrimônios", icon: Package },
            { label: "Transferência", icon: ArrowRightLeft },
            { label: "Relatórios", icon: BarChart3 },
            { label: "Perfil", icon: User },
            { label: "Admin", icon: Shield },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <Icon size={14} className="text-white/80" />
              <span className="text-white/80 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 10 — Conclusão
  {
    id: "finish",
    title: "Pronto para começar!",
    subtitle: "Sistema de Patrimônio DETRAN-RJ",
    description:
      "Você conheceu todas as funcionalidades do sistema. Acesse o Dashboard para ver os indicadores em tempo real ou vá direto para os Patrimônios para iniciar o levantamento.",
    gradient: "from-[#1B4F72] via-[#1A73C4] to-[#1B8A5A]",
    accent: "#1B8A5A",
    illustration: (
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <CheckCircle2 size={48} className="text-white" />
        </div>
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
          {[
            { label: "Dashboard", icon: LayoutDashboard },
            { label: "Patrimônios", icon: Package },
            { label: "Transferência", icon: ArrowRightLeft },
            { label: "Relatórios", icon: BarChart3 },
            { label: "Perfil", icon: User },
            { label: "Ajuda", icon: HelpCircle },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl p-2.5"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Icon size={14} className="text-white" />
              <span className="text-white text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ─── Componente Principal ─────────────────────────────────────────────────────

interface OnboardingModalProps {
  onClose: () => void;
  onDisable?: () => void;
}

export default function OnboardingModal({ onClose, onDisable }: OnboardingModalProps) {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);

  const slide = SLIDES[current];
  const isFirst = current === 0;
  const isLast = current === SLIDES.length - 1;

  const goTo = (idx: number, dir: "left" | "right") => {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 220);
  };

  const next = () => {
    if (isLast) { onClose(); return; }
    goTo(current + 1, "right");
  };

  const prev = () => {
    if (isFirst) return;
    goTo(current - 1, "left");
  };

  // Teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Fundo com gradiente DETRAN */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-500`}
        />

        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
            style={{ background: "white" }}
          />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col md:flex-row h-full" style={{ minHeight: 520 }}>

          {/* Coluna esquerda — Texto */}
          <div className="flex-1 flex flex-col justify-between p-8 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={LOGO_URL} alt="DETRAN" className="w-8 h-8 object-contain" />
                <span className="text-white/80 text-sm font-semibold tracking-wide">DETRAN-RJ</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
              >
                <X size={16} className="text-white/70" />
              </button>
            </div>

            {/* Texto do slide */}
            <div
              className="flex-1"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? `translateX(${animDir === "right" ? "-20px" : "20px"})`
                  : "translateX(0)",
                transition: "opacity 0.22s ease, transform 0.22s ease",
              }}
            >
              <div className="mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}
                >
                  <Sparkles size={10} className="inline mr-1" />
                  {current + 1} de {SLIDES.length}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-4 mb-2 leading-tight">
                {slide.title}
              </h2>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-4">
                {slide.subtitle}
              </p>
              <p className="text-white/85 text-base leading-relaxed">
                {slide.description}
              </p>
            </div>

            {/* Navegação */}
            <div className="mt-8">
              {/* Dots */}
              <div className="flex gap-1.5 mb-5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? "right" : "left")}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 6,
                      height: 6,
                      background: i === current ? "white" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>

              {/* Botões */}
              <div className="flex items-center gap-3">
                {!isFirst && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
                >
                  {isLast ? (
                    <>
                      <CheckCircle2 size={16} />
                      Começar a usar
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Links de rodapé */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={onClose}
                  className="text-white/50 text-xs hover:text-white/80 transition-colors"
                >
                  Pular tour
                </button>
                {onDisable && (
                  <button
                    onClick={() => { onDisable(); onClose(); }}
                    className="text-white/50 text-xs hover:text-white/80 transition-colors"
                  >
                    Não mostrar novamente
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Coluna direita — Ilustração */}
          <div
            className="hidden md:flex flex-col items-center justify-center p-8 w-96 flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? `translateX(${animDir === "right" ? "20px" : "-20px"})`
                  : "translateX(0)",
                transition: "opacity 0.22s ease, transform 0.22s ease",
              }}
            >
              {slide.illustration}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
