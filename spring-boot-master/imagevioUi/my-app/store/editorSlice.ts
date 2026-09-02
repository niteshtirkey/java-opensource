import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageMetadata, ImageOperation } from "@/types/editor";

export interface EditorState {
  sessionId: string | null;
  image: ImageMetadata;
  history: ImageOperation[];
  historyIndex: number;
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
  filter: "none",
  url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
  name: "sample-artwork.jpg",
};

const initialState: EditorState = {
  sessionId: null,
  image: initialImage,
  history: [],
  historyIndex: -1,
  isLoading: false,
  loadingMessage: "",
  errorMessage: null,
  zoom: 1,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
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
        filter: "none",
        url: action.payload.url,
        name: action.payload.name || "uploaded_image.png",
      };
      state.history = [];
      state.historyIndex = -1;
      state.errorMessage = null;
    },
    setDimensions: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.image.width = action.payload.width;
      state.image.height = action.payload.height;
    },
    setRotation: (state, action: PayloadAction<number>) => {
      state.image.rotation = action.payload;
    },
    setBrightness: (state, action: PayloadAction<number>) => {
      state.image.brightness = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.image.filter = action.payload;
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
          case "filter":
            if (p.filter_name) state.image.filter = p.filter_name;
            break;
        }
      }
      state.history.push(...ops);
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex >= 0) {
        state.historyIndex -= 1;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
      }
    },
    resetImage: (state) => {
      state.image = {
        ...state.image,
        width: 800,
        height: 600,
        rotation: 0,
        brightness: 1.0,
        filter: "none",
      };
      state.history = [];
      state.historyIndex = -1;
      state.errorMessage = null;
    },
  },
});

export const {
  setSessionId,
  setImageUrl,
  setDimensions,
  setRotation,
  setBrightness,
  setFilter,
  setZoom,
  setLoading,
  setErrorMessage,
  applyOperations,
  undo,
  redo,
  resetImage,
} = editorSlice.actions;

export default editorSlice.reducer;
