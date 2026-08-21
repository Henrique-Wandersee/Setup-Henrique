import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API DE REGRAS DE NEGÓCIO DE BILHETES DA RIFA:
 * 1. Limpa reservas expiradas (expiresAt < now) retornando bilhetes para "AVAILABLE".
 * 2. Retorna a lista dos 1.000 bilhetes com status real ("AVAILABLE", "RESERVED", "PAID").
 * 3. O bilhete só fica INDISPONÍVEL para seleção quando estiver "PAID" (Comprado).
 */
export async function GET() {
  try {
    const now = new Date();

    // 1. Regra de Negócio: Expira reservas com mais de 15 minutos sem pagamento
    await prisma.ticket.updateMany({
      where: {
        status: "RESERVED",
        expiresAt: { lt: now },
      },
      data: {
        status: "AVAILABLE",
        expiresAt: null,
        paymentId: null,
      },
    });

    // 2. Busca a rifa ativa
    const raffle = await prisma.raffle.findFirst({
      where: { status: "ACTIVE" },
      include: {
        tickets: {
          orderBy: { number: "asc" },
        },
      },
    });

    if (!raffle) {
      return NextResponse.json({ error: "Nenhuma rifa ativa encontrada." }, { status: 444 });
    }

    const availableCount = raffle.tickets.filter((t) => t.status === "AVAILABLE").length;
    const reservedCount = raffle.tickets.filter((t) => t.status === "RESERVED").length;
    const paidCount = raffle.tickets.filter((t) => t.status === "PAID").length;

    return NextResponse.json(
      {
        raffleId: raffle.id,
        title: raffle.title,
        price: raffle.price, // R$ 30,00
        totalNumbers: raffle.totalNumbers, // 1.000
        availableCount,
        reservedCount,
        paidCount,
        tickets: raffle.tickets.map((t) => ({
          number: t.number,
          status: t.status,
          expiresAt: t.expiresAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao buscar bilhetes:", error);
    return NextResponse.json({ error: "Falha ao carregar bilhetes da rifa." }, { status: 500 });
  }
}
