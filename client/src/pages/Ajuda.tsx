import PatrimonioLayout from "@/components/PatrimonioLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  Mail,
  Phone,
  Search,
  Video,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

const FAQ_SECTIONS = [
  {
    title: "Dashboard",
    icon: "📊",
    faqs: [
      {
        q: "Como interpretar os KPIs do Dashboard?",
        a: "Os KPIs mostram: Total de patrimônios (quantidade total), Valor total (soma de todos os bens), Localizados (quantidade e valor), Não localizados (quantidade e valor). Use esses dados para monitorar a saúde geral do acervo.",
      },
      {
        q: "Posso exportar os dados do Dashboard?",
        a: "Sim! Vá para a seção Relatórios e escolha o formato desejado (CSV, XLSX ou PDF) para exportar todos os dados com filtros aplicados.",
      },
      {
        q: "Com que frequência os dados são atualizados?",
        a: "Os dados são atualizados em tempo real. Qualquer alteração (novo patrimônio, transferência, localização) é refletida imediatamente no Dashboard.",
      },
    ],
  },
  {
    title: "Patrimônios",
    icon: "📦",
    faqs: [
      {
        q: "Como adicionar um novo patrimônio?",
        a: "Clique no botão 'Novo Patrimônio' na sidebar. Preencha os dados (número, descrição, setor, local, valor, etc.) e faça upload da imagem. Clique em 'Salvar' para confirmar.",
      },
      {
        q: "Como marcar um patrimônio como localizado?",
        a: "Abra o patrimônio clicando na linha da tabela. No modal de detalhes, clique em 'Identificar como Localizado'. O status será atualizado imediatamente.",
      },
      {
        q: "Como gerar QR Code para um patrimônio?",
        a: "Abra o patrimônio no modal de detalhes e clique no botão 'QR Code'. Você pode visualizar, baixar como PNG ou imprimir.",
      },
      {
        q: "Como filtrar patrimônios por andar?",
        a: "Na tabela de patrimônios, use o filtro expandido (ícone de funil). Selecione o andar desejado e clique em 'Aplicar'.",
      },
    ],
  },
  {
    title: "Transferência",
    icon: "🔄",
    faqs: [
      {
        q: "Como criar uma guia de transferência?",
        a: "Vá para Transferência e preencha: 1) Setor e local de origem, 2) Setor e local de destino, 3) Selecione os patrimônios, 4) Preencha dados do signatário. Clique em 'Gerar PDF'.",
      },
      {
        q: "O PDF é gerado automaticamente?",
        a: "Sim! Após preencher todos os campos obrigatórios, clique em 'Gerar PDF'. O documento será baixado com a identidade visual DETRAN-RJ.",
      },
      {
        q: "Posso editar uma transferência após criar?",
        a: "Sim, você pode reabrir a guia e fazer alterações antes de gerar o PDF final. Após emitir, a guia fica como histórico.",
      },
    ],
  },
  {
    title: "Relatórios",
    icon: "📈",
    faqs: [
      {
        q: "Quais formatos de exportação estão disponíveis?",
        a: "CSV (para Excel), XLSX (planilha formatada), e PDF (relatório visual). Escolha o formato na página de Relatórios.",
      },
      {
        q: "Como filtrar dados antes de exportar?",
        a: "Use os filtros expandidos: setor, status (localizado/não localizado), tipo de bem, valor mínimo/máximo. Os dados no preview refletem os filtros aplicados.",
      },
      {
        q: "O relatório inclui imagens?",
        a: "O PDF inclui um resumo com gráficos. Para detalhes com imagens, use a tabela de Patrimônios.",
      },
    ],
  },
  {
    title: "Administração",
    icon: "⚙️",
    faqs: [
      {
        q: "Como criar um novo usuário?",
        a: "Vá para Administração (apenas admin). Clique em 'Novo Usuário', preencha nome, username e senha. O usuário poderá fazer login imediatamente.",
      },
      {
        q: "Como redefinir a senha de um usuário?",
        a: "Na seção de Administração, localize o usuário e clique em 'Redefinir Senha'. Uma nova senha temporária será gerada.",
      },
      {
        q: "Como visualizar logs de atividade?",
        a: "Na seção de Administração, vá para 'Logs'. Você pode filtrar por usuário, ação ou data para auditar o sistema.",
      },
    ],
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onClick,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-foreground text-left">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-gray-50 border-t border-border text-sm text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  );
}

function FAQSection({
  section,
}: {
  section: (typeof FAQ_SECTIONS)[0];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {section.icon} {section.title}
      </h2>
      <div className="space-y-2">
        {section.faqs.map((faq, idx) => (
          <FAQItem
            key={idx}
            q={faq.q}
            a={faq.a}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Ajuda() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"faq" | "guias" | "contato">("faq");

  const filteredSections = FAQ_SECTIONS.map((section) => ({
    ...section,
    faqs: section.faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((section) => section.faqs.length > 0);

  return (
    <PatrimonioLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Central de Ajuda
            </h1>
            <p className="text-lg text-muted-foreground">
              Encontre respostas para suas dúvidas sobre o sistema
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {[
              { id: "faq", label: "FAQ", icon: HelpCircle },
              { id: "guias", label: "Guias", icon: BookOpen },
              { id: "contato", label: "Contato", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                  activeTab === id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "faq" && (
            <>
              {/* Search */}
              <div className="mb-8 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Pesquise por palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* FAQ Items */}
              {filteredSections.length > 0 ? (
                filteredSections.map((section, idx) => (
                  <FAQSection key={idx} section={section} />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <HelpCircle size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhuma pergunta encontrada para "{searchTerm}"
                  </p>
                </Card>
              )}
            </>
          )}

          {activeTab === "guias" && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Video size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      Vídeo: Primeiros Passos
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Aprenda o básico do sistema em 5 minutos
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Assistir Vídeo
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <BookOpen size={24} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      Guia Completo em PDF
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Documentação detalhada com screenshots de todas as funcionalidades
                    </p>
                    <Button variant="outline">
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "contato" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <Mail size={24} className="text-blue-600 mb-4" />
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Envie suas dúvidas ou sugestões
                </p>
                <a
                  href="mailto:suporte@detran.rj.gov.br"
                  className="text-blue-600 hover:underline font-medium"
                >
                  suporte@detran.rj.gov.br
                </a>
              </Card>

              <Card className="p-6">
                <Phone size={24} className="text-green-600 mb-4" />
                <h3 className="font-bold text-foreground mb-2">Telefone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Suporte técnico disponível
                </p>
                <a
                  href="tel:+5521999999999"
                  className="text-green-600 hover:underline font-medium"
                >
                  +55 (21) 9999-9999
                </a>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PatrimonioLayout>
  );
}
