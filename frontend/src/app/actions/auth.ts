"use server";

import { api } from "@/app/lib/api";
import { clearAuthToken, setAuthToken } from "@/app/lib/auth";
import type { AuthResponse } from "@/app/lib/types";

export interface AuthActionState {
  success: boolean;
  error: string;
  redirectTo?: string;
}

const initialAuthState: AuthActionState = { success: false, error: "" };

export async function registerAction(
  prevState: { success: boolean; error: string; redirectTo?: string } | null,
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Preencha todos os campos." };
    }

    const response = await api("/users", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.error || "Erro ao criar conta." };
    }

    return { success: true, error: "", redirectTo: "/login" };
  } catch {
    return { success: false, error: "Falha na comunicação com o servidor." };
  }
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Informe e-mail e senha." };
    }

    // Requisição para a rota do seu AuthUserController
    const response = await api("/session", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as Partial<AuthResponse> & { error?: string };

    if (!response.ok) {
      return { success: false, error: data.error || "E-mail ou senha incorretos." };
    }

    if (!data.token) {
      return { success: false, error: "Resposta inválida do servidor." };
    }

    await setAuthToken(data.token);

    return { success: true, error: "", redirectTo: "/dashboard" };
  } catch {
    return { success: false, error: "Falha na comunicação com o servidor." };
  }
}

export async function logoutAction() {
  await clearAuthToken();
  return initialAuthState;
}