"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
};

type Density = "ambient" | "detail";

type Props = {
  density?: Density;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function countForWidth(width: number, density: Density): number {
  if (density === "detail") {
    if (width < 640) return 6;
    if (width < 1024) return 8;
    return 10;
  }
  if (width < 640) return 8;
  if (width < 1024) return 12;
  return 18;
}

export function UltraParticles({ density = "ambient" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface || prefersReducedMotion()) return;
    const canvasEl: HTMLCanvasElement = surface;
    const draw = canvasEl.getContext("2d");
    if (!draw) return;
    const ctx: CanvasRenderingContext2D = draw;

    let frame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let paused = document.hidden;

    function resize() {
      const root = canvasEl.closest("[data-site-theme='ultra']");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(root?.clientWidth || window.innerWidth);
      height = Math.floor(window.innerHeight);
      canvasEl.width = Math.floor(width * dpr);
      canvasEl.height = Math.floor(height * dpr);
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextCount = countForWidth(width, density);
      if (particles.length !== nextCount) {
        particles = Array.from({ length: nextCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.4,
          speedX: (Math.random() - 0.5) * 0.16,
          speedY: (Math.random() - 0.5) * 0.16,
        }));
      }
    }

    function tick() {
      if (!paused) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgba(197, 168, 128, 0.12)";
        for (const particle of particles) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      frame = window.requestAnimationFrame(tick);
    }

    function onVisibility() {
      paused = document.hidden;
    }

    const root = canvasEl.closest("[data-site-theme='ultra']");
    const observer =
      root && "ResizeObserver" in window
        ? new ResizeObserver(() => resize())
        : null;
    if (root) observer?.observe(root);

    resize();
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [density]);

  return (
    <canvas ref={canvasRef} className="ultra-particles" aria-hidden="true" />
  );
}
