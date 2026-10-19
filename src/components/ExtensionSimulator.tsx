import React, { useState } from 'react';
import {
  Zap,
  Download,
  Share2,
  ExternalLink,
  Check,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Sparkles,
  User,
  Building
} from 'lucide-react';
import { PlatformType, PostTarget } from '../types';

interface SimulatedPost {
  id: string;
  platform: PlatformType;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  timeAgo: string;
  text: string;
  videoUrl: string;
  thumbnail: string;
  metrics: {
    likes: string;
    comments: string;
    reposts: string;
  };
}

const SIMULATED_POSTS: SimulatedPost[] = [
  {
    id: 'tweet-1',
    platform: 'twitter',
    author: {
      name: 'Tech Robotics Daily',
      handle: '@TechRoboDaily',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    timeAgo: '2h',
    text: 'Check out this humanoid robot walking through rough mountain terrain with zero balance loss! Dynamic gait stabilization is insane. 🤖🏔️',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    metrics: { likes: '48.2K', comments: '3.1K', reposts: '12.4K' },
  },
  {
    id: 'tiktok-1',
    platform: 'tiktok',
    author: {
      name: 'Chef Marco Culinary',
      handle: '@marcocooks',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    },
    timeAgo: '4h',
    text: 'Crispy garlic parmesan potatoes! Listen to that crunch at the end. 🥔🔥 #foodie #cooking #recipe',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    metrics: { likes: '620K', comments: '18.4K', reposts: '94.2K' },
  },
  {
    id: 'insta-1',
    platform: 'instagram',
    author: {
      name: 'Wild Horizons',
      handle: '@wildhorizons.travel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    timeAgo: '6h',
    text: 'Hidden emerald lagoon in the Dolomites. Add this to your 2026 travel bucket list! 🏔️🌲 #dolomites #reels',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    metrics: { likes: '142K', comments: '4.8K', reposts: '28.9K' },
  },
  {
    id: 'tumblr-1',
    platform: 'tumblr',
    author: {
      name: 'Midnight Cinema',
      handle: 'midnight-cine-archive',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    timeAgo: '8h',
    text: '35mm anamorphic camera test in Tokyo rain. Neon reflections on wet asphalt at 3 AM. 🌧️📼 #cinematography #35mm',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    metrics: { likes: '19.4K', comments: '840', reposts: '5.2K' },
  },
];

export const ExtensionSimulator: React.FC = () => {
  const [activePlatformFilter, setActivePlatformFilter] = useState<PlatformType | 'all'>('all');
  const [capturedPost, setCapturedPost] = useState<SimulatedPost | null>(null);
  const [destination, setDestination] = useState<string>('facebook_profile');
  const [simulatedCaption, setSimulatedCaption] = useState('');
  const [isDoneFeedback, setIsDoneFeedback] = useState<string | null>(null);

  const filteredPosts =
    activePlatformFilter === 'all'
      ? SIMULATED_POSTS
      : SIMULATED_POSTS.filter((p) => p.platform === activePlatformFilter);

  const handleCaptureClick = (post: SimulatedPost) => {
    setCapturedPost(post);
    setSimulatedCaption(post.text);
    setIsDoneFeedback(null);
  };

  const handleExecutePopupAction = () => {
    if (!capturedPost) return;

    // Trigger real browser download of video
    const a = document.createElement('a');
    a.href = capturedPost.videoUrl;
    a.download = `crosspost_${destination}_${Date.now()}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Copy caption to clipboard
    navigator.clipboard.writeText(simulatedCaption);

    let targetUrl = 'https://www.facebook.com/';
    let label = 'Facebook Profile';

    if (destination === 'facebook_page') {
      targetUrl = 'https://business.facebook.com/latest/composer';
      label = 'Meta Business Suite (Facebook Page)';
    } else if (destination === 'instagram') {
      targetUrl = 'https://www.instagram.com/';
      label = 'Instagram Reels & Feed';
    } else if (destination === 'tiktok') {
      targetUrl = 'https://www.tiktok.com/creator-center/upload';
      label = 'TikTok Creator Center';
    } else if (destination === 'tumblr') {
      targetUrl = 'https://www.tumblr.com/new/video';
      label = 'Tumblr Video Composer';
    } else if (destination === 'twitter') {
      targetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(simulatedCaption.slice(0, 240));
      label = 'X / Twitter Tweet Composer';
    }

    window.open(targetUrl, '_blank');
    setIsDoneFeedback(
      `✓ Video downloaded & caption copied! Opened ${label} in a new tab.`
    );
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Chrome Extension In-Situ Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Experience how the extension automatically injects into Twitter/X, TikTok, Instagram, and Tumblr.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActivePlatformFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activePlatformFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setActivePlatformFilter('twitter')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activePlatformFilter === 'twitter'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Twitter / X
          </button>
          <button
            onClick={() => setActivePlatformFilter('tiktok')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activePlatformFilter === 'tiktok'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TikTok
          </button>
          <button
            onClick={() => setActivePlatformFilter('instagram')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activePlatformFilter === 'instagram'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Instagram Reels
          </button>
          <button
            onClick={() => setActivePlatformFilter('tumblr')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activePlatformFilter === 'tumblr'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tumblr
          </button>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols): Simulated Social Media Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>Simulated Web Page Feed</span>
            <span className="text-blue-400">Notice the injected blue badges</span>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Post Top Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{post.author.name}</span>
                        <span className="text-xs text-slate-400 font-mono">{post.author.handle}</span>
                        <span className="text-xs text-slate-500">· {post.timeAgo}</span>
                      </div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                        Platform: {post.platform}
                      </span>
                    </div>
                  </div>

                  {/* INJECTED EXTENSION BUTTON */}
                  <button
                    onClick={() => handleCaptureClick(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold transition-all shadow-sm shadow-blue-600/40 cursor-pointer animate-pulse"
                    title="Injected by CrossPost Pro Chrome Extension"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>CrossPost Video</span>
                  </button>
                </div>

                {/* Text Body */}
                <div className="p-4 text-sm text-slate-200 leading-relaxed">
                  {post.text}
                </div>

                {/* Video Media Container */}
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  <video
                    src={post.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                    poster={post.thumbnail}
                  />
                </div>

                {/* Post Footer Action Bar */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      {post.metrics.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      {post.metrics.comments}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Repeat2 className="w-4 h-4 text-emerald-400" />
                      {post.metrics.reposts}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCaptureClick(post)}
                    className="text-blue-400 hover:text-blue-300 font-sans text-xs font-semibold cursor-pointer"
                  >
                    Click to Open in Extension →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 Cols): Simulated Chrome Extension Popup Window */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Extension Popup (Simulated chrome://extensions)
          </div>

          <div className="bg-slate-900 border-2 border-blue-500/80 rounded-2xl overflow-hidden shadow-2xl">
            {/* Chrome Browser Popup Mock Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-sm font-bold text-white">CrossPost Pro</span>
              </div>
              <span className="text-[11px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-blue-400">
                {capturedPost ? capturedPost.platform : 'READY'}
              </span>
            </div>

            {/* Popup Content */}
            <div className="p-4 space-y-4">
              {capturedPost ? (
                <>
                  {/* Video mini preview */}
                  <div className="bg-black rounded-lg overflow-hidden border border-slate-800 aspect-video">
                    <video
                      src={capturedPost.videoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Caption Editor */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Captured Caption (Editable):
                    </label>
                    <textarea
                      value={simulatedCaption}
                      onChange={(e) => setSimulatedCaption(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  {/* Destination Choice */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Choose Destination Platform:
                    </span>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-xs text-white outline-none font-sans"
                    >
                      <option value="facebook_profile">Facebook: My ACTUAL Profile (Timeline)</option>
                      <option value="facebook_page">Facebook: A Page I Manage</option>
                      <option value="instagram">Instagram: Reels & Feed Composer</option>
                      <option value="tiktok">TikTok: Creator Center Upload</option>
                      <option value="tumblr">Tumblr: Video Post Composer</option>
                      <option value="twitter">X / Twitter: New Tweet Video</option>
                    </select>
                  </div>

                  {/* 1-Click Action Button */}
                  <button
                    onClick={handleExecutePopupAction}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>⚡ 1-Click Video Download & Launch Destination</span>
                  </button>

                  {isDoneFeedback && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isDoneFeedback}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">No Video Post Captured Yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Click the blue <strong>"⚡ CrossPost to FB"</strong> badge on any tweet or video on the left to test the extension!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
