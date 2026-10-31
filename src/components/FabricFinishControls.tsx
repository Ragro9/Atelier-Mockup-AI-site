import React from 'react';
import { PlacementConfig, PrintFinish } from '../types';
import {
  Sparkles,
  Layers,
  Wand2,
  Waves,
  Sun,
  ShieldCheck,
  Flame,
  Shirt,
} from 'lucide-react';

interface FabricFinishControlsProps {
  placement: PlacementConfig;
  onChange: (newPlacement: PlacementConfig) => void;
  is2DMode: boolean;
  onToggle2DMode: () => void;
}

const PRINT_FINISH_OPTIONS: {
  finish: PrintFinish;
  label: string;
  badge: string;
  desc: string;
}[] = [
  {
    finish: 'Screen Print Matte',
    label: 'Screen Print Matte',
    badge: 'Industry Standard',
    desc: 'Opaque soft ink permanently bound to cotton with subtle fabric weave show-through.',
  },
  {
    finish: 'Direct-to-Garment [DTG]',
    label: 'Direct-to-Garment [DTG]',
    badge: 'Softest Hand',
    desc: 'Water-based pigment absorbed directly into fabric fibers, perfectly following wrinkles.',
  },
  {
    finish: 'Vintage Distressed',
    label: 'Vintage Distressed / Wash',
    badge: 'Worn Aesthetic',
    desc: 'Cracked, micro-weathered print surface mimicking 50+ vintage wash cycles.',
  },
  {
    finish: 'High-Gloss Plastisol',
    label: 'High-Gloss Plastisol',
    badge: 'Specular Sheen',
    desc: 'Heavyweight rubberized ink with ambient light specular highlights and smooth finish.',
  },
  {
    finish: 'Raised 3D Embroidery',
    label: 'Raised 3D Embroidery',
    badge: 'Tactile Thread',
    desc: 'Embossed thread stitches, satin borders, and physical cast micro-shadows.',
  },
  {
    finish: 'Metallic Gold Foil',
    label: 'Metallic Gold Foil',
    badge: 'Reflective Luxury',
    desc: 'Heat-pressed metallic foil with dynamic gold luster catching directional studio lights.',
  },
  {
    finish: 'Reflective 3M Transfer',
    label: 'Reflective 3M Transfer',
    badge: 'Technical Outerwear',
    desc: 'High-visibility retroreflective micro-bead vinyl with silver studio flash response.',
  },
];

export const FabricFinishControls: React.FC<FabricFinishControlsProps> = ({
  placement,
  onChange,
  is2DMode,
  onToggle2DMode,
}) => {
  return (
    <div className="space-y-6 text-zinc-200">
      {/* 2D Flat-Lay Feature Highlight */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 to-zinc-900 border border-sky-800/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Shirt className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-zinc-100">
                2D Flat-Lay Technical Presentation
              </h4>
              <p className="text-[11px] text-zinc-400">
                Converts garments into flat 2D e-commerce catalog line visuals
              </p>
            </div>
          </div>
          <button
            onClick={onToggle2DMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              is2DMode
                ? 'bg-sky-500 text-zinc-950 border-sky-400 font-bold'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            {is2DMode ? '2D View Active' : 'Enable 2D Flat-Lay'}
          </button>
        </div>
      </div>

      {/* Print Finish Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Application &amp; Chemistry</span>
          </label>
        </div>

        <div className="space-y-2">
          {PRINT_FINISH_OPTIONS.map((opt) => {
            const isSelected = placement.printFinish === opt.finish;
            return (
              <button
                key={opt.finish}
                onClick={() => onChange({ ...placement, printFinish: opt.finish })}
                className={`w-full p-3 rounded-xl text-left transition-all border flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-zinc-800/90 border-amber-500/70 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-100">
                    {opt.label}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Fabric Physics & Wrinkle Mapping Sliders */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fabric Physics &amp; Displacement Engine</span>
          </label>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            Realtime Shader
          </span>
        </div>

        {/* Wrinkle Displacement Depth */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-300">Wrinkle Contour Displacement</span>
            <span className="font-mono text-zinc-400">{placement.displacementStrength}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={placement.displacementStrength}
            onChange={(e) =>
              onChange({
                ...placement,
                displacementStrength: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Warps logo pixels according to the garment's physical cloth folds &amp; wrinkles.
          </p>
        </div>

        {/* Knit Weave Texture Bleed */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-300">Textile Weave Texture Show-Through</span>
            <span className="font-mono text-zinc-400">{placement.weaveTextureStrength}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={placement.weaveTextureStrength}
            onChange={(e) =>
              onChange({
                ...placement,
                weaveTextureStrength: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Preserves physical fabric knit ribbing visibly underneath the graphic ink.
          </p>
        </div>

        {/* Ambient Shadows & Highlights */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-300 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Garment Shadow &amp; Highlight Mapping</span>
            </span>
            <span className="font-mono text-zinc-400">{placement.shadowBleed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={placement.shadowBleed}
            onChange={(e) =>
              onChange({
                ...placement,
                shadowBleed: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Casts real garment ambient shadows and highlights directly onto the logo artwork.
          </p>
        </div>
      </div>
    </div>
  );
};
