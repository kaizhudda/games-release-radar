import { Game, Platform } from '@/types/game';

interface GameCardProps {
  game: Game;
}

const platformColors: Record<Platform, string> = {
  'PlayStation': 'platform-badge playstation',
  'Xbox': 'platform-badge xbox',
  'PC': 'platform-badge pc',
  'Nintendo Switch': 'platform-badge nintendo-switch',
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {game.title}
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {game.platforms.map((platform) => (
          <span
            key={platform}
            className={platformColors[platform]}
          >
            {platform}
          </span>
        ))}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Release:</span>
          <span>{game.releaseDate}</span>
        </div>
        
        {game.developer && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Developer:</span>
            <span>{game.developer}</span>
          </div>
        )}
        
        {game.genre && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Genre:</span>
            <span>{game.genre}</span>
          </div>
        )}
      </div>
      
      {game.description && (
        <p className="text-sm text-gray-700 line-clamp-3">
          {game.description}
        </p>
      )}
    </div>
  );
}
