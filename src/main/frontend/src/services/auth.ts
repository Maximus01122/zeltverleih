import axios from 'axios';
import { apiUrl, clearToken, setToken } from '@/services/api';

export async function login(username: string, password: string): Promise<void> {
    const response = await axios.post(apiUrl('/api/auth/login'), { username, password });
    setToken(response.data.token);
}

export async function logout(): Promise<void> {
    try {
        await axios.post(apiUrl('/api/auth/logout'));
    } catch {
        // Token trotzdem lokal entfernen
    } finally {
        clearToken();
    }
}
