export const runtime = "nodejs";

import crypto from "crypto";

import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { validateResetPasswordForm } from "@/lib/auth/validation";
import { PasswordResetToken, User } from "@/models";

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as {
    token?: string;
    password?: string;
    confirmPassword?: string;
  };

  const validation = validateResetPasswordForm({
    password: body.password ?? "",
    confirmPassword: body.confirmPassword ?? "",
  });

  if (!validation.valid) {
    throw new ApiRouteError("Validation failed.", 400, validation.errors);
  }

  if (!body.token?.trim()) {
    throw new ApiRouteError("Reset token is required.", 400);
  }

  const tokenHash = crypto.createHash("sha256").update(body.token.trim()).digest("hex");
  const resetToken = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
    usedAt: { $exists: false },
  });

  if (!resetToken) {
    throw new ApiRouteError("Invalid or expired reset token.", 400);
  }

  const user = await User.findById(resetToken.user).select("+password");
  if (!user) {
    throw new ApiRouteError("User not found.", 404);
  }

  user.password = body.password!;
  await user.save();

  resetToken.usedAt = new Date();
  await resetToken.save();

  return apiSuccess({ reset: true }, { message: "Password updated. You can sign in now." });
});
