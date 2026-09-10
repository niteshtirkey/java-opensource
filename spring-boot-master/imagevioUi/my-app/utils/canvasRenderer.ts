import { StickerLayer, OverlayEffect, BrushStroke } from "@/types/editor";

/**
 * Custom Canvas Renderer for Imgevio Studio.
 * Renders procedural vector stickers, atmospheric canvas shaders, and multi-mode brushes.
 */

// --- 1. Procedural Sticker Rendering Engine ---

export function drawSticker(ctx: CanvasRenderingContext2D, sticker: StickerLayer, isSelected: boolean) {
  ctx.save();
  ctx.translate(sticker.x, sticker.y);
  ctx.rotate((sticker.rotation * Math.PI) / 180);
  ctx.globalAlpha = sticker.opacity;

  const s = sticker.size;
  const half = s / 2;

  switch (sticker.stickerKey) {
    case "neon_heart":
      drawNeonHeart(ctx, s);
      break;
    case "golden_crown":
    case "crown":
      drawGoldenCrown(ctx, s);
      break;
    case "verified_badge":
    case "verified":
      drawVerifiedBadge(ctx, s);
      break;
    case "sparkle_star":
    case "sparkle":
      drawSparkleStar(ctx, s);
      break;
    case "fire_flame":
    case "fire":
      drawFlame(ctx, s);
      break;
    case "cyber_badge":
      drawCyberBadge(ctx, s);
      break;
    case "polaroid_frame":
      drawPolaroidFrame(ctx, s);
      break;
    default:
      drawGenericBadge(ctx, s, sticker.stickerKey);
      break;
  }

  // Selection outline
  if (isSelected) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(-half - 8, -half - 8, s + 16, s + 16);
  }

  ctx.restore();
}

