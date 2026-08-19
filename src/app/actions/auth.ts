"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/resend";

/**
 * Action de Cadastro de Novo Usuário
 */
export async function registerUserAction(formData: { name: string; email: string; password: string }) {
  try {
    const { name, email, password } = formData;

    if (!email || !password || !name) {
      return { success: false, message: "Todos os campos são obrigatórios." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Este e-mail já está cadastrado no sistema." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        xp: 100, // Bônus de boas-vindas
        level: 1,
      },
    });

    return { success: true, message: "Conta criada com sucesso! Faça login para continuar." };
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return { success: false, message: error.message || "Erro ao criar conta." };
  }
}

/**
 * Etapa 4: Lógica de Esqueci Minha Senha (Gera Token Seguro & Envia por E-mail via Resend)
 */
export async function requestPasswordResetAction(email: string) {
  try {
    if (!email) {
      return { success: false, message: "Por favor, informe seu e-mail." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Para segurança, não revela explicitamente se o e-mail não existe
      return {
        success: true,
        message: "Se o e-mail estiver cadastrado, você receberá o link de redefinição em instantes.",
      };
    }

    // 1. Gera um token criptograficamente seguro (32 bytes em hex)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Válido por 1 hora

    // 2. Salva o token no banco de dados
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // 3. Envia o e-mail usando Resend
    await sendPasswordResetEmail(email, token);

    return {
      success: true,
      message: "Instruções de redefinição enviadas para seu e-mail! Verifique sua caixa de entrada.",
    };
  } catch (error: any) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    return { success: false, message: "Falha ao processar solicitação de senha." };
  }
}

/**
 * Action de Confirmação e Redefinição de Senha
 */
export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { success: false, message: "Token e nova senha são obrigatórios." };
    }

    // Busca o token no banco
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetTokenRecord || resetTokenRecord.expiresAt < new Date()) {
      return { success: false, message: "Token inválido ou expirado. Solicite uma nova redefinição." };
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário
    await prisma.user.update({
      where: { email: resetTokenRecord.email },
      data: { password: hashedPassword },
    });

    // Deleta o token já utilizado
    await prisma.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    });

    return { success: true, message: "Senha redefinida com sucesso! Você já pode fazer login." };
  } catch (error: any) {
    console.error("Erro ao redefinir senha:", error);
    return { success: false, message: "Erro ao atualizar senha." };
  }
}
