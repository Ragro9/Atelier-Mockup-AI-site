import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Code,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ShareEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const ShareEmbedModal: React.FC<ShareEmbedModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  if (!isOpen) return null;

  const currentUrl = appUrl || window.location.href;
  const iframeSnippet = `<iframe src="${currentUrl}" width="100%" height="850px" frameborder="0" allow="clipboard-write" style="border: 1px solid #27272a; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);" title="Atelier Studio Apparel Mockup"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                Share &amp; Embed into Google Sites
              </h3>
              <p className="text-xs text-zinc-400">
                Deploy this mockup studio as a Google Site embed or shareable web app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Direct Share Link */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Direct Web App Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Google Sites Step-by-Step Guide */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>How to Embed into Google Sites</span>
            </div>
            <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Open your <strong>Google Site</strong> in Google Sites editor.
              </li>
              <li>
                In the right panel, click <strong>Insert &gt; Embed</strong>.
              </li>
              <li>
                Choose <strong>By URL</strong> and paste the app link above, or choose <strong>Embed Code</strong> and paste the HTML snippet below.
              </li>
              <li>
                Resize the embedded frame on your page so team members and clients can test placements freely!
              </li>
            </ol>
          </div>

          {/* HTML Embed Snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-zinc-500" />
                <span>Responsive Embed Code (IFrame)</span>
              </label>
              <button
                onClick={handleCopyIframe}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                {copiedIframe ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied Code</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              rows={4}
              value={iframeSnippet}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[11px] text-zinc-300 font-mono select-all focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
