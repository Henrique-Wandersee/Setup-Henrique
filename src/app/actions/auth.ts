"use server";

import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { hashPassword, generateRawToken, hashToken } from "@/lib/security";
import { sendEmailVerificationEmail, sendPasswordResetEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

export async function registerUserAction(formData: { name: string; email: string; password: string }) {
  try {
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      return { success: false, message: validation.error.errors.map((e: any) => e.message).join(" ") };
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { success: true, message: "Se as informações forem válidas, um e-mail de confirmação foi enviado." };
      }

      const rawToken = generateRawToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.verificationToken.create({
        data: {
          tokenHash,
          userId: existingUser.id,
          type: "EMAIL_VERIFICATION",
          expiresAt,
        },
      });

      await sendEmailVerificationEmail(email, rawToken);

      return { success: true, message: "Reenviamos um novo e-mail de confirmação para ativar sua conta." };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: null,
        role: "USER",
      },
    });

    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        tokenHash,
        userId: newUser.id,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    await sendEmailVerificationEmail(email, rawToken);

    return { success: true, message: "Conta criada com sucesso! Verifique seu e-mail para ativar." };
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return { success: false, message: error.message || "Erro ao criar conta." };
  }
}

export async function requestPasswordResetAction(email: string) {
  try {
    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      return { success: false, message: "Informe um e-mail válido." };
    }

    const genericResponse = {
      success: true,
      message: "Se o e-mail estiver cadastrado, você receberá o link de redefinição em instantes.",
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return genericResponse;
    }

    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        tokenHash,
        userId: user.id,
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    await sendPasswordResetEmail(email, rawToken);

    return genericResponse;
  } catch (error: any) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    return { success: false, message: "Falha ao processar solicitação de senha." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const validation = resetPasswordSchema.safeParse({ token, password: newPassword });
    if (!validation.success) {
      return { success: false, message: validation.error.errors.map((e: any) => e.message).join(" ") };
    }

    const tokenHash = hashToken(token);

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { tokenHash },
    });

    if (!tokenRecord || tokenRecord.type !== "PASSWORD_RESET" || tokenRecord.usedAt || tokenRecord.expiresAt < new Date()) {
      return { success: false, message: "Token inválido, expirado ou já utilizado." };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: {
          passwordHash,
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

    return { success: true, message: "Senha redefinida com sucesso! Você já pode fazer login." };
  } catch (error: any) {
    console.error("Erro ao redefinir senha:", error);
    return { success: false, message: "Erro ao atualizar senha." };
  }
}
