import React, { useEffect, useRef } from "react";

export interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  hueShift?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Strands: React.FC<StrandsProps> = ({
  colors = ["#F97316", "#7C3AED", "#06B6D4"],
  count = 4,
  speed = 0.5,
  amplitude = 1,
  waviness = 2.1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  intensity = 0.6,
  opacity = 1,
  scale = 1.5,
  className = "",
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    window.addEventListener("resize", handleResize);

    let t = 0;

    const render = () => {
      t += 0.01 * speed;

      if (!width || !height || width <= 0 || height <= 0) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      try {
        ctx.clearRect(0, 0, width, height);

        // Render strand lines
        for (let i = 0; i < count; i++) {
          const color = colors[i % colors.length] || "#7C3AED";
          const offset = (i - count / 2) * 40 * spread;
          const strandY = height / 2 + offset;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.shadowBlur = glow * 12;
          ctx.shadowColor = color;
          ctx.lineWidth = Math.max(1, thickness * 8);

          // Gradient stroke along strand
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.2, color);
          grad.addColorStop(0.5, colors[(i + 1) % colors.length]);
          grad.addColorStop(0.8, color);
          grad.addColorStop(1, "transparent");

          ctx.strokeStyle = grad;
          ctx.beginPath();

          const points: { x: number; y: number }[] = [];
          const step = 10;
          for (let x = 0; x <= width; x += step) {
            const normX = (x / width) * Math.PI * 2 * waviness;
            const sineVal =
              Math.sin(normX + t + i * 0.8) * 40 * amplitude * scale +
              Math.cos(normX * 0.5 - t * 0.7) * 20 * amplitude * scale;
            const y = strandY + sineVal;
            points.push({ x, y });
          }

          if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let j = 1; j < points.length; j++) {
              ctx.lineTo(points[j].x, points[j].y);
            }
          }
          ctx.stroke();
          ctx.restore();

          // Glowing particle nodes along the strand
          const pCount = 5;
          for (let p = 0; p < pCount; p++) {
            const pxRatio = (Math.sin(t * 0.5 + p + i) + 1) / 2;
            const px = pxRatio * width;
            const normX = (px / width) * Math.PI * 2 * waviness;
            const py =
              strandY +
              Math.sin(normX + t + i * 0.8) * 40 * amplitude * scale +
              Math.cos(normX * 0.5 - t * 0.7) * 20 * amplitude * scale;

            ctx.save();
            ctx.fillStyle = color;
            ctx.shadowBlur = glow * 20;
            ctx.shadowColor = color;
            ctx.globalAlpha = opacity * intensity;
            ctx.beginPath();
            ctx.arc(px, py, (taper + 1) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      } catch (err) {
        console.warn("Strands canvas render frame notice:", err);
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [colors, count, speed, amplitude, waviness, thickness, glow, taper, spread, intensity, opacity, scale]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};

export default Strands;
