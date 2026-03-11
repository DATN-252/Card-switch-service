import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://localhost:8083/merchants?size=1000', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add system API key if the endpoint ever requires it
                'X-System-Api-Key': 'bkbank-internal-system-api-key-2025'
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
