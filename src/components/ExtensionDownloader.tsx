import React, { useState } from 'react';
import { Download, FileCode, Check, Copy, Terminal, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { EXTENSION_FILES, generateExtensionZipBlob } from '../lib/extensionGenerator';

interface ExtensionDownloaderProps {
  onDownloadExtension: () => void;
  isDownloading: boolean;
}

export const ExtensionDownloader: React.FC<ExtensionDownloaderProps> = ({
  onDownloadExtension,
  isDownloading,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedFile = EXTENSION_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10 py-4">
      {/* Top Banner: Download Card & Installation Guide */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-900/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <span>Production-Ready Chrome Extension</span>
            <span aria-hidden="true">·</span>
            <span>Manifest V3 Compliant</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Download Unpacked Chrome Extension Package
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Contains everything needed: content scripts for X/Twitter, Instagram Reels, TikTok, Tumblr, and Facebook auto-assist, background service worker, and the interactive popup.
          </p>
        </div>

        <button
          onClick={onDownloadExtension}
          disabled={isDownloading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-3 shrink-0 cursor-pointer disabled:opacity-75"
        >
          <Download className="w-5 h-5" />
          <span>{isDownloading ? 'Building Zip Package...' : 'Download Extension (.zip)'}</span>
        </button>
      </div>

      {/* 3-Step Installation Guide */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">How to Install in Chrome, Brave, Edge, or Arc</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-sm font-mono border border-blue-900/60">
              01
            </div>
            <h4 className="font-bold text-white text-sm">Extract the ZIP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unpack the downloaded <code className="text-slate-300">crosspost-pro-extension.zip</code> into a dedicated folder on your computer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-sm font-mono border border-blue-900/60">
              02
            </div>
            <h4 className="font-bold text-white text-sm">Open chrome://extensions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In your browser, visit <code className="text-slate-300">chrome://extensions/</code> and toggle the <strong>Developer mode</strong> switch in the top-right corner to <strong>ON</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-sm font-mono border border-blue-900/60">
              03
            </div>
            <h4 className="font-bold text-white text-sm">Click "Load unpacked"</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the <strong>Load unpacked</strong> button on the top-left and select the extracted folder. You're done! Pin it to your browser toolbar.
            </p>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white">Extension Source Code Inspector</h3>
            <p className="text-xs text-slate-400">
              Review or copy any file included in the Manifest V3 package
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-700 shrink-0"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied to Clipboard!' : `Copy ${selectedFile.name}`}</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {/* File Tab Selectors */}
          <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto">
            {EXTENSION_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFileIndex === idx
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>

          {/* File Meta description */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>{selectedFile.description}</span>
            <span className="font-mono text-[11px] text-slate-500">
              {selectedFile.content.split('\n').length} lines · {selectedFile.content.length} bytes
            </span>
          </div>

          {/* Syntax Highlighted Box */}
          <div className="p-4 bg-slate-950 overflow-x-auto font-mono text-xs leading-relaxed max-h-[480px]">
            <pre className="text-slate-200">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
