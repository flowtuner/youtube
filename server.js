import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── .env laden ──────────────────────────────────────────────
function loadEnv() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) {
    console.error('\n❌  Keine .env-Datei gefunden!');
    console.error('   Kopiere .env.example → .env und trage deinen Anthropic API-Key ein.\n');
    process.exit(1);
  }
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Anführungszeichen entfernen
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnv();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = parseInt(process.env.PORT || '3333', 10);

if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'sk-ant-DEIN-KEY-HIER') {
  console.error('\n❌  Kein gültiger ANTHROPIC_API_KEY in der .env-Datei!');
  console.error('   Trage deinen Key ein: https://console.anthropic.com/settings/keys\n');
  process.exit(1);
}

// ── MIME-Types ───────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// ── Server ───────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── API Proxy: POST /api/generate ──────────────────────────
  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    for await (const chunk of req) body += chunk;

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Ungültiges JSON' }));
      return;
    }

    const { model, system, messages, max_tokens } = parsed;

    // Nur erlaubte Modelle
    const ALLOWED_MODELS = [
      'claude-opus-4-6',
      'claude-sonnet-4-6',
    ];

    if (!ALLOWED_MODELS.includes(model)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Modell "${model}" nicht erlaubt. Erlaubt: ${ALLOWED_MODELS.join(', ')}` }));
      return;
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
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Anthropic API Fehler (${apiRes.status}): ${errText}` }));
        return;
      }

      // Stream durchreichen
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

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
        res.writeHead(500, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: err.message }));
    }

    return;
  }

  // ── API Status: GET /api/status ────────────────────────────
  if (req.method === 'GET' && req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      connected: true,
      provider: 'Anthropic',
      keyPrefix: ANTHROPIC_API_KEY.slice(0, 10) + '...',
    }));
    return;
  }

  // ── Statische Dateien ──────────────────────────────────────
  let filePath = req.url === '/' ? '/kreis-der-exzellenz.html' : req.url;
  filePath = join(__dirname, filePath);

  const ext = extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  if (existsSync(filePath)) {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🌠 Kreis der Exzellenz – Server läuft');
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  Modelle: Claude Opus 4.6, Claude Sonnet 4.6`);
  console.log(`  ➜  API-Key: ${ANTHROPIC_API_KEY.slice(0, 10)}...`);
  console.log('');
});
