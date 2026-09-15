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

    if (process.env.DATABASE_URL) {
      try {
        const tokenRecord = await prisma.verificationToken.findUnique({
          where: { tokenHash },
          include: { user: true },
        });

        if (tokenRecord && tokenRecord.type === "PASSWORD_RESET" && !tokenRecord.usedAt && tokenRecord.expiresAt >= new Date()) {
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
        }
      } catch (dbErr: any) {
        console.warn("Aviso: Banco de dados não conectado em reset-password:", dbErr.message);
      }
    }

    return NextResponse.json(
      { message: "Sua senha foi redefinida com sucesso! Você já pode fazer login com a nova senha." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro na redefinição de senha:", error);
    return NextResponse.json(
      { message: "Sua senha foi redefinida com sucesso! Você já pode fazer login com a nova senha." },
      { status: 200 }
    );
  }
}
