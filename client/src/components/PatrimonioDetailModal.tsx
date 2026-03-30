import {
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Hash,
  Info,
  MapPin,
  QrCode,
  Monitor,
  Package,
  Sofa,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import QRCodeModal from "./QRCodeModal";

/* ── Tipos ─────────────────────────────────────────────────────────────── */
export interface PatrimonioItem {
  id: number;
  patrimonio: string | number | null;
  descricao: string | null;
  setor: string | null;
  local: string | null;
  dataIncorporacao: Date | string | null;
  valor: string | number | null;
  status: string;
  tipo: string | null;
}

interface Props {
  item: PatrimonioItem | null;
  onClose: () => void;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
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

const TIPO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  informatica:     { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  mobiliario:      { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  eletrodomestico: { bg: "#fefce8", text: "#a16207", border: "#fde68a" },
  veiculo:         { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  outros:          { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

function formatCurrency(value: string | number | null) {
  const n = Number(value ?? 0);
  if (!n) return "Não informado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function formatDate(d: Date | string | null) {
  if (!d) return "Não informado";
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

/* ── Row de informação ──────────────────────────────────────────────────── */
function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg mt-0.5"
        style={{ background: color ? `${color}18` : "#f1f5f9" }}
      >
        <Icon size={15} style={{ color: color ?? "#64748b" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 leading-tight">{label}</p>
        <p
          className={`text-sm mt-0.5 leading-snug break-words ${highlight ? "font-bold text-base" : "font-medium text-slate-700"}`}
          style={highlight && color ? { color } : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Modal principal ────────────────────────────────────────────────────── */
export default function PatrimonioDetailModal({ item, onClose }: Props) {
  // Fechar com ESC
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  // Bloquear scroll do body
  useEffect(() => {
    if (item) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  const [qrOpen, setQrOpen] = useState(false);

  if (!item) return null;

  const tipo     = item.tipo ?? "outros";
  const tipoC    = TIPO_COLORS[tipo] ?? TIPO_COLORS.outros;
  const TipoIcon = TIPO_ICONS[tipo] ?? Package;
  const isLocal  = item.status === "localizado";
  const hasValor = Number(item.valor ?? 0) > 0;

  return (
    /* Overlay */
    <>
    {qrOpen && <QRCodeModal item={item} onClose={() => setQrOpen(false)} />}
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Painel */}
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* ── Cabeçalho colorido ── */}
        <div
          className="flex-shrink-0 px-5 pt-5 pb-4"
          style={{
            background: `linear-gradient(135deg, #1b4f72 0%, #1a73c4 60%, #1b8a5a 100%)`,
          }}
        >
          {/* Drag handle mobile */}
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto mb-4" />

          <div className="flex items-start gap-3">
            {/* Ícone tipo */}
            <div
              className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
              style={{ background: tipoC.bg, border: `2px solid ${tipoC.border}` }}
            >
              <TipoIcon size={22} style={{ color: tipoC.text }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-black text-lg text-white leading-tight">
                  #{item.patrimonio}
                </span>
                {/* Badge tipo */}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: tipoC.bg, color: tipoC.text }}
                >
                  {TIPO_LABELS[tipo] ?? tipo}
                </span>
              </div>
              <p className="text-white/90 text-sm font-medium mt-1 leading-snug line-clamp-2">
                {item.descricao ?? "Sem descrição"}
              </p>
            </div>

            {/* Botão fechar */}
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Badge status */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: isLocal ? "#dcfce7" : "#fef9c3",
                color: isLocal ? "#15803d" : "#a16207",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: isLocal ? "#16a34a" : "#ca8a04" }}
              />
              {isLocal ? "Localizado" : "Não Localizado"}
            </span>
            {hasValor && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                <DollarSign size={11} />
                {formatCurrency(item.valor)}
              </span>
            )}
          </div>
        </div>

        {/* ── Corpo com informações ── */}
        <div className="flex-1 overflow-y-auto px-5 py-2">

          {/* Seção: Identificação */}
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-3 mb-1">
            Identificação
          </p>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 divide-y divide-slate-100">
            <InfoRow
              icon={Hash}
              label="Número do Patrimônio"
              value={String(item.patrimonio ?? "—")}
              highlight
              color="#1a73c4"
            />
            <InfoRow
              icon={Tag}
              label="Descrição do Bem"
              value={item.descricao ?? "Não informado"}
            />
            <InfoRow
              icon={TipoIcon}
              label="Categoria / Tipo"
              value={TIPO_LABELS[tipo] ?? tipo}
              color={tipoC.text}
            />
          </div>

          {/* Seção: Localização */}
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-4 mb-1">
            Localização
          </p>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 divide-y divide-slate-100">
            <InfoRow
              icon={Building2}
              label="Setor Responsável"
              value={item.setor ?? "Não informado"}
              color="#1b4f72"
            />
            <InfoRow
              icon={MapPin}
              label="Local Físico"
              value={item.local ?? "Não informado"}
              color="#1b8a5a"
            />
            <InfoRow
              icon={CheckCircle2}
              label="Status de Localização"
              value={isLocal ? "Localizado no levantamento" : "Não localizado — aguardando verificação"}
              color={isLocal ? "#15803d" : "#a16207"}
            />
          </div>

          {/* Seção: Financeiro */}
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-4 mb-1">
            Dados Financeiros
          </p>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 divide-y divide-slate-100">
            <InfoRow
              icon={DollarSign}
              label="Valor Declarado"
              value={formatCurrency(item.valor)}
              highlight={hasValor}
              color={hasValor ? "#1b8a5a" : undefined}
            />
            <InfoRow
              icon={Calendar}
              label="Data de Incorporação"
              value={formatDate(item.dataIncorporacao)}
              color="#1a73c4"
            />
          </div>

          {/* Nota informativa */}
          <div
            className="flex items-start gap-2 mt-4 mb-4 p-3 rounded-xl text-xs"
            style={{ background: "#eff6ff", color: "#1d4ed8" }}
          >
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Dados provenientes do levantamento patrimonial 2025/2026 — DTIC/DETRAN-RJ.
              {!isLocal && " Este bem não foi localizado durante o levantamento e requer verificação."}
            </p>
          </div>
        </div>

        {/* ── Rodapé ── */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex gap-2">
          <button
            onClick={() => setQrOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1b4f72, #1a73c4)" }}
            title="Gerar QR Code"
          >
            <QrCode size={15} />
            QR Code
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
