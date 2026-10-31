import { PlacementConfig, PrintFinish } from '../types';

/**
 * Composite garment and logo onto an offscreen canvas with realistic fabric physics:
 * - Wrinkle luminance displacement mapping
 * - Textile weave texture overlay
 * - Print finish simulation (matte, dtg, embroidery, foil, distressed)
 * - Shadows & highlights mapped onto print
 */
export async function renderFabricMockup(
  garmentImgElement: HTMLImageElement,
  logoImgElement: HTMLImageElement,
  placement: PlacementConfig,
  garmentColorHex: string,
  options: {
    width?: number;
    height?: number;
    showRulers?: boolean;
    is2DFlat?: boolean;
    garmentChestWidthInches?: number;
  } = {}
): Promise<HTMLCanvasElement> {
  const canvasWidth = options.width || 1200;
  const canvasHeight = options.height || 1500;
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  // 1. Draw Clean Minimalist Studio Background
  if (options.is2DFlat) {
    ctx.fillStyle = '#f8fafc'; // Crisp technical CAD background
  } else {
    // Subtle luxury studio gradient
    const studioGrad = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 2,
      100,
      canvasWidth / 2,
      canvasHeight / 2,
      canvasWidth * 0.8
    );
    studioGrad.addColorStop(0, '#ffffff');
    studioGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = studioGrad;
  }
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Draw Garment Image with color tinting
  const garmentCanvas = document.createElement('canvas');
  garmentCanvas.width = canvasWidth;
  garmentCanvas.height = canvasHeight;
  const gCtx = garmentCanvas.getContext('2d', { willReadFrequently: true });
  if (gCtx) {
    gCtx.drawImage(garmentImgElement, 0, 0, canvasWidth, canvasHeight);
    // If custom color is not pure white, tint garment while keeping shadows
    if (garmentColorHex && garmentColorHex.toLowerCase() !== '#ffffff') {
      gCtx.globalCompositeOperation = 'multiply';
      gCtx.fillStyle = garmentColorHex;
      gCtx.fillRect(0, 0, canvasWidth, canvasHeight);
      gCtx.globalCompositeOperation = 'destination-atop';
      gCtx.drawImage(garmentImgElement, 0, 0, canvasWidth, canvasHeight);
    }
  }

  // Draw garment on main canvas
  ctx.drawImage(garmentCanvas, 0, 0);

  // 3. Calculate Placement Bounding Box in Pixels
  const chestRefWidthInches = options.garmentChestWidthInches || 22;
  const pixelsPerInch = (canvasWidth * 0.45) / chestRefWidthInches;

  const logoTargetWidthPx = placement.widthInches * pixelsPerInch;
  const logoTargetHeightPx = placement.heightInches * pixelsPerInch;

  const centerX = (placement.posX / 100) * canvasWidth;
  const centerY = (placement.posY / 100) * canvasHeight;

  // 4. Create Offscreen Logo Buffer
  const logoBuffer = document.createElement('canvas');
  logoBuffer.width = Math.max(1, Math.round(logoTargetWidthPx));
  logoBuffer.height = Math.max(1, Math.round(logoTargetHeightPx));
  const lCtx = logoBuffer.getContext('2d', { willReadFrequently: true });

  if (lCtx) {
    lCtx.clearRect(0, 0, logoBuffer.width, logoBuffer.height);
    lCtx.drawImage(logoImgElement, 0, 0, logoBuffer.width, logoBuffer.height);

    // Apply Print Finish effects
    applyPrintFinishFilter(lCtx, logoBuffer.width, logoBuffer.height, placement.printFinish);
  }

  // 5. Sample Garment Luminance for Wrinkle Displacement Mapping
  // Get garment area under the logo
  const sampleX = Math.max(0, Math.round(centerX - logoBuffer.width / 2));
  const sampleY = Math.max(0, Math.round(centerY - logoBuffer.height / 2));
  const sampleW = Math.min(canvasWidth - sampleX, logoBuffer.width);
  const sampleH = Math.min(canvasHeight - sampleY, logoBuffer.height);

  let displacedLogoCanvas = logoBuffer;

  if (
    !options.is2DFlat &&
    placement.displacementStrength > 0 &&
    sampleW > 10 &&
    sampleH > 10 &&
    gCtx
  ) {
    try {
      const garmentData = gCtx.getImageData(sampleX, sampleY, sampleW, sampleH);
      const logoData = lCtx?.getImageData(0, 0, sampleW, sampleH);

      if (garmentData && logoData) {
        const outData = lCtx?.createImageData(sampleW, sampleH);
        const dispMax = (placement.displacementStrength / 100) * 8; // up to 8px shift

        for (let y = 0; y < sampleH; y++) {
          for (let x = 0; x < sampleW; x++) {
            const idx = (y * sampleW + x) * 4;

            // Compute luminance gradient from neighboring garment pixels
            const xRight = Math.min(x + 1, sampleW - 1);
            const yDown = Math.min(y + 1, sampleH - 1);

            const lumCenter =
              0.299 * garmentData.data[idx] +
              0.587 * garmentData.data[idx + 1] +
              0.114 * garmentData.data[idx + 2];
            const idxR = (y * sampleW + xRight) * 4;
            const lumR =
              0.299 * garmentData.data[idxR] +
              0.587 * garmentData.data[idxR + 1] +
              0.114 * garmentData.data[idxR + 2];
            const idxD = (yDown * sampleW + x) * 4;
            const lumD =
              0.299 * garmentData.data[idxD] +
              0.587 * garmentData.data[idxD + 1] +
              0.114 * garmentData.data[idxD + 2];

            const dx = (lumR - lumCenter) / 255;
            const dy = (lumD - lumCenter) / 255;

            // Displace source coordinates
            const srcX = Math.min(
              sampleW - 1,
              Math.max(0, Math.round(x + dx * dispMax))
            );
            const srcY = Math.min(
              sampleH - 1,
              Math.max(0, Math.round(y + dy * dispMax))
            );
            const srcIdx = (srcY * sampleW + srcX) * 4;

            // Fabric shadow multiplier
            const shadowFactor =
              1 -
              ((255 - lumCenter) / 255) *
                (placement.shadowBleed / 100) *
                0.45;

            if (outData) {
              outData.data[idx] = Math.round(logoData.data[srcIdx] * shadowFactor);
              outData.data[idx + 1] = Math.round(
                logoData.data[srcIdx + 1] * shadowFactor
              );
              outData.data[idx + 2] = Math.round(
                logoData.data[srcIdx + 2] * shadowFactor
              );
              outData.data[idx + 3] = logoData.data[srcIdx + 3];
            }
          }
        }

        if (outData && lCtx) {
          lCtx.putImageData(outData, 0, 0);
          displacedLogoCanvas = logoBuffer;
        }
      }
    } catch {
      // Fallback if canvas security or dimension error
      displacedLogoCanvas = logoBuffer;
    }
  }

  // 6. Draw Displaced Logo onto Canvas with rotation and opacity
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((placement.rotation * Math.PI) / 180);
  ctx.globalAlpha = Math.max(0.1, Math.min(1, placement.opacity));

  // Blend modes according to finish
  if (placement.printFinish === 'Direct-to-Garment [DTG]') {
    ctx.globalCompositeOperation = 'multiply';
  } else {
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.drawImage(
    displacedLogoCanvas,
    -logoBuffer.width / 2,
    -logoBuffer.height / 2,
    logoBuffer.width,
    logoBuffer.height
  );

  // 7. Overlay Subtle Fabric Knit Weave Texture on top of Logo
  if (!options.is2DFlat && placement.weaveTextureStrength > 0) {
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = (placement.weaveTextureStrength / 100) * 0.35;
    drawWeavePattern(
      ctx,
      -logoBuffer.width / 2,
      -logoBuffer.height / 2,
      logoBuffer.width,
      logoBuffer.height
    );
  }

  // 8. Embroidery 3D thread highlights and stitched border
  if (placement.printFinish === 'Raised 3D Embroidery') {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(
      -logoBuffer.width / 2 - 2,
      -logoBuffer.height / 2 - 2,
      logoBuffer.width + 4,
      logoBuffer.height + 4
    );
    ctx.setLineDash([]);
  }

  ctx.restore();

  // 9. Optional Technical CAD Rulers & Dimensions Overlay
  if (options.showRulers || options.is2DFlat) {
    drawDimensionAnnotations(
      ctx,
      centerX,
      centerY,
      logoTargetWidthPx,
      logoTargetHeightPx,
      placement.widthInches,
      placement.heightInches,
      canvasWidth
    );
  }

  return canvas;
}

