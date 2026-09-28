import React, { useState, useRef } from "react";
import { Compound } from "../../types/science";
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Info } from "lucide-react";

interface Molecule3DViewerProps {
  compound: Compound;
  title?: string;
}

interface AtomCoord {
  element: string;
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
  label: string;
}

interface Bond {
  from: number;
  to: number;
  type: "single" | "double" | "triple";
}

// Generate realistic spatial 3D coordinates for supported compounds
function generateMoleculeCoords(compoundId: string): { atoms: AtomCoord[]; bonds: Bond[] } {
  switch (compoundId) {
    case "h2o": // Water - Bent 104.5 deg
      return {
        atoms: [
          { element: "O", x: 0, y: -10, z: 0, color: "#ef4444", radius: 22, label: "Oxygen" },
          { element: "H", x: -45, y: 25, z: 10, color: "#f8fafc", radius: 14, label: "Hydrogen" },
          { element: "H", x: 45, y: 25, z: -10, color: "#f8fafc", radius: 14, label: "Hydrogen" },
        ],
        bonds: [
          { from: 0, to: 1, type: "single" },
          { from: 0, to: 2, type: "single" },
        ],
      };
    case "co2": // Carbon Dioxide - Linear 180 deg
      return {
        atoms: [
          { element: "C", x: 0, y: 0, z: 0, color: "#64748b", radius: 20, label: "Carbon" },
          { element: "O", x: -65, y: 0, z: 0, color: "#ef4444", radius: 22, label: "Oxygen" },
          { element: "O", x: 65, y: 0, z: 0, color: "#ef4444", radius: 22, label: "Oxygen" },
        ],
        bonds: [
          { from: 0, to: 1, type: "double" },
          { from: 0, to: 2, type: "double" },
        ],
      };
    case "hcl": // Hydrogen Chloride - Diatomic
      return {
        atoms: [
          { element: "Cl", x: -25, y: 0, z: 0, color: "#22c55e", radius: 26, label: "Chlorine" },
          { element: "H", x: 40, y: 0, z: 0, color: "#f8fafc", radius: 14, label: "Hydrogen" },
        ],
        bonds: [{ from: 0, to: 1, type: "single" }],
      };
    case "naoh": // Sodium Hydroxide
      return {
        atoms: [
          { element: "Na", x: -50, y: 0, z: 0, color: "#a855f7", radius: 26, label: "Sodium" },
          { element: "O", x: 10, y: -10, z: 0, color: "#ef4444", radius: 20, label: "Oxygen" },
          { element: "H", x: 50, y: 15, z: 0, color: "#f8fafc", radius: 14, label: "Hydrogen" },
        ],
        bonds: [
          { from: 0, to: 1, type: "single" },
          { from: 1, to: 2, type: "single" },
        ],
      };
    case "nacl": // Table salt crystal pair
      return {
        atoms: [
          {
            element: "Na",
            x: -35,
            y: 0,
            z: 0,
            color: "#a855f7",
            radius: 24,
            label: "Sodium (Na+)",
          },
          {
            element: "Cl",
            x: 35,
            y: 0,
            z: 0,
            color: "#22c55e",
            radius: 28,
            label: "Chloride (Cl-)",
          },
        ],
        bonds: [{ from: 0, to: 1, type: "single" }],
      };
    case "o2": // Oxygen gas - Diatomic double bond
      return {
        atoms: [
          { element: "O", x: -30, y: 0, z: 0, color: "#ef4444", radius: 22, label: "Oxygen" },
          { element: "O", x: 30, y: 0, z: 0, color: "#ef4444", radius: 22, label: "Oxygen" },
        ],
        bonds: [{ from: 0, to: 1, type: "double" }],
      };
    case "h2": // Hydrogen gas - Diatomic single bond
      return {
        atoms: [
          { element: "H", x: -25, y: 0, z: 0, color: "#f8fafc", radius: 15, label: "Hydrogen" },
          { element: "H", x: 25, y: 0, z: 0, color: "#f8fafc", radius: 15, label: "Hydrogen" },
        ],
        bonds: [{ from: 0, to: 1, type: "single" }],
      };
    case "fe2o3": // Iron Oxide
      return {
        atoms: [
          { element: "Fe", x: -45, y: -20, z: 15, color: "#d97706", radius: 25, label: "Iron" },
          { element: "Fe", x: 45, y: 20, z: -15, color: "#d97706", radius: 25, label: "Iron" },
          { element: "O", x: 0, y: -30, z: -20, color: "#ef4444", radius: 18, label: "Oxygen" },
          { element: "O", x: 0, y: 0, z: 0, color: "#ef4444", radius: 18, label: "Oxygen" },
          { element: "O", x: 0, y: 30, z: 20, color: "#ef4444", radius: 18, label: "Oxygen" },
        ],
        bonds: [
          { from: 0, to: 2, type: "single" },
          { from: 0, to: 3, type: "single" },
          { from: 1, to: 3, type: "single" },
          { from: 1, to: 4, type: "single" },
        ],
      };
    case "caco3": // Calcium carbonate
      return {
        atoms: [
          { element: "Ca", x: -50, y: -10, z: 0, color: "#0ea5e9", radius: 26, label: "Calcium" },
          { element: "C", x: 15, y: 0, z: 0, color: "#64748b", radius: 18, label: "Carbon" },
          { element: "O", x: 0, y: -35, z: 10, color: "#ef4444", radius: 18, label: "Oxygen" },
          { element: "O", x: 50, y: -10, z: -15, color: "#ef4444", radius: 18, label: "Oxygen" },
          { element: "O", x: 20, y: 35, z: 5, color: "#ef4444", radius: 18, label: "Oxygen" },
        ],
        bonds: [
          { from: 0, to: 2, type: "single" },
          { from: 1, to: 2, type: "single" },
          { from: 1, to: 3, type: "double" },
          { from: 1, to: 4, type: "single" },
        ],
      };
    default: {
      // Generic representation based on compound.atoms
      const defaultAtoms: AtomCoord[] = [];
      const defaultBonds: Bond[] = [];
      let atomIndex = 0;

      compound.atoms.forEach((at, groupIdx) => {
        for (let i = 0; i < at.count; i++) {
          const angle = (atomIndex * (2 * Math.PI)) / 4;
          defaultAtoms.push({
            element: at.element,
            x: Math.cos(angle) * (30 + groupIdx * 20),
            y: Math.sin(angle) * (30 + groupIdx * 20),
            z: (i - at.count / 2) * 15,
            color: at.color,
            radius: at.element === "H" ? 14 : 22,
            label: at.element,
          });
          if (atomIndex > 0) {
            defaultBonds.push({
              from: atomIndex - 1,
              to: atomIndex,
              type: "single",
            });
          }
          atomIndex++;
        }
      });
      return { atoms: defaultAtoms, bonds: defaultBonds };
    }
  }
}

