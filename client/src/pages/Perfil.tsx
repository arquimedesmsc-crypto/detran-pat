import { useState } from "react";
import PatrimonioLayout from "@/components/PatrimonioLayout";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  User, Lock, Shield, Bell, Palette, Building2,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle,
  Sun, Moon, IdCard, Briefcase, Mail, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SETORES = [
  "DIPAT", "DIRIN", "DETRA", "DETRAN-RJ", "DIAFI", "DIATI",
  "DICON", "DIREC", "DICOM", "DIREH", "DIREL", "DIRES",
  "Administração", "Financeiro", "TI", "Jurídico", "RH",
];

const CARGOS = [
  "Analista", "Técnico", "Assistente", "Coordenador", "Gerente",
  "Diretor", "Auditor", "Fiscal", "Agente Administrativo",
  "Especialista em TI", "Contador", "Advogado",
];

export default function Perfil() {
  const { user, token } = useAppAuth();
  const { theme, toggleTheme } = useTheme();

  // Buscar dados completos do perfil
  const perfilQuery = trpc.perfil.get.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const updateMutation = trpc.perfil.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      perfilQuery.refetch();
    },
    onError: () => toast.error("Erro ao atualizar perfil"),
  });

  const solicitarAlteracaoMutation = trpc.perfil.solicitarAlteracao.useMutation({
    onSuccess: () => toast.success("Solicitação enviada ao administrador!"),
    onError: () => toast.error("Erro ao enviar solicitação"),
  });

  // Estado do formulário
  const [displayName, setDisplayName] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [email, setEmail] = useState("");
  const [idFuncional, setIdFuncional] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Inicializar formulário com dados do servidor
  if (perfilQuery.data && !initialized) {
    const p = perfilQuery.data;
    setDisplayName(p.displayName ?? "");
    setCargo(p.cargo ?? "");
    setSetor(p.setor ?? "");
    setEmail(p.email ?? "");
    setIdFuncional(p.idFuncional ?? "");
    setInitialized(true);
  }

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  // Solicitação de alteração de cargo/setor
  const [novoCargo, setNovoCargo] = useState("");
  const [novoSetor, setNovoSetor] = useState("");
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");

  const handleSalvarPerfil = () => {
    if (!token) return;
    updateMutation.mutate({
      token,
      displayName,
      email,
    });
  };

  const handleAlterarSenha = () => {
    if (!token) return;
    if (!senhaAtual) return toast.error("Informe a senha atual");
    if (!novaSenha) return toast.error("Informe a nova senha");
    if (novaSenha.length < 6) return toast.error("A nova senha deve ter ao menos 6 caracteres");
    if (novaSenha !== confirmarSenha) return toast.error("As senhas não coincidem");

    updateMutation.mutate({
      token,
      currentPassword: senhaAtual,
      newPassword: novaSenha,
    });

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const handleSolicitarAlteracao = () => {
    if (!token) return;
    if (!novoCargo && !novoSetor) return toast.error("Informe o novo cargo ou setor");
    if (!motivoSolicitacao) return toast.error("Informe o motivo da solicitação");

    // Enviar uma solicitação por campo alterado
    if (novoCargo) {
      solicitarAlteracaoMutation.mutate({
        token,
        campo: "cargo",
        valorAtual: perfil?.cargo ?? "",
        valorSolicitado: novoCargo,
        motivo: motivoSolicitacao,
      });
    }
    if (novoSetor) {
      solicitarAlteracaoMutation.mutate({
        token,
        campo: "setor",
        valorAtual: perfil?.setor ?? "",
        valorSolicitado: novoSetor,
        motivo: motivoSolicitacao,
      });
    }

    setNovoCargo("");
    setNovoSetor("");
    setMotivoSolicitacao("");
  };

  const perfil = perfilQuery.data;
  const isAdmin = user?.role === "admin";

  return (
    <PatrimonioLayout>
      <div className="space-y-6">
        {/* Header */}
        <div
          className="rounded-xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #1B4F72, #1A73C4, #1B8A5A)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white/30">
              {(perfil?.displayName ?? user?.displayName ?? "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{perfil?.displayName ?? user?.displayName}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-white/80 text-sm">@{user?.username}</span>
                <Badge
                  className={`text-xs font-semibold ${
                    isAdmin
                      ? "bg-amber-400/30 text-amber-100 border-amber-300/50"
                      : "bg-white/20 text-white border-white/30"
                  }`}
                  variant="outline"
                >
                  {isAdmin ? "Administrador" : "Usuário"}
                </Badge>
                {perfil?.cargo && (
                  <Badge className="bg-white/20 text-white border-white/30 text-xs" variant="outline">
                    {perfil.cargo}
                  </Badge>
                )}
                {perfil?.setor && (
                  <Badge className="bg-white/20 text-white border-white/30 text-xs" variant="outline">
                    {perfil.setor}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Dados Pessoais */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A73C4, #1B8A5A)" }}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">Dados Pessoais</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Nome de Exibição
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="border-border focus:border-[#1A73C4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.gov.br"
                      className="border-border focus:border-[#1A73C4]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                      Matrícula / ID Funcional
                    </Label>
                    <Input
                      value={perfil?.idFuncional ?? idFuncional}
                      readOnly
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                      placeholder="ID Funcional"
                    />
                    <p className="text-xs text-muted-foreground">Solicite alteração ao administrador</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <IdCard className="w-3.5 h-3.5 text-muted-foreground" />
                      Usuário do Sistema
                    </Label>
                    <Input
                      value={user?.username ?? ""}
                      readOnly
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                      Cargo
                    </Label>
                    <Input
                      value={perfil?.cargo ?? cargo}
                      readOnly
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                      placeholder="Cargo"
                    />
                    <p className="text-xs text-muted-foreground">Solicite alteração ao administrador</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      Setor
                    </Label>
                    <Input
                      value={perfil?.setor ?? setor}
                      readOnly
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                      placeholder="Setor"
                    />
                    <p className="text-xs text-muted-foreground">Solicite alteração ao administrador</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSalvarPerfil}
                    disabled={updateMutation.isPending}
                    className="gap-2"
                    style={{ background: "linear-gradient(135deg, #1B8A5A, #2E9D6A)" }}
                  >
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? "Salvando..." : "Salvar Dados Pessoais"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Alterar Senha */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4A017, #E8B84B)" }}>
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">Alterar Senha</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual" className="text-sm font-medium">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="senhaAtual"
                      type={showSenhaAtual ? "text" : "password"}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha" className="text-sm font-medium">Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="novaSenha"
                        type={showNovaSenha ? "text" : "password"}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-sm font-medium">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmarSenha"
                        type={showConfirmar ? "text" : "password"}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmar(!showConfirmar)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {novaSenha && confirmarSenha && (
                  <div className={`flex items-center gap-2 text-sm ${novaSenha === confirmarSenha ? "text-green-600" : "text-red-500"}`}>
                    {novaSenha === confirmarSenha
                      ? <><CheckCircle2 className="w-4 h-4" /> As senhas coincidem</>
                      : <><AlertCircle className="w-4 h-4" /> As senhas não coincidem</>
                    }
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleAlterarSenha}
                    disabled={updateMutation.isPending || !senhaAtual || !novaSenha || novaSenha !== confirmarSenha}
                    variant="outline"
                    className="gap-2 border-amber-500 text-amber-700 hover:bg-amber-50"
                  >
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                </div>
              </div>
            </div>

            {/* Solicitar Alteração de Cargo/Setor */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Solicitar Alteração de Cargo/Setor</h2>
                  <p className="text-xs text-muted-foreground">Requer aprovação do administrador</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Novo Cargo (opcional)</Label>
                    <select
                      value={novoCargo}
                      onChange={(e) => setNovoCargo(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73C4]/30"
                    >
                      <option value="">Selecionar cargo...</option>
                      {CARGOS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Novo Setor (opcional)</Label>
                    <select
                      value={novoSetor}
                      onChange={(e) => setNovoSetor(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73C4]/30"
                    >
                      <option value="">Selecionar setor...</option>
                      {SETORES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Motivo da Solicitação *</Label>
                  <textarea
                    value={motivoSolicitacao}
                    onChange={(e) => setMotivoSolicitacao(e.target.value)}
                    placeholder="Descreva o motivo da solicitação de alteração..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A73C4]/30"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSolicitarAlteracao}
                    disabled={solicitarAlteracaoMutation.isPending || (!novoCargo && !novoSetor) || !motivoSolicitacao}
                    variant="outline"
                    className="gap-2 border-purple-500 text-purple-700 hover:bg-purple-50"
                  >
                    <Bell className="w-4 h-4" />
                    Enviar Solicitação
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-6">

            {/* Informações da Conta */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A73C4, #1B4F72)" }}>
                  <IdCard className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">Informações da Conta</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Usuário</span>
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Perfil</span>
                  <Badge className={isAdmin ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}>
                    {isAdmin ? "Admin" : "Usuário"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Cargo</span>
                  <span className="text-sm font-medium">{perfil?.cargo ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Setor</span>
                  <span className="text-sm font-medium">{perfil?.setor ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Matrícula</span>
                  <span className="text-sm font-medium font-mono">{perfil?.idFuncional ?? "—"}</span>
                </div>
              </div>
            </div>

            {/* Aparência */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1B8A5A, #2E9D6A)" }}>
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-semibold text-foreground">Aparência</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">Escolha o tema de exibição do sistema.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => theme === "dark" && toggleTheme?.()}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === "light"
                        ? "border-[#1A73C4] bg-blue-50 shadow-md"
                        : "border-border hover:border-[#1A73C4]/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-xs font-medium">Claro</span>
                    {theme === "light" && (
                      <CheckCircle2 className="w-4 h-4 text-[#1A73C4]" />
                    )}
                  </button>
                  <button
                    onClick={() => theme === "light" && toggleTheme?.()}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-[#1A73C4] bg-blue-950/20 shadow-md"
                        : "border-border hover:border-[#1A73C4]/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shadow-sm">
                      <Moon className="w-5 h-5 text-blue-300" />
                    </div>
                    <span className="text-xs font-medium">Escuro</span>
                    {theme === "dark" && (
                      <CheckCircle2 className="w-4 h-4 text-[#1A73C4]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Status do Sistema */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/10">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="font-semibold text-foreground">Status</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Sistema online</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Sessão ativa</span>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  DETRAN-RJ Sistema de Patrimônio v1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatrimonioLayout>
  );
}
