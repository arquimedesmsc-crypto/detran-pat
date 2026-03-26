import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Layers,
  Monitor,
  Package,
  Sofa,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

const TIPO_ICONS: Record<string, React.ElementType> = {
  informatica: Monitor,
  mobiliario: Sofa,
  eletrodomestico: Zap,
  veiculo: Building2,
  outros: Package,
};

const TIPO_COLORS = ["#1a73c4", "#1b8a5a", "#d4a017", "#dc2626", "#7c3aed"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className={`kpi-card rounded-xl p-5 text-white shadow-lg ${gradient}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70 mb-1 leading-tight">{title}</p>
          <p className="text-2xl sm:text-3xl font-black leading-tight break-all">{value}</p>
          {subtitle && <p className="text-xs text-white/60 mt-1 leading-tight">{subtitle}</p>}
        </div>
        <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white/20">
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = trpc.patrimonio.kpis.useQuery();
  const { data: bySetor, isLoading: setorLoading } = trpc.patrimonio.bySetor.useQuery();

  const localizado    = kpis?.byStatus?.find((s) => s.status === "localizado")?.total ?? 0;
  const naoLocalizado = kpis?.byStatus?.find((s) => s.status === "nao_localizado")?.total ?? 0;
  const pctLocalizado = kpis?.total ? Math.round((Number(localizado) / kpis.total) * 100) : 0;

  const setorData = (bySetor ?? [])
    .slice(0, 10)
    .map((s) => ({ name: s.setor ?? "Sem setor", total: s.total }));

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* ── Page Header ── */}
      <div className="detran-gradient rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
            <Layers size={26} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black leading-tight">Dashboard Patrimonial</h1>
            <p className="text-white/70 text-sm mt-0.5 leading-tight">
              Levantamento 2025/2026 — Visão geral do acervo
            </p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      {kpisLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <KPICard
            title="Total de Itens"
            value={kpis?.total?.toLocaleString("pt-BR") ?? "0"}
            subtitle="No levantamento"
            icon={Package}
            gradient="detran-gradient-blue"
          />
          <KPICard
            title="Localizados"
            value={Number(localizado).toLocaleString("pt-BR")}
            subtitle={`${pctLocalizado}% do acervo`}
            icon={CheckCircle2}
            gradient="detran-gradient-green"
          />
          <KPICard
            title="Não Localizados"
            value={Number(naoLocalizado).toLocaleString("pt-BR")}
            subtitle="Aguardando"
            icon={AlertTriangle}
            gradient="detran-gradient-gold"
          />
          <KPICard
            title="Valor Não Local."
            value={formatCurrency(kpis?.valorNaoLocalizado ?? 0)}
            subtitle="Valor declarado"
            icon={BarChart3}
            gradient="detran-gradient-red"
          />
        </div>
      )}

      {/* ── Tipo + Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Distribuição por Tipo */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#1a73c4,#1b8a5a)" }} />
            <h2 className="font-bold text-sm sm:text-base" style={{ color: "#1b4f72" }}>
              Distribuição por Tipo de Bem
            </h2>
          </div>
          {kpisLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {(kpis?.byTipo ?? []).map((item, idx) => {
                const Icon  = TIPO_ICONS[item.tipo ?? "outros"] ?? Package;
                const pct   = kpis?.total ? Math.round((Number(item.total) / kpis.total) * 100) : 0;
                const color = TIPO_COLORS[idx % TIPO_COLORS.length];
                return (
                  <div key={item.tipo} className="flex items-center gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${color}18` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground truncate">
                          {TIPO_LABELS[item.tipo ?? "outros"] ?? item.tipo}
                        </span>
                        <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color }}>
                          {Number(item.total).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-7 text-right flex-shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status de Localização */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#1b8a5a,#d4a017)" }} />
            <h2 className="font-bold text-sm sm:text-base" style={{ color: "#1b4f72" }}>
              Status de Localização
            </h2>
          </div>
          {kpisLoading ? (
            <div className="h-48 rounded-lg bg-slate-100 animate-pulse" />
          ) : (
            <div className="space-y-4">
              {/* Gauge SVG */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#1b8a5a" strokeWidth="12"
                      strokeDasharray={`${pctLocalizado * 2.513} 251.3`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black" style={{ color: "#1b4f72" }}>{pctLocalizado}%</span>
                    <span className="text-xs text-muted-foreground">Localizado</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 text-center" style={{ background: "#f0fdf4" }}>
                  <p className="text-xl font-black" style={{ color: "#1b8a5a" }}>{Number(localizado).toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Localizados</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ background: "#fffbeb" }}>
                  <p className="text-xl font-black" style={{ color: "#d4a017" }}>{Number(naoLocalizado).toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Não Localizados</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Gráfico de barras por setor ── */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#1a73c4,#1b8a5a)" }} />
          <h2 className="font-bold text-sm sm:text-base" style={{ color: "#1b4f72" }}>
            Top 10 Setores por Quantidade de Itens
          </h2>
        </div>
        {setorLoading ? (
          <div className="h-56 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={setorData} margin={{ top: 5, right: 10, left: 0, bottom: 65 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b" }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={35} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {setorData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "#1a73c4" : "#1b8a5a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
