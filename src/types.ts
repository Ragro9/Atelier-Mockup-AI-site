export type TargetSide = 'Front' | 'Back';

export type PlacementLocation =
  | 'Center chest'
  | 'Left chest pocket area'
  | 'Upper center between shoulder blades'
  | 'Lower hem'
  | 'Full back print'
  | 'Oversized front print'
  | 'Custom';

export type PrintFinish =
  | 'Screen Print Matte'
  | 'Direct-to-Garment [DTG]'
  | 'Vintage Distressed'
  | 'High-Gloss Plastisol'
  | 'Raised 3D Embroidery'
  | 'Metallic Gold Foil'
  | 'Reflective 3M Transfer';

export interface GarmentPreset {
  id: string;
  name: string;
  type: string;
  category: 'T-Shirt' | 'Hoodie' | 'Sweatshirt' | 'Accessories';
  frontImage: string;
  backImage: string;
  front2dImage: string;
  back2dImage: string;
  defaultColor: string;
  availableColors: { name: string; hex: string }[];
  chestWidthInches: number; // For physical dimensional scaling reference (e.g. 20" across chest)
  bodyLengthInches: number; // (e.g. 28" length)
}

export interface LogoPreset {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  defaultWidthInches: number;
}

export interface PlacementConfig {
  targetSide: TargetSide;
  location: PlacementLocation;
  // Position as percentage of garment bounding area [0..100]
  posX: number;
  posY: number;
  // Physical dimensions in inches
  widthInches: number;
  heightInches: number;
  // Aspect ratio lock
  lockAspectRatio: boolean;
  aspectRatio: number;
  // Rotation in degrees [-180..180]
  rotation: number;
  // Opacity [0..1]
  opacity: number;
  // Finish
  printFinish: PrintFinish;
  // Fabric displacement & realism
  displacementStrength: number; // 0..100
  weaveTextureStrength: number; // 0..100
  shadowBleed: number; // 0..100
  highlightBleed: number; // 0..100
}

export interface StylistReport {
  aestheticScore?: number;
  verdictTitle?: string;
  goldenRatioAnalysis?: string;
  printTechniqueRecommendation?: string;
  colorHarmonyAdvice?: string;
  retailPriceTier?: string;
  productionTips?: string[];
  raw?: string;
}
