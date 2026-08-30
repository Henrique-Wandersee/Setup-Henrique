"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Key, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Requisitos de Senha Forte
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isFormValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setFeedback({ type: "error", text: "Token de redefinição ausente na URL." });
      return;
    }

    if (!isFormValid) {
      setFeedback({ type: "error", text: "Por favor, preencha uma senha forte válida e confirme a correspondência." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: "success", text: data.message });
      } else {
        setFeedback({ type: "error", text: data.error || "Falha ao redefinir a senha." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Erro de conexão ao servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-cyber-card border-2 border-cyber-magenta/50 rounded-2xl shadow-magenta-glow p-6 sm:p-8 relative overflow-hidden">
      
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyber-magenta via-white to-cyber-cyan animate-pulse" />

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-cyber-void border border-cyber-magenta rounded-xl shadow-magenta-glow mb-3">
          <Key className="w-6 h-6 text-cyber-magenta" />
        </div>
        <h2 className="font-cyber text-2xl font-black text-white uppercase tracking-wider">
          REDEFINIR <span className="text-cyber-magenta">SENHA</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Crie uma nova senha forte criptografada.</p>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs font-bold mb-4 flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-green-950/80 border border-green-500 text-green-400"
              : "bg-red-950/80 border border-red-500 text-red-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {feedback?.type === "success" ? (
        <div className="text-center space-y-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 bg-cyber-cyan hover:bg-cyan-400 text-cyber-void font-cyber font-bold text-xs tracking-wider rounded-lg shadow-cyan-glow transition-all gap-2"
          >
            IR PARA O LOGIN <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-[11px] text-slate-400 uppercase font-bold mb-1 block">NOVA SENHA</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-void border border-cyber-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-magenta"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 uppercase font-bold mb-1 block">CONFIRMAR NOVA SENHA</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-cyber-void border border-cyber-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-magenta"
            />
          </div>

          {/* REQUISITOS DA SENHA FORTE CHECKLIST */}
          <div className="bg-cyber-void p-3 rounded-lg border border-cyber-border text-[10px] space-y-1">
            <span className="text-slate-400 font-bold block mb-1">REQUISITOS DA SENHA:</span>
            <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-green-400" : "text-slate-500"}`}>
              <span>{hasMinLength ? "✓" : "○"}</span> Mínimo de 8 caracteres
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-green-400" : "text-slate-500"}`}>
              <span>{hasUppercase ? "✓" : "○"}</span> Pelo menos uma letra maiúscula (A-Z)
            </div>
            <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-green-400" : "text-slate-500"}`}>
              <span>{hasLowercase ? "✓" : "○"}</span> Pelo menos uma letra minúscula (a-z)
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? "text-green-400" : "text-slate-500"}`}>
              <span>{hasNumber ? "✓" : "○"}</span> Pelo menos um número (0-9)
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-green-400" : "text-slate-500"}`}>
              <span>{passwordsMatch ? "✓" : "○"}</span> Senhas coincidem
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-3 font-cyber font-bold text-xs tracking-wider rounded-lg shadow-magenta-glow transition-all ${
              isFormValid
                ? "bg-cyber-magenta hover:bg-cyber-magenta/80 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "REDEFINIR SENHA AGORA"}
          </button>
        </form>
      )}

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-cyber-void flex items-center justify-center p-4 font-mono">
      <Suspense fallback={<div className="text-white text-xs">Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
