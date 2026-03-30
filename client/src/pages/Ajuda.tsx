import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  BookOpen,
  BarChart3,
  ArrowLeftRight,
  Settings,
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  Mail,
  FileText,
  Video,
  Users,
  Lock,
} from "lucide-react";
import PatrimonioLayout from "@/components/PatrimonioLayout";

const HELP_CATEGORIES = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600",
    questions: [
      {
        q: "O que é o Dashboard?",
        a: "O Dashboard é a página inicial do sistema que exibe um resumo visual de todos os patrimônios, com KPIs (indicadores-chave de desempenho) como total de bens, valor total do acervo e distribuição por setor.",
      },
      {
        q: "Como interpretar os cards de KPI?",
        a: "Cada card mostra uma métrica importante: Total de Patrimônios (quantidade total de bens), Valor Total (soma dos valores), Valor Localizado (bens encontrados) e Valor Não Localizado (bens em busca).",
      },
      {
        q: "Posso filtrar dados no Dashboard?",
        a: "O Dashboard exibe dados gerais do sistema. Para filtros específicos, acesse a seção 'Patrimônios' onde você pode filtrar por setor, status, tipo e outras opções.",
      },
    ],
  },
  {
    id: "patrimonios",
    title: "Patrimônios",
    icon: BookOpen,
    color: "from-green-500 to-green-600",
    questions: [
      {
        q: "Como buscar um patrimônio específico?",
        a: "Use a barra de busca no topo da página de Patrimônios. Você pode buscar por número do patrimônio, descrição, setor ou local. A busca é em tempo real.",
      },
      {
        q: "Como aplicar filtros avançados?",
        a: "Clique em 'Filtros' para expandir as opções. Você pode filtrar por: Setor, Status (Localizado/Não Localizado), Tipo de Bem, Valor (mínimo/máximo), Andar e Data de Incorporação.",
      },
      {
        q: "Como ordenar a lista de patrimônios?",
        a: "Clique no ícone de ordenação próximo ao seletor de colunas. Escolha o campo para ordenar (Patrimônio, Descrição, Valor, Andar, etc.) e a direção (Ascendente/Descendente).",
      },
      {
        q: "Como registrar um novo patrimônio?",
        a: "Clique no botão '+' (Novo Patrimônio) no topo da página. Preencha os dados: descrição, setor, local, valor, tipo e andar. Você pode adicionar uma imagem no início do formulário.",
      },
      {
        q: "Como marcar um patrimônio como localizado?",
        a: "Clique no patrimônio na tabela para abrir o modal de detalhes. Clique no botão 'Marcar como Localizado' para atualizar o status.",
      },
    ],
  },
  {
    id: "transferencia",
    title: "Transferência",
    icon: ArrowLeftRight,
    color: "from-purple-500 to-purple-600",
    questions: [
      {
        q: "O que é uma Guia de Transferência?",
        a: "Uma Guia de Transferência é um documento que registra a movimentação de patrimônios entre setores. Ela contém informações de origem, destino, itens transferidos e assinatura do responsável.",
      },
      {
        q: "Como criar uma nova transferência?",
        a: "Acesse 'Transferência' no menu lateral. Preencha os dados: Setor de Origem, Setor de Destino, selecione os patrimônios a transferir e adicione a assinatura do responsável. Clique em 'Gerar PDF' para finalizar.",
      },
      {
        q: "Como adicionar patrimônios na transferência?",
        a: "Na seção 'Itens', use a barra de busca para encontrar patrimônios. Clique no patrimônio desejado para adicioná-lo à lista de transferência.",
      },
      {
        q: "Como gerar o PDF da transferência?",
        a: "Após preencher todos os dados obrigatórios, clique em 'Gerar PDF'. O sistema criará um documento com a identidade visual DETRAN-RJ, pronto para impressão e arquivo.",
      },
    ],
  },
  {
    id: "relatorios",
    title: "Relatórios",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    questions: [
      {
        q: "Quais formatos de exportação estão disponíveis?",
        a: "Você pode exportar em três formatos: CSV (para Excel/Planilhas), XLSX (Planilha formatada com cores DETRAN-RJ) e PDF (Relatório visual com logo e filtros aplicados).",
      },
      {
        q: "Como aplicar filtros antes de exportar?",
        a: "Na página de Relatórios, use os filtros: Setor, Status, Tipo de Bem, Valor (mín/máx) e Andar. Clique em 'Exportar' para gerar o arquivo com os dados filtrados.",
      },
      {
        q: "Posso visualizar os dados antes de exportar?",
        a: "Sim! A página de Relatórios exibe uma prévia dos dados em uma tabela. Você pode revisar os dados antes de clicar em 'Exportar'.",
      },
    ],
  },
  {
    id: "admin",
    title: "Administração",
    icon: Settings,
    color: "from-red-500 to-red-600",
    questions: [
      {
        q: "Quem pode acessar o Painel Admin?",
        a: "Apenas usuários com role 'admin' podem acessar o Painel de Administração. Se você não vê a opção no menu, entre em contato com o administrador do sistema.",
      },
      {
        q: "Como gerenciar usuários?",
        a: "No Painel Admin, acesse 'Gestão de Usuários'. Você pode criar novos usuários, editar dados existentes, ativar/desativar usuários e redefinir senhas.",
      },
      {
        q: "Como visualizar logs de atividade?",
        a: "Na seção 'Logs', você verá um histórico de todas as ações realizadas no sistema: criação, edição, exclusão de patrimônios, transferências, etc. Filtre por usuário, ação ou data.",
      },
    ],
  },
];

