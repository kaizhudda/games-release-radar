const fs = require("fs");
const path = require("path");

// Load environment variables
require('dotenv').config();

// Interface for game data
interface Game {
  id: string;
  title: string;
  releaseDate: string;
  platforms: string[];
  description: string;
  developer: string;
  publisher: string;
  genre: string;
}

// Function to extract game data from scraped content
function extractGameData(content: string): Game[] {
  const games: Game[] = [];
  
  // Split content into game sections
  const gameBlocks = content.split(/(?=\n\s*[A-Z])/);
  
  for (const block of gameBlocks) {
    if (block.trim().length < 50) continue; // Skip small blocks
    
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length < 3) continue;
    
    try {
      // Extract title (usually the first meaningful line)
      const title = lines[0].replace(/^\d+\.\s*/, '').trim();
      if (!title || title.length < 3) continue;
      
      // Look for release date patterns
      const releaseDateMatch = block.match(/(?:Release|Coming|Launch|Available)[\s:]*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|[A-Za-z]+\s+\d{4}|Q\d\s+\d{4}|Fall\s+\d{4}|Spring\s+\d{4}|Summer\s+\d{4}|Winter\s+\d{4})/i);
      const releaseDate = releaseDateMatch ? releaseDateMatch[1] : "TBA 2025";
      
      // Extract platforms
      const platforms: string[] = [];
      const platformText = block.toLowerCase();
      if (platformText.includes('playstation') || platformText.includes('ps5') || platformText.includes('ps4')) {
        platforms.push('PlayStation');
      }
      if (platformText.includes('xbox') || platformText.includes('series x') || platformText.includes('series s')) {
        platforms.push('Xbox');
      }
      if (platformText.includes('pc') || platformText.includes('steam') || platformText.includes('windows')) {
        platforms.push('PC');
      }
      if (platformText.includes('nintendo') || platformText.includes('switch')) {
        platforms.push('Nintendo Switch');
      }
      
      // If no platforms found, default to common ones
      if (platforms.length === 0) {
        platforms.push('PC', 'PlayStation', 'Xbox');
      }
      
      // Extract description (usually a longer line)
      const description = lines
        .filter(line => line.length > 50 && !line.match(/release|platform|developer/i))
        .join(' ')
        .substring(0, 200) + '...';
      
      // Extract developer/publisher (look for patterns)
      const developerMatch = block.match(/(?:Developer|Dev|Studio|Made by)[\s:]*([A-Za-z\s&]+)/i);
      const developer = developerMatch ? developerMatch[1].trim() : "Unknown Developer";
      
      const publisherMatch = block.match(/(?:Publisher|Published by)[\s:]*([A-Za-z\s&]+)/i);
      const publisher = publisherMatch ? publisherMatch[1].trim() : developer;
      
      // Extract genre (look for common game genres)
      const genreMatch = block.match(/(?:Genre|Type)[\s:]*([A-Za-z\s-]+)/i);
      let genre = genreMatch ? genreMatch[1].trim() : "Action";
      
      // Fallback genre detection based on title/description
      if (!genreMatch) {
        const content = (title + ' ' + description).toLowerCase();
        if (content.includes('rpg') || content.includes('role-playing')) genre = "RPG";
        else if (content.includes('strategy')) genre = "Strategy";
        else if (content.includes('shooter')) genre = "Shooter";
        else if (content.includes('sports')) genre = "Sports";
        else if (content.includes('racing')) genre = "Racing";
        else if (content.includes('simulation')) genre = "Simulation";
        else if (content.includes('adventure')) genre = "Adventure";
        else genre = "Action";
      }
      
      const game: Game = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        title,
        releaseDate,
        platforms,
        description: description || `An upcoming ${genre.toLowerCase()} game.`,
        developer,
        publisher,
        genre,
      };
      
      games.push(game);
    } catch (error) {
      console.warn(`Error parsing game block: ${error}`);
      continue;
    }
  }
  
  return games;
}

