import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

// Backend URL for redirect short links
const BASE_URL = "https://tinylink-backend-z4fw.onrender.com";

// Allow only frontend domain for CORS
app.use(
  cors({
    origin: "https://tinylink-updated-frontend-latest.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/
app.get("/healthz", (req, res) => {
  res.json({ status: "up", ok: true });
});

/*
|--------------------------------------------------------------------------
| GET /links
|--------------------------------------------------------------------------
*/
app.get("/links", async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(
      links.map((l) => ({
        id: l.id,
        code: l.code,
        url: l.targetUrl,
        totalClicks: l.totalClicks ?? 0,
        createdAt: l.createdAt,
        lastClickedAt: l.lastClickedAt,
        shortUrl: `${BASE_URL}/${l.code}`,
      }))
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch links", error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| POST /links
|--------------------------------------------------------------------------
*/
app.post("/links", async (req, res) => {
  const { url, code } = req.body;

  if (!url)
    return res.status(400).json({ message: "URL field is required!" });

  let finalCode = code || Math.random().toString(36).substring(2, 8);

  try {
    const exists = await prisma.link.findUnique({ where: { code: finalCode } });
    if (exists)
      return res.status(409).json({ message: "Code already exists" });

    const link = await prisma.link.create({
      data: { code: finalCode, targetUrl: url },
    });

    res.status(201).json({
      id: link.id,
      code: link.code,
      url: link.targetUrl,
      totalClicks: link.totalClicks ?? 0,
      createdAt: link.createdAt,
      lastClickedAt: link.lastClickedAt,
      shortUrl: `${BASE_URL}/${link.code}`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create link", error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| GET /links/:code/stats
|--------------------------------------------------------------------------
*/
app.get("/links/:code/stats", async (req, res) => {
  try {
    const link = await prisma.link.findUnique({
      where: { code: req.params.code },
    });

    if (!link) return res.status(404).json({ message: "Link not found" });

    res.json({
      ...link,
      totalClicks: link.totalClicks ?? 0,
      shortUrl: `${BASE_URL}/${link.code}`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE /links/:id
|--------------------------------------------------------------------------
*/
app.delete("/links/:id", async (req, res) => {
  try {
    await prisma.link.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Link not found" });
  }
});

/*
|--------------------------------------------------------------------------
| Redirect Handler (must be last)
|--------------------------------------------------------------------------
*/
app.get("/:code", async (req, res) => {
  try {
    const link = await prisma.link.findUnique({
      where: { code: req.params.code },
    });

    if (!link) return res.status(404).send("Short code not found");

    await prisma.link.update({
      where: { code: link.code },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    res.redirect(link.targetUrl);
  } catch (err) {
    res.status(500).send("Redirect failed");
  }
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
  console.log(`🚀 Backend LIVE → ${BASE_URL}`);
});
