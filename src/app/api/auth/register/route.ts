import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, generateRawToken, hashToken } from "@/lib/security";
import { sendEmailVerificationEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rateLimit = checkRateLimit(`register_${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de cadastro. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e: any) => e.message).join(" ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          {
            message: "Se as informações forem válidas, um e-mail de confirmação foi enviado para sua caixa de entrada.",
          },
          { status: 200 }
        );
      } else {
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

        return NextResponse.json(
          {
            message: "Reenviamos um novo e-mail de confirmação para ativar sua conta.",
          },
          { status: 200 }
        );
      }
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

    return NextResponse.json(
      {
        message: "Conta criada com sucesso! Enviamos um link de confirmação para o seu e-mail. Por favor, confirme para realizar o login.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o cadastro." },
      { status: 500 }
    );
  }
}
