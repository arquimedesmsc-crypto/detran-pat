import { useState, useMemo } from "react";
import PatrimonioLayout from "@/components/PatrimonioLayout";
import { trpc } from "@/lib/trpc";
import { useAppAuth } from "@/contexts/AppAuthContext";
import {
  Download,
  FileText,
  Filter,
  RefreshCw,
  Table2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

type ExportFormat = "csv" | "xlsx" | "pdf";

export default function Relatorios() {
  const { user } = useAppAuth();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("xlsx");
  const [isExporting, setIsExporting] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    setor: "",
    status: "" as "" | "localizado" | "nao_localizado",
    tipo: "" as "" | "informatica" | "mobiliario" | "eletrodomestico" | "veiculo" | "outros",
  });

  // Carregar dados com filtros aplicados
  const { data: patrimonioData, isLoading: patrimonioLoading } = trpc.patrimonio.list.useQuery(
    {
      setor: filters.setor || undefined,
      status: filters.status || undefined,
      tipo: filters.tipo || undefined,
      page: 1,
      pageSize: 10000, // Carregar todos para exportação
    },
    { enabled: !!user }
  );

  const { data: setores } = trpc.patrimonio.setores.useQuery(undefined, { enabled: !!user });
  const { data: locais } = trpc.patrimonio.locais.useQuery(undefined, { enabled: !!user });

  // Dados processados para preview
  const previewData = useMemo(() => {
    if (!patrimonioData?.items) return [];
    return patrimonioData.items.slice(0, 10); // Mostrar apenas 10 primeiros no preview
  }, [patrimonioData]);

  const totalItems = patrimonioData?.total ?? 0;

  // Função para exportar
  const handleExport = async () => {
    if (!patrimonioData?.items || patrimonioData.items.length === 0) {
      toast.error("Nenhum dado para exportar com os filtros aplicados.");
      return;
    }

    setIsExporting(true);
    try {
      const filename = `relatorio-patrimonio-${new Date().toISOString().split("T")[0]}.${exportFormat === "xlsx" ? "xlsx" : exportFormat === "pdf" ? "pdf" : "csv"}`;

      // Preparar dados para exportação
      const data = {
        items: patrimonioData.items,
        filters: filters,
        format: exportFormat,
      };

      // Fazer requisição para o backend
      const response = await fetch("/api/trpc/patrimonio.export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao exportar relatório");
      }

      // Download do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Relatório exportado em ${exportFormat.toUpperCase()} com sucesso!`);
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast.error("Erro ao exportar relatório. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const statusLabels = {
    "": "Todos",
    localizado: "Localizados",
    nao_localizado: "Não Localizados",
  };

  const tipoLabels = {
    "": "Todos",
    informatica: "Informática",
    mobiliario: "Mobiliário",
    eletrodomestico: "Eletrodoméstico",
    veiculo: "Veículo",
    outros: "Outros",
  };

  return (
    <PatrimonioLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-6xl mx-auto">

        {/* Header */}
        <div
          className="rounded-xl p-5 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #1b4f72 0%, #1a73c4 55%, #7c3aed 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
              <FileText size={24} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black leading-tight">Relatórios e Exportação</h1>
              <p className="text-white/70 text-sm mt-0.5">Exporte dados de patrimônio em CSV, XLSX ou PDF</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Painel de Filtros e Exportação */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4 sticky top-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter size={18} className="text-blue-600" />
                <h2 className="font-black text-slate-800">Filtros</h2>
              </div>

              {/* Filtro Setor */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Setor</label>
                <select
                  value={filters.setor}
                  onChange={(e) => setFilters({ ...filters, setor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                >
                  <option value="">Todos os setores</option>
                  {(setores ?? []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Status */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                >
                  <option value="">Todos</option>
                  <option value="localizado">Localizados</option>
                  <option value="nao_localizado">Não Localizados</option>
                </select>
              </div>

              {/* Filtro Tipo */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Tipo de Bem</label>
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters({ ...filters, tipo: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                >
                  <option value="">Todos</option>
                  <option value="informatica">Informática</option>
                  <option value="mobiliario">Mobiliário</option>
                  <option value="eletrodomestico">Eletrodoméstico</option>
                  <option value="veiculo">Veículo</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="text-sm text-slate-600 mb-3">
                  <span className="font-bold text-slate-800">{totalItems}</span> item(ns) para exportar
                </div>

                {/* Seletor de Formato */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Formato</label>
                  <div className="space-y-1.5">
                    {(["xlsx", "csv", "pdf"] as const).map((fmt) => (
                      <label key={fmt} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <input
                          type="radio"
                          name="format"
                          value={fmt}
                          checked={exportFormat === fmt}
                          onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-slate-700 uppercase">{fmt}</span>
                        <span className="text-xs text-slate-400 ml-auto">
                          {fmt === "xlsx" && "Planilha"}
                          {fmt === "csv" && "Texto"}
                          {fmt === "pdf" && "Documento"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Botão Exportar */}
                <button
                  onClick={handleExport}
                  disabled={isExporting || totalItems === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
                >
                  {isExporting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Exportar {exportFormat.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview dos Dados */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Table2 size={18} className="text-blue-600" />
                  <div>
                    <h3 className="font-black text-slate-800">Preview dos Dados</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mostrando {previewData.length} de {totalItems} registros
                    </p>
                  </div>
                </div>
              </div>

              {patrimonioLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block">
                    <RefreshCw size={24} className="text-slate-400 animate-spin mb-2" />
                  </div>
                  <p className="text-sm text-slate-500">Carregando dados...</p>
                </div>
              ) : previewData.length === 0 ? (
                <div className="p-8 text-center">
                  <TrendingUp size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Nenhum dado encontrado com os filtros aplicados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "linear-gradient(90deg, #1b4f72, #1a73c4)" }}>
                        <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Patrimônio</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Descrição</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Setor</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Tipo</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((item, idx) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                          style={{ background: idx % 2 === 0 ? "white" : "#f8fafc" }}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-slate-600 font-bold">{item.patrimonio}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 max-w-xs truncate">{item.descricao}</td>
                          <td className="px-4 py-3 text-xs text-slate-600">{item.setor}</td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                background: item.status === "localizado" ? "#dcfce7" : "#fecaca",
                                color: item.status === "localizado" ? "#15803d" : "#991b1b",
                              }}
                            >
                              {item.status === "localizado" ? "Localizado" : "Não Localizado"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 capitalize">{item.tipo}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 font-mono text-right">
                            {item.valor ? `R$ ${Number(item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </PatrimonioLayout>
  );
}
