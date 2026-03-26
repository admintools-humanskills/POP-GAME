# POP GAME - Le Moteur de Jeux

Une expérience immersive et experte pour trouver le jeu de societe parfait selon votre personnalite ou votre evenement, propulsee par l'IA Gemini.

## Stack

- **Frontend** : React 19 + TypeScript + Vite 6 + Tailwind CSS 4
- **IA** : Google Gemini (via Cloud Function proxy)
- **Font** : Montserrat

## Architecture

```
Frontend (Vite) → VITE_GEMINI_PROXY_URL → Cloud Function (gemini-proxy) → Gemini API
```

- Le frontend appelle la Cloud Function via `VITE_GEMINI_PROXY_URL`
- La Cloud Function detient la `GEMINI_API_KEY` cote serveur
- Modeles IA (fallback) : `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.0-flash-lite`
- Retry : 2 tentatives par modele avec backoff sur erreurs 503

## Setup local

### Prerequisites

- Node.js

### Installation

```bash
npm install
```

### Variables d'environnement

Copier `.env.example` en `.env` et renseigner :

```env
VITE_GEMINI_PROXY_URL=<url de la cloud function gemini proxy>
```

### Lancer en local

```bash
npm run dev
```

L'app tourne sur `http://localhost:3000`

## Cloud Function (Gemini Proxy)

Source : `functions/gemini-proxy/`

La Cloud Function recoit les requetes du frontend et appelle l'API Gemini avec la cle API stockee en variable d'environnement serveur (`GEMINI_API_KEY`).

## Structure du projet

```
├── App.tsx                  # Composant principal
├── index.tsx                # Point d'entree React
├── index.css                # Styles Tailwind + theme Pop
├── index.html               # HTML template
├── geminiService.ts         # Service d'appel au proxy Gemini
├── types.ts                 # Types TypeScript
├── vite.config.ts           # Config Vite
├── functions/
│   └── gemini-proxy/
│       ├── index.js         # Cloud Function proxy
│       └── package.json
└── package.json
```
