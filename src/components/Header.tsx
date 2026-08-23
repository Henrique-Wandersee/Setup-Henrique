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
      <div className="bg-gradient-to-r from-vice-purple via-vice-magenta to-vice-sunset text-white py-1 px-2 text-center font-mono text-[10px] sm:text-[11px] font-bold tracking-wider sm:tracking-widest uppercase flex items-center justify-center gap-1.5 sm:gap-2 shadow-vice-glow leading-tight">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-rockstar-yellow shrink-0" />
        <span className="truncate sm:whitespace-normal">SORTEIO EXCLUSIVO HENRIQUE SETUP — 1.000 BILHETES (R$ 30,00 CADA)</span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-rockstar-yellow shrink-0" />
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2">
        
        {/* BRAND LOGO: HENRIQUE SETUP */}
        <a href="#" className="flex items-center space-x-2 sm:space-x-3 group shrink">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-rockstar-yellow border-2 border-white rounded-md shadow-rockstar-glow group-hover:scale-105 transition-all shrink-0">
            <span className="font-cyber font-black text-black text-lg sm:text-xl leading-none tracking-tighter">H</span>
            <span className="absolute top-0.5 right-0.5 font-bold text-black text-[10px] sm:text-xs">★</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-mono text-[9px] sm:text-[10px] text-rockstar-yellow tracking-wider uppercase font-bold truncate">
                EDITION #001
              </span>
              <span className="bg-vice-magenta/20 text-vice-magenta text-[8px] sm:text-[9px] font-mono font-bold px-1 sm:px-1.5 py-0.2 rounded border border-vice-magenta/40 shrink-0">
                1.000 VAGAS
              </span>
            </div>
            <h1 className="font-cyber text-sm sm:text-lg md:text-xl font-black tracking-wider text-white group-hover:text-rockstar-yellow transition-colors uppercase leading-tight truncate">
              HENRIQUE<span className="text-vice-magenta">SETUP</span>
            </h1>
          </div>
        </a>

        {/* ROCKSTAR NAVIGATION LINKS (DESKTOP) */}
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

        {/* USER PROFILE CARD OR AUTH BUTTONS (RESPONSIVE MOBILE FIT) */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-rockstar-card border border-vice-magenta/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-vice-glow font-mono">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border-2 border-rockstar-yellow overflow-hidden bg-slate-900 flex items-center justify-center text-[11px] sm:text-xs font-bold text-rockstar-yellow shrink-0">
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
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono shrink-0">
              <button
                onClick={() => onOpenAuth("login")}
                className="text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded border border-slate-600 text-slate-200 hover:border-white transition-all flex items-center gap-1 uppercase shrink-0"
              >
                <Lock className="w-3 h-3" /> LOGIN
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-4 sm:py-1.5 rounded bg-rockstar-yellow hover:bg-yellow-400 text-black shadow-rockstar-glow transition-all flex items-center gap-1 uppercase tracking-wider shrink-0"
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
