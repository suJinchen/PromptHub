"use client";

import { useEffect, useRef } from "react";

export function ParticleWaveHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl!.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };
    const particles: Array<{ x: number; y: number; baseX: number; phase: number; speed: number; size: number; color: string; depth: number }> = [];

    function resize() {
      const rect = canvasEl!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvasEl!.width = Math.max(1, Math.floor(width * dpr));
      canvasEl!.height = Math.max(1, Math.floor(height * dpr));
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      const count = width < 640 ? 240 : 560;
      const palette = ["rgba(124,58,237,.52)", "rgba(99,102,241,.42)", "rgba(56,189,248,.38)", "rgba(236,72,153,.34)", "rgba(255,255,255,.86)"];
      for (let index = 0; index < count; index += 1) {
        const baseX = Math.random() * width;
        particles.push({ x: baseX, y: height * 0.48 + Math.sin(baseX * 0.012) * 58 + (Math.random() - 0.5) * 150, baseX, phase: Math.random() * Math.PI * 2, speed: 0.002 + Math.random() * 0.004, size: 0.7 + Math.random() * 2.4, color: palette[Math.floor(Math.random() * palette.length)], depth: 0.35 + Math.random() * 0.9 });
      }
    }

    function render(time: number) {
      context!.clearRect(0, 0, width, height);
      const gradient = context!.createLinearGradient(0, height * 0.25, width, height * 0.75);
      gradient.addColorStop(0, "rgba(139,92,246,.10)");
      gradient.addColorStop(0.45, "rgba(56,189,248,.09)");
      gradient.addColorStop(1, "rgba(236,72,153,.10)");
      context!.fillStyle = gradient;
      context!.beginPath();
      context!.ellipse(width * 0.52, height * 0.57, width * 0.52, height * 0.18, -0.12, 0, Math.PI * 2);
      context!.fill();

      for (const particle of particles) {
        const wave = Math.sin(particle.baseX * 0.012 + time * particle.speed + particle.phase) * 82;
        const drift = Math.cos(time * particle.speed * 0.9 + particle.phase) * 24;
        let x = particle.baseX + drift;
        let y = height * 0.52 + wave + Math.sin(particle.baseX * 0.006 + time * 0.001) * 28;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          x += dx * force * 0.18;
          y += dy * force * 0.18;
        }
        context!.beginPath();
        context!.fillStyle = particle.color;
        context!.shadowColor = particle.color;
        context!.shadowBlur = 8 * particle.depth;
        context!.arc(x, y, particle.size * particle.depth, 0, Math.PI * 2);
        context!.fill();
      }
      context!.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    }

    resize();
    raf = requestAnimationFrame(render);
    const onMove = (event: PointerEvent) => { const rect = canvasEl!.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    window.addEventListener("resize", resize);
    canvasEl!.addEventListener("pointermove", onMove);
    canvasEl!.addEventListener("pointerleave", onLeave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); canvasEl!.removeEventListener("pointermove", onMove); canvasEl!.removeEventListener("pointerleave", onLeave); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-auto absolute inset-0 h-full w-full opacity-90" aria-hidden="true" />;
}


