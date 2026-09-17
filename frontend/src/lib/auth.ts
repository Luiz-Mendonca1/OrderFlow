import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
};

export async function requiredUser(): Promise<AuthenticatedUser> {
  const token = (await cookies()).get("@app:token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      redirect("/login");
    }

    const user = (await response.json()) as AuthenticatedUser;

    return user;
  } catch {
    redirect("/login");
  }
}
