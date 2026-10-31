import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to strip data:image/...;base64, prefix
function extractBase64Data(dataUrl: string): { data: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/png', data: dataUrl };
}

// Initialize Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Generate AI Hyper-Realistic Mockup
app.post('/api/generate-mockup', async (req: Request, res: Response) => {
  try {
    const {
      garmentImage,
      logoImage,
      compositePreview,
      placement,
      is2dFlatlay,
      garmentType = 'Garment',
      garmentColor = 'Custom',
    } = req.body;

    if (!garmentImage || !logoImage) {
      return res.status(400).json({
        error: 'Both garment image (IMAGE 1) and logo image (IMAGE 2) are required.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please check your settings.',
      });
    }

    const garmentPart = extractBase64Data(garmentImage);
    const logoPart = extractBase64Data(logoImage);

    const parts: any[] = [
      {
        inlineData: {
          mimeType: garmentPart.mimeType,
          data: garmentPart.data,
        },
      },
      {
        inlineData: {
          mimeType: logoPart.mimeType,
          data: logoPart.data,
        },
      },
    ];

    if (compositePreview) {
      const compPart = extractBase64Data(compositePreview);
      parts.push({
        inlineData: {
          mimeType: compPart.mimeType,
          data: compPart.data,
        },
      });
    }

    const targetSide = placement?.targetSide || 'Front';
    const location = placement?.location || 'Center chest';
    const widthIn = placement?.widthInches ?? 8;
    const heightIn = placement?.heightInches ?? 8;
    const printFinish = placement?.printFinish || 'Screen Print Matte';
    const rotation = placement?.rotationDeg || 0;

    const flatlayInstruction = is2dFlatlay
      ? `CRITICAL 2D FLAT-LAY REQUIREMENT: Modify the apparel to present as a clean, pristine 2D technical fashion flat-lay catalog presentation. Perfectly symmetrical or flat-folded, uniform diffused studio lighting with no harsh 3D mannequin shadows, showing clean garment contours and technical flat styling.`
      : `COMMERCIAL APPAREL STUDIO PHOTOGRAPHY: Clean, high-end commercial apparel studio photography with professional softbox lighting, isolated or neutral minimalist studio background. Single photorealistic mockup image showing the final product clearly.`;

    const promptText = `Act as an automated e-commerce apparel mockup app and professional digital fashion stylist.

INPUT REFERENCE IMAGES:
- First image (IMAGE 1): The blank clothing item (${garmentType}, ${garmentColor}, ${targetSide} view).
- Second image (IMAGE 2): The graphic emblem / logo artwork to composite.
${compositePreview ? '- Third image: Client interactive placement preview guideline.' : ''}

TASK:
Generate a hyper-realistic, production-grade apparel product mockup by compositing the logo onto the garment based on these exact instructions:

## PLACEMENT SPECIFICATIONS:
- Target Side: ${targetSide}
- Precise Location: ${location}
- Scale & Proportions: Scaled naturally to approximately ${widthIn} inches wide by ${heightIn} inches tall on the physical garment. It should not look disproportionately oversized or undersized.
- Orientation: ${rotation !== 0 ? `Rotated ${rotation} degrees.` : 'Orthogonal / straight alignment.'}

## FABRIC MAPPING & REALISM (CRITICAL):
- Do NOT simply paste a flat 2D graphic onto the clothing.
- The graphic MUST conform to the physical texture, ribbing, knit weave, and weight of the fabric from IMAGE 1.
- Apply realistic fabric physics: the graphic must subtly distort, follow cloth wrinkles, stretch across natural fabric folds, and take on the texture of the material.
- Match the lighting: Cast soft ambient highlights and shadows from the garment folds onto the graphic.
- Print Finish: "${printFinish}". Ensure the fabric texture remains authentically visible underneath the print, looking permanently printed or embroidered into the textile.

## OUTPUT REQUIREMENTS:
${flatlayInstruction}
Ensure the fabric weave and textile texture are palpably visible throughout the artwork.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts,
      },
    });

    let generatedImageUrl: string | null = null;
    let modelTextFeedback = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        modelTextFeedback += part.text + '\n';
      }
    }

    if (!generatedImageUrl) {
      return res.status(200).json({
        success: false,
        message: modelTextFeedback.trim() || 'No image part was returned by the model.',
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
      feedback: modelTextFeedback.trim(),
    });
  } catch (error: any) {
    console.error('Error generating mockup:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate mockup with AI.',
    });
  }
});

// API: Convert uploaded garment to 2D flat-lay
app.post('/api/convert-to-2d', async (req: Request, res: Response) => {
  try {
    const { garmentImage, garmentType = 'Apparel' } = req.body;
    if (!garmentImage) {
      return res.status(400).json({ error: 'Garment image is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const garmentPart = extractBase64Data(garmentImage);

    const promptText = `You are a professional fashion technical designer.
Transform this uploaded garment image into a pristine 2D flat-lay technical apparel product photo:
- Flatten the perspective so the garment is laid completely flat (2D bird's-eye flat-lay).
- Preserve the exact garment shape, color, neckline, ribbing, and fabric weight.
- Provide clean, uniform, soft e-commerce catalog lighting with pure clean minimalist background.
- Remove background clutter, hangers, human bodies, or mannequins if present.
- Output ONLY the 2D flat-lay garment image.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: garmentPart.mimeType,
              data: garmentPart.data,
            },
          },
          { text: promptText },
        ],
      },
    });

    let generatedImageUrl: string | null = null;
    let modelTextFeedback = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        modelTextFeedback += part.text + '\n';
      }
    }

    if (!generatedImageUrl) {
      return res.status(200).json({
        success: false,
        message: modelTextFeedback || 'Unable to convert garment to 2D flat-lay.',
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
    });
  } catch (error: any) {
    console.error('Error converting garment to 2D:', error);
    return res.status(500).json({
      error: error.message || 'Failed to convert garment to 2D flat-lay.',
    });
  }
});

