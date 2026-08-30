"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Cpu, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setStatus({ type: "error", message: "Nenhum token de verificação foi fornecido na URL." });
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus({ type: "success", message: data.message });
        } else {
          setStatus({ type: "error", message: data.error || "Falha ao verificar e-mail." });
        }
      } catch (err: any) {
        setStatus({ type: "error", message: "Erro de conexão ao servidor." });
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md bg-cyber-card border-2 border-cyber-cyan/50 rounded-2xl shadow-cyan-glow p-6 sm:p-8 text-center relative overflow-hidden">
      
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyber-cyan via-white to-cyber-magenta animate-pulse" />

      <div className="inline-flex items-center justify-center w-12 h-12 bg-cyber-void border border-cyber-cyan rounded-xl shadow-cyan-glow mb-4">
        <Cpu className="w-6 h-6 text-cyber-cyan animate-pulse" />
      </div>

      <h2 className="font-cyber text-2xl font-black text-white uppercase tracking-wider mb-2">
        VERIFICAÇÃO DE <span className="text-cyber-cyan">E-MAIL</span>
      </h2>

      {loading ? (
        <div className="py-8 space-y-3">
          <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Validando o token de segurança no servidor...</p>
        </div>
      ) : status?.type === "success" ? (
        <div className="py-6 space-y-4">
          <div className="w-12 h-12 bg-green-950/80 border border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs text-green-400 font-bold">{status.message}</p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-cyan hover:bg-cyan-400 text-cyber-void font-cyber font-bold text-xs tracking-wider rounded-lg shadow-cyan-glow transition-all mt-4"
          >
            IR PARA O LOGIN <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="py-6 space-y-4">
          <div className="w-12 h-12 bg-red-950/80 border border-red-500 rounded-full flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-xs text-red-400 font-bold">{status?.message}</p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-card border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 font-cyber font-bold text-xs tracking-wider rounded-lg transition-all mt-4"
          >
            VOLTAR À PÁGINA INICIAL
          </Link>
        </div>
      )}

    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-cyber-void flex items-center justify-center p-4 font-mono">
      <Suspense fallback={<div className="text-white text-xs">Carregando...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
