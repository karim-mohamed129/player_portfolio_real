import nodemailer from "nodemailer";

function getRequiredEmailConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true").toLowerCase() === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.SMTP_FROM_NAME || "Player Portfolio Website",
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.CONTACT_RECEIVER_EMAIL
  };
}

export function isEmailConfigured() {
  const config = getRequiredEmailConfig();
  return Boolean(config.host && config.user && config.pass && config.fromEmail && config.to);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendContactEmail({ name, email, phone, subject, message }) {
  const config = getRequiredEmailConfig();

  if (!isEmailConfigured()) {
    return { skipped: true, reason: "Email environment variables are not fully configured." };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111;background:#f6f6f6;padding:24px">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
        <div style="background:#121212;color:#fff;padding:20px 24px">
          <h2 style="margin:0;font-size:22px">New Contact Form Message</h2>
          <p style="margin:8px 0 0;color:#ddd">Player Portfolio Website</p>
        </div>
        <div style="padding:24px">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
          <p style="margin:0 0 8px"><strong>Message:</strong></p>
          <div style="background:#fafafa;border:1px solid #eee;border-radius:12px;padding:16px">${safeMessage}</div>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to: config.to,
    replyTo: email,
    subject: `Website Contact: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html
  });

  return { sent: true };
}
