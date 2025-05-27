export default async function api<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const base = import.meta.env.VITE_API_URL ?? '';
  const token = localStorage.getItem('token');
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((opts.headers as Record<string,string>) || {}),
  };
  const res = await fetch(base + path, { ...opts, headers });
  if (res.status === 401) {
    window.location.href = '/';
    throw new Error('No autorizado');
  }
  return res.json();
}