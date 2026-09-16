export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export type ApiRequestInit = RequestInit & {
	token?: string;
};

export async function api(endpoint: string, init: ApiRequestInit = {}) {
	const { token, headers: requestHeaders, ...requestInit } = init;
	const headers = new Headers(requestHeaders);

	if (requestInit.body && !(requestInit.body instanceof FormData) && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return fetch(`${API_URL}${endpoint}`, {
		...requestInit,
		signal: requestInit.signal ?? AbortSignal.timeout(10000),
		headers,
	});
}