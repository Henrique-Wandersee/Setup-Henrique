"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroQuantumStorm from "@/components/HeroQuantumStorm";
import RaffleGrid, { TicketItem } from "@/components/RaffleGrid";
import CheckoutModal from "@/components/CheckoutModal";
import AuthModal from "@/components/AuthModal";
import { reserveTicketsAction } from "@/app/actions/tickets";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  // Generate 100 tickets (1 to 100)
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
    // Populate tickets 1 to 100
    const initial: TicketItem[] = [];
    for (let i = 1; i <= 100; i++) {
      initial.push({ number: i, status: "AVAILABLE" });
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
      const res = await reserveTicketsAction({
        raffleId: "raffle-henrique-setup-001",
        numbers: selectedNumbers,
        userEmail: "henrique@setup.io",
        userName: "Henrique",
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
      setTickets((prev) =>
        prev.map((t) => (selectedNumbers.includes(t.number) ? { ...t, status: "PAID" } : t))
      );
      setIsCheckoutOpen(false);
      setIsReserving(false);
      setSuccessBanner(
        `⚡ COMPRA PARABÉNS! O pagamento PIX para os bilhetes [ ${selectedNumbers.join(
          ", "
        )} ] foi APROVADO! Boa sorte no sorteio!`
      );
      setSelectedNumbers([]);

      setTimeout(() => setSuccessBanner(null), 8000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-rockstar-black text-slate-100 font-vice selection:bg-vice-magenta selection:text-white">
      
      {/* SUCCESS TOAST BANNER */}
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl bg-rockstar-card border-2 border-rockstar-yellow text-rockstar-yellow p-4 rounded-xl shadow-rockstar-glow font-mono text-xs flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-rockstar-yellow shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-white hover:text-rockstar-yellow">
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
        {/* HERO SECTION */}
        <HeroQuantumStorm />

        {/* RAFFLE NUMBER GRID (100 NUMBERS) */}
        <RaffleGrid
          tickets={tickets}
          selectedNumbers={selectedNumbers}
          onToggleNumber={handleToggleNumber}
          onAutoHackSelect={handleAutoHackSelect}
          onClearSelection={handleClearSelection}
          onProceedToCheckout={handleProceedToCheckout}
          ticketPrice={15.0}
        />
      </main>

      {/* CHECKOUT MODAL */}
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

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />

      {/* FOOTER ROCKSTAR STYLE */}
      <footer className="w-full bg-rockstar-black border-t border-rockstar-border py-8 px-4 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-cyber font-black text-slate-200 text-sm tracking-wider uppercase">
              HENRIQUE SETUP ★ RIFA PC GAMER
            </div>
            <p className="mt-1">© 2026 HENRIQUE SETUP. Todos os direitos reservados. Sorteio realizado via Loteria Federal.</p>
          </div>
          <div className="flex items-center gap-4 text-rockstar-yellow font-bold">
            <ShieldCheck className="w-4 h-4 text-rockstar-yellow" />
            <span>SISTEMA AUDITADO & PAGAMENTO PIX AUTOMÁTICO</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