function applyPrintFinishFilter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  finish: PrintFinish
) {
  if (finish === 'Vintage Distressed') {
    // Apply distress noise mask
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const len = Math.random() * 8 + 2;
      const angle = Math.random() * Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.4 + 0.1})`;
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.stroke();
    }
    ctx.restore();
  } else if (finish === 'Metallic Gold Foil') {
    // Subtle golden sheen
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const foilGrad = ctx.createLinearGradient(0, 0, w, h);
    foilGrad.addColorStop(0, 'rgba(255, 215, 0, 0.25)');
    foilGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    foilGrad.addColorStop(1, 'rgba(218, 165, 32, 0.3)');
    ctx.fillStyle = foilGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else if (finish === 'High-Gloss Plastisol') {
    // Plastic shine specular highlight across top third
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    const shineGrad = ctx.createLinearGradient(0, 0, 0, h);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
    shineGrad.addColorStop(0.35, 'rgba(255,255,255,0)');
    ctx.fillStyle = shineGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

function drawWeavePattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;

  const step = 4;
  for (let px = x; px < x + w; px += step) {
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px, y + h);
    ctx.stroke();
  }
  for (let py = y; py < y + h; py += step) {
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + w, py);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDimensionAnnotations(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  wIn: number,
  hIn: number,
  canvasW: number
) {
  const left = cx - w / 2;
  const right = cx + w / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;

  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.fillStyle = '#1d4ed8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  // Bounding box around artwork
  ctx.strokeRect(left, top, w, h);

  // Corner Resize Handles (Interactive Visual Targets)
  const handleRadius = 6;
  const corners = [
    { x: left, y: top },
    { x: right, y: top },
    { x: left, y: bottom },
    { x: right, y: bottom },
  ];

  ctx.save();
  ctx.setLineDash([]);
  for (const c of corners) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(c.x, c.y, handleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // Center vertical guideline
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  ctx.beginPath();
  ctx.moveTo(canvasW / 2, 80);
  ctx.lineTo(canvasW / 2, bottom + 50);
  ctx.stroke();

  // Width dimension line (above artwork)
  const rulerY = top - 20;
  ctx.strokeStyle = '#2563eb';
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(left, rulerY);
  ctx.lineTo(right, rulerY);
  // Arrow heads
  ctx.moveTo(left, rulerY - 5);
  ctx.lineTo(left, rulerY + 5);
  ctx.moveTo(right, rulerY - 5);
  ctx.lineTo(right, rulerY + 5);
  ctx.stroke();

  // Width label badge (Centimeters First)
  const widthCm = (wIn * 2.54).toFixed(1);
  const widthLabel = `${widthCm} cm`;
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  const textMetrics = ctx.measureText(widthLabel);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(
    cx - textMetrics.width / 2 - 8,
    rulerY - 20,
    textMetrics.width + 16,
    20
  );
  ctx.fillStyle = '#1e40af';
  ctx.fillText(widthLabel, cx, rulerY - 4);

  // Height dimension line (right of artwork)
  const rulerX = right + 20;
  ctx.beginPath();
  ctx.moveTo(rulerX, top);
  ctx.lineTo(rulerX, bottom);
  ctx.moveTo(rulerX - 5, top);
  ctx.lineTo(rulerX + 5, top);
  ctx.moveTo(rulerX - 5, bottom);
  ctx.lineTo(rulerX + 5, bottom);
  ctx.stroke();

  // Height label badge (Centimeters First)
  const heightCm = (hIn * 2.54).toFixed(1);
  const heightLabel = `${heightCm} cm`;
  ctx.save();
  ctx.translate(rulerX + 18, cy);
  ctx.rotate(Math.PI / 2);
  const hMetrics = ctx.measureText(heightLabel);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(
    -hMetrics.width / 2 - 8,
    -16,
    hMetrics.width + 16,
    20
  );
  ctx.fillStyle = '#1e40af';
  ctx.fillText(heightLabel, 0, 0);
  ctx.restore();

  ctx.restore();
}

/**
 * Generate a complete Production Tech Pack Specification Sheet image
 */
export async function generateTechPackCanvas(
  mockupCanvas: HTMLCanvasElement,
  garmentName: string,
  placement: PlacementConfig,
  garmentColorHex: string,
  extraNotes = ''
): Promise<HTMLCanvasElement> {
  const packW = 1600;
  const packH = 2200;
  const canvas = document.createElement('canvas');
  canvas.width = packW;
  canvas.height = packH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, packW, packH);

  // Header Bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, packW, 110);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('ATELIER STUDIO // APPAREL PRODUCTION SPECIFICATION', 40, 52);
  ctx.font = '14px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    `DATE: ${new Date().toLocaleDateString()} • REVISION: V1.0 • STATUS: APPROVED FOR SAMPLE CUT`,
    40,
    82
  );

  // Border frame
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 130, packW - 60, packH - 160);

  // Left Column: Mockup Visual with Callouts
  const visualW = 950;
  const visualH = 1200;
  ctx.drawImage(mockupCanvas, 50, 150, visualW, visualH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(50, 150, visualW, visualH);

  // Right Column: Spec Data Table
  const rightX = 1040;
  let curY = 180;

  // Section 1: Garment Details
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('1. GARMENT SPECIFICATIONS', rightX, curY);
  curY += 15;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rightX, curY);
  ctx.lineTo(packW - 60, curY);
  ctx.stroke();
  curY += 35;

  drawSpecRow(ctx, rightX, curY, 'Item Style', garmentName);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Target Side', placement.targetSide.toUpperCase());
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Fabric Color Hex', garmentColorHex);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Target Placement', placement.location);
  curY += 50;

  // Section 2: Logo & Graphic Measurements
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('2. ARTWORK & DIMENSION TOLERANCE', rightX, curY);
  curY += 15;
  ctx.beginPath();
  ctx.moveTo(rightX, curY);
  ctx.lineTo(packW - 60, curY);
  ctx.stroke();
  curY += 35;

  const wInches = placement.widthInches.toFixed(2);
  const wCm = (placement.widthInches * 2.54).toFixed(2);
  const hInches = placement.heightInches.toFixed(2);
  const hCm = (placement.heightInches * 2.54).toFixed(2);

  drawSpecRow(ctx, rightX, curY, 'Print Width', `${wInches}" (${wCm} cm)`);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Print Height', `${hInches}" (${hCm} cm)`);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Artwork Rotation', `${placement.rotation}°`);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Collar Offset Y', `${placement.posY.toFixed(1)}% garment drop`);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Horizontal Alignment', `${placement.posX.toFixed(1)}% (Center aligned)`);
  curY += 50;

  // Section 3: Print Technique & Finish
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('3. PRINT TECHNIQUE & CHEMISTRY', rightX, curY);
  curY += 15;
  ctx.beginPath();
  ctx.moveTo(rightX, curY);
  ctx.lineTo(packW - 60, curY);
  ctx.stroke();
  curY += 35;

  drawSpecRow(ctx, rightX, curY, 'Application Finish', placement.printFinish);
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Mesh Count / Density', '156 - 200 Mesh Count');
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Curing Temperature', '320°F (160°C) for 90 sec');
  curY += 32;
  drawSpecRow(ctx, rightX, curY, 'Wash Fastness Test', 'AATCC 61-2A (40 washes)');
  curY += 50;

  // Section 4: Production Notes
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('4. QUALITY CONTROL & NOTES', rightX, curY);
  curY += 15;
  ctx.beginPath();
  ctx.moveTo(rightX, curY);
  ctx.lineTo(packW - 60, curY);
  ctx.stroke();
  curY += 30;

  ctx.fillStyle = '#475569';
  ctx.font = '13px Inter, sans-serif';
  const notes = [
    '• Maintain +/- 0.25 inch placement tolerance from seam reference points.',
    '• Laser alignment projection recommended for breast & center chest placements.',
    '• Ensure zero pinholes and clean ink edge definition on textured knit weave.',
    '• Wash test 1 sample per 100 units before mass packaging.',
    extraNotes ? `• Note: ${extraNotes}` : '',
  ].filter(Boolean);

  for (const n of notes) {
    ctx.fillText(n, rightX, curY);
    curY += 24;
  }

  // Bottom Signature & Approval Box
  const signY = 1420;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(50, signY, packW - 100, 160);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(50, signY, packW - 100, 160);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText('APPROVAL SIGN-OFF', 80, signY + 36);

  ctx.font = '13px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Fashion Stylist / Art Director: _________________________', 80, signY + 80);
  ctx.fillText('Production Factory Lead: ____________________________', 650, signY + 80);
  ctx.fillText('Date Approved: ________________', 1200, signY + 80);
  ctx.fillText('Sample Status: [ X ] APPROVED FOR BULK RUN   [  ] REVISE & RESUBMIT', 80, signY + 124);

  return canvas;
}

function drawSpecRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  value: string
) {
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(label, x, y);

  ctx.font = '600 15px Inter, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(value, x + 210, y);
}
