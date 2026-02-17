
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GameInputs } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeGameNeeds(
  inputs: GameInputs
): Promise<AnalysisResult | null> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Tu es "Le Moteur de Jeux" officiel d'Asmodee, intégré à la campagne du 30ème anniversaire "Inspired by Players".
    Ton but : traduire un profil de joueur, une occasion sociale et un contexte d'âge (qui peut être complexe, ex: "enfants de 5 et 6 ans", "adultes entre 30 et 35 ans", "j'ai 28 ans") en une sélection de 3 jeux de société parfaits du catalogue Asmodee.
    
    Ton ton : Enthousiaste, complice, expert, très dynamique. Tu parles français exclusivement. Utilise le langage des joueurs.
    
    Philosophie : "Inspired by Players".
    
    Règles de réponse :
    1. Analyse le mode et surtout le contexte d'âge fourni : "${inputs.ageRange}".
       - Interprète intelligemment la maturité requise. Si l'utilisateur dit "enfants de 5 et 6 ans", propose des jeux adaptés au développement de cet âge. S'il dit "30-35 ans", oriente-toi vers des jeux plus complexes ou "party games" adultes.
       - Mode Cadeau : Focalise-toi sur la personnalité et l'adéquation au destinataire.
       - Mode Occasion : Focalise-toi sur l'ambiance et la logistique du groupe décrit.
    2. Propose EXACTEMENT TROIS (3) jeux réels du catalogue Asmodee (ex: 7 Wonders Duel, Dixit, Dobble, Les Aventuriers du Rail, Unlock!, Catan, Splendor, Azul, Exploding Kittens, Skull, Time's Up!, Concept, Jungle Speed).
    
    Format JSON STRICT attendu :
    {
      "catchphrase": "Une phrase d'accroche percutante et ludique en français.",
      "gameMasterAnalysis": "Une analyse d'expert expliquant pourquoi cette sélection est parfaite pour le contexte d'âge '${inputs.ageRange}' et la demande spécifiée.",
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
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ 
        parts: [{ 
          text: `Mode: ${inputs.mode}\nContexte Âge: ${inputs.ageRange}\nDemande/Envie: ${inputs.description}` 
        }] 
      }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text.trim()) as AnalysisResult;
  } catch (error) {
    console.error("Asmodee AI Engine Error:", error);
    return null;
  }
}
