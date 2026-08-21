"use client";

import { useState, useEffect } from "react";
import { Cpu, Zap, Clock, Flame, Server, ChevronRight, Sparkles } from "lucide-react";

export default function HeroQuantumStorm() {
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 15,
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
    <section id="hero" className="relative w-full py-12 md:py-20 bg-rockstar-black overflow-hidden border-b border-rockstar-yellow/40 font-vice">
      
      {/* FULL BRIGHTNESS HD BACKGROUND IMAGE - ZERO MATTE OVERLAY */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none transition-all duration-300"
        style={{ backgroundImage: "url('/images/vice_city_bg.jpg')" }}
      />
      
      {/* SOFT VIGNETTE JUST FOR EDGE PROTECTION */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: ROCKSTAR TYPOGRAPHY, COUNTDOWN & SPECS */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rockstar-black/90 border border-rockstar-yellow shadow-rockstar-glow backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rockstar-yellow animate-ping" />
            <span className="font-mono text-xs text-rockstar-yellow font-black tracking-widest uppercase">
              SORTEIO OFICIAL HENRIQUE SETUP — 100 BILHETES
            </span>
          </div>

          {/* ROCKSTAR BOLD TITLE WITH ULTRA SHARP TEXT SHADOWS */}
          <div className="relative">
            <h1 className="font-cyber text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight [text-shadow:_0_4px_16px_rgba(0,0,0,0.9)]">
              HENRIQUE SETUP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rockstar-yellow via-white to-vice-sunset filter drop-shadow-[0_0_20px_rgba(253,184,19,0.9)]">
                PC GAMER R* EDITION
              </span>
            </h1>
            <p className="font-vice text-base sm:text-lg text-slate-100 max-w-xl mt-3 leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              Concorra ao incrível <strong className="text-rockstar-yellow font-bold">PC GAMER ENTHUSIAST CUSTOM</strong>.
              Equipado com a soberana <span className="text-vice-magenta font-bold">RTX 4090 24GB</span>, Intel Core i9-14900KS e sistema de refrigeração líquida customizada Barrow com iluminação RGB sincronizada.
            </p>
          </div>

          {/* VICE CITY HOLOGRAPHIC COUNTDOWN TIMER */}
          <div className="bg-rockstar-black/90 border-2 border-rockstar-yellow p-4 sm:p-5 rounded-xl shadow-rockstar-glow relative backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-rockstar-border pb-2.5 mb-3 font-mono">
              <div className="flex items-center gap-2 text-xs text-rockstar-yellow font-bold">
                <Clock className="w-4 h-4 text-rockstar-yellow animate-spin" style={{ animationDuration: "10s" }} />
                <span>SORTEIO PELA LOTERIA FEDERAL EM:</span>
              </div>
              <span className="text-[11px] font-bold text-black bg-rockstar-yellow px-2.5 py-0.5 rounded shadow-rockstar-glow">
                100 BILHETES NO TOTAL
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="bg-slate-950/90 border border-rockstar-border p-2.5 rounded-lg">
                <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.days).padStart(2, "0")}</div>
                <div className="text-[10px] text-slate-400 font-bold">DIAS</div>
              </div>
              <div className="bg-slate-950/90 border border-rockstar-border p-2.5 rounded-lg">
                <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, "0")}</div>
                <div className="text-[10px] text-slate-400 font-bold">HORAS</div>
              </div>
              <div className="bg-slate-950/90 border border-rockstar-border p-2.5 rounded-lg">
                <div className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, "0")}</div>
                <div className="text-[10px] text-slate-400 font-bold">MINUTOS</div>
              </div>
              <div className="bg-slate-950/90 border border-rockstar-yellow/80 p-2.5 rounded-lg">
                <div className="text-2xl sm:text-3xl font-black text-rockstar-yellow animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-rockstar-yellow font-bold">SEGUNDOS</div>
              </div>
            </div>
          </div>

          {/* HARDWARE SPECIFICATIONS SUMMARY */}
          <div id="specs" className="space-y-3 bg-rockstar-black/90 border border-rockstar-border p-4 rounded-xl font-mono text-xs backdrop-blur-md">
            <div className="flex justify-between text-slate-200 font-bold mb-1">
              <span className="flex items-center gap-1.5 text-rockstar-yellow">
                <Zap className="w-4 h-4 text-rockstar-yellow" /> PLACA DE VÍDEO
              </span>
              <span className="text-white">NVIDIA GeForce RTX 4090 24GB GDDR6X</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-rockstar-yellow/40">
              <div className="bg-gradient-to-r from-rockstar-yellow to-vice-sunset h-full w-[100%] shadow-rockstar-glow" />
            </div>

            <div className="flex justify-between text-slate-200 font-bold mb-1 pt-1">
              <span className="flex items-center gap-1.5 text-vice-magenta">
                <Cpu className="w-4 h-4 text-vice-magenta" /> PROCESSADOR
              </span>
              <span className="text-white">Intel Core i9-14900KS 6.2GHz Unlocked</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-vice-magenta/40">
              <div className="bg-gradient-to-r from-vice-magenta to-vice-purple h-full w-[95%] shadow-magenta-glow" />
            </div>

            <div className="flex justify-between text-slate-200 font-bold mb-1 pt-1">
              <span className="flex items-center gap-1.5 text-vice-cyan">
                <Server className="w-4 h-4 text-vice-cyan" /> REFRIGERAÇÃO & RAM
              </span>
              <span className="text-white">Water Cooler Custom Liquid Barrow + 64GB DDR5</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-vice-cyan/40">
              <div className="bg-gradient-to-r from-vice-cyan to-blue-500 h-full w-[100%] shadow-cyan-glow" />
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#raffle-grid"
              className="px-8 py-4 bg-rockstar-yellow hover:bg-yellow-400 text-black font-cyber font-black text-sm tracking-wider rounded-lg shadow-rockstar-glow transition-all hover:scale-105 flex items-center gap-2 uppercase"
            >
              ESCOLHER SEU NÚMERO (R$ 15,00) <ChevronRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-rockstar-black/90 border border-rockstar-border px-3 py-2 rounded-lg backdrop-blur-md">
              <Flame className="w-4 h-4 text-vice-magenta animate-bounce" />
              <span className="font-bold text-white">100 BILHETES DISPONÍVEIS</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PC GAMER USER IMAGE DISPLAY */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          <div className="relative w-full max-w-md bg-rockstar-black/95 border-2 border-rockstar-yellow rounded-2xl shadow-rockstar-glow p-4 flex flex-col items-center justify-between overflow-hidden backdrop-blur-md">
            
            <div className="w-full flex items-center justify-between border-b border-rockstar-border pb-3 mb-3 relative z-10 font-mono">
              <div className="flex items-center gap-1.5 text-xs text-rockstar-yellow font-bold uppercase">
                <Sparkles className="w-4 h-4 text-rockstar-yellow" /> FOTO REAL DO SETUP
              </div>
              <span className="text-[10px] bg-rockstar-yellow text-black font-black px-2.5 py-0.5 rounded uppercase">
                PRÊMIO PRINCIPAL
              </span>
            </div>

            {/* USER'S PC GAMER IMAGE */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-rockstar-yellow bg-black group shadow-2xl">
              <img
                src="/images/pc_gamer.jpg"
                alt="PC Gamer Henrique Setup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 text-left font-mono">
                <span className="text-[10px] bg-rockstar-yellow text-black font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  HENRIQUE SETUP
                </span>
                <h3 className="text-sm font-black text-white mt-1 drop-shadow-lg uppercase">
                  CUSTOM LIQUID COOLING RIG
                </h3>
              </div>
            </div>

            {/* STATS BASE */}
            <div className="w-full bg-slate-950 border border-rockstar-border rounded-lg p-3 grid grid-cols-2 gap-2 text-center font-mono text-[11px] mt-3">
              <div className="border-r border-rockstar-border pr-2">
                <div className="text-slate-400">VALOR AVALIADO</div>
                <div className="text-rockstar-yellow font-bold text-sm">R$ 28.500,00</div>
              </div>
              <div>
                <div className="text-slate-400">ENTREGA SEGURA</div>
                <div className="text-vice-magenta font-bold text-sm">FRETE GRÁTIS</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
