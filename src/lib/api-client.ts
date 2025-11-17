/**
 * Cliente API helper para hacer peticiones autenticadas
 * Asegura que todas las peticiones incluyan credentials: 'include' para enviar cookies
 */

export interface ApiClientOptions extends RequestInit {
  body?: any;
}

export async function apiClient(
  url: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { body, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  return fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include', // Siempre incluir cookies
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
}

