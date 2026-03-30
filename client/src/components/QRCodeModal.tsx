import { useEffect, useRef, useState } from "react";
import { Download, Printer, QrCode, X } from "lucide-react";
import QRCode from "qrcode";

interface PatrimonioItem {
  id: number;
  patrimonio: string | number | null;
  descricao: string | null;
  setor: string | null;
  local: string | null;
  tipo: string | null;
  status: string;
}

interface Props {
  item: PatrimonioItem | null;
  onClose: () => void;
}

const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

const DETRAN_ICON_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

export default function QRCodeModal({ item, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fechar com ESC
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  // Bloquear scroll
  useEffect(() => {
    if (item) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  // Gerar QR Code
  useEffect(() => {
    if (!item) return;
    setLoading(true);

    const qrContent = [
      `DETRAN-RJ — Sistema de Patrimônio`,
      `Nº Patrimônio: ${item.patrimonio}`,
      `Descrição: ${item.descricao ?? "—"}`,
      `Tipo: ${TIPO_LABELS[item.tipo ?? "outros"] ?? item.tipo ?? "—"}`,
      `Setor: ${item.setor ?? "—"}`,
      `Local: ${item.local ?? "—"}`,
      `Status: ${item.status === "localizado" ? "Localizado" : "Não Localizado"}`,
      `ID: ${item.id}`,
    ].join("\n");

    QRCode.toDataURL(qrContent, {
      width: 280,
      margin: 2,
      color: {
        dark: "#1B4F72",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [item]);

  if (!item) return null;

  const isLocal = item.status === "localizado";

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qrcode-patrimonio-${item.patrimonio}.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code — Patrimônio #${item.patrimonio}</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Roboto', sans-serif; background: white; }
            .page { width: 9cm; padding: 1cm; border: 2px solid #1B4F72; border-radius: 12px; margin: 1cm auto; }
            .header { background: linear-gradient(135deg, #1B4F72, #1A73C4, #1B8A5A); padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 16px; }
            .header img { width: 40px; height: 40px; border-radius: 8px; background: white; padding: 4px; }
            .header h1 { color: white; font-size: 14px; font-weight: 900; margin-top: 6px; }
            .header p { color: rgba(255,255,255,0.8); font-size: 10px; margin-top: 2px; }
            .qr-container { text-align: center; margin: 16px 0; }
            .qr-container img { width: 200px; height: 200px; border: 3px solid #1B4F72; border-radius: 8px; padding: 8px; }
            .info { margin-top: 12px; }
            .info-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
            .info-row .label { color: #64748b; font-weight: 600; }
            .info-row .value { color: #1B4F72; font-weight: 700; text-align: right; max-width: 60%; }
            .patrimonio-num { font-size: 18px; font-weight: 900; color: #1A73C4; text-align: center; margin: 8px 0; font-family: monospace; }
            .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; margin: 6px auto; }
            .status-local { background: #dcfce7; color: #15803d; }
            .status-nao { background: #fef9c3; color: #a16207; }
            .footer { text-align: center; margin-top: 12px; font-size: 9px; color: #94a3b8; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <img src="${DETRAN_ICON_URL}" alt="DETRAN" />
              <h1>DETRAN-RJ</h1>
              <p>Sistema de Patrimônio</p>
            </div>
            <div class="patrimonio-num">#${item.patrimonio}</div>
            <div style="text-align:center">
              <span class="status-badge ${isLocal ? "status-local" : "status-nao"}">
                ${isLocal ? "✓ Localizado" : "⚠ Não Localizado"}
              </span>
            </div>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>
            <div class="info">
              <div class="info-row">
                <span class="label">Descrição</span>
                <span class="value">${item.descricao ?? "—"}</span>
              </div>
              <div class="info-row">
                <span class="label">Tipo</span>
                <span class="value">${TIPO_LABELS[item.tipo ?? "outros"] ?? item.tipo ?? "—"}</span>
              </div>
              <div class="info-row">
                <span class="label">Setor</span>
                <span class="value">${item.setor ?? "—"}</span>
              </div>
              <div class="info-row">
                <span class="label">Local</span>
                <span class="value">${item.local ?? "—"}</span>
              </div>
            </div>
            <div class="footer">
              DTIC/DETRAN-RJ · Levantamento Patrimonial 2025/2026<br/>
              Leia o QR Code para identificar este bem
            </div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-sm bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-5 pt-5 pb-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #1b4f72 0%, #1a73c4 60%, #1b8a5a 100%)" }}
        >
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto mb-4 absolute top-3 left-1/2 -translate-x-1/2" />
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
            <QrCode size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-base leading-tight">QR Code</p>
            <p className="text-white/70 text-xs">Patrimônio #{item.patrimonio}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            {loading ? (
              <div className="w-[200px] h-[200px] rounded-xl bg-slate-100 animate-pulse" />
            ) : (
              <div
                className="p-3 rounded-xl border-2"
                style={{ borderColor: "#1B4F72" }}
              >
                <img src={qrDataUrl} alt="QR Code" className="w-[200px] h-[200px]" />
              </div>
            )}

            {/* Badge status */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: isLocal ? "#dcfce7" : "#fef9c3",
                color: isLocal ? "#15803d" : "#a16207",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: isLocal ? "#16a34a" : "#ca8a04" }} />
              {isLocal ? "Localizado" : "Não Localizado"}
            </span>
          </div>

          {/* Informações */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500 font-medium">Nº Patrimônio</span>
              <span className="font-black text-blue-700 font-mono">#{item.patrimonio}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500 font-medium">Tipo</span>
              <span className="font-semibold text-slate-700">{TIPO_LABELS[item.tipo ?? "outros"] ?? item.tipo ?? "—"}</span>
            </div>
            {item.setor && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 font-medium">Setor</span>
                <span className="font-semibold text-slate-700 text-right max-w-[60%]">{item.setor}</span>
              </div>
            )}
            {item.local && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 font-medium">Local</span>
                <span className="font-semibold text-slate-700 text-right max-w-[60%]">{item.local}</span>
              </div>
            )}
          </div>

          {/* Descrição do QR */}
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            O QR Code contém todas as informações de identificação deste bem patrimonial.
            Utilize um leitor de QR Code para acessar os dados.
          </p>
        </div>

        {/* Rodapé com ações */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={loading || !qrDataUrl}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1a73c4, #1b4f72)" }}
          >
            <Download size={15} />
            Baixar PNG
          </button>
          <button
            onClick={handlePrint}
            disabled={loading || !qrDataUrl}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1b8a5a, #0f6b4a)" }}
          >
            <Printer size={15} />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
