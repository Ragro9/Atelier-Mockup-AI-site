import { GarmentPreset, LogoPreset, PlacementConfig, PlacementLocation } from '../types';

// High-resolution realistic vector garments with shading and folds
export const GARMENT_PRESETS: GarmentPreset[] = [
  {
    id: 'heavyweight-tee',
    name: 'Heavyweight Boxy T-Shirt (240 GSM)',
    type: 'T-Shirt',
    category: 'T-Shirt',
    chestWidthInches: 22,
    bodyLengthInches: 29,
    defaultColor: '#f4f4f5',
    availableColors: [
      { name: 'Vintage White', hex: '#f5f5f4' },
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Heather Grey', hex: '#9ca3af' },
      { name: 'Sage Green', hex: '#71806e' },
      { name: 'Washed Navy', hex: '#2c3e50' },
      { name: 'Cocoa Brown', hex: '#4a3728' },
    ],
    frontImage: createTShirtSvg(false, 'front'),
    backImage: createTShirtSvg(false, 'back'),
    front2dImage: createTShirtSvg(true, 'front'),
    back2dImage: createTShirtSvg(true, 'back'),
  },
  {
    id: 'oversized-hoodie',
    name: 'Heavyweight Fleece Hoodie (450 GSM)',
    type: 'Hoodie',
    category: 'Hoodie',
    chestWidthInches: 24,
    bodyLengthInches: 28,
    defaultColor: '#e4e4e7',
    availableColors: [
      { name: 'Oatmeal Heather', hex: '#e4e4e7' },
      { name: 'Pitch Black', hex: '#09090b' },
      { name: 'Forest Moss', hex: '#3f4f44' },
      { name: 'Dusty Violet', hex: '#584b53' },
      { name: 'Bone White', hex: '#fdfbf7' },
    ],
    frontImage: createHoodieSvg(false, 'front'),
    backImage: createHoodieSvg(false, 'back'),
    front2dImage: createHoodieSvg(true, 'front'),
    back2dImage: createHoodieSvg(true, 'back'),
  },
  {
    id: 'french-terry-crewneck',
    name: 'French Terry Crewneck Sweatshirt',
    type: 'Sweatshirt',
    category: 'Sweatshirt',
    chestWidthInches: 23,
    bodyLengthInches: 28.5,
    defaultColor: '#d4d4d8',
    availableColors: [
      { name: 'Concrete Grey', hex: '#d4d4d8' },
      { name: 'Midnight Black', hex: '#18181b' },
      { name: 'Terracotta', hex: '#9e5a42' },
      { name: 'Deep Spruce', hex: '#233d34' },
    ],
    frontImage: createCrewneckSvg(false, 'front'),
    backImage: createCrewneckSvg(false, 'back'),
    front2dImage: createCrewneckSvg(true, 'front'),
    back2dImage: createCrewneckSvg(true, 'back'),
  },
  {
    id: 'canvas-tote',
    name: 'Heavy Cotton Canvas Tote Bag',
    type: 'Tote Bag',
    category: 'Accessories',
    chestWidthInches: 16,
    bodyLengthInches: 18,
    defaultColor: '#f5f5f0',
    availableColors: [
      { name: 'Natural Ecru', hex: '#f5f5f0' },
      { name: 'Charcoal Canvas', hex: '#27272a' },
      { name: 'Army Olive', hex: '#4b5320' },
    ],
    frontImage: createToteSvg(false),
    backImage: createToteSvg(false),
    front2dImage: createToteSvg(true),
    back2dImage: createToteSvg(true),
  },
];

