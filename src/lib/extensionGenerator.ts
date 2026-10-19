import JSZip from 'jszip';

export interface ExtensionFile {
  path: string;
  name: string;
  description: string;
  content: string;
}

export const EXTENSION_FILES: ExtensionFile[] = [
  {
    path: 'manifest.json',
    name: 'manifest.json',
    description: 'Manifest V3 configuration with host permissions for X/Twitter, Instagram, TikTok, Tumblr, and Facebook.',
    content: `{
  "manifest_version": 3,
  "name": "CrossPost Pro - Video & Tweet to Facebook",
  "version": "1.0.0",
  "description": "Capture videos and text from X/Twitter, Instagram, TikTok, and Tumblr to post directly to your personal Facebook profile or managed Pages.",
  "permissions": [
    "activeTab",
    "storage",
    "downloads",
    "clipboardWrite",
    "scripting"
  ],
  "host_permissions": [
    "https://*.twitter.com/*",
    "https://*.x.com/*",
    "https://*.instagram.com/*",
    "https://*.tiktok.com/*",
    "https://*.tumblr.com/*",
    "https://*.facebook.com/*"
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "CrossPost Pro to Facebook",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://twitter.com/*", "https://x.com/*"],
      "js": ["content_scripts/twitter.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://www.instagram.com/*"],
      "js": ["content_scripts/instagram.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://www.tiktok.com/*"],
      "js": ["content_scripts/tiktok.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://www.tumblr.com/*"],
      "js": ["content_scripts/tumblr.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://www.facebook.com/*"],
      "js": ["content_scripts/facebook.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`,
  },
  {
    path: 'background.js',
    name: 'background.js',
    description: 'Service worker handling right-click context menus, download orchestration, and badge notifications.',
    content: `// CrossPost Pro Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "crosspost-video-facebook",
    title: "⚡ CrossPost this Video to Facebook",
    contexts: ["video", "link"]
  });
  console.log("CrossPost Pro extension installed successfully.");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "crosspost-video-facebook") {
    const videoUrl = info.srcUrl || info.linkUrl;
    chrome.storage.local.set({
      activeCrossPost: {
        platform: tab.url.includes("x.com") || tab.url.includes("twitter.com") ? "twitter" : "web",
        videoUrl: videoUrl,
        text: "Captured video ready for Facebook cross-posting",
        originalUrl: tab.url,
        capturedAt: Date.now()
      }
    }, () => {
      chrome.action.openPopup();
    });
  }
});

// Listener for content script requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadVideo") {
    chrome.downloads.download({
      url: request.videoUrl,
      filename: request.filename || "crosspost-video.mp4",
      saveAs: false
    }, (downloadId) => {
      sendResponse({ success: true, downloadId });
    });
    return true;
  }
});`,
  },
  {
    path: 'content_scripts/twitter.js',
    name: 'content_scripts/twitter.js',
    description: 'Injects a stylish "⚡ CrossPost" action into any tweet containing a video on Twitter / X.',
    content: `// Twitter / X Video & Tweet Scraper
(function() {
  function injectCrossPostButtons() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(tweet => {
      if (tweet.dataset.crosspostInjected) return;

      const video = tweet.querySelector('video');
      if (!video) return;

      tweet.dataset.crosspostInjected = "true";

      const actionGroup = tweet.querySelector('div[role="group"]');
      if (!actionGroup) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'crosspost-btn';
      btn.innerHTML = \`
        <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;font-size:12px;font-weight:600;border-radius:9999px;background:#1877F2;color:#ffffff;border:none;cursor:pointer;margin-left:8px;box-shadow:0 1px 3px rgba(0,0,0,0.2);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          CrossPost to FB
        </span>
      \`;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. Grab text
        const textEl = tweet.querySelector('div[data-testid="tweetText"]');
        const text = textEl ? textEl.innerText.trim() : '';

        // 2. Grab video source
        const videoSrc = video.currentSrc || video.src || (video.querySelector('source') ? video.querySelector('source').src : '');

        // 3. Grab author info
        const userEl = tweet.querySelector('div[data-testid="User-Name"]');
        const authorText = userEl ? userEl.innerText.replace(/\\n/g, ' ') : 'Twitter User';

        const tweetUrl = window.location.href;

        chrome.storage.local.set({
          activeCrossPost: {
            platform: 'twitter',
            text: text,
            videoUrl: videoSrc,
            author: authorText,
            originalUrl: tweetUrl,
            capturedAt: Date.now()
          }
        }, () => {
          btn.querySelector('span').innerText = '✓ Captured!';
          setTimeout(() => {
            btn.querySelector('span').innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> CrossPost to FB';
          }, 2500);
          alert('Captured tweet video & text! Click the CrossPost Pro extension icon in your Chrome toolbar to choose Profile vs Page posting.');
        });
      });

      actionGroup.appendChild(btn);
    });
  }

  setInterval(injectCrossPostButtons, 1500);
})();`,
  },
  {
    path: 'content_scripts/instagram.js',
    name: 'content_scripts/instagram.js',
    description: 'Detects reels and video posts on Instagram, extracting caption and video source.',
    content: `// Instagram Reels & Video Extractor
(function() {
  function scanInstagramVideos() {
    const videoArticles = document.querySelectorAll('article, div[role="dialog"]');
    videoArticles.forEach(item => {
      if (item.dataset.crosspostInjected) return;
      const video = item.querySelector('video');
      if (!video) return;

      item.dataset.crosspostInjected = "true";

      const btn = document.createElement('button');
      btn.style.cssText = "position:absolute;top:16px;right:16px;z-index:999;padding:6px 12px;background:#1877F2;color:#fff;border-radius:20px;font-size:12px;font-weight:700;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;gap:4px;";
      btn.innerHTML = "⚡ CrossPost Reel to FB";

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const captionEl = item.querySelector('h1, span._ap3a, div._a9zs');
        const caption = captionEl ? captionEl.innerText : '';
        const videoSrc = video.currentSrc || video.src;

        chrome.storage.local.set({
          activeCrossPost: {
            platform: 'instagram',
            text: caption,
            videoUrl: videoSrc,
            originalUrl: window.location.href,
            capturedAt: Date.now()
          }
        }, () => {
          alert('Reel captured! Open CrossPost Pro in your toolbar to post to your Facebook Profile or Managed Page.');
        });
      });

      if (item.style.position !== 'relative' && item.style.position !== 'absolute') {
        item.style.position = 'relative';
      }
      item.appendChild(btn);
    });
  }

  setInterval(scanInstagramVideos, 2000);
})();`,
  },
  {
    path: 'content_scripts/tiktok.js',
    name: 'content_scripts/tiktok.js',
    description: 'Extracts videos and captions from TikTok desktop feed.',
    content: `// TikTok Video & Caption Extractor
(function() {
  function scanTikTok() {
    const videoContainers = document.querySelectorAll('[data-e2e="feed-video"], .tiktok-web-player');
    videoContainers.forEach(container => {
      if (container.dataset.crosspostInjected) return;
      const video = container.querySelector('video');
      if (!video) return;

      container.dataset.crosspostInjected = "true";

      const btn = document.createElement('button');
      btn.style.cssText = "position:absolute;top:12px;left:12px;z-index:999;padding:6px 14px;background:#1877F2;color:#fff;border-radius:18px;font-size:12px;font-weight:600;border:none;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);";
      btn.innerText = "⚡ CrossPost TikTok to FB";

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const captionEl = document.querySelector('[data-e2e="browse-video-desc"], [data-e2e="video-desc"]');
        const text = captionEl ? captionEl.innerText : '';
        const videoSrc = video.currentSrc || video.src;

        chrome.storage.local.set({
          activeCrossPost: {
            platform: 'tiktok',
            text,
            videoUrl: videoSrc,
            originalUrl: window.location.href,
            capturedAt: Date.now()
          }
        }, () => {
          alert('TikTok video & caption captured! Open CrossPost Pro to post to your Profile or Page.');
        });
      });

      container.appendChild(btn);
    });
  }

  setInterval(scanTikTok, 2000);
})();`,
  },
  {
    path: 'content_scripts/tumblr.js',
    name: 'content_scripts/tumblr.js',
    description: 'Extracts Tumblr video posts and tags for Facebook sharing.',
    content: `// Tumblr Video Post Extractor
(function() {
  function scanTumblr() {
    const posts = document.querySelectorAll('article.post');
    posts.forEach(post => {
      if (post.dataset.crosspostInjected) return;
      const video = post.querySelector('video');
      if (!video) return;

      post.dataset.crosspostInjected = "true";

      const btn = document.createElement('button');
      btn.style.cssText = "margin:8px;padding:4px 10px;background:#1877F2;color:#fff;border-radius:14px;font-size:12px;font-weight:600;border:none;cursor:pointer;";
      btn.innerText = "⚡ CrossPost to FB";

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bodyEl = post.querySelector('.post_body, .post-content');
        const text = bodyEl ? bodyEl.innerText : '';
        const videoSrc = video.currentSrc || video.src;

        chrome.storage.local.set({
          activeCrossPost: {
            platform: 'tumblr',
            text,
            videoUrl: videoSrc,
            originalUrl: window.location.href,
            capturedAt: Date.now()
          }
        }, () => {
          alert('Tumblr video captured!');
        });
      });

      post.appendChild(btn);
    });
  }

  setInterval(scanTumblr, 2000);
})();`,
  },
  {
    path: 'content_scripts/facebook.js',
    name: 'content_scripts/facebook.js',
    description: 'Activates on Facebook.com to display an assist banner with downloaded video reminder and 1-click clipboard paste.',
    content: `// Facebook Auto-Assist Content Script
(function() {
  chrome.storage.local.get(['pendingFbPost'], (data) => {
    if (data.pendingFbPost && (Date.now() - data.pendingFbPost.timestamp < 180000)) {
      const banner = document.createElement('div');
      banner.id = 'crosspost-assist-banner';
      banner.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:999999;max-width:380px;background:#0F172A;color:#FFFFFF;border:2px solid #1877F2;border-radius:12px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.5);font-family:sans-serif;font-size:13px;line-height:1.4;";

      banner.innerHTML = \`
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <strong style="color:#60A5FA;font-size:14px;display:flex;align-items:center;gap:6px;">
            ⚡ CrossPost Pro Ready
          </strong>
          <button id="close-crosspost-banner" style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:16px;">✕</button>
        </div>
        <p style="margin:0 0 10px 0;color:#CBD5E1;">
          Your video was downloaded to your computer and caption is ready!
        </p>
        <div style="background:#1E293B;padding:8px 10px;border-radius:6px;margin-bottom:10px;font-size:12px;max-height:80px;overflow-y:auto;color:#E2E8F0;">
          "\${data.pendingFbPost.caption.slice(0, 150)}..."
        </div>
        <div style="display:flex;gap:8px;">
          <button id="copy-caption-btn" style="flex:1;background:#1877F2;color:white;border:none;border-radius:6px;padding:8px;font-weight:600;cursor:pointer;">
            📋 Copy Caption
          </button>
          <button id="open-composer-btn" style="flex:1;background:#334155;color:white;border:none;border-radius:6px;padding:8px;font-weight:600;cursor:pointer;">
            ✍️ Open Composer
          </button>
        </div>
      \`;

      document.body.appendChild(banner);

      document.getElementById('close-crosspost-banner')?.addEventListener('click', () => {
        banner.remove();
        chrome.storage.local.remove(['pendingFbPost']);
      });

      document.getElementById('copy-caption-btn')?.addEventListener('click', () => {
        navigator.clipboard.writeText(data.pendingFbPost.caption);
        alert('Caption copied to clipboard! Just paste (Ctrl+V) in Facebook post creator and select your downloaded video.');
      });

      document.getElementById('open-composer-btn')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const composerInput = document.querySelector('div[role="button"][tabindex="0"] span');
        if (composerInput) composerInput.click();
      });
    }
  });
})();`,
  },
  {
    path: 'popup/popup.html',
    name: 'popup/popup.html',
    description: 'Extension popup user interface to preview video, refine caption, and dispatch to any destination platform.',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CrossPost Pro</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 390px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 14px; }
    .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #1e293b; margin-bottom: 12px; }
    .brand { font-size: 15px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px; }
    .badge { font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #1e293b; color: #94a3b8; font-family: monospace; }
    .preview-box { background: #1e293b; border-radius: 8px; overflow: hidden; margin-bottom: 12px; border: 1px solid #334155; }
    video { width: 100%; max-height: 180px; display: block; background: #000; }
    .caption-box { padding: 10px; }
    textarea { width: 100%; height: 75px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #f1f5f9; padding: 8px; font-size: 12px; resize: none; font-family: inherit; }
    .target-choice { background: #1e293b; border-radius: 8px; padding: 10px; margin-bottom: 12px; border: 1px solid #334155; }
    .target-title { font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 8px; }
    select { width: 100%; background: #0f172a; border: 1px solid #334155; color: #f8fafc; border-radius: 6px; padding: 8px; font-size: 12px; outline: none; }
    .btn-primary { width: 100%; background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { width: 100%; background: #334155; color: #cbd5e1; border: none; border-radius: 6px; padding: 8px; font-size: 12px; cursor: pointer; margin-top: 6px; }
    .status { font-size: 11px; text-align: center; color: #94a3b8; margin-top: 8px; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">⚡ CrossPost Pro</div>
    <span class="badge" id="platform-badge">AUTO-DETECT</span>
  </div>

  <div class="preview-box">
    <video id="video-preview" controls></video>
    <div class="caption-box">
      <textarea id="caption-input" placeholder="Captured post text..."></textarea>
    </div>
  </div>

  <div class="target-choice">
    <div class="target-title">Where do you want to cross-post?</div>
    <select id="destination-select">
      <option value="facebook_profile">Facebook: My ACTUAL Profile (Timeline)</option>
      <option value="facebook_page">Facebook: A Page I Manage</option>
      <option value="instagram">Instagram: Reels & Feed Composer</option>
      <option value="tiktok">TikTok: Creator Studio Upload</option>
      <option value="tumblr">Tumblr: Video Post Composer</option>
      <option value="twitter">X / Twitter: New Tweet Video</option>
    </select>
  </div>

  <button class="btn-primary" id="btn-post-action">⚡ 1-Click Download & Launch Destination</button>
  <button class="btn-secondary" id="btn-open-studio">Open Full CrossPost Web Studio</button>
  <div class="status" id="status-text">Ready to cross-post to any platform</div>

  <script src="popup.js"></script>
</body>
</html>`,
  },
  {
    path: 'popup/popup.js',
    name: 'popup/popup.js',
    description: 'Popup controller handling omni-directional platform routing, downloads, and composer launchers.',
    content: `document.addEventListener('DOMContentLoaded', () => {
  const videoPreview = document.getElementById('video-preview');
  const captionInput = document.getElementById('caption-input');
  const platformBadge = document.getElementById('platform-badge');
  const destinationSelect = document.getElementById('destination-select');
  const btnPost = document.getElementById('btn-post-action');
  const btnStudio = document.getElementById('btn-open-studio');
  const statusText = document.getElementById('status-text');

  let currentPost = null;

  // Load captured post from storage
  chrome.storage.local.get(['activeCrossPost'], (res) => {
    if (res.activeCrossPost) {
      currentPost = res.activeCrossPost;
      captionInput.value = currentPost.text || '';
      videoPreview.src = currentPost.videoUrl || '';
      platformBadge.innerText = (currentPost.platform || 'captured').toUpperCase();
    } else {
      captionInput.value = 'No video currently selected. Browse X/Twitter, Instagram, TikTok or Tumblr and click the ⚡ CrossPost badge!';
      platformBadge.innerText = 'WAITING';
      btnPost.disabled = true;
    }
  });

  btnPost.addEventListener('click', () => {
    if (!currentPost) return;

    const destination = destinationSelect.value;
    const caption = captionInput.value;

    statusText.innerText = 'Downloading video and preparing composer...';

    // 1. Trigger video download
    chrome.downloads.download({
      url: currentPost.videoUrl,
      filename: 'crosspost_' + destination + '_' + Date.now() + '.mp4',
      saveAs: false
    });

    // 2. Copy caption to clipboard
    navigator.clipboard.writeText(caption);

    // 3. Open selected destination composer
    let targetUrl = 'https://www.facebook.com/';
    if (destination === 'facebook_page') {
      targetUrl = 'https://business.facebook.com/latest/composer';
    } else if (destination === 'instagram') {
      targetUrl = 'https://www.instagram.com/';
    } else if (destination === 'tiktok') {
      targetUrl = 'https://www.tiktok.com/creator-center/upload';
    } else if (destination === 'tumblr') {
      targetUrl = 'https://www.tumblr.com/new/video';
    } else if (destination === 'twitter') {
      targetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(caption.slice(0, 240));
    }

    chrome.tabs.create({ url: targetUrl });
    statusText.innerText = '✓ Video downloaded & caption copied! Switch to the opened tab to paste & share.';
  });

  btnStudio.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://ais-dev-thrbsvsorxsr6ejfktwtgr-473466139844.europe-west2.run.app' });
  });
});`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    description: '3-step installation instructions for Chrome, Brave, Edge, and Arc.',
    content: `# CrossPost Pro - Chrome Extension Installation Guide

Capture videos & text from X/Twitter, Instagram, TikTok, and Tumblr, then post seamlessly to your Facebook Profile or Pages.

## How to Install in 3 Easy Steps (Under 60 seconds):

1. **Unzip the downloaded archive**:
   - Extract \`crosspost-pro-extension.zip\` into a folder on your computer (e.g. inside Documents or Downloads).

2. **Open Chrome Extension Management**:
   - In Google Chrome (or Brave, Edge, Arc), navigate to:
     \`chrome://extensions/\`
   - In the top-right corner, switch the **"Developer mode"** toggle to **ON**.

3. **Load Unpacked Extension**:
   - Click the button **"Load unpacked"** in the top-left corner.
   - Select the unzipped folder containing \`manifest.json\`.
   - That's it! Pin **CrossPost Pro** to your Chrome toolbar.

## How to Use:
- Go to any tweet on **X / Twitter** with a video.
- Notice the **"⚡ CrossPost to FB"** button attached directly beneath the tweet!
- Click it: your video and caption are immediately captured.
- Open the extension icon in your toolbar, choose whether to post to your **Personal Profile** or a **Page you manage**, and click **1-Click Share**!
- The extension automatically downloads the video in high definition to your Downloads folder, copies the refined caption to your clipboard, and launches Facebook's post creator ready to share!
`,
  },
];

export async function generateExtensionZipBlob(): Promise<Blob> {
  const zip = new JSZip();

  // Add all code files
  for (const file of EXTENSION_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate lightweight SVG icons for the package
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="#1877F2"/>
    <path d="M68 20L36 68H64L60 108L92 60H64L68 20Z" fill="#FFFFFF"/>
  </svg>`;

  zip.file('icons/icon128.svg', iconSvg);
  zip.file('icons/icon48.svg', iconSvg);
  zip.file('icons/icon16.svg', iconSvg);

  // Return generated zip blob
  return await zip.generateAsync({ type: 'blob' });
}
