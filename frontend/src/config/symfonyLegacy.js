/**
 * When the Vite dev server runs on another origin than Symfony, set
 * VITE_SYMFONY_ORIGIN (e.g. http://localhost:8080) so “classic site” links hit PHP.
 * Leave unset when the built SPA is served from the same host as Symfony.
 */
export function symfonyUrl(path) {
  const raw = import.meta.env.VITE_SYMFONY_ORIGIN ?? ''
  const base = String(raw).replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}
