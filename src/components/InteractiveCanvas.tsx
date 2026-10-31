import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlacementConfig,
  GarmentPreset,
  TargetSide,
} from '../types';
import { renderFabricMockup } from '../utils/fabricShaders';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';

interface InteractiveCanvasProps {
  garmentImageSrc: string;
  logoImageSrc: string;
  placement: PlacementConfig;
  onPlacementChange: (newPlacement: PlacementConfig) => void;
  garmentColor: string;
  currentGarment: GarmentPreset | null;
  is2DMode: boolean;
  onToggle2DMode: () => void;
  aiMockupResult: string | null;
  isAiGenerating: boolean;
  onGenerateAiMockup: () => void;
  onOpenStylistReview: () => void;
  onOpenTechPack: () => void;
  onOpenShareModal: () => void;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  garmentImageSrc,
  logoImageSrc,
  placement,
  onPlacementChange,
  garmentColor,
  currentGarment,
  is2DMode,
  onToggle2DMode,
  aiMockupResult,
  isAiGenerating,
  onGenerateAiMockup,
  onOpenStylistReview,
  onOpenTechPack,
  onOpenShareModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRulers, setShowRulers] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'interactive' | 'ai' | 'compare'>('interactive');
  const [compareSlider, setCompareSlider] = useState<number>(50);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initPosX: number; initPosY: number }>({
    mouseX: 0,
    mouseY: 0,
    initPosX: 50,
    initPosY: 50,
  });

  // Cached image elements
  const garmentImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Load Garment & Logo image objects
  useEffect(() => {
    let active = true;
    const gImg = new Image();
    const lImg = new Image();
    gImg.crossOrigin = 'anonymous';
    lImg.crossOrigin = 'anonymous';

    let gLoaded = false;
    let lLoaded = false;

    const checkBoth = () => {
      if (gLoaded && lLoaded && active) {
        garmentImgRef.current = gImg;
        logoImgRef.current = lImg;
        setImagesLoaded(true);
      }
    };

    gImg.onload = () => {
      gLoaded = true;
      checkBoth();
    };
    lImg.onload = () => {
      lLoaded = true;
      checkBoth();
    };

    gImg.src = garmentImageSrc;
    lImg.src = logoImageSrc;

    return () => {
      active = false;
    };
  }, [garmentImageSrc, logoImageSrc]);

  // Re-render canvas on changes
  const updateCanvas = useCallback(async () => {
    if (!canvasRef.current || !garmentImgRef.current || !logoImgRef.current) return;

    const rendered = await renderFabricMockup(
      garmentImgRef.current,
      logoImgRef.current,
      placement,
      garmentColor,
      {
        width: 1200,
        height: 1500,
        showRulers: showRulers,
        is2DFlat: is2DMode,
        garmentChestWidthInches: currentGarment?.chestWidthInches || 22,
      }
    );

    const targetCanvas = canvasRef.current;
    targetCanvas.width = rendered.width;
    targetCanvas.height = rendered.height;
    const ctx = targetCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(rendered, 0, 0);
    }
  }, [placement, garmentColor, showRulers, is2DMode, currentGarment]);

  useEffect(() => {
    if (imagesLoaded) {
      updateCanvas();
    }
  }, [imagesLoaded, updateCanvas]);

  // Handle direct mouse / touch drag on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (viewMode === 'ai') return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initPosX: placement.posX,
      initPosY: placement.posY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.mouseY) / rect.height) * 100;

    const newX = Math.max(10, Math.min(90, dragStartRef.current.initPosX + deltaX));
    const newY = Math.max(10, Math.min(90, dragStartRef.current.initPosY + deltaY));

    onPlacementChange({
      ...placement,
      location: 'Custom',
      posX: Number(newX.toFixed(1)),
      posY: Number(newY.toFixed(1)),
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (viewMode === 'ai' || e.touches.length !== 1) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.touches[0].clientX,
      mouseY: e.touches[0].clientY,
      initPosX: placement.posX,
      initPosY: placement.posY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current || e.touches.length !== 1) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.touches[0].clientX - dragStartRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((e.touches[0].clientY - dragStartRef.current.mouseY) / rect.height) * 100;

    const newX = Math.max(10, Math.min(90, dragStartRef.current.initPosX + deltaX));
    const newY = Math.max(10, Math.min(90, dragStartRef.current.initPosY + deltaY));

    onPlacementChange({
      ...placement,
      location: 'Custom',
      posX: Number(newX.toFixed(1)),
      posY: Number(newY.toFixed(1)),
    });
  };

  // Quick download current rendered canvas
  const handleDownloadInteractive = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `mockup-${currentGarment?.type || 'garment'}-${placement.targetSide.toLowerCase()}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadAiImage = () => {
    if (!aiMockupResult) return;
    const link = document.createElement('a');
    link.download = `ai-studio-mockup-${Date.now()}.png`;
    link.href = aiMockupResult;
    link.click();
  };

  return (
    <div className="relative flex flex-col h-full bg-zinc-950 text-zinc-100 select-none overflow-hidden border border-zinc-800/80 rounded-2xl shadow-2xl">
      {/* Studio Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 z-20">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'interactive'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Fabric Mesh</span>
          </button>

          {aiMockupResult && (
            <>
              <button
                onClick={() => setViewMode('ai')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'ai'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Photorealistic Mockup</span>
              </button>

              <button
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'compare'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Split Compare</span>
              </button>
            </>
          )}
        </div>

        {/* Center: Quick Toggles (2D Flat-Lay & Guides) */}
        <div className="flex items-center gap-2">
          {/* 2D Flat-Lay Mode Switch */}
          <button
            onClick={onToggle2DMode}
            title="Convert and modify clothing to look 2D flat-lay"
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all border ${
              is2DMode
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:bg-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>2D Flat-Lay CAD Mode</span>
            {is2DMode && <span className="text-[10px] bg-sky-500/30 px-1 rounded">ON</span>}
          </button>

          {/* Rulers / Dimension Guides */}
          <button
            onClick={() => setShowRulers(!showRulers)}
            className={`px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-1 transition-all border ${
              showRulers
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Rulers</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStylistReview}
            className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fashion Stylist</span>
          </button>

          <button
            onClick={onOpenTechPack}
            className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Tech Pack Spec</span>
          </button>

          {/* AI Generation Trigger */}
          <button
            onClick={onGenerateAiMockup}
            disabled={isAiGenerating}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md ${
              isAiGenerating
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold shadow-amber-500/20'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{isAiGenerating ? 'Generating Studio Mockup...' : 'Generate AI Mockup'}</span>
          </button>

          {/* Download & Share */}
          <button
            onClick={viewMode === 'ai' ? handleDownloadAiImage : handleDownloadInteractive}
            className="p-1.5 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors"
            title="Download high-resolution image"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenShareModal}
            className="p-1.5 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors"
            title="Share / Google Sites Embed"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center p-4 overflow-hidden bg-zinc-950/60"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Subtle Luxury Studio Background Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #71717a 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* View Mode 1: Interactive Canvas */}
        {viewMode === 'interactive' && (
          <div
            className="relative flex items-center justify-center transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="max-h-[75vh] w-auto max-w-full object-contain cursor-grab active:cursor-grabbing rounded-xl shadow-2xl border border-zinc-800/60 transition-shadow hover:shadow-amber-500/5"
            />

            {/* Drag helper hint badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-[11px] text-zinc-300 shadow-lg pointer-events-none flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Click &amp; drag anywhere on garment to reposition logo</span>
            </div>
          </div>
        )}

        {/* View Mode 2: AI Photorealistic Studio Mockup */}
        {viewMode === 'ai' && aiMockupResult && (
          <div
            className="relative flex items-center justify-center transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={aiMockupResult}
              alt="AI Photorealistic Mockup"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-indigo-500/30"
            />
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-indigo-950/90 border border-indigo-500/40 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemini Studio Commercial Mockup</span>
            </div>
          </div>
        )}

        {/* View Mode 3: Split Compare */}
        {viewMode === 'compare' && aiMockupResult && (
          <div
            className="relative flex items-center justify-center max-h-[75vh] max-w-full aspect-[4/5] overflow-hidden rounded-xl border border-zinc-700 shadow-2xl"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Interactive Image (Left side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - compareSlider}% 0 0)` }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-4 left-4 bg-zinc-900/90 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded border border-zinc-700 backdrop-blur-sm">
                Interactive Mesh
              </span>
            </div>

            {/* AI Result Image (Right side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${compareSlider}%)` }}
            >
              <img
                src={aiMockupResult}
                alt="AI Result"
                className="w-full h-full object-contain"
              />
              <span className="absolute top-4 right-4 bg-indigo-950/90 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded border border-indigo-600/50 backdrop-blur-sm">
                AI Commercial Studio
              </span>
            </div>

            {/* Split Divider Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10 flex items-center justify-center"
              style={{ left: `${compareSlider}%` }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={compareSlider}
                onChange={(e) => setCompareSlider(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
              />
              <div className="w-7 h-7 -ml-3.5 rounded-full bg-white text-zinc-900 shadow-xl flex items-center justify-center text-[10px] font-bold border border-zinc-400">
                ↔
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay when generating AI Mockup */}
        {isAiGenerating && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-30">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center max-w-sm px-4">
              <h3 className="text-base font-bold text-zinc-100 mb-1">
                Compositing Commercial Apparel Mockup...
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Analyzing fabric drape, mapping knit ribbing, warping ink across wrinkle contours, and casting studio ambient lighting.
              </p>
            </div>
          </div>
        )}

        {/* Viewport Floating Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-xl z-20">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-300 px-1.5 min-w-[40px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Placement Specs Overlay Badge (Top Left) */}
        <div className="absolute top-4 left-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 rounded-xl p-3 shadow-xl max-w-xs text-xs pointer-events-none hidden md:block">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-zinc-200">
              {placement.targetSide} View • {placement.location}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
              {placement.printFinish}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-zinc-400 font-mono text-[11px]">
            <div>
              Width: <span className="text-zinc-200">{placement.widthInches.toFixed(1)}"</span>
              <span className="text-zinc-500 ml-1">({(placement.widthInches * 2.54).toFixed(1)} cm)</span>
            </div>
            <div>
              Height: <span className="text-zinc-200">{placement.heightInches.toFixed(1)}"</span>
              <span className="text-zinc-500 ml-1">({(placement.heightInches * 2.54).toFixed(1)} cm)</span>
            </div>
            <div>
              Center X: <span className="text-zinc-200">{placement.posX.toFixed(1)}%</span>
            </div>
            <div>
              Drop Y: <span className="text-zinc-200">{placement.posY.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
