"use client";

import { useState } from "react";
import { X, Lock, Mail, User, Key, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { registerUserAction, requestPasswordResetAction } from "@/app/actions/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (mode === "login") {
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setFeedback({ type: "error", text: res.error });
        } else {
          setFeedback({ type: "success", text: "Login efetuado com sucesso! Redirecionando..." });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1000);
        }
      } else if (mode === "register") {
        const res = await registerUserAction(formData);
        if (res.success) {
          setFeedback({ type: "success", text: res.message });
          setTimeout(() => setMode("login"), 1500);
        } else {
          setFeedback({ type: "error", text: res.message });
        }
      } else if (mode === "forgot") {
        const res = await requestPasswordResetAction(formData.email);
        if (res.success) {
          setFeedback({ type: "success", text: res.message });
        } else {
          setFeedback({ type: "error", text: res.message });
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Erro inesperado. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-void/90 backdrop-blur-md animate-fade-in font-mono">
      
      <div className="relative w-full max-w-md bg-cyber-card border-2 border-cyber-cyan/50 rounded-2xl shadow-cyan-glow p-6 sm:p-8 overflow-hidden">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-cyber-void transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER & TABS */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-cyber-void border border-cyber-cyan rounded-xl shadow-cyan-glow mb-3">
            <Lock className="w-6 h-6 text-cyber-cyan" />
          </div>
          <h3 className="font-cyber text-2xl font-black text-white tracking-wider">
            {mode === "login" && "SISTEMA DE AUTENTICAÇÃO"}
            {mode === "register" && "CRIAR CONTA QUANTUM"}
            {mode === "forgot" && "RECUPERAÇÃO DE SENHA"}
          </h3>

          {mode !== "forgot" && (
            <div className="flex justify-center gap-2 mt-4 bg-cyber-void p-1 rounded-lg border border-cyber-border">
              <button
                type="button"
                onClick={() => { setMode("login"); setFeedback(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                  mode === "login" ? "bg-cyber-cyan text-cyber-void shadow-cyan-glow" : "text-slate-400 hover:text-white"
                }`}
              >
                ENTRAR
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setFeedback(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                  mode === "register" ? "bg-cyber-magenta text-white shadow-magenta-glow" : "text-slate-400 hover:text-white"
                }`}
              >
                CADASTRAR
              </button>
            </div>
          )}
        </div>

        {/* FEEDBACK ALERT */}
        {feedback && (
          <div
            className={`p-3 rounded-lg text-xs font-bold mb-4 flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-green-950/80 border border-green-500 text-green-400"
                : "bg-red-950/80 border border-red-500 text-red-400"
            }`}
          >
            {feedback.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* FORM FIELDS */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === "register" && (
            <div>
              <label className="text-[11px] text-slate-400 uppercase font-bold mb-1 block">NOME / APELIDO CYBER</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: NEXUS_RIDER"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-cyber-void border border-cyber-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-400 uppercase font-bold mb-1 block">E-MAIL</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-cyber-void border border-cyber-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-slate-400 uppercase font-bold">SENHA</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setFeedback(null); }}
                    className="text-[10px] text-cyber-cyan hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-cyber-void border border-cyber-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 font-cyber font-bold text-xs tracking-wider rounded-lg shadow-cyan-glow transition-all ${
              mode === "register"
                ? "bg-cyber-magenta hover:bg-cyber-magenta/80 text-white shadow-magenta-glow"
                : "bg-cyber-cyan hover:bg-cyan-400 text-cyber-void"
            }`}
          >
            {loading
              ? "PROCESSANDO..."
              : mode === "login"
              ? "ENTRAR NA PLATAFORMA"
              : mode === "register"
              ? "CRIAR CONTA AGORA"
              : "ENVIAR LINK DE RECUPERAÇÃO"}
          </button>
        </form>

        {mode === "forgot" && (
          <button
            onClick={() => { setMode("login"); setFeedback(null); }}
            className="w-full mt-4 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Login
          </button>
        )}

      </div>
    </div>
  );
}
