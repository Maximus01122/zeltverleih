import { useCallback, useEffect, useState } from 'react';
import QuoteRequestService, { QuoteRequest } from '@/services/QuoteRequestService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { PageShell } from '@/components/PageShell';

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="grid grid-cols-1 gap-1 border-b py-2 last:border-0 sm:grid-cols-[140px_1fr] sm:gap-2 sm:py-1.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm">{value}</span>
        </div>
    );
}

function AnfrageCard({ req, onSelect }: { req: QuoteRequest; onSelect: () => void }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted/50"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                    <p className="font-medium">{req.name}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(req.receivedAt)}</p>
                </div>
                <Badge variant={req.processed ? 'secondary' : 'default'} className="shrink-0">
                    {req.processed ? 'Bearbeitet' : 'Offen'}
                </Badge>
            </div>
            <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                {req.eventType && <p>Veranstaltung: {req.eventType}</p>}
                {req.eventDate && <p>Datum: {req.eventDate}</p>}
                {req.tentSize && <p>Zelt: {req.tentSize}</p>}
            </div>
        </button>
    );
}

export default function AnfragenOverview() {
    const [anfragen, setAnfragen] = useState<QuoteRequest[]>([]);
    const [selected, setSelected] = useState<QuoteRequest | null>(null);
    const [loading, setLoading] = useState(true);

    const openCount = anfragen.filter(a => !a.processed).length;

    const load = useCallback(() => {
        setLoading(true);
        QuoteRequestService.getAll()
            .then(setAnfragen)
            .catch(() => toast.error('Anfragen konnten nicht geladen werden.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const toggleProcessed = async (req: QuoteRequest) => {
        try {
            const updated = await QuoteRequestService.markProcessed(req.id, !req.processed);
            setAnfragen(prev => prev.map(a => a.id === updated.id ? updated : a));
            setSelected(updated);
            toast.success(updated.processed ? 'Als bearbeitet markiert' : 'Wieder als offen markiert');
        } catch {
            toast.error('Status konnte nicht gespeichert werden.');
        }
    };

    return (
        <>
            <PageShell
                title="Anfragen"
                description="Eingehende Anfragen vom Kontaktformular auf zeltverleiherfurt.de"
                headerExtra={openCount > 0 ? (
                    <Badge variant="destructive">{openCount} offen</Badge>
                ) : undefined}
            >
                <Toaster position="top-center" richColors closeButton />

                {loading ? (
                    <p className="text-muted-foreground">Laden …</p>
                ) : anfragen.length === 0 ? (
                    <p className="text-muted-foreground">Noch keine Anfragen eingegangen.</p>
                ) : (
                    <>
                        <div className="space-y-3 md:hidden">
                            {anfragen.map(req => (
                                <AnfrageCard
                                    key={req.id}
                                    req={req}
                                    onSelect={() => setSelected(req)}
                                />
                            ))}
                        </div>

                        <div className="hidden overflow-x-auto rounded-md border md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Eingang</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Veranstaltung</TableHead>
                                        <TableHead>Datum</TableHead>
                                        <TableHead>Zelt</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {anfragen.map(req => (
                                        <TableRow
                                            key={req.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => setSelected(req)}
                                        >
                                            <TableCell className="whitespace-nowrap">
                                                {formatDate(req.receivedAt)}
                                            </TableCell>
                                            <TableCell className="font-medium">{req.name}</TableCell>
                                            <TableCell>{req.eventType || '—'}</TableCell>
                                            <TableCell>{req.eventDate || '—'}</TableCell>
                                            <TableCell>{req.tentSize || '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant={req.processed ? 'secondary' : 'default'}>
                                                    {req.processed ? 'Bearbeitet' : 'Offen'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </PageShell>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
                    {selected && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Anfrage von {selected.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-1">
                                <DetailRow label="Eingang" value={formatDate(selected.receivedAt)} />
                                {selected.clientId && (
                                    <DetailRow label="Kunden-ID" value={String(selected.clientId)} />
                                )}
                                <DetailRow label="Name" value={selected.name} />
                                <DetailRow label="E-Mail" value={selected.email} />
                                <DetailRow label="Telefon" value={selected.phone} />
                                <DetailRow label="Veranstaltung" value={selected.eventType} />
                                <DetailRow label="Datum" value={selected.eventDate} />
                                <DetailRow label="Gäste" value={selected.guestCount} />
                                <DetailRow label="Zelte" value={selected.tentCount} />
                                <DetailRow label="Zeltgröße" value={selected.tentSize} />
                                <DetailRow label="Lieferort" value={
                                    [selected.deliveryPostalCode, selected.deliveryCity]
                                        .filter(Boolean).join(' ') || undefined
                                } />
                                <DetailRow label="Service" value={selected.servicePackage} />
                                <DetailRow label="Zubehör" value={selected.accessories} />
                                <DetailRow label="Untergrund" value={selected.ground} />
                                <DetailRow label="Nachricht" value={selected.message} />
                            </div>
                            <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <a href={`mailto:${selected.email}`}>E-Mail schreiben</a>
                                </Button>
                                <Button
                                    variant={selected.processed ? 'outline' : 'default'}
                                    className="w-full sm:w-auto"
                                    onClick={() => toggleProcessed(selected)}
                                >
                                    {selected.processed ? 'Als offen markieren' : 'Als bearbeitet markieren'}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
