import { useState } from "react";
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

interface PatrimonioLayoutProps {
  children: React.ReactNode;
}

export default function PatrimonioLayout({ children }: PatrimonioLayoutProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 lg:relative lg:translate-x-0"
        style={{
          width: collapsed ? 64 : 240,
          background: "oklch(0.22 0.05 250)",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-b"
          style={{ borderColor: "oklch(0.3 0.05 250)" }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
            style={{
              width: 40,
              height: 40,
              background: "white",
              boxShadow: "0 2px 8px rgba(26,115,196,0.3)",
            }}
          >
            <img src={DETRAN_ICON_URL} alt="D" style={{ width: 32, height: 32, objectFit: "contain" }} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-black text-sm leading-tight">DETRAN-RJ</p>
              <p className="text-xs leading-tight" style={{ color: "oklch(0.65 0.05 240)" }}>
                Patrimônio
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link key={path} href={path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-150 ${
                    isActive ? "sidebar-item-active" : "hover:bg-white/5"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon
                    size={20}
                    className="flex-shrink-0"
                    style={{ color: isActive ? "#1b8a5a" : "oklch(0.65 0.05 240)" }}
                  />
                  {!collapsed && (
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: isActive ? "white" : "oklch(0.75 0.04 240)" }}
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
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "oklch(0.3 0.05 250)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #1a73c4, #1b8a5a)",
              }}
            >
              <Building2 size={16} />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white/80 truncate">DTIC / Patrimônio</p>
                <p className="text-xs" style={{ color: "oklch(0.5 0.04 240)" }}>
                  2025/2026
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border border-border text-slate-500 hover:text-slate-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-white"
          style={{ borderColor: "oklch(0.9 0.01 240)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
          <img src={DETRAN_ICON_URL} alt="DETRAN-RJ" className="w-7 h-7 object-contain" />
          <span className="font-bold text-sm" style={{ color: "#1b4f72" }}>
            DETRAN-RJ Patrimônio
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
