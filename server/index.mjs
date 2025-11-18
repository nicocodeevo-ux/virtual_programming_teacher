import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { runCode } from './runner.mjs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Simple proxy endpoint to fetch arbitrary URLs server-side to avoid CORS.
// Usage: GET /fetch?url=https://example.com
app.get('/fetch', async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url param' });
  }

  try {
    const response = await fetch(url, {redirect: 'follow'});
    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(text);
  } catch (err) {
    console.error('Server fetch error', err);
    res.status(500).json({ error: 'Failed to fetch URL on server' });
  }
});

// Execute code inside a Docker-based sandbox. This endpoint accepts JSON:
// { language: 'python'|'javascript'|..., code: '...' }
// Response: { stdout, stderr, exitCode, timedOut }
app.post('/run', async (req, res) => {
  const { language, code } = req.body || {};
  if (!language || !code) {
    return res.status(400).json({ error: 'Missing language or code in request body' });
  }

  // Basic validation - allowed languages only
  const allowed = ['javascript', 'python', 'go', 'java', 'rust', 'kotlin'];
  if (!allowed.includes(language)) {
    return res.status(400).json({ error: `Language not supported. Supported: ${allowed.join(', ')}` });
  }

  try {
    const result = await runCode({ language, code, timeoutMs: 10000 });
    res.json(result);
  } catch (err) {
    console.error('Run error', err);
    res.status(500).json({ error: 'Execution failed on server', details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`VPT proxy server listening on http://localhost:${PORT}`);
});
