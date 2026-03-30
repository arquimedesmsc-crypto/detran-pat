import { useState } from "react";
import PatrimonioLayout from "@/components/PatrimonioLayout";
import { trpc } from "@/lib/trpc";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { useLocation } from "wouter";
import {
  Activity,
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Shield,
  User,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { toast } from "sonner";

type AppUserRow = {
  id: number;
  username: string;
  displayName: string;
  cargo: string | null;
  idFuncional: string | null;
  setor: string | null;
  email: string | null;
  role: "admin" | "user";
  ativo: boolean;
  createdAt: Date;
  lastLogin: Date | null;
};

type LogRow = {
  id: number;
  userId: number | null;
  username: string | null;
  acao: string;
  entidade: string | null;
  entidadeId: string | null;
  detalhes: string | null;
  ip: string | null;
  createdAt: Date;
};

const ACAO_LABELS: Record<string, string> = {
  criar_usuario: "Criar Usuário",
  atualizar_usuario: "Atualizar Usuário",
  login: "Login",
  logout: "Logout",
  criar_patrimonio: "Criar Patrimônio",
  localizar_patrimonio: "Localizar Patrimônio",
};

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Admin() {
  const { user, token } = useAppAuth();
  const [, navigate] = useLocation();

  // Redirecionar se não for admin
  if (user && user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const [activeTab, setActiveTab] = useState<"usuarios" | "logs">("usuarios");
  const [editingUser, setEditingUser] = useState<AppUserRow | null>(null);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form de novo usuário
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    displayName: "",
    cargo: "",
    idFuncional: "",
    setor: "",
    email: "",
    role: "user" as "admin" | "user",
  });

  // Form de edição
  const [editForm, setEditForm] = useState({
    displayName: "",
    cargo: "",
    idFuncional: "",
    setor: "",
    email: "",
    role: "user" as "admin" | "user",
    ativo: true,
    password: "",
  });

  const { data: users, refetch: refetchUsers, isLoading: usersLoading } =
    trpc.admin.listUsers.useQuery({ token: token ?? "" }, { enabled: !!token && user?.role === "admin" });

  const { data: logsData, refetch: refetchLogs, isLoading: logsLoading } =
    trpc.admin.logs.useQuery({ token: token ?? "", page: 1, pageSize: 50 }, { enabled: !!token && user?.role === "admin" && activeTab === "logs" });

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      setShowNewUserForm(false);
      setNewUser({ username: "", password: "", displayName: "", cargo: "", idFuncional: "", setor: "", email: "", role: "user" });
      refetchUsers();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      setEditingUser(null);
      refetchUsers();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password || !newUser.displayName) {
      toast.error("Preencha os campos obrigatórios: usuário, senha e nome.");
      return;
    }
    createUserMutation.mutate({ token: token ?? "", ...newUser });
  };

  const handleEditUser = (u: AppUserRow) => {
    setEditingUser(u);
    setEditForm({
      displayName: u.displayName,
      cargo: u.cargo ?? "",
      idFuncional: u.idFuncional ?? "",
      setor: u.setor ?? "",
      email: u.email ?? "",
      role: u.role,
      ativo: u.ativo,
      password: "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    const data: any = { token: token ?? "", id: editingUser.id };
    if (editForm.displayName) data.displayName = editForm.displayName;
    if (editForm.cargo !== undefined) data.cargo = editForm.cargo;
    if (editForm.idFuncional !== undefined) data.idFuncional = editForm.idFuncional;
    if (editForm.setor !== undefined) data.setor = editForm.setor;
    if (editForm.email) data.email = editForm.email;
    data.role = editForm.role;
    data.ativo = editForm.ativo;
    if (editForm.password) data.password = editForm.password;
    updateUserMutation.mutate(data);
  };

  const handleToggleAtivo = (u: AppUserRow) => {
    updateUserMutation.mutate({
      token: token ?? "",
      id: u.id,
      ativo: !u.ativo,
    });
  };

  return (
    <PatrimonioLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">

        {/* Header */}
        <div
          className="rounded-xl p-5 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #1b4f72 0%, #1a73c4 55%, #7c3aed 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 flex-shrink-0">
              <Shield size={24} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black leading-tight">Painel Administrativo</h1>
              <p className="text-white/70 text-sm mt-0.5">Gestão de usuários e logs do sistema</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
              <Shield size={14} className="text-yellow-300" />
              <span className="text-xs font-bold text-yellow-200">Admin</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "usuarios"
                ? "bg-white shadow-sm text-blue-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User size={16} />
            Usuários
            {users && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${activeTab === "usuarios" ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"}`}>
                {users.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "logs"
                ? "bg-white shadow-sm text-purple-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Activity size={16} />
            Logs do Sistema
          </button>
        </div>

        {/* Tab: Usuários */}
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            {/* Botão novo usuário */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                {usersLoading ? "Carregando..." : `${users?.length ?? 0} usuários cadastrados`}
              </p>
              <button
                onClick={() => setShowNewUserForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
              >
                <Plus size={16} />
                Novo Usuário
              </button>
            </div>

            {/* Formulário novo usuário */}
            {showNewUserForm && (
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <Plus size={18} className="text-blue-600" />
                    Novo Usuário
                  </h3>
                  <button onClick={() => setShowNewUserForm(false)} className="p-1 rounded-lg hover:bg-slate-100">
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Usuário *</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="ex: joao.silva"
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Senha *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full px-3 py-2 pr-9 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome Completo *</label>
                    <input
                      type="text"
                      value={newUser.displayName}
                      onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cargo</label>
                    <input
                      type="text"
                      value={newUser.cargo}
                      onChange={(e) => setNewUser({ ...newUser, cargo: e.target.value })}
                      placeholder="Ex: Assistente Técnico"
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">ID Funcional</label>
                    <input
                      type="text"
                      value={newUser.idFuncional}
                      onChange={(e) => setNewUser({ ...newUser, idFuncional: e.target.value })}
                      placeholder="Ex: 5028399-5"
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Setor</label>
                    <input
                      type="text"
                      value={newUser.setor}
                      onChange={(e) => setNewUser({ ...newUser, setor: e.target.value })}
                      placeholder="Ex: DTIC"
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">E-mail</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@detran.rj.gov.br"
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Perfil</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "user" })}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowNewUserForm(false)}
                    className="px-4 py-2 rounded-xl border text-sm font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateUser}
                    disabled={createUserMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
                  >
                    {createUserMutation.isPending ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Criar Usuário
                  </button>
                </div>
              </div>
            )}

            {/* Lista de usuários */}
            {usersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(users ?? []).map((u) => (
                  <div
                    key={u.id}
                    className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${!u.ativo ? "opacity-60" : ""}`}
                    style={{ borderColor: u.ativo ? "#e2e8f0" : "#fca5a5" }}
                  >
                    {editingUser?.id === u.id ? (
                      /* Formulário de edição inline */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-black text-slate-700 flex items-center gap-2">
                            <Edit2 size={16} className="text-blue-500" />
                            Editando: {u.username}
                          </span>
                          <button onClick={() => setEditingUser(null)} className="p-1 rounded-lg hover:bg-slate-100">
                            <X size={16} className="text-slate-400" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome</label>
                            <input type="text" value={editForm.displayName} onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cargo</label>
                            <input type="text" value={editForm.cargo} onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">ID Funcional</label>
                            <input type="text" value={editForm.idFuncional} onChange={(e) => setEditForm({ ...editForm, idFuncional: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Setor</label>
                            <input type="text" value={editForm.setor} onChange={(e) => setEditForm({ ...editForm, setor: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nova Senha (opcional)</label>
                            <input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              placeholder="Deixe em branco para não alterar"
                              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Perfil</label>
                            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "admin" | "user" })}
                              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                              <option value="user">Usuário</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button onClick={() => setEditingUser(null)} className="px-3 py-1.5 rounded-lg border text-xs font-bold text-slate-500 hover:bg-slate-50">Cancelar</button>
                          <button onClick={handleSaveEdit} disabled={updateUserMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}>
                            {updateUserMutation.isPending ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Visualização do usuário */
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-black"
                          style={{ background: u.role === "admin" ? "linear-gradient(135deg, #7c3aed, #1a73c4)" : "linear-gradient(135deg, #1a73c4, #1b8a5a)" }}
                        >
                          {u.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-sm">{u.displayName}</span>
                            <span className="font-mono text-xs text-slate-400">@{u.username}</span>
                            {u.role === "admin" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                <Shield size={10} />Admin
                              </span>
                            )}
                            {!u.ativo && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                <UserX size={10} />Inativo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {u.cargo && <span className="text-xs text-slate-500">{u.cargo}</span>}
                            {u.idFuncional && <span className="text-xs text-slate-400 font-mono">ID: {u.idFuncional}</span>}
                            {u.setor && <span className="text-xs text-slate-400">{u.setor}</span>}
                            {u.lastLogin && <span className="text-xs text-slate-300">Último login: {formatDate(u.lastLogin)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEditUser(u as AppUserRow)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-slate-400 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleToggleAtivo(u as AppUserRow)}
                            className={`p-1.5 rounded-lg transition-colors ${u.ativo ? "hover:bg-red-50 text-slate-400 hover:text-red-500" : "hover:bg-green-50 text-slate-400 hover:text-green-600"}`}
                            title={u.ativo ? "Desativar" : "Ativar"}
                          >
                            {u.ativo ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Logs */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                {logsLoading ? "Carregando..." : `${logsData?.total ?? 0} registros de atividade`}
              </p>
              <button
                onClick={() => refetchLogs()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw size={13} />
                Atualizar
              </button>
            </div>

            {logsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (logsData?.items ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-slate-200">
                <Activity size={36} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-400 font-medium">Nenhum log registrado ainda</p>
                <p className="text-xs text-slate-300 mt-1">As ações do sistema aparecerão aqui</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "linear-gradient(90deg, #1b4f72, #1a73c4)" }}>
                      <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Data/Hora</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Usuário</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide">Ação</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wide hidden sm:table-cell">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(logsData?.items ?? []).map((log, idx) => (
                      <tr
                        key={log.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                        style={{ background: idx % 2 === 0 ? "white" : "#f8fafc" }}
                      >
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap font-mono">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-700 text-xs">{log.username ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              background: log.acao.includes("criar") ? "#dcfce7" : log.acao.includes("atualizar") ? "#dbeafe" : "#f1f5f9",
                              color: log.acao.includes("criar") ? "#15803d" : log.acao.includes("atualizar") ? "#1d4ed8" : "#475569",
                            }}
                          >
                            {ACAO_LABELS[log.acao] ?? log.acao}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell max-w-xs truncate">
                          {log.detalhes ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </PatrimonioLayout>
  );
}
