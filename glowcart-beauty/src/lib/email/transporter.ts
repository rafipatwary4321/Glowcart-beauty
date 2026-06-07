import nodemailer from "nodemailer";

import { env, isEmailConfigured } from "@/config/env";

export class EmailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigError";
  }
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!isEmailConfigured()) {
    throw new EmailConfigError(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM."
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return transporter;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; preview?: boolean }> {
  if (!isEmailConfigured()) {
    if (env.nodeEnv === "development") {
      console.info("[email:preview]", input.subject, "→", input.to);
      return { sent: false, preview: true };
    }
    throw new EmailConfigError("Email is not configured.");
  }

  await getTransporter().sendMail({
    from: env.smtpFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  return { sent: true };
}
