# Games Release Radar

A static website that tracks upcoming game releases across all platforms, automatically updated using web scraping.

## Features

- 🎮 **Multi-platform support**: PlayStation, Xbox, PC, and Nintendo Switch
- 🔄 **Automatic updates**: Daily scraping of IGN's upcoming games page
- 📱 **Responsive design**: Works great on desktop and mobile
- 🏷️ **Smart filtering**: Filter games by platform
- ⚡ **Fast loading**: Static site generation with Next.js

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Data Source**: IGN Upcoming Games (via Firecrawl API)
- **Deployment**: GitHub Pages
- **Automation**: GitHub Actions

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/games-release-radar.git
   cd games-release-radar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production site
- `npm run start` - Start the production server
- `npm run scrape` - Manually scrape game data
- `npm run lint` - Run ESLint

## Data Management

The game data is stored in `data/games.json` and is automatically updated daily via GitHub Actions. The scraper uses the Firecrawl API to extract game information from IGN's upcoming games page.

### Manual Data Update

To manually update the game data:

```bash
npm run scrape
```

## Deployment

The site is automatically deployed to GitHub Pages whenever changes are pushed to the main branch. The deployment workflow also runs daily to update the game data.

### GitHub Secrets

Make sure to set up the following secrets in your GitHub repository:

- `FIRECRAWL_API_KEY`: Your Firecrawl API key

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Game data sourced from [IGN](https://www.ign.com/)
- Web scraping powered by [Firecrawl](https://firecrawl.dev/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
