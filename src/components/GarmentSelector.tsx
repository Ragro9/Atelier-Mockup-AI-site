import React, { useRef, useState } from 'react';
import { GarmentPreset, TargetSide } from '../types';
import { GARMENT_PRESETS } from '../constants/presets';
import {
  Upload,
  Sparkles,
  Shirt,
  Palette,
  Check,
  Layers,
  FlipHorizontal,
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../locales/translations';

interface GarmentSelectorProps {
  currentGarment: GarmentPreset | null;
  onSelectGarment: (garment: GarmentPreset) => void;
  customGarmentImage: string | null;
  onCustomGarmentUpload: (dataUrl: string, name?: string) => void;
  targetSide: TargetSide;
  onTargetSideChange: (side: TargetSide) => void;
  garmentColor: string;
  onGarmentColorChange: (colorHex: string) => void;
  is2DMode: boolean;
  onToggle2DMode: () => void;
  onConvertTo2DWithAi: () => void;
  isConverting2D: boolean;
  lang: Language;
}

export const GarmentSelector: React.FC<GarmentSelectorProps> = ({
  currentGarment,
  onSelectGarment,
  customGarmentImage,
  onCustomGarmentUpload,
  targetSide,
  onTargetSideChange,
  garmentColor,
  onGarmentColorChange,
  is2DMode,
  onToggle2DMode,
  onConvertTo2DWithAi,
  isConverting2D,
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
        onCustomGarmentUpload(event.target.result, file.name.replace(/\.[^/.]+$/, ''));
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
      {/* Upload Garment (IMAGE 1) Box */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span>{t.uploadGarmentTitle}</span>
          </label>
          {customGarmentImage && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> {t.customUploadActive}
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
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                {t.dropGarmentText}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {t.dropGarmentHint}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modify Clothes to 2D Feature Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-sky-950/40 via-zinc-900 to-zinc-900 border border-sky-800/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                {t.twoDConversionTitle}
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-medium border border-sky-500/30">
                2D CAD
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {t.twoDConversionDesc}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onToggle2DMode}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border ${
              is2DMode
                ? 'bg-sky-500 text-zinc-950 font-bold border-sky-400 shadow-sm'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-750'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{is2DMode ? t.active2DView : t.toggle2DView}</span>
          </button>

          {customGarmentImage && (
            <button
              onClick={onConvertTo2DWithAi}
              disabled={isConverting2D}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 border border-sky-700/60 flex items-center gap-1.5 transition-all"
              title="Kthe foton e ngarkuar në model 2D teknik me AI"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isConverting2D ? 'animate-spin' : ''}`} />
              <span>{isConverting2D ? t.flattening : t.aiFlattenBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Side: Front / Back */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
          {t.targetSideTitle}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onTargetSideChange('Front')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
              targetSide === 'Front'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>{t.frontSide}</span>
          </button>

          <button
            onClick={() => onTargetSideChange('Back')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
              targetSide === 'Back'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>{t.backSide}</span>
          </button>
        </div>
      </div>

      {/* Garment Studio Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.studioBlanksTitle}
          </label>
          <span className="text-[11px] text-zinc-500">{t.curatedBlanks}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {GARMENT_PRESETS.map((garment) => {
            const isSelected = !customGarmentImage && currentGarment?.id === garment.id;
            return (
              <button
                key={garment.id}
                onClick={() => onSelectGarment(garment)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-800/90 border-amber-500/70 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="h-20 w-full flex items-center justify-center overflow-hidden mb-2 bg-zinc-950/40 rounded-lg p-1">
                  <img
                    src={
                      is2DMode
                        ? targetSide === 'Front'
                          ? garment.front2dImage
                          : garment.back2dImage
                        : targetSide === 'Front'
                        ? garment.frontImage
                        : garment.backImage
                    }
                    alt={garment.name}
                    className="h-full w-auto object-contain text-zinc-300"
                    style={{
                      color: isSelected ? garmentColor : garment.defaultColor,
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">
                    {garment.type}
                  </h4>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                    {garment.name.split('(')[1]?.replace(')', '') || garment.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric Color Swatches & Custom Tint */}
      {currentGarment && !customGarmentImage && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.fabricColorTitle}</span>
            </label>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">
              {garmentColor}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentGarment.availableColors.map((col) => {
              const active = garmentColor.toLowerCase() === col.hex.toLowerCase();
              return (
                <button
                  key={col.name}
                  onClick={() => onGarmentColorChange(col.hex)}
                  title={`${col.name} (${col.hex})`}
                  className={`w-7 h-7 rounded-full border-2 transition-transform relative ${
                    active
                      ? 'scale-110 border-amber-400 ring-2 ring-amber-400/40'
                      : 'border-zinc-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                >
                  {active && (
                    <Check
                      className={`w-3.5 h-3.5 m-auto ${
                        col.hex === '#f5f5f4' || col.hex === '#fdfbf7' || col.hex === '#e4e4e7'
                          ? 'text-zinc-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Custom Hex Color Picker Input */}
            <div className="relative flex items-center">
              <input
                type="color"
                value={garmentColor}
                onChange={(e) => onGarmentColorChange(e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer opacity-0 absolute inset-0"
                title="Ngjyrë e personalizuar"
              />
              <div
                className="w-7 h-7 rounded-full border border-dashed border-zinc-600 flex items-center justify-center text-[10px] text-zinc-400 hover:border-zinc-400 transition-colors pointer-events-none"
                style={{ backgroundColor: garmentColor }}
              >
                +
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
