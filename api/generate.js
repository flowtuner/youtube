export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'sk-ant-DEIN-KEY-HIER') {
        return res.status(500).json({ error: 'Kein ANTHROPIC_API_KEY konfiguriert' });
    }

    const { model, system, messages, max_tokens } = req.body;

    const ALLOWED_MODELS = ['claude-opus-4-6', 'claude-sonnet-4-6'];

    if (!ALLOWED_MODELS.includes(model)) {
        return res.status(400).json({
            error: `Modell "${model}" nicht erlaubt. Erlaubt: ${ALLOWED_MODELS.join(', ')}`,
        });
    }

    try {
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
            return res.status(apiRes.status).json({
                error: `Anthropic API Fehler (${apiRes.status}): ${errText}`,
            });
        }

        // Stream durchreichen
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = apiRes.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                res.end();
                break;
            }
            res.write(decoder.decode(value));
        }
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        } else {
            res.end();
        }
    }
}
