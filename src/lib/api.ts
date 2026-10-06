/**
 * Safe API URL resolver for web and native Capacitor Android environments.
 *
 * - In Web Browser / Local / Cloud Run preview: returns the relative route e.g. "/api/ai/advisor"
 * - In Native Android Build: if VITE_API_BASE_URL is set (e.g. https://zyro-api.example.com),
 *   it prepends the production base URL so native fetch requests reach your hosted server.
 */
export function getApiUrl(path: string): string {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!baseUrl) {
    return cleanPath;
  }
  return `${baseUrl.replace(/\/+$/, '')}${cleanPath}`;
}
