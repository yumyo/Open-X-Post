import React, { useState } from 'react';
import {
  Download,
  Copy,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Check,
  Send,
  HelpCircle,
  Share2,
  Globe,
  Layers
} from 'lucide-react';
import { ExtractedMedia, DestinationPlatform, ManagedPage, CrossPostLogItem } from '../types';

interface LiveStudioProps {
  onAddLog: (log: CrossPostLogItem) => void;
  onGoToAdvisor: () => void;
}

const MANAGED_PAGES: ManagedPage[] = [
  {
    id: '1092837465',
    name: 'Tech & AI Insights Daily',
    category: 'Technology & Media',
    followers: '142.5K',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '9928172635',
    name: 'Global Foodie & Cooking Hub',
    category: 'Food & Beverage',
    followers: '280.1K',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '8872615243',
    name: 'Wild Wonders & Exploration',
    category: 'Nature & Travel',
    followers: '68.9K',
    avatar: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=100&q=80',
  },
];

const PRESETS = [
  {
    label: 'X/Twitter: Basem Alhabel',
    platform: 'twitter' as const,
    id: 'twitter-basem',
    url: 'https://x.com/BAlhabel/status/2111813304561569946',
  },
  {
    label: 'X/Twitter: Humanoid Robot',
    platform: 'twitter' as const,
    id: 'twitter-tech',
    url: 'https://x.com/TechRoboDaily/status/1789012345678901234',
  },
  {
    label: 'TikTok: Garlic Parmesan Potatoes',
    platform: 'tiktok' as const,
    id: 'tiktok-viral',
    url: 'https://www.tiktok.com/@marcocooks/video/739182901827491028',
  },
  {
    label: 'Instagram: Emerald Lagoon Reel',
    platform: 'instagram' as const,
    id: 'instagram-reel',
    url: 'https://www.instagram.com/reel/C8921abcdef/',
  },
  {
    label: 'Tumblr: 35mm Tokyo Rain',
    platform: 'tumblr' as const,
    id: 'tumblr-aesthetic',
    url: 'https://midnight-cine-archive.tumblr.com/post/748291049281',
  },
];

const DESTINATIONS: {
  id: DestinationPlatform;
  name: string;
  badge: string;
  color: string;
  description: string;
  hasApi: boolean;
  composerUrl: string;
}[] = [
  {
    id: 'facebook_profile',
    name: 'Facebook (Personal Profile)',
    badge: '1-Click Flow',
    color: 'from-blue-600 to-indigo-600',
    description: 'Post to your personal timeline. Downloads video, copies caption, and opens Facebook composer.',
    hasApi: false,
    composerUrl: 'https://www.facebook.com/',
  },
  {
    id: 'facebook_page',
    name: 'Facebook (Managed Page)',
    badge: 'Official Graph API',
    color: 'from-blue-700 to-blue-900',
    description: 'Direct programmatic publishing to your brand Page via Meta Graph API (or Meta Business Suite).',
    hasApi: true,
    composerUrl: 'https://business.facebook.com/latest/composer',
  },
  {
    id: 'instagram',
    name: 'Instagram (Reels / Feed)',
    badge: 'Graph API & Web',
    color: 'from-pink-600 to-purple-600',
    description: 'Direct publishing via Instagram Graph API (Business/Creator) or 1-Click Web Reels composer.',
    hasApi: true,
    composerUrl: 'https://www.instagram.com/',
  },
  {
    id: 'tiktok',
    name: 'TikTok (Creator Studio)',
    badge: 'Content API & Web',
    color: 'from-neutral-900 to-slate-800',
    description: 'Direct dispatch to TikTok Content Posting API or 1-Click TikTok Web Studio Upload.',
    hasApi: true,
    composerUrl: 'https://www.tiktok.com/creator-center/upload',
  },
  {
    id: 'tumblr',
    name: 'Tumblr (Video Post)',
    badge: 'API v2 & Web',
    color: 'from-blue-900 to-slate-900',
    description: 'Direct publishing to Tumblr blog via API v2 or 1-Click Tumblr Video Post creator.',
    hasApi: true,
    composerUrl: 'https://www.tumblr.com/new/video',
  },
  {
    id: 'twitter',
    name: 'X / Twitter (New Tweet)',
    badge: 'Tweet Composer',
    color: 'from-slate-800 to-neutral-950',
    description: '1-Click pre-filled tweet intent with auto-downloaded video attachment.',
    hasApi: false,
    composerUrl: 'https://twitter.com/intent/tweet',
  },
];

