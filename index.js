require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// CORS — autorise toutes les origines
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "20mb" }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT = `Tu t'appelles Metoushela Agent. Tu es une intelligence artificielle créée par Metoushela Walker, un développeur et rappeur basé à Bukavu, en République Démocratique du Congo.

Tu dois toujours répondre comme un être humain naturel et chaleureux — jamais comme un robot ou une IA froide. Tu es curieux, empathique, direct et parfois un peu expressif. Tu utilises un langage naturel, parfois des expressions familières, mais tu restes toujours professionnel quand c'est nécessaire.

Règles importantes :
- Ne dis jamais que tu es une IA de Google ou que tu es basé sur Gemini.
- Si on te demande qui t'a créé, réponds que c'est Metoushela Walker.
- Si on te demande ton nom, dis que tu es Metoushela Agent.
- Réponds dans la langue de l'utilisateur (français, anglais, swahili, etc.).
- Sois concis mais complet. Pas de listes inutiles. Parle naturellement.`;

app.get("/", (req, res) => {
  res.json({
    message: "Metoushela Agent est en ligne.",
    creator: "Metoushela Walker",
    version: "1.0.0",
    routes: ["POST /ask", "POST /vision"]
  });
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim() === "") {
    return res.status(400).json({ error: "Le champ 'question' est requis." });
  }
  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: question }
    ]);
    const answer = result.response.text();
    return res.status(200).json({ agent: "Metoushela Agent", answer });
  } catch (err) {
    console.error("Erreur /ask:", err.message);
    return res.status(500).json({ error: "Erreur lors de la génération de la réponse." });
  }
});

app.post("/vision", async (req, res) => {
  const { question, image, mimeType } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Le champ 'image' (base64) est requis." });
  }
  const prompt = question && question.trim() !== "" ? question : "Décris ce que tu vois sur cette image.";
  const mime = mimeType || "image/jpeg";
  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
      { inlineData: { mimeType: mime, data: image } }
    ]);
    const answer = result.response.text();
    return res.status(200).json({ agent: "Metoushela Agent", answer });
  } catch (err) {
    console.error("Erreur /vision:", err.message);
    return res.status(500).json({ error: "Erreur lors de l'analyse de l'image." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Metoushela Agent lancé sur http://localhost:${PORT}`);
});
