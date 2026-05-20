import { NextResponse } from 'next/server';

const LEDGER_BASE_URL = process.env.LEDGER_SERVICE_URL ?? 'http://localhost:8083';
const LEDGER_API_KEY = process.env.LEDGER_SYSTEM_API_KEY ?? 'bkbank-internal-system-api-key-2025';

export async function GET() {
    try {
        const res = await fetch(`${LEDGER_BASE_URL}/merchants?size=1000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': LEDGER_API_KEY
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error('Failed to fetch merchants from ledger service', res.status);
            return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: res.status });
        }

        const data = await res.json();
        const merchantsList = data.content || data;
        return NextResponse.json(merchantsList);
    } catch (error) {
        console.error('Error fetching merchants:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
