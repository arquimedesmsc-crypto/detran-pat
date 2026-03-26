import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState, useCallback } from "react";

const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

const TIPO_COLORS: Record<string, string> = {
  informatica: "bg-blue-100 text-blue-700",
  mobiliario: "bg-green-100 text-green-700",
  eletrodomestico: "bg-yellow-100 text-yellow-700",
  veiculo: "bg-purple-100 text-purple-700",
  outros: "bg-slate-100 text-slate-600",
};

function StatusBadge({ status }: { status: string }) {
  if (status === "localizado") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Localizado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Não Localizado
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const cls = TIPO_COLORS[tipo] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {TIPO_LABELS[tipo] ?? tipo}
    </span>
  );
}

export default function Patrimonio() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [setor, setSetor] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [showFilters, setShowFilters] = useState(false);

  const { data: setores } = trpc.patrimonio.setores.useQuery();

  const { data, isLoading } = trpc.patrimonio.list.useQuery({
    search: search || undefined,
    setor: setor || undefined,
    status: (status as any) || undefined,
    tipo: (tipo as any) || undefined,
    page,
    pageSize,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setSetor("");
    setStatus("");
    setTipo("");
    setPage(1);
  };

  const hasFilters = search || setor || status || tipo;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="detran-gradient-blue rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
            <List size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Levantamento Patrimonial</h1>
            <p className="text-white/70 text-sm mt-0.5">
              {data ? `${data.total.toLocaleString("pt-BR")} registros encontrados` : "Carregando..."}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por patrimônio, descrição, setor ou local..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} style={{ background: "#1a73c4" }} className="text-white hover:opacity-90">
            Buscar
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </Button>
          {hasFilters && (
            <Button variant="ghost" onClick={handleClearFilters} className="gap-1 text-slate-500">
              <X size={16} />
              Limpar
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
                Setor
              </label>
              <Select value={setor} onValueChange={(v) => { setSetor(v === "_all" ? "" : v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos os setores</SelectItem>
                  {(setores ?? []).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
                Status
              </label>
              <Select value={status} onValueChange={(v) => { setStatus(v === "_all" ? "" : v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos os status</SelectItem>
                  <SelectItem value="localizado">Localizado</SelectItem>
                  <SelectItem value="nao_localizado">Não Localizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
                Tipo de Bem
              </label>
              <Select value={tipo} onValueChange={(v) => { setTipo(v === "_all" ? "" : v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos os tipos</SelectItem>
                  <SelectItem value="informatica">Informática</SelectItem>
                  <SelectItem value="mobiliario">Mobiliário</SelectItem>
                  <SelectItem value="eletrodomestico">Eletrodoméstico</SelectItem>
                  <SelectItem value="veiculo">Veículo</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full detran-table">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Patrimônio</th>
                <th className="px-4 py-3 text-left">Descrição</th>
                <th className="px-4 py-3 text-left">Setor</th>
                <th className="px-4 py-3 text-left">Local</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-slate-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-medium">Nenhum registro encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </td>
                </tr>
              ) : (
                data?.items.map((item) => (
                  <tr key={item.id} className="border-t border-border/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-bold" style={{ color: "#1a73c4" }}>
                        {item.patrimonio}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground line-clamp-2 max-w-xs">
                        {item.descricao ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{item.setor ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{item.local ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {item.dataIncorporacao
                          ? new Date(item.dataIncorporacao).toLocaleDateString("pt-BR")
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium">
                        {item.valor
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(item.valor))
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TipoBadge tipo={item.tipo ?? "outros"} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/50"
          >
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} —{" "}
              <span className="font-medium">{data?.total.toLocaleString("pt-BR")} registros</span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft size={14} />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="h-8 w-8 p-0 text-xs"
                    style={page === pageNum ? { background: "#1a73c4" } : {}}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
