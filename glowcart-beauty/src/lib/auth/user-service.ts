import { env } from "@/config/env";
import { connectDB } from "@/lib/db";
import { User, type UserDocument } from "@/models/User";
import type { UserRole } from "@/types/user";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
};

export type OAuthProfileInput = {
  email: string;
  name?: string | null;
  image?: string | null;
};

function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    image: user.image ?? undefined,
  };
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  await connectDB();
  return User.findOne({ email: email.trim().toLowerCase() });
}

export async function findUserByEmailWithPassword(
  email: string
): Promise<UserDocument | null> {
  await connectDB();
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password"
  );
  return user as UserDocument | null;
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  await connectDB();
  return User.findById(id);
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const user = await findUserByEmailWithPassword(email);

  if (!user?.password) {
    return null;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return null;
  }

  return toSafeUser(user);
}

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export async function registerUser(input: RegisterUserInput): Promise<SafeUser> {
  await connectDB();

  const email = input.email.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const user = await User.create({
    name: input.name.trim(),
    email,
    password: input.password,
    role: input.role ?? "customer",
  });

  return toSafeUser(user);
}

export async function findOrCreateOAuthUser(
  profile: OAuthProfileInput
): Promise<SafeUser> {
  await connectDB();

  const email = profile.email.trim().toLowerCase();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: profile.name?.trim() || email.split("@")[0],
      email,
      image: profile.image ?? undefined,
      role: "customer",
      emailVerified: new Date(),
    });
  } else if (profile.image && !user.image) {
    user.image = profile.image;
    await user.save();
  }

  return toSafeUser(user);
}

export async function ensureAdminSeedUser(): Promise<void> {
  await connectDB();

  const adminEmail = env.adminEmail;
  const adminPassword = env.adminPassword;

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }

  await User.create({
    name: env.adminName,
    email: adminEmail.toLowerCase(),
    password: adminPassword,
    role: "admin",
  });
}
