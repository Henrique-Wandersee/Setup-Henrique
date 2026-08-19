"use client";

import { useState, useEffect } from "react";
import { Cpu, Zap, ShieldAlert, Sparkles, Clock, Flame, Server, Award, ChevronRight } from "lucide-react";

export default function HeroQuantumStorm() {
  // Countdown Timer State (Simulated 4 Days, 12 Hours, 38 Mins, 19 Secs)
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 12,
    minutes: 38,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative w-full py-12 md:py-20 bg-cyber-void overflow-hidden border-b border-cyber-cyan/20">
      
      {/* BACKGROUND CIRCUIT PATTERNS & GLOWING AMBIENT */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:35px_35px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyber-magenta/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: TITLE & SPECS & COUNTDOWN */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cyan/40 shadow-neon-box">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest uppercase">
              SORTEIO OFICIAL DO MÊS #042
            </span>
          </div>

          {/* GLITCH TITLE */}
          <div className="relative">
            <h1 className="font-cyber text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              ELITE GAMER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-magenta filter drop-shadow-[0_0_20px_rgba(0,243,255,0.6)]">
                SETUPS RAFFLE
              </span>
            </h1>
            <p className="font-mono text-sm sm:text-base text-slate-300 max-w-xl mt-3">
              Concorra ao soberano <strong className="text-cyber-cyan font-bold">THE QUANTUM STORM</strong>.
              Equipado com a poderosa RTX 4090 24GB, i9-14900KS e sistema de refrigeração líquida customizada com fluído neon reagente a luz UV.
            </p>
          </div>

          {/* HOLOGRAPHIC COUNTDOWN TIMER */}
          <div className="bg-cyber-card/90 border border-cyber-cyan/50 p-4 rounded-xl shadow-cyan-glow relative backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-cyber-border pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan">
                <Clock className="w-4 h-4 animate-spin text-cyber-cyan" style={{ animationDuration: "10s" }} />
                <span>ENCERRAMENTO DO SORTEIO EM:</span>
              </div>
              <span className="text-[10px] font-mono text-cyber-magenta bg-cyber-magenta/10 px-2 py-0.5 rounded border border-cyber-magenta/30">
                SORTEIO VIA LOTERIA FEDERAL
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="bg-cyber-void/80 border border-cyber-cyan/30 p-2 rounded">
                <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.days).padStart(2, "0")}</div>
                <div className="text-[10px] text-cyber-cyan">DIAS</div>
              </div>
              <div className="bg-cyber-void/80 border border-cyber-cyan/30 p-2 rounded">
                <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, "0")}</div>
                <div className="text-[10px] text-cyber-cyan">HORAS</div>
              </div>
              <div className="bg-cyber-void/80 border border-cyber-cyan/30 p-2 rounded">
                <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, "0")}</div>
                <div className="text-[10px] text-cyber-cyan">MINUTOS</div>
              </div>
              <div className="bg-cyber-void/80 border border-cyber-magenta/50 p-2 rounded">
                <div className="text-2xl sm:text-3xl font-black text-cyber-magenta animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-cyber-magenta">SEGUNDOS</div>
              </div>
            </div>
          </div>

          {/* GAMIFIED SPECIFICATION BARS */}
          <div className="space-y-3 bg-cyber-card/60 border border-cyber-border p-4 rounded-xl font-mono text-xs">
            <div className="flex justify-between text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1.5 text-cyber-cyan">
                <Zap className="w-4 h-4" /> GRAPHICS [||||||||||] 100%
              </span>
              <span className="text-white">NVIDIA RTX 4090 24GB</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-cyber-cyan/30">
              <div className="bg-gradient-to-r from-cyber-cyan to-blue-500 h-full w-[100%] shadow-cyan-glow" />
            </div>

            <div className="flex justify-between text-slate-300 font-bold mb-1 pt-1">
              <span className="flex items-center gap-1.5 text-cyber-magenta">
                <Cpu className="w-4 h-4" /> CPU [||||||||| ] 90%
              </span>
              <span className="text-white">Intel Core i9-14900KS 6.2GHz</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-cyber-magenta/30">
              <div className="bg-gradient-to-r from-cyber-magenta to-purple-600 h-full w-[90%] shadow-magenta-glow" />
            </div>

            <div className="flex justify-between text-slate-300 font-bold mb-1 pt-1">
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Server className="w-4 h-4" /> RAM & STORAGE [||||||||||] 100%
              </span>
              <span className="text-white">64GB DDR5 7200MHz + 4TB Gen5 SSD</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-yellow-500/30">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-600 h-full w-[100%]" />
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#raffle-grid"
              className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-cyber-void font-cyber font-black text-sm tracking-wider rounded-lg shadow-cyan-glow transition-all hover:scale-105 flex items-center gap-2"
            >
              GARANTIR SEU NÚMERO (R$ 15,00) <ChevronRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Flame className="w-4 h-4 text-cyber-magenta animate-bounce" />
              <span>784 / 1000 NÚMEROS COMPRADOS</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 3D CYBER SETUP SHOWCASE */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* FLOATING PEDESTAL EFFECT */}
          <div className="relative w-full max-w-md aspect-square rounded-2xl bg-cyber-card/80 border-2 border-cyber-cyan/40 shadow-cyan-glow p-6 flex flex-col items-center justify-between overflow-hidden animate-hologram-float">
            
            {/* DIGITAL SMOKE & LASER BG EFFECT */}
            <div className="absolute inset-0 bg-hexagon-pattern opacity-30 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-pulse" />
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-magenta to-transparent animate-pulse" />

            {/* TOP HEADER BADGE */}
            <div className="w-full flex items-center justify-between border-b border-cyber-border pb-3 relative z-10 font-mono">
              <div className="flex items-center gap-1.5 text-xs text-cyber-cyan font-bold">
                <Sparkles className="w-4 h-4 text-cyber-cyan" /> SETUP RIG 3D
              </div>
              <span className="text-[10px] bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded border border-cyber-cyan/40">
                HOLOGRAM ACTIVE
              </span>
            </div>

            {/* RENDER IMAGE CONTAINER WITH NEON HIGHLIGHTS */}
            <div className="relative w-full h-56 my-2 rounded-xl overflow-hidden border border-cyber-cyan/30 bg-cyber-void flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80"
                alt="Quantum Storm PC Setup"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-void via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-3 left-3 right-3 text-left font-mono">
                <span className="text-[10px] bg-cyber-magenta text-white font-bold px-2 py-0.5 rounded uppercase">
                  PRÊMIO PRINCIPAL
                </span>
                <h3 className="text-sm font-bold text-white mt-1 drop-shadow-md">
                  THE QUANTUM STORM RIG
                </h3>
              </div>
            </div>

            {/* PEDESTAL BASE STATS */}
            <div className="w-full bg-cyber-void/90 border border-cyber-cyan/30 rounded-lg p-3 grid grid-cols-2 gap-2 text-center font-mono text-[11px] relative z-10">
              <div className="border-r border-cyber-border pr-2">
                <div className="text-slate-400">VALOR ESTIMADO</div>
                <div className="text-cyber-cyan font-bold text-sm">R$ 28.500,00</div>
              </div>
              <div>
                <div className="text-slate-400">FRETE GRÁTIS</div>
                <div className="text-cyber-magenta font-bold text-sm">TODO O BRASIL</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
