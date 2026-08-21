"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, QrCode, ShieldCheck, Zap, Clock } from "lucide-react";

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
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-vice">
      
      <div className="relative w-full max-w-lg bg-rockstar-card border-2 border-vice-magenta rounded-2xl shadow-vice-glow p-6 sm:p-8 overflow-hidden">
        
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rockstar-yellow via-vice-magenta to-vice-purple animate-pulse" />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-rockstar-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="text-left space-y-1 mb-6 border-b border-rockstar-border pb-4 font-mono">
          <div className="flex items-center gap-2 text-xs text-rockstar-yellow font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-rockstar-yellow" /> PAGAMENTO PIX AUTOMÁTICO HENRIQUE SETUP
          </div>
          <h3 className="font-cyber text-2xl font-black text-white tracking-wider uppercase">
            FINALIZAR <span className="text-vice-magenta">COMPRA</span>
          </h3>
          <p className="text-xs text-slate-300">
            SEUS NÚMEROS:{" "}
            <strong className="text-vice-magenta font-bold">[ {selectedNumbers.join(", ")} ]</strong>
          </p>
        </div>

        {/* HOLOGRAPHIC QR CODE BOX WITH LASER SCAN */}
        <div className="relative w-full bg-rockstar-black border border-rockstar-border rounded-xl p-6 flex flex-col items-center justify-center my-4 overflow-hidden group">
          
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vice-magenta to-transparent animate-laser-move z-20 shadow-magenta-glow" />

          {/* QR CODE DISPLAY */}
          <div className="relative z-10 p-3 bg-white rounded-lg shadow-vice-glow border-2 border-rockstar-yellow">
            {qrCodeBase64 && qrCodeBase64.length > 50 ? (
              <img src={`data:image/jpeg;base64,${qrCodeBase64}`} alt="PIX QR Code" className="w-44 h-44 object-contain" />
            ) : (
              <div className="w-44 h-44 bg-slate-900 flex flex-col items-center justify-center text-center p-2">
                <QrCode className="w-24 h-24 text-rockstar-yellow animate-pulse" />
                <span className="text-[10px] font-mono text-rockstar-yellow mt-2">PIX HOLOGRAM QR</span>
              </div>
            )}
          </div>

          <div className="mt-3 text-center font-mono relative z-10">
            <span className="text-xs text-slate-400 font-bold">TOTAL DA COMPRA</span>
            <div className="text-2xl font-black text-rockstar-yellow">R$ {amount.toFixed(2).replace(".", ",")}</div>
          </div>
        </div>

        {/* TIMER EXPIRATION WARNING */}
        <div className="flex items-center justify-between bg-rockstar-black border border-vice-magenta/50 px-4 py-2.5 rounded-lg mb-6 font-mono text-xs">
          <div className="flex items-center gap-2 text-vice-magenta font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>RESERVA VÁLIDA POR:</span>
          </div>
          <span className="font-black text-white bg-vice-magenta px-2.5 py-0.5 rounded shadow-magenta-glow">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")} MIN
          </span>
        </div>

        {/* PIX COPY BUTTONS */}
        <div className="space-y-3 font-mono">
          <button
            onClick={handleCopyPix}
            className="w-full py-3 bg-rockstar-black border border-rockstar-yellow hover:bg-rockstar-yellow hover:text-black text-rockstar-yellow font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 uppercase"
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

          <button
            onClick={onConfirmPayment}
            disabled={isLoading}
            className="w-full py-4 bg-rockstar-yellow hover:bg-yellow-400 text-black font-cyber font-black text-xs sm:text-sm tracking-widest uppercase rounded-lg shadow-rockstar-glow transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">CONFIRMANDO...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" /> CONFIRMAR PAGAMENTO PIX
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
