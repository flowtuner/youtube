export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const key = process.env.ANTHROPIC_API_KEY;

  if (!key || key === 'sk-ant-DEIN-KEY-HIER') {
    return res.status(500).json({
      connected: false,
      error: 'Kein ANTHROPIC_API_KEY konfiguriert',
    });
  }

  res.status(200).json({
    connected: true,
    provider: 'Anthropic',
    keyPrefix: key.slice(0, 10) + '...',
  });
}
