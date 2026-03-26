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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Building2, Calendar, DollarSign, Hash, MapPin, Package, Tag, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TIPOS = [
  { value: "mobiliario", label: "Mobiliário" },
  { value: "informatica", label: "Informática" },
  { value: "eletrodomestico", label: "Eletrodoméstico" },
  { value: "veiculo", label: "Veículo" },
  { value: "outros", label: "Outros" },
];

const STATUS_OPTS = [
  { value: "nao_localizado", label: "Não Localizado" },
  { value: "localizado", label: "Localizado" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
      {children}
    </label>
  );
}

export default function NovoPatrimonioModal({ open, onClose, onSuccess }: Props) {
  const utils = trpc.useUtils();

  const [patrimonio, setPatrimonio] = useState("");
  const [descricao, setDescricao] = useState("");
  const [setor, setSetor] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("outros");
  const [status, setStatus] = useState("nao_localizado");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: setores } = trpc.patrimonio.setores.useQuery();

  const criar = trpc.patrimonio.criar.useMutation({
    onSuccess: () => {
      utils.patrimonio.list.invalidate();
      utils.patrimonio.kpis.invalidate();
      toast.success("Patrimônio registrado com sucesso!", {
        description: `Item #${patrimonio} — ${descricao}`,
      });
      handleReset();
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      toast.error("Erro ao registrar patrimônio", { description: err.message });
    },
  });

  function handleReset() {
    setPatrimonio(""); setDescricao(""); setSetor("");
    setLocal(""); setData(""); setValor("");
    setTipo("outros"); setStatus("nao_localizado");
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!patrimonio || isNaN(Number(patrimonio)) || Number(patrimonio) <= 0)
      e.patrimonio = "Número de patrimônio inválido";
    if (!descricao.trim()) e.descricao = "Descrição obrigatória";
    if (valor && (isNaN(Number(valor)) || Number(valor) < 0))
      e.valor = "Valor inválido";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    criar.mutate({
      patrimonio: Number(patrimonio),
      descricao: descricao.trim(),
      setor: setor || undefined,
      local: local || undefined,
      dataIncorporacao: data || undefined,
      valor: valor ? Number(valor) : undefined,
      tipo: tipo as any,
      status: status as any,
    });
  }

  // Fechar com ESC
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "94vh" }}
      >
        {/* Cabeçalho */}
        <div
          className="flex-shrink-0 px-5 pt-5 pb-4"
          style={{ background: "linear-gradient(135deg, #1b4f72 0%, #1a73c4 60%, #1b8a5a 100%)" }}
        >
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto mb-4" />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 flex-shrink-0">
              <Package size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-white leading-tight">Registrar Novo Patrimônio</h2>
              <p className="text-white/70 text-xs mt-0.5">Preencha os dados do bem patrimonial</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">

            {/* Número do Patrimônio */}
            <div>
              <FieldLabel>Número do Patrimônio *</FieldLabel>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="number"
                  placeholder="Ex: 123456"
                  value={patrimonio}
                  onChange={(e) => { setPatrimonio(e.target.value); setErrors((p) => ({ ...p, patrimonio: "" })); }}
                  className={`pl-8 ${errors.patrimonio ? "border-red-400" : ""}`}
                />
              </div>
              {errors.patrimonio && <p className="text-xs text-red-500 mt-1">{errors.patrimonio}</p>}
            </div>

            {/* Descrição */}
            <div>
              <FieldLabel>Descrição do Bem *</FieldLabel>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                  placeholder="Ex: Mesa de Escritório, Computador Desktop..."
                  value={descricao}
                  onChange={(e) => { setDescricao(e.target.value); setErrors((p) => ({ ...p, descricao: "" })); }}
                  rows={2}
                  className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.descricao ? "border-red-400" : "border-input"}`}
                />
              </div>
              {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao}</p>}
            </div>

            {/* Tipo + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Tipo</FieldLabel>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Setor */}
            <div>
              <FieldLabel>Setor</FieldLabel>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Ex: DTIC, GAB, DFP..."
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  className="pl-8"
                  list="setores-list"
                />
                <datalist id="setores-list">
                  {(setores ?? []).map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>
            </div>

            {/* Local */}
            <div>
              <FieldLabel>Local Físico</FieldLabel>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Ex: Sala 201, Almoxarifado..."
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Data + Valor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Data de Incorporação</FieldLabel>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="pl-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Valor (R$)</FieldLabel>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={valor}
                    onChange={(e) => { setValor(e.target.value); setErrors((p) => ({ ...p, valor: "" })); }}
                    className={`pl-8 text-sm ${errors.valor ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.valor && <p className="text-xs text-red-500 mt-1">{errors.valor}</p>}
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-slate-100 bg-slate-50/80 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={criar.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white font-bold"
              style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
              disabled={criar.isPending}
            >
              {criar.isPending ? "Salvando..." : "Registrar Patrimônio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
