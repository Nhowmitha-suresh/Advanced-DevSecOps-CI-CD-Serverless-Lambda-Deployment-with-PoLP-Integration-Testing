module.exports = (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
};
