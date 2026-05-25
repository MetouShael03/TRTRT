# Metoushela Agent — REST API

API REST Node.js/Express connectée à Gemini, personnalisée comme **Metoushela Agent**, créée par **Metoushela Walker**.

## Installation

```bash
npm install
```

Crée un fichier `.env` :

```
GEMINI_API_KEY=ta_cle_api_ici
PORT=3000
```

Lance le serveur :

```bash
node index.js
```

---

## Routes

### GET /
Vérifie que l'API tourne.

**Réponse :**
```json
{
  "message": "Metoushela Agent est en ligne.",
  "creator": "Metoushela Walker",
  "version": "1.0.0",
  "routes": ["POST /ask", "POST /vision"]
}
```

---

### POST /ask
Pose une question en texte.

**Body JSON :**
```json
{
  "question": "C'est quoi la capitale du Congo ?"
}
```

**Réponse :**
```json
{
  "agent": "Metoushela Agent",
  "answer": "La capitale de la RDC c'est Kinshasa !"
}
```

---

### POST /vision
Envoie une image en base64 avec une question optionnelle.

**Body JSON :**
```json
{
  "question": "Qu'est-ce que tu vois sur cette image ?",
  "image": "base64_de_l_image_ici",
  "mimeType": "image/jpeg"
}
```

**Réponse :**
```json
{
  "agent": "Metoushela Agent",
  "answer": "Je vois une voiture rouge garée devant un bâtiment..."
}
```

> `mimeType` accepte : `image/jpeg`, `image/png`, `image/webp`  
> Si `question` est absent, l'agent décrit l'image automatiquement.

---

## Clé API Gemini

Obtiens ta clé gratuite sur [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

*Created by Metoushela Walker — Bukavu, DRC*
