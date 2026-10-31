import React from 'react';
import { PlacementConfig, PlacementLocation, TargetSide } from '../types';
import { LOCATION_PRESETS } from '../constants/presets';
import {
  MapPin,
  Lock,
  Unlock,
  RotateCw,
  Move,
  Maximize2,
  RefreshCw,
  MousePointer,
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../locales/translations';

interface PlacementControlsProps {
  placement: PlacementConfig;
  onChange: (newPlacement: PlacementConfig) => void;
  targetSide: TargetSide;
  onTargetSideChange: (side: TargetSide) => void;
  lang: Language;
}

export const PlacementControls: React.FC<PlacementControlsProps> = ({
  placement,
  onChange,
  targetSide,
  onTargetSideChange,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Convert cm to inches
  const cmToInches = (cm: number) => cm / 2.54;
  const inchesToCm = (inches: number) => inches * 2.54;

  const currentWidthCm = Number(inchesToCm(placement.widthInches).toFixed(1));
  const currentHeightCm = Number(inchesToCm(placement.heightInches).toFixed(1));

  // Handle Location Preset Selection
  const handleSelectLocation = (loc: PlacementLocation) => {
    const preset = LOCATION_PRESETS[loc];
    if (!preset) return;

    if (preset.side !== targetSide) {
      onTargetSideChange(preset.side);
    }

    const newW = preset.widthInches;
    const newH = placement.lockAspectRatio
      ? Number((newW / (placement.aspectRatio || 1)).toFixed(2))
      : preset.heightInches;

    onChange({
      ...placement,
      targetSide: preset.side,
      location: loc,
      posX: preset.posX,
      posY: preset.posY,
      widthInches: newW,
      heightInches: newH,
    });
  };

  // Handle Width change in Centimeters
  const handleWidthCmChange = (cm: number) => {
    const safeCm = Math.max(2, Math.min(56, cm));
    const newWidthInches = cmToInches(safeCm);
    let newHeightInches = placement.heightInches;
    if (placement.lockAspectRatio) {
      newHeightInches = Number((newWidthInches / (placement.aspectRatio || 1)).toFixed(2));
    }
    onChange({
      ...placement,
      location: 'Custom',
      widthInches: Number(newWidthInches.toFixed(2)),
      heightInches: Number(newHeightInches.toFixed(2)),
    });
  };

  // Handle Height change in Centimeters
  const handleHeightCmChange = (cm: number) => {
    const safeCm = Math.max(2, Math.min(60, cm));
    const newHeightInches = cmToInches(safeCm);
    let newWidthInches = placement.widthInches;
    if (placement.lockAspectRatio) {
      newWidthInches = Number((newHeightInches * (placement.aspectRatio || 1)).toFixed(2));
    }
    onChange({
      ...placement,
      location: 'Custom',
      heightInches: Number(newHeightInches.toFixed(2)),
      widthInches: Number(newWidthInches.toFixed(2)),
    });
  };

  // Reset to default center
  const handleResetToCenter = () => {
    handleSelectLocation(
      targetSide === 'Front' ? 'Center chest' : 'Upper center between shoulder blades'
    );
  };

  return (
    <div className="space-y-6 text-zinc-200">
      {/* Mouse Resize Highlight Tip */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 flex items-start gap-2.5">
        <MousePointer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
          {t.mouseResizeTip}
        </p>
      </div>

      {/* Scale & Dimensions in Centimeters (cm) */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.logoDimensionsTitle}</span>
          </label>
          <button
            onClick={() =>
              onChange({
                ...placement,
                lockAspectRatio: !placement.lockAspectRatio,
              })
            }
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              placement.lockAspectRatio
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
            title={t.ratioLock}
          >
            {placement.lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span className="text-[10px]">{t.ratioLock}</span>
          </button>
        </div>

        {/* Width & Height Inputs in CM */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-300 font-medium block mb-1">
              {t.widthCm}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="2"
                max="56"
                value={currentWidthCm}
                onChange={(e) => handleWidthCmChange(parseFloat(e.target.value) || 2)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold font-mono"
              />
              <span className="absolute right-3 top-2 text-xs text-zinc-500 font-mono">
                cm
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-300 font-medium block mb-1">
              {t.heightCm}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="2"
                max="60"
                value={currentHeightCm}
                onChange={(e) => handleHeightCmChange(parseFloat(e.target.value) || 2)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold font-mono"
              />
              <span className="absolute right-3 top-2 text-xs text-zinc-500 font-mono">
                cm
              </span>
            </div>
          </div>
        </div>

        {/* Quick Size Preset Chips in CM */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-zinc-500">{t.quickScale}</span>
          {[
            { label: t.pocketSize, cm: 9 },
            { label: t.mediumSize, cm: 20 },
            { label: t.standardSize, cm: 26 },
            { label: t.oversizedSize, cm: 33 },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleWidthCmChange(chip.cm)}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md transition-colors border border-zinc-700/60"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Precise Location Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.presetLocationTitle}</span>
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            {t.locations[placement.location] || placement.location}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {(Object.keys(LOCATION_PRESETS) as PlacementLocation[])
            .filter((loc) => loc !== 'Custom')
            .map((loc) => {
              const preset = LOCATION_PRESETS[loc];
              const isSelected = placement.location === loc;
              const locWcm = (preset.widthInches * 2.54).toFixed(0);
              const locHcm = (preset.heightInches * 2.54).toFixed(0);

              return (
                <button
                  key={loc}
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-800/90 border-amber-500/70 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">
                        {t.locations[loc] || loc}
                      </h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                          preset.side === 'Front'
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-800 text-indigo-300'
                        }`}
                      >
                        {preset.side === 'Front' ? t.front : t.back}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {locWcm} × {locHcm} cm
                    </span>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Position Coordinates & Rotation */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.positionCoordsTitle}</span>
          </label>
          <button
            onClick={handleResetToCenter}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            title={t.centerBtn}
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.centerBtn}</span>
          </button>
        </div>

        {/* X Offset */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-400">{t.horizontalOffset}</span>
            <span className="font-mono text-zinc-300">{placement.posX.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="85"
            step="0.5"
            value={placement.posX}
            onChange={(e) =>
              onChange({
                ...placement,
                location: 'Custom',
                posX: parseFloat(e.target.value),
              })
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Y Offset */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-400">{t.verticalOffset}</span>
            <span className="font-mono text-zinc-300">{placement.posY.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="85"
            step="0.5"
            value={placement.posY}
            onChange={(e) =>
              onChange({
                ...placement,
                location: 'Custom',
                posY: parseFloat(e.target.value),
              })
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Rotation */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-400 flex items-center gap-1">
              <RotateCw className="w-3 h-3" />
              <span>{t.rotationAngle}</span>
            </span>
            <span className="font-mono text-zinc-300">{placement.rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={placement.rotation}
              onChange={(e) =>
                onChange({
                  ...placement,
                  rotation: parseInt(e.target.value, 10),
                })
              }
              className="flex-1 accent-amber-400 cursor-pointer"
            />
            {placement.rotation !== 0 && (
              <button
                onClick={() => onChange({ ...placement, rotation: 0 })}
                className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded"
              >
                0°
              </button>
            )}
          </div>
        </div>

        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-400">{t.logoOpacity}</span>
            <span className="font-mono text-zinc-300">{Math.round(placement.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.02"
            value={placement.opacity}
            onChange={(e) =>
              onChange({
                ...placement,
                opacity: parseFloat(e.target.value),
              })
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
