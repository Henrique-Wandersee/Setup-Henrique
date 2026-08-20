"use server";

import { prisma } from "@/lib/prisma";
import { generatePixPaymentPayload } from "@/lib/mercadopago";
import { hashPassword } from "@/lib/security";

export interface ReserveTicketsInput {
  raffleId: string;
  numbers: number[];
  userEmail?: string;
  userName?: string;
}

export interface ReserveTicketsResult {
  success: boolean;
  message: string;
  paymentId?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  amount?: number;
  expiresAt?: string;
  ticketNumbers?: number[];
}

/**
 * Etapa 2: Lógica de Reserva e Concorrência
 * Server Action que roda dentro de uma Prisma $transaction para evitar condições de corrida (Race Conditions).
 */
export async function reserveTicketsAction(input: ReserveTicketsInput): Promise<ReserveTicketsResult> {
  try {
    const { raffleId, numbers, userEmail = "nexus_rider@cybernet.io", userName = "Cyber Gamer" } = input;

    if (!raffleId || !numbers || numbers.length === 0) {
      return { success: false, message: "Nenhum número selecionado para reserva." };
    }

    const expirationMinutes = 15;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      const raffle = await tx.raffle.findFirst({
        where: { status: "ACTIVE" },
      });

      if (!raffle) {
        throw new Error("Rifa indisponível ou já encerrada.");
      }

      let user = await tx.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        const guestPasswordHash = await hashPassword("Guest1234!");
        user = await tx.user.create({
          data: {
            email: userEmail,
            name: userName,
            passwordHash: guestPasswordHash,
            emailVerified: new Date(),
            role: "USER",
          },
        });
      }

      const existingTickets = await tx.ticket.findMany({
        where: {
          raffleId: raffle.id,
          number: { in: numbers },
        },
      });

      const now = new Date();
      const unavailableNumbers: number[] = [];

      for (const num of numbers) {
        const ticket = existingTickets.find((t) => t.number === num);

        if (ticket) {
          if (ticket.status === "PAID") {
            unavailableNumbers.push(num);
          } else if (ticket.status === "RESERVED" && ticket.expiresAt && ticket.expiresAt > now) {
            if (ticket.userId !== user.id) {
              unavailableNumbers.push(num);
            }
          }
        }
      }

      if (unavailableNumbers.length > 0) {
        throw new Error(
          `Ops! Os seguintes números foram reservados ou comprados por outro usuário simultaneamente: [ ${unavailableNumbers.join(
            ", "
          )} ]. Por favor, escolha outros números.`
        );
      }

      const totalAmount = raffle.price * numbers.length;

      for (const num of numbers) {
        await tx.ticket.upsert({
          where: {
            raffleId_number: {
              raffleId: raffle.id,
              number: num,
            },
          },
          update: {
            status: "RESERVED",
            userId: user.id,
            expiresAt: expiresAt,
          },
          create: {
            raffleId: raffle.id,
            number: num,
            status: "RESERVED",
            userId: user.id,
            expiresAt: expiresAt,
          },
        });
      }

      const payment = await tx.payment.create({
        data: {
          userId: user.id,
          raffleId: raffle.id,
          amount: totalAmount,
          status: "PENDING",
          ticketNumbers: JSON.stringify(numbers),
        },
      });

      await tx.ticket.updateMany({
        where: {
          raffleId: raffle.id,
          number: { in: numbers },
        },
        data: {
          paymentId: payment.id,
        },
      });

      return { payment, raffle, user, totalAmount };
    });

    const pixData = await generatePixPaymentPayload({
      paymentId: result.payment.id,
      amount: result.totalAmount,
      description: `Rifa PC Gamer Quantum Storm - Números: ${numbers.join(", ")}`,
      email: result.user.email,
      firstName: result.user.name || "Cyber Gamer",
    });

    await prisma.payment.update({
      where: { id: result.payment.id },
      data: {
        externalId: pixData.externalId,
        qrCode: pixData.qrCode,
        qrCodeBase64: pixData.qrCodeBase64,
      },
    });

    return {
      success: true,
      message: "Reserva efetuada com sucesso! Conclua o pagamento via PIX em até 15 minutos.",
      paymentId: result.payment.id,
      qrCode: pixData.qrCode,
      qrCodeBase64: pixData.qrCodeBase64,
      amount: result.totalAmount,
      expiresAt: expiresAt.toISOString(),
      ticketNumbers: numbers,
    };
  } catch (error: any) {
    console.error("Erro na Server Action reserveTicketsAction:", error.message);
    return {
      success: false,
      message: error.message || "Erro ao processar reserva. Tente novamente.",
    };
  }
}
