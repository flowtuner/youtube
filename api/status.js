export default function handler(req, res) {
    res.status(200).json({
          status: 'ok',
          provider: 'Anthropic',
          port: process.env.PORT || 3333
    });
}
