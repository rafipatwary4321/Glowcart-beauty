export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { sendEmail, EmailConfigError } from "@/lib/email";
import { renderEmailLayout } from "@/lib/email/templates/layout";
import { z } from "zod";

const sendSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const POST = withDb(async (request: Request) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const parsed = sendSchema.safeParse(await request.json());
  if (!parsed.success) throw new ApiRouteError("Invalid email payload.", 400);

  try {
    const html = renderEmailLayout({
      title: parsed.data.subject,
      body: `<p>${parsed.data.message}</p>`,
    });

    const result = await sendEmail({
      to: parsed.data.to,
      subject: parsed.data.subject,
      html,
      text: parsed.data.message,
    });

    return apiSuccess(result, {
      message: result.preview ? "Email preview logged (SMTP not configured)." : "Email sent.",
    });
  } catch (error) {
    if (error instanceof EmailConfigError) {
      throw new ApiRouteError(error.message, 503);
    }
    throw error;
  }
});

export async function GET() {
  return apiSuccess({
    configured: Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM),
    templates: [
      "registration",
      "order_placed",
      "payment_success",
      "order_shipped",
      "order_delivered",
      "password_reset",
    ],
  });
}