function drawNeonHeart(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-50, -45);

  ctx.shadowColor = "#f43f5e";
  ctx.shadowBlur = 18;
  ctx.strokeStyle = "#fb7185";
  ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(50, 80);
  ctx.bezierCurveTo(20, 50, 10, 20, 30, 10);
  ctx.bezierCurveTo(45, 2, 50, 25, 50, 25);
  ctx.bezierCurveTo(50, 25, 55, 2, 70, 10);
  ctx.bezierCurveTo(90, 20, 80, 50, 50, 80);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner bright core
  ctx.shadowBlur = 4;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawGoldenCrown(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-50, -50);

  const grad = ctx.createLinearGradient(0, 0, 100, 100);
  grad.addColorStop(0, "#fde047");
  grad.addColorStop(0.5, "#eab308");
  grad.addColorStop(1, "#ca8a04");

  ctx.shadowColor = "#eab308";
  ctx.shadowBlur = 12;
  ctx.fillStyle = grad;
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(15, 75);
  ctx.lineTo(85, 75);
  ctx.lineTo(95, 30);
  ctx.lineTo(68, 55);
  ctx.lineTo(50, 20);
  ctx.lineTo(32, 55);
  ctx.lineTo(5, 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crown jewels
  ctx.fillStyle = "#ef4444";
  ctx.beginPath(); ctx.arc(50, 20, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath(); ctx.arc(5, 30, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#10b981";
  ctx.beginPath(); ctx.arc(95, 30, 4, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

function drawVerifiedBadge(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-50, -50);

  // Blue Badge
  ctx.shadowColor = "#3b82f6";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.arc(50, 50, 40, 0, Math.PI * 2);
  ctx.fill();

  // White Checkmark
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(35, 52);
  ctx.lineTo(46, 63);
  ctx.lineTo(65, 38);
  ctx.stroke();

  ctx.restore();
}

function drawSparkleStar(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-50, -50);

  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#ffffff";

  ctx.beginPath();
  ctx.moveTo(50, 10);
  ctx.quadraticCurveTo(50, 50, 90, 50);
  ctx.quadraticCurveTo(50, 50, 50, 90);
  ctx.quadraticCurveTo(50, 50, 10, 50);
  ctx.quadraticCurveTo(50, 50, 50, 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawFlame(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-50, -50);

  ctx.shadowColor = "#f97316";
  ctx.shadowBlur = 18;
  const grad = ctx.createLinearGradient(0, 85, 0, 15);
  grad.addColorStop(0, "#dc2626");
  grad.addColorStop(0.5, "#f97316");
  grad.addColorStop(1, "#facc15");
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(50, 15);
  ctx.bezierCurveTo(70, 40, 85, 50, 85, 70);
  ctx.bezierCurveTo(85, 88, 70, 95, 50, 95);
  ctx.bezierCurveTo(30, 95, 15, 88, 15, 70);
  ctx.bezierCurveTo(15, 45, 35, 35, 50, 15);
  ctx.fill();

  // Inner Yellow flame core
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.moveTo(50, 45);
  ctx.bezierCurveTo(60, 60, 68, 68, 68, 78);
  ctx.bezierCurveTo(68, 88, 60, 92, 50, 92);
  ctx.bezierCurveTo(40, 92, 32, 88, 32, 78);
  ctx.bezierCurveTo(32, 65, 42, 58, 50, 45);
  ctx.fill();

  ctx.restore();
}

function drawCyberBadge(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-50, -50);

  ctx.shadowColor = "#06b6d4";
  ctx.shadowBlur = 14;
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(6, 182, 212, 0.25)";

  ctx.beginPath();
  ctx.moveTo(50, 12);
  ctx.lineTo(88, 32);
  ctx.lineTo(88, 72);
  ctx.lineTo(50, 92);
  ctx.lineTo(12, 72);
  ctx.lineTo(12, 32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CYBER", 50, 54);

  ctx.restore();
}

function drawPolaroidFrame(ctx: CanvasRenderingContext2D, size: number) {
  const half = size / 2;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-half, -half, size, size * 1.15);

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(-half + 8, -half + 8, size - 16, size - 24);
  ctx.restore();
}

function drawGenericBadge(ctx: CanvasRenderingContext2D, size: number, text: string) {
  const half = size / 2;
  ctx.save();
  ctx.fillStyle = "#6366f1";
  ctx.shadowColor = "#6366f1";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, half, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(size * 0.22)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.slice(0, 6).toUpperCase(), 0, 0);
  ctx.restore();
}

// --- 2. Custom Atmospheric Overlays & Canvas Shaders ---

export function drawAtmosphericOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, effect: OverlayEffect) {
  if (effect === "none") return;

  ctx.save();
  switch (effect) {
    case "golden_hour": {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "rgba(251, 191, 36, 0.4)");
      grad.addColorStop(0.5, "rgba(249, 115, 22, 0.2)");
      grad.addColorStop(1, "rgba(217, 70, 239, 0.15)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Light streak flare
      const flare = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.7);
      flare.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      flare.addColorStop(0.3, "rgba(251, 191, 36, 0.35)");
      flare.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = flare;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case "film_dust": {
      // Vignette border
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.75);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(20, 10, 5, 0.45)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm tint
      ctx.fillStyle = "rgba(180, 120, 60, 0.12)";
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case "cyber_glitch": {
      // Horizontal Scanlines
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      for (let y = 0; y < height; y += 6) {
        ctx.fillRect(0, y, width, 2);
      }
      // Neon Cyan and Magenta split borders
      ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case "prism_rainbow": {
      const prism = ctx.createLinearGradient(0, height * 0.2, width, height * 0.8);
      prism.addColorStop(0, "rgba(239, 68, 68, 0.2)");
      prism.addColorStop(0.2, "rgba(249, 115, 22, 0.2)");
      prism.addColorStop(0.4, "rgba(234, 179, 8, 0.2)");
      prism.addColorStop(0.6, "rgba(34, 197, 94, 0.2)");
      prism.addColorStop(0.8, "rgba(59, 130, 246, 0.2)");
      prism.addColorStop(1, "rgba(168, 85, 247, 0.2)");
      ctx.fillStyle = prism;
      ctx.fillRect(0, 0, width, height);
      break;
    }
  }
  ctx.restore();
}

// --- 3. Custom Brush Studio Drawing Engine ---

export function drawBrushStrokes(ctx: CanvasRenderingContext2D, strokes: BrushStroke[]) {
  strokes.forEach((stroke) => {
    if (!stroke.points || stroke.points.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (stroke.type) {
      case "neon": {
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = stroke.size * 1.8;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.globalAlpha = stroke.opacity * 0.8;

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();

        // Inner white hot core
        ctx.shadowBlur = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = Math.max(2, stroke.size * 0.35);
        ctx.globalAlpha = stroke.opacity;
        ctx.stroke();
        break;
      }

      case "sparkle": {
        ctx.fillStyle = stroke.color;
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = 8;
        stroke.points.forEach((pt, idx) => {
          if (idx % 3 === 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, stroke.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            // Star ray
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(pt.x - stroke.size, pt.y);
            ctx.lineTo(pt.x + stroke.size, pt.y);
            ctx.moveTo(pt.x, pt.y - stroke.size);
            ctx.lineTo(pt.x, pt.y + stroke.size);
            ctx.stroke();
          }
        });
        break;
      }

      case "marker": {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.globalAlpha = stroke.opacity * 0.55;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        break;
      }

      default: {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.globalAlpha = stroke.opacity;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  });
}
