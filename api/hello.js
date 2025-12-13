// api/hello.js (Vercel)
module.exports = async function (req, res) {
  try {
    // query params: req.query for GET, body: req.body for POST
    const name = req.query?.name || 'world';
    return res.status(200).json({ hello: name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
};
