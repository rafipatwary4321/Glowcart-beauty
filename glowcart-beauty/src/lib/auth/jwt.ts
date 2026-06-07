import jwt from "jsonwebtoken";

import { env } from "@/config/env";

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

const JWT_EXPIRES_IN = "7d";

function getJwtSecret(): string {
  const secret = env.authSecret;
  if (!secret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required for JWT operations.");
  }
  return secret;
}

/**
 * Placeholder JWT helpers for future mobile/API clients.
 * NextAuth continues to handle web session auth for now.
 */
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}
