"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroQuantumStorm from "@/components/HeroQuantumStorm";
import RaffleGrid, { TicketItem } from "@/components/RaffleGrid";
import CheckoutModal from "@/components/CheckoutModal";
import AuthModal from "@/components/AuthModal";
import { reserveTicketsAction, confirmPaymentAction } from "@/app/actions/tickets";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function Home() {
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

  // Função para buscar o estado em tempo real dos 1.000 bilhetes no banco
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Erro ao carregar bilhetes:", err);
      // Fallback local se a API estiver inicializando
      const initial: TicketItem[] = [];
      for (let i = 1; i <= 1000; i++) {
        initial.push({ number: i, status: "AVAILABLE" });
      }
      setTickets(initial);
    }
  };

  useEffect(() => {
    fetchTickets();
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

  // Confirmação de Pagamento PIX e Atualização no Banco no Status PAID (Comprado)
  const handleConfirmPaymentSimulation = async () => {
    if (!checkoutData.paymentId) return;

    setIsReserving(true);
    try {
      const res = await confirmPaymentAction(checkoutData.paymentId);
      if (res.success) {
        setIsCheckoutOpen(false);
        setSuccessBanner(
          `⚡ PARABÉNS! O pagamento PIX para os bilhetes [ ${selectedNumbers.join(
            ", "
          )} ] foi APROVADO e salvo no banco de dados como COMPRADOS/INDISPONÍVEIS!`
        );
        setSelectedNumbers([]);
        await fetchTickets(); // Atualiza em tempo real o estado dos bilhetes no banco
        setTimeout(() => setSuccessBanner(null), 8000);
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert("Erro ao confirmar pagamento: " + err.message);
    } finally {
      setIsReserving(false);
    }
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

        {/* RAFFLE NUMBER GRID (1.000 NUMBERS - R$ 30,00) */}
        <RaffleGrid
          tickets={tickets}
          selectedNumbers={selectedNumbers}
          onToggleNumber={handleToggleNumber}
          onAutoHackSelect={handleAutoHackSelect}
          onClearSelection={handleClearSelection}
          onProceedToCheckout={handleProceedToCheckout}
          ticketPrice={30.0}
        />
      </main>

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedNumbers={selectedNumbers}
        amount={checkoutData.amount || selectedNumbers.length * 30.0}
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
              HENRIQUE SETUP ★ RIFA PC GAMER (1.000 Ns - R$ 30,00)
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
