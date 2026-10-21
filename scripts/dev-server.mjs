import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import daily from '../api/daily.js';
import { dailyBoard } from '../server/content.js';
import { utcDate, dateMillis, DAY } from '../src/game/daily.js';
const root = path.resolve('dist'), port = Number(process.env.PORT || 4176);
const preview = process.env.PANTRY_LOCAL_PREVIEW === '1';
const launch = process.env.PANTRY_LAUNCH_DATE;
if (preview && !launch) throw Error('Set an explicit preview PANTRY_LAUNCH_DATE');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.status = code => { res.statusCode = code; return res; };
  res.json = data => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
  if (url.pathname === '/api/daily') {
    if (!preview) return daily(req, res);
    try {
      const n = url.searchParams.get('day');
      if (n && (!/^\d+$/.test(n) || Number(n) > 10000)) throw Error('Invalid preview day');
      const date = n ? utcDate(dateMillis(launch) + (Number(n) - 1) * DAY) : utcDate();
      res.setHeader('Cache-Control', 'no-store');
      return res.json(dailyBoard({ launch, date, mode: url.searchParams.get('mode') || 'medium', preview: true }));
    } catch (error) { return res.status(error.status || 503).json({ error: error.message }); }
  }
  if (url.pathname.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  let filename;
  try { filename = path.resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`); } catch { return res.status(400).end(); }
  if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) return res.status(404).end('Not found');
  res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream'); res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(filename).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Pantry → http://127.0.0.1:${port} (${preview ? `LOCAL PREVIEW; schedule begins ${launch}` : 'daily endpoint; preview controls disabled'})`));
