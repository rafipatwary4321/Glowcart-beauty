export const runtime = "nodejs";

import crypto from "crypto";

import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { validateForgotPasswordForm } from "@/lib/auth/validation";
import { sendPasswordResetEmail } from "@/lib/email";
import { env } from "@/config/env";
import { PasswordResetToken, User } from "@/models";

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as { email?: string };
  const validation = validateForgotPasswordForm({ email: body.email ?? "" });

  if (!validation.valid) {
    throw new ApiRouteError(validation.errors.email ?? "Invalid email.", 400);
  }

  const email = body.email!.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetToken.deleteMany({ user: user._id });
    await PasswordResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    const resetUrl = `${env.appUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;
    void sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    }).catch(() => undefined);
  }

  return apiSuccess(
    { sent: true },
    { message: "If an account exists, a reset link has been sent." }
  );
});
