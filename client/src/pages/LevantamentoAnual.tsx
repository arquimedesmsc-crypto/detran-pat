import { useState, useRef, useCallback } from "react";
import PatrimonioLayout from "@/components/PatrimonioLayout";
import { trpc } from "@/lib/trpc";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { toast } from "sonner";
import {
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  X,
  Upload,
  Eye,
  AlertTriangle,
} from "lucide-react";

const ANO_ATUAL = new Date().getFullYear();

const STATUS_CONFIG = {
  localizado: { label: "Localizado", color: "#1B8A5A", bg: "#f0fdf4", icon: CheckCircle2 },
  nao_localizado: { label: "Não Localizado", color: "#b45309", bg: "#fffbeb", icon: XCircle },
  em_verificacao: { label: "Em Verificação", color: "#1A73C4", bg: "#eff6ff", icon: Clock },
};

const TIPO_OPTIONS = [
  { value: "informatica", label: "Informática" },
  { value: "mobiliario", label: "Mobiliário" },
  { value: "eletrodomestico", label: "Eletrodoméstico" },
  { value: "veiculo", label: "Veículo" },
  { value: "outros", label: "Outros" },
];

// Comprime imagem para max 800px e qualidade 0.75
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface NovoItemForm {
  patrimonio: string;
  descricao: string;
  setor: string;
  local: string;
  status: "localizado" | "nao_localizado" | "em_verificacao";
  tipo: string;
  observacao: string;
  responsavel: string;
  fotos: string[]; // base64
}

const FORM_INICIAL: NovoItemForm = {
  patrimonio: "", descricao: "", setor: "", local: "",
  status: "em_verificacao", tipo: "outros", observacao: "", responsavel: "", fotos: [],
};

