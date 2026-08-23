"use client";

import { useEffect, useRef } from "react";

interface BarChartProps {
  pending: number;
  published: number;
  autoCount: number;
  todayCount: number;
  isDark: boolean;
}

export default function BarChart({
  pending,
  published,
  autoCount,
  todayCount,
  isDark,
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const chartText2 = style.getPropertyValue("--chart-text2").trim() || "#666666";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 300,
      H = 140;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const bars = [
      { label: "Pending", value: pending, color: "#8b1a2b" },
      { label: "Published", value: published, color: "#16a34a" },
      { label: "Auto", value: autoCount, color: "#2563eb" },
      { label: "Today", value: todayCount, color: "#d97706" },
    ];

    const maxVal = Math.max(...bars.map((b) => b.value), 1);
    const padL = 30,
      padR = 10,
      padT = 10,
      padB = 28;
    const chartW = W - padL - padR,
      chartH = H - padT - padB;
    const barW = (chartW / bars.length) * 0.5;
    const gap = chartW / bars.length;

    for (let i = 0; i <= 4; i++) {
      const y = padT + chartH * (1 - i / 4);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = chartText2;
      ctx.font = "9px Inter,sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(Math.round((maxVal * i) / 4)), padL - 4, y + 3);
    }

    bars.forEach((b, i) => {
      const x = padL + gap * i + (gap - barW) / 2;
      const bH = b.value > 0 ? (b.value / maxVal) * chartH : 0;
      const y = padT + chartH - bH;
      const grad = ctx.createLinearGradient(0, y, 0, padT + chartH);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, b.color + "44");
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barW, bH, 4);
      } else {
        ctx.rect(x, y, barW, bH);
      }
      ctx.fill();
      ctx.fillStyle = chartText2;
      ctx.font = "10px Inter,sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(b.label, x + barW / 2, H - 8);
      if (b.value > 0) {
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Inter,sans-serif";
        ctx.fillText(String(b.value), x + barW / 2, y - 4);
      }
    });
  }, [pending, published, autoCount, todayCount, isDark]);

  return <canvas ref={canvasRef} height={140} className="w-full" />;
}
