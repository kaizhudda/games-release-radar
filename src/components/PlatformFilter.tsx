import { Platform } from '@/types/game';

interface PlatformFilterProps {
  selectedPlatform: Platform | 'All';
  onPlatformChange: (platform: Platform | 'All') => void;
}

const platforms: (Platform | 'All')[] = ['All', 'PlayStation', 'Xbox', 'PC', 'Nintendo Switch'];

export default function PlatformFilter({ selectedPlatform, onPlatformChange }: PlatformFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onPlatformChange(platform)}
          className={`filter-button ${
            selectedPlatform === platform ? 'active' : 'inactive'
          }`}
        >
          {platform}
        </button>
      ))}
    </div>
  );
}
