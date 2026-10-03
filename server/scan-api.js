// Small API that reads a photo of a prescription with Claude vision and
// returns the prescribed medications as JSON. The Anthropic key stays on this
// server (ANTHROPIC_API_KEY); the app never sees it. Images are processed in
// memory and are never written to disk or logged.
//
//   npm run scan-api        (reads .env if present)
//   POST /api/scan-prescription  { "image": "<base64>", "mediaType": "image/jpeg" }

const http = require("http");
const Anthropic = require("@anthropic-ai/sdk").default;

const PORT = Number(process.env.SCAN_API_PORT || 3001);
const MODEL = process.env.SCAN_MODEL || "claude-opus-5-5";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // Claude's per-image limit
const MAX_BODY_BYTES = Math.ceil(MAX_IMAGE_BYTES * 1.4); // base64 overhead + JSON
const RATE_LIMIT = { windowMs: 60_000, max: 10 };
const MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const client = new Anthropic();

const SYSTEM_PROMPT = `You read photos of medical prescriptions (ordonnances) for a pharmacy app used in Côte d'Ivoire. Prescriptions are usually in French and may be handwritten.

List every prescribed medication exactly as written, one entry per product. Use the brand or generic name as it appears and keep the strength with it in "strength" (for example "500 mg"). Set "quantity" to the number of boxes or units the prescription asks for, or 1 if it does not say. Copy the dosing directions into "instructions" when they are present.

Never guess an illegible word or invent a medication. If a name is only partly readable, return what you can read and lower "legibility". If the image is not a prescription, set "is_prescription" to false and return no medications. This output is shown to the patient to double-check, not used for dispensing.`;

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    is_prescription: { type: "boolean" },
    legibility: { type: "string", enum: ["good", "partial", "poor"] },
    medications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          strength: { type: ["string", "null"] },
          quantity: { type: "integer" },
          instructions: { type: ["string", "null"] },
        },
        required: ["name", "strength", "quantity", "instructions"],
        additionalProperties: false,
      },
    },
    notes: { type: ["string", "null"] },
  },
  required: ["is_prescription", "legibility", "medications", "notes"],
  additionalProperties: false,
};

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    Connection: "close",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        // Drain and discard the rest so the 413 can still be delivered.
        chunks.length = 0;
        req.removeAllListeners("data");
        req.resume();
        reject(Object.assign(new Error("Image trop volumineuse (5 Mo maximum)."), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function scanPrescription(image, mediaType) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    output_config: { effort: "low", format: { type: "json_schema", schema: RESULT_SCHEMA } },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
          { type: "text", text: "Extract the medications from this prescription." },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw Object.assign(new Error("L'analyse de cette image a été refusée."), { status: 422 });
  }
  if (response.stop_reason === "max_tokens") {
    throw Object.assign(new Error("L'ordonnance est trop longue à analyser."), { status: 422 });
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text) throw Object.assign(new Error("Réponse vide du service d'analyse."), { status: 502 });
  return JSON.parse(text.text);
}

function errorResponse(err) {
  if (err.status && err.expose !== false && !(err instanceof Anthropic.APIError)) {
    return { status: err.status, message: err.message };
  }
  if (err instanceof Anthropic.RateLimitError) {
    return { status: 503, message: "Service d'analyse surchargé, réessayez dans un instant." };
  }
  if (err instanceof Anthropic.AuthenticationError) {
    return { status: 503, message: "Clé API Anthropic invalide côté serveur." };
  }
  if (err instanceof Anthropic.BadRequestError) {
    return { status: 422, message: "Image non acceptée par le service d'analyse." };
  }
  if (err instanceof Anthropic.APIError || err instanceof Anthropic.APIConnectionError) {
    return { status: 502, message: "Service d'analyse indisponible." };
  }
  if (/authentication|api key|credentials/i.test(err.message || "")) {
    return { status: 503, message: "ANTHROPIC_API_KEY manquante côté serveur." };
  }
  return { status: 500, message: "Erreur interne." };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method === "GET" && url.pathname === "/status") return send(res, 200, { ok: true });
  if (req.method !== "POST" || url.pathname !== "/api/scan-prescription") {
    return send(res, 404, { error: "Introuvable." });
  }

  if (rateLimited(req.socket.remoteAddress || "unknown")) {
    return send(res, 429, { error: "Trop de demandes, patientez une minute." });
  }

  try {
    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch (err) {
      if (err.status) throw err;
      return send(res, 400, { error: "Requête invalide." });
    }

    const { image, mediaType } = payload || {};
    if (typeof image !== "string" || !MEDIA_TYPES.has(mediaType)) {
      return send(res, 400, { error: "Image manquante ou format non supporté (JPEG, PNG, WebP)." });
    }
    if (Buffer.byteLength(image, "base64") > MAX_IMAGE_BYTES) {
      return send(res, 413, { error: "Image trop volumineuse (5 Mo maximum)." });
    }

    send(res, 200, await scanPrescription(image, mediaType));
  } catch (err) {
    const { status, message } = errorResponse(err);
    if (status >= 500) console.error("[scan-api]", err.constructor.name, err.message);
    send(res, status, { error: message });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[scan-api] http://0.0.0.0:${PORT} (model ${MODEL})`);
});
