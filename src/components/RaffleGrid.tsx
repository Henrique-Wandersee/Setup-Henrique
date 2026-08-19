"use client";

import { useState, useMemo } from "react";
import { Terminal, Cpu, Zap, CheckCircle, RefreshCw, ShoppingCart, Filter, Search } from "lucide-react";

export interface TicketItem {
  number: number;
  status: "AVAILABLE" | "RESERVED" | "PAID";
}

interface RaffleGridProps {
  tickets: TicketItem[];
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  onAutoHackSelect: (count: number) => void;
  onClearSelection: () => void;
  onProceedToCheckout: () => void;
  ticketPrice: number;
}

export default function RaffleGrid({
  tickets,
  selectedNumbers,
  onToggleNumber,
  onAutoHackSelect,
  onClearSelection,
  onProceedToCheckout,
  ticketPrice,
}: RaffleGridProps) {
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "PAID">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filter === "AVAILABLE" && t.status !== "AVAILABLE") return false;
      if (filter === "PAID" && t.status !== "PAID") return false;
      if (searchTerm && !String(t.number).includes(searchTerm)) return false;
      return true;
    });
  }, [tickets, filter, searchTerm]);

  const totalAmount = selectedNumbers.length * ticketPrice;

  return (
    <section id="raffle-grid" className="w-full py-16 bg-cyber-void relative">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* SECTION TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-cyber-cyan/20">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan">
              <Terminal className="w-4 h-4" /> SELETOR DE NÚMEROS QUANTUM
            </div>
            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1">
              RAFFLE NUMBER <span className="text-cyber-cyan">GRID</span>
            </h2>
          </div>

          {/* STATUS LEGEND */}
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyber-card border border-cyber-cyan shadow-cyan-glow" />
              <span className="text-cyber-cyan">LIVRE (DISPONÍVEL)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyber-magenta border border-cyber-magenta shadow-magenta-glow animate-pulse" />
              <span className="text-cyber-magenta font-bold">SELECIONADO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 text-red-500 font-bold text-center leading-none">
                ×
              </span>
              <span className="text-slate-400">VENDIDO</span>
            </div>
          </div>
        </div>

        {/* CONTROLS: FILTERS & AUTO-HACK BUTTONS */}
        <div className="bg-cyber-card/90 border border-cyber-border p-4 rounded-xl mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 font-mono">
          
          {/* SEARCH & FILTER TABS */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar nº..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cyber-void border border-cyber-border rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div className="flex items-center bg-cyber-void rounded border border-cyber-border p-1">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  filter === "ALL" ? "bg-cyber-cyan text-cyber-void font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                TODOS (1000)
              </button>
              <button
                onClick={() => setFilter("AVAILABLE")}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  filter === "AVAILABLE" ? "bg-cyber-cyan text-cyber-void font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                LIVRES
              </button>
              <button
                onClick={() => setFilter("PAID")}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  filter === "PAID" ? "bg-cyber-cyan text-cyber-void font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                VENDIDOS
              </button>
            </div>
          </div>

          {/* AUTO-HACK QUICK SELECT BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyber-yellow" /> AUTO-SELEÇÃO:
            </span>
            <button
              onClick={() => onAutoHackSelect(5)}
              className="px-3 py-1.5 bg-cyber-card border border-cyber-cyan/60 hover:bg-cyber-cyan/20 text-cyber-cyan text-xs font-bold rounded shadow-neon-box transition-all"
            >
              AUTO-HACK (5 CARGAS)
            </button>
            <button
              onClick={() => onAutoHackSelect(10)}
              className="px-3 py-1.5 bg-cyber-card border border-cyber-cyan/60 hover:bg-cyber-cyan/20 text-cyber-cyan text-xs font-bold rounded shadow-neon-box transition-all"
            >
              AUTO-HACK (10 CARGAS)
            </button>
            <button
              onClick={() => onAutoHackSelect(25)}
              className="px-3 py-1.5 bg-cyber-magenta/20 border border-cyber-magenta hover:bg-cyber-magenta text-cyber-magenta hover:text-white text-xs font-bold rounded shadow-magenta-glow transition-all"
            >
              SURPRESA (25 CARGAS)
            </button>
          </div>

        </div>

        {/* TICKET NUMBERS GRID CONTAINER */}
        <div className="bg-cyber-void/80 border border-cyber-border rounded-2xl p-4 sm:p-6 max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {filteredTickets.map((ticket) => {
              const isSelected = selectedNumbers.includes(ticket.number);
              const isSold = ticket.status === "PAID";
              const isReserved = ticket.status === "RESERVED";

              return (
                <button
                  key={ticket.number}
                  disabled={isSold}
                  onClick={() => onToggleNumber(ticket.number)}
                  className={`relative aspect-square flex flex-col items-center justify-center font-mono text-xs sm:text-sm font-bold rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-cyber-magenta text-white border-cyber-magenta shadow-magenta-glow scale-105 animate-pulse z-10"
                      : isSold
                      ? "bg-slate-900/90 border-slate-800 text-slate-600 cursor-not-allowed"
                      : isReserved
                      ? "bg-amber-950/40 border-amber-600/50 text-amber-400 cursor-not-allowed"
                      : "bg-cyber-card/70 border-cyber-cyan/30 text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/10 hover:scale-105 shadow-neon-box"
                  }`}
                >
                  <span>{ticket.number}</span>

                  {/* OVERLAY FOR SOLD NUMBERS */}
                  {isSold && (
                    <span className="absolute inset-0 flex items-center justify-center text-red-500/80 font-black text-lg select-none">
                      ✕
                    </span>
                  )}

                  {/* INDICATOR FOR RESERVED NUMBERS */}
                  {isReserved && !isSelected && (
                    <span className="absolute bottom-1 text-[8px] text-amber-500 font-normal">RES</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FLOATING CART BAR */}
        {selectedNumbers.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl bg-cyber-card/95 border-2 border-cyber-magenta p-4 rounded-2xl shadow-magenta-glow backdrop-blur-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-short">
            <div className="flex items-center gap-3 font-mono">
              <div className="w-10 h-10 rounded-xl bg-cyber-magenta/20 border border-cyber-magenta flex items-center justify-center text-cyber-magenta font-bold">
                {selectedNumbers.length}
              </div>
              <div>
                <div className="text-xs text-slate-300">
                  NÚMEROS: <strong className="text-cyber-magenta font-bold">{selectedNumbers.join(", ")}</strong>
                </div>
                <div className="text-base font-bold text-white">
                  TOTAL: <span className="text-cyber-cyan">R$ {totalAmount.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClearSelection}
                className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
              >
                LIMPAR
              </button>
              <button
                onClick={onProceedToCheckout}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-cyber-magenta to-purple-600 hover:from-cyber-magenta/80 hover:to-purple-500 text-white font-cyber font-bold text-xs tracking-wider rounded-lg shadow-magenta-glow transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> AVANÇAR PARA PIX
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
