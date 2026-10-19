import React from 'react';
import { ShieldCheck, Layers, FileCode, CheckCircle, ArrowRight, Share2, Globe, Cpu } from 'lucide-react';

interface ArchitectureAdvisorProps {
  onGoToStudio: () => void;
  onGoToExtension: () => void;
}

export const ArchitectureAdvisor: React.FC<ArchitectureAdvisorProps> = ({
  onGoToStudio,
  onGoToExtension,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Editorial Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
          <span>Architectural Advisory</span>
          <span aria-hidden="true">·</span>
          <span>Omni-Directional Social Video Cross-Posting</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Cross-Posting in Any Direction: Facebook, Instagram, TikTok, Tumblr & X
        </h1>
        <p className="mt-4 text-base text-slate-300 leading-relaxed">
          CrossPost Pro supports true <strong>omni-directional cross-posting</strong>. You can capture any video from
          Twitter/X, Instagram, TikTok, or Tumblr, and publish it to <strong>Facebook (Profile or Page), Instagram Reels, TikTok, Tumblr, or X</strong>.
          Here is how direct API access compares to 1-Click Composer automation across each platform.
        </p>
      </div>

      {/* Comparison Grid: Profile vs Managed Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Actual Profile */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Destination A
              </span>
              <span className="text-xs text-slate-400">Meta Privacy Policy</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Your Actual Personal Profile</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              In 2018, Meta strictly deprecated <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded text-xs">publish_actions</code> to prevent unauthorized automated bot posting on personal timelines. No third-party API in the world can silently upload videos to a personal Facebook account without the user interacting with Facebook.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>The Winning Solution:</strong> 1-Click Video Downloader + Smart Composer Opener.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>The extension/app auto-downloads the clean <code className="text-slate-200">.mp4</code> to your computer, copies the refined caption to your clipboard, and launches Facebook's post creator.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Our injected Facebook content script shows an overlay reminder: simply press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">Ctrl+V</kbd> to paste the text and select the downloaded video.</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 block mb-2">User Effort:</span>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300 bg-amber-950/30 border border-amber-900/40 rounded-lg p-2.5">
              <span>⚡ 1 Click to Download & Copy + 1 Click to Publish in Facebook</span>
            </div>
          </div>
        </div>

        {/* Card 2: Managed Page */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                Destination B
              </span>
              <span className="text-xs text-slate-400">Official Graph API</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">A Facebook Page You Manage</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Facebook Pages enjoy <strong>first-class programmatic API support</strong>! With a Page Access Token and <code className="text-blue-300 bg-slate-950 px-1 py-0.5 rounded text-xs">pages_manage_posts</code> permission, videos can be uploaded and published directly through code without ever opening Facebook.
            </p>
            <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Direct Headless Video Publishing:</strong> Dispatches via <code className="text-slate-200">POST /{'{page_id}'}/videos</code> with caption, tags, and thumbnails.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Meta Business Suite Integration:</strong> Can also deep-link into Meta Business Suite with pre-populated drafts.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Scheduling Support:</strong> Schedule video releases at optimal engagement peak hours.</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 block mb-2">User Effort:</span>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-300 bg-blue-950/30 border border-blue-900/40 rounded-lg p-2.5">
              <span>🚀 100% Automated Instant Server-to-Facebook Publishing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Destination Platform Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Full Omni-Directional Cross-Posting Capability Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            How video extraction & publishing works across every major network:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Headless API Status</th>
                <th className="py-2.5 px-3">1-Click Composer Helper</th>
                <th className="py-2.5 px-3">AI Caption Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Instagram Reels</td>
                <td className="py-3 px-3 text-blue-400">Supported for Business/Creator accounts via Meta Graph API container</td>
                <td className="py-3 px-3 text-emerald-400">✓ Auto-downloads MP4, copies caption, launches Instagram Reels creator</td>
                <td className="py-3 px-3 text-slate-400">Aesthetic spacing, 10-15 reel hashtags, creator credits</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">TikTok</td>
                <td className="py-3 px-3 text-blue-400">Supported via TikTok Content Posting API (v2)</td>
                <td className="py-3 px-3 text-emerald-400">✓ Auto-downloads MP4, copies caption, launches TikTok Creator Center</td>
                <td className="py-3 px-3 text-slate-400">Concise hook (&lt;150 chars), viral sound tags (#fyp, #viral)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Tumblr</td>
                <td className="py-3 px-3 text-blue-400">Supported via Tumblr API v2 Video endpoint</td>
                <td className="py-3 px-3 text-emerald-400">✓ Auto-downloads MP4, copies caption, launches Tumblr Video Composer</td>
                <td className="py-3 px-3 text-slate-400">Aesthetic tags, quote block formatting, sensory/archive commentary</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">X / Twitter</td>
                <td className="py-3 px-3 text-slate-400">Twitter API v2 (Requires paid dev tier)</td>
                <td className="py-3 px-3 text-emerald-400">✓ Auto-downloads MP4, launches pre-filled Tweet Composer intent link</td>
                <td className="py-3 px-3 text-slate-400">Strictly &lt;280 characters, crisp hook, 2 hashtags max</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Facebook (Profile & Page)</td>
                <td className="py-3 px-3 text-blue-400">Official Graph API for Pages / Deprecated for Personal Profile</td>
                <td className="py-3 px-3 text-emerald-400">✓ Auto-downloads MP4, copies caption, launches Facebook Post Creator</td>
                <td className="py-3 px-3 text-slate-400">Storytelling narrative, line breaks, engagement questions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Hybrid: Extension + Web App */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Why a Hybrid System (Browser Extension + Web Studio) is the Best Choice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300 mt-6">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">1. In-Situ Browser Grabbing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When scrolling X/Twitter, Instagram Reels, TikTok, or Tumblr, you don't want to copy URLs back and forth. The Chrome Extension injects a native <strong>"⚡ CrossPost to FB"</strong> badge directly below the video post, grabbing the raw media stream immediately.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">2. AI Caption Studio (Gemini)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tweets are written for Twitter (280 chars), but Facebook videos thrive with storytelling, viral hook openings, and discussion prompts. The companion web app lets you optimize the caption in 1 second using Gemini AI before posting.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">3. Zero Expensive 3rd-Party APIs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              By reading video streams through client-side DOM inspection, you bypass Twitter's $100+/mo API paywalls and TikTok watermarks, downloading the high-definition MP4 directly.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-slate-800">
          <button
            onClick={onGoToStudio}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <span>Try the Live CrossPost Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onGoToExtension}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-700"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Inspect & Download Extension Code</span>
          </button>
        </div>
      </div>

      {/* Multi-Platform Extraction Architecture */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Multi-Platform Extraction Mechanics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">X / Twitter</span>
              <span className="text-[11px] text-slate-400 font-mono">twitter.js</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watches <code className="text-slate-300">article[data-testid="tweet"]</code>. Extracts video blob, author handle, and <code className="text-slate-300">div[data-testid="tweetText"]</code>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">TikTok</span>
              <span className="text-[11px] text-slate-400 font-mono">tiktok.js</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Finds active video player in feed, captures original MP4 stream, creator username, and video caption hashtags.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">Instagram Reels</span>
              <span className="text-[11px] text-slate-400 font-mono">instagram.js</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects Reels dialog or feed item, sniffs video element source, captures full description and audio title.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">Tumblr</span>
              <span className="text-[11px] text-slate-400 font-mono">tumblr.js</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Injects into Tumblr dashboard video posts, captures embedded video URL, author blog, and tags.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
