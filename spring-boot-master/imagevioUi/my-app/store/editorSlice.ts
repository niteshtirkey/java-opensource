import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageMetadata, ImageOperation, TextLayer, ShapeLayer } from "@/types/editor";

export interface CropState {
  isActive: boolean;
  type: "rect" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorState {
  sessionId: string | null;
  image: ImageMetadata;
  selectedLayerId: string | null;
  cropState: CropState;
  historySnapshots: ImageMetadata[];
  historyIndex: number;
  historyOperations: ImageOperation[];
  isLoading: boolean;
  loadingMessage: string;
  errorMessage: string | null;
  zoom: number;
}

const initialImage: ImageMetadata = {
  width: 800,
  height: 600,
  rotation: 0,
  brightness: 1.0,
  contrast: 1.0,
  saturation: 1.0,
  filter: "none",
  flipHorizontal: false,
  flipVertical: false,
  url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
  name: "sample-artwork.jpg",
  textLayers: [],
  shapeLayers: [],
};

const initialCrop: CropState = {
  isActive: false,
  type: "rect",
  x: 100,
  y: 100,
  width: 400,
  height: 400,
};

const initialState: EditorState = {
  sessionId: null,
  image: initialImage,
  selectedLayerId: null,
  cropState: initialCrop,
  historySnapshots: [initialImage],
  historyIndex: 0,
  historyOperations: [],
  isLoading: false,
  loadingMessage: "",
  errorMessage: null,
  zoom: 1,
};

function pushSnapshot(state: EditorState) {
  const newSnapshots = state.historySnapshots.slice(0, state.historyIndex + 1);
  newSnapshots.push(JSON.parse(JSON.stringify(state.image)));
  if (newSnapshots.length > 50) newSnapshots.shift();
  state.historySnapshots = newSnapshots;
  state.historyIndex = newSnapshots.length - 1;
}

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setSelectedLayerId: (state, action: PayloadAction<string | null>) => {
      state.selectedLayerId = action.payload;
    },
    startCrop: (state, action: PayloadAction<"rect" | "circle">) => {
      const minDim = Math.min(state.image.width, state.image.height);
      const size = Math.round(minDim * 0.7);
      state.cropState = {
        isActive: true,
        type: action.payload,
        x: Math.round((state.image.width - size) / 2),
        y: Math.round((state.image.height - size) / 2),
        width: size,
        height: size,
      };
    },
    updateCropPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.cropState.x = action.payload.x;
      state.cropState.y = action.payload.y;
    },
    updateCropSize: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.cropState.width = action.payload.width;
      state.cropState.height = action.payload.height;
    },
    cancelCrop: (state) => {
      state.cropState.isActive = false;
    },
    applyCrop: (
      state,
      action: PayloadAction<{
        newUrl: string;
        width: number;
        height: number;
      }>
    ) => {
      state.image.url = action.payload.newUrl;
      state.image.width = action.payload.width;
      state.image.height = action.payload.height;
      state.cropState.isActive = false;
      state.selectedLayerId = null;
      pushSnapshot(state);
    },
    setImageUrl: (
      state,
      action: PayloadAction<{ url: string; name?: string; width?: number; height?: number }>
    ) => {
      state.image = {
        width: action.payload.width || 800,
        height: action.payload.height || 600,
        rotation: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        filter: "none",
        flipHorizontal: false,
        flipVertical: false,
        url: action.payload.url,
        name: action.payload.name || "uploaded_image.png",
        textLayers: [],
        shapeLayers: [],
      };
      state.selectedLayerId = null;
      state.cropState.isActive = false;
      state.historySnapshots = [JSON.parse(JSON.stringify(state.image))];
      state.historyIndex = 0;
      state.historyOperations = [];
      state.errorMessage = null;
    },
    setDimensions: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.image.width = action.payload.width;
      state.image.height = action.payload.height;
      pushSnapshot(state);
    },
    setRotation: (state, action: PayloadAction<number>) => {
      state.image.rotation = action.payload;
      pushSnapshot(state);
    },
    setBrightness: (state, action: PayloadAction<number>) => {
      state.image.brightness = action.payload;
      pushSnapshot(state);
    },
    setContrast: (state, action: PayloadAction<number>) => {
      state.image.contrast = action.payload;
      pushSnapshot(state);
    },
    setSaturation: (state, action: PayloadAction<number>) => {
      state.image.saturation = action.payload;
      pushSnapshot(state);
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.image.filter = action.payload;
      pushSnapshot(state);
    },
    toggleFlipHorizontal: (state) => {
      state.image.flipHorizontal = !state.image.flipHorizontal;
      pushSnapshot(state);
    },
    toggleFlipVertical: (state) => {
      state.image.flipVertical = !state.image.flipVertical;
      pushSnapshot(state);
    },
    addTextLayer: (state, action: PayloadAction<Omit<TextLayer, "id">>) => {
      const id = `text-${Date.now()}`;
      state.image.textLayers.push({
        ...action.payload,
        id,
      });
      state.selectedLayerId = id;
      pushSnapshot(state);
    },
    updateTextLayer: (state, action: PayloadAction<{ id: string; x?: number; y?: number; text?: string; fontSize?: number; color?: string }>) => {
      const layer = state.image.textLayers.find((t) => t.id === action.payload.id);
      if (layer) {
        if (action.payload.x !== undefined) layer.x = action.payload.x;
        if (action.payload.y !== undefined) layer.y = action.payload.y;
        if (action.payload.text !== undefined) layer.text = action.payload.text;
        if (action.payload.fontSize !== undefined) layer.fontSize = action.payload.fontSize;
        if (action.payload.color !== undefined) layer.color = action.payload.color;
      }
    },
    deleteLayer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.image.textLayers = state.image.textLayers.filter((t) => t.id !== id);
      state.image.shapeLayers = state.image.shapeLayers.filter((s) => s.id !== id);
      if (state.selectedLayerId === id) {
        state.selectedLayerId = null;
      }
      pushSnapshot(state);
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.min(Math.max(action.payload, 0.2), 3);
    },
    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || "";
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    applyOperations: (state, action: PayloadAction<ImageOperation[]>) => {
      const ops = action.payload;
      for (const op of ops) {
        const p = op.parameters;
        switch (op.action_type) {
          case "resize":
          case "crop":
            if (p.target_width > 0) state.image.width = p.target_width;
            if (p.target_height > 0) state.image.height = p.target_height;
            break;
          case "rotate":
            state.image.rotation = (state.image.rotation + p.rotation_degrees) % 360;
            break;
          case "adjust_brightness":
            if (p.intensity_level > 0) state.image.brightness = p.intensity_level;
            break;
          case "color_adjust":
            if (p.contrast) state.image.contrast = p.contrast;
            if (p.saturation) state.image.saturation = p.saturation;
            break;
          case "flip":
            if (p.flip_horizontal) state.image.flipHorizontal = !state.image.flipHorizontal;
            if (p.flip_vertical) state.image.flipVertical = !state.image.flipVertical;
            break;
          case "add_text":
            if (p.text) {
              const id = `text-${Date.now()}`;
              state.image.textLayers.push({
                id,
                text: p.text,
                x: state.image.width / 2,
                y: state.image.height / 2,
                fontSize: p.font_size || 32,
                color: p.text_color || "#ffffff",
              });
              state.selectedLayerId = id;
            }
            break;
          case "filter":
            if (p.filter_name) state.image.filter = p.filter_name;
            break;
        }
      }
      state.historyOperations.push(...ops);
      pushSnapshot(state);
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.image = JSON.parse(JSON.stringify(state.historySnapshots[state.historyIndex]));
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.historySnapshots.length - 1) {
        state.historyIndex += 1;
        state.image = JSON.parse(JSON.stringify(state.historySnapshots[state.historyIndex]));
      }
    },
    resetImage: (state) => {
      state.image = {
        ...state.image,
        width: 800,
        height: 600,
        rotation: 0,
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        filter: "none",
        flipHorizontal: false,
        flipVertical: false,
        textLayers: [],
        shapeLayers: [],
      };
      state.selectedLayerId = null;
      state.cropState = initialCrop;
      state.historySnapshots = [JSON.parse(JSON.stringify(state.image))];
      state.historyIndex = 0;
      state.historyOperations = [];
      state.errorMessage = null;
    },
  },
});

export const {
  setSessionId,
  setSelectedLayerId,
  startCrop,
  updateCropPosition,
  updateCropSize,
  cancelCrop,
  applyCrop,
  setImageUrl,
  setDimensions,
  setRotation,
  setBrightness,
  setContrast,
  setSaturation,
  setFilter,
  toggleFlipHorizontal,
  toggleFlipVertical,
  addTextLayer,
  updateTextLayer,
  deleteLayer,
  setZoom,
  setLoading,
  setErrorMessage,
  applyOperations,
  undo,
  redo,
  resetImage,
} = editorSlice.actions;

export default editorSlice.reducer;