export const LiveStudio: React.FC<LiveStudioProps> = ({ onAddLog, onGoToAdvisor }) => {
  const [urlInput, setUrlInput] = useState(PRESETS[0].url);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMedia, setExtractedMedia] = useState<ExtractedMedia | null>(null);

  // Caption Editing & Gemini AI
  const [caption, setCaption] = useState('');
  const [originalExtractedCaption, setOriginalExtractedCaption] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    viralHook?: string;
    alternativeCaptionShort?: string;
    suggestedHashtags?: string[];
    postingTip?: string;
  } | null>(null);

  // Omni Destination Selection
  const [destination, setDestination] = useState<DestinationPlatform>('facebook_profile');
  const [executionMode, setExecutionMode] = useState<'api' | 'composer'>('composer');
  const [selectedPage, setSelectedPage] = useState<ManagedPage>(MANAGED_PAGES[0]);
  const [customPageId, setCustomPageId] = useState('');
  const [customBlogName, setCustomBlogName] = useState('aesthetic-vibes');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'info';
    message: string;
    permalink?: string;
  } | null>(null);

  // Initial load with default preset
  React.useEffect(() => {
    handleExtract(PRESETS[0].url);
  }, []);

  const handleExtract = async (targetUrl: string) => {
    if (!targetUrl || !targetUrl.trim()) return;
    setIsExtracting(true);
    setFeedbackBanner(null);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setExtractedMedia(data.data);
        setCaption(data.data.text);
        setOriginalExtractedCaption(data.data.text);
        setAiSuggestions(null);
        setFeedbackBanner({
          type: 'success',
          message: data.message || `✓ Video & text successfully extracted from ${data.data.author.name} (${data.data.author.handle})!`,
        });
      } else {
        setFeedbackBanner({
          type: 'info',
          message: data.error || 'Could not find a video at that URL. Please verify the post contains a video.',
        });
      }
    } catch (err: any) {
      setFeedbackBanner({
        type: 'info',
        message: 'Extraction error: ' + (err.message || 'Network request failed'),
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleEnhanceWithGemini = async (targetDest: string, style = 'viral') => {
    if (!caption) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/enhance-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalCaption: caption,
          destination: targetDest,
          style,
        }),
      });
      const data = await res.json();
      if (data.enhancedCaption) {
        setCaption(data.enhancedCaption);
        setAiSuggestions({
          viralHook: data.viralHook,
          alternativeCaptionShort: data.alternativeCaptionShort,
          suggestedHashtags: data.suggestedHashtags,
          postingTip: data.postingTip,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!extractedMedia) return;
    const a = document.createElement('a');
    a.href = extractedMedia.videoUrl;
    a.download = `crosspost_${destination}_${Date.now()}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // 1-Click Web Composer Launch (Works on all platforms)
  const handleComposerLaunch = (destPlatform = destination) => {
    if (!extractedMedia) return;

    // 1. Download video
    handleDownloadVideo();

    // 2. Copy caption
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);

    // 3. Resolve destination URL
    let targetUrl = 'https://www.facebook.com/';
    const destObj = DESTINATIONS.find((d) => d.id === destPlatform);
    if (destObj) {
      if (destPlatform === 'twitter') {
        targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption.slice(0, 240))}`;
      } else {
        targetUrl = destObj.composerUrl;
      }
    }

    window.open(targetUrl, '_blank');

    setFeedbackBanner({
      type: 'success',
      message: `Video downloaded to your device & caption copied! Opened ${destObj?.name || 'composer'}. Just paste (Ctrl+V) and attach the video.`,
    });

    onAddLog({
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString(),
      sourcePlatform: extractedMedia.platform,
      destination: destPlatform,
      destinationLabel: destObj?.name || destPlatform,
      videoTitle: extractedMedia.text.slice(0, 45) + '...',
      videoUrl: extractedMedia.videoUrl,
      caption,
      status: 'downloaded_and_prefilled',
    });
  };

  // Headless API Dispatch (Facebook Page, Instagram, TikTok, Tumblr)
  const handleApiPublish = async () => {
    if (!extractedMedia) return;
    setIsPublishing(true);
    setFeedbackBanner(null);

    try {
      let endpoint = '/api/facebook/publish-page';
      let body: any = {
        videoUrl: extractedMedia.videoUrl,
        caption,
      };

      if (destination === 'facebook_page') {
        endpoint = '/api/facebook/publish-page';
        body.pageId = customPageId.trim() || selectedPage.id;
        body.pageName = customPageId.trim() ? `Custom Page (${customPageId})` : selectedPage.name;
      } else if (destination === 'instagram') {
        endpoint = '/api/instagram/publish';
        body.accountId = 'ig_creator_account';
      } else if (destination === 'tiktok') {
        endpoint = '/api/tiktok/publish';
      } else if (destination === 'tumblr') {
        endpoint = '/api/tumblr/publish';
        body.blogName = customBlogName.trim() || 'my-tumblr-blog';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        const destObj = DESTINATIONS.find((d) => d.id === destination);
        setFeedbackBanner({
          type: 'success',
          message: data.message || `Dispatched to ${destObj?.name} via direct API!`,
          permalink: data.permalink,
        });

        onAddLog({
          id: data.postId || data.mediaId || data.publishId || String(Date.now()),
          timestamp: new Date().toLocaleTimeString(),
          sourcePlatform: extractedMedia.platform,
          destination,
          destinationLabel: destObj?.name || destination,
          videoTitle: extractedMedia.text.slice(0, 45) + '...',
          videoUrl: extractedMedia.videoUrl,
          caption,
          status: 'published',
          permalink: data.permalink,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const currentDestObj = DESTINATIONS.find((d) => d.id === destination) || DESTINATIONS[0];

  return (
    <div className="space-y-8 py-2">
      {/* Search & URL Input Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Paste any video post URL from X/Twitter, TikTok, Instagram Reels, or Tumblr:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="e.g. https://www.tiktok.com/@creator/video/..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => handleExtract(urlInput)}
            disabled={isExtracting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isExtracting ? 'Extracting Media...' : 'Extract Video & Text'}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
          <span className="shrink-0 text-[11px] font-medium text-slate-400">Quick Test Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setUrlInput(preset.url);
                handleExtract(preset.url);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] whitespace-nowrap transition-colors cursor-pointer border border-slate-700/60"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Live Extraction Status & Feedback Banner */}
        {isExtracting && (
          <div className="mt-4 p-3 bg-blue-950/60 border border-blue-800/60 rounded-lg text-xs text-blue-200 flex items-center gap-2 animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Fetching video stream and caption from post URL...</span>
          </div>
        )}
        {!isExtracting && feedbackBanner && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs flex items-start gap-2 border ${
              feedbackBanner.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-800/70 text-emerald-200'
                : 'bg-amber-950/50 border-amber-800/70 text-amber-200'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{feedbackBanner.message}</span>
          </div>
        )}
      </div>

      {/* Main Studio Viewport (2-Column Grid) */}
      {extractedMedia && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 Cols): Video Player & Media Specs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              {/* Media Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={extractedMedia.author.avatar}
                    alt={extractedMedia.author.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {extractedMedia.author.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {extractedMedia.author.handle}
                    </span>
                  </div>
                </div>
                <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/50">
                  {extractedMedia.platform}
                </span>
              </div>

              {/* HTML5 Video Player */}
              <div className="relative bg-black aspect-video flex items-center justify-center">
                <video
                  key={extractedMedia.videoUrl}
                  src={extractedMedia.videoUrl}
                  controls
                  playsInline
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={extractedMedia.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Metrics & Quick Actions */}
              <div className="p-4 space-y-3 bg-slate-900/50">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                  <span>Duration: {extractedMedia.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span>Likes: {extractedMedia.likes}</span>
                  <span aria-hidden="true">·</span>
                  <span>Shares: {extractedMedia.shares}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={handleDownloadVideo}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Download MP4 File</span>
                  </button>
                  <a
                    href={extractedMedia.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
                    title="View Original Post"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Omni-Directional Routing Guide */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Omni-Directional Cross-Posting Ready
                </span>
                <button
                  onClick={onGoToAdvisor}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  View Details
                </button>
              </div>
              <p className="leading-relaxed">
                Take any video from Twitter, TikTok, Instagram, or Tumblr and post it to Facebook, Instagram Reels, TikTok, Tumblr, or X with optimized captions and 1-click video packaging!
              </p>
            </div>
          </div>

          {/* Right Column (7 Cols): Caption Studio & Omni-Destination Dispatcher */}
          <div className="lg:col-span-7 space-y-6">
            {/* Caption Studio */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Post Caption Studio</h2>
                  <span className="text-xs text-slate-400">
                    Adapt and optimize caption for your chosen destination platform
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCaption(originalExtractedCaption);
                      setAiSuggestions(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset to original extracted text"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleCopyCaption}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer ml-2"
                  >
                    {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCaption ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              {/* Caption Textarea */}
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={5}
                  placeholder="Extracted caption will appear here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1">
                  <span>Characters: {caption.length}</span>
                  <span>Lines: {caption.split('\n').length}</span>
                </div>
              </div>

              {/* Gemini AI Platform-Adaptive Caption Enhancer */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    AI Format & Tone Enhancer (Gemini 3.8 Flash)
                  </span>
                  {isAiLoading && (
                    <span className="text-blue-400 animate-pulse text-[11px]">
                      Optimizing with AI...
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEnhanceWithGemini(destination.startsWith('facebook') ? 'facebook' : destination, 'viral')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-blue-300 text-xs rounded-md transition-colors cursor-pointer border border-blue-800/60 font-semibold disabled:opacity-50"
                  >
                    🎯 Optimize for {currentDestObj.name.split(' ')[0]}
                  </button>
                  <button
                    onClick={() => handleEnhanceWithGemini('instagram', 'aesthetic')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors cursor-pointer border border-slate-700/60 disabled:opacity-50"
                  >
                    📸 Instagram Reels Style
                  </button>
                  <button
                    onClick={() => handleEnhanceWithGemini('tiktok', 'viral_hook')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors cursor-pointer border border-slate-700/60 disabled:opacity-50"
                  >
                    🎵 TikTok Punchy Hook
                  </button>
                  <button
                    onClick={() => handleEnhanceWithGemini('tumblr', 'aesthetic')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors cursor-pointer border border-slate-700/60 disabled:opacity-50"
                  >
                    📼 Tumblr Aesthetic Reblog
                  </button>
                  <button
                    onClick={() => handleEnhanceWithGemini('twitter', 'concise')}
                    disabled={isAiLoading}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors cursor-pointer border border-slate-700/60 disabled:opacity-50"
                  >
                    🐦 X / Twitter &lt;280 Chars
                  </button>
                </div>

                {/* AI Extra Suggestions Pill/Chips */}
                {aiSuggestions && (
                  <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                    {aiSuggestions.viralHook && (
                      <div className="text-slate-300">
                        <span className="text-slate-400 font-semibold mr-1">Catchy Opening Hook:</span>
                        <span className="text-blue-300">"{aiSuggestions.viralHook}"</span>
                      </div>
                    )}
                    {aiSuggestions.postingTip && (
                      <div className="text-slate-400 text-[11px] italic">
                        💡 Pro-tip: {aiSuggestions.postingTip}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Omni Destination Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-white">Choose Destination Platform</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select where you want to cross-post this video:
                </p>
              </div>

              {/* Destination Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DESTINATIONS.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setDestination(dest.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      destination === dest.id
                        ? 'bg-blue-950/40 border-blue-500 shadow-sm shadow-blue-500/15'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white leading-snug">
                          {dest.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        {dest.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-blue-400">
                        {dest.badge}
                      </span>
                      {destination === dest.id && (
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Method Toggle: API vs 1-Click Copy-and-Paste Web Composer */}
              {currentDestObj.hasApi && (
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">Posting Method</span>
                    <span className="text-[11px] text-slate-400">
                      Choose automated API dispatch or 1-Click Composer helper
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800 text-xs">
                    <button
                      onClick={() => setExecutionMode('composer')}
                      className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                        executionMode === 'composer'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      1-Click Helper
                    </button>
                    <button
                      onClick={() => setExecutionMode('api')}
                      className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                        executionMode === 'api'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Direct API
                    </button>
                  </div>
                </div>
              )}

              {/* Platform-Specific Configuration Inputs */}
              {destination === 'facebook_page' && executionMode === 'api' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300">
                    Select Target Facebook Page:
                  </label>
                  <div className="space-y-2">
                    {MANAGED_PAGES.map((page) => (
                      <div
                        key={page.id}
                        onClick={() => {
                          setSelectedPage(page);
                          setCustomPageId('');
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          selectedPage.id === page.id && !customPageId
                            ? 'bg-blue-950/30 border-blue-500'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={page.avatar}
                            alt={page.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">{page.name}</span>
                            <span className="text-[11px] text-slate-400">
                              {page.category} · {page.followers} followers
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">ID: {page.id}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Or specify a Custom Page ID:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1049281726"
                      value={customPageId}
                      onChange={(e) => setCustomPageId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {destination === 'tumblr' && executionMode === 'api' && (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <label className="block font-semibold text-slate-300">
                    Tumblr Blog Identifier:
                  </label>
                  <input
                    type="text"
                    value={customBlogName}
                    onChange={(e) => setCustomBlogName(e.target.value)}
                    placeholder="my-tumblr-blog"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              )}

              {/* Action Buttons: Single Platform + Omni Blast */}
              <div className="space-y-3">
                {currentDestObj.hasApi && executionMode === 'api' ? (
                  <button
                    onClick={handleApiPublish}
                    disabled={isPublishing}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isPublishing
                        ? 'Publishing via Direct API...'
                        : `🚀 Direct API Publish to ${currentDestObj.name}`}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleComposerLaunch(destination)}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>⚡ 1-Click Download Video & Launch {currentDestObj.name}</span>
                  </button>
                )}

                {/* Omni-Blast Launcher: Multi-Destination Helper */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Want to post everywhere?</span>
                  <button
                    onClick={() => {
                      handleDownloadVideo();
                      navigator.clipboard.writeText(caption);
                      setCopiedCaption(true);
                      window.open('https://www.facebook.com/', '_blank');
                      window.open('https://www.instagram.com/', '_blank');
                      window.open('https://www.tiktok.com/creator-center/upload', '_blank');
                      window.open('https://www.tumblr.com/new/video', '_blank');
                      setFeedbackBanner({
                        type: 'success',
                        message: '⚡ Omni-Blast: Video downloaded & caption copied! Opened Facebook, Instagram, TikTok, and Tumblr composers in separate tabs.',
                      });
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span>🚀 Omni-Blast: Launch All 4 Platforms at Once</span>
                  </button>
                </div>
              </div>

              {/* Feedback Banner */}
              {feedbackBanner && (
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-4 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feedbackBanner.message}</span>
                  </div>
                  {feedbackBanner.permalink && (
                    <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-mono">
                        Published Post Link:
                      </span>
                      <a
                        href={feedbackBanner.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-300 underline font-semibold flex items-center gap-1"
                      >
                        <span>View Live Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
