import axios from 'axios';

const TOKEN_KEY = 'auth_token';
const AUTH_CHANGED = 'auth:changed';
const AUTH_UNAUTHORIZED = 'auth:unauthorized';

/**
 * Central API base-URL helper.
 *
 * Set REACT_APP_API_BASE in your .env (or the Docker image env) to point at
 * any backend host.  Falls back to http://localhost:8080 for local development.
 *
 * Example .env.production:
 *   REACT_APP_API_BASE=https://app.zeltverleiherfurt.de
 */
const BASE = (process.env.REACT_APP_API_BASE ?? 'http://localhost:8080').replace(/\/$/, '');

/**
 * Builds an absolute URL for the given API path.
 * Handles leading-slash variations so callers don't need to be consistent.
 */
export function apiUrl(path: string): string {
    return `${BASE}${path.startsWith('/') ? path : '/' + path}`;
}

function parseTokenPayload(token: string): { exp?: number } | null {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(normalized));
    } catch {
        return null;
    }
}

export function isTokenValid(): boolean {
    const token = getToken();
    if (!token) return false;
    const payload = parseTokenPayload(token);
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now();
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_CHANGED));
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED));
}

/** @deprecated use isTokenValid() or useAuth() */
export function isAuthenticated(): boolean {
    return isTokenValid();
}

export function notifyUnauthorized(): void {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED));
}

export function subscribeAuth(listener: () => void): () => void {
    window.addEventListener(AUTH_CHANGED, listener);
    window.addEventListener(AUTH_UNAUTHORIZED, listener);
    return () => {
        window.removeEventListener(AUTH_CHANGED, listener);
        window.removeEventListener(AUTH_UNAUTHORIZED, listener);
    };
}

axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token && isTokenValid()) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isLoginRequest = error.config?.url?.includes('/api/auth/login');
            if (!isLoginRequest) {
                notifyUnauthorized();
            }
        }
        return Promise.reject(error);
    }
);
