import { useState, useEffect } from "react";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

const DETRAN_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/oTCLSWdpa8zHUdyVqArmkm/detran-logo_e89f40c0.jpg";
const DETRAN_ICON_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAppAuth();
  const { t, language } = useI18n();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Preencha usuário e senha.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? t("login.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d2d4f 0%, #1A73C4 45%, #1B8A5A 100%)" }}
    >
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #1B8A5A 0%, transparent 70%)" }} />
      <div className="absolute top-[40%] left-[-60px] w-[200px] h-[200px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

      {/* Painel esquerdo — branding (só desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 p-12 relative z-10">
        <img
          src={DETRAN_LOGO_URL}
          alt="DETRAN-RJ"
          className="w-48 h-48 object-contain drop-shadow-2xl mb-8"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <h1 className="text-white text-4xl font-black tracking-tight text-center">DETRAN-RJ</h1>
        <p className="text-white/70 text-lg font-medium mt-2 tracking-widest uppercase text-center">Sistema de Patrimônio</p>
        <p className="text-white/40 text-sm mt-4 text-center max-w-xs">{language === "en" ? "Asset survey and control — 2025/2026" : "Levantamento e controle de bens patrimoniais — 2025/2026"}</p>
      </div>

      {/* Divisor vertical */}
      <div className="hidden lg:block w-px bg-white/10 my-16" />

      {/* Painel direito — formulário */}
      <div className="flex flex-col items-center justify-center flex-1 lg:max-w-md p-6 lg:p-12 relative z-10 w-full">
        {/* Header mobile */}
        <div className="flex flex-col items-center mb-8 lg:hidden">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <img
              src={DETRAN_ICON_URL}
              alt="DETRAN-RJ"
              className="w-14 h-14 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = DETRAN_LOGO_URL; }}
            />
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">DETRAN-RJ</h1>
          <p className="text-white/70 text-xs font-medium mt-1 tracking-widest uppercase">Sistema de Patrimônio</p>
        </div>

        {/* Card branco */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: "#1B4F72" }}>
            {t("login.title")}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {t("login.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo usuário */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4F72" }}>
                {t("login.username")}
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#1A73C4" }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === "en" ? "e.g.: john.doe" : "ex: moises.costa"}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                  style={{
                    borderColor: error ? "#e53e3e" : "#e2e8f0",
                    background: "#f8fafc",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                  onBlur={(e) => (e.target.style.borderColor = error ? "#e53e3e" : "#e2e8f0")}
                />
              </div>
            </div>

            {/* Campo senha */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1B4F72" }}>
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#1A73C4" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                  style={{
                    borderColor: error ? "#e53e3e" : "#e2e8f0",
                    background: "#f8fafc",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1A73C4")}
                  onBlur={(e) => (e.target.style.borderColor = error ? "#e53e3e" : "#e2e8f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #1A73C4 0%, #1B8A5A 100%)",
                boxShadow: "0 4px 15px rgba(26,115,196,0.4)",
              }}
            >
              <span className="relative z-10">
                {submitting ? (language === "en" ? "Signing in..." : "Entrando...") : t("login.button")}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "linear-gradient(135deg, #1565a8 0%, #156b47 100%)" }}
              />
            </button>
          </form>

          {/* Rodapé */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {language === "en" ? "DTIC / Assets · 2025/2026 Survey" : "DTIC / Patrimônio · Levantamento 2025/2026"}
            </p>
          </div>
        </div>

        {/* Versão */}
        <p className="text-center text-white/40 text-xs mt-6">
          {language === "en" ? "v2.0 · Development Environment" : "v2.0 · Ambiente de Desenvolvimento"}
        </p>
      </div>
    </div>
  );
}
