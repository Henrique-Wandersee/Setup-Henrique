import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMercadoPagoSignature } from "@/lib/mercadopago";

/**
 * Etapa 3: Integração de Pagamento (Webhooks Mercado Pago)
 * Recebe notificações instantâneas de pagamento (IPN / Webhooks)
 */
export async function POST(req: Request) {
  try {
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");
    const url = new URL(req.url);
    const dataId = url.searchParams.get("data.id") || url.searchParams.get("id");

    console.log(`⚡ [MERCADO PAGO WEBHOOK] Received notification. Data ID: ${dataId}`);

    // 1. Validação de Segurança da Assinatura HMAC SHA-256
    const isValidSignature = verifyMercadoPagoSignature(xSignature, xRequestId, dataId);

    if (!isValidSignature) {
      console.warn("⚠️ [MERCADO PAGO WEBHOOK] Signature validation failed! Rejecting payload.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action || url.searchParams.get("topic");

    // Identifica o ID da transação ou pagamento
    const paymentId = dataId || body.data?.id;

    if (!paymentId) {
      return NextResponse.json({ message: "No payment ID provided" }, { status: 200 });
    }

    // 2. Busca os detalhes do pagamento no banco ou Mercado Pago API
    // Procuramos o pagamento correspondente no nosso banco via externalId ou ID direto
    const paymentRecord = await prisma.payment.findFirst({
      where: {
        OR: [{ externalId: String(paymentId) }, { id: String(paymentId) }],
      },
      include: {
        user: true,
      },
    });

    if (!paymentRecord) {
      console.log(`ℹ️ [WEBHOOK] Payment ${paymentId} not found in database yet.`);
      return NextResponse.json({ message: "Payment record not found" }, { status: 200 });
    }

    // Se já estiver pago, ignora para idempotência
    if (paymentRecord.status === "APPROVED") {
      return NextResponse.json({ message: "Payment already processed and approved" }, { status: 200 });
    }

    // Simulando ou consultando status aprovado do Mercado Pago (em prod, faria fetch no MP API GET /v1/payments/{id})
    const isApproved = true; // No callback real, verifica data.status === 'approved'

    if (isApproved) {
      const ticketNumbers: number[] = JSON.parse(paymentRecord.ticketNumbers || "[]");

      // 3. Transação do Prisma: Atualização Atômica de Payment e Tickets para PAID
      await prisma.$transaction(async (tx) => {
        // A) Atualiza o status do Payment para APPROVED
        await tx.payment.update({
          where: { id: paymentRecord.id },
          data: { status: "APPROVED" },
        });

        // B) Atualiza os Tickets de RESERVED para PAID
        await tx.ticket.updateMany({
          where: {
            raffleId: paymentRecord.raffleId,
            number: { in: ticketNumbers },
          },
          data: {
            status: "PAID",
            expiresAt: null, // Remove a data de expiração
          },
        });

        // C) Concede Pontos de Experiência (XP) e Nível ao Usuário (Gamificação)
        const earnedXP = ticketNumbers.length * 500;
        await tx.user.update({
          where: { id: paymentRecord.userId },
          data: {
            xp: { increment: earnedXP },
            level: { increment: 1 },
          },
        });
      });

      console.log(
        `✅ [WEBHOOK SUCESSO] Pagamento ${paymentRecord.id} APROVADO! Tickets [${ticketNumbers.join(
          ", "
        )}] confirmados como PAGOS.`
      );
    }

    return NextResponse.json({ status: "success", message: "Webhook processed successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error in Mercado Pago Webhook:", error);
    return NextResponse.json({ error: error.message || "Internal Webhook Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "active", gateway: "Mercado Pago PIX Webhook" });
}
