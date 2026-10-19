import React from 'react';
import { CrossPostLogItem } from '../types';
import { ExternalLink, CheckCircle2, ArrowUpRight, History } from 'lucide-react';

interface HistoryLogProps {
  logs: CrossPostLogItem[];
  onClear: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs, onClear }) => {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <h3 className="text-base font-bold text-white">Cross-Post Execution Activity</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Source Platform</th>
              <th className="py-2.5 px-3">Destination</th>
              <th className="py-2.5 px-3">Post Caption Preview</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3 px-3">
                  <span className="font-mono uppercase text-[11px] px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                    {log.sourcePlatform}
                  </span>
                </td>
                <td className="py-3 px-3 font-medium whitespace-nowrap text-blue-300">
                  {log.destinationLabel}
                </td>
                <td className="py-3 px-3 max-w-xs truncate text-slate-300">
                  {log.caption}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  {log.status === 'published' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published (API)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Video Ready & Clipboard Copied
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  {log.permalink ? (
                    <a
                      href={log.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
                    >
                      <span>Open FB</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
