import { useCallback, useEffect, useState } from 'react';
import QuoteRequestService, { QuoteRequest } from '@/services/QuoteRequestService';
import Menu from '@/tabs/navigation/menuNew';
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
        <div className="grid grid-cols-[140px_1fr] gap-2 py-1.5 border-b last:border-0">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-sm">{value}</span>
        </div>
    );
}

export default function AnfragenOverview() {
    const [anfragen, setAnfragen] = useState<QuoteRequest[]>([]);
    const [selected, setSelected] = useState<QuoteRequest | null>(null);
    const [loading, setLoading] = useState(true);

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
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight">Anfragen</h2>
                        {anfragen.filter(a => !a.processed).length > 0 && (
                            <Badge variant="destructive">
                                {anfragen.filter(a => !a.processed).length} offen
                            </Badge>
                        )}
                    </div>
                    <Toaster position="top-right" richColors closeButton />
                    <Menu />
                </div>

                <p className="text-sm text-muted-foreground">
                    Eingehende Anfragen vom Kontaktformular auf zeltverleiherfurt.de
                </p>

                {loading ? (
                    <p className="text-muted-foreground">Laden …</p>
                ) : anfragen.length === 0 ? (
                    <p className="text-muted-foreground">Noch keine Anfragen eingegangen.</p>
                ) : (
                    <div className="rounded-md border">
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
                )}
            </div>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
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
                            <div className="flex gap-2 pt-4">
                                <Button asChild variant="outline">
                                    <a href={`mailto:${selected.email}`}>E-Mail schreiben</a>
                                </Button>
                                <Button
                                    variant={selected.processed ? 'outline' : 'default'}
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
