import { SignJWT, jwtVerify } from "jose";

/**
 * Lightweight single-admin session (jose-signed JWT in an HttpOnly cookie).
 * Chosen over NextAuth v5 for reliability on the bleeding-edge Next 16 runtime.
 * Credentials live in env (ADMIN_EMAIL / ADMIN_PASSWORD); signing key in AUTH_SECRET.
 */
export const SESSION_COOKIE = "gg_admin";
const DAY = 60 * 60 * 24;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function createSession(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${30 * DAY}s`)
    .sign(secret());
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const okEmail = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;
  const okPass = process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
  return Boolean(okEmail && okPass);
}
