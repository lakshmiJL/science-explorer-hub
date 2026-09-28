import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChemicalReaction } from "../../types/science";
import { Play, Pause, RotateCcw, Zap, Sparkles, Eye, Info, CheckCircle2 } from "lucide-react";

interface ChemicalBondingSimulatorProps {
  reaction: ChemicalReaction;
  onClose?: () => void;
}

interface SimulatedAtom {
  id: string;
  symbol: string;
  name: string;
  color: string;
  radius: number;
  valenceElectrons: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  charge: number; // e.g. +1, -1, 0
  reactingGroup: "reactant" | "intermediate" | "product";
}

interface SimulatedBond {
  fromId: string;
  toId: string;
  type: "covalent-single" | "covalent-double" | "ionic" | "breaking";
  strength: number; // 0 to 1
  color: string;
}

const STEP_LABELS = [
  { step: 1, title: "1. Reactant Molecules", desc: "Intact starting molecules approaching" },
  { step: 2, title: "2. Molecular Collision", desc: "Activation energy severs existing bonds" },
  {
    step: 3,
    title: "3. Electron Overlap",
    desc: "Electrons transfer or share in valence shells",
  },
  { step: 4, title: "4. New Bonds Formed", desc: "Stable product molecules with new bonds" },
];

export const ChemicalBondingSimulator: React.FC<ChemicalBondingSimulatorProps> = ({
  reaction,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animation timeline state: 0 (reactants) -> 1 (collision) -> 2 (electron exchange) -> 3 (products bonded)
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;
  const progressRef = useRef(animationProgress);
  progressRef.current = animationProgress;
  const selectedAtomIdRef = useRef(selectedAtomId);
  selectedAtomIdRef.current = selectedAtomId;

  // Active step name
  const currentStep =
    animationProgress < 0.28 ? 1 : animationProgress < 0.58 ? 2 : animationProgress < 0.88 ? 3 : 4;

  // Configure atoms based on reaction
  const getAtomsForReaction = useCallback((): {
    atoms: SimulatedAtom[];
    bondsInitial: SimulatedBond[];
    bondsFinal: SimulatedBond[];
  } => {
    switch (reaction.id) {
      case "acid-base-neutralization": // HCl + NaOH -> NaCl + H2O
        return {
          atoms: [
            // H from HCl
            {
              id: "h1",
              symbol: "H",
              name: "Hydrogen",
              color: "#e2e8f0",
              radius: 14,
              valenceElectrons: 1,
              currentX: 180,
              currentY: 150,
              targetX: 470,
              targetY: 195,
              charge: 0,
              reactingGroup: "reactant",
            },
            // Cl from HCl
            {
              id: "cl1",
              symbol: "Cl",
              name: "Chlorine",
              color: "#22c55e",
              radius: 24,
              valenceElectrons: 7,
              currentX: 250,
              currentY: 150,
              targetX: 280,
              targetY: 260,
              charge: 0,
              reactingGroup: "reactant",
            },
            // Na from NaOH
            {
              id: "na1",
              symbol: "Na",
              name: "Sodium",
              color: "#a855f7",
              radius: 26,
              valenceElectrons: 1,
              currentX: 520,
              currentY: 150,
              targetX: 210,
              targetY: 260,
              charge: 0,
              reactingGroup: "reactant",
            },
            // O from NaOH
            {
              id: "o1",
              symbol: "O",
              name: "Oxygen",
              color: "#ef4444",
              radius: 20,
              valenceElectrons: 6,
              currentX: 590,
              currentY: 150,
              targetX: 520,
              targetY: 210,
              charge: 0,
              reactingGroup: "reactant",
            },
            // H from NaOH
            {
              id: "h2",
              symbol: "H",
              name: "Hydrogen",
              color: "#e2e8f0",
              radius: 14,
              valenceElectrons: 1,
              currentX: 640,
              currentY: 150,
              targetX: 560,
              targetY: 180,
              charge: 0,
              reactingGroup: "reactant",
            },
          ],
          bondsInitial: [
            { fromId: "h1", toId: "cl1", type: "covalent-single", strength: 1, color: "#38bdf8" },
            { fromId: "na1", toId: "o1", type: "ionic", strength: 1, color: "#c084fc" },
            { fromId: "o1", toId: "h2", type: "covalent-single", strength: 1, color: "#f87171" },
          ],
          bondsFinal: [
            // NaCl ionic bond
            { fromId: "na1", toId: "cl1", type: "ionic", strength: 1, color: "#a855f7" },
            // H2O covalent bonds (bent angle)
            { fromId: "h1", toId: "o1", type: "covalent-single", strength: 1, color: "#38bdf8" },
            { fromId: "h2", toId: "o1", type: "covalent-single", strength: 1, color: "#38bdf8" },
          ],
        };

      case "iron-oxidation": // 4Fe + 3O2 -> 2Fe2O3
        return {
          atoms: [
            {
              id: "fe1",
              symbol: "Fe",
              name: "Iron",
              color: "#94a3b8",
              radius: 24,
              valenceElectrons: 2,
              currentX: 200,
              currentY: 150,
              targetX: 330,
              targetY: 220,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "fe2",
              symbol: "Fe",
              name: "Iron",
              color: "#94a3b8",
              radius: 24,
              valenceElectrons: 2,
              currentX: 200,
              currentY: 250,
              targetX: 470,
              targetY: 220,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "o1",
              symbol: "O",
              name: "Oxygen",
              color: "#ef4444",
              radius: 20,
              valenceElectrons: 6,
              currentX: 580,
              currentY: 140,
              targetX: 400,
              targetY: 170,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "o2",
              symbol: "O",
              name: "Oxygen",
              color: "#ef4444",
              radius: 20,
              valenceElectrons: 6,
              currentX: 630,
              currentY: 140,
              targetX: 330,
              targetY: 290,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "o3",
              symbol: "O",
              name: "Oxygen",
              color: "#ef4444",
              radius: 20,
              valenceElectrons: 6,
              currentX: 600,
              currentY: 250,
              targetX: 470,
              targetY: 290,
              charge: 0,
              reactingGroup: "reactant",
            },
          ],
          bondsInitial: [
            { fromId: "o1", toId: "o2", type: "covalent-double", strength: 1, color: "#ef4444" },
          ],
          bondsFinal: [
            { fromId: "fe1", toId: "o1", type: "ionic", strength: 1, color: "#f97316" },
            { fromId: "fe2", toId: "o1", type: "ionic", strength: 1, color: "#f97316" },
            { fromId: "fe1", toId: "o2", type: "ionic", strength: 1, color: "#f97316" },
            { fromId: "fe2", toId: "o3", type: "ionic", strength: 1, color: "#f97316" },
          ],
        };

      case "hydrogen-combustion": // 2H2 + O2 -> 2H2O
      default:
        return {
          atoms: [
            // H2 Molecule 1
            {
              id: "h1",
              symbol: "H",
              name: "Hydrogen",
              color: "#e2e8f0",
              radius: 14,
              valenceElectrons: 1,
              currentX: 180,
              currentY: 140,
              targetX: 280,
              targetY: 210,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "h2",
              symbol: "H",
              name: "Hydrogen",
              color: "#e2e8f0",
              radius: 14,
              valenceElectrons: 1,
              currentX: 230,
              currentY: 140,
              targetX: 340,
              targetY: 170,
              charge: 0,
              reactingGroup: "reactant",
            },
            // O2 Molecule
            {
              id: "o1",
              symbol: "O",
              name: "Oxygen",
              color: "#ef4444",
              radius: 20,
              valenceElectrons: 6,
              currentX: 480,
              currentY: 200,
              targetX: 330,
              targetY: 230,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "o2",
              symbol: "O",
              name: "Oxygen",
              color: "#ef4444",
              radius: 20,
              valenceElectrons: 6,
              currentX: 540,
              currentY: 200,
              targetX: 520,
              targetY: 230,
              charge: 0,
              reactingGroup: "reactant",
            },
            // H2 Molecule 2
            {
              id: "h3",
              symbol: "H",
              name: "Hydrogen",
              color: "#e2e8f0",
              radius: 14,
              valenceElectrons: 1,
              currentX: 180,
              currentY: 260,
              targetX: 470,
              targetY: 210,
              charge: 0,
              reactingGroup: "reactant",
            },
            {
              id: "h4",
              symbol: "H",
              name: "Hydrogen",
              color: "#e2e8f0",
              radius: 14,
              valenceElectrons: 1,
              currentX: 230,
              currentY: 260,
              targetX: 560,
              targetY: 180,
              charge: 0,
              reactingGroup: "reactant",
            },
          ],
          bondsInitial: [
            { fromId: "h1", toId: "h2", type: "covalent-single", strength: 1, color: "#38bdf8" },
            { fromId: "o1", toId: "o2", type: "covalent-double", strength: 1, color: "#ef4444" },
            { fromId: "h3", toId: "h4", type: "covalent-single", strength: 1, color: "#38bdf8" },
          ],
          bondsFinal: [
            // Water molecule 1: O1 bonded to H1 and H2
            { fromId: "h1", toId: "o1", type: "covalent-single", strength: 1, color: "#38bdf8" },
            { fromId: "h2", toId: "o1", type: "covalent-single", strength: 1, color: "#38bdf8" },
            // Water molecule 2: O2 bonded to H3 and H4
            { fromId: "h3", toId: "o2", type: "covalent-single", strength: 1, color: "#38bdf8" },
            { fromId: "h4", toId: "o2", type: "covalent-single", strength: 1, color: "#38bdf8" },
          ],
        };
    }
  }, [reaction.id]);

  // Main canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let localTime = 0;

    const { atoms, bondsInitial, bondsFinal } = getAtomsForReaction();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 800;
    const height = 420;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    ctx.scale(dpr, dpr);

    const render = () => {
      localTime += 0.02 * speedRef.current;
      if (isPlayingRef.current) {
        progressRef.current += 0.0035 * speedRef.current;
        if (progressRef.current > 1.05) progressRef.current = 0;
        setAnimationProgress(progressRef.current);
      }

      ctx.clearRect(0, 0, width, height);

      // Background laboratory grid
      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Energy activation curve in background
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(80, 360);
      ctx.quadraticCurveTo(width * 0.5, 60, width - 80, 320);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Calculate atom positions based on animationProgress (0 to 1)
      const p = Math.min(1, Math.max(0, progressRef.current));
      // Ease in-out interpolation
      const easeP = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

      const currentAtoms = atoms.map((atom) => {
        // Natural vibration jitter
        const jitterX = Math.sin(localTime * 5 + atom.radius) * (1 - easeP * 0.4) * 2;
        const jitterY = Math.cos(localTime * 4 + atom.radius) * (1 - easeP * 0.4) * 2;

        const posX = atom.currentX + (atom.targetX - atom.currentX) * easeP + jitterX;
        const posY = atom.currentY + (atom.targetY - atom.currentY) * easeP + jitterY;

        return { ...atom, posX, posY };
      });

      // 1. DRAW BONDS
      // Reactant bonds fade out between p = 0.3 and 0.6
      const initialBondAlpha = Math.max(0, 1 - p * 2.2);
      if (initialBondAlpha > 0) {
        bondsInitial.forEach((bond) => {
          const atom1 = currentAtoms.find((a) => a.id === bond.fromId);
          const atom2 = currentAtoms.find((a) => a.id === bond.toId);
          if (atom1 && atom2) {
            ctx.save();
            ctx.globalAlpha = initialBondAlpha;

            if (bond.type === "covalent-double") {
              // Draw 2 parallel bond lines
              const angle = Math.atan2(atom2.posY - atom1.posY, atom2.posX - atom1.posX);
              const perpX = Math.sin(angle) * 4;
              const perpY = -Math.cos(angle) * 4;

              ctx.strokeStyle = bond.color;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(atom1.posX + perpX, atom1.posY + perpY);
              ctx.lineTo(atom2.posX + perpX, atom2.posY + perpY);
              ctx.moveTo(atom1.posX - perpX, atom1.posY - perpY);
              ctx.lineTo(atom2.posX - perpX, atom2.posY - perpY);
              ctx.stroke();
            } else if (bond.type === "ionic") {
              ctx.strokeStyle = bond.color;
              ctx.setLineDash([4, 4]);
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(atom1.posX, atom1.posY);
              ctx.lineTo(atom2.posX, atom2.posY);
              ctx.stroke();
            } else {
              ctx.strokeStyle = bond.color;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(atom1.posX, atom1.posY);
              ctx.lineTo(atom2.posX, atom2.posY);
              ctx.stroke();
            }
            ctx.restore();
          }
        });
      }

      // Product bonds fade in between p = 0.55 and 1.0
      const finalBondAlpha = Math.min(1, Math.max(0, (p - 0.55) * 2.5));
      if (finalBondAlpha > 0) {
        bondsFinal.forEach((bond) => {
          const atom1 = currentAtoms.find((a) => a.id === bond.fromId);
          const atom2 = currentAtoms.find((a) => a.id === bond.toId);
          if (atom1 && atom2) {
            ctx.save();
            ctx.globalAlpha = finalBondAlpha;

            // Glowing energetic bond formation
            ctx.shadowColor = bond.color;
            ctx.shadowBlur = 10 * finalBondAlpha;

            if (bond.type === "ionic") {
              ctx.strokeStyle = "#c084fc";
              ctx.setLineDash([5, 4]);
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(atom1.posX, atom1.posY);
              ctx.lineTo(atom2.posX, atom2.posY);
              ctx.stroke();

              // Electrostatic attraction indicator
              const midX = (atom1.posX + atom2.posX) / 2;
              const midY = (atom1.posY + atom2.posY) / 2;
              ctx.fillStyle = "#e9d5ff";
              ctx.font = "bold 9px monospace";
              ctx.fillText("Ionic Attraction", midX - 35, midY - 8);
            } else {
              ctx.strokeStyle = bond.color;
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(atom1.posX, atom1.posY);
              ctx.lineTo(atom2.posX, atom2.posY);
              ctx.stroke();

              // Shared Electron Pair dots along the bond
              const midX = (atom1.posX + atom2.posX) / 2;
              const midY = (atom1.posY + atom2.posY) / 2;
              ctx.beginPath();
              ctx.arc(midX - 4, midY, 3, 0, Math.PI * 2);
              ctx.arc(midX + 4, midY, 3, 0, Math.PI * 2);
              ctx.fillStyle = "#38bdf8";
              ctx.fill();
            }
            ctx.restore();
          }
        });
      }

      // Energy Flash during Transition Stage (p between 0.5 and 0.7)
      if (p >= 0.48 && p <= 0.68) {
        const flashIntensity = 1 - Math.abs(p - 0.58) / 0.1;
        ctx.save();
        ctx.fillStyle = `rgba(56, 189, 248, ${flashIntensity * 0.35})`;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.5, 140 * flashIntensity, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${flashIntensity * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("⚡ ACTIVATION ENERGY SURPASS: BONDS REFORMING", width * 0.5, 80);
        ctx.restore();
      }

      // 2. DRAW ATOMS AND ELECTRON CLOUDS
      currentAtoms.forEach((atom) => {
        ctx.save();

        // Outer valence shell ring
        const shellRadius = atom.radius + 14;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.arc(atom.posX, atom.posY, shellRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting valence electrons
        for (let i = 0; i < atom.valenceElectrons; i++) {
          const elAngle = (i * 2 * Math.PI) / atom.valenceElectrons + localTime * 2;
          const elX = atom.posX + Math.cos(elAngle) * shellRadius;
          const elY = atom.posY + Math.sin(elAngle) * shellRadius;

          ctx.beginPath();
          ctx.arc(elX, elY, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Atom Nucleus Sphere
        const atomGrad = ctx.createRadialGradient(
          atom.posX - atom.radius * 0.3,
          atom.posY - atom.radius * 0.3,
          2,
          atom.posX,
          atom.posY,
          atom.radius,
        );
        atomGrad.addColorStop(0, "#ffffff");
        atomGrad.addColorStop(0.3, atom.color);
        atomGrad.addColorStop(1, "#0f172a");

        ctx.fillStyle = atomGrad;
        ctx.shadowColor = atom.color;
        ctx.shadowBlur = atom.id === selectedAtomIdRef.current ? 16 : 8;
        ctx.beginPath();
        ctx.arc(atom.posX, atom.posY, atom.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Atom symbol label
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${atom.radius > 20 ? 14 : 11}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(atom.symbol, atom.posX, atom.posY);

        // Charge indicator if formed in product
        if (p > 0.7) {
          if (atom.symbol === "Na") {
            ctx.fillStyle = "#a855f7";
            ctx.font = "bold 11px monospace";
            ctx.fillText("Na⁺", atom.posX + 18, atom.posY - 16);
          } else if (atom.symbol === "Cl") {
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 11px monospace";
            ctx.fillText("Cl⁻", atom.posX + 20, atom.posY - 16);
          }
        }

        ctx.restore();
      });

      // Stage description banner at the bottom of the canvas
      ctx.save();
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(40, height - 52, width - 80, 38, 8);
      ctx.fill();
      ctx.stroke();

      const curStep =
        progressRef.current < 0.28
          ? 1
          : progressRef.current < 0.58
            ? 2
            : progressRef.current < 0.88
              ? 3
              : 4;
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(STEP_LABELS[curStep - 1]!.title, 55, height - 28);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px sans-serif";
      ctx.fillText(STEP_LABELS[curStep - 1]!.desc, 240, height - 28);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [reaction.id, getAtomsForReaction]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col rounded-3xl border border-emerald-500/40 bg-slate-950 p-6 text-white shadow-2xl space-y-5"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Molecular Bonding Simulation
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                {reaction.type}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">{reaction.equation}</h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Close View
          </button>
        )}
      </div>

      {/* Main Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Step Progress Indicators */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEP_LABELS.map((s) => {
          const isActive = currentStep === s.step;
          return (
            <button
              key={s.step}
              onClick={() => {
                setIsPlaying(false);
                setAnimationProgress((s.step - 1) * 0.29 + 0.05);
              }}
              className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                isActive
                  ? "border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/40"
                  : "border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isActive && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                <span className="text-xs font-bold">{s.title}</span>
              </div>
              <span className="mt-1 text-[10px] text-slate-400 leading-tight line-clamp-1">
                {s.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrub & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              setAnimationProgress(0);
              setIsPlaying(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all"
            title="Replay from Beginning"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Timeline Scrubber */}
          <div className="flex items-center gap-2 ml-2">
            <span className="text-[11px] font-mono text-slate-400">Timeline:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={animationProgress}
              onChange={(e) => {
                setIsPlaying(false);
                setAnimationProgress(parseFloat(e.target.value));
              }}
              className="h-1.5 w-28 sm:w-48 accent-emerald-400 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-[11px] text-emerald-400 w-10">
              {Math.round(animationProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Speed toggles */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1">Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeedMultiplier(s)}
              className={`rounded-lg px-2 py-0.5 font-mono text-xs transition-all ${
                speedMultiplier === s
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scientific Explanation of the Bonding Mechanism */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
          <Info className="h-3.5 w-3.5" />
          <span>Atomic Rearrangement & Law of Conservation of Mass:</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-400">{reaction.atomRearrangement}</p>
      </div>
    </div>
  );
};
