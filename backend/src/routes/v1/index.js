import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express, { Router } from "express";
import { getPool } from "../../db/pool.js";
import { loadPersonas } from "../../services/aiPersonas.js";
import { runAssemblySearch } from "../../services/assemblySearch.js";
import { computeParliamentMembers } from "../../services/parliamentMembers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../../../package.json"), "utf8"),
);

const defaultPersonasPath = join(
  __dirname,
  "../../../../config/ai_personas.json",
);

const PARLIAMENT_CACHE_TTL_MS = 600_000;
/** @type {{ expires: number; max: number; payload: string | null }} */
let parliamentCache = { expires: 0, max: 0, payload: null };

export const v1Router = Router();

v1Router.use(express.urlencoded({ extended: true }));
v1Router.use(express.json({ limit: "2mb" }));

v1Router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    version: "v1",
    name: pkg.name,
    packageVersion: pkg.version,
    time: new Date().toISOString(),
  });
});

v1Router.get("/ai/personas", (_req, res) => {
  const path =
    process.env.AI_PERSONAS_JSON_PATH &&
    process.env.AI_PERSONAS_JSON_PATH.length > 0
      ? process.env.AI_PERSONAS_JSON_PATH
      : defaultPersonasPath;
  try {
    const personas = loadPersonas(path);
    res.json({ personas });
  } catch (e) {
    console.error("ai personas", e);
    res.status(500).json({ error: "Failed to load personas" });
  }
});

/** Same contract as Symfony DefaultController::parliamentMembersAction (JMS shape: success + data). */
async function parliamentMembersHandler(req, res) {
  const pool = getPool();
  if (!pool) {
    res.status(503).json({
      success: false,
      message: "DATABASE_URL is not configured on the API service",
    });
    return;
  }

  const maxRaw = req.query.max ?? req.body?.max;
  const max = Math.min(
    2000,
    Math.max(1, Number.parseInt(String(maxRaw ?? 600), 10) || 600),
  );

  const now = Date.now();
  if (
    parliamentCache.payload &&
    parliamentCache.expires > now &&
    parliamentCache.max === max
  ) {
    res.type("application/json").send(parliamentCache.payload);
    return;
  }

  try {
    const data = await computeParliamentMembers(pool, max);
    const body = JSON.stringify({ success: true, data });
    parliamentCache = {
      expires: now + PARLIAMENT_CACHE_TTL_MS,
      max,
      payload: body,
    };
    res.type("application/json").send(body);
  } catch (err) {
    console.error("parliament members error", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Server error",
    });
  }
}

v1Router.get("/parliament/members", parliamentMembersHandler);
v1Router.post("/parliament/members", parliamentMembersHandler);

/** DataTables JSON — same envelope as Symfony createApiResponse (root object). */
v1Router.post("/assembly/search", async (req, res) => {
  const pool = getPool();
  if (!pool) {
    res.status(503).json({
      draw: toIntSafe(req.body?.draw, 1),
      recordsTotal: 0,
      recordsFiltered: 0,
      items: [],
      error: "DATABASE_URL is not configured on the API service",
    });
    return;
  }
  try {
    const output = await runAssemblySearch(pool, req.body);
    res.json(output);
  } catch (err) {
    console.error("assembly search error", err);
    res.status(500).json({
      draw: toIntSafe(req.body?.draw, 1),
      recordsTotal: 0,
      recordsFiltered: 0,
      items: [],
      error: err instanceof Error ? err.message : "Server error",
    });
  }
});

function toIntSafe(v, d) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : d;
}
