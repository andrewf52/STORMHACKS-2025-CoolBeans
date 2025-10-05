// Simple manual test runner (no Jest) for the analyze endpoint
import app from '../server.js';
import http from 'http';

const PORT = process.env.PORT || 3456;

function startServer() {
  return new Promise(resolve => {
    const server = app.listen(PORT, () => resolve(server));
  });
}

async function run() {
  const server = await startServer();
  const base = `http://localhost:${PORT}`;

  const healthRes = await fetch(`${base}/health`);
  const healthJson = await healthRes.json();
  console.log('Health:', healthJson);

  const analyzeRes = await fetch(`${base}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'This is absolutely wonderful news!' })
  });
  const analyzeJson = await analyzeRes.json();
  console.log('Analyze:', analyzeJson);

  server.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
