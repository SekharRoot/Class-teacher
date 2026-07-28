import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

interface DarkVeilProps {
  className?: string;
  speed?: number;
  hueShift?: number;
}

export const DarkVeil: React.FC<DarkVeilProps> = ({
  className = "",
  speed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Veil control nodes
    const nodes = [
      { x: width * 0.2, y: height * 0.3, vx: 0.4 * speed, vy: 0.3 * speed, radius: width * 0.4 },
      { x: width * 0.8, y: height * 0.7, vx: -0.3 * speed, vy: -0.4 * speed, radius: width * 0.45 },
      { x: width * 0.5, y: height * 0.5, vx: 0.25 * speed, vy: -0.2 * speed, radius: width * 0.35 },
      { x: width * 0.3, y: height * 0.8, vx: -0.2 * speed, vy: 0.35 * speed, radius: width * 0.38 },
    ];

    let t = 0;

    const render = () => {
      t += 0.008 * speed;

      // Base background fill
      if (isDark) {
        ctx.fillStyle = "#0A0D14";
      } else {
        ctx.fillStyle = "#F8FAFC";
      }
      ctx.fillRect(0, 0, width, height);

      // Update node positions with smooth bounce
      nodes.forEach((node, idx) => {
        node.x += Math.sin(t + idx) * 0.8 + node.vx;
        node.y += Math.cos(t * 0.9 + idx) * 0.8 + node.vy;

        if (node.x < -100 || node.x > width + 100) node.vx *= -1;
        if (node.y < -100 || node.y > height + 100) node.vy *= -1;

        // Radial Veil Gradient
        const grad = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius
        );

        if (isDark) {
          // Dark theme colors: Deep violet, dark cyan, glowing indigo
          if (idx % 3 === 0) {
            grad.addColorStop(0, "rgba(99, 102, 241, 0.22)"); // Indigo
            grad.addColorStop(0.5, "rgba(79, 70, 229, 0.08)");
            grad.addColorStop(1, "rgba(10, 13, 20, 0)");
          } else if (idx % 3 === 1) {
            grad.addColorStop(0, "rgba(168, 85, 247, 0.20)"); // Purple
            grad.addColorStop(0.6, "rgba(147, 51, 234, 0.06)");
            grad.addColorStop(1, "rgba(10, 13, 20, 0)");
          } else {
            grad.addColorStop(0, "rgba(14, 165, 233, 0.18)"); // Sky Blue
            grad.addColorStop(0.5, "rgba(56, 189, 248, 0.05)");
            grad.addColorStop(1, "rgba(10, 13, 20, 0)");
          }
        } else {
          // Light theme colors: Soft lavender, sky mist, warm rose tint
          if (idx % 3 === 0) {
            grad.addColorStop(0, "rgba(129, 140, 248, 0.28)"); // Light Indigo
            grad.addColorStop(0.5, "rgba(199, 210, 254, 0.12)");
            grad.addColorStop(1, "rgba(248, 250, 252, 0)");
          } else if (idx % 3 === 1) {
            grad.addColorStop(0, "rgba(192, 132, 252, 0.24)"); // Soft Purple
            grad.addColorStop(0.6, "rgba(233, 213, 255, 0.10)");
            grad.addColorStop(1, "rgba(248, 250, 252, 0)");
          } else {
            grad.addColorStop(0, "rgba(56, 189, 248, 0.22)"); // Sky Blue
            grad.addColorStop(0.5, "rgba(186, 230, 253, 0.08)");
            grad.addColorStop(1, "rgba(248, 250, 252, 0)");
          }
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render subtle flowing veil sine wave overlay
      ctx.lineWidth = 1.5;
      const waveCount = 4;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        if (isDark) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 - i * 0.005})`;
        } else {
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 - i * 0.01})`;
        }

        for (let x = 0; x <= width; x += 20) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.003 + t + i) * 60 +
            Math.cos(x * 0.002 - t * 0.5) * 40;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default DarkVeil;
