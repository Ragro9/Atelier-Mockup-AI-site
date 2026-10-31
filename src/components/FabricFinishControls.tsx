import React from 'react';
import { PlacementConfig, PrintFinish } from '../types';
import {
  Flame,
  Waves,
  Sun,
  Shirt,
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../locales/translations';

interface FabricFinishControlsProps {
  placement: PlacementConfig;
  onChange: (newPlacement: PlacementConfig) => void;
  is2DMode: boolean;
  onToggle2DMode: () => void;
  lang: Language;
}

const PRINT_FINISH_DATA: {
  finish: PrintFinish;
  labelSq: string;
  badgeSq: string;
  descSq: string;
  labelEn: string;
  badgeEn: string;
  descEn: string;
}[] = [
  {
    finish: 'Screen Print Matte',
    labelSq: 'Sitotip Mat (Screen Print)',
    badgeSq: 'Standardi i Industrisë',
    descSq: 'Bojë e butë që lidhet përgjithmonë me pambukun me thurje të dukshme të pëlhurës.',
    labelEn: 'Screen Print Matte',
    badgeEn: 'Industry Standard',
    descEn: 'Opaque soft ink permanently bound to cotton with subtle fabric weave show-through.',
  },
  {
    finish: 'Direct-to-Garment [DTG]',
    labelSq: 'Printim Digjital Direkt në Pëlhurë [DTG]',
    badgeSq: 'Bojë e Butë Ujore',
    descSq: 'Pigment me bazë uji i absorbuar direkt në fijet e pëlhurës, që ndjek çdo rrudhë.',
    labelEn: 'Direct-to-Garment [DTG]',
    badgeEn: 'Softest Hand',
    descEn: 'Water-based pigment absorbed directly into fabric fibers, perfectly following wrinkles.',
  },
  {
    finish: 'Vintage Distressed',
    labelSq: 'Efekt Vintage i Larë / i Plakur',
    badgeSq: 'Stil Retro',
    descSq: 'Sipërfaqe e krisur dhe e zbardhur që imiton 50+ larje të veshjes vintage.',
    labelEn: 'Vintage Distressed / Wash',
    badgeEn: 'Worn Aesthetic',
    descEn: 'Cracked, micro-weathered print surface mimicking 50+ vintage wash cycles.',
  },
  {
    finish: 'High-Gloss Plastisol',
    labelSq: 'Plastisol me Shkëlqim të Lartë',
    badgeSq: 'Shkëlqim Plastik',
    descSq: 'Bojë gome e rëndë me shkëlqim dhe reflektim të dritave të studios.',
    labelEn: 'High-Gloss Plastisol',
    badgeEn: 'Specular Sheen',
    descEn: 'Heavyweight rubberized ink with ambient light specular highlights and smooth finish.',
  },
  {
    finish: 'Raised 3D Embroidery',
    labelSq: 'Qëndisje me Reliev 3D (Brodurë)',
    badgeSq: 'Fije me Prekje',
    descSq: 'Qepje e ngritur me fije mëndafshi, kufij sateni dhe hije reale mikroskopike.',
    labelEn: 'Raised 3D Embroidery',
    badgeEn: 'Tactile Thread',
    descEn: 'Embossed thread stitches, satin borders, and physical cast micro-shadows.',
  },
  {
    finish: 'Metallic Gold Foil',
    labelSq: 'Fletë Ari Metalike e Shndritshme',
    badgeSq: 'Luksoze',
    descSq: 'Fletë metalike e ngjeshur me nxehtësi që reflekton dritat e studios si ar i vërtetë.',
    labelEn: 'Metallic Gold Foil',
    badgeEn: 'Reflective Luxury',
    descEn: 'Heat-pressed metallic foil with dynamic gold luster catching directional studio lights.',
  },
  {
    finish: 'Reflective 3M Transfer',
    labelSq: 'Material Reflektues 3M',
    badgeSq: 'Reflektim Sigurie',
    descSq: 'Vinil me mikro-rruaza xhami me reflektim të lartë ndaj dritës ose flashit.',
    labelEn: 'Reflective 3M Transfer',
    badgeEn: 'Technical Outerwear',
    descEn: 'High-visibility retroreflective micro-bead vinyl with silver studio flash response.',
  },
];

export const FabricFinishControls: React.FC<FabricFinishControlsProps> = ({
  placement,
  onChange,
  is2DMode,
  onToggle2DMode,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

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
                {t.twoDConversionTitle}
              </h4>
              <p className="text-[11px] text-zinc-400">
                {t.twoDConversionDesc}
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
            {is2DMode ? t.active2DView : t.toggle2DView}
          </button>
        </div>
      </div>

      {/* Print Finish Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.printChemistryTitle}</span>
          </label>
        </div>

        <div className="space-y-2">
          {PRINT_FINISH_DATA.map((opt) => {
            const isSelected = placement.printFinish === opt.finish;
            const label = lang === 'sq' ? opt.labelSq : opt.labelEn;
            const badge = lang === 'sq' ? opt.badgeSq : opt.badgeEn;
            const desc = lang === 'sq' ? opt.descSq : opt.descEn;

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
                    {label}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {desc}
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
            <span>{t.fabricPhysicsTitle}</span>
          </label>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            {t.realtimeShader}
          </span>
        </div>

        {/* Wrinkle Displacement Depth */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-300">{t.wrinkleDisplacement}</span>
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
            {t.wrinkleDesc}
          </p>
        </div>

        {/* Knit Weave Texture Bleed */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-300">{t.weaveTexture}</span>
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
            {t.weaveDesc}
          </p>
        </div>

        {/* Ambient Shadows & Highlights */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-zinc-300 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>{t.shadowMapping}</span>
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
            {t.shadowDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
