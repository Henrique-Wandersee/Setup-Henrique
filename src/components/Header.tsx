"use client";

import { Cpu, User, Lock, LogOut, Terminal, Sparkles, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  onOpenAuth: (mode: "login" | "register" | "forgot") => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-40 w-full bg-rockstar-black/95 backdrop-blur-md border-b border-vice-magenta/30 font-vice">
      
      {/* ROCKSTAR GAMES STYLE TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-vice-purple via-vice-magenta to-vice-sunset text-white py-1 px-4 text-center font-mono text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-vice-glow">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-rockstar-yellow" />
        <span>SORTEIO EXCLUSIVO HENRIQUE SETUP — 1.000 BILHETES (R$ 30,00 CADA)</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-rockstar-yellow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        
        {/* BRAND LOGO: HENRIQUE SETUP */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 bg-rockstar-yellow border-2 border-white rounded-md shadow-rockstar-glow group-hover:scale-105 transition-all">
            <span className="font-cyber font-black text-black text-xl leading-none tracking-tighter">H</span>
            <span className="absolute top-0.5 right-0.5 font-bold text-black text-xs">★</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] text-rockstar-yellow tracking-widest uppercase font-bold">
                EDITION #001
              </span>
              <span className="bg-vice-magenta/20 text-vice-magenta text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-vice-magenta/40">
                1.000 VAGAS
              </span>
            </div>
            <h1 className="font-cyber text-lg md:text-xl font-black tracking-wider text-white group-hover:text-rockstar-yellow transition-colors uppercase">
              HENRIQUE<span className="text-vice-magenta">SETUP</span>
            </h1>
          </div>
        </a>

        {/* ROCKSTAR NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest text-slate-300 uppercase font-bold">
          <a href="#hero" className="hover:text-rockstar-yellow transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-rockstar-yellow">
            VISÃO GERAL
          </a>
          <a href="#raffle-grid" className="hover:text-vice-magenta transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-vice-magenta">
            BILHETES (1.000)
          </a>
          <a href="#specs" className="hover:text-rockstar-yellow transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-rockstar-yellow">
            ESPECIFICAÇÕES
          </a>
        </nav>

        {/* USER PROFILE CARD OR AUTH BUTTONS */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3 bg-rockstar-card border border-vice-magenta/50 px-3 py-1.5 rounded-lg shadow-vice-glow font-mono">
              <div className="w-8 h-8 rounded-md border-2 border-rockstar-yellow overflow-hidden bg-slate-900 flex items-center justify-center text-xs font-bold text-rockstar-yellow">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "HS"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-none">{user.name || "Henrique"}</div>
                <div className="text-[10px] text-vice-magenta font-bold mt-0.5">CONTA VERIFICADA</div>
              </div>
              <button
                onClick={() => signOut()}
                title="Sair"
                className="p-1 hover:text-vice-magenta text-slate-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={() => onOpenAuth("login")}
                className="text-xs font-bold px-3 py-1.5 rounded border border-slate-600 text-slate-200 hover:border-white transition-all flex items-center gap-1.5 uppercase"
              >
                <Lock className="w-3 h-3" /> LOGIN
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="text-xs font-bold px-4 py-1.5 rounded bg-rockstar-yellow hover:bg-yellow-400 text-black shadow-rockstar-glow transition-all flex items-center gap-1.5 uppercase tracking-wider"
              >
                <User className="w-3 h-3" /> CADASTRAR
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
