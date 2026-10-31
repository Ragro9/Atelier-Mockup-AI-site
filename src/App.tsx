import React, { useState } from 'react';
import {
  GarmentPreset,
  LogoPreset,
  PlacementConfig,
  StylistReport,
  TargetSide,
} from './types';
import {
  GARMENT_PRESETS,
  LOGO_PRESETS,
  DEFAULT_PLACEMENT,
} from './constants/presets';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { GarmentSelector } from './components/GarmentSelector';
import { LogoSelector } from './components/LogoSelector';
import { PlacementControls } from './components/PlacementControls';
import { FabricFinishControls } from './components/FabricFinishControls';
import { StylistReviewModal } from './components/StylistReviewModal';
import { TechPackModal } from './components/TechPackModal';
import { ShareEmbedModal } from './components/ShareEmbedModal';
import { PublishOnlineModal } from './components/PublishOnlineModal';
import {
  Shirt,
  Image as ImageIcon,
  Move,
  Flame,
  Sparkles,
  Share2,
  AlertCircle,
  CheckCircle2,
  Rocket,
  Languages,
} from 'lucide-react';
import { TRANSLATIONS, Language } from './locales/translations';

export default function App() {
  // Language State - defaults to Albanian (Shqip) as requested!
  const [lang, setLang] = useState<Language>('sq');
  const t = TRANSLATIONS[lang];

  // App state
  const [currentGarment, setCurrentGarment] = useState<GarmentPreset | null>(
    GARMENT_PRESETS[0]
  );
  const [customGarmentImage, setCustomGarmentImage] = useState<string | null>(null);
  const [customGarmentName, setCustomGarmentName] = useState<string>('Veshje e Personalizuar');

  const [currentLogo, setCurrentLogo] = useState<LogoPreset | null>(LOGO_PRESETS[0]);
  const [customLogoImage, setCustomLogoImage] = useState<string | null>(null);
  const [customLogoName, setCustomLogoName] = useState<string>('Grafikë e Personalizuar');

  const [targetSide, setTargetSide] = useState<TargetSide>('Front');
  const [garmentColor, setGarmentColor] = useState<string>('#f5f5f4');
  const [placement, setPlacement] = useState<PlacementConfig>(DEFAULT_PLACEMENT);
  const [is2DMode, setIs2DMode] = useState<boolean>(false);

  // Active control tab
  const [activeTab, setActiveTab] = useState<'garment' | 'logo' | 'placement' | 'finish'>('placement');

  // AI & Processing States
  const [aiMockupResult, setAiMockupResult] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isConverting2D, setIsConverting2D] = useState<boolean>(false);
  const [isProcessingLogo, setIsProcessingLogo] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Stylist & Modals
  const [stylistReport, setStylistReport] = useState<StylistReport | null>(null);
  const [isStylistLoading, setIsStylistLoading] = useState<boolean>(false);
  const [isStylistModalOpen, setIsStylistModalOpen] = useState<boolean>(false);
  const [isTechPackModalOpen, setIsTechPackModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Helper toast notification
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Compute active garment image source
  const getGarmentImageSrc = (): string => {
    if (customGarmentImage) {
      return customGarmentImage;
    }
    if (!currentGarment) return GARMENT_PRESETS[0].frontImage;

    if (is2DMode) {
      return targetSide === 'Front'
        ? currentGarment.front2dImage
        : currentGarment.back2dImage;
    }
    return targetSide === 'Front'
      ? currentGarment.frontImage
      : currentGarment.backImage;
  };

  // Compute active logo image source
  const getLogoImageSrc = (): string => {
    if (customLogoImage) {
      return customLogoImage;
    }
    return currentLogo?.imageUrl || LOGO_PRESETS[0].imageUrl;
  };

  // Handle Logo aspect ratio update on selection/upload
  const updateLogoAspectRatio = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ratio = img.naturalWidth / Math.max(1, img.naturalHeight);
      setPlacement((prev) => ({
        ...prev,
        aspectRatio: ratio,
        heightInches: prev.lockAspectRatio
          ? Number((prev.widthInches / ratio).toFixed(2))
          : prev.heightInches,
      }));
    };
    img.src = src;
  };

  // Select Preset Garment
  const handleSelectGarment = (garment: GarmentPreset) => {
    setCurrentGarment(garment);
    setCustomGarmentImage(null);
    setGarmentColor(garment.defaultColor);
    showToast(lang === 'sq' ? `U zgjodh: ${garment.name}` : `Loaded ${garment.name}`, 'info');
  };

  // Upload Custom Garment (IMAGE 1)
  const handleCustomGarmentUpload = (dataUrl: string, name?: string) => {
    setCustomGarmentImage(dataUrl);
    setCustomGarmentName(name || (lang === 'sq' ? 'Veshje e Ngarkuar' : 'Custom Garment'));
    showToast(
      lang === 'sq'
        ? 'Fotoja e rrobave (IMAZHI 1) u ngarkua me sukses!'
        : 'Garment image uploaded successfully!',
      'success'
    );
  };

  // Select Preset Logo
  const handleSelectLogo = (logo: LogoPreset) => {
    setCurrentLogo(logo);
    setCustomLogoImage(null);
    updateLogoAspectRatio(logo.imageUrl);
    setPlacement((prev) => ({
      ...prev,
      widthInches: logo.defaultWidthInches,
      heightInches: logo.defaultWidthInches,
    }));
    showToast(
      lang === 'sq' ? `U zgjodh logoja: ${logo.name}` : `Loaded graphic: ${logo.name}`,
      'info'
    );
  };

  // Upload Custom Logo (IMAGE 2)
  const handleCustomLogoUpload = (dataUrl: string, name?: string) => {
    setCustomLogoImage(dataUrl);
    setCustomLogoName(name || (lang === 'sq' ? 'Logo e Ngarkuar' : 'Custom Artwork'));
    updateLogoAspectRatio(dataUrl);
    showToast(
      lang === 'sq'
        ? 'Logoja (IMAZHI 2) u ngarkua me sukses! Tani mund ta zmadhoni/zvogëloni me maus.'
        : 'Logo graphic uploaded successfully! You can now scale it with mouse.',
      'success'
    );
  };

  // Invert Logo Colors (White <-> Black)
  const handleInvertLogoColors = () => {
    const src = getLogoImageSrc();
    setIsProcessingLogo(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          if (imgData.data[i + 3] > 0) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const inverted = canvas.toDataURL('image/png');
        setCustomLogoImage(inverted);
        showToast(
          lang === 'sq' ? 'Ngjyrat e logos u përmbysën me sukses.' : 'Logo colors inverted.',
          'info'
        );
      }
      setIsProcessingLogo(false);
    };
    img.onerror = () => setIsProcessingLogo(false);
    img.src = src;
  };

  // Remove Light Background from Logo
  const handleRemoveLogoBackground = () => {
    const src = getLogoImageSrc();
    setIsProcessingLogo(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const r = imgData.data[i];
          const g = imgData.data[i + 1];
          const b = imgData.data[i + 2];
          if (r > 235 && g > 235 && b > 235) {
            imgData.data[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const keyed = canvas.toDataURL('image/png');
        setCustomLogoImage(keyed);
        showToast(
          lang === 'sq' ? 'Sfondi i bardhë u fshi me transparencë.' : 'White background keyed.',
          'success'
        );
      }
      setIsProcessingLogo(false);
    };
    img.onerror = () => setIsProcessingLogo(false);
    img.src = src;
  };

  // Convert uploaded clothes to 2D flat-lay via Gemini AI
  const handleConvertTo2DWithAi = async () => {
    const garmentSrc = getGarmentImageSrc();
    setIsConverting2D(true);
    try {
      const response = await fetch('/api/convert-to-2d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: garmentSrc,
          garmentType: currentGarment?.type || customGarmentName,
        }),
      });
      const data = await response.json();
      if (data.success && data.imageUrl) {
        setCustomGarmentImage(data.imageUrl);
        setIs2DMode(true);
        showToast(
          lang === 'sq'
            ? 'Veshja u transformua në pamje teknike 2D Flat-Lay!'
            : 'Clothing transformed into 2D flat-lay view!',
          'success'
        );
      } else {
        showToast(data.message || data.error || 'Nuk mund të konvertohej në 2D.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Gabim gjatë kthimit në 2D.', 'error');
    } finally {
      setIsConverting2D(false);
    }
  };

  // Generate Photorealistic Commercial Studio Mockup with Gemini API
  const handleGenerateAiMockup = async () => {
    setIsAiGenerating(true);
    try {
      const garmentSrc = getGarmentImageSrc();
      const logoSrc = getLogoImageSrc();

      const response = await fetch('/api/generate-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: garmentSrc,
          logoImage: logoSrc,
          placement: {
            ...placement,
            targetSide,
          },
          is2dFlatlay: is2DMode,
          garmentType: currentGarment?.type || customGarmentName,
          garmentColor: garmentColor,
        }),
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setAiMockupResult(data.imageUrl);
        showToast(
          lang === 'sq'
            ? 'Maketa fotorealiste me pëlhurë u krijua me sukses me AI!'
            : 'Photorealistic studio mockup generated successfully!',
          'success'
        );
      } else {
        showToast(
          data.message || data.error || (lang === 'sq' ? 'Dështoi gjenerimi me AI.' : 'Failed to generate studio mockup.'),
          'error'
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Gabim gjatë lidhjes me AI.', 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Run Fashion Stylist Review
  const handleRunStylistReview = async () => {
    setIsStylistLoading(true);
    setIsStylistModalOpen(true);
    try {
      const response = await fetch('/api/stylist-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentInfo: {
            type: currentGarment?.type || customGarmentName,
            color: garmentColor,
          },
          placement: {
            ...placement,
            targetSide,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.stylistReport) {
        setStylistReport(data.stylistReport);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStylistLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
              : toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
              : 'bg-zinc-900/95 text-zinc-200 border-zinc-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-amber-500/20">
            <Shirt className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-zinc-100">
                {t.appTitle}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                {t.appBadge}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Language Switcher (Shqip / English) */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setLang('sq')}
              className={`px-2 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                lang === 'sq'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Shqip"
            >
              <span>🇦🇱 Shqip</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                lang === 'en'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="English"
            >
              <span>🇬🇧 EN</span>
            </button>
          </div>

          {/* Target Side Quick Switch */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => {
                setTargetSide('Front');
                setPlacement((p) => ({ ...p, targetSide: 'Front' }));
              }}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                targetSide === 'Front'
                  ? 'bg-zinc-800 text-amber-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.front}
            </button>
            <button
              onClick={() => {
                setTargetSide('Back');
                setPlacement((p) => ({ ...p, targetSide: 'Back' }));
              }}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                targetSide === 'Back'
                  ? 'bg-zinc-800 text-amber-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.back}
            </button>
          </div>

          {/* Publish Online Free Button */}
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-zinc-950 flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            title={t.publishOnline}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.publishOnline}</span>
          </button>

          {/* Share & Google Sites Embed */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
            title={t.googleSitesEmbed}
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">{t.googleSitesEmbed}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center Viewport: Interactive Canvas with Mouse Resizing */}
        <div className="flex-1 h-full p-3 lg:p-4 overflow-hidden flex flex-col">
          <InteractiveCanvas
            garmentImageSrc={getGarmentImageSrc()}
            logoImageSrc={getLogoImageSrc()}
            placement={placement}
            onPlacementChange={setPlacement}
            garmentColor={garmentColor}
            currentGarment={currentGarment}
            is2DMode={is2DMode}
            onToggle2DMode={() => setIs2DMode(!is2DMode)}
            aiMockupResult={aiMockupResult}
            isAiGenerating={isAiGenerating}
            onGenerateAiMockup={handleGenerateAiMockup}
            onOpenStylistReview={handleRunStylistReview}
            onOpenTechPack={() => setIsTechPackModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            lang={lang}
          />
        </div>

        {/* Right Drawer: Studio Controls & Specifications */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800/80 flex flex-col shrink-0 h-[45vh] lg:h-full z-20">
          {/* Tab Navigation */}
          <div className="grid grid-cols-4 border-b border-zinc-800/80 bg-zinc-950/80 p-1 gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('garment')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'garment'
                  ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span className="text-[11px] truncate">{t.tabGarment}</span>
            </button>

            <button
              onClick={() => setActiveTab('logo')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'logo'
                  ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-[11px] truncate">{t.tabLogo}</span>
            </button>

            <button
              onClick={() => setActiveTab('placement')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'placement'
                  ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Move className="w-4 h-4" />
              <span className="text-[11px] truncate">{t.tabPlacement}</span>
            </button>

            <button
              onClick={() => setActiveTab('finish')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'finish'
                  ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="text-[11px] truncate">{t.tabFabric}</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            {activeTab === 'garment' && (
              <GarmentSelector
                currentGarment={currentGarment}
                onSelectGarment={handleSelectGarment}
                customGarmentImage={customGarmentImage}
                onCustomGarmentUpload={handleCustomGarmentUpload}
                targetSide={targetSide}
                onTargetSideChange={(side) => {
                  setTargetSide(side);
                  setPlacement((p) => ({ ...p, targetSide: side }));
                }}
                garmentColor={garmentColor}
                onGarmentColorChange={setGarmentColor}
                is2DMode={is2DMode}
                onToggle2DMode={() => setIs2DMode(!is2DMode)}
                onConvertTo2DWithAi={handleConvertTo2DWithAi}
                isConverting2D={isConverting2D}
                lang={lang}
              />
            )}

            {activeTab === 'logo' && (
              <LogoSelector
                currentLogo={currentLogo}
                onSelectLogo={handleSelectLogo}
                customLogoImage={customLogoImage}
                onCustomLogoUpload={handleCustomLogoUpload}
                onInvertLogoColors={handleInvertLogoColors}
                onRemoveLogoBackground={handleRemoveLogoBackground}
                isProcessingLogo={isProcessingLogo}
                lang={lang}
              />
            )}

            {activeTab === 'placement' && (
              <PlacementControls
                placement={placement}
                onChange={setPlacement}
                targetSide={targetSide}
                onTargetSideChange={(side) => {
                  setTargetSide(side);
                  setPlacement((p) => ({ ...p, targetSide: side }));
                }}
                lang={lang}
              />
            )}

            {activeTab === 'finish' && (
              <FabricFinishControls
                placement={placement}
                onChange={setPlacement}
                is2DMode={is2DMode}
                onToggle2DMode={() => setIs2DMode(!is2DMode)}
                lang={lang}
              />
            )}
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateAiMockup}
              disabled={isAiGenerating}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isAiGenerating
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isAiGenerating ? t.generating : t.generateAiMockup}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StylistReviewModal
        isOpen={isStylistModalOpen}
        onClose={() => setIsStylistModalOpen(false)}
        report={stylistReport}
        isLoading={isStylistLoading}
        onRefreshReview={handleRunStylistReview}
        garmentName={currentGarment?.name || customGarmentName}
        placementLocation={placement.location}
        lang={lang}
      />

      <TechPackModal
        isOpen={isTechPackModalOpen}
        onClose={() => setIsTechPackModalOpen(false)}
        mockupCanvas={document.querySelector('canvas')}
        garmentName={currentGarment?.name || customGarmentName}
        placement={placement}
        garmentColor={garmentColor}
        lang={lang}
      />

      <ShareEmbedModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        appUrl={window.location.origin}
        lang={lang}
      />

      <PublishOnlineModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
