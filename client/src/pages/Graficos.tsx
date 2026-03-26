import { trpc } from "@/lib/trpc";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

const PIE_COLORS = ["#1a73c4", "#1b8a5a", "#d4a017", "#dc2626", "#7c3aed"];

const BAR_COLORS = [
  "#1a73c4", "#1b8a5a", "#1b4f72", "#2e9d6a", "#1565a8",
  "#0f6b4a", "#d4a017", "#dc2626", "#7c3aed", "#0891b2",
  "#1a73c4", "#1b8a5a", "#d4a017", "#dc2626", "#7c3aed",
];

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div
        className="w-1 h-7 rounded-full flex-shrink-0"
        style={{ background: "linear-gradient(180deg, #1a73c4, #1b8a5a)" }}
      />
      <div>
        <h2 className="font-bold text-base" style={{ color: "#1b4f72" }}>{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Graficos() {
  const { data: bySetor, isLoading: setorLoading } = trpc.patrimonio.bySetor.useQuery();
  const { data: timeline, isLoading: timelineLoading } = trpc.patrimonio.timeline.useQuery();
  const { data: kpis, isLoading: kpisLoading } = trpc.patrimonio.kpis.useQuery();

  const setorData = (bySetor ?? []).map((s) => ({
    name: s.setor ?? "Sem setor",
    total: s.total,
  }));

  const timelineData = (timeline ?? [])
    .filter((t) => t.mes)
    .map((t) => ({
      mes: t.mes!,
      total: t.total,
      label: (() => {
        const [year, month] = t.mes!.split("-");
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return `${monthNames[parseInt(month) - 1]}/${year?.slice(2)}`;
      })(),
    }));

  const tipoData = (kpis?.byTipo ?? []).map((t, i) => ({
    name: TIPO_LABELS[t.tipo ?? "outros"] ?? t.tipo,
    value: Number(t.total),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="detran-gradient rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
            <BarChart3 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Análise Gráfica</h1>
            <p className="text-white/70 text-sm mt-0.5">
              Visualizações do levantamento patrimonial 2025/2026
            </p>
          </div>
        </div>
      </div>

      {/* Distribuição por Setor (barras horizontais) */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5">
        <SectionHeader
          title="Distribuição por Setor"
          subtitle="Quantidade de itens patrimoniais por setor (Top 15)"
        />
        {setorLoading ? (
          <div className="h-80 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={setorData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#475569" }}
                width={115}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {setorData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Timeline + Pie lado a lado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <SectionHeader
            title="Timeline de Incorporações"
            subtitle="Itens incorporados por mês"
          />
          {timelineLoading ? (
            <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
          ) : timelineData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              Sem dados de data disponíveis
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timelineData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  angle={-45}
                  textAnchor="end"
                  interval={Math.floor(timelineData.length / 8)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1a73c4"
                  strokeWidth={2.5}
                  dot={{ fill: "#1a73c4", r: 3 }}
                  activeDot={{ r: 5, fill: "#1b4f72" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart por tipo */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <SectionHeader
            title="Composição por Tipo de Bem"
            subtitle="Proporção de cada categoria no acervo"
          />
          {kpisLoading ? (
            <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={tipoData}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {tipoData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: "#475569" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Barras verticais por setor (top 10) */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5">
        <SectionHeader
          title="Top 10 Setores — Gráfico de Colunas"
          subtitle="Comparativo visual dos setores com mais itens"
        />
        {setorLoading ? (
          <div className="h-72 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={setorData.slice(0, 10)}
              margin={{ top: 5, right: 20, left: 0, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b" }}
                angle={-40}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [Number(v).toLocaleString("pt-BR"), "Itens"]}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {setorData.slice(0, 10).map((_, i) => (
                  <Cell
                    key={i}
                    fill={i % 2 === 0 ? "#1a73c4" : "#1b8a5a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
