export default function handler(req, res) {
  res.json({ ok: true, now: new Date().toISOString() });
}
