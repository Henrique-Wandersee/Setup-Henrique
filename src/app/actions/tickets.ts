"use server";

import { prisma } from "@/lib/prisma";
import { generatePixPaymentPayload } from "@/lib/mercadopago";
import { hashPassword } from "@/lib/security";

export interface ReserveTicketsInput {
  raffleId?: string;
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
 * Server Action de Reserva de Bilhetes com Transação Atômica (R$ 30,00 por bilhete)
 * Regra de Negócio: O bilhete fica "RESERVED" por 15 minutos até a confirmação do PIX.
 */
export async function reserveTicketsAction(input: ReserveTicketsInput): Promise<ReserveTicketsResult> {
  try {
    const { numbers, userEmail = "henrique@setup.io", userName = "Henrique" } = input;

    if (!numbers || numbers.length === 0) {
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
          // Apenas bilhetes PAGO estão permanentemente indisponíveis
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
          `Ops! Os seguintes números foram comprados ou reservados por outro usuário: [ ${unavailableNumbers.join(
            ", "
          )} ]. Escolha outros bilhetes.`
        );
      }

      // Regra de Valor: R$ 30,00 por bilhete
      const totalAmount = 30.0 * numbers.length;

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
      description: `Rifa PC Gamer Henrique Setup (1000 Ns) - Números: ${numbers.join(", ")}`,
      email: result.user.email,
      firstName: result.user.name || "Henrique Setup Gamer",
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

/**
 * Server Action de Confirmação de Pagamento PIX
 * Regra de Negócio: Transita os bilhetes para "PAID" no banco de dados, tornando-os INDISPONÍVEIS permanentemente!
 */
export async function confirmPaymentAction(paymentId: string) {
  try {
    if (!paymentId) {
      return { success: false, message: "ID de pagamento inválido." };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return { success: false, message: "Pagamento não encontrado." };
    }

    const ticketNumbers: number[] = JSON.parse(payment.ticketNumbers || "[]");

    await prisma.$transaction(async (tx) => {
      // 1. Atualiza Payment para APPROVED
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "APPROVED" },
      });

      // 2. Atualiza Tickets para PAID (Comprado / Indisponível)
      await tx.ticket.updateMany({
        where: {
          raffleId: payment.raffleId,
          number: { in: ticketNumbers },
        },
        data: {
          status: "PAID",
          expiresAt: null,
        },
      });
    });

    return {
      success: true,
      message: `Pagamento aprovado com sucesso! Os bilhetes [ ${ticketNumbers.join(", ")} ] estão salvos no banco como COMPRADOS/INDISPONÍVEIS.`,
      ticketNumbers,
    };
  } catch (error: any) {
    console.error("Erro ao confirmar pagamento:", error);
    return { success: false, message: "Erro ao confirmar pagamento." };
  }
}
