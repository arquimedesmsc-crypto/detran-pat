import { useEffect, useState } from "react";

const DETRAN_ICON_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663443081896/MDXpDWKkLJQQcpGvzWTLe8/detran-icon-hq-TdvfPVr3p8pZjaYvubcmtk.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2400;
    const interval = 30;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const pct = Math.min(100, Math.round((current / steps) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Logo */}
      <div
        className="mb-8 flex items-center justify-center"
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          boxShadow: "0 8px 40px rgba(26,115,196,0.25), 0 2px 8px rgba(27,79,114,0.15)",
          background: "white",
          padding: 12,
        }}
      >
        <img
          src={DETRAN_ICON_URL}
          alt="DETRAN-RJ"
          style={{ width: 96, height: 96, objectFit: "contain" }}
        />
      </div>

      {/* Título */}
      <h1
        className="mb-1 text-3xl font-black tracking-tight"
        style={{
          background: "linear-gradient(135deg, #1b4f72, #1a73c4, #1b8a5a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        DETRAN-RJ
      </h1>
      <p className="mb-10 text-sm font-medium text-slate-500 tracking-widest uppercase">
        Sistema de Patrimônio
      </p>

      {/* Barra de progresso */}
      <div className="w-72 mb-4">
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full splash-progress-bar"
            style={{ width: `${progress}%`, transition: "width 0.03s linear" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>Carregando dados patrimoniais...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="splash-dot w-2 h-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, #1a73c4, #1b8a5a)",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Versão */}
      <p className="absolute bottom-6 text-xs text-slate-300">
        Levantamento Patrimonial 2025/2026
      </p>
    </div>
  );
}
