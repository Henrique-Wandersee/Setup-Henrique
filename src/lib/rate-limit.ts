/**
 * Utilitário de Rate Limiting em Memória (Sliding Window per IP)
 * DECISÃO DE SEGURANÇA: Previne ataques de força bruta automatizados (credential stuffing e botnets)
 * em endpoints críticos de autenticação (Sign Up, Login, Forgot Password).
 */

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const tracker = new Map<string, RateLimitStore>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutos
): { success: boolean; limit: number; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = tracker.get(identifier);

  // Limpa registros antigos expirados
  if (record && now > record.resetAt) {
    tracker.delete(identifier);
  }

  const currentRecord = tracker.get(identifier) || {
    count: 0,
    resetAt: now + windowMs,
  };

  if (currentRecord.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetAt: currentRecord.resetAt,
    };
  }

  currentRecord.count += 1;
  tracker.set(identifier, currentRecord);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - currentRecord.count,
    resetAt: currentRecord.resetAt,
  };
}
