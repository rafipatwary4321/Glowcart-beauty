import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { findMockUserByEmail } from "@/lib/auth/mock-users";
import { validateRegisterForm } from "@/lib/auth/validation";

export async function POST(request: Request) {
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
    return NextResponse.json(
      { message: "Validation failed.", errors: validation.errors },
      { status: 400 }
    );
  }

  const email = body.email!.trim().toLowerCase();

  if (findMockUserByEmail(email)) {
    return NextResponse.json(
      { message: "An account with this email already exists." },
      { status: 409 }
    );
  }

  /**
   * Placeholder registration — persists only in server memory for the current process.
   * Replace with database persistence when backend auth is implemented.
   */
  const { addMockUser } = await import("@/lib/auth/mock-users");
  addMockUser({
    name: body.name!.trim(),
    email,
    password: body.password!,
    role: "customer",
  });

  return NextResponse.json(
    { message: "Account created. You can sign in now." },
    { status: 201 }
  );
}

export async function GET() {
  const session = await auth();
  return NextResponse.json({ authenticated: Boolean(session) });
}
