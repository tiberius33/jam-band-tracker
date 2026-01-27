# Jam Band Tracker

Track jam band shows near you and maintain a personal setlist collection.

## Features

- 🎸 Discover upcoming jam band shows near any location
- 📍 Search within customizable radius (10-200 miles)
- 📝 Log attended shows with detailed setlists
- ⭐ Rate shows and add personal notes
- 📊 View concert statistics and history
- 💾 Persistent storage - your data saves automatically

## Local Development

### Prerequisites
- Node.js 18+ installed ([download here](https://nodejs.org/))

### Setup

1. Clone this repository:
```bash
git clone <your-repo-url>
cd jam-band-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Deployment

### Option 1: Netlify (Recommended)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

Your site will be live at `<random-name>.netlify.app` (you can customize this)

### Option 2: Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" → Import your GitHub repository
4. Vercel auto-detects Vite settings
5. Click "Deploy"

Your site will be live at `<project-name>.vercel.app`

### Option 3: GitHub Pages

1. Install the gh-pages package:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Add to vite.config.js:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/jam-band-tracker/', // Your repo name
})
```

4. Deploy:
```bash
npm run deploy
```

Your site will be at `https://<username>.github.io/jam-band-tracker/`

## Future Feature Ideas

- [ ] Integration with Setlist.fm API for real show data
- [ ] Add photos to show entries
- [ ] Share setlists with friends
- [ ] Export show history to CSV
- [ ] Calendar view of attended shows
- [ ] Song statistics (most heard songs, rarities)
- [ ] Venue statistics and mapping
- [ ] Integration with music streaming services
- [ ] Set break notifications for multi-set shows
- [ ] Tour tracking for favorite bands

## Tech Stack

- React 18
- Vite (build tool)
- Lucide React (icons)
- Browser localStorage for data persistence

## Customization

### Adding More Bands

Edit the `jamBands` array in `src/App.jsx`:

```javascript
const jamBands = [
  'Goose', 'Dead & Company', 'Phish',
  'Your Band Here', // Add your favorites!
];
```

### Integrating Real API Data

To connect with Setlist.fm API:

1. Get an API key from [setlist.fm/settings/api](https://www.setlist.fm/settings/api)
2. Replace the mock data in the `searchShows` function
3. See [Setlist.fm API docs](https://api.setlist.fm/docs/1.0/index.html)

## License

MIT - Feel free to use and modify!
