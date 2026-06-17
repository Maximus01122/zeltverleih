import {apiUrl} from "@/services/api";

export type CategoryDatum = { name: string; revenue: number };

async function handleFetch(path: string) {
  const res = await fetch(apiUrl(path));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Anfrage an ${path} fehlgeschlagen: ${res.status} ${res.statusText} - ${text}`);
  }

  const ct = res.headers.get("content-type") || ""
  const bodyText = await res.text();
  // If the response isn't JSON, include the body in the thrown error for debugging
  if (!ct.includes("application/json")) {
    // try to parse anyway if it looks like JSON
    try {
      return JSON.parse(bodyText)
    } catch (e) {
      throw new Error(`Unerwartetes Antwortformat von ${path}: ${bodyText.slice(0,500)}`)
    }
  }

  try {
    return JSON.parse(bodyText)
  } catch (e) {
    throw new Error(`JSON-Parsing fehlgeschlagen für ${path}: ${String(e)} - Inhalt: ${bodyText.slice(0,500)}`)
  }
}

export async function getIncomeByCategory(): Promise<CategoryDatum[]> {
  // backend returns List<Object[]> where each element is [category, value]
  const raw = await handleFetch('/statistik/incomeByCategory');
  if (!Array.isArray(raw)) return [];
  return raw.map((entry: any) => {
    // entry is expected as [category, number]
    const name = entry?.[0] ?? String(entry?.category ?? 'unknown');
    const value = Number(entry?.[1] ?? entry?.[2] ?? 0);
    return { name: String(name), revenue: Number(value) };
  });
}

export async function getMonthlyRevenue(): Promise<{year:number,month:number,revenue:number}[]> {
  return handleFetch('/statistik/revenue/monthly');
}

export async function getIncomeSummary(): Promise<{Netto:number,Brutto:number,Mehrwertsteuer:number}> {
  return handleFetch('/statistik/income');
}

export async function getCountService(): Promise<Record<string,number>>{
  return handleFetch('/statistik/countService');
}

export default { getIncomeByCategory, getMonthlyRevenue, getIncomeSummary, getCountService };
