import cors from "cors";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { v1Router } from "./routes/v1/index.js";

const app = express();
const port = Number(process.env.PORT) || 3001;
const symfonyTarget =
  process.env.SYMFONY_PROXY_TARGET || "http://127.0.0.1:8080";

app.set("trust proxy", 1);

/** Versioned JSON API implemented in Node (add routes here; do not proxy these). */
app.use("/api/v1", v1Router);

/** Legacy BFF: forward remaining browser calls to Symfony. */
app.use(
  "/api/symfony",
  createProxyMiddleware({
    target: symfonyTarget,
    changeOrigin: true,
    pathRewrite: { "^/api/symfony": "" },
    xfwd: true,
  }),
);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    symfonyProxyTarget: symfonyTarget,
    v1: "/api/v1/health",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${port}`);
  console.log(`JSON API: /api/v1/*`);
  console.log(`Symfony proxy: /api/symfony/* → ${symfonyTarget}`);
});
