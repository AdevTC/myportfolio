import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');

    if (!user) {
        return NextResponse.json({ error: 'User required' }, { status: 400 });
    }

    try {
        const fetchUrl = `https://wakatime.com/api/v1/users/${user}/stats/last_7_days`;
        // Fetch from WakaTime Public API
        const res = await fetch(fetchUrl);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`WakaTime API Error (${res.status}): ${errorText}`);
            return NextResponse.json({
                error: `Failed to fetch from WakaTime`,
                status: res.status,
                details: errorText
            }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('WakaTime Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
