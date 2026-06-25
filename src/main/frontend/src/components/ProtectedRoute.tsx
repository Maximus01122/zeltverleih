import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { authed } = useAuth();

    if (!authed) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
