"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroQuantumStorm from "@/components/HeroQuantumStorm";
import RaffleGrid, { TicketItem } from "@/components/RaffleGrid";
import CheckoutModal from "@/components/CheckoutModal";
import Leaderboard from "@/components/Leaderboard";
import AuthModal from "@/components/AuthModal";
import { reserveTicketsAction } from "@/app/actions/tickets";
import { Cpu, ShieldCheck, Zap, Heart, CheckCircle2 } from "lucide-react";

export default function Home() {
  // Generate 1000 tickets simulation (with pre-sold numbers)
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [isReserving, setIsReserving] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    paymentId?: string;
    qrCode?: string;
    qrCodeBase64?: string;
    amount?: number;
    expiresAt?: string;
    ticketNumbers?: number[];
  }>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    // Populate initial tickets 1..1000
    const initial: TicketItem[] = [];
    const soldList = [42, 88, 100, 333, 500, 777, 888, 999];
    const reservedList = [15, 27];

    for (let i = 1; i <= 1000; i++) {
      let status: "AVAILABLE" | "RESERVED" | "PAID" = "AVAILABLE";
      if (soldList.includes(i)) status = "PAID";
      else if (reservedList.includes(i)) status = "RESERVED";

      initial.push({ number: i, status });
    }
    setTickets(initial);
  }, []);

  const handleToggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const handleAutoHackSelect = (count: number) => {
    const availableNumbers = tickets.filter((t) => t.status === "AVAILABLE").map((t) => t.number);
    const shuffled = [...availableNumbers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count).sort((a, b) => a - b);
    setSelectedNumbers(selected);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const handleProceedToCheckout = async () => {
    if (selectedNumbers.length === 0) return;

    setIsReserving(true);
    try {
      // Calls Server Action (Etapa 2: Concurrency Reservation)
      const res = await reserveTicketsAction({
        raffleId: "raffle-quantum-storm-001",
        numbers: selectedNumbers,
        userEmail: "nexus_rider@cybernet.io",
        userName: "NEXUS_RIDER",
      });

      if (res.success && res.qrCode) {
        setCheckoutData({
          paymentId: res.paymentId,
          qrCode: res.qrCode,
          qrCodeBase64: res.qrCodeBase64,
          amount: res.amount,
          expiresAt: res.expiresAt,
          ticketNumbers: res.ticketNumbers,
        });
        setIsCheckoutOpen(true);
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert("Erro ao efetuar reserva: " + err.message);
    } finally {
      setIsReserving(false);
    }
  };

  const handleConfirmPaymentSimulation = () => {
    setIsReserving(true);
    setTimeout(() => {
      // Update local tickets to PAID
      setTickets((prev) =>
        prev.map((t) => (selectedNumbers.includes(t.number) ? { ...t, status: "PAID" } : t))
      );
      setIsCheckoutOpen(false);
      setIsReserving(false);
      setSuccessBanner(
        `⚡ PARABÉNS NEXUS_RIDER! O pagamento PIX para os números [ ${selectedNumbers.join(
          ", "
        )} ] foi APROVADO! +${selectedNumbers.length * 500} XP Concedidos!`
      );
      setSelectedNumbers([]);

      setTimeout(() => setSuccessBanner(null), 8000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-void text-slate-100 font-sans selection:bg-cyber-magenta selection:text-white">
      
      {/* SUCCESS TOAST BANNER */}
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl bg-green-950 border-2 border-green-400 text-green-300 p-4 rounded-xl shadow-[0_0_30px_rgba(74,222,128,0.5)] font-mono text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-white hover:text-green-200">
            ✕
          </button>
        </div>
      )}

      {/* HEADER */}
      <Header
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* HERO HUB */}
        <HeroQuantumStorm />

        {/* RAFFLE NUMBER GRID */}
        <RaffleGrid
          tickets={tickets}
          selectedNumbers={selectedNumbers}
          onToggleNumber={handleToggleNumber}
          onAutoHackSelect={handleAutoHackSelect}
          onClearSelection={handleClearSelection}
          onProceedToCheckout={handleProceedToCheckout}
          ticketPrice={15.0}
        />

        {/* LEADERBOARD */}
        <Leaderboard />
      </main>

      {/* CHECKOUT MODAL (ETAPA 2 & 3) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedNumbers={selectedNumbers}
        amount={checkoutData.amount || selectedNumbers.length * 15.0}
        qrCode={checkoutData.qrCode || ""}
        qrCodeBase64={checkoutData.qrCodeBase64}
        expiresAt={checkoutData.expiresAt}
        onConfirmPayment={handleConfirmPaymentSimulation}
        isLoading={isReserving}
      />

      {/* AUTH MODAL (ETAPA 4) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />

      {/* FOOTER */}
      <footer className="w-full bg-cyber-dark border-t border-cyber-cyan/20 py-8 px-4 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-cyber font-bold text-slate-300 text-sm">QUANTUM_RAFFLE PLATFORM</div>
            <p className="mt-1">© 2026 ELITE GAMER SETUPS. Todos os direitos reservados. Sorteios regulamentados.</p>
          </div>
          <div className="flex items-center gap-4 text-cyber-cyan">
            <span>SISTEMA 100% AUDITADO VIA PRISMA & MERCADO PAGO</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
