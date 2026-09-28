import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Atom,
  Dna,
  Beaker,
  Sparkles,
  Zap,
  Activity,
  Flame,
  RotateCcw,
  Sliders,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { LabType } from "../../types/science";

interface ScienceLabHeroAnimationProps {
  onSelectLab?: (lab: LabType) => void;
}

type Mode = "convergence" | "atomic" | "genetics" | "reaction";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: "spark" | "bubble" | "electron" | "glow" | "photon";
}

interface FloatingMolecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  formula: string;
  color: string;
  angle: number;
  vAngle: number;
  size: number;
}

export function ScienceLabHeroAnimation({ onSelectLab }: ScienceLabHeroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeMode, setActiveMode] = useState<Mode>("convergence");
  const [reactionEnergy, setReactionEnergy] = useState<number>(1.2); // 0.5 to 2.5
  const [isExcited, setIsExcited] = useState<boolean>(false);
  const isExcitedRef = useRef<boolean>(false);
  isExcitedRef.current = isExcited;
  const [hoveredLab, setHoveredLab] = useState<LabType | null>(null);

  // Live telemetry metrics that fluctuate slightly
  const [metrics, setMetrics] = useState({
    temperature: 298.15,
    pressure: 101.3,
    reactionFlux: 0.88,
    activeIons: 42,
  });

  // Track mouse coordinates relative to canvas
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Shockwave burst trigger
  const shockwave = useRef<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: 180,
    active: false,
  });

  // Trigger burst of energy
  const triggerCatalystBurst = useCallback((e?: React.MouseEvent) => {
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 1200);

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e
        ? e.clientX - rect.left
        : canvas.width / (2 * (window.devicePixelRatio || 1));
      const clickY = e
        ? e.clientY - rect.top
        : canvas.height / (2 * (window.devicePixelRatio || 1));

      shockwave.current = {
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 260,
        active: true,
      };
    }

    setMetrics((prev) => ({
      ...prev,
      temperature: +(prev.temperature + (Math.random() * 8 + 4)).toFixed(2),
      reactionFlux: +(prev.reactionFlux + 0.45).toFixed(2),
      activeIons: prev.activeIons + 16,
    }));
  }, []);

  // Update live telemetry gradually
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        temperature: +(294 + Math.sin(Date.now() / 3000) * 3 + (isExcited ? 8 : 0)).toFixed(2),
        pressure: +(101.1 + Math.cos(Date.now() / 4000) * 0.4).toFixed(1),
        reactionFlux: +(
          (0.75 + Math.sin(Date.now() / 1500) * 0.2) *
          reactionEnergy *
          (isExcited ? 1.6 : 1)
        ).toFixed(2),
        activeIons: Math.floor(38 + Math.sin(Date.now() / 2500) * 8 + (isExcited ? 25 : 0)),
      }));
    }, 400);

    return () => clearInterval(timer);
  }, [reactionEnergy, isExcited]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // High DPI scaling
    const updateSize = () => {
      if (!containerRef.current || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = containerRef.current.clientWidth;
      const height = Math.max(380, Math.min(520, window.innerHeight * 0.52));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Particle pool
    const particles: Particle[] = [];
    const maxParticles = 90;

    // Molecular compound tags floating around
    const compounds: FloatingMolecule[] = [
      {
        x: 120,
        y: 110,
        vx: 0.25,
        vy: -0.15,
        label: "Water",
        formula: "H₂O",
        color: "#38bdf8",
        angle: 0,
        vAngle: 0.008,
        size: 28,
      },
      {
        x: 780,
        y: 130,
        vx: -0.2,
        vy: 0.18,
        label: "Sodium Chloride",
        formula: "NaCl",
        color: "#34d399",
        angle: 1.2,
        vAngle: -0.006,
        size: 30,
      },
      {
        x: 180,
        y: 320,
        vx: 0.18,
        vy: 0.22,
        label: "Carbon Dioxide",
        formula: "CO₂",
        color: "#a78bfa",
        angle: 2.1,
        vAngle: 0.005,
        size: 26,
      },
      {
        x: 740,
        y: 340,
        vx: -0.22,
        vy: -0.12,
        label: "Hydrochloric Acid",
        formula: "HCl",
        color: "#fbbf24",
        angle: 0.8,
        vAngle: -0.007,
        size: 28,
      },
    ];

    // Main render loop
    const render = () => {
      time += 0.016 * reactionEnergy;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // 1. BACKGROUND GRID & LABORATORY RETICLE
      ctx.save();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.07)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // High-tech circular radar range guides in background
      const centerX = width * 0.5;
      const centerY = height * 0.52;

      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 110, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, 190, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 2. SHOCKWAVE EXPANSION (from catalyst burst or click)
      if (shockwave.current.active) {
        ctx.save();
        shockwave.current.radius += 6 * reactionEnergy;
        const alpha = Math.max(0, 1 - shockwave.current.radius / shockwave.current.maxRadius);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.85})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(shockwave.current.x, shockwave.current.y, shockwave.current.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(
          shockwave.current.x,
          shockwave.current.y,
          Math.max(0, shockwave.current.radius - 20),
          0,
          Math.PI * 2,
        );
        ctx.stroke();

        if (shockwave.current.radius >= shockwave.current.maxRadius) {
          shockwave.current.active = false;
        }
        ctx.restore();
      }

      // 3. SEISMIC / NATURAL DISASTER WAVEFORMS (Bottom geophysics field)
      if (activeMode === "convergence") {
        ctx.save();
        const waveY = height - 36;
        ctx.lineWidth = 2;

        // P-Wave (Primary compressional seismic wave)
        ctx.beginPath();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
        for (let x = 0; x < width; x += 4) {
          const y = waveY + Math.sin(x * 0.02 + time * 3) * 12 * Math.sin(x * 0.005);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // S-Wave (Secondary transverse wave)
        ctx.beginPath();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.28)";
        for (let x = 0; x < width; x += 4) {
          const y = waveY + 8 + Math.cos(x * 0.035 - time * 2.2) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Waveform label
        ctx.fillStyle = "rgba(245, 158, 11, 0.7)";
        ctx.font = "9px monospace";
        ctx.fillText("GEOPHYSICAL SEISMIC TELEMETRY [P & S WAVES]", 24, height - 14);
        ctx.restore();
      }

      // 4. CHEMICAL REACTION FLASK & BUBBLES (Left Side or Focused)
      if (activeMode === "convergence" || activeMode === "reaction") {
        const flaskX = activeMode === "reaction" ? width * 0.5 : width * 0.2;
        const flaskY = activeMode === "reaction" ? height * 0.54 : height * 0.52;
        const flaskScale = activeMode === "reaction" ? 1.4 : 1.0;

        ctx.save();
        ctx.translate(flaskX, flaskY);
        ctx.scale(flaskScale, flaskScale);

        // Heat mantle glow under flask
        const heatGlow = ctx.createRadialGradient(0, 75, 4, 0, 75, 55);
        heatGlow.addColorStop(
          0,
          isExcitedRef.current ? "rgba(239, 68, 68, 0.7)" : "rgba(245, 158, 11, 0.45)",
        );
        heatGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = heatGlow;
        ctx.beginPath();
        ctx.arc(0, 75, 55, 0, Math.PI * 2);
        ctx.fill();

        // Erlenmeyer Flask Glass Contour
        ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";

        // Flask Liquid Gradient
        const liquidGradient = ctx.createLinearGradient(0, 10, 0, 70);
        liquidGradient.addColorStop(0, "rgba(16, 185, 129, 0.55)");
        liquidGradient.addColorStop(0.5, "rgba(5, 150, 105, 0.7)");
        liquidGradient.addColorStop(1, "rgba(4, 120, 87, 0.85)");

        // Liquid inside flask
        const liquidLevel = 18 + Math.sin(time * 2) * 3;
        ctx.beginPath();
        // Flask body: neck down to triangular base
        ctx.moveTo(-16, liquidLevel);
        ctx.lineTo(-58, 68);
        ctx.quadraticCurveTo(-60, 74, -50, 74);
        ctx.lineTo(50, 74);
        ctx.quadraticCurveTo(60, 74, 58, 68);
        ctx.lineTo(16, liquidLevel);
        // Meniscus surface curve
        ctx.quadraticCurveTo(0, liquidLevel + 4, -16, liquidLevel);
        ctx.closePath();
        ctx.fillStyle = liquidGradient;
        ctx.fill();

        // Flask Outer Glass Outline
        ctx.beginPath();
        // Rim
        ctx.moveTo(-18, -48);
        ctx.lineTo(18, -48);
        ctx.lineTo(18, -44);
        ctx.lineTo(12, -44);
        // Neck
        ctx.lineTo(12, 10);
        // Base slope
        ctx.lineTo(58, 68);
        ctx.quadraticCurveTo(64, 76, 50, 76);
        ctx.lineTo(-50, 76);
        ctx.quadraticCurveTo(-64, 76, -58, 68);
        ctx.lineTo(-12, 10);
        ctx.lineTo(-12, -44);
        ctx.lineTo(-18, -44);
        ctx.closePath();
        ctx.stroke();

        // Glass highlight reflection line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-44, 66);
        ctx.lineTo(-10, 16);
        ctx.stroke();

        // Graduation measurement markings on flask
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        [-20, 0, 20, 40].forEach((gradY) => {
          if (gradY > liquidLevel - 15) {
            ctx.beginPath();
            ctx.moveTo(14, gradY);
            ctx.lineTo(26, gradY);
            ctx.stroke();
          }
        });

        // Spawn Effervescent Bubbles inside the flask
        if (Math.random() < 0.35 * reactionEnergy) {
          particles.push({
            x: flaskX + (Math.random() * 60 - 30) * flaskScale,
            y: flaskY + (60 - Math.random() * 15) * flaskScale,
            vx: (Math.random() - 0.5) * 0.7,
            vy: -(Math.random() * 1.8 + 1.2) * reactionEnergy,
            radius: Math.random() * 3 + 1.5,
            color: Math.random() > 0.4 ? "#34d399" : "#6ee7b7",
            alpha: 0.9,
            life: 0,
            maxLife: 45,
            type: "bubble",
          });
        }

        // Label above flask
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("⚗️ EXOTHERMIC CHAMBER", 0, -56);
        ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
        ctx.font = "9px monospace";
        ctx.fillText("ΔH < 0 • ACTIVATED", 0, -68);

        ctx.restore();
      }

      // 5. ATOMIC NUCLEUS & ELECTRON ORBITALS (Center Stage)
      if (activeMode === "convergence" || activeMode === "atomic") {
        const atomX = activeMode === "atomic" ? width * 0.5 : width * 0.5;
        const atomY = activeMode === "atomic" ? height * 0.52 : height * 0.52;
        const atomScale = activeMode === "atomic" ? 1.45 : 1.0;

        ctx.save();
        ctx.translate(atomX, atomY);
        ctx.scale(atomScale, atomScale);

        // Core Quantum Glow
        const coreGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 70);
        coreGlow.addColorStop(0, "rgba(56, 189, 248, 0.95)");
        coreGlow.addColorStop(0.3, "rgba(59, 130, 246, 0.55)");
        coreGlow.addColorStop(0.7, "rgba(147, 51, 234, 0.2)");
        coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 70, 0, Math.PI * 2);
        ctx.fill();

        // Central Dense Nucleus (Protons & Neutrons clump)
        const nucleons = [
          { dx: 0, dy: 0, color: "#38bdf8" }, // Proton
          { dx: -6, dy: -5, color: "#f43f5e" }, // Neutron
          { dx: 6, dy: -4, color: "#38bdf8" }, // Proton
          { dx: -5, dy: 6, color: "#f43f5e" }, // Neutron
          { dx: 5, dy: 5, color: "#38bdf8" }, // Proton
          { dx: 0, dy: 7, color: "#f43f5e" }, // Neutron
          { dx: 0, dy: -7, color: "#38bdf8" }, // Proton
        ];

        nucleons.forEach((n, idx) => {
          const wobble = Math.sin(time * 4 + idx) * 1.5;
          ctx.beginPath();
          ctx.arc(n.dx + wobble, n.dy + wobble, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 3 Elliptical Orbitals inclined at 0°, 60°, 120°
        const orbitals = [
          { tilt: 0, radiusX: 95, radiusY: 34, speed: 2.2, color: "#38bdf8" },
          { tilt: Math.PI / 3, radiusX: 95, radiusY: 34, speed: -1.9, color: "#818cf8" },
          { tilt: (2 * Math.PI) / 3, radiusX: 95, radiusY: 34, speed: 2.5, color: "#c084fc" },
        ];

        orbitals.forEach((orb, idx) => {
          ctx.save();
          ctx.rotate(orb.tilt);

          // Draw orbital ring
          ctx.beginPath();
          ctx.ellipse(0, 0, orb.radiusX, orb.radiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.28 + Math.sin(time + idx) * 0.1})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Electron moving along the orbital
          const electronAngle = time * orb.speed;
          const elX = Math.cos(electronAngle) * orb.radiusX;
          const elY = Math.sin(electronAngle) * orb.radiusY;

          // Electron glow
          ctx.beginPath();
          ctx.arc(elX, elY, 4, 0, Math.PI * 2);
          ctx.fillStyle = orb.color;
          ctx.shadowColor = orb.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Spark particle from electron
          if (Math.random() < 0.25 * reactionEnergy) {
            // Transform local point to canvas coordinate space
            const cosT = Math.cos(orb.tilt);
            const sinT = Math.sin(orb.tilt);
            const globalX = atomX + (elX * cosT - elY * sinT) * atomScale;
            const globalY = atomY + (elX * sinT + elY * cosT) * atomScale;

            particles.push({
              x: globalX,
              y: globalY,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              radius: Math.random() * 2 + 1,
              color: orb.color,
              alpha: 0.8,
              life: 0,
              maxLife: 30,
              type: "electron",
            });
          }

          ctx.restore();
        });

        // Atomic HUD label
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("⚛️ ATOMIC CORE [C-12]", 0, 68);
        ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
        ctx.font = "9px monospace";
        ctx.fillText("6p⁺ + 6n⁰ • 6e⁻ ORBITALS", 0, 80);

        ctx.restore();
      }

      // 6. DNA DOUBLE HELIX (Right Side or Focused)
      if (activeMode === "convergence" || activeMode === "genetics") {
        const dnaX = activeMode === "genetics" ? width * 0.5 : width * 0.8;
        const dnaY = activeMode === "genetics" ? height * 0.52 : height * 0.52;
        const dnaScale = activeMode === "genetics" ? 1.4 : 1.0;

        ctx.save();
        ctx.translate(dnaX, dnaY);
        ctx.scale(dnaScale, dnaScale);

        const strandHeight = 160;
        const numRungs = 16;
        const rungSpacing = strandHeight / numRungs;
        const amplitude = 38;

        const basePairs = [
          { nameA: "A", nameB: "T", colA: "#06b6d4", colB: "#f59e0b" }, // Adenine - Thymine
          { nameA: "G", nameB: "C", colA: "#10b981", colB: "#a855f7" }, // Guanine - Cytosine
          { nameA: "T", nameB: "A", colA: "#f59e0b", colB: "#06b6d4" },
          { nameA: "C", nameB: "G", colA: "#a855f7", colB: "#10b981" },
        ];

        // Draw 3D DNA Helix with depth shading
        for (let i = 0; i <= numRungs; i++) {
          const y = -strandHeight / 2 + i * rungSpacing;
          const phase = i * 0.42 + time * 1.8;
          const sinVal = Math.sin(phase);
          const cosVal = Math.cos(phase); // Z-depth

          const x1 = sinVal * amplitude;
          const x2 = -sinVal * amplitude;

          const bp = basePairs[i % basePairs.length];

          // Depth perspective: nodes in front (cosVal > 0) are brighter/larger
          const zDepth1 = (cosVal + 1) * 0.5; // 0 to 1
          const zDepth2 = (-cosVal + 1) * 0.5;

          // Hydrogen bond rung connecting strands
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(0, y);
          ctx.strokeStyle = bp.colA;
          ctx.lineWidth = 2 * (0.6 + zDepth1 * 0.6);
          ctx.globalAlpha = 0.4 + zDepth1 * 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = bp.colB;
          ctx.lineWidth = 2 * (0.6 + zDepth2 * 0.6);
          ctx.globalAlpha = 0.4 + zDepth2 * 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Strand 1 Backbone Node
          ctx.beginPath();
          ctx.arc(x1, y, 3 + zDepth1 * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = bp.colA;
          ctx.shadowColor = bp.colA;
          ctx.shadowBlur = 6 * zDepth1;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Strand 2 Backbone Node
          ctx.beginPath();
          ctx.arc(x2, y, 3 + zDepth2 * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = bp.colB;
          ctx.shadowColor = bp.colB;
          ctx.shadowBlur = 6 * zDepth2;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Genetic HUD Label
        ctx.fillStyle = "#c084fc";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("🧬 GENOME DOUBLE HELIX", 0, 96);
        ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
        ctx.font = "9px monospace";
        ctx.fillText("BASE PAIRS: A-T • G-C", 0, 108);

        ctx.restore();
      }

      // 7. FLOATING MOLECULES & PARTICLES
      compounds.forEach((mol) => {
        mol.x += mol.vx * reactionEnergy;
        mol.y += mol.vy * reactionEnergy;
        mol.angle += mol.vAngle * reactionEnergy;

        // Bounce inside boundaries
        if (mol.x < 60 || mol.x > width - 60) mol.vx *= -1;
        if (mol.y < 50 || mol.y > height - 60) mol.vy *= -1;

        ctx.save();
        ctx.translate(mol.x, mol.y);
        ctx.rotate(mol.angle);

        // Molecular badge bubble
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = mol.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-28, -14, 56, 28, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(mol.formula, 0, -1);

        ctx.restore();
      });

      // 8. UPDATE AND DRAW GENERAL PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - lifeRatio);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // 9. MOUSE INTERACTION / QUANTUM PROBE LASER
      if (mousePos.current.active) {
        ctx.save();
        const mx = mousePos.current.x;
        const my = mousePos.current.y;

        // Draw crosshair probe
        ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 14, 0, Math.PI * 2);
        ctx.moveTo(mx - 20, my);
        ctx.lineTo(mx + 20, my);
        ctx.moveTo(mx, my - 20);
        ctx.lineTo(mx, my + 20);
        ctx.stroke();

        // Laser probe emission to atom center
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Interactive particle attraction
        if (Math.random() < 0.4) {
          particles.push({
            x: mx + (Math.random() * 20 - 10),
            y: my + (Math.random() * 20 - 10),
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 2.5 + 1,
            color: "#38bdf8",
            alpha: 0.9,
            life: 0,
            maxLife: 25,
            type: "photon",
          });
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
    };
  }, [activeMode, reactionEnergy]);

  // Handle Mouse Events for interactivity
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y, active: true };

    // Detect if hovering over specific lab zones
    const width = rect.width;
    if (x < width * 0.35) {
      setHoveredLab("chemistry");
    } else if (x > width * 0.65) {
      setHoveredLab("genetics");
    } else {
      setHoveredLab(null);
    }
  };

  const handleMouseLeave = () => {
    mousePos.current.active = false;
    setHoveredLab(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    triggerCatalystBurst(e);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950 text-white shadow-2xl transition-all"
    >
      {/* Top Laboratory Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2.5 backdrop-blur-md text-xs font-mono text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white tracking-wider">LAB SIMULATOR v2.4</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
            <span>
              TEMP: <span className="text-amber-400 font-semibold">{metrics.temperature} K</span>
            </span>
            <span>
              FLUX:{" "}
              <span className="text-cyan-400 font-semibold">{metrics.reactionFlux} mol/L·s</span>
            </span>
            <span>
              ACTIVE PARTICLES:{" "}
              <span className="text-emerald-400 font-semibold">{metrics.activeIons}</span>
            </span>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveMode("convergence")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === "convergence"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Fields
          </button>
          <button
            onClick={() => setActiveMode("atomic")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === "atomic"
                ? "bg-cyan-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Atom Core
          </button>
          <button
            onClick={() => setActiveMode("genetics")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === "genetics"
                ? "bg-purple-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            DNA Helix
          </button>
          <button
            onClick={() => setActiveMode("reaction")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === "reaction"
                ? "bg-emerald-600 text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Reaction Flask
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative w-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className="block w-full h-auto"
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-36 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Interactive Overlay Tooltip for hover zones */}
        {hoveredLab && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>
                {hoveredLab === "chemistry" && "Chemical Reactions: Click or select module below"}
                {hoveredLab === "genetics" && "DNA & Genetics: Click or select module below"}
              </span>
            </div>
          </div>
        )}

        {/* Canvas HUD Overlay Instructions */}
        <div className="absolute bottom-3 left-4 pointer-events-none hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/80 backdrop-blur-sm">
          <span className="flex items-center gap-1 text-cyan-400">
            <Zap className="h-3 w-3" />
            <span>Click canvas to inject Catalyst Energy</span>
          </span>
          <span>•</span>
          <span>Move mouse to direct Quantum Sensor</span>
        </div>

        {/* Catalyst Burst Excitation Indicator */}
        {isExcited && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in fade-in zoom-in-75 duration-300">
            <div className="rounded-2xl border border-cyan-400/60 bg-cyan-950/80 px-6 py-2.5 text-center text-xs font-bold tracking-widest text-cyan-300 shadow-2xl backdrop-blur-md">
              ⚡ REACTION CATALYST INJECTED • ENERGY SURGE ⚡
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interactive Controls Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/90 p-4 sm:px-6">
        {/* Left: Reaction Velocity Scrubber */}
        <div className="flex items-center gap-3">
          <Flame
            className={`h-4 w-4 ${reactionEnergy > 1.5 ? "text-amber-400 animate-pulse" : "text-slate-400"}`}
          />
          <span className="text-xs font-semibold text-slate-300">Reaction Rate:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={reactionEnergy}
              onChange={(e) => setReactionEnergy(parseFloat(e.target.value))}
              className="h-1.5 w-24 sm:w-32 accent-cyan-400 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-xs text-cyan-300 w-10">
              {reactionEnergy.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerCatalystBurst()}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Add Catalyst</span>
          </button>

          <button
            onClick={() => {
              setReactionEnergy(1.0);
              setActiveMode("convergence");
            }}
            title="Reset Simulation Rate"
            className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Right: Quick Module Jump Shortcuts */}
        {onSelectLab && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden lg:inline">Direct Launch:</span>
            <button
              onClick={() => onSelectLab("chemistry")}
              className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-all"
            >
              <Beaker className="h-3 w-3 text-emerald-400" />
              <span>Chemical</span>
            </button>
            <button
              onClick={() => onSelectLab("genetics")}
              className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-900/60 transition-all"
            >
              <Dna className="h-3 w-3 text-purple-400" />
              <span>DNA</span>
            </button>
            <button
              onClick={() => onSelectLab("disasters")}
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-900/60 transition-all"
            >
              <Activity className="h-3 w-3 text-amber-400" />
              <span>Disasters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
