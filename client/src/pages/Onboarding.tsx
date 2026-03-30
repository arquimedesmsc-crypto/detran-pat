import PatrimonioLayout from "@/components/PatrimonioLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  LogOut,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Dashboard",
    description: "Visualize KPIs e indicadores gerais do patrimônio",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600",
    route: "/dashboard",
    features: [
      "Total de patrimônios",
      "Valor total do acervo",
      "Itens localizados vs não localizados",
      "Distribuição por setor",
    ],
  },
  {
    id: 2,
    title: "Patrimônios",
    description: "Gerencie o inventário completo com filtros avançados",
    icon: Users,
    color: "from-green-500 to-green-600",
    route: "/patrimonio",
    features: [
      "Busca por número, descrição ou setor",
      "Filtros por valor, andar, status",
      "Ordenação por qualquer coluna",
      "QR Code para cada item",
    ],
  },
  {
    id: 3,
    title: "Transferência",
    description: "Crie guias de transferência com PDF automático",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    route: "/transferencia",
    features: [
      "Seleção de origem e destino",
      "Adição de itens à transferência",
      "Assinatura digital",
      "Geração de PDF com identidade visual",
    ],
  },
  {
    id: 4,
    title: "Relatórios",
    description: "Exporte dados em CSV, XLSX ou PDF",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    route: "/relatorios",
    features: [
      "Filtros por setor, status, tipo",
      "Exportação em múltiplos formatos",
      "Preview dos dados antes de exportar",
      "Formatação profissional DETRAN-RJ",
    ],
  },
  {
    id: 5,
    title: "Administração",
    description: "Gerencie usuários e logs do sistema (admin only)",
    icon: Settings,
    color: "from-red-500 to-red-600",
    route: "/admin",
    features: [
      "Criar e gerenciar usuários",
      "Ativar/desativar contas",
      "Redefinir senhas",
      "Visualizar logs de atividade",
    ],
  },
];

function OnboardingCard({
  step,
  isActive,
  onClick,
}: {
  step: (typeof ONBOARDING_STEPS)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;

  return (
    <Card
      onClick={onClick}
      className={`p-6 cursor-pointer transition-all duration-300 ${
        isActive
          ? "ring-2 ring-blue-500 shadow-lg scale-105"
          : "hover:shadow-md hover:scale-102"
      }`}
    >
      <div className={`bg-gradient-to-r ${step.color} p-4 rounded-lg mb-4 w-fit`}>
        <Icon size={24} className="text-white" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

      <div className="space-y-2">
        {step.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [activeStep, setActiveStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const currentStep = ONBOARDING_STEPS.find((s) => s.id === activeStep);

  const handleNext = () => {
    if (activeStep < ONBOARDING_STEPS.length) {
      setActiveStep(activeStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNavigateTo = (route: string) => {
    window.location.href = route;
  };

  if (completed) {
    return (
      <PatrimonioLayout>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Parabéns!
            </h1>
            <p className="text-muted-foreground mb-8">
              Você completou o tour de boas-vindas. Agora você está pronto para usar o sistema!
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Ir para Dashboard
              </Button>
              <Button
                onClick={() => navigate("/patrimonio")}
                variant="outline"
                className="w-full"
              >
                Ir para Patrimônios
              </Button>
            </div>
          </div>
        </div>
      </PatrimonioLayout>
    );
  }

  return (
    <PatrimonioLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Bem-vindo ao DETRAN Patrimônio
              </h1>
              <p className="text-lg text-muted-foreground">
                Conheça as principais funcionalidades do sistema
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {activeStep}/{ONBOARDING_STEPS.length}
              </div>
              <p className="text-sm text-muted-foreground">Passos</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(activeStep / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Left: Cards Grid */}
            <div className="md:col-span-1">
              <div className="space-y-3">
                {ONBOARDING_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeStep === step.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-foreground hover:bg-gray-50 border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          activeStep === step.id
                            ? "bg-white text-blue-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.id}
                      </div>
                      <span className="font-medium text-sm">{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Detail View */}
            {currentStep && (
              <div className="md:col-span-2">
                <Card className="p-8 h-full">
                  <div className={`bg-gradient-to-r ${currentStep.color} p-8 rounded-lg mb-6`}>
                    <currentStep.icon size={48} className="text-white" />
                  </div>

                  <h2 className="text-3xl font-bold text-foreground mb-3">
                    {currentStep.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    {currentStep.description}
                  </p>

                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4">
                      Principais recursos:
                    </h3>
                    <ul className="space-y-3">
                      {currentStep.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Zap size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleNavigateTo(currentStep.route)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Explorar Agora
                    </Button>
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      className="flex-1"
                    >
                      Próximo
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={activeStep === 1}
              variant="outline"
            >
              ← Anterior
            </Button>

            <div className="space-x-2">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
              >
                Pular
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {activeStep === ONBOARDING_STEPS.length ? "Concluir" : "Próximo →"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PatrimonioLayout>
  );
}
