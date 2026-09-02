export interface OperationParameters {
  target_width: number;
  target_height: number;
  filter_name: string;
  rotation_degrees: number;
  intensity_level: number;
}

export interface ImageOperation {
  sequence_id: number;
  action_type: "resize" | "crop" | "filter" | "rotate" | "adjust_brightness" | string;
  parameters: OperationParameters;
}

export interface ImageEditResponse {
  session_status: "active" | "blocked";
  error_message?: string;
  parsed_operations: ImageOperation[];
}

export interface ImageMetadata {
  width: number;
  height: number;
  rotation: number;
  brightness: number;
  filter: string;
  url: string | null;
  name: string;
}