export default function LevantamentoAnual() {
  const { user } = useAppAuth();
  const [ano, setAno] = useState(ANO_ATUAL);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NovoItemForm>(FORM_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: items = [], isLoading } = trpc.levantamento.list.useQuery({ ano });
  const { data: anos = [] } = trpc.levantamento.anos.useQuery();

  const criarMutation = trpc.levantamento.criar.useMutation();
  const uploadFotoMutation = trpc.levantamento.uploadFoto.useMutation();
  const atualizarStatusMutation = trpc.levantamento.atualizarStatus.useMutation();
  const deletarMutation = trpc.levantamento.deletar.useMutation();

  const handleAddFoto = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo: 10MB");
      return;
    }
    const compressed = await compressImage(file);
    setForm((f) => ({ ...f, fotos: [...f.fotos, compressed] }));
    toast.success("Foto adicionada!");
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAddFoto(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patrimonio || !form.descricao) {
      toast.error("Preencha número do patrimônio e descrição.");
      return;
    }
    setSubmitting(true);
    try {
      const item = await criarMutation.mutateAsync({
        ano,
        patrimonio: Number(form.patrimonio),
        descricao: form.descricao,
        setor: form.setor || undefined,
        local: form.local || undefined,
        status: form.status,
        tipo: form.tipo as any,
        observacao: form.observacao || undefined,
        responsavel: form.responsavel || user?.displayName || undefined,
        createdBy: user?.id,
      });

      if (item && form.fotos.length > 0) {
        for (const base64 of form.fotos) {
          await uploadFotoMutation.mutateAsync({
            levantamentoId: item.id,
            base64,
            mimeType: "image/jpeg",
          });
        }
      }

      toast.success("Item registrado com sucesso!");
      setForm(FORM_INICIAL);
      setShowForm(false);
      utils.levantamento.list.invalidate();
      utils.levantamento.anos.invalidate();
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao salvar item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAtualizarStatus = async (id: number, status: "localizado" | "nao_localizado" | "em_verificacao") => {
    try {
      await atualizarStatusMutation.mutateAsync({ id, status });
      toast.success("Status atualizado!");
      utils.levantamento.list.invalidate();
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDeletar = async (id: number) => {
    try {
      await deletarMutation.mutateAsync({ id });
      toast.success("Item removido.");
      setConfirmDelete(null);
      utils.levantamento.list.invalidate();
    } catch {
      toast.error("Erro ao remover item.");
    }
  };

  const anosDisponiveis = [ANO_ATUAL, ...anos.filter((a) => a !== ANO_ATUAL)];

  return (
    <PatrimonioLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="rounded-2xl p-5 mb-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1B4F72 0%, #1A73C4 60%, #1B8A5A 100%)" }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h1 className="text-xl md:text-2xl font-black">Levantamento Anual</h1>
              <p className="text-white/70 text-sm mt-0.5">Registro de bens patrimoniais com foto</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>
          </div>

          {/* Seletor de ano */}
          <div className="flex gap-2 mt-4 flex-wrap relative z-10">
            {anosDisponiveis.map((a) => (
              <button
                key={a}
                onClick={() => setAno(a)}
                className="px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: ano === a ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
                  color: ano === a ? "#1B4F72" : "rgba(255,255,255,0.8)",
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Modal de novo item */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header modal */}
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b">
                <h2 className="font-black text-lg" style={{ color: "#1B4F72" }}>Novo Registro</h2>
                <button onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Patrimônio e tipo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Nº Patrimônio *</label>
                    <input type="number" value={form.patrimonio}
                      onChange={(e) => setForm((f) => ({ ...f, patrimonio: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                      onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      placeholder="123456" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Tipo</label>
                    <select value={form.tipo}
                      onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none"
                      style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
                      {TIPO_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Descrição *</label>
                  <input type="text" value={form.descricao}
                    onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                    style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    placeholder="Ex: Cadeira ergonômica preta" />
                </div>

                {/* Setor e local */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Setor</label>
                    <input type="text" value={form.setor}
                      onChange={(e) => setForm((f) => ({ ...f, setor: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                      onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      placeholder="Ex: 3 GAB" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Local</label>
                    <input type="text" value={form.local}
                      onChange={(e) => setForm((f) => ({ ...f, local: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                      onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      placeholder="Ex: Sala 201" />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "#1B4F72" }}>Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
                      <button key={key} type="button"
                        onClick={() => setForm((f) => ({ ...f, status: key as any }))}
                        className="py-2 px-2 rounded-xl text-xs font-bold transition-all border-2"
                        style={{
                          borderColor: form.status === key ? cfg.color : "#e2e8f0",
                          background: form.status === key ? cfg.bg : "#f8fafc",
                          color: form.status === key ? cfg.color : "#64748b",
                        }}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Responsável</label>
                  <input type="text" value={form.responsavel}
                    onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                    style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    placeholder={user?.displayName ?? "Nome do responsável"} />
                </div>

                {/* Observação */}
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: "#1B4F72" }}>Observação</label>
                  <textarea value={form.observacao}
                    onChange={(e) => setForm((f) => ({ ...f, observacao: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none transition-all resize-none"
                    style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    placeholder="Notas adicionais sobre o bem..." />
                </div>

                {/* Upload de fotos */}
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "#1B4F72" }}>
                    Fotos ({form.fotos.length})
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-all hover:border-blue-400 hover:bg-blue-50"
                      style={{ borderColor: "#1A73C4", color: "#1A73C4" }}>
                      <Camera className="w-4 h-4" />
                      Câmera
                    </button>
                    <button type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-all hover:border-green-400 hover:bg-green-50"
                      style={{ borderColor: "#1B8A5A", color: "#1B8A5A" }}>
                      <ImageIcon className="w-4 h-4" />
                      Galeria
                    </button>
                  </div>

                  {/* Inputs ocultos */}
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
                    className="hidden" onChange={handleFileChange} />
                  <input ref={fileInputRef} type="file" accept="image/*"
                    className="hidden" onChange={handleFileChange} />

                  {/* Preview das fotos */}
                  {form.fotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {form.fotos.map((foto, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                          <img src={foto} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button type="button" onClick={() => setFotoPreview(foto)}
                              className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <Eye className="w-3.5 h-3.5 text-gray-700" />
                            </button>
                            <button type="button"
                              onClick={() => setForm((f) => ({ ...f, fotos: f.fotos.filter((_, idx) => idx !== i) }))}
                              className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all"
                    style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1A73C4 0%, #1B8A5A 100%)" }}>
                    {submitting ? (
                      <><Upload className="w-4 h-4 animate-bounce" /> Salvando...</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Salvar Registro</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview de foto */}
        {fotoPreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.9)" }}
            onClick={() => setFotoPreview(null)}>
            <img src={fotoPreview} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              onClick={() => setFotoPreview(null)}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Confirmação de exclusão */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Confirmar exclusão</h3>
                  <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border-2 text-sm font-bold"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  Cancelar
                </button>
                <button onClick={() => handleDeletar(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold bg-red-500 hover:bg-red-600 transition-colors">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de itens */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Carregando levantamento...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">Nenhum registro em {ano}</h3>
            <p className="text-sm text-gray-400 mb-4">Comece adicionando o primeiro item do levantamento.</p>
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #1A73C4 0%, #1B8A5A 100%)" }}>
              + Novo Registro
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">{items.length} registro{items.length !== 1 ? "s" : ""} em {ano}</p>
            {items.map((item) => {
              const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.em_verificacao;
              const Icon = cfg.icon;
              return (
                <div key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                  style={{ borderLeft: `4px solid ${cfg.color}` }}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                            style={{ background: "#eff6ff", color: "#1A73C4" }}>
                            #{item.patrimonio}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm truncate">{item.descricao}</p>
                        {(item.setor || item.local) && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {[item.setor, item.local].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        {item.responsavel && (
                          <p className="text-xs text-gray-400 mt-0.5">Resp: {item.responsavel}</p>
                        )}
                        {item.observacao && (
                          <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">{item.observacao}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <select
                          value={item.status}
                          onChange={(e) => handleAtualizarStatus(item.id, e.target.value as any)}
                          className="text-xs px-2 py-1.5 rounded-lg border font-semibold outline-none cursor-pointer"
                          style={{ borderColor: cfg.color, color: cfg.color, background: cfg.bg }}>
                          <option value="localizado">Localizado</option>
                          <option value="nao_localizado">Não Localizado</option>
                          <option value="em_verificacao">Em Verificação</option>
                        </select>
                        <button onClick={() => setConfirmDelete(item.id)}
                          className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border font-semibold transition-colors hover:bg-red-50"
                          style={{ borderColor: "#fca5a5", color: "#ef4444" }}>
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PatrimonioLayout>
  );
}
