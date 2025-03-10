import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { action, target, scanType } = body;

    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        let endpoint, method, requestBody;

        switch (action) {
            case 'get':
                if (scanType === 'file') {
                    endpoint = `https://www.virustotal.com/api/v3/files/${target}`;
                } else if (scanType === 'url') {
                    const urlId = btoa(target).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                    endpoint = `https://www.virustotal.com/api/v3/urls/${urlId}`;
                } else if (scanType === 'domain') {
                    endpoint = `https://www.virustotal.com/api/v3/domains/${target}`;
                }
                method = 'GET';
                break;

            case 'submit':
                endpoint = 'https://www.virustotal.com/api/v3/urls';
                method = 'POST';
                requestBody = `url=${encodeURIComponent(target)}`;
                break;

            case 'analysis':
                endpoint = `https://www.virustotal.com/api/v3/analyses/${target}`;
                method = 'GET';
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const headers = {
            'x-apikey': apiKey,
            'Content-Type': action === 'submit' ? 'application/x-www-form-urlencoded' : 'application/json'
        };

        const response = await fetch(endpoint, {
            method,
            headers,
            body: requestBody
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}