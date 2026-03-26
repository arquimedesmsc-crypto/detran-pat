import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  List,
  Menu,
  X,
} from "lucide-react";

const DETRAN_ICON_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/patrimonio", label: "Levantamento", icon: List },
  { path: "/graficos", label: "Gráficos", icon: BarChart3 },
];

const SIDEBAR_BG = "oklch(0.22 0.05 250)";
const SIDEBAR_BORDER = "oklch(0.3 0.05 250)";
const SIDEBAR_MUTED = "oklch(0.65 0.05 240)";
const SIDEBAR_TEXT = "oklch(0.75 0.04 240)";

interface PatrimonioLayoutProps {
  children: React.ReactNode;
}

export default function PatrimonioLayout({ children }: PatrimonioLayoutProps) {
  const [location] = useLocation();
  // desktop: sidebar expandida/colapsada
  const [collapsed, setCollapsed] = useState(false);
  // mobile: drawer aberto/fechado — começa FECHADO
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fecha o drawer mobile ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Impede scroll do body quando drawer mobile está aberto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Header da sidebar */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
        style={{ borderColor: SIDEBAR_BORDER }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
          style={{
            width: 40, height: 40,
            background: "white",
            boxShadow: "0 2px 8px rgba(26,115,196,0.3)",
          }}
        >
          <img src={DETRAN_ICON_URL} alt="D" style={{ width: 32, height: 32, objectFit: "contain" }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="text-white font-black text-sm leading-tight">DETRAN-RJ</p>
            <p className="text-xs leading-tight" style={{ color: SIDEBAR_MUTED }}>Patrimônio</p>
          </div>
        )}
        {/* Botão fechar no mobile */}
        <button
          className="lg:hidden ml-auto p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === "/" ? location === "/" : location.startsWith(path);
          return (
            <Link key={path} href={path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-150 ${
                  isActive ? "sidebar-item-active" : "hover:bg-white/5"
                }`}
              >
                <Icon
                  size={20}
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
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: SIDEBAR_BORDER }}>
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full"
            style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #1a73c4, #1b8a5a)",
            }}
          >
            <Building2 size={16} className="text-white" />
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
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── MOBILE DRAWER ─────────────────────────────────────────────── */}
      {/* Overlay escuro */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer deslizante — mobile */}
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

      {/* ── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col relative flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: SIDEBAR_BG,
        }}
      >
        {sidebarContent}

        {/* Botão colapsar — somente desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border border-border text-slate-500 hover:text-slate-700 transition-colors z-10"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL ────────────────────────────────────────── */}
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
          <span className="font-black text-sm" style={{ color: "#1b4f72" }}>
            DETRAN-RJ Patrimônio
          </span>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
