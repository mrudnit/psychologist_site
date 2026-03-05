const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// normalize: remove trailing slash to avoid //api/... issues
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '')

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

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    // Network/CORS/DNS/backend down
    throw new Error('Network error: cannot reach the server. Please try again later.')
  }

  if (res.status === 401) {
    auth.clearToken()
  }

  // Try to parse JSON, but handle non-JSON responses gracefully
  let data: any = null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    data = await res.json()
  } else {
    const text = await res.text()
    data = { error: text }
  }

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