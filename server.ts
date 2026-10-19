import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Endpoint for station live metadata (CORS-free server proxy)
app.get('/api/station-metadata', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const apiRes = await fetch('https://cesarradio.realserver.es/api/nowplaying/rock_y_metal', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'Failed to fetch upstream metadata' });
    }

    const data = await apiRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=5');
    return res.json(data);
  } catch (error: unknown) {
    console.warn('Error fetching station metadata:', error);
    return res.status(502).json({ error: 'Upstream metadata server unreachable' });
  }
});

// Serve frontend: Vite middlewares in dev, static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
