import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

/**
 * 1. Envio de E-mail de Confirmação de Cadastro (Email Verification)
 */
export async function sendEmailVerificationEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  console.log(`[RESEND EMAIL] Verification email to ${email}`);
  console.log(`[VERIFICATION LINK]: ${verifyUrl}`);

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("mock")) {
    return { success: true, simulated: true, verifyUrl };
  }

  try {
    const data = await resend.emails.send({
      from: "Elite Gamer Setup <no-reply@cybernet.io>",
      to: [email],
      subject: "⚡ Confirme seu E-mail - ELITE GAMER SETUPS RAFFLE",
      html: `
        <div style="background-color: #0b0e17; color: #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #00f3ff; box-shadow: 0 0 20px rgba(0,243,255,0.2);">
          <h2 style="color: #00f3ff; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">⚡ BEM-VINDO À PLATAFORMA QUANTUM</h2>
          <p style="font-size: 16px; line-height: 1.6;">Obrigado por se cadastrar na <strong>ELITE GAMER SETUPS RAFFLE</strong>.</p>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">Para ativar sua conta e participar dos sorteios do PC Gamer, confirme seu endereço de e-mail clicando no botão abaixo. Este link expira em <strong>24 horas</strong>.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verifyUrl}" style="background-color: #00f3ff; color: #0b0e17; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 6px; font-size: 15px; box-shadow: 0 0 15px rgba(0, 243, 255, 0.5); display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
              CONFIRMAR MEU E-MAIL AGORA
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b; border-top: 1px solid #1e2942; padding-top: 15px;">Se você não solicitou este cadastro, por favor ignore este e-mail.</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao enviar e-mail de verificação via Resend:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Envio de E-mail de Redefinição de Senha (Password Reset)
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  console.log(`[RESEND EMAIL] Password Reset email to ${email}`);
  console.log(`[RESET LINK]: ${resetUrl}`);

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("mock")) {
    return { success: true, simulated: true, resetUrl };
  }

  try {
    const data = await resend.emails.send({
      from: "Elite Gamer Setup <no-reply@cybernet.io>",
      to: [email],
      subject: "⚡ Redefinição de Senha - ELITE GAMER SETUPS RAFFLE",
      html: `
        <div style="background-color: #0b0e17; color: #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #ff007f; box-shadow: 0 0 20px rgba(255,0,127,0.2);">
          <h2 style="color: #ff007f; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">⚡ SOLICITAÇÃO DE REDEFINIÇÃO DE SENHA</h2>
          <p style="font-size: 16px; line-height: 1.6;">Recebemos um pedido de redefinição de senha para sua conta na <strong>ELITE GAMER SETUPS RAFFLE</strong>.</p>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">Clique no botão cibernético abaixo para cadastrar uma nova senha forte. Este link é de uso único e expira em <strong>60 minutos</strong>.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #ff007f; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 6px; font-size: 15px; box-shadow: 0 0 15px rgba(255, 0, 127, 0.5); display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
              REDEFINIR MINHA SENHA
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b; border-top: 1px solid #1e2942; padding-top: 15px;">Se você não realizou esta solicitação, nenhuma ação é necessária. Sua senha permanece segura.</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao enviar e-mail de reset via Resend:", error);
    return { success: false, error: error.message };
  }
}
