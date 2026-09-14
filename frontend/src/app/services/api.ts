export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function api(endpoint: string, init?: RequestInit) {
  // Pega o token salvo nos cookies (para chamadas autenticadas)
  const token = typeof window !== "undefined"
    ? document.cookie.split("; ").find(row => row.startsWith("@app:token="))?.split("=")[1]
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...init?.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers,
  });

  return response;
}