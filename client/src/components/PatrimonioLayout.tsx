import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  List,
  Menu,
  Plus,
  X,
} from "lucide-react";
import NovoPatrimonioModal from "./NovoPatrimonioModal";

const DETRAN_ICON_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

const SIDEBAR_BG = "oklch(0.22 0.05 250)";
const SIDEBAR_BORDER = "oklch(0.3 0.05 250)";
const SIDEBAR_MUTED = "oklch(0.65 0.05 240)";
const SIDEBAR_TEXT = "oklch(0.75 0.04 240)";

interface PatrimonioLayoutProps {
  children: React.ReactNode;
}

export default function PatrimonioLayout({ children }: PatrimonioLayoutProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [levantamentoOpen, setLevantamentoOpen] = useState(
    location.startsWith("/patrimonio") ||
    location.startsWith("/localizados") ||
    location.startsWith("/nao-localizados")
  );
  const [novoModalOpen, setNovoModalOpen] = useState(false);

  // Fecha drawer mobile ao mudar de rota
  useEffect(() => { setMobileOpen(false); }, [location]);

  // Expande submenu se estiver numa rota de levantamento
  useEffect(() => {
    if (
      location.startsWith("/patrimonio") ||
      location.startsWith("/localizados") ||
      location.startsWith("/nao-localizados")
    ) {
      setLevantamentoOpen(true);
    }
  }, [location]);

  // Bloqueia scroll quando drawer mobile está aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isLevantamentoActive =
    location === "/patrimonio" ||
    location.startsWith("/localizados") ||
    location.startsWith("/nao-localizados");

  function NavItem({
    path,
    label,
    icon: Icon,
    exact = false,
  }: {
    path: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
  }) {
    const isActive = exact ? location === path : location.startsWith(path);
    return (
      <Link href={path}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 mx-2 mb-0.5 rounded-lg cursor-pointer transition-all duration-150 ${
            isActive ? "sidebar-item-active" : "hover:bg-white/5"
          }`}
        >
          <Icon
            size={18}
            className="flex-shrink-0"
            style={{ color: isActive ? "#1b8a5a" : SIDEBAR_MUTED }}
          />
          {!collapsed && (
            <span
              className="text-sm font-medium truncate"
              style={{ color: isActive ? "white" : SIDEBAR_TEXT }}
            >
              {label}
            </span>
          )}
        </div>
      </Link>
    );
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
        style={{ borderColor: SIDEBAR_BORDER }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
          style={{ width: 40, height: 40, background: "white", boxShadow: "0 2px 8px rgba(26,115,196,0.3)" }}
        >
          <img src={DETRAN_ICON_URL} alt="D" style={{ width: 32, height: 32, objectFit: "contain" }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="text-white font-black text-sm leading-tight">DETRAN-RJ</p>
            <p className="text-xs leading-tight" style={{ color: SIDEBAR_MUTED }}>Patrimônio</p>
          </div>
        )}
        <button
          className="lg:hidden ml-auto p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Botão Novo Patrimônio */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => { setNovoModalOpen(true); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
          >
            <Plus size={16} />
            Novo Patrimônio
          </button>
        </div>
      )}
      {collapsed && (
        <div className="px-2 pt-3 pb-1">
          <button
            onClick={() => setNovoModalOpen(true)}
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
            title="Novo Patrimônio"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Navegação */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {/* Dashboard */}
        <NavItem path="/" label="Dashboard" icon={LayoutDashboard} exact />

        {/* Levantamento — com submenu */}
        <div>
          <button
            onClick={() => !collapsed && setLevantamentoOpen((v) => !v)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 mx-0 mb-0.5 rounded-none cursor-pointer transition-all duration-150 ${
              isLevantamentoActive && !levantamentoOpen ? "sidebar-item-active" : "hover:bg-white/5"
            }`}
            style={{ margin: "0 8px", width: "calc(100% - 16px)", borderRadius: 8 }}
          >
            <List
              size={18}
              className="flex-shrink-0"
              style={{ color: isLevantamentoActive ? "#1b8a5a" : SIDEBAR_MUTED }}
            />
            {!collapsed && (
              <>
                <span
                  className="text-sm font-medium flex-1 text-left truncate"
                  style={{ color: isLevantamentoActive ? "white" : SIDEBAR_TEXT }}
                >
                  Levantamento
                </span>
                <ChevronDown
                  size={14}
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: SIDEBAR_MUTED,
                    transform: levantamentoOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </>
            )}
          </button>

          {/* Submenus */}
          {!collapsed && levantamentoOpen && (
            <div className="ml-4 mt-0.5 mb-0.5 border-l pl-2" style={{ borderColor: SIDEBAR_BORDER }}>
              <Link href="/patrimonio">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                    location === "/patrimonio" ? "sidebar-item-active" : "hover:bg-white/5"
                  }`}
                >
                  <List
                    size={15}
                    style={{ color: location === "/patrimonio" ? "#1b8a5a" : SIDEBAR_MUTED }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: location === "/patrimonio" ? "white" : SIDEBAR_TEXT }}
                  >
                    Todos os Bens
                  </span>
                </div>
              </Link>
              <Link href="/localizados">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                    location === "/localizados" ? "sidebar-item-active" : "hover:bg-white/5"
                  }`}
                >
                  <CheckCircle2
                    size={15}
                    style={{ color: location === "/localizados" ? "#1b8a5a" : SIDEBAR_MUTED }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: location === "/localizados" ? "white" : SIDEBAR_TEXT }}
                  >
                    Localizados
                  </span>
                </div>
              </Link>
              <Link href="/nao-localizados">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    location === "/nao-localizados" ? "sidebar-item-active" : "hover:bg-white/5"
                  }`}
                >
                  <AlertTriangle
                    size={15}
                    style={{ color: location === "/nao-localizados" ? "#d4a017" : SIDEBAR_MUTED }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: location === "/nao-localizados" ? "white" : SIDEBAR_TEXT }}
                  >
                    Não Localizados
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Gráficos */}
        <NavItem path="/graficos" label="Gráficos" icon={BarChart3} />
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: SIDEBAR_BORDER }}>
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
          >
            <LayoutDashboard size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white/80 truncate">DTIC / Patrimônio</p>
              <p className="text-xs" style={{ color: "oklch(0.5 0.04 240)" }}>2025/2026</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile drawer */}
        <div
          className="fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out"
          style={{
            width: 260,
            background: SIDEBAR_BG,
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          {sidebarContent}
        </div>

        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col relative flex-shrink-0 transition-all duration-300"
          style={{ width: collapsed ? 64 : 240, background: SIDEBAR_BG }}
        >
          {sidebarContent}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border border-border text-slate-500 hover:text-slate-700 transition-colors z-10"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Topbar mobile */}
          <header
            className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-white flex-shrink-0"
            style={{ borderColor: "oklch(0.9 0.01 240)" }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={22} className="text-slate-700" />
            </button>
            <img src={DETRAN_ICON_URL} alt="DETRAN-RJ" className="w-7 h-7 object-contain" />
            <span className="font-black text-sm flex-1" style={{ color: "#1b4f72" }}>
              DETRAN-RJ Patrimônio
            </span>
            {/* Botão Novo no mobile topbar */}
            <button
              onClick={() => setNovoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
            >
              <Plus size={14} />
              Novo
            </button>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Modal global de novo patrimônio */}
      <NovoPatrimonioModal
        open={novoModalOpen}
        onClose={() => setNovoModalOpen(false)}
      />
    </>
  );
}
