import { z } from "zod";

/**
 * Validação de Senha Forte:
 * - Mínimo de 8 caracteres
 * - Pelo menos uma letra maiúscula ([A-Z])
 * - Pelo menos uma letra minúscula ([a-z])
 * - Pelo menos um número ([0-9])
 */
export const passwordSchema = z
  .string()
  .min(8, "A senha deve conter no mínimo 8 caracteres.")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número.");

/**
 * Schema de Cadastro de Usuário (Sign Up)
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve conter pelo menos 2 caracteres.")
    .max(100, "O nome não pode exceder 100 caracteres."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),
  password: passwordSchema,
});

/**
 * Schema de Login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .min(1, "A senha é obrigatória."),
});

/**
 * Schema de Solicitação de Recuperação de Senha (Forgot Password)
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),
});

/**
 * Schema de Redefinição de Senha (Reset Password)
 */
export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "O token de verificação é obrigatório."),
  password: passwordSchema,
});

/**
 * Schema de Verificação de E-mail
 */
export const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, "O token de verificação é obrigatório."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
