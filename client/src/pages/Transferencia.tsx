import { useState } from "react";
import PatrimonioLayout from "@/components/PatrimonioLayout";
import { trpc } from "@/lib/trpc";
import { useAppAuth } from "@/contexts/AppAuthContext";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  Hash,
  Plus,
  Printer,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

const DETRAN_ICON_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

interface ItemTransferencia {
  patrimonio: number;
  descricao: string;
  tipo: string;
  setor: string;
}

const TIPO_LABELS: Record<string, string> = {
  informatica: "Informática",
  mobiliario: "Mobiliário",
  eletrodomestico: "Eletrodoméstico",
  veiculo: "Veículo",
  outros: "Outros",
};

function gerarProtocolo(): string {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, "0");
  const dia = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `TRANSF-${ano}${mes}${dia}-${seq}`;
}

export default function Transferencia() {
  const { user } = useAppAuth();
  const [setorOrigem, setSetorOrigem] = useState("");
  const [localOrigem, setLocalOrigem] = useState("");
  const [setorDestino, setSetorDestino] = useState("");
  const [localDestino, setLocalDestino] = useState("");
  const [responsavelNome, setResponsavelNome] = useState(user?.displayName ?? "");
  const [responsavelCargo, setResponsavelCargo] = useState("");
  const [responsavelIdFuncional, setResponsavelIdFuncional] = useState("");
  const [observacao, setObservacao] = useState("");
  const [itens, setItens] = useState<ItemTransferencia[]>([]);
  const [searchPatrimonio, setSearchPatrimonio] = useState("");
  const [searchResults, setSearchResults] = useState<ItemTransferencia[]>([]);
  const [protocolo] = useState(gerarProtocolo);

  // Dropdowns
  const [origemOpen, setOrigemOpen] = useState(true);
  const [destinoOpen, setDestinoOpen] = useState(true);
  const [itensOpen, setItensOpen] = useState(true);
  const [assinaturaOpen, setAssinaturaOpen] = useState(true);

  const { data: setores } = trpc.patrimonio.setores.useQuery();
  const { data: patrimonioList } = trpc.patrimonio.list.useQuery(
    { search: searchPatrimonio, pageSize: 10, page: 1 },
    { enabled: searchPatrimonio.length >= 2 }
  );

  const handleSearch = (v: string) => {
    setSearchPatrimonio(v);
    if (v.length >= 2 && patrimonioList?.items) {
      setSearchResults(
        patrimonioList.items.map((i) => ({
          patrimonio: i.patrimonio as number,
          descricao: i.descricao ?? "",
          tipo: i.tipo ?? "outros",
          setor: i.setor ?? "",
        }))
      );
    } else {
      setSearchResults([]);
    }
  };

  const addItem = (item: ItemTransferencia) => {
    if (itens.find((i) => i.patrimonio === item.patrimonio)) {
      toast.error("Item já adicionado à transferência.");
      return;
    }
    setItens((prev) => [...prev, item]);
    setSearchPatrimonio("");
    setSearchResults([]);
    toast.success(`Patrimônio #${item.patrimonio} adicionado.`);
  };

  const removeItem = (patrimonio: number) => {
    setItens((prev) => prev.filter((i) => i.patrimonio !== patrimonio));
  };

  const canGenerate =
    setorOrigem.trim() &&
    setorDestino.trim() &&
    responsavelNome.trim() &&
    itens.length > 0;

  const handleGerarPDF = () => {
    if (!canGenerate) {
      toast.error("Preencha todos os campos obrigatórios e adicione ao menos um item.");
      return;
    }

    const now = new Date();
    const dataHora = now.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const dataSimples = now.toLocaleDateString("pt-BR");

    const itensRows = itens
      .map(
        (item, idx) => `
        <tr style="background:${idx % 2 === 0 ? "#f8fafc" : "white"}">
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-weight:700;color:#1a73c4;font-size:12px">#${item.patrimonio}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:11px;color:#1e293b">${item.descricao || "—"}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:11px;color:#475569">${TIPO_LABELS[item.tipo] ?? item.tipo}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:11px;color:#475569">${item.setor || "—"}</td>
        </tr>`
      )
      .join("");

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão. Verifique se popups estão permitidos.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Guia de Transferência — ${protocolo}</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Roboto', Arial, sans-serif; background: white; color: #1e293b; font-size: 12px; }
            .page { max-width: 21cm; margin: 0 auto; padding: 1.5cm; }

            .header { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;
              background: linear-gradient(135deg, #1B4F72 0%, #1A73C4 55%, #1B8A5A 100%); }
            .header-logo { width: 52px; height: 52px; background: white; border-radius: 10px; padding: 6px; flex-shrink: 0; }
            .header-logo img { width: 100%; height: 100%; object-fit: contain; }
            .header-text h1 { color: white; font-size: 18px; font-weight: 900; letter-spacing: 1px; }
            .header-text p { color: rgba(255,255,255,0.75); font-size: 11px; margin-top: 2px; }
            .header-right { margin-left: auto; text-align: right; }
            .header-right .doc-title { color: white; font-size: 13px; font-weight: 700; }
            .header-right .protocolo { color: rgba(255,255,255,0.85); font-size: 10px; margin-top: 3px; font-family: monospace; }

            .section { margin-bottom: 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
            .section-title { background: linear-gradient(90deg, #1B4F72, #1A73C4); color: white; padding: 7px 14px;
              font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
            .section-body { padding: 12px 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
            .info-item span { font-size: 12px; font-weight: 600; color: #1e293b; }
            .arrow-row { display: flex; align-items: center; gap: 12px; }
            .setor-box { flex: 1; background: #f1f5f9; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; }
            .setor-box .label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
            .setor-box .value { font-size: 13px; font-weight: 700; color: #1B4F72; margin-top: 3px; }
            .arrow-icon { font-size: 20px; color: #1A73C4; font-weight: 900; flex-shrink: 0; }

            .items-table { width: 100%; border-collapse: collapse; }
            .items-table thead tr { background: linear-gradient(90deg, #1B4F72, #1A73C4); }
            .items-table thead th { color: white; padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
            .items-count { display: inline-block; background: #1A73C4; color: white; border-radius: 20px; padding: 2px 10px; font-size: 11px; font-weight: 700; margin-left: 8px; }

            .assinaturas { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px; }
            .assinatura-box { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 12px; }
            .assinatura-box .title { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
            .assinatura-line { border-top: 1.5px solid #94a3b8; margin-top: 40px; padding-top: 6px; }
            .assinatura-line p { font-size: 10px; color: #475569; }
            .assinatura-line .nome { font-weight: 700; color: #1e293b; font-size: 11px; }

            .footer { margin-top: 20px; padding-top: 12px; border-top: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
            .footer p { font-size: 9px; color: #94a3b8; }

            .obs-box { background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #78350f; }

            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .page { padding: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="page">

            <div class="header">
              <div class="header-logo">
                <img src="${DETRAN_ICON_URL}" alt="DETRAN-RJ" />
              </div>
              <div class="header-text">
                <h1>DETRAN-RJ</h1>
                <p>Departamento de Trânsito do Estado do Rio de Janeiro</p>
                <p>DTIC — Divisão de Patrimônio</p>
              </div>
              <div class="header-right">
                <div class="doc-title">GUIA DE TRANSFERÊNCIA</div>
                <div class="protocolo">Protocolo: ${protocolo}</div>
                <div class="protocolo">Data: ${dataSimples}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Movimentação de Setor</div>
              <div class="section-body">
                <div class="arrow-row">
                  <div class="setor-box">
                    <div class="label">Setor de Origem</div>
                    <div class="value">${setorOrigem}</div>
                    ${localOrigem ? `<div style="font-size:10px;color:#64748b;margin-top:4px">${localOrigem}</div>` : ""}
                  </div>
                  <div class="arrow-icon">→</div>
                  <div class="setor-box" style="border-color:#1b8a5a40;background:#f0fdf4">
                    <div class="label">Setor de Destino</div>
                    <div class="value" style="color:#1b8a5a">${setorDestino}</div>
                    ${localDestino ? `<div style="font-size:10px;color:#64748b;margin-top:4px">${localDestino}</div>` : ""}
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Responsável pela Transferência</div>
              <div class="section-body">
                <div class="info-grid">
                  <div class="info-item">
                    <label>Nome Completo</label>
                    <span>${responsavelNome}</span>
                  </div>
                  <div class="info-item">
                    <label>Cargo / Função</label>
                    <span>${responsavelCargo || "—"}</span>
                  </div>
                  <div class="info-item">
                    <label>ID Funcional</label>
                    <span>${responsavelIdFuncional || "—"}</span>
                  </div>
                  <div class="info-item">
                    <label>Data / Hora</label>
                    <span>${dataHora}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">
                Bens Patrimoniais Transferidos
                <span class="items-count">${itens.length} ${itens.length === 1 ? "item" : "itens"}</span>
              </div>
              <div style="padding:0">
                <table class="items-table">
                  <thead>
                    <tr>
                      <th style="width:100px">Nº Patrimônio</th>
                      <th>Descrição</th>
                      <th style="width:110px">Tipo</th>
                      <th style="width:140px">Setor Atual</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itensRows}
                  </tbody>
                </table>
              </div>
            </div>

            ${observacao ? `
            <div class="section">
              <div class="section-title">Observações</div>
              <div class="section-body">
                <div class="obs-box">${observacao}</div>
              </div>
            </div>` : ""}

            <div class="assinaturas">
              <div class="assinatura-box">
                <div class="title">Responsável pela Entrega</div>
                <div class="assinatura-line">
                  <p class="nome">${responsavelNome}</p>
                  <p>${responsavelCargo || "—"} ${responsavelIdFuncional ? `· ID: ${responsavelIdFuncional}` : ""}</p>
                  <p>${setorOrigem}</p>
                </div>
              </div>
              <div class="assinatura-box">
                <div class="title">Responsável pelo Recebimento</div>
                <div class="assinatura-line">
                  <p class="nome">_________________________________</p>
                  <p>Cargo / Função: ____________________</p>
                  <p>${setorDestino}</p>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>DETRAN-RJ · DTIC / Divisão de Patrimônio · Levantamento Patrimonial 2025/2026</p>
              <p>Protocolo: ${protocolo} · Emitido em ${dataHora}</p>
            </div>

          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Guia de Transferência gerada com sucesso!");
  };

  return (
    <PatrimonioLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">

        {/* Header */}
        <div
          className="rounded-xl p-5 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #1b4f72 0%, #1a73c4 55%, #1b8a5a 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
              <ClipboardList size={24} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black leading-tight">Guia de Transferência</h1>
              <p className="text-white/70 text-sm mt-0.5">Protocolo: <span className="font-mono font-bold text-white">{protocolo}</span></p>
            </div>
          </div>
        </div>

        {/* Seção 1: Origem */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <button
            onClick={() => setOrigemOpen(!origemOpen)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
            style={{ borderBottom: origemOpen ? "1px solid #e2e8f0" : "none" }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: "#1b4f7220" }}>
              <Building2 size={18} style={{ color: "#1b4f72" }} />
            </div>
            <span className="text-sm font-bold text-slate-900 flex-1 text-left">Setor de Origem</span>
            <ChevronDown size={18} style={{ transform: origemOpen ? "rotate(180deg)" : "", transition: "transform 200ms" }} />
          </button>
          {origemOpen && (
            <div className="px-5 py-4 space-y-3 bg-slate-50">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Setor *</label>
                <input
                  type="text"
                  list="setores-list"
                  value={setorOrigem}
                  onChange={(e) => setSetorOrigem(e.target.value)}
                  placeholder="Ex: DTIC / Informática"
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <datalist id="setores-list">
                  {(setores ?? []).map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Local Físico (Opcional)</label>
                <input
                  type="text"
                  value={localOrigem}
                  onChange={(e) => setLocalOrigem(e.target.value)}
                  placeholder="Ex: Sala 201, Almoxarifado..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seção 2: Destino */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <button
            onClick={() => setDestinoOpen(!destinoOpen)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
            style={{ borderBottom: destinoOpen ? "1px solid #e2e8f0" : "none" }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: "#1b8a5a20" }}>
              <Building2 size={18} style={{ color: "#1b8a5a" }} />
            </div>
            <span className="text-sm font-bold text-slate-900 flex-1 text-left">Setor de Destino</span>
            <ChevronDown size={18} style={{ transform: destinoOpen ? "rotate(180deg)" : "", transition: "transform 200ms" }} />
          </button>
          {destinoOpen && (
            <div className="px-5 py-4 space-y-3 bg-slate-50">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Setor *</label>
                <input
                  type="text"
                  list="setores-list"
                  value={setorDestino}
                  onChange={(e) => setSetorDestino(e.target.value)}
                  placeholder="Ex: Gabinete / Presidência"
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Local Físico (Opcional)</label>
                <input
                  type="text"
                  value={localDestino}
                  onChange={(e) => setLocalDestino(e.target.value)}
                  placeholder="Ex: Sala 301, Arquivo..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seção 3: Itens */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <button
            onClick={() => setItensOpen(!itensOpen)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
            style={{ borderBottom: itensOpen ? "1px solid #e2e8f0" : "none" }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: "#1a73c420" }}>
              <Hash size={18} style={{ color: "#1a73c4" }} />
            </div>
            <span className="text-sm font-bold text-slate-900 flex-1 text-left">Bens Patrimoniais</span>
            {itens.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "#1a73c4" }}>
                {itens.length}
              </span>
            )}
            <ChevronDown size={18} style={{ transform: itensOpen ? "rotate(180deg)" : "", transition: "transform 200ms" }} />
          </button>
          {itensOpen && (
            <div className="px-5 py-4 space-y-3 bg-slate-50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchPatrimonio}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar por número ou descrição..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden shadow-sm max-h-48 overflow-y-auto">
                  {searchResults.slice(0, 5).map((item) => (
                    <button
                      key={item.patrimonio}
                      onClick={() => addItem(item)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors border-b border-border last:border-0 text-left"
                    >
                      <Plus size={14} className="text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-blue-700 font-mono">#{item.patrimonio}</p>
                        <p className="text-xs text-slate-500 truncate">{item.descricao}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {itens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border-2 border-dashed border-slate-200">
                  <FileText size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Nenhum item adicionado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {itens.map((item) => (
                    <div key={item.patrimonio} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border hover:border-blue-300 transition-colors">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-blue-700 font-mono">#{item.patrimonio}</p>
                        <p className="text-xs text-slate-500 truncate">{item.descricao}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.patrimonio)}
                        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seção 4: Assinatura */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <button
            onClick={() => setAssinaturaOpen(!assinaturaOpen)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
            style={{ borderBottom: assinaturaOpen ? "1px solid #e2e8f0" : "none" }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: "#1b4f7220" }}>
              <User size={18} style={{ color: "#1b4f72" }} />
            </div>
            <span className="text-sm font-bold text-slate-900 flex-1 text-left">Assinatura e Observações</span>
            <ChevronDown size={18} style={{ transform: assinaturaOpen ? "rotate(180deg)" : "", transition: "transform 200ms" }} />
          </button>
          {assinaturaOpen && (
            <div className="px-5 py-4 space-y-3 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Nome Completo *</label>
                  <input
                    type="text"
                    value={responsavelNome}
                    onChange={(e) => setResponsavelNome(e.target.value)}
                    placeholder="Nome do responsável"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Cargo / Função</label>
                  <input
                    type="text"
                    value={responsavelCargo}
                    onChange={(e) => setResponsavelCargo(e.target.value)}
                    placeholder="Ex: Assistente Técnico"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">ID Funcional</label>
                  <input
                    type="text"
                    value={responsavelIdFuncional}
                    onChange={(e) => setResponsavelIdFuncional(e.target.value)}
                    placeholder="Ex: 5028399-5"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Observações (Opcional)</label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Adicione observações relevantes sobre a transferência..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 sticky bottom-4">
          <button
            onClick={handleGerarPDF}
            disabled={!canGenerate}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: canGenerate ? "linear-gradient(135deg, #1a73c4, #1b8a5a)" : "#cbd5e1",
              boxShadow: canGenerate ? "0 4px 12px rgba(26, 115, 196, 0.3)" : "none",
            }}
          >
            <Printer size={18} />
            Gerar e Imprimir PDF
          </button>
        </div>

      </div>
    </PatrimonioLayout>
  );
}
