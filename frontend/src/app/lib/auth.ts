import { cookies } from "next/headers";

export const AUTH_COOKIE = "@app:token";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function isAuthenticated() {
  return Boolean(await getAuthToken());
}