import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { verifyPassword } from "./security";
import { loginSchema } from "./validations/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        const GENERIC_ERROR = "E-mail ou senha inválidos.";

        const validation = loginSchema.safeParse(credentials);
        if (!validation.success) {
          throw new Error(GENERIC_ERROR);
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          throw new Error(GENERIC_ERROR);
        }

        const now = new Date();

        if (user.lockedUntil && user.lockedUntil > now) {
          const minutesRemaining = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / (60 * 1000));
          throw new Error(`Conta temporariamente bloqueada por segurança devido a várias tentativas incorretas. Tente novamente em ${minutesRemaining} minuto(s).`);
        }

        if (!user.emailVerified) {
          throw new Error("Seu e-mail ainda não foi verificado. Por favor, confirme o e-mail enviado no seu cadastro.");
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
          const updatedAttempts = user.failedAttempts + 1;
          let lockedUntil: Date | null = null;

          if (updatedAttempts >= 5) {
            lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: updatedAttempts >= 5 ? 0 : updatedAttempts,
              lockedUntil: lockedUntil,
            },
          });

          throw new Error(GENERIC_ERROR);
        }

        if (user.failedAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: 0,
              lockedUntil: null,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          updatedAt: user.updatedAt.toISOString(),
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // Sessão JWT de 15 minutos (Expiração Curta para Segurança)
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.level = user.level;
        token.xp = user.xp;
        token.userUpdatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.level = token.level;
        session.user.xp = token.xp;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "quantum_storm_cyber_secret_key_2026",
};
