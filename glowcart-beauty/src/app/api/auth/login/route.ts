import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";

export const runtime = "nodejs";

import { validateLoginForm } from "@/lib/auth/validation";
import { authenticateUser } from "@/lib/auth/user-service";
import { getPostLoginRedirect } from "@/lib/auth/redirect";

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    callbackUrl?: string;
  };

  const validation = validateLoginForm({
    email: body.email ?? "",
    password: body.password ?? "",
  });

  if (!validation.valid) {
    throw new ApiRouteError("Validation failed.", 400, validation.errors);
  }

  const user = await authenticateUser(body.email!, body.password!);

  if (!user) {
    throw new ApiRouteError("Invalid email or password.", 401);
  }

  return apiSuccess({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
    redirectTo: getPostLoginRedirect(user.role, body.callbackUrl),
  });
});