// Main scraper function using Firecrawl MCP
async function scrapeGames() {
  try {
    console.log("🔥 Scraping IGN upcoming games with Firecrawl MCP...");
    
    if (!process.env.FIRECRAWL_API_KEY) {
      throw new Error("FIRECRAWL_API_KEY environment variable is required");
    }
    
    // Use Firecrawl to scrape IGN's upcoming games page
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: "https://www.ign.com/upcoming/games",
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Firecrawl API error: ${response.status} ${response.statusText}`);
    }
    
    const scrapeResult = await response.json();
    
    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape IGN: ${scrapeResult.error}`);
    }
    
    console.log("✅ Successfully scraped IGN upcoming games page");
    
    // Extract game data from scraped content
    const games = extractGameData(scrapeResult.data.markdown);
    
    // Limit to top 20 games and filter out duplicates
    const uniqueGames = games
      .filter((game, index, self) => 
        index === self.findIndex(g => g.title === game.title)
      )
      .slice(0, 20);
    
    if (uniqueGames.length === 0) {
      console.warn("⚠️  No games extracted, falling back to sample data");
      return createFallbackData();
    }
    
    const gameData = {
      games: uniqueGames,
      lastUpdated: new Date().toISOString(),
      source: "IGN via Firecrawl API",
    };
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write to data/games.json
    const filePath = path.join(dataDir, "games.json");
    fs.writeFileSync(filePath, JSON.stringify(gameData, null, 2));
    
    console.log(`🎮 Successfully scraped ${uniqueGames.length} games from IGN and saved to ${filePath}`);
    
  } catch (error) {
    console.error("❌ Error scraping games:", error);
    console.log("🔄 Falling back to sample data...");
    
    // Fallback to sample data if scraping fails
    const fallbackData = createFallbackData();
    
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const filePath = path.join(dataDir, "games.json");
    fs.writeFileSync(filePath, JSON.stringify(fallbackData, null, 2));
    
    console.log("✅ Fallback data created successfully");
  }
}

// Fallback sample data function
function createFallbackData() {
  const games = [
    {
      id: "mafia-the-old-country",
      title: "Mafia: The Old Country",
      releaseDate: "August 8, 2025",
      platforms: ["PlayStation", "Xbox", "PC"],
      description:
        "Uncover the origins of organized crime in Mafia: The Old Country, a gritty mob story set in the brutal underworld of 1900s Sicily.",
      developer: "Hangar 13",
      publisher: "2K Games",
      genre: "Action-Adventure",
    },
    {
      id: "civilization-vii",
      title: "Civilization VII",
      releaseDate: "February 11, 2025",
      platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
      description:
        "Build an empire to stand the test of time in the next evolution of the legendary strategy game.",
      developer: "Firaxis Games",
      publisher: "2K Games",
      genre: "Strategy",
    },
    {
      id: "monster-hunter-wilds",
      title: "Monster Hunter Wilds",
      releaseDate: "February 28, 2025",
      platforms: ["PlayStation", "Xbox", "PC"],
      description:
        "The next evolution of the Monster Hunter series, featuring vast open environments and dynamic weather systems.",
      developer: "Capcom",
      publisher: "Capcom",
      genre: "Action RPG",
    },
    {
      id: "assassins-creed-shadows",
      title: "Assassin's Creed Shadows",
      releaseDate: "February 14, 2025",
      platforms: ["PlayStation", "Xbox", "PC"],
      description:
        "Experience feudal Japan through the eyes of a shinobi assassin and a legendary samurai.",
      developer: "Ubisoft Quebec",
      publisher: "Ubisoft",
      genre: "Action-Adventure",
    },
    {
      id: "gta-6",
      title: "Grand Theft Auto VI",
      releaseDate: "Fall 2025",
      platforms: ["PlayStation", "Xbox"],
      description:
        "The next installment in the Grand Theft Auto series, featuring dual protagonists in Vice City.",
      developer: "Rockstar Games",
      publisher: "Rockstar Games",
      genre: "Action-Adventure",
    },
  ];

  const gameData = {
    games,
    lastUpdated: new Date().toISOString(),
    source: "Fallback sample data",
  };

  return gameData;
}

// Run the scraper
scrapeGames();
