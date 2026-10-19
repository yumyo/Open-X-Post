# CrossPost Pro ⚡

> **Omni-Directional Social Video Cross-Posting Studio & Manifest V3 Chrome Extension**  
> Capture videos and captions from **X / Twitter, TikTok, Instagram Reels, and Tumblr** and seamlessly cross-post to **Facebook (Profile or Page), Instagram Reels, TikTok, Tumblr, and X**.

---

## 📖 Overview

CrossPost Pro solves the friction of moving short-form video content across major social platforms. Instead of manually copying links, downloading videos through ad-ridden websites, and re-typing captions, CrossPost Pro provides a **dual-engine workflow**:

1. **In-Situ Chrome Extension (Manifest V3)**: Injects directly into Twitter/X, TikTok, Instagram, and Tumblr feeds, sniffing high-res `.mp4` video blobs and post text with a single click on any post.
2. **Web Studio Hub**: A dashboard to preview video playback, optimize captions with **Google Gemini AI**, and dispatch to any destination platform either programmatically (APIs) or through 1-click web composer helpers.

---

## 🚀 Key Bits for Users

### 1. Facebook: Personal Profile vs. Managed Page Explained
* **Facebook Page You Manage**: Meta provides first-class programmatic API access (`POST /{page-id}/videos`). CrossPost Pro supports direct headless publishing or deep-linking to Meta Business Suite.
* **Your ACTUAL Personal Profile (Timeline)**: In 2018, Meta strictly deprecated `publish_actions` for personal timelines to eliminate unauthorized bots. No legal API in the world can silently upload videos to your personal timeline without user confirmation.  
  * **Our 1-Click Solution**: CrossPost Pro automatically triggers the high-res `.mp4` download to your computer, copies the refined caption to your clipboard, and launches Facebook's post creator in a new tab. Simply press `Ctrl+V` (or `Cmd+V`) and select your downloaded video!

### 2. Supported Multi-Platform Destinations
| Destination Platform | 1-Click Helper Mode | Direct Headless API Mode |
| :--- | :--- | :--- |
| **Facebook (Personal Profile)** | Downloads MP4 + copies text + opens timeline | *Restricted by Meta Privacy Policy* |
| **Facebook (Managed Page)** | Opens Meta Business Suite pre-filled | **Meta Graph API** (`POST /{page_id}/videos`) |
| **Instagram (Reels & Feed)** | Downloads MP4 + copies tags + opens IG creator | **Instagram Graph API** container pipeline |
| **TikTok (Creator Center)** | Downloads MP4 + copies caption + opens TikTok Studio | **TikTok Content Posting API** |
| **Tumblr (Video Post)** | Downloads MP4 + copies tags + opens Tumblr composer | **Tumblr API v2** video post endpoint |
| **X / Twitter** | Downloads MP4 + launches pre-filled Tweet Composer | **Twitter API v2** |

### 3. 🚀 Omni-Blast: Multi-Platform Publishing
Need to post the same video across **Facebook, Instagram, TikTok, and Tumblr simultaneously**?
Click the **"Omni-Blast"** button:
1. Downloads the video once.
2. Formats and copies your universal caption.
3. Automatically opens all 4 web creators in separate tabs ready for upload.

### 4. How to Install the Chrome Extension (Under 60 seconds)
1. In CrossPost Pro, click **"Download Extension (.zip)"** in the top navigation bar.
2. Extract the downloaded `crosspost-pro-extension.zip` into a folder on your computer.
3. In Chrome (or Brave, Edge, Arc), go to `chrome://extensions/`.
4. Enable **"Developer mode"** in the top-right corner.
5. Click **"Load unpacked"** in the top-left corner and select the extracted folder.
6. Pin **CrossPost Pro** to your browser toolbar!

---

## 🛠️ Key Bits for Developers

### Architecture & Tech Stack
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite 8.
* **Backend**: Node.js 22, Express, `@google/genai` (Gemini 3.8 Flash), TSX.
* **Browser Extension**: Manifest V3 compliant service worker, multi-site content scripts, and HTML5 popup.
* **ZIP Packaging**: In-browser client-side package generation using `JSZip`.

### Repository Structure
```
├── api/
│   └── index.ts              # Vercel serverless function entrypoint
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                # Strict 3-zone header component
│   │   ├── LiveStudio.tsx            # Video preview, Gemini optimizer, dispatcher
│   │   ├── ArchitectureAdvisor.tsx   # Profile vs Page & multi-platform matrix guide
│   │   ├── ExtensionSimulator.tsx    # Live sandbox testing extension in-situ
│   │   ├── ExtensionDownloader.tsx   # 1-Click ZIP builder & code inspector
│   │   └── HistoryLog.tsx            # Activity log with tabular metrics
│   ├── lib/
│   │   └── extensionGenerator.ts     # Manifest V3 Chrome Extension source files
│   ├── types.ts                      # Shared TypeScript data models
│   ├── App.tsx                       # Main application shell
│   └── main.tsx                      # Vite React mount
├── server.ts                 # Full-stack Express server (API endpoints & dev proxy)
├── Dockerfile                # Production multi-stage Alpine container
├── render.yaml               # Render.com blueprint for 1-click free deployment
├── vercel.json               # Vercel routing & SPA fallback configuration
└── package.json              # Build scripts and dependencies
```

---

## 💻 Local Development Setup

### 1. Prerequisites
* **Node.js**: `v20` or higher (`v22` recommended)
* **npm**: `v9` or higher

### 2. Installation
```bash
git clone https://github.com/YOUR_USERNAME/crosspost-pro.git
cd crosspost-pro
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
* `GEMINI_API_KEY`: *(Optional)* Gemini API key for AI caption enhancement. If not supplied, the app automatically falls back to built-in platform-optimized heuristics.
* `PORT`: Server port (defaults to `3000`).
* `NODE_ENV`: Set to `production` or `development`.

### 4. Running Locally
```bash
# Start full-stack development server (Express + Vite middlewares)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start
```bash
# Build frontend assets with Vite
npm run build

# Start production server
npm start
```

---

## 🚢 Free Deployment Options (No Credit Card Required)

### Option A: Render.com (Recommended)
1. Log in to [Render.com](https://render.com) using your GitHub account.
2. Click **"New +" → "Web Service"** and select this repository.
3. Render auto-detects `render.yaml`:
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
4. Click **"Create Web Service"**. Free SSL and custom domain mapping included!

### Option B: Vercel (Hobby Tier)
1. Import repository on [Vercel.com](https://vercel.com).
2. Vercel auto-detects `vercel.json` and routes `/api/*` to the serverless function and static assets to `/dist`.
3. Click **"Deploy"**.

### Option C: Docker Container
```bash
docker build -t crosspost-pro .
docker run -p 3000:3000 crosspost-pro
```

---

## 📄 License
Apache-2.0
