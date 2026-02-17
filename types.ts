
export interface Game {
  name: string;
  superPower: string;
  rationale: string;
  stats: {
    players: string;
    duration: string;
    age: string;
  };
  price: string;
}

export interface AnalysisResult {
  catchphrase: string;
  gameMasterAnalysis: string;
  selectionName: string;
  games: Game[];
}

export type ExperienceMode = 'cadeau' | 'occasion';

export interface GameInputs {
  description: string;
  mode: ExperienceMode;
  ageRange: string;
}