// API: Digital Fashion Stylist Critique & Tech Pack Spec
app.post('/api/stylist-review', async (req: Request, res: Response) => {
  try {
    const { garmentInfo, logoInfo, placement } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `You are an elite Digital Fashion Stylist and Apparel Manufacturing Director for high-end streetwear and commercial fashion brands.
Review this apparel mockup setup:
- Garment: ${garmentInfo?.type || 'T-shirt'}, Color: ${garmentInfo?.color || 'Neutral'}, Side: ${placement?.targetSide || 'Front'}
- Placement: ${placement?.location || 'Center chest'}
- Dimensions: ${placement?.widthInches || 10}" W x ${placement?.heightInches || 10}" H
- Print Finish: ${placement?.printFinish || 'Screen Print Matte'}

Provide an authoritative, stylish, and highly actionable digital fashion stylist consultation report formatted as JSON:
{
  "aestheticScore": 9.4,
  "verdictTitle": "Punchy punchy phrase (e.g., Prime Streetwear Proportions)",
  "goldenRatioAnalysis": "Detailed assessment of the logo scale vs garment chest/shoulder proportions",
  "printTechniqueRecommendation": "Best printing method (e.g. Water-based screenprint vs DTG vs 400gsm puff print) and why",
  "colorHarmonyAdvice": "Color contrast analysis with suggested garment or ink palette pairing",
  "retailPriceTier": "Estimated e-commerce retail price point (e.g. $42 - $58 USD) and positioning",
  "productionTips": ["Key technical tip 1 for manufacturer", "Key technical tip 2 for wash durability", "Key tip 3 for placement alignment"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    let data = {};
    try {
      data = JSON.parse(jsonText);
    } catch {
      data = { raw: jsonText };
    }

    return res.status(200).json({ success: true, stylistReport: data });
  } catch (error: any) {
    console.error('Error running stylist critique:', error);
    return res.status(500).json({
      error: error.message || 'Failed to run fashion stylist review.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mockup Studio server running at http://localhost:${PORT}`);
  });
}

startServer();
