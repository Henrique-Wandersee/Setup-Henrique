import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { generateRawToken, hashToken } from "@/lib/security";
import { sendPasswordResetEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * REQUISITO 3: Endpoint de Solicitação de Recuperação de Senha (Forgot Password)
 * - Valida e-mail via Zod
 * - DECISÃO DE SEGURANÇA: Resposta IDÊNTICA se o e-mail existir ou não (evita ataques de enumeração)
 * - Salva apenas o HASH SHA-256 do token no banco, com expiração de 60 minutos
 * - Envia e-mail via Resend com o link de redefinição
 */
export async function POST(req: Request) {
  try {
    // Rate Limiting por IP (Máximo 3 solicitações a cada 15 min)
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rateLimit = checkRateLimit(`forgot_password_${ip}`, 3, 15 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Muitas solicitações. Aguarde 15 minutos antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const { email } = validation.data;

    // Resposta padrão estpadronizada para evitar Enumeração de Usuários (User Enumeration Attack)
    const genericResponse = {
      message: "Se o e-mail estiver cadastrado em nosso sistema, você receberá as instruções para redefinir sua senha em instantes.",
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não existe, retorna a resposta genérica com status 200
    if (!user) {
      return NextResponse.json(genericResponse, { status: 200 });
    }

    // Geração do token criptográfico e hash SHA-256
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expiração de 60 minutos

    // Salva o hash do token no banco
    await prisma.verificationToken.create({
      data: {
        tokenHash,
        userId: user.id,
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    // Envia o e-mail transacional via Resend
    await sendPasswordResetEmail(email, rawToken);

    return NextResponse.json(genericResponse, { status: 200 });
  } catch (error: any) {
    console.error("Erro na solicitação de recuperação de senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar solicitação." },
      { status: 500 }
    );
  }
}