export default function Ajuda() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("dashboard");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Filtrar categorias e perguntas baseado na busca
  const filteredCategories = HELP_CATEGORIES.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0 || searchTerm === "");

  return (
    <PatrimonioLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Central de Ajuda</h1>
            </div>
            <p className="text-slate-600 ml-12">Encontre respostas para suas dúvidas sobre o Sistema de Patrimônio DETRAN-RJ</p>
          </div>

          {/* Barra de Busca */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar por palavra-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-base border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const isExpanded = expandedCategory === category.id;

              return (
                <Card
                  key={category.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-0"
                >
                  {/* Header da Categoria */}
                  <button
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : category.id)
                    }
                    className={`w-full p-5 flex items-center justify-between bg-gradient-to-r ${category.color} text-white hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-lg">{category.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Conteúdo da Categoria */}
                  {isExpanded && (
                    <div className="p-6 space-y-4 bg-white">
                      {category.questions.length > 0 ? (
                        category.questions.map((question, idx) => (
                          <div
                            key={idx}
                            className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
                          >
                            <button
                              onClick={() =>
                                setExpandedQuestion(
                                  expandedQuestion === `${category.id}-${idx}`
                                    ? null
                                    : `${category.id}-${idx}`
                                )
                              }
                              className="w-full p-4 flex items-start justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span className="font-medium text-slate-900">
                                  {question.q}
                                </span>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                                  expandedQuestion === `${category.id}-${idx}`
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {expandedQuestion === `${category.id}-${idx}` && (
                              <div className="p-4 bg-white border-t border-slate-200 text-slate-700 leading-relaxed">
                                {question.a}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          Nenhuma pergunta encontrada para "{searchTerm}"
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Seção de Contato */}
          <Card className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 border-0 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-3">Ainda tem dúvidas?</h3>
                <p className="text-blue-800 mb-4">
                  Entre em contato com o suporte DETRAN-RJ para obter ajuda adicional:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Mail className="w-4 h-4" />
                    <span>Email: suporte@detran.rj.gov.br</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Phone className="w-4 h-4" />
                    <span>Telefone: (21) 3460-4000</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recursos Adicionais */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 hover:shadow-lg transition-shadow border-0 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-slate-900">Documentação</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Acesse guias completos e manuais do sistema
              </p>
              <button className="text-orange-500 font-medium text-sm hover:text-orange-600">
                Baixar PDF →
              </button>
            </Card>

            <Card className="p-5 hover:shadow-lg transition-shadow border-0 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <Video className="w-5 h-5 text-purple-500" />
                <h4 className="font-semibold text-slate-900">Tutoriais em Vídeo</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Assista vídeos explicativos sobre as principais funcionalidades
              </p>
              <button className="text-purple-500 font-medium text-sm hover:text-purple-600">
                Ver vídeos →
              </button>
            </Card>

            <Card className="p-5 hover:shadow-lg transition-shadow border-0 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-slate-900">Comunidade</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Conecte-se com outros usuários e compartilhe experiências
              </p>
              <button className="text-green-500 font-medium text-sm hover:text-green-600">
                Participar →
              </button>
            </Card>
          </div>
        </div>
      </div>
    </PatrimonioLayout>
  );
}
