import React from 'react';
import { PlacementConfig, PlacementLocation, TargetSide } from '../types';
import { LOCATION_PRESETS } from '../constants/presets';
import {
  MapPin,
  Lock,
  Unlock,
  RotateCw,
  Sliders,
  Move,
  Maximize2,
  Minimize2,
  RefreshCw,
  Compass,
} from 'lucide-react';

interface PlacementControlsProps {
  placement: PlacementConfig;
  onChange: (newPlacement: PlacementConfig) => void;
  targetSide: TargetSide;
  onTargetSideChange: (side: TargetSide) => void;
}

export const PlacementControls: React.FC<PlacementControlsProps> = ({
  placement,
  onChange,
  targetSide,
  onTargetSideChange,
}) => {
  // Handle Location Preset Selection
  const handleSelectLocation = (loc: PlacementLocation) => {
    const preset = LOCATION_PRESETS[loc];
    if (!preset) return;

    if (preset.side !== targetSide) {
      onTargetSideChange(preset.side);
    }

    const newW = preset.widthInches;
    const newH = placement.lockAspectRatio
      ? Number((newW / (placement.aspectRatio || 1)).toFixed(1))
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

  // Handle Width change in inches
  const handleWidthChange = (wIn: number) => {
    const safeW = Math.max(1, Math.min(22, wIn));
    let safeH = placement.heightInches;
    if (placement.lockAspectRatio) {
      safeH = Number((safeW / (placement.aspectRatio || 1)).toFixed(2));
    }
    onChange({
      ...placement,
      location: 'Custom',
      widthInches: safeW,
      heightInches: safeH,
    });
  };

  // Handle Height change in inches
  const handleHeightChange = (hIn: number) => {
    const safeH = Math.max(1, Math.min(24, hIn));
    let safeW = placement.widthInches;
    if (placement.lockAspectRatio) {
      safeW = Number((safeH * (placement.aspectRatio || 1)).toFixed(2));
    }
    onChange({
      ...placement,
      location: 'Custom',
      heightInches: safeH,
      widthInches: safeW,
    });
  };

  // Reset to default
  const handleResetToCenter = () => {
    handleSelectLocation(
      targetSide === 'Front' ? 'Center chest' : 'Upper center between shoulder blades'
    );
  };

  return (
    <div className="space-y-6 text-zinc-200">
      {/* Precise Location Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Precise Location Preset</span>
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            {placement.location}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {(Object.keys(LOCATION_PRESETS) as PlacementLocation[])
            .filter((loc) => loc !== 'Custom')
            .map((loc) => {
              const preset = LOCATION_PRESETS[loc];
              const isSelected = placement.location === loc;
              const matchesSide = preset.side === targetSide;

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
                        {loc}
                      </h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                          preset.side === 'Front'
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-800 text-indigo-300'
                        }`}
                      >
                        {preset.side}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {preset.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-zinc-400">
                      {preset.widthInches}" × {preset.heightInches}"
                    </span>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Scale & Dimensions (Inches and Centimeters) */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Logo Dimensions &amp; Scale</span>
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
            title="Lock Aspect Ratio"
          >
            {placement.lockAspectRatio ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
            <span className="text-[10px]">Ratio Lock</span>
          </button>
        </div>

        {/* Width & Height Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              Width (Inches)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.25"
                min="1"
                max="22"
                value={placement.widthInches}
                onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 1)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-zinc-100 font-mono"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-zinc-500 font-mono">
                {(placement.widthInches * 2.54).toFixed(1)} cm
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              Height (Inches)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.25"
                min="1"
                max="24"
                value={placement.heightInches}
                onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 1)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-zinc-100 font-mono"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-zinc-500 font-mono">
                {(placement.heightInches * 2.54).toFixed(1)} cm
              </span>
            </div>
          </div>
        </div>

        {/* Quick Size Preset Chips */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] text-zinc-500">Quick Scale:</span>
          {[
            { label: 'Pocket (3.5")', w: 3.5 },
            { label: 'Medium (8")', w: 8 },
            { label: 'Standard (10.5")', w: 10.5 },
            { label: 'Oversized (13")', w: 13 },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleWidthChange(chip.w)}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Position Coordinates (Nudge & Sliders) */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-emerald-400" />
            <span>Position Coordinates</span>
          </label>
          <button
            onClick={handleResetToCenter}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            title="Reset to center"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Center</span>
          </button>
        </div>

        {/* X Offset */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-400">Horizontal Offset (X)</span>
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
            <span className="text-zinc-400">Vertical Offset from Collar (Y)</span>
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
              <span>Rotation Angle</span>
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
            <span className="text-zinc-400">Artwork Opacity</span>
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
