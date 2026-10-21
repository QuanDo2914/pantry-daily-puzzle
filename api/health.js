import { supply } from '../server/content.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'Unauthorized' });
  let result;
  try { result = supply(process.env.PANTRY_LAUNCH_DATE); } catch { return res.status(503).json({ error: 'Launch date not configured' }); }
  const low = result.remaining < 21;
  if (low && process.env.PANTRY_ALERT_WEBHOOK) {
    try {
      const response = await fetch(process.env.PANTRY_ALERT_WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: `Pantry content supply low: ${result.remaining} unpublished days; last day ${result.lastDate}.`, ...result }), signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw Error('Alert delivery failed');
    } catch { return res.status(502).json({ ...result, error: 'Alert delivery failed' }); }
  }
  return res.status(low ? 503 : 200).json({ ...result, low, alertConfigured: Boolean(process.env.PANTRY_ALERT_WEBHOOK) });
}
