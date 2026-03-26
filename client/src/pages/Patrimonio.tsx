import { trpc } from "@/lib/trpc";
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
  ChevronLeft,
  ChevronRight,
  List,
  MapPin,
  Monitor,
  Package,
  Search,
  SlidersHorizontal,
  Sofa,
  X,
  Zap,
} from "lucide-react";
import { useState, useCallback } from "react";

/* ── Constantes ─────────────────────────────────────────────────────────── */
const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

const TIPO_COLORS: Record<string, { bg: string; text: string }> = {
  informatica:    { bg: "#dbeafe", text: "#1d4ed8" },
  mobiliario:     { bg: "#dcfce7", text: "#15803d" },
  eletrodomestico:{ bg: "#fef9c3", text: "#a16207" },
  veiculo:        { bg: "#ede9fe", text: "#6d28d9" },
  outros:         { bg: "#f1f5f9", text: "#475569" },
};

/* ── Badges ─────────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const ok = status === "localizado";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: ok ? "#dcfce7" : "#fef9c3", color: ok ? "#15803d" : "#a16207" }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ok ? "#16a34a" : "#ca8a04" }} />
      {ok ? "Localizado" : "Não Localizado"}
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string }) {
  const c = TIPO_COLORS[tipo] ?? TIPO_COLORS.outros;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}
    >
      {TIPO_LABELS[tipo] ?? tipo}
    </span>
  );
}

/* ── Card mobile para cada item ─────────────────────────────────────────── */
function ItemCard({ item }: { item: any }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 space-y-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono font-black text-base" style={{ color: "#1a73c4" }}>
          #{item.patrimonio}
        </span>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm font-medium text-foreground leading-snug">
        {item.descricao ?? "—"}
      </p>
      <div className="flex flex-wrap gap-2">
        <TipoBadge tipo={item.tipo ?? "outros"} />
        {item.setor && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} /> {item.setor}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
        <div>
          <span className="font-semibold text-slate-500">Local: </span>
          {item.local ?? "—"}
        </div>
        <div>
          <span className="font-semibold text-slate-500">Data: </span>
          {item.dataIncorporacao
            ? new Date(item.dataIncorporacao).toLocaleDateString("pt-BR")
            : "—"}
        </div>
        <div className="col-span-2">
          <span className="font-semibold text-slate-500">Valor: </span>
          {item.valor
            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.valor))
            : "—"}
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────────────── */
export default function Patrimonio() {
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [setor, setSetor]             = useState<string>("");
  const [status, setStatus]           = useState<string>("");
  const [tipo, setTipo]               = useState<string>("");
  const [page, setPage]               = useState(1);
  const pageSize                      = 50;
  const [showFilters, setShowFilters] = useState(false);

  const { data: setores } = trpc.patrimonio.setores.useQuery();

  const { data, isLoading } = trpc.patrimonio.list.useQuery({
    search:   search   || undefined,
    setor:    setor    || undefined,
    status:   (status  as any) || undefined,
    tipo:     (tipo    as any) || undefined,
    page,
    pageSize,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const hasFilters = !!(search || setor || status || tipo);

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleClearFilters = () => {
    setSearch(""); setSearchInput("");
    setSetor(""); setStatus(""); setTipo("");
    setPage(1);
  };

  /* ── Paginação ── */
  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)           return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  return (
    <div className="p-4 md:p-6 space-y-4">

      {/* ── Header ── */}
      <div className="detran-gradient-blue rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
            <List size={24} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black leading-tight">Levantamento Patrimonial</h1>
            <p className="text-white/70 text-sm mt-0.5 truncate">
              {data ? `${data.total.toLocaleString("pt-BR")} registros encontrados` : "Carregando..."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Busca + Filtros ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4 space-y-3">
        {/* Linha de busca */}
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar patrimônio, descrição, setor..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 text-sm"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="flex-shrink-0 text-white text-sm px-3"
            style={{ background: "#1a73c4" }}
          >
            <Search size={15} className="sm:hidden" />
            <span className="hidden sm:inline">Buscar</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0 gap-1.5 text-sm px-3"
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filtros</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="flex-shrink-0 gap-1 text-slate-500 text-sm px-2"
            >
              <X size={15} />
            </Button>
          )}
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Setor</label>
              <Select value={setor || "_all"} onValueChange={(v) => { setSetor(v === "_all" ? "" : v); setPage(1); }}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Todos os setores" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos os setores</SelectItem>
                  {(setores ?? []).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Status</label>
              <Select value={status || "_all"} onValueChange={(v) => { setStatus(v === "_all" ? "" : v); setPage(1); }}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Todos os status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todos os status</SelectItem>
                  <SelectItem value="localizado">Localizado</SelectItem>
                  <SelectItem value="nao_localizado">Não Localizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Tipo</label>
              <Select value={tipo || "_all"} onValueChange={(v) => { setTipo(v === "_all" ? "" : v); setPage(1); }}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Todos os tipos" /></SelectTrigger>
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

      {/* ── MOBILE: Cards ── */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-slate-100 animate-pulse" />
            ))
          : data?.items.length === 0
          ? (
            <div className="bg-white rounded-xl border border-border p-10 text-center text-muted-foreground">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-medium">Nenhum registro encontrado</p>
              <p className="text-sm">Tente ajustar os filtros</p>
            </div>
          )
          : data?.items.map((item) => <ItemCard key={item.id} item={item} />)
        }
      </div>

      {/* ── DESKTOP: Tabela ── */}
      <div className="hidden md:block bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full detran-table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th className="px-4 py-3 text-left w-28">Patrimônio</th>
                <th className="px-4 py-3 text-left">Descrição</th>
                <th className="px-4 py-3 text-left w-36">Setor</th>
                <th className="px-4 py-3 text-left w-36">Local</th>
                <th className="px-4 py-3 text-left w-24">Data</th>
                <th className="px-4 py-3 text-right w-28">Valor</th>
                <th className="px-4 py-3 text-center w-28">Tipo</th>
                <th className="px-4 py-3 text-center w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(10)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded bg-slate-100 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.items.length === 0
                ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      <Search size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="font-medium">Nenhum registro encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros de busca</p>
                    </td>
                  </tr>
                )
                : data?.items.map((item) => (
                    <tr key={item.id} className="border-t border-border/50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-bold" style={{ color: "#1a73c4" }}>
                          {item.patrimonio}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="text-sm text-foreground line-clamp-2">{item.descricao ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{item.setor ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{item.local ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {item.dataIncorporacao
                            ? new Date(item.dataIncorporacao).toLocaleDateString("pt-BR")
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="text-sm font-medium">
                          {item.valor
                            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.valor))
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
              }
            </tbody>
          </table>
        </div>

        {/* Paginação desktop */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/50 flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} —{" "}
              <span className="font-medium">{data?.total.toLocaleString("pt-BR")} registros</span>
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-8 w-8 p-0">
                <ChevronLeft size={14} />
              </Button>
              {pageNumbers().map((n) => (
                <Button
                  key={n}
                  variant={page === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(n)}
                  className="h-8 w-8 p-0 text-xs"
                  style={page === n ? { background: "#1a73c4" } : {}}
                >
                  {n}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 w-8 p-0">
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Paginação mobile */}
      {totalPages > 1 && (
        <div className="md:hidden flex items-center justify-between bg-white rounded-xl border border-border p-3">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
            <ChevronLeft size={14} /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">
            Próxima <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
