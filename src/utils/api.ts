const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Token storage helpers (sessionStorage so it clears on tab close)
export const auth = {
  getToken: () => sessionStorage.getItem('admin_token'),
  setToken: (t: string) => sessionStorage.setItem('admin_token', t),
  clearToken: () => sessionStorage.removeItem('admin_token'),
  isLoggedIn: () => !!sessionStorage.getItem('admin_token'),
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {}

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const t = token || auth.getToken()
  if (t) headers['Authorization'] = `Bearer ${t}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  // If unauthorized, clear token
  if (res.status === 401) {
    auth.clearToken()
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }

  return data as T
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>('GET', path, undefined, token),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  upload: <T>(path: string, formData: FormData) => request<T>('POST', path, formData),
}
