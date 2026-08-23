"use client";

import { useEffect, useRef } from "react";

export const CHART_COLORS = ["#8b1a2b", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2"];

interface DonutChartProps {
  sites: [string, number][];
  isDark: boolean;
}

export default function DonutChart({ sites, isDark }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const chartBorder = style.getPropertyValue("--chart-border").trim() || "#d8d8e0";
    const chartSurface = style.getPropertyValue("--chart-surface").trim() || "#ffffff";
    const chartText = style.getPropertyValue("--chart-text").trim() || "#111111";
    const chartText2 = style.getPropertyValue("--chart-text2").trim() || "#666666";

    const dpr = window.devicePixelRatio || 1;
    const W = 140,
      H = 140,
      cx = W / 2,
      cy = H / 2,
      R = Math.min(W, H) / 2 - 8,
      r = R * 0.55;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const total = sites.reduce((s, [, c]) => s + c, 0) || 1;
    let angle = -Math.PI / 2;

    if (sites.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = chartBorder;
      ctx.lineWidth = 16;
      ctx.stroke();
    } else {
      sites.forEach(([, count], i) => {
        const slice = (count / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
        ctx.fill();
        angle += slice;
      });
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = chartSurface;
      ctx.fill();
    }

    ctx.fillStyle = chartText;
    ctx.font = "bold 18px Inter,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(total), cx, cy - 6);
    ctx.font = "10px Inter,sans-serif";
    ctx.fillStyle = chartText2;
    ctx.fillText("pending", cx, cy + 10);
  }, [sites, isDark]);

  return (
    <div className="flex items-center gap-5">
      <canvas ref={canvasRef} width={140} height={140} className="shrink-0" />
      <div className="flex flex-1 flex-col gap-1.5 text-[11px]">
        {sites.slice(0, 5).map(([name, count], i) => (
          <div key={name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span
              className="max-w-[100px] truncate text-neutral-600 dark:text-neutral-400"
              title={name}
            >
              {name}
            </span>
            <span className="ml-auto font-semibold text-neutral-500 dark:text-neutral-400">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
