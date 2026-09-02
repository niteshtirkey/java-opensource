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
}
