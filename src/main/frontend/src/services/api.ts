/**
 * Central API base-URL helper.
 *
 * Set REACT_APP_API_BASE in your .env (or the Docker image env) to point at
 * any backend host.  Falls back to http://localhost:8080 for local development.
 *
 * Example .env.production:
 *   REACT_APP_API_BASE=https://api.myserver.com
 */
const BASE = (process.env.REACT_APP_API_BASE ?? 'http://localhost:8080').replace(/\/$/, '');

/**
 * Builds an absolute URL for the given API path.
 * Handles leading-slash variations so callers don't need to be consistent.
 */
export function apiUrl(path: string): string {
    return `${BASE}${path.startsWith('/') ? path : '/' + path}`;
}
