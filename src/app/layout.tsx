import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "ELITE GAMER SETUPS RAFFLE | The Quantum Storm PC Sorteio",
  description: "Plataforma futurista de rifas online para sortear PCs Gamer de altíssima performance. Garanta seu número via PIX com tecnologia e segurança.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body className="bg-cyber-void text-slate-100 min-h-screen antialiased selection:bg-cyber-magenta selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
