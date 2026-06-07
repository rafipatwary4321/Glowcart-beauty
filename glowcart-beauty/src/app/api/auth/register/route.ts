import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";

export const runtime = "nodejs";

import { auth } from "@/auth";
import { validateRegisterForm } from "@/lib/auth/validation";
import { registerUser } from "@/lib/auth/user-service";

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  const validation = validateRegisterForm({
    name: body.name ?? "",
    email: body.email ?? "",
    password: body.password ?? "",
    confirmPassword: body.confirmPassword ?? "",
  });

  if (!validation.valid) {
    throw new ApiRouteError("Validation failed.", 400, validation.errors);
  }

  try {
    const user = await registerUser({
      name: body.name!,
      email: body.email!,
      password: body.password!,
      role: "customer",
    });

    return apiSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
        message: "Account created. You can sign in now.",
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      throw new ApiRouteError("An account with this email already exists.", 409);
    }
    throw error;
  }
});

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return apiSuccess({ authenticated: false });
  }

  return apiSuccess({
    authenticated: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      image: session.user.image,
    },
  });
}
