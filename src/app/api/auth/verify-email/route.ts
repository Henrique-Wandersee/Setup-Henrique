import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import { verifyEmailSchema } from "@/lib/validations/auth";

/**
 * REQUISITO 1: Endpoint de Verificação de E-mail
 * - Valida token via Hash SHA-256
 * - Verifica expiração de 24h e se o token já não foi utilizado
 * - Atualiza emailVerified no usuário e invalida o token (uso único)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = verifyEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Token de verificação inválido." }, { status: 400 });
    }

    const { token } = validation.data;
    const tokenHash = hashToken(token);

    // Busca o token pelo hash SHA-256
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.type !== "EMAIL_VERIFICATION") {
      return NextResponse.json(
        { error: "Token de verificação inválido ou inexistente." },
        { status: 400 }
      );
    }

    if (tokenRecord.usedAt) {
      return NextResponse.json(
        { error: "Este token de verificação já foi utilizado." },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "O token de verificação expirou. Solicite um novo cadastro ou login para reenviar." },
        { status: 400 }
      );
    }

    // Transação Atômica do Prisma
    await prisma.$transaction(async (tx) => {
      // 1. Marca o e-mail do usuário como verificado
      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: { emailVerified: new Date() },
      });

      // 2. Marca o token como utilizado (Uso Único)
      await tx.verificationToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      });
    });

    return NextResponse.json(
      { message: "E-mail confirmado com sucesso! Sua conta foi ativada. Você já pode fazer login." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro na verificação de e-mail:", error);
    return NextResponse.json(
      { error: "Falha ao verificar e-mail. Tente novamente." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token ausente" }, { status: 400 });
  }

  // Redireciona para a página de verificação no frontend enviando o token
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(`${appUrl}/verify-email?token=${token}`);
}
