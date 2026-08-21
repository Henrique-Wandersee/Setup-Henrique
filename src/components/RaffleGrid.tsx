"use client";

import { useState, useMemo } from "react";
import { Terminal, Zap, ShoppingCart, Search } from "lucide-react";

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

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filter === "AVAILABLE" && t.status !== "AVAILABLE") return false;
      if (filter === "PAID" && t.status !== "PAID") return false;
      if (searchTerm && !String(t.number).includes(searchTerm)) return false;
      return true;
    });
  }, [tickets, filter, searchTerm]);

  // Regra de Valor: R$ 30,00 por bilhete
  const totalAmount = selectedNumbers.length * ticketPrice;

  return (
    <section id="raffle-grid" className="w-full py-16 bg-rockstar-black relative font-vice border-t border-rockstar-border">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* SECTION TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-rockstar-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rockstar-yellow font-bold uppercase">
              <Terminal className="w-4 h-4 text-rockstar-yellow" /> SELETOR DE BILHETES (1 A 1.000)
            </div>
            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1">
              SELEÇÃO DE <span className="text-vice-magenta">BILHETES</span>
            </h2>
          </div>

          {/* STATUS LEGEND */}
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-rockstar-card border-2 border-slate-600" />
              <span className="text-slate-300">DISPONÍVEL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-vice-magenta border-2 border-white shadow-magenta-glow animate-pulse" />
              <span className="text-vice-magenta font-bold">SELECIONADO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800 text-red-500 font-bold text-center leading-none">
                ×
              </span>
              <span className="text-slate-500">COMPRADO (INDISPONÍVEL)</span>
            </div>
          </div>
        </div>

        {/* CONTROLS: FILTERS & QUICK SELECT BUTTONS */}
        <div className="bg-rockstar-card border border-rockstar-border p-4 rounded-xl mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 font-mono">
          
          {/* SEARCH & FILTER TABS */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar nº 1 a 1000..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-rockstar-black border border-rockstar-border rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rockstar-yellow"
              />
            </div>

            <div className="flex items-center bg-rockstar-black rounded border border-rockstar-border p-1">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1 text-xs rounded transition-all font-bold ${
                  filter === "ALL" ? "bg-rockstar-yellow text-black" : "text-slate-400 hover:text-white"
                }`}
              >
                TODOS (1.000)
              </button>
              <button
                onClick={() => setFilter("AVAILABLE")}
                className={`px-3 py-1 text-xs rounded transition-all font-bold ${
                  filter === "AVAILABLE" ? "bg-rockstar-yellow text-black" : "text-slate-400 hover:text-white"
                }`}
              >
                DISPONÍVEIS
              </button>
              <button
                onClick={() => setFilter("PAID")}
                className={`px-3 py-1 text-xs rounded transition-all font-bold ${
                  filter === "PAID" ? "bg-rockstar-yellow text-black" : "text-slate-400 hover:text-white"
                }`}
              >
                COMPRADOS
              </button>
            </div>
          </div>

          {/* QUICK SELECTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-rockstar-yellow" /> RÁPIDO:
            </span>
            <button
              onClick={() => onAutoHackSelect(5)}
              className="px-3 py-1.5 bg-rockstar-black border border-rockstar-yellow hover:bg-rockstar-yellow hover:text-black text-rockstar-yellow text-xs font-bold rounded transition-all"
            >
              +5 NÚMEROS
            </button>
            <button
              onClick={() => onAutoHackSelect(10)}
              className="px-3 py-1.5 bg-rockstar-black border border-rockstar-yellow hover:bg-rockstar-yellow hover:text-black text-rockstar-yellow text-xs font-bold rounded transition-all"
            >
              +10 NÚMEROS
            </button>
            <button
              onClick={() => onAutoHackSelect(25)}
              className="px-3 py-1.5 bg-vice-magenta/20 border border-vice-magenta hover:bg-vice-magenta text-vice-magenta hover:text-white text-xs font-bold rounded shadow-magenta-glow transition-all"
            >
              +25 NÚMEROS
            </button>
          </div>

        </div>

        {/* 1.000 TICKETS GRID CONTAINER */}
        <div className="bg-rockstar-card border border-rockstar-border rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[550px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 sm:gap-2.5">
            {filteredTickets.map((ticket) => {
              const isSelected = selectedNumbers.includes(ticket.number);
              // REGRA DE NEGÓCIO DA RIFA: O bilhete só fica desabilitado (indisponível) quando for COMPRADO/PAID
              const isSold = ticket.status === "PAID";
              const isReserved = ticket.status === "RESERVED";

              return (
                <button
                  key={ticket.number}
                  disabled={isSold}
                  onClick={() => onToggleNumber(ticket.number)}
                  className={`relative aspect-square flex flex-col items-center justify-center font-mono text-xs sm:text-sm font-black rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-vice-magenta text-white border-white shadow-magenta-glow scale-105 animate-pulse z-10"
                      : isSold
                      ? "bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed"
                      : isReserved
                      ? "bg-amber-950/40 border-amber-600/50 text-amber-400"
                      : "bg-rockstar-black border-rockstar-border text-slate-200 hover:border-rockstar-yellow hover:text-rockstar-yellow hover:scale-105 shadow-md"
                  }`}
                >
                  <span>{ticket.number}</span>

                  {isSold && (
                    <span className="absolute inset-0 flex items-center justify-center text-red-500/80 font-black text-lg select-none">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FLOATING CART BAR */}
        {selectedNumbers.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl bg-rockstar-card/95 border-2 border-vice-magenta p-4 rounded-2xl shadow-vice-glow backdrop-blur-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-short font-mono">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-vice-magenta/20 border border-vice-magenta flex items-center justify-center text-vice-magenta font-black text-lg">
                {selectedNumbers.length}
              </div>
              <div>
                <div className="text-xs text-slate-300">
                  NÚMEROS: <strong className="text-vice-magenta font-bold">{selectedNumbers.join(", ")}</strong>
                </div>
                <div className="text-base font-bold text-white">
                  TOTAL (R$ 30,00 cada): <span className="text-rockstar-yellow">R$ {totalAmount.toFixed(2).replace(".", ",")}</span>
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
                className="flex-1 sm:flex-none px-6 py-3 bg-rockstar-yellow hover:bg-yellow-400 text-black font-cyber font-black text-xs tracking-wider rounded-lg shadow-rockstar-glow transition-all flex items-center justify-center gap-2 uppercase"
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
