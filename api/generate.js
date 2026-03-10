export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'sk-ant-DEIN-KEY-HIER') {
        return new Response(JSON.stringify({ error: 'Kein ANTHROPIC_API_KEY konfiguriert' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await req.json();
        const { model, system, messages, max_tokens } = body;

        const ALLOWED_MODELS = ['claude-opus-4-6', 'claude-sonnet-4-6'];

        if (!ALLOWED_MODELS.includes(model)) {
            return new Response(
                JSON.stringify({ error: `Modell "${model}" nicht erlaubt. Erlaubt: ${ALLOWED_MODELS.join(', ')}` }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model,
                max_tokens: max_tokens || 8192,
                system,
                messages,
                stream: true,
            }),
        });

        if (!apiRes.ok) {
            const errText = await apiRes.text();
            return new Response(
                JSON.stringify({ error: `Anthropic API Fehler (${apiRes.status}): ${errText}` }),
                { status: apiRes.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Stream direkt durchreichen – Edge Runtime unterstützt das nativ
        return new Response(apiRes.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
