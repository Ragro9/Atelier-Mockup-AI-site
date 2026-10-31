import React, { useState, useEffect } from 'react';
import { PlacementConfig } from '../types';
import { generateTechPackCanvas } from '../utils/fabricShaders';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../locales/translations';

interface TechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mockupCanvas: HTMLCanvasElement | null;
  garmentName: string;
  placement: PlacementConfig;
  garmentColor: string;
  lang: Language;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({
  isOpen,
  onClose,
  mockupCanvas,
  garmentName,
  placement,
  garmentColor,
  lang,
}) => {
  const [techPackDataUrl, setTechPackDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [extraNotes, setExtraNotes] = useState<string>(
    lang === 'sq'
      ? 'Toleranca e pozicionimit të printimit +/- 0.5 cm nga qendra e jakës.'
      : 'Standard 1/4" screen alignment tolerance.'
  );

  useEffect(() => {
    if (!isOpen || !mockupCanvas) return;

    let active = true;
    setIsGenerating(true);

    generateTechPackCanvas(mockupCanvas, garmentName, placement, garmentColor, extraNotes).then(
      (canvas) => {
        if (active) {
          setTechPackDataUrl(canvas.toDataURL('image/png'));
          setIsGenerating(false);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [isOpen, mockupCanvas, garmentName, placement, garmentColor, extraNotes]);

  if (!isOpen) return null;

  const widthCm = (placement.widthInches * 2.54).toFixed(1);
  const heightCm = (placement.heightInches * 2.54).toFixed(1);

  const handleDownloadTechPack = () => {
    if (!techPackDataUrl) return;
    const link = document.createElement('a');
    link.download = `TechPack-Spec-${garmentName.replace(/\s+/g, '-')}-${placement.targetSide.toLowerCase()}-${Date.now()}.png`;
    link.href = techPackDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                {lang === 'sq'
                  ? 'Fleta Teknike e Prodhimit (Tech Pack Spec Sheet)'
                  : 'Production Tech Pack Specification Sheet'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'sq'
                  ? 'Skicë teknike për prodhuesit me përmasa të sakta në centimetra (cm) dhe tolerancë'
                  : 'Print-ready factory blueprint with exact dimensional measurements in cm'}
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
        <div className="p-6 overflow-y-auto space-y-4 text-zinc-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-zinc-300 shrink-0">
                {lang === 'sq' ? 'Shënim për Fabrikën:' : 'Custom Note for Factory:'}
              </span>
              <input
                type="text"
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder={lang === 'sq' ? 'Udhëzime shtesë për printuesin...' : 'Special instructions...'}
                className="bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1 text-zinc-200 w-full max-w-md"
              />
            </div>
            <div className="text-emerald-400 text-xs font-mono font-bold shrink-0">
              {widthCm} cm × {heightCm} cm
            </div>
          </div>

          {/* Tech Pack Preview Image */}
          <div className="bg-white rounded-xl p-2 shadow-inner border border-zinc-700/80 flex items-center justify-center min-h-[400px]">
            {isGenerating ? (
              <div className="py-20 text-center text-zinc-700">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold">
                  {lang === 'sq' ? 'Po gjenerohet fleta teknike me rezolucion të lartë...' : 'Generating high-resolution tech pack sheet...'}
                </p>
              </div>
            ) : techPackDataUrl ? (
              <img
                src={techPackDataUrl}
                alt="Tech Pack Sheet"
                className="w-full h-auto max-h-[60vh] object-contain rounded"
              />
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'sq'
                ? 'Gati për sitotip, printera DTG dhe rrobaqepës'
                : 'Ready for Screen Printers, DTG Operators & Cut-and-Sew Manufacturers'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {lang === 'sq' ? 'Mbyll' : 'Close'}
            </button>
            <button
              onClick={handleDownloadTechPack}
              disabled={!techPackDataUrl || isGenerating}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'sq' ? 'Shkarko Fletën Teknike (PNG)' : 'Download Tech Pack (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
