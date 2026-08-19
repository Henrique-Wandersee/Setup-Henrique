"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, QrCode, ShieldCheck, Zap, AlertTriangle, Clock } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNumbers: number[];
  amount: number;
  qrCode: string;
  qrCodeBase64?: string;
  expiresAt?: string;
  onConfirmPayment: () => void;
  isLoading?: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedNumbers,
  amount,
  qrCode,
  qrCodeBase64,
  expiresAt,
  onConfirmPayment,
  isLoading = false,
}: CheckoutModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 minutos

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeftSeconds(900);
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-void/90 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-lg bg-cyber-card border-2 border-cyber-cyan rounded-2xl shadow-cyan-glow p-6 sm:p-8 overflow-hidden">
        
        {/* LASER LIGHT TOP & BOTTOM BORDERS */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyber-cyan via-white to-cyber-magenta animate-pulse" />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-cyber-void transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="text-left space-y-1 mb-6 border-b border-cyber-border pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan">
            <ShieldCheck className="w-4 h-4 text-cyber-cyan" /> PROTOCOLO DE PAGAMENTO PIX SECURE
          </div>
          <h3 className="font-cyber text-2xl font-black text-white tracking-wider">
            CHECKOUT <span className="text-cyber-magenta">GATEWAY</span>
          </h3>
          <p className="font-mono text-xs text-slate-400">
            SEUS NÚMEROS SELECIONADOS:{" "}
            <strong className="text-cyber-magenta font-bold">[ {selectedNumbers.join(", ")} ]</strong>
          </p>
        </div>

        {/* HOLOGRAPHIC QR CODE BOX WITH VERTICAL LASER SCAN EFFECT */}
        <div className="relative w-full bg-cyber-void border border-cyber-cyan/40 rounded-xl p-6 flex flex-col items-center justify-center my-4 overflow-hidden group">
          
          {/* LASER SCANNING ANIMATED BAR */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-laser-move z-20 shadow-cyan-glow" />

          {/* BACKGROUND HOLOGRAPHIC GLOW */}
          <div className="absolute w-40 h-40 bg-cyber-cyan/20 rounded-full blur-3xl pointer-events-none" />

          {/* QR CODE DISPLAY */}
          <div className="relative z-10 p-3 bg-white rounded-lg shadow-cyan-glow border-2 border-cyber-cyan">
            {qrCodeBase64 && qrCodeBase64.length > 50 ? (
              <img src={`data:image/jpeg;base64,${qrCodeBase64}`} alt="PIX QR Code" className="w-44 h-44 object-contain" />
            ) : (
              <div className="w-44 h-44 bg-slate-900 flex flex-col items-center justify-center text-center p-2">
                <QrCode className="w-24 h-24 text-cyber-cyan animate-pulse" />
                <span className="text-[10px] font-mono text-cyber-cyan mt-2">PIX HOLOGRAM QR</span>
              </div>
            )}
          </div>

          <div className="mt-3 text-center font-mono relative z-10">
            <span className="text-xs text-slate-400">VALOR DA RESERVA</span>
            <div className="text-xl font-bold text-cyber-cyan">R$ {amount.toFixed(2).replace(".", ",")}</div>
          </div>
        </div>

        {/* TIMER EXPIRATION WARNING */}
        <div className="flex items-center justify-between bg-cyber-void/80 border border-cyber-magenta/40 px-4 py-2.5 rounded-lg mb-6 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyber-magenta">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>EXPIRAÇÃO DA RESERVA:</span>
          </div>
          <span className="font-bold text-white bg-cyber-magenta/20 px-2 py-0.5 rounded border border-cyber-magenta">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")} MIN
          </span>
        </div>

        {/* PIX COPY & PASTE BUTTON */}
        <div className="space-y-3 font-mono">
          <button
            onClick={handleCopyPix}
            className="w-full py-3 bg-cyber-void border border-cyber-cyan/60 hover:border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" /> CÓDIGO PIX COPIADO COM SUCESSO!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> COPIAR CÓDIGO PIX (COPIA E COLA)
              </>
            )}
          </button>

          {/* ACCESS GRANTED CONFIRMATION BUTTON */}
          <button
            onClick={onConfirmPayment}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-cyber-cyan via-blue-500 to-cyber-magenta hover:opacity-90 text-cyber-void font-cyber font-black text-xs sm:text-sm tracking-widest uppercase rounded-lg shadow-cyan-glow transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">PROCESSANDO VALIDAÇÃO...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-cyber-void fill-current" /> ACCESS GRANTED [ CONFIRMAR COMPRA ]
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
