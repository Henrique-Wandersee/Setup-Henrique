import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  console.log(`[EMAIL RESEND MOCK/PROD] Sending password reset link to: ${email}`);
  console.log(`[RESET LINK]: ${resetUrl}`);

  // In local test environments without a active Resend API Key, log the action cleanly
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("mock")) {
    return { success: true, simulated: true, resetUrl };
  }

  try {
    const data = await resend.emails.send({
      from: "Elite Gamer Setup <no-reply@cybernet.io>",
      to: [email],
      subject: "⚡ Redefinição de Senha - ELITE GAMER SETUPS RAFFLE",
      html: `
        <div style="background-color: #0b0e17; color: #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #00f3ff;">
          <h2 style="color: #00f3ff; text-transform: uppercase; letter-spacing: 2px;">⚡ Solicitação de Redefinição de Senha</h2>
          <p style="font-size: 16px;">Recebemos uma solicitação para redefinir a sua senha na plataforma <strong>ELITE GAMER SETUPS RAFFLE</strong>.</p>
          <p style="font-size: 14px; color: #94a3b8;">Clique no botão cibernético abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #ff007f; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 4px; font-size: 16px; box-shadow: 0 0 15px rgba(255, 0, 127, 0.5); display: inline-block;">
              REDEFINIR SENHA AGORA
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b; border-top: 1px solid #1e2942; padding-top: 15px;">Se você não solicitou a alteração, desconsidere este e-mail.</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao enviar e-mail via Resend:", error);
    return { success: false, error: error.message };
  }
}
