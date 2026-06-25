import axios from 'axios';
import { apiUrl } from '@/services/api';

export type QuoteRequest = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    eventType?: string;
    eventDate?: string;
    guestCount?: string;
    tentCount?: string;
    tentSize?: string;
    deliveryPostalCode?: string;
    deliveryCity?: string;
    servicePackage?: string;
    accessories?: string;
    ground?: string;
    message?: string;
    receivedAt: string;
    processed: boolean;
    clientId?: number;
};

const BASE = apiUrl('/api/anfragen');

const getAll = async (): Promise<QuoteRequest[]> => {
    const response = await axios.get<QuoteRequest[]>(BASE);
    return response.data;
};

const getUnprocessedCount = async (): Promise<number> => {
    const response = await axios.get<{ count: number }>(`${BASE}/unprocessed/count`);
    return response.data.count;
};

const markProcessed = async (id: number, processed: boolean): Promise<QuoteRequest> => {
    const response = await axios.patch<QuoteRequest>(`${BASE}/${id}/processed`, { processed });
    return response.data;
};

const QuoteRequestService = { getAll, getUnprocessedCount, markProcessed };

export default QuoteRequestService;
