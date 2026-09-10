export interface OperationParameters {
  target_width: number;
  target_height: number;
  filter_name: string;
  rotation_degrees: number;
  intensity_level: number;
  contrast?: number;
  saturation?: number;
  text?: string;
  font_size?: number;
  text_color?: string;
  shape_type?: string;
  flip_horizontal?: boolean;
  flip_vertical?: boolean;
  sticker_key?: string;
  overlay_effect?: string;
}

export interface ImageOperation {
  sequence_id: number;
  action_type:
    | "resize"
    | "crop"
    | "filter"
    | "rotate"
    | "adjust_brightness"
    | "color_adjust"
    | "add_text"
    | "add_shape"
    | "add_sticker"
    | "apply_overlay"
    | "flip"
    | string;
  parameters: OperationParameters;
}

export interface ImageEditResponse {
  session_status: "active" | "blocked";
  error_message?: string;
  parsed_operations: ImageOperation[];
}

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  backgroundPill?: boolean;
  pillColor?: string;
}

export interface ShapeLayer {
  id: string;
  type: "rect" | "circle" | "star" | "triangle" | "line";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface BrushPoint {
  x: number;
  y: number;
}

export interface BrushStroke {
  id: string;
  type: "neon" | "sparkle" | "marker" | "glow" | "eraser";
  color: string;
  size: number;
  opacity: number;
  points: BrushPoint[];
}

export interface StickerLayer {
  id: string;
  stickerKey: string; // e.g. "crown", "neon_heart", "verified", "sparkle_star", "fire", "cyber_badge", "film_frame"
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

export type OverlayEffect =
  | "none"
  | "film_dust"
  | "golden_hour"
  | "cyber_glitch"
  | "prism_rainbow"
  | "lens_flare";

export interface ImageMetadata {
  width: number;
  height: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  filter: string;
  flipHorizontal: boolean;
  flipVertical: boolean;
  url: string | null;
  name: string;
  textLayers: TextLayer[];
  shapeLayers: ShapeLayer[];
  brushStrokes: BrushStroke[];
  stickers: StickerLayer[];
  overlayEffect: OverlayEffect;
}

