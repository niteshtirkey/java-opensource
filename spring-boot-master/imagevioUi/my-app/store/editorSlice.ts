import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ImageMetadata,
  ImageOperation,
  TextLayer,
  ShapeLayer,
  BrushStroke,
  StickerLayer,
  OverlayEffect,
} from "@/types/editor";

export interface CropState {
  isActive: boolean;
  type: "rect" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BrushSettings {
  type: "neon" | "sparkle" | "marker" | "glow" | "eraser";
  color: string;
  size: number;
  opacity: number;
}

export interface EditorState {
  sessionId: string | null;
  image: ImageMetadata;
  selectedLayerId: string | null;
  activeMode: "select" | "crop" | "brush" | "sticker";
  brushSettings: BrushSettings;
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
  brushStrokes: [],
  stickers: [],
  overlayEffect: "none",
};

const initialCrop: CropState = {
  isActive: false,
  type: "rect",
  x: 100,
  y: 100,
  width: 400,
  height: 400,
};

const initialBrush: BrushSettings = {
  type: "neon",
  color: "#6366f1",
  size: 14,
  opacity: 1.0,
};

const initialState: EditorState = {
  sessionId: null,
  image: initialImage,
  selectedLayerId: null,
  activeMode: "select",
  brushSettings: initialBrush,
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
    setActiveMode: (state, action: PayloadAction<"select" | "crop" | "brush" | "sticker">) => {
      state.activeMode = action.payload;
      if (action.payload !== "crop") {
        state.cropState.isActive = false;
      }
    },
    setBrushSettings: (state, action: PayloadAction<Partial<BrushSettings>>) => {
      state.brushSettings = { ...state.brushSettings, ...action.payload };
    },
    startCrop: (state, action: PayloadAction<"rect" | "circle">) => {
      const minDim = Math.min(state.image.width, state.image.height);
      const size = Math.round(minDim * 0.7);
      state.activeMode = "crop";
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
      state.activeMode = "select";
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
      state.activeMode = "select";
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
        brushStrokes: [],
        stickers: [],
        overlayEffect: "none",
      };
      state.selectedLayerId = null;
      state.cropState.isActive = false;
      state.activeMode = "select";
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
    setOverlayEffect: (state, action: PayloadAction<OverlayEffect>) => {
      state.image.overlayEffect = action.payload;
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
    updateTextLayer: (state, action: PayloadAction<Partial<TextLayer> & { id: string }>) => {
      const layer = state.image.textLayers.find((t) => t.id === action.payload.id);
      if (layer) {
        Object.assign(layer, action.payload);
      }
    },
    addBrushStroke: (state, action: PayloadAction<BrushStroke>) => {
      state.image.brushStrokes.push(action.payload);
      pushSnapshot(state);
    },
    clearBrushStrokes: (state) => {
      state.image.brushStrokes = [];
      pushSnapshot(state);
    },
    addSticker: (state, action: PayloadAction<{ stickerKey: string; size?: number }>) => {
      const id = `sticker-${Date.now()}`;
      state.image.stickers.push({
        id,
        stickerKey: action.payload.stickerKey,
        x: Math.round(state.image.width / 2),
        y: Math.round(state.image.height / 2),
        size: action.payload.size || 120,
        rotation: 0,
        opacity: 1.0,
      });
      state.selectedLayerId = id;
      pushSnapshot(state);
    },
    updateSticker: (state, action: PayloadAction<Partial<StickerLayer> & { id: string }>) => {
      const sticker = state.image.stickers.find((s) => s.id === action.payload.id);
      if (sticker) {
        Object.assign(sticker, action.payload);
      }
    },
    deleteLayer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.image.textLayers = state.image.textLayers.filter((t) => t.id !== id);
      state.image.shapeLayers = state.image.shapeLayers.filter((s) => s.id !== id);
      state.image.stickers = state.image.stickers.filter((s) => s.id !== id);
      if (state.selectedLayerId === id) {
        state.selectedLayerId = null;
      }
      pushSnapshot(state);
    },
    applySocialPreset: (state, action: PayloadAction<"ig_post" | "ig_story" | "yt_thumb" | "cinema_wide">) => {
      switch (action.payload) {
        case "ig_post":
          state.image.width = 1080;
          state.image.height = 1080;
          break;
        case "ig_story":
          state.image.width = 1080;
          state.image.height = 1920;
          break;
        case "yt_thumb":
          state.image.width = 1280;
          state.image.height = 720;
          break;
        case "cinema_wide":
          state.image.width = 1920;
          state.image.height = 816;
          break;
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
          case "add_sticker":
            if (p.sticker_key) {
              const id = `sticker-${Date.now()}`;
              state.image.stickers.push({
                id,
                stickerKey: p.sticker_key,
                x: Math.round(state.image.width / 2),
                y: Math.round(state.image.height / 2),
                size: 120,
                rotation: 0,
                opacity: 1.0,
              });
              state.selectedLayerId = id;
            }
            break;
          case "apply_overlay":
            if (p.overlay_effect) {
              state.image.overlayEffect = p.overlay_effect as OverlayEffect;
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
        brushStrokes: [],
        stickers: [],
        overlayEffect: "none",
      };
      state.selectedLayerId = null;
      state.activeMode = "select";
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
  setActiveMode,
  setBrushSettings,
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
  setOverlayEffect,
  toggleFlipHorizontal,
  toggleFlipVertical,
  addTextLayer,
  updateTextLayer,
  addBrushStroke,
  clearBrushStrokes,
  addSticker,
  updateSticker,
  deleteLayer,
  applySocialPreset,
  setZoom,
  setLoading,
  setErrorMessage,
  applyOperations,
  undo,
  redo,
  resetImage,
} = editorSlice.actions;

export default editorSlice.reducer;

