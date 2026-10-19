import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LiveStudio } from './components/LiveStudio';
import { ArchitectureAdvisor } from './components/ArchitectureAdvisor';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { ExtensionDownloader } from './components/ExtensionDownloader';
import { HistoryLog } from './components/HistoryLog';
import { CrossPostLogItem } from './types';
import { generateExtensionZipBlob } from './lib/extensionGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'advisor' | 'simulator' | 'extension'>('studio');
  const [isDownloading, setIsDownloading] = useState(false);
  const [logs, setLogs] = useState<CrossPostLogItem[]>([]);

  const handleDownloadExtension = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateExtensionZipBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'crosspost-pro-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create extension zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddLog = (item: CrossPostLogItem) => {
    setLogs((prev) => [item, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Contract (3 zones) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadExtension={handleDownloadExtension}
        isDownloading={isDownloading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-10">
        {activeTab === 'studio' && (
          <>
            <LiveStudio
              onAddLog={handleAddLog}
              onGoToAdvisor={() => setActiveTab('advisor')}
            />
            <HistoryLog logs={logs} onClear={handleClearLogs} />
          </>
        )}

        {activeTab === 'advisor' && (
          <ArchitectureAdvisor
            onGoToStudio={() => setActiveTab('studio')}
            onGoToExtension={() => setActiveTab('extension')}
          />
        )}

        {activeTab === 'simulator' && (
          <ExtensionSimulator />
        )}

        {activeTab === 'extension' && (
          <ExtensionDownloader
            onDownloadExtension={handleDownloadExtension}
            isDownloading={isDownloading}
          />
        )}
      </main>

      {/* Quiet, Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CrossPost Pro</span>
            <span aria-hidden="true">·</span>
            <span>Meta Graph API & Browser Media Cross-Posting Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('advisor')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Profile vs Page Advice
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('extension')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Manifest V3 Extension
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
