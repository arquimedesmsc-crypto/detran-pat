import { trpc } from "@/lib/trpc";
import {
  Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart,
  PieChart, Pie, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

const PIE_COLORS  = ["#1a73c4", "#1b8a5a", "#d4a017", "#dc2626", "#7c3aed"];
const BAR_COLORS  = [
  "#1a73c4","#1b8a5a","#1b4f72","#2e9d6a","#1565a8",
  "#0f6b4a","#d4a017","#dc2626","#7c3aed","#0891b2",
  "#1a73c4","#1b8a5a","#d4a017","#dc2626","#7c3aed",
];

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg,#1a73c4,#1b8a5a)" }} />
      <div className="min-w-0">
        <h2 className="font-bold text-sm sm:text-base leading-tight" style={{ color: "#1b4f72" }}>{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Graficos() {
  const { data: bySetor,  isLoading: setorLoading }    = trpc.patrimonio.bySetor.useQuery();
  const { data: timeline, isLoading: timelineLoading } = trpc.patrimonio.timeline.useQuery();
  const { data: kpis,     isLoading: kpisLoading }     = trpc.patrimonio.kpis.useQuery();

  const setorData = (bySetor ?? []).map((s) => ({ name: s.setor ?? "Sem setor", total: s.total }));

  const timelineData = (timeline ?? [])
    .filter((t) => t.mes)
    .map((t) => {
      const [year, month] = t.mes!.split("-");
      const names = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      return { mes: t.mes!, total: t.total, label: `${names[parseInt(month)-1]}/${year?.slice(2)}` };
    });

  const tipoData = (kpis?.byTipo ?? []).map((t, i) => ({
    name:  TIPO_LABELS[t.tipo ?? "outros"] ?? t.tipo,
    value: Number(t.total),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* Header */}
      <div className="detran-gradient rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black leading-tight">Análise Gráfica</h1>
            <p className="text-white/70 text-sm mt-0.5">Levantamento patrimonial 2025/2026</p>
          </div>
        </div>
      </div>

      {/* Barras horizontais por setor */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5">
        <SectionHeader title="Distribuição por Setor" subtitle="Top 15 setores com mais itens" />
        {setorLoading ? (
          <div className="h-72 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={setorData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 110, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#475569" }} width={105} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {setorData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Timeline + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <SectionHeader title="Timeline de Incorporações" subtitle="Itens incorporados por mês" />
          {timelineLoading ? (
            <div className="h-56 rounded-lg bg-slate-100 animate-pulse" />
          ) : timelineData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
              Sem dados de data disponíveis
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timelineData} margin={{ top: 5, right: 10, left: 0, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: "#64748b" }}
                  angle={-45}
                  textAnchor="end"
                  interval={Math.max(0, Math.floor(timelineData.length / 7) - 1)}
                />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
                />
                <Line
                  type="monotone" dataKey="total"
                  stroke="#1a73c4" strokeWidth={2.5}
                  dot={{ fill: "#1a73c4", r: 3 }}
                  activeDot={{ r: 5, fill: "#1b4f72" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie por tipo */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <SectionHeader title="Composição por Tipo de Bem" subtitle="Proporção de cada categoria" />
          {kpisLoading ? (
            <div className="h-56 rounded-lg bg-slate-100 animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={tipoData} cx="50%" cy="42%"
                  outerRadius={80} innerRadius={45}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {tipoData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
                />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 11, color: "#475569" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Colunas verticais top 10 */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5">
        <SectionHeader title="Top 10 Setores — Colunas" subtitle="Comparativo visual dos maiores setores" />
        {setorLoading ? (
          <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={setorData.slice(0, 10)} margin={{ top: 5, right: 10, left: 0, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#64748b" }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={30} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {setorData.slice(0, 10).map((_, i) => (
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