// SVG Builders for realistic garments and 2D flats
function createTShirtSvg(is2D: boolean, side: 'front' | 'back'): string {
  const neckCurve =
    side === 'front'
      ? 'C 280 160, 320 160, 350 120'
      : 'C 280 135, 320 135, 350 120';
  const innerCollar =
    side === 'front'
      ? '<path d="M 250 120 C 280 132, 320 132, 350 120 C 330 112, 270 112, 250 120 Z" fill="#b0b0b5" opacity="0.4" />'
      : '<path d="M 250 120 C 280 125, 320 125, 350 120 C 330 115, 270 115, 250 120 Z" fill="#b0b0b5" opacity="0.3" />';

  const shading = is2D
    ? ''
    : `
      <!-- Wrinkles, fabric folds, and shadows -->
      <path d="M 170 240 Q 200 310, 220 380 Q 210 490, 230 650" stroke="#000000" stroke-width="12" stroke-linecap="round" opacity="0.08" fill="none" filter="blur(10px)" />
      <path d="M 430 240 Q 400 310, 380 380 Q 390 490, 370 650" stroke="#000000" stroke-width="12" stroke-linecap="round" opacity="0.08" fill="none" filter="blur(10px)" />
      <path d="M 260 280 Q 300 295, 340 280" stroke="#ffffff" stroke-width="8" opacity="0.15" fill="none" filter="blur(6px)" />
      <path d="M 270 330 Q 300 345, 330 330" stroke="#000000" stroke-width="6" opacity="0.06" fill="none" filter="blur(5px)" />
      <path d="M 190 620 Q 300 645, 410 620" stroke="#000000" stroke-width="8" opacity="0.07" fill="none" filter="blur(4px)" />
      <!-- Subtle fabric knit grain -->
      <filter id="fabricNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        <feComposite in2="SourceGraphic" in="glitch" operator="in" />
      </filter>
    `;

  const stitches = is2D
    ? `
      <!-- Technical CAD Stitches -->
      <path d="M 190 650 L 410 650" stroke="#52525b" stroke-width="1.5" stroke-dasharray="3,3" fill="none" />
      <path d="M 190 655 L 410 655" stroke="#52525b" stroke-width="1.5" stroke-dasharray="3,3" fill="none" />
      <path d="M 95 275 L 140 315" stroke="#52525b" stroke-width="1.5" stroke-dasharray="3,3" fill="none" />
      <path d="M 505 275 L 460 315" stroke="#52525b" stroke-width="1.5" stroke-dasharray="3,3" fill="none" />
    `
    : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="${is2D ? '0' : '0.2'}" />
          <stop offset="50%" stop-color="#000000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="${is2D ? '0' : '0.18'}" />
        </linearGradient>
      </defs>
      <!-- Garment Silhouette -->
      <g id="garmentBody">
        <path d="
          M 250 120
          ${neckCurve}
          L 470 180
          L 515 285
          L 450 325
          L 420 270
          L 420 660
          L 180 660
          L 180 270
          L 150 325
          L 85 285
          L 130 180
          Z
        " fill="currentColor" stroke="${is2D ? '#3f3f46' : 'rgba(0,0,0,0.15)'}" stroke-width="${is2D ? '2.5' : '1.5'}" stroke-linejoin="round" />
        <path d="
          M 250 120
          ${neckCurve}
          L 470 180
          L 515 285
          L 450 325
          L 420 270
          L 420 660
          L 180 660
          L 180 270
          L 150 325
          L 85 285
          L 130 180
          Z
        " fill="url(#bodyGrad)" />
      </g>
      ${innerCollar}
      <!-- Ribbed Collar Band -->
      <path d="M 250 120 ${neckCurve}" stroke="rgba(0,0,0,0.25)" stroke-width="${is2D ? '6' : '7'}" fill="none" stroke-linecap="round" />
      <path d="M 250 120 ${neckCurve}" stroke="rgba(255,255,255,0.25)" stroke-width="2" fill="none" stroke-linecap="round" />
      ${shading}
      ${stitches}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createHoodieSvg(is2D: boolean, side: 'front' | 'back'): string {
  const frontPocket =
    side === 'front'
      ? `
      <!-- Kangaroo Pocket -->
      <path d="M 230 460 L 370 460 L 400 590 L 200 590 Z" fill="currentColor" stroke="${is2D ? '#3f3f46' : 'rgba(0,0,0,0.18)'}" stroke-width="${is2D ? '2' : '1.5'}" />
      <path d="M 230 460 L 200 590" stroke="rgba(0,0,0,0.15)" stroke-width="2" stroke-linecap="round" />
      <path d="M 370 460 L 400 590" stroke="rgba(0,0,0,0.15)" stroke-width="2" stroke-linecap="round" />
      <!-- Drawstrings -->
      ${
        !is2D
          ? `
        <path d="M 280 180 Q 275 260, 270 310" stroke="#f4f4f5" stroke-width="4" stroke-linecap="round" fill="none" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" />
        <path d="M 320 180 Q 325 260, 330 310" stroke="#f4f4f5" stroke-width="4" stroke-linecap="round" fill="none" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" />
      `
          : ''
      }
    `
      : '';

  const hoodDetails =
    side === 'front'
      ? `
      <!-- Front Open Hood Interior -->
      <path d="M 230 110 C 260 60, 340 60, 370 110 C 350 160, 250 160, 230 110 Z" fill="rgba(0,0,0,0.12)" />
      <path d="M 235 110 C 265 80, 335 80, 365 110" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round" />
    `
      : `
      <!-- Back Hood Fold -->
      <path d="M 220 90 C 260 50, 340 50, 380 90 C 370 180, 230 180, 220 90 Z" fill="currentColor" stroke="rgba(0,0,0,0.2)" stroke-width="2" />
      <path d="M 300 70 L 300 170" stroke="rgba(0,0,0,0.1)" stroke-width="2" stroke-linecap="round" />
    `;

  const shading = is2D
    ? ''
    : `
      <path d="M 160 260 Q 200 420, 210 650" stroke="#000000" stroke-width="16" opacity="0.08" fill="none" filter="blur(12px)" />
      <path d="M 440 260 Q 400 420, 390 650" stroke="#000000" stroke-width="16" opacity="0.08" fill="none" filter="blur(12px)" />
      <path d="M 260 300 Q 300 320, 340 300" stroke="#000000" stroke-width="8" opacity="0.06" fill="none" filter="blur(6px)" />
    `;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
      <defs>
        <linearGradient id="hoodieGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="${is2D ? '0' : '0.2'}" />
          <stop offset="50%" stop-color="#000000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="${is2D ? '0' : '0.15'}" />
        </linearGradient>
      </defs>
      <g id="hoodieBody">
        <path d="
          M 230 110
          L 370 110
          L 510 190
          L 535 370
          L 470 380
          L 435 280
          L 435 660
          L 165 660
          L 165 280
          L 130 380
          L 65 370
          L 90 190
          Z
        " fill="currentColor" stroke="${is2D ? '#3f3f46' : 'rgba(0,0,0,0.18)'}" stroke-width="${is2D ? '2.5' : '1.5'}" />
        <path d="
          M 230 110
          L 370 110
          L 510 190
          L 535 370
          L 470 380
          L 435 280
          L 435 660
          L 165 660
          L 165 280
          L 130 380
          L 65 370
          L 90 190
          Z
        " fill="url(#hoodieGrad)" />
      </g>
      ${hoodDetails}
      ${frontPocket}
      <!-- Ribbed Waistband & Cuffs -->
      <rect x="165" y="640" width="270" height="25" fill="rgba(0,0,0,0.06)" stroke="${is2D ? '#52525b' : 'rgba(0,0,0,0.15)'}" stroke-width="1.5" />
      <rect x="65" y="355" width="65" height="20" fill="rgba(0,0,0,0.06)" transform="rotate(-15 65 355)" />
      <rect x="470" y="370" width="65" height="20" fill="rgba(0,0,0,0.06)" transform="rotate(15 470 370)" />
      ${shading}
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createCrewneckSvg(is2D: boolean, side: 'front' | 'back'): string {
  const neckCurve =
    side === 'front'
      ? 'C 280 150, 320 150, 350 115'
      : 'C 280 130, 320 130, 350 115';
  const vInsert =
    side === 'front' && !is2D
      ? '<path d="M 285 150 L 300 170 L 315 150" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none" />'
      : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
      <g>
        <path d="
          M 250 115
          ${neckCurve}
          L 490 185
          L 520 365
          L 460 375
          L 430 270
          L 425 650
          L 175 650
          L 170 270
          L 140 375
          L 80 365
          L 110 185
          Z
        " fill="currentColor" stroke="${is2D ? '#3f3f46' : 'rgba(0,0,0,0.18)'}" stroke-width="${is2D ? '2.5' : '1.5'}" />
      </g>
      <!-- Ribbed collar -->
      <path d="M 250 115 ${neckCurve}" stroke="rgba(0,0,0,0.3)" stroke-width="8" fill="none" stroke-linecap="round" />
      ${vInsert}
      <!-- Ribbed hem -->
      <rect x="175" y="625" width="250" height="28" fill="rgba(0,0,0,0.07)" stroke="rgba(0,0,0,0.12)" />
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createToteSvg(is2D: boolean): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
      <!-- Tote Straps -->
      <path d="M 230 310 C 230 110, 260 90, 300 90 C 340 90, 370 110, 370 310" stroke="rgba(0,0,0,0.25)" stroke-width="22" fill="none" stroke-linecap="square" />
      <path d="M 230 310 C 230 110, 260 90, 300 90 C 340 90, 370 110, 370 310" stroke="currentColor" stroke-width="18" fill="none" stroke-linecap="square" />
      <!-- Tote Body -->
      <rect x="150" y="300" width="300" height="380" rx="6" fill="currentColor" stroke="${is2D ? '#3f3f46' : 'rgba(0,0,0,0.2)'}" stroke-width="${is2D ? '2.5' : '1.5'}" />
      ${
        !is2D
          ? `
        <!-- Canvas folds -->
        <path d="M 190 320 Q 210 500, 200 660" stroke="#000000" stroke-width="10" opacity="0.06" fill="none" filter="blur(8px)" />
        <path d="M 400 320 Q 380 500, 390 660" stroke="#000000" stroke-width="10" opacity="0.06" fill="none" filter="blur(8px)" />
      `
          : ''
      }
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Built-in Sample Graphics & Logos
export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'atelier-minimalist',
    name: 'Atelier Studio Typo',
    category: 'Minimalist Typography',
    defaultWidthInches: 9,
    imageUrl: createAtelierLogoSvg(),
  },
  {
    id: 'fuji-streetwear',
    name: 'Fuji Peaks Emblem',
    category: 'Streetwear Graphic',
    defaultWidthInches: 10.5,
    imageUrl: createMountainLogoSvg(),
  },
  {
    id: 'athletics-arch',
    name: 'Varsity 1984 Club',
    category: 'Vintage Collegiate',
    defaultWidthInches: 11,
    imageUrl: createVarsityLogoSvg(),
  },
  {
    id: 'pocket-crest',
    name: 'Minimal Crest Badge',
    category: 'Pocket & Chest',
    defaultWidthInches: 3.5,
    imageUrl: createCrestLogoSvg(),
  },
  {
    id: 'cyber-barcode',
    name: 'Neo Cyber Grid',
    category: 'Cyberpunk',
    defaultWidthInches: 8.5,
    imageUrl: createCyberLogoSvg(),
  },
];

function createAtelierLogoSvg(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
      <rect width="500" height="200" fill="transparent" />
      <text x="250" y="85" font-family="'Cinzel', 'Playfair Display', 'Times New Roman', serif" font-size="52" font-weight="700" fill="#18181b" text-anchor="middle" letter-spacing="12">ATELIER</text>
      <text x="250" y="125" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#71717a" text-anchor="middle" letter-spacing="16">HAUTE COUTURE</text>
      <line x1="140" y1="145" x2="360" y2="145" stroke="#18181b" stroke-width="1.5" />
      <text x="250" y="170" font-family="'Inter', sans-serif" font-size="11" font-weight="500" fill="#a1a1aa" text-anchor="middle" letter-spacing="6">EST. 2026 • PARIS</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createMountainLogoSvg(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="transparent" />
      <circle cx="200" cy="180" r="140" fill="#ef4444" />
      <!-- Mountain Ridges -->
      <polygon points="120,290 200,120 280,290" fill="#18181b" />
      <polygon points="170,290 200,120 230,290" fill="#3f3f46" />
      <polygon points="200,120 185,160 200,175 215,160" fill="#ffffff" />
      <polygon points="180,290 280,180 340,290" fill="#09090b" opacity="0.9" />
      <!-- Japanese Typography -->
      <text x="200" y="340" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" font-weight="900" fill="#18181b" text-anchor="middle" letter-spacing="4">FUJI PEAKS</text>
      <text x="200" y="370" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#71717a" text-anchor="middle" letter-spacing="8">富士山 • 標高 3776M</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createVarsityLogoSvg(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="500" height="280">
      <rect width="500" height="280" fill="transparent" />
      <path id="archPath" d="M 50 170 Q 250 30 450 170" fill="transparent" />
      <text font-family="'Arial Black', sans-serif" font-size="58" font-weight="900" fill="#1e3a8a" letter-spacing="8">
        <textPath href="#archPath" startOffset="50%" text-anchor="middle">ATHLETICS</textPath>
      </text>
      <text x="250" y="195" font-family="'Arial Black', sans-serif" font-size="62" font-weight="900" fill="#d97706" text-anchor="middle" letter-spacing="2">1984</text>
      <text x="250" y="235" font-family="'Inter', sans-serif" font-size="14" font-weight="800" fill="#18181b" text-anchor="middle" letter-spacing="8">STATE CHAMPIONS</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createCrestLogoSvg(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
      <rect width="300" height="300" fill="transparent" />
      <polygon points="150,20 250,70 250,190 150,280 50,190 50,70" fill="none" stroke="#18181b" stroke-width="8" stroke-linejoin="round" />
      <polygon points="150,35 235,78 235,182 150,265 65,182 65,78" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="4,4" />
      <text x="150" y="160" font-family="'Playfair Display', serif" font-size="72" font-weight="700" fill="#18181b" text-anchor="middle">A</text>
      <path d="M 120 185 L 180 185" stroke="#18181b" stroke-width="4" stroke-linecap="round" />
      <text x="150" y="215" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#71717a" text-anchor="middle" letter-spacing="4">MMXXVI</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createCyberLogoSvg(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 250" width="450" height="250">
      <rect width="450" height="250" fill="transparent" />
      <rect x="25" y="20" width="400" height="210" fill="#09090b" rx="4" />
      <text x="225" y="85" font-family="'Courier New', monospace" font-size="34" font-weight="900" fill="#22c55e" text-anchor="middle" letter-spacing="4">[SYSTEM // ACTIVE]</text>
      <!-- Stylized barcode -->
      <g fill="#f4f4f5">
        <rect x="50" y="110" width="6" height="50" />
        <rect x="62" y="110" width="14" height="50" />
        <rect x="82" y="110" width="4" height="50" />
        <rect x="92" y="110" width="10" height="50" />
        <rect x="110" y="110" width="18" height="50" />
        <rect x="135" y="110" width="6" height="50" />
        <rect x="148" y="110" width="12" height="50" />
        <rect x="168" y="110" width="8" height="50" />
        <rect x="184" y="110" width="16" height="50" />
        <rect x="208" y="110" width="6" height="50" />
        <rect x="220" y="110" width="10" height="50" />
        <rect x="236" y="110" width="18" height="50" />
        <rect x="262" y="110" width="6" height="50" />
        <rect x="276" y="110" width="14" height="50" />
        <rect x="298" y="110" width="4" height="50" />
        <rect x="310" y="110" width="12" height="50" />
        <rect x="330" y="110" width="8" height="50" />
        <rect x="345" y="110" width="16" height="50" />
        <rect x="370" y="110" width="10" height="50" />
        <rect x="388" y="110" width="12" height="50" />
      </g>
      <text x="225" y="195" font-family="'Courier New', monospace" font-size="14" font-weight="700" fill="#a1a1aa" text-anchor="middle" letter-spacing="6">ID: 884-091-TK-02</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Preset Placement Locations & Standard Physical Dimensions
export const LOCATION_PRESETS: Record<
  PlacementLocation,
  {
    side: 'Front' | 'Back';
    posX: number;
    posY: number;
    widthInches: number;
    heightInches: number;
    description: string;
  }
> = {
  'Center chest': {
    side: 'Front',
    posX: 50,
    posY: 42,
    widthInches: 10,
    heightInches: 10,
    description: 'Classic centered print, 3 to 4 inches down from collar seam',
  },
  'Left chest pocket area': {
    side: 'Front',
    posX: 66,
    posY: 38,
    widthInches: 3.5,
    heightInches: 3.5,
    description: 'Subtle left chest emblem or pocket print (3.5" to 4" max)',
  },
  'Upper center between shoulder blades': {
    side: 'Back',
    posX: 50,
    posY: 30,
    widthInches: 4.5,
    heightInches: 2.5,
    description: 'Nape / upper back neck print, centered between shoulders',
  },
  'Lower hem': {
    side: 'Front',
    posX: 32,
    posY: 82,
    widthInches: 2.5,
    heightInches: 2.5,
    description: 'Woven label / badge placement above bottom hemline',
  },
  'Full back print': {
    side: 'Back',
    posX: 50,
    posY: 48,
    widthInches: 12.5,
    heightInches: 15,
    description: 'Expansive statement back print spanning shoulder to mid-back',
  },
  'Oversized front print': {
    side: 'Front',
    posX: 50,
    posY: 48,
    widthInches: 13,
    heightInches: 16,
    description: 'Dramatic streetwear jumbo print covering torso',
  },
  Custom: {
    side: 'Front',
    posX: 50,
    posY: 45,
    widthInches: 8,
    heightInches: 8,
    description: 'Freely positioned anywhere on garment',
  },
};

export const DEFAULT_PLACEMENT: PlacementConfig = {
  targetSide: 'Front',
  location: 'Center chest',
  posX: 50,
  posY: 42,
  widthInches: 10,
  heightInches: 10,
  lockAspectRatio: true,
  aspectRatio: 1,
  rotation: 0,
  opacity: 0.98,
  printFinish: 'Screen Print Matte',
  displacementStrength: 65,
  weaveTextureStrength: 45,
  shadowBleed: 55,
  highlightBleed: 40,
};
