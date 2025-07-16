import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Game, GameData, Platform } from '@/types/game';
import GameCard from '@/components/GameCard';
import PlatformFilter from '@/components/PlatformFilter';
import gameData from '../../data/games.json';

interface HomeProps {
  games: Game[];
  lastUpdated: string;
}

export default function Home({ games, lastUpdated }: HomeProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'All'>('All');
  
  const filteredGames = selectedPlatform === 'All' 
    ? games 
    : games.filter(game => game.platforms.includes(selectedPlatform));

  return (
    <>
      <Head>
        <title>Games Release Radar</title>
        <meta name="description" content="Track upcoming game releases across all platforms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Games Release Radar
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Track upcoming game releases across all platforms
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </p>
          </header>
          
          <div className="mb-8">
            <PlatformFilter 
              selectedPlatform={selectedPlatform}
              onPlatformChange={setSelectedPlatform}
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {selectedPlatform === 'All' 
                ? `All Upcoming Games (${filteredGames.length})`
                : `${selectedPlatform} Games (${filteredGames.length})`
              }
            </h2>
          </div>
          
          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No games found for the selected platform.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const data = gameData as GameData;
  
  return {
    props: {
      games: data.games,
      lastUpdated: data.lastUpdated,
    },
  };
};
