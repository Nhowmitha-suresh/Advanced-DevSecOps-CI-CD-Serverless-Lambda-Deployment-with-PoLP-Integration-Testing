// api/lambda.js
// Adapter: turns an AWS-Lambda-style handler (from index.js) into a Vercel HTTP handler.
// Uses index.js (your package.json "main"). Adjust require path if your handler file changes.

const lambdaModule = require('../index.js'); // matches "main": "index.js" in your package.json
const lambdaHandler = lambdaModule.handler || lambdaModule.default || lambdaModule;

// helper to parse JSON body safely
function tryParseBody(body) {
  if (!body) return null;
  if (typeof body === 'object') return body;
  try { return JSON.parse(body); } catch { return body; }
}

module.exports = async (req, res) => {
  const event = {
    httpMethod: req.method,
    path: req.url.split('?')[0],
    headers: req.headers || {},
    queryStringParameters: Object.keys(req.query || {}).reduce((acc, k) => {
      acc[k] = Array.isArray(req.query[k]) ? req.query[k][0] : req.query[k];
      return acc;
    }, {}),
    body: tryParseBody(req.body),
    isBase64Encoded: false
  };

  const context = {}; // minimal stub

  try {
    const result = await new Promise((resolve, reject) => {
      // callback style (event, context, callback)
      if (lambdaHandler.length >= 3) {
        lambdaHandler(event, context, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      } else {
        // promise/async style
        Promise.resolve(lambdaHandler(event, context)).then(resolve).catch(reject);
      }
    });

    // support Lambda-style response { statusCode, headers, body }
    const statusCode = (result && result.statusCode) ? result.statusCode : 200;
    const headers = (result && result.headers) ? result.headers : { 'content-type': 'application/json' };
    let body = (result && result.body) ? result.body : result;

    if (typeof body === 'object') body = JSON.stringify(body);

    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    res.status(statusCode).send(body);
  } catch (err) {
    console.error('Lambda adapter error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err && err.message ? err.message : String(err) });
  }
};
