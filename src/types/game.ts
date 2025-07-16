export interface Game {
  id: string;
  title: string;
  releaseDate: string;
  platforms: Platform[];
  description?: string;
  image?: string;
  url?: string;
  developer?: string;
  publisher?: string;
  genre?: string;
}

export type Platform = 'PlayStation' | 'Xbox' | 'PC' | 'Nintendo Switch';

export interface GameData {
  games: Game[];
  lastUpdated: string;
}
