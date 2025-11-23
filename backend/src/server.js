// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

/**
 * Health Check
 */
app.get("/healthz", (req, res) => {
  res.json({
    status: "up",
    ok: true,
    version: "1.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /links – List all links
 */
app.get("/links", async (req, res) => {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(
    links.map((l) => ({
      id: l.id,
      code: l.code,
      url: l.targetUrl, // frontend expects 'url'
      totalClicks: l.totalClicks ?? 0,
      createdAt: l.createdAt,
      lastClickedAt: l.lastClickedAt,
      shortUrl: `${BASE_URL}/${l.code}`, // correct Render domain
    }))
  );
});

/**
 * POST /links – Create a short link
 */
app.post("/links", async (req, res) => {
  const { url, code } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  const finalCode = code || Math.random().toString(36).substring(2, 8);

  const exists = await prisma.link.findUnique({ where: { code: finalCode } });
  if (exists) return res.status(409).json({ message: "Code already exists" });

  const link = await prisma.link.create({
    data: { code: finalCode, targetUrl: url },
  });

  res.status(201).json({
    id: link.id,
    code: link.code,
    url: link.targetUrl,
    totalClicks: link.totalClicks,
    createdAt: link.createdAt,
    lastClickedAt: link.lastClickedAt,
    shortUrl: `${BASE_URL}/${link.code}`,
  });
});

/**
 * GET /links/:code/stats
 */
app.get("/links/:code/stats", async (req, res) => {
  const { code } = req.params;
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) return res.status(404).json({ message: "Link not found" });

  res.json({
    id: link.id,
    code: link.code,
    url: link.targetUrl,
    totalClicks: link.totalClicks,
    createdAt: link.createdAt,
    lastClickedAt: link.lastClickedAt,
    shortUrl: `${BASE_URL}/${link.code}`,
  });
});

/**
 * DELETE /links/:id
 */
app.delete("/links/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.link.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Link not found" });
  }
});

/**
 * Redirect for short link
 * (MUST BE LAST)
 */
app.get("/:code", async (req, res) => {
  const { code } = req.params;
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) return res.status(404).send("Short code not found");

  await prisma.link.update({
    where: { code },
    data: {
      totalClicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  return res.redirect(link.targetUrl);
});

app.listen(PORT, () => {
  console.log(`Backend running → ${BASE_URL}`);
});
