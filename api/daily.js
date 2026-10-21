import { dailyBoard } from '../server/content.js';
import { utcDate, nextMidnight } from '../src/game/daily.js';
export default function handler(req, res) {
  const now = Date.now();
  try {
    // Public requests cannot select a future day, even on Vercel Preview.
    const url = new URL(req.url, 'http://localhost');
    const board = dailyBoard({ launch: process.env.PANTRY_LAUNCH_DATE, date: utcDate(now), mode: url.searchParams.get('mode') || 'medium', publicOrigin: process.env.PANTRY_PUBLIC_ORIGIN || '' });
    const ttl = Math.max(0, Math.min(60, Math.floor((nextMidnight(now) - now) / 1000) - 1));
    res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${ttl}, must-revalidate`);
    res.status(200).json(board);
  } catch (error) { res.setHeader('Cache-Control', 'no-store'); res.status(error.status || 503).json({ error: error.message }); }
}
