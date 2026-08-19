"use server";

import { prisma } from "@/lib/prisma";
import { generatePixPaymentPayload } from "@/lib/mercadopago";

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
    const { raffleId, numbers, userEmail = "guest@cybernet.io", userName = "Cyber Gamer" } = input;

    if (!raffleId || !numbers || numbers.length === 0) {
      return { success: false, message: "Nenhum número selecionado para reserva." };
    }

    // Define o tempo de expiração da reserva em 15 minutos
    const expirationMinutes = 15;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // 1. Inicia a Transação Atômica do Prisma para Garantir Concorrência
    const result = await prisma.$transaction(async (tx) => {
      // Busca a rifa
      const raffle = await tx.raffle.findUnique({
        where: { id: raffleId },
      });

      if (!raffle || raffle.status !== "ACTIVE") {
        throw new Error("Rifa indisponível ou já encerrada.");
      }

      // Busca o usuário ou cria um usuário convidado
      let user = await tx.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: userEmail,
            name: userName,
            password: "$2a$10$simulated_hash_guest_password",
            role: "USER",
          },
        });
      }

      // Busca os tickets solicitados no banco de dados com lock/verificação estrita
      const existingTickets = await tx.ticket.findMany({
        where: {
          raffleId: raffleId,
          number: { in: numbers },
        },
      });

      // Validação Crítica de Concorrência: Todos os números devem estar LIVRES ou EXPIRADOS
      const now = new Date();
      const unavailableNumbers: number[] = [];

      for (const num of numbers) {
        const ticket = existingTickets.find((t) => t.number === num);

        if (ticket) {
          // Se já está PAGO ou se está RESERVADO e a reserva ainda é válida
          if (ticket.status === "PAID") {
            unavailableNumbers.push(num);
          } else if (ticket.status === "RESERVED" && ticket.expiresAt && ticket.expiresAt > now) {
            // Se pertence ao mesmo usuário e ainda não expirou, permite renovar a tentativa de pagamento
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

      // Calcula valor total da reserva
      const totalAmount = raffle.price * numbers.length;

      // 2. Atualiza ou Cria cada Ticket para o status RESERVADO atômico
      for (const num of numbers) {
        await tx.ticket.upsert({
          where: {
            raffleId_number: {
              raffleId: raffleId,
              number: num,
            },
          },
          update: {
            status: "RESERVED",
            userId: user.id,
            expiresAt: expiresAt,
          },
          create: {
            raffleId: raffleId,
            number: num,
            status: "RESERVED",
            userId: user.id,
            expiresAt: expiresAt,
          },
        });
      }

      // 3. Registra o Pagamento (Payment) vinculado à reserva
      const payment = await tx.payment.create({
        data: {
          userId: user.id,
          raffleId: raffleId,
          amount: totalAmount,
          status: "PENDING",
          ticketNumbers: JSON.stringify(numbers),
        },
      });

      // Vincula o paymentId nos tickets
      await tx.ticket.updateMany({
        where: {
          raffleId: raffleId,
          number: { in: numbers },
        },
        data: {
          paymentId: payment.id,
        },
      });

      return { payment, raffle, user, totalAmount };
    });

    // 4. Gera Payload de Pagamento PIX Mercado Pago
    const pixData = await generatePixPaymentPayload({
      paymentId: result.payment.id,
      amount: result.totalAmount,
      description: `Rifa PC Gamer Quantum Storm - Números: ${numbers.join(", ")}`,
      email: result.user.email,
      firstName: result.user.name || "Cyber Gamer",
    });

    // Atualiza o Payment no banco com os dados do PIX
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
