import React from 'react';
import { StylistReport } from '../types';
import {
  Sparkles,
  X,
  CheckCircle2,
  DollarSign,
  Palette,
  Layers,
  Printer,
} from 'lucide-react';
import { Language } from '../locales/translations';

interface StylistReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StylistReport | null;
  isLoading: boolean;
  onRefreshReview: () => void;
  garmentName: string;
  placementLocation: string;
  lang: Language;
}

export const StylistReviewModal: React.FC<StylistReviewModalProps> = ({
  isOpen,
  onClose,
  report,
  isLoading,
  onRefreshReview,
  garmentName,
  placementLocation,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                {lang === 'sq'
                  ? 'Stilist Mode Digjital & Drejtues Kreativ'
                  : 'Digital Fashion Stylist & Creative Director'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'sq'
                  ? 'Vlerësim i përmasave, raportit të artë dhe teknikave të printimit për e-commerce'
                  : 'Automated e-commerce styling, proportion analysis & factory print audit'}
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
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  {lang === 'sq'
                    ? 'Stilisti i modës po analizon maketën tuaj të veshjes...'
                    : 'Fashion Stylist is auditing your product mockup...'}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {lang === 'sq'
                    ? 'Duke vlerësuar proporcionet e logos, kontrastin e ngjyrave dhe koston e prodhimit.'
                    : 'Evaluating golden ratio proportions, ink color contrast, and production efficiency.'}
                </p>
              </div>
            </div>
          ) : report ? (
            <>
              {/* Score & Verdict Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-800/60 to-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex flex-col items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
                    <span className="text-2xl leading-none">
                      {report.aestheticScore ?? 9.4}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase font-bold opacity-80">
                      / 10
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {lang === 'sq' ? 'Verdikti i Stilistit' : 'Stylist Verdict'}
                    </span>
                    <h4 className="text-lg font-bold text-zinc-100">
                      {report.verdictTitle || (lang === 'sq' ? 'Proporcione Perfekte për Streetwear' : 'Harmonious Streetwear Proportions')}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {garmentName} • {placementLocation}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'sq' ? 'Gati për Shitje' : 'Commercial Ready'}</span>
                  </span>
                </div>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Proportions & Sizing */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <Layers className="w-4 h-4" />
                    <span>{lang === 'sq' ? 'Raporti i Artë & Përmasat' : 'Golden Ratio & Sizing'}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {report.goldenRatioAnalysis ||
                      (lang === 'sq'
                        ? 'Përmasat aktuale të logos krijojnë ekuilibër ideal vizual me gjerësinë e shpatullave dhe thellësinë e jakës.'
                        : 'The current graphic dimensions occupy an optimal chest-to-shoulder ratio, providing strong visual balance.')}
                  </p>
                </div>

                {/* Print Chemistry */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'sq' ? 'Teknika e Rekomanduar e Printimit' : 'Recommended Print Method'}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {report.printTechniqueRecommendation ||
                      (lang === 'sq'
                        ? 'Sitotip me bojëra uji ose DTG për të ruajtur frymëmarrjen e pëlhurës dhe qëndrueshmëri gjatë larjeve.'
                        : 'Water-based screen print or discharge underbase recommended for soft hand-feel that breathes naturally.')}
                  </p>
                </div>

                {/* Color Harmony */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                    <Palette className="w-4 h-4" />
                    <span>{lang === 'sq' ? 'Kontrasti & Harmonia e Ngjyrave' : 'Color Contrast & Palette'}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {report.colorHarmonyAdvice ||
                      (lang === 'sq'
                        ? 'Kontrasti i lartë garanton që logoja të dallohet qartë në ekranet e telefonave dhe dyqanet online.'
                        : 'High contrast ensures graphic legibility across standard e-commerce mobile product grids.')}
                  </p>
                </div>

                {/* Retail Positioning */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{lang === 'sq' ? 'Çmimi i Sygjeruar për Shitje' : 'Retail Pricing Tier'}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {report.retailPriceTier ||
                      (lang === 'sq'
                        ? 'Veshje Premium Streetwear (€35 - €55 / 3,500 - 5,500 Lekë). Ideale për katalog modern online.'
                        : 'Premium Direct-to-Consumer Streetwear ($45 - $65 USD). Fits modern boutique catalog aesthetics.')}
                  </p>
                </div>
              </div>

              {/* Factory Production Tips */}
              {report.productionTips && report.productionTips.length > 0 && (
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {lang === 'sq' ? 'Këshilla Teknike për Fabrikën / Printuesin' : 'Factory & Screen Printer Directives'}
                  </h5>
                  <div className="space-y-1.5">
                    {report.productionTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="text-amber-400 font-bold shrink-0">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-zinc-400">
              <p className="text-sm">
                {lang === 'sq' ? 'Nuk është gjeneruar ende një raport auditimi.' : 'No review report generated yet.'}
              </p>
              <button
                onClick={onRefreshReview}
                className="mt-3 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg transition-colors"
              >
                {lang === 'sq' ? 'Fillo Auditin e Stilistit' : 'Run Stylist Audit'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={onRefreshReview}
            disabled={isLoading}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {lang === 'sq' ? 'Rivlerëso Pozicionin' : 'Re-evaluate Placement'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
          >
            {lang === 'sq' ? 'Në Rregull' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
