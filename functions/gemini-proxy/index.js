const functions = require('@google-cloud/functions-framework');
const { GoogleGenAI } = require('@google/genai');

functions.http('geminiProxy', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { mode, description, ageRange } = req.body;

  if (!mode || !description) {
    res.status(400).json({ error: 'Missing mode or description' });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured in environment');
    }

    const ai = new GoogleGenAI({ apiKey });
    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
    const MAX_RETRIES = 2;

    const systemInstruction = `
    Tu es "Le Moteur de Jeux" de Pop Game.
    Ton but : traduire un profil de joueur, une occasion sociale et un contexte d'âge en une sélection de 3 jeux de société parfaits.

    Ton ton : Enthousiaste, complice, expert, très dynamique. Tu parles français exclusivement. Utilise le langage des joueurs.

    Philosophie : Trouver le jeu parfait pour chaque joueur.

    Règles de réponse :
    1. Analyse le mode et surtout le contexte d'âge fourni : "${ageRange || 'Non spécifié (tous âges)'}".
       - Interprète intelligemment la maturité requise. Si l'utilisateur dit "enfants de 5 et 6 ans", propose des jeux adaptés au développement de cet âge. S'il dit "30-35 ans", oriente-toi vers des jeux plus complexes ou "party games" adultes.
       - Mode Cadeau : Focalise-toi sur la personnalité et l'adéquation au destinataire.
       - Mode Occasion : Focalise-toi sur l'ambiance et la logistique du groupe décrit.
    2. Propose EXACTEMENT TROIS (3) jeux de société réels et populaires (ex: 7 Wonders Duel, Dixit, Dobble, Les Aventuriers du Rail, Unlock!, Catan, Splendor, Azul, Exploding Kittens, Skull, Time's Up!, Concept, Jungle Speed).

    Format JSON STRICT attendu :
    {
      "catchphrase": "Une phrase d'accroche percutante et ludique en français.",
      "gameMasterAnalysis": "Une analyse d'expert expliquant pourquoi cette sélection est parfaite pour le contexte d'âge et la demande spécifiée.",
      "selectionName": "Nom thématique de la sélection.",
      "games": [
        {
          "name": "Nom Exact du Jeu",
          "superPower": "La mécanique clé expliquée de façon fun",
          "rationale": "Une phrase liant le jeu directement à la demande et à l'âge.",
          "stats": {
            "players": "ex: '2-6 joueurs'",
            "duration": "ex: '15 min'",
            "age": "ex: '10+'"
          },
          "price": "Prix estimé (ex: '14,90 €')"
        }
      ]
    }`;

    const userMessage = `Mode: ${mode}\nContexte Âge: ${ageRange || 'Non spécifié (tous âges)'}\nDemande/Envie: ${description}`;

    let response;
    let lastError;
    for (const model of models) {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [{ parts: [{ text: userMessage }] }],
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
            },
          });
          console.log(`Success with model: ${model} (attempt ${attempt})`);
          break;
        } catch (modelError) {
          lastError = modelError;
          console.warn(`Model ${model} attempt ${attempt} failed: ${modelError.message}`);
          if (modelError.status === 503 && attempt < MAX_RETRIES) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
            continue;
          }
          break;
        }
      }
      if (response) break;
    }
    if (!response) throw lastError;

    const rawText = response.text || '{}';
    console.log(`Mode: ${mode}, Age: ${ageRange}, Response: ${rawText.substring(0, 300)}`);
    const data = JSON.parse(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error calling Gemini:', error);
    res.status(500).json({ error: 'Failed to process search', details: error.message });
  }
});
