import { Resend } from "resend";
import { ContactFormInput } from "./validation";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Escapes HTML special characters to prevent XSS in email bodies.
 * User-supplied input must ALWAYS be passed through this before
 * being embedded in an HTML string.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Email template HTML — all user values are escaped before insertion
const emailTemplate = (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  const safeName    = escapeHtml(name);
  const safeEmail   = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${safeSubject}</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
      <h1 style="color: #333; border-bottom: 2px solid #0a0a0a; padding-bottom: 10px;">
        New Message from Your Portfolio
      </h1>

      <div style="margin: 20px 0;">
        <p style="color: #666;"><strong>From:</strong> ${safeName}</p>
        <p style="color: #666;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p style="color: #666;"><strong>Subject:</strong> ${safeSubject}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0a0a0a; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
        <p>This message was sent via your portfolio website contact form.</p>
      </div>
    </div>
  </body>
</html>
`;
};

export async function sendContactEmail(data: ContactFormInput, recipientEmail: string) {
  try {
    const result = await resend.emails.send({
      from: "noreply@luisaruiz.xyz", // must be a Resend-verified sender domain
      to: recipientEmail,
      reply_to: data.email,
      subject: `New Portfolio Message: ${data.subject}`,
      html: emailTemplate(data.name, data.email, data.subject, data.message)
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      success: true,
      messageId: result.data?.id
    };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

// Optional: Send confirmation email to visitor
export async function sendConfirmationEmail(email: string, name: string) {
  const safeName = escapeHtml(name);
  try {
    const result = await resend.emails.send({
      from: "noreply@luisaruiz.xyz",
      to: email,
      subject: "We received your message!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you, ${safeName}!</h2>
          <p>We received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Luis Ruiz</p>
        </div>
      `
    });

    if (result.error) {
      console.error("Confirmation email send error:", result.error);
      // Don't throw - this is optional
    }
  } catch (error) {
    console.error("Confirmation email send error:", error);
    // Don't throw - this is optional
  }
}
