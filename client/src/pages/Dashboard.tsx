import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  DollarSign,
  Info,
  Layers,
  Monitor,
  Package,
  Sofa,
  TrendingUp,
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

/* ── Helpers ─────────────────────────────────────────────────────────────── */
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

/* ── KPI Card ────────────────────────────────────────────────────────────── */
function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  note,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  gradient: string;
  note?: string;
}) {
  return (
    <div className={`kpi-card rounded-xl p-4 text-white shadow-lg ${gradient} flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1 leading-tight">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-black leading-tight break-all">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/60 mt-1 leading-tight">{subtitle}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white/20">
          <Icon size={22} className="text-white" />
        </div>
      </div>
      {note && (
        <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-white/20">
          <Info size={11} className="flex-shrink-0 text-white/60" />
          <p className="text-xs text-white/60 leading-snug">{note}</p>
        </div>
      )}
    </div>
  );
}

/* ── Seção header ────────────────────────────────────────────────────────── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div
        className="w-1 h-6 rounded-full flex-shrink-0 mt-0.5"
        style={{ background: "linear-gradient(180deg,#1a73c4,#1b8a5a)" }}
      />
      <div>
        <h2 className="font-bold text-sm sm:text-base" style={{ color: "#1b4f72" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = trpc.patrimonio.kpis.useQuery();
  const { data: bySetor, isLoading: setorLoading } = trpc.patrimonio.bySetor.useQuery();

  const localizado = Number(kpis?.byStatus?.find((s) => s.status === "localizado")?.total ?? 0);
  const naoLocalizado = Number(
    kpis?.byStatus?.find((s) => s.status === "nao_localizado")?.total ?? 0
  );
  const pctLocalizado = kpis?.total ? Math.round((localizado / kpis.total) * 100) : 0;

  const setorData = (bySetor ?? []).slice(0, 10).map((s) => ({
    name: s.setor ?? "Sem setor",
    total: s.total,
  }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── Page Header ── */}
      <div className="detran-gradient rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
            <Layers size={26} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black leading-tight">
              Dashboard Patrimonial
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              Levantamento 2025/2026 — Visão geral do acervo
            </p>
          </div>
        </div>
      </div>

      {/* ── SEÇÃO 1: Contagens ── */}
      <div>
        <SectionHeader
          title="Quantitativo do Acervo"
          subtitle="Total de bens registrados no levantamento patrimonial"
        />
        {kpisLoading ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <KPICard
              title="Total de Itens"
              value={(kpis?.total ?? 0).toLocaleString("pt-BR")}
              subtitle="No levantamento"
              icon={Package}
              gradient="detran-gradient-blue"
            />
            <KPICard
              title="Localizados"
              value={localizado.toLocaleString("pt-BR")}
              subtitle={`${pctLocalizado}% do acervo`}
              icon={CheckCircle2}
              gradient="detran-gradient-green"
            />
            <div className="col-span-2 xl:col-span-1">
              <KPICard
                title="Não Localizados"
                value={naoLocalizado.toLocaleString("pt-BR")}
                subtitle={`${100 - pctLocalizado}% do acervo`}
                icon={AlertTriangle}
                gradient="detran-gradient-gold"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── SEÇÃO 2: Valores ── */}
      <div>
        <SectionHeader
          title="Valores Declarados"
          subtitle="Referência: apenas bens não localizados possuem valor declarado na planilha fonte"
        />
        {kpisLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Aviso contextual */}
            <div
              className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm"
              style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
            >
              <Info size={16} className="flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                A planilha de levantamento registra valor somente para bens{" "}
                <strong>não localizados</strong>. Os{" "}
                <strong>{localizado.toLocaleString("pt-BR")} bens localizados</strong> não possuem
                valor declarado na fonte de dados original.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KPICard
                title="Valor Total Declarado"
                value={formatCurrency(kpis?.valorTotal ?? 0)}
                subtitle="Soma dos valores na planilha"
                icon={TrendingUp}
                gradient="detran-gradient-blue"
                note="Corresponde ao total dos bens não localizados"
              />
              <KPICard
                title="Valor Não Localizado"
                value={formatCurrency(kpis?.valorNaoLocalizado ?? 0)}
                subtitle={`${naoLocalizado.toLocaleString("pt-BR")} bens sem localização`}
                icon={BarChart3}
                gradient="detran-gradient-red"
                note="Bens que precisam de verificação física"
              />
            </div>

            {/* Card de resumo financeiro */}
            <div className="mt-4 rounded-xl border border-border bg-white shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={16} style={{ color: "#1b4f72" }} />
                <span className="font-bold text-sm" style={{ color: "#1b4f72" }}>
                  Resumo Financeiro
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-slate-500">Valor total declarado</span>
                  <span className="font-bold text-sm" style={{ color: "#1b4f72" }}>
                    {formatCurrency(kpis?.valorTotal ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm text-slate-500">Bens não localizados</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: "#d4a017" }}>
                    {formatCurrency(kpis?.valorNaoLocalizado ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-500">
                      Bens localizados (sem valor declarado)
                    </span>
                  </div>
                  <span className="text-sm text-slate-400 italic">—</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── SEÇÃO 3: Tipo + Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Distribuição por Tipo */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <SectionHeader title="Distribuição por Tipo de Bem" />
          {kpisLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(kpis?.byTipo ?? []).map((item, idx) => {
                const Icon = TIPO_ICONS[item.tipo ?? "outros"] ?? Package;
                const pct = kpis?.total
                  ? Math.round((Number(item.total) / kpis.total) * 100)
                  : 0;
                const color = TIPO_COLORS[idx % TIPO_COLORS.length];
                return (
                  <div key={item.tipo} className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ background: `${color}18` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground truncate">
                          {TIPO_LABELS[item.tipo ?? "outros"] ?? item.tipo}
                        </span>
                        <span
                          className="text-sm font-bold ml-2 flex-shrink-0"
                          style={{ color }}
                        >
                          {Number(item.total).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-7 text-right flex-shrink-0">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status de Localização */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <SectionHeader title="Status de Localização" />
          {kpisLoading ? (
            <div className="h-52 rounded-lg bg-slate-100 animate-pulse" />
          ) : (
            <div className="space-y-4">
              {/* Gauge SVG */}
              <div className="flex items-center justify-center py-1">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1b8a5a"
                      strokeWidth="12"
                      strokeDasharray={`${pctLocalizado * 2.513} 251.3`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black" style={{ color: "#1b4f72" }}>
                      {pctLocalizado}%
                    </span>
                    <span className="text-xs text-muted-foreground">Localizado</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 text-center" style={{ background: "#f0fdf4" }}>
                  <p className="text-xl font-black" style={{ color: "#1b8a5a" }}>
                    {localizado.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Localizados</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ background: "#fffbeb" }}>
                  <p className="text-xl font-black" style={{ color: "#d4a017" }}>
                    {naoLocalizado.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Não Localizados</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SEÇÃO 4: Gráfico por Setor ── */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <SectionHeader
          title="Top 10 Setores por Quantidade de Itens"
          subtitle="Distribuição dos bens patrimoniais por setor responsável"
        />
        {setorLoading ? (
          <div className="h-56 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={setorData}
              margin={{ top: 5, right: 10, left: 0, bottom: 65 }}
            >
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
