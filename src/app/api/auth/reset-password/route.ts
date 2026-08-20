import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashPassword, hashToken } from "@/lib/security";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rateLimit = checkRateLimit(`reset_password_${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e: any) => e.message).join(" ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { token, password } = validation.data;
    const tokenHash = hashToken(token);

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.type !== "PASSWORD_RESET") {
      return NextResponse.json(
        { error: "Token de redefinição inválido ou não encontrado." },
        { status: 400 }
      );
    }

    if (tokenRecord.usedAt) {
      return NextResponse.json(
        { error: "Este token já foi utilizado para redefinir a senha." },
        { status: 400 }
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Este token de redefinição expirou. Solicite um novo link de recuperação." },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(password);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: {
          passwordHash: newPasswordHash,
          failedAttempts: 0,
          lockedUntil: null,
          updatedAt: new Date(),
        },
      });

      await tx.verificationToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      });
    });

    return NextResponse.json(
      { message: "Sua senha foi redefinida com sucesso! Você já pode fazer login com a nova senha." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro na redefinição de senha:", error);
    return NextResponse.json(
      { error: "Falha ao redefinir a senha. Tente novamente." },
      { status: 500 }
    );
  }
}
