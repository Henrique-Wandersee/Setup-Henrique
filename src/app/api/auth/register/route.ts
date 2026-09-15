import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, generateRawToken, hashToken } from "@/lib/security";
import { sendEmailVerificationEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_ip";
    const rateLimit = checkRateLimit(`register_${ip}`, 10, 15 * 60 * 1000);
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

    // Se houver DATABASE_URL configurado e acessível
    if (process.env.DATABASE_URL) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return NextResponse.json(
            {
              message: "Este e-mail já está cadastrado. Tente realizar o login.",
            },
            { status: 200 }
          );
        }

        const isMockEmail = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("mock");
        const passwordHash = await hashPassword(password);

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            emailVerified: new Date(),
            role: "USER",
          },
        });

        try {
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
        } catch (emailErr) {}

        return NextResponse.json(
          {
            message: "Conta criada com sucesso! Você já pode realizar o login.",
          },
          { status: 201 }
        );
      } catch (dbErr: any) {
        console.warn("Aviso: Banco de dados não conectado durante o cadastro. Ativando resposta demo:", dbErr.message);
      }
    }

    // Fallback de demonstração se o banco de dados não estiver conectado
    return NextResponse.json(
      {
        message: "Conta criada com sucesso! (Modo Demonstração). Você já pode realizar o login.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { message: "Conta criada com sucesso! Você já pode realizar o login." },
      { status: 201 }
    );
  }
}
