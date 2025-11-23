// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// Local Dev Port
const PORT = process.env.PORT || 5000;

// Local Backend URL
const BASE_URL = `http://localhost:${PORT}`;

// CORS for frontend access
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite frontend
  ],
  credentials: true
}));

app.use(express.json());

// =====================
// Health Check
// =====================
app.get("/healthz", (req, res) => {
  res.json({ status: "up", ok: true });
});

// =====================
// GET /links
// =====================
app.get("/links", async (req, res) => {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(
    links.map(l => ({
      id: l.id,
      code: l.code,
      url: l.targetUrl,
      totalClicks: l.totalClicks,
      createdAt: l.createdAt,
      lastClickedAt: l.lastClickedAt,
      shortUrl: `${BASE_URL}/${l.code}`,
    }))
  );
});

// =====================
// POST /links
// =====================
app.post("/links", async (req, res) => {
  const { targetUrl, code } = req.body;
  if (!targetUrl) return res.status(400).json({ message: "URL is required" });

  let finalCode = code || Math.random().toString(36).substring(2, 8);

  const exists = await prisma.link.findUnique({ where: { code: finalCode } });
  if (exists) return res.status(409).json({ message: "Code already exists" });

  const link = await prisma.link.create({
    data: { code: finalCode, targetUrl },
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

// =====================
// GET Stats
// =====================
app.get("/links/:code/stats", async (req, res) => {
  const link = await prisma.link.findUnique({ where: { code: req.params.code } });
  if (!link) return res.status(404).json({ message: "Link not found" });

  res.json({
    ...link,
    shortUrl: `${BASE_URL}/${link.code}`,
  });
});

// =====================
// DELETE Link
// =====================
app.delete("/links/:id", async (req, res) => {
  try {
    await prisma.link.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Link not found" });
  }
});

// =====================
// Redirect Short URL
// =====================
app.get("/:code", async (req, res) => {
  const link = await prisma.link.findUnique({ where: { code: req.params.code } });
  if (!link) return res.status(404).send("Short code not found");

  await prisma.link.update({
    where: { code: link.code },
    data: {
      totalClicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  res.redirect(link.targetUrl);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running locally → ${BASE_URL}`);
});
