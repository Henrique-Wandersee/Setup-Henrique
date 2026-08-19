"use client";

import { useState } from "react";
import { Cpu, ShieldCheck, User, Zap, Lock, LogOut, Terminal, Award } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  onOpenAuth: (mode: "login" | "register" | "forgot") => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-40 w-full bg-cyber-void/90 backdrop-blur-md border-b border-cyber-cyan/20 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO CYBER */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10 bg-cyber-card border border-cyber-cyan rounded-lg shadow-cyan-glow group-hover:scale-105 transition-all">
            <Cpu className="w-6 h-6 text-cyber-cyan animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyber-magenta rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase">ELITE GAMER</span>
              <span className="bg-cyber-magenta/20 text-cyber-magenta text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyber-magenta/40">
                v2.6 LIVE
              </span>
            </div>
            <h1 className="font-cyber text-lg md:text-xl font-bold tracking-wider text-white group-hover:text-cyber-cyan transition-colors">
              QUANTUM<span className="text-cyber-magenta">_RAFFLE</span>
            </h1>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono tracking-widest text-slate-300">
          <a href="#hero" className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-cyber-cyan">
            <Zap className="w-3.5 h-3.5 text-cyber-cyan" /> HUB CENTRAL
          </a>
          <a href="#raffle-grid" className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-cyber-cyan">
            <Terminal className="w-3.5 h-3.5 text-cyber-magenta" /> GRID DE NÚMEROS
          </a>
          <a href="#leaderboard" className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-cyber-cyan">
            <Award className="w-3.5 h-3.5 text-yellow-400" /> LEADERBOARD
          </a>
        </nav>

        {/* USER PROFILE CARD OR AUTH BUTTONS */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3 bg-cyber-card/80 border border-cyber-cyan/40 px-3 py-1.5 rounded-lg shadow-neon-box">
              <div className="relative">
                <div className="w-8 h-8 rounded-full border border-cyber-magenta overflow-hidden bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-cyber-cyan">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "NX"}
                </div>
                <span className="absolute -bottom-1 -right-1 bg-cyber-cyan text-cyber-void text-[9px] font-mono font-bold px-1 rounded-full">
                  L28
                </span>
              </div>
              <div className="hidden sm:block text-left font-mono">
                <div className="text-xs font-bold text-white leading-none">{user.name || "NEXUS_RIDER"}</div>
                <div className="text-[10px] text-cyber-cyan flex items-center gap-1 mt-0.5">
                  <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-cyber-cyan/30">
                    <div className="bg-gradient-to-r from-cyber-cyan to-cyber-magenta h-full w-[85%]" />
                  </div>
                  <span>14,250 XP</span>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                title="Sair da Conta"
                className="p-1 hover:text-cyber-magenta text-slate-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth("login")}
                className="text-xs font-mono font-semibold px-3 py-1.5 rounded border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3" /> LOGIN
              </button>
              <button
                onClick={() => onOpenAuth("register")}
                className="text-xs font-mono font-bold px-3 py-1.5 rounded bg-cyber-magenta hover:bg-cyber-magenta/80 text-white shadow-magenta-glow transition-all flex items-center gap-1.5"
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
