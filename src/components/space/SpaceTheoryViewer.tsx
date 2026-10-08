import React, { useState } from "react";
import { SCIENCE_CONCEPTS, ScienceConceptCard } from "../../data/spaceLandingData";
import { BookOpen, Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from "lucide-react";

export const SpaceTheoryViewer: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<ScienceConceptCard>(SCIENCE_CONCEPTS[0]!);
  const [interactiveParam, setInteractiveParam] = useState<number>(50);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-foreground">
              Orbital Mechanics & Flight Physics
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scientific principles governing spacecraft planetary descent and safe touchdown
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>7 Essential Flight Principles</span>
        </div>
      </div>

      {/* Concept Selector Pill Tabs */}
      <div className="flex flex-wrap gap-2">
        {SCIENCE_CONCEPTS.map((concept) => {
          const isActive = selectedConcept.id === concept.id;
          return (
            <button
              key={concept.id}
              onClick={() => {
                setSelectedConcept(concept);
                setInteractiveParam(50);
              }}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                  : "bg-card border border-border/70 text-muted-foreground hover:border-cyan-500/50 hover:text-foreground"
              }`}
            >
              <span>{concept.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Concept Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl border border-border/80 bg-card p-6 shadow-xl">
        {/* Left: Detailed Scientific Explanation (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider">
              Core Aerospace Principle
            </span>
            <h4 className="text-2xl font-black text-foreground">{selectedConcept.title}</h4>
            {selectedConcept.formula && (
              <div className="inline-block rounded-lg bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
                Formula: {selectedConcept.formula}
              </div>
            )}
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
            {selectedConcept.shortSummary}
          </p>

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
            {selectedConcept.detailedExplanation}
          </div>

          {/* Real-World Analogy */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <Lightbulb className="h-4 w-4" />
              <span>Real-World Everyday Analogy:</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              {selectedConcept.realWorldAnalogy}
            </p>
          </div>
        </div>

        {/* Right: Dynamic Animated Diagram (5 cols) */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-inner lg:col-span-5 space-y-4">
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Interactive Visual Diagram
          </span>

          <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            {/* 1. GRAVITY DIAGRAM */}
            {selectedConcept.diagramType === "gravity" && (
              <div className="relative flex flex-col items-center justify-between h-full w-full">
                <div className="flex flex-col items-center animate-bounce duration-1000">
                  <div className="h-10 w-12 rounded-t-lg bg-slate-200 border-2 border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-900">
                    Lander
                  </div>
                  {/* Weight vector arrow */}
                  <div className="flex flex-col items-center text-red-400">
                    <div
                      className="w-1 bg-red-500"
                      style={{ height: interactiveParam * 0.8 + 20 }}
                    />
                    <span className="text-[10px] font-mono font-bold">W = m·g (Weight)</span>
                  </div>
                </div>

                {/* Surface line */}
                <div className="w-full border-t-2 border-slate-700 text-center text-[10px] text-slate-400 pt-1">
                  Planetary Surface
                </div>
              </div>
            )}

            {/* 2. THRUST DIAGRAM */}
            {selectedConcept.diagramType === "thrust" && (
              <div className="relative flex flex-col items-center justify-center h-full w-full space-y-1">
                {/* Upward Reaction force */}
                <div className="text-cyan-400 text-[10px] font-mono font-bold flex flex-col items-center">
                  <span>▲ Upward Thrust (Reaction)</span>
                  <div className="w-1 h-6 bg-cyan-400" />
                </div>

                <div className="h-12 w-14 rounded-lg bg-slate-200 border-2 border-slate-400 flex items-center justify-center text-xs font-bold text-slate-900">
                  Engine
                </div>

                {/* Downward Action force */}
                <div className="text-orange-400 text-[10px] font-mono font-bold flex flex-col items-center">
                  <div className="w-2 h-10 bg-gradient-to-b from-orange-400 to-transparent animate-pulse" />
                  <span>▼ Ejected Gas (Action)</span>
                </div>
              </div>
            )}

            {/* 3. TWR / ACCELERATION DIAGRAM */}
            {selectedConcept.diagramType === "twr" && (
              <div className="flex flex-col items-center justify-center h-full w-full space-y-3">
                <div className="text-xs font-mono text-center">
                  <div className="text-cyan-400 font-bold">
                    Thrust: {(interactiveParam * 200).toFixed(0)} N
                  </div>
                  <div className="text-slate-400">vs</div>
                  <div className="text-red-400 font-bold">Weight: 8,000 N</div>
                </div>

                <div className="text-xs font-bold text-center">
                  {interactiveParam * 200 > 8000 ? (
                    <span className="text-emerald-400">▲ Accelerating Upward (T &gt; W)</span>
                  ) : interactiveParam * 200 === 8000 ? (
                    <span className="text-cyan-400">● Stable Hover (T = W)</span>
                  ) : (
                    <span className="text-red-400">▼ Falling Downward (T &lt; W)</span>
                  )}
                </div>
              </div>
            )}

            {/* 4. VECTORS DIAGRAM */}
            {selectedConcept.diagramType === "vectors" && (
              <div className="relative flex items-center justify-center h-full w-full">
                <svg viewBox="0 0 200 160" className="w-full h-full">
                  <circle cx="40" cy="40" r="8" fill="#38bdf8" />
                  {/* Vx vector */}
                  <line
                    x1="40"
                    y1="40"
                    x2="140"
                    y2="40"
                    stroke="#c084fc"
                    strokeWidth="2.5"
                    markerEnd="url(#arrow)"
                  />
                  <text x="90" y="32" fill="#c084fc" fontSize="10" fontFamily="monospace">
                    Vx (Drift)
                  </text>

                  {/* Vy vector */}
                  <line x1="40" y1="40" x2="40" y2="130" stroke="#f59e0b" strokeWidth="2.5" />
                  <text x="46" y="90" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                    Vy (Descent)
                  </text>

                  {/* Resultant V total */}
                  <line
                    x1="40"
                    y1="40"
                    x2="140"
                    y2="130"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <text x="100" y="100" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                    V_net
                  </text>
                </svg>
              </div>
            )}

            {/* 5. MASS DIAGRAM */}
            {selectedConcept.diagramType === "mass" && (
              <div className="flex flex-col items-center justify-center h-full w-full space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-16 w-14 rounded-lg bg-slate-800 border border-slate-600 flex flex-col justify-end p-1">
                    <div
                      className="w-full bg-emerald-500 rounded-xs transition-all"
                      style={{ height: `${interactiveParam}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono space-y-1">
                    <div className="text-slate-300">Dry Mass: 800 kg</div>
                    <div className="text-emerald-400">
                      Fuel: {(interactiveParam * 4).toFixed(0)} kg
                    </div>
                    <div className="text-cyan-300 font-bold">
                      Total: {(800 + interactiveParam * 4).toFixed(0)} kg
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  Drag scrubber below to simulate burning fuel
                </span>
              </div>
            )}

            {/* 6. FUEL & GRAVITY DRAG DIAGRAM */}
            {selectedConcept.diagramType === "fuel" && (
              <div className="flex flex-col items-center justify-center h-full w-full space-y-2 text-center text-xs">
                <div className="rounded-xl bg-red-950/60 border border-red-500/40 p-2 text-[11px] text-red-300">
                  Hovering at 200m for 10s = 80 kg wasted to gravity drag!
                </div>
                <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-2 text-[11px] text-emerald-300">
                  Freefall + prompt 3s suicide burn = only 24 kg fuel burned!
                </div>
              </div>
            )}

            {/* 7. TIP-OVER ANGLE DIAGRAM */}
            {selectedConcept.diagramType === "angle" && (
              <div className="relative flex items-center justify-center h-full w-full">
                <div
                  className="flex flex-col items-center transition-transform"
                  style={{ transform: `rotate(${(interactiveParam - 50) * 0.6}deg)` }}
                >
                  <div className="h-14 w-12 rounded-t-lg bg-slate-200 border-2 border-slate-500 flex items-center justify-center text-[9px] font-bold text-slate-900">
                    Lander
                  </div>
                  <div className="flex justify-between w-20 border-b-2 border-cyan-400 pb-0.5">
                    <div className="w-2 h-4 bg-slate-400" />
                    <div className="w-2 h-4 bg-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive parameter scrubber */}
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Interactive Parameter:</span>
              <span className="text-cyan-400 font-bold">{interactiveParam}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={interactiveParam}
              onChange={(e) => setInteractiveParam(parseInt(e.target.value))}
              className="h-1.5 w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
