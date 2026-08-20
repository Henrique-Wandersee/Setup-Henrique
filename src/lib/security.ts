import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * SEÇÃO DE SEGURANÇA - CRIPTOGRAFIA DE TOKENS E SENHAS
 */

/**
 * 1. Criptografia da Senha (Bcrypt com 12 salt rounds)
 * DECISÃO DE SEGURANÇA: 12 salt rounds oferecem o equilíbrio ideal entre resistência a ataques de força bruta
 * e tempo razoável de computação no servidor (evitando negação de serviço por CPU).
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * 2. Geração de Token Criptograficamente Seguro (32 Bytes = 256 bits de entropia)
 */
export function generateRawToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * 3. Hashing do Token via SHA-256
 * DECISÃO DE SEGURANÇA CRÍTICA: Os tokens enviados por e-mail NUNCA são armazenados em texto puro no banco de dados.
 * Salvamos apenas o hash SHA-256. Se o banco de dados for comprometido ou houver vazamento de leitura,
 * um invasor não conseguirá usar os hashes para validar e-mails ou redefinir senhas.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
