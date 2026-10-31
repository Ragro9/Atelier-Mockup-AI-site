import React, { useRef, useState } from 'react';
import { LogoPreset } from '../types';
import { LOGO_PRESETS } from '../constants/presets';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Contrast,
  Scissors,
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../locales/translations';

interface LogoSelectorProps {
  currentLogo: LogoPreset | null;
  onSelectLogo: (logo: LogoPreset) => void;
  customLogoImage: string | null;
  onCustomLogoUpload: (dataUrl: string, name?: string) => void;
  onInvertLogoColors: () => void;
  onRemoveLogoBackground: () => void;
  isProcessingLogo: boolean;
  lang: Language;
}

export const LogoSelector: React.FC<LogoSelectorProps> = ({
  currentLogo,
  onSelectLogo,
  customLogoImage,
  onCustomLogoUpload,
  onInvertLogoColors,
  onRemoveLogoBackground,
  isProcessingLogo,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onCustomLogoUpload(event.target.result, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  return (
    <div className="space-y-6 text-zinc-200">
      {/* Upload Logo (IMAGE 2) Box */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>{t.uploadLogoTitle}</span>
          </label>
          {customLogoImage && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> {t.customLogoActive}
            </span>
          )}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-full bg-zinc-800 text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                {t.dropLogoText}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {t.dropLogoHint}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Artwork Processing Tools */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
          {t.utilityToolsTitle}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onInvertLogoColors}
            disabled={isProcessingLogo}
            className="py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
            title="Përmbys të zezën në të bardhë ose të bardhën në të zezë"
          >
            <Contrast className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.invertColors}</span>
          </button>

          <button
            onClick={onRemoveLogoBackground}
            disabled={isProcessingLogo}
            className="py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
            title="Hiq automatikisht sfondin e bardhë të logos"
          >
            <Scissors className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.keyOutWhite}</span>
          </button>
        </div>
      </div>

      {/* Sample Graphics Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.sampleLogosTitle}
          </label>
          <span className="text-[11px] text-zinc-500">{t.instantEmblems}</span>
        </div>

        <div className="space-y-2">
          {LOGO_PRESETS.map((logo) => {
            const isSelected = !customLogoImage && currentLogo?.id === logo.id;
            const logoCm = (logo.defaultWidthInches * 2.54).toFixed(0);
            return (
              <button
                key={logo.id}
                onClick={() => onSelectLogo(logo)}
                className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center gap-3 ${
                  isSelected
                    ? 'bg-zinc-800/90 border-amber-500/70 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="w-14 h-12 bg-zinc-950/80 rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-zinc-800/80">
                  <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">
                    {logo.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {logo.category} • {logoCm} cm
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
