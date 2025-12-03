// api/lambda.js - robust adapter for Vercel (supports CJS and ESM index.js handlers)
const path = require("path");

async function loadModule() {
  try {
    const m = require(path.join(__dirname, "..", "index.js"));
    return { mod: m, type: "cjs" };
  } catch (e) {
    try {
      const fileUrl = path.join(__dirname, "..", "index.js");
      const imported = await import(fileUrlToImportPath(fileUrl));
      return { mod: imported, type: "esm" };
    } catch (ie) {
      const error = new Error("Failed to load index.js as CJS or ESM");
      error.cause = { cjsErr: e && e.message, esmErr: ie && ie.message };
      throw error;
    }
  }
}

function fileUrlToImportPath(p) {
  const resolved = path.resolve(p);
  if (process.platform === "win32") {
    return "file:///" + resolved.replace(/\\/g, "/");
  } else {
    return "file://" + resolved;
  }
}

function tryParseBody(body) {
  if (!body) return null;
  if (typeof body === "object") return body;
  try { return JSON.parse(body); } catch { return body; }
}

function normalizeHandlerFromModule(mod) {
  if (!mod) return null;
  if (typeof mod === "function") return mod;
  if (mod.default && typeof mod.default === "function") return mod.default;
  if (mod.handler && typeof mod.handler === "function") return mod.handler;
  if (mod.main && typeof mod.main === "function") return mod.main;
  if (mod.lambdaHandler && typeof mod.lambdaHandler === "function") return mod.lambdaHandler;
  return null;
}

module.exports = async (req, res) => {
  try {
    const { mod } = await loadModule();
    const lambdaHandler = normalizeHandlerFromModule(mod);
    if (!lambdaHandler) {
      console.error("No handler function found in ../index.js. Module keys:", Object.keys(mod || {}));
      res.status(500).json({ error: "No handler found in index.js", keys: Object.keys(mod || {}) });
      return;
    }

    const event = {
      httpMethod: req.method,
      path: (req.url || "").split("?")[0],
      headers: req.headers || {},
      queryStringParameters: Object.keys(req.query || {}).reduce((acc, k) => {
        acc[k] = Array.isArray(req.query[k]) ? req.query[k][0] : req.query[k];
        return acc;
      }, {}),
      body: tryParseBody(req.body),
      isBase64Encoded: false,
    };

    const context = {};

    const result = await new Promise((resolve, reject) => {
      try {
        if (lambdaHandler.length >= 3) {
          lambdaHandler(event, context, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        } else {
          Promise.resolve(lambdaHandler(event, context)).then(resolve).catch(reject);
        }
      } catch (callErr) {
        reject(callErr);
      }
    });

    const statusCode = (result && result.statusCode) ? result.statusCode : 200;
    const headers = (result && result.headers) ? result.headers : { "content-type": "application/json" };
    let body = (result && result.body) ? result.body : result;
    if (typeof body === "object") body = JSON.stringify(body);

    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    res.status(statusCode).send(body);
  } catch (err) {
    console.error("Adapter error:", err && err.message ? err.message : err);
    const cause = err && err.cause ? err.cause : undefined;
    res.status(500).json({ error: "adapter_error", message: err && err.message ? err.message : String(err), cause });
  }
};
