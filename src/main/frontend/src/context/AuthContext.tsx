import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isTokenValid, subscribeAuth } from '@/services/api';

type AuthContextValue = {
    authed: boolean;
};

const AuthContext = createContext<AuthContextValue>({ authed: false });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authed, setAuthed] = useState(isTokenValid);

    useEffect(() => {
        const sync = () => setAuthed(isTokenValid());
        const unsubscribe = subscribeAuth(sync);

        const interval = setInterval(sync, 5000);
        const onVisible = () => {
            if (document.visibilityState === 'visible') sync();
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            unsubscribe();
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ authed }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    return useContext(AuthContext);
}
