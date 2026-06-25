import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '@/tabs/navigation/logo.png';

export default function LoginPage() {
    const navigate = useNavigate();
    const { authed } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (authed) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/', { replace: true });
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 429) {
                setError('Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.');
            } else {
                setError('Benutzername oder Passwort ist falsch.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <img src={logo} alt="Zeltverleih Erfurt" className="h-12 w-12 mx-auto mb-2" />
                    <CardTitle>Mitarbeiter-Login</CardTitle>
                    <CardDescription>Zeltverleih Erfurt Buchungssystem</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Benutzername</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Passwort</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Anmelden …' : 'Anmelden'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
