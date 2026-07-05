import { ReactNode } from 'react';
import Menu from '@/tabs/navigation/menuNew';

type PageShellProps = {
    title: string;
    children: ReactNode;
    headerExtra?: ReactNode;
    description?: string;
};

export function PageShell({ title, children, headerExtra, description }: PageShellProps) {
    return (
        <div className="flex min-h-screen flex-col space-y-4 p-4 md:space-y-8 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        {headerExtra}
                    </div>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                <div className="shrink-0 self-start">
                    <Menu />
                </div>
            </div>
            {children}
        </div>
    );
}