export const Molecule3DViewer: React.FC<Molecule3DViewerProps> = ({ compound, title }) => {
  const [rotX, setRotX] = useState(15);
  const [rotY, setRotY] = useState(-25);
  const [zoom, setZoom] = useState(1);
  const [activeAtom, setActiveAtom] = useState<AtomCoord | null>(null);

  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const { atoms, bonds } = generateMoleculeCoords(compound.id);

  // 3D rotation projection helper
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  const projectAtom = (atom: AtomCoord) => {
    // Rotate Y
    const x1 = atom.x * Math.cos(radY) + atom.z * Math.sin(radY);
    const z1 = -atom.x * Math.sin(radY) + atom.z * Math.cos(radY);

    // Rotate X
    const y2 = atom.y * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = atom.y * Math.sin(radX) + z1 * Math.cos(radX);

    // Apply scale & center in 240x240 box
    const centerX = 140;
    const centerY = 130;
    const scale = zoom;

    return {
      projX: centerX + x1 * scale,
      projY: centerY + y2 * scale,
      depth: z2,
      ...atom,
    };
  };

  const projectedAtoms = atoms.map(projectAtom).sort((a, b) => a.depth - b.depth);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.8);
    setRotX((prev) => Math.max(-80, Math.min(80, prev - dy * 0.8)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm select-none">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h4 className="text-sm font-bold text-foreground">
            {title || `${compound.name} (${compound.formula})`}
          </h4>
          <p className="text-[11px] text-muted-foreground">
            3D Ball-and-Stick Model • Click & drag to rotate
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setRotX(15);
              setRotY(-25);
              setZoom(1);
            }}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Reset view orientation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas / SVG area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex h-64 w-full cursor-grab active:cursor-grabbing items-center justify-center overflow-hidden rounded-xl bg-slate-950 mt-3"
      >
        <svg className="h-full w-full" viewBox="0 0 280 260">
          {/* Subtle grid in background */}
          <defs>
            <radialGradient id="atomGlow" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Bonds (Lines) */}
          {bonds.map((bond, idx) => {
            const atomA = projectAtom(atoms[bond.from]!);
            const atomB = projectAtom(atoms[bond.to]!);
            return (
              <g key={`bond-${idx}`}>
                <line
                  x1={atomA.projX}
                  y1={atomA.projY}
                  x2={atomB.projX}
                  y2={atomB.projY}
                  stroke="#94a3b8"
                  strokeWidth={bond.type === "double" ? "6" : "4"}
                  strokeLinecap="round"
                  opacity="0.8"
                />
                {bond.type === "double" && (
                  <line
                    x1={atomA.projX}
                    y1={atomA.projY}
                    x2={atomB.projX}
                    y2={atomB.projY}
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Atoms (Spheres) */}
          {projectedAtoms.map((at, idx) => {
            const scaledRadius = at.radius * (1 + at.depth / 200) * zoom;
            const isHovered = activeAtom?.element === at.element;

            return (
              <g
                key={`atom-${idx}`}
                className="cursor-pointer transition-transform"
                onClick={() => setActiveAtom(at)}
              >
                {/* Shadow/depth halo */}
                <circle
                  cx={at.projX}
                  cy={at.projY}
                  r={scaledRadius}
                  fill={at.color}
                  stroke={isHovered ? "#ffffff" : "#0f172a"}
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                />
                {/* 3D highlight sphere highlight */}
                <circle
                  cx={at.projX - scaledRadius * 0.3}
                  cy={at.projY - scaledRadius * 0.3}
                  r={scaledRadius * 0.5}
                  fill="url(#atomGlow)"
                  pointerEvents="none"
                />
                {/* Atom Element Symbol */}
                <text
                  x={at.projX}
                  y={at.projY + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={scaledRadius > 18 ? "12" : "9"}
                  fontWeight="bold"
                  pointerEvents="none"
                  fontFamily="sans-serif"
                >
                  {at.element}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Rotation indicator pill */}
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
          Rot: X {Math.round(rotX)}° · Y {Math.round(rotY)}°
        </div>
      </div>

      {/* Selected Atom Details */}
      {activeAtom && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/40 p-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: activeAtom.color }}
            />
            <span className="font-semibold text-foreground">
              {activeAtom.label} ({activeAtom.element})
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Standard CPK Model Representation
          </span>
        </div>
      )}
    </div>
  );
};
