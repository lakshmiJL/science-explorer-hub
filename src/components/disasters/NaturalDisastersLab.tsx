import React, { useState, useEffect } from "react";
import { DISASTERS_DATA, DISASTERS_QUIZ } from "../../data/disastersData";
import { DisasterType, DisasterInfo } from "../../types/science";
import { useLabProgress } from "../../context/LabProgressContext";
import { QuizRunner } from "../quiz/QuizRunner";
import { LabLearningCycle, LearningStage } from "../common/LabLearningCycle";
import {
  Globe,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Shield,
  BookOpen,
  Waves,
  Flame,
  CloudRain,
  Wind,
  Activity,
  Mountain,
  HelpCircle,
  Info,
  Layers,
} from "lucide-react";

export const NaturalDisastersLab: React.FC = () => {
  const { markDisasterSimulated, progress } = useLabProgress();
  const [learningStage, setLearningStage] = useState<LearningStage>("experiment");
  const [completedStages, setCompletedStages] = useState<LearningStage[]>(["explore"]);
  const [selectedDisasterId, setSelectedDisasterId] = useState<DisasterType>("earthquake");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationTick, setSimulationTick] = useState(0);
  const [showGuidance, setShowGuidance] = useState(true);

  const addCompletedStage = (stage: LearningStage) => {
    setCompletedStages((prev) => (prev.includes(stage) ? prev : [...prev, stage]));
  };

  const currentDisaster: DisasterInfo = DISASTERS_DATA[selectedDisasterId]!;

  const [variables, setVariables] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    currentDisaster.variables.forEach((v) => {
      init[v.name] = v.defaultValue;
    });
    return init;
  });

  useEffect(() => {
    const newVars: Record<string, number> = {};
    currentDisaster.variables.forEach((v) => {
      newVars[v.name] = v.defaultValue;
    });
    setVariables(newVars);
    setIsSimulating(false);
    setSimulationTick(0);
  }, [selectedDisasterId, currentDisaster.variables]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimulationTick((t) => (t + 1) % 120);
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    markDisasterSimulated(selectedDisasterId);
    addCompletedStage("experiment");
    addCompletedStage("observe");
    addCompletedStage("understand");
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationTick(0);
  };

  const handleVariableChange = (varName: string, val: number) => {
    setVariables((prev) => ({ ...prev, [varName]: val }));
  };

  const getDisasterIcon = (id: DisasterType) => {
    switch (id) {
      case "earthquake":
        return <Activity className="h-4 w-4" />;
      case "volcano":
        return <Mountain className="h-4 w-4" />;
      case "tsunami":
        return <Waves className="h-4 w-4" />;
      case "hurricane":
        return <Wind className="h-4 w-4" />;
      case "flood":
        return <CloudRain className="h-4 w-4" />;
      case "wildfire":
        return <Flame className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-background to-background p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-amber-500">Module 03</span>
              <span>·</span>
              <span>Ages 11–16</span>
              <span>·</span>
              <span>Earth Systems & Physics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
              Natural Disasters Lab
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Planet Earth: Forces of Nature · Explore geophysics, fluid mechanics, and scientific
              safety preparedness
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>{showGuidance ? "Hide Guidance" : "What Am I Seeing?"}</span>
            </button>
          </div>
        </div>

        {/* 5-Step Learning Cycle */}
        <LabLearningCycle
          currentStage={learningStage}
          onSelectStage={(stage) => {
            setLearningStage(stage);
            addCompletedStage(stage);
          }}
          completedStages={completedStages}
          colorTheme="amber"
        />
      </div>

      {/* Guidance Notice */}
      {showGuidance && learningStage === "experiment" && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-foreground/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
            <Info className="h-4 w-4 shrink-0" />
            <span>Earth Systems Simulation Guidance</span>
          </div>
          <p className="leading-relaxed">
            Select one of the six Earth events below. Adjust physical parameters on the left (e.g.
            earthquake magnitude, focal depth, ocean depth, or wind speed) and click{" "}
            <strong>Run Physics Simulation</strong>. Observe how energy propagates through
            lithospheric rocks, ocean basins, and atmosphere without graphic or frightening
            depictions.
          </p>
        </div>
      )}

      {/* Disaster Selector Navigation Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(DISASTERS_DATA) as DisasterType[]).map((dId) => {
          const isSelected = selectedDisasterId === dId;
          const isSimmed = progress.disastersSimulated.includes(dId);

          return (
            <button
              key={dId}
              onClick={() => {
                setSelectedDisasterId(dId);
                addCompletedStage("explore");
              }}
              className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
                isSelected
                  ? "border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500/50"
                  : "border-border/60 bg-card hover:bg-muted/30"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  isSelected ? "bg-amber-500 text-slate-950 font-bold" : "bg-muted text-foreground"
                }`}
              >
                {getDisasterIcon(dId)}
              </div>
              <span className="mt-2 text-xs font-bold text-foreground capitalize">{dId}</span>
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                {isSimmed ? "✓ Explored" : "Ready to test"}
              </span>
            </button>
          );
        })}
      </div>

      {/* STAGE: EXPERIMENT or OBSERVE */}
      {(learningStage === "experiment" || learningStage === "observe") && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Variables Controls (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-foreground">Physical Variables</h3>
                </div>
                <button
                  onClick={handleResetSimulation}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                {currentDisaster.variables.map((variable) => {
                  const currentVal = variables[variable.name] ?? variable.defaultValue;
                  return (
                    <div key={variable.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{variable.label}</span>
                        <span className="font-mono font-bold text-amber-500">
                          {currentVal} {variable.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={variable.min}
                        max={variable.max}
                        step={variable.step}
                        value={currentVal}
                        onChange={(e) =>
                          handleVariableChange(variable.name, parseFloat(e.target.value))
                        }
                        className="w-full accent-amber-500"
                      />
                      <p className="text-[10px] text-muted-foreground">{variable.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {!isSimulating ? (
                  <button
                    onClick={handleStartSimulation}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Run Physics Simulation
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSimulating(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg hover:bg-red-600 active:scale-95 transition-all"
                  >
                    <Pause className="h-4 w-4" /> Pause Simulation
                  </button>
                )}
              </div>
            </div>

            {/* Crucial Safety Protocol Box */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                <Shield className="h-4 w-4" /> Community Safety Protocol
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {currentDisaster.safetyTips[0]}
              </p>
            </div>
          </div>

          {/* Right: Interactive Simulation Viewport (8 cols) */}
          <div className="space-y-4 lg:col-span-8">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">{currentDisaster.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentDisaster.subtitle}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isSimulating
                      ? "bg-emerald-500/10 text-emerald-500 animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isSimulating ? "● Simulation Active" : "Ready"}
                </span>
              </div>

              {/* Graphical Simulation Stage */}
              <div className="relative flex min-h-[380px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-slate-950 p-6 text-white shadow-inner">
                {/* 1. EARTHQUAKE */}
                {selectedDisasterId === "earthquake" && (
                  <div className="relative flex h-full w-full flex-col items-center justify-between">
                    {/* Surface buildings with seismograph readout */}
                    <div
                      className="flex items-end gap-3 transition-transform"
                      style={{
                        transform: isSimulating
                          ? `translateX(${Math.sin(simulationTick * 0.8) * ((variables["magnitude"] ?? 6) - 2)}px)`
                          : "none",
                      }}
                    >
                      <div className="h-16 w-10 rounded-t border border-slate-600 bg-slate-700/80 flex flex-col justify-around p-1">
                        <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                        <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                      </div>
                      <div className="h-24 w-14 rounded-t border border-slate-600 bg-slate-800/80 flex flex-col justify-around p-1">
                        <div className="flex justify-around">
                          <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                          <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                        </div>
                        <div className="flex justify-around">
                          <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                          <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                        </div>
                      </div>
                      <div className="h-14 w-10 rounded-t border border-slate-600 bg-slate-700/80 flex flex-col justify-around p-1">
                        <div className="h-1.5 w-1.5 bg-yellow-300 rounded-xs" />
                      </div>
                    </div>

                    {/* Ground line */}
                    <div className="h-3 w-full border-t border-slate-600 bg-amber-900/40 my-3" />

                    {/* Subsurface Lithosphere with Fault & Epicenter */}
                    <div className="relative flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-b from-amber-950/60 to-slate-900 p-4">
                      {/* Fault line */}
                      <div className="absolute h-full w-0.5 border-r border-dashed border-red-400 rotate-12" />

                      {/* Hypocenter / Focus */}
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`h-7 w-7 rounded-full bg-red-500 shadow-lg ${
                            isSimulating ? "animate-ping" : ""
                          }`}
                        />
                        <div className="absolute h-3.5 w-3.5 rounded-full bg-yellow-300" />
                      </div>

                      {/* Seismic Waves ripples */}
                      {isSimulating && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-24 w-24 rounded-full border border-red-500/40 animate-ping duration-1000" />
                          <div className="h-44 w-44 rounded-full border border-amber-500/30 animate-ping duration-1000 delay-150" />
                        </div>
                      )}

                      <div className="absolute top-2 left-4 text-[10px] text-slate-400 font-mono">
                        Focal Depth: {variables["depth"] ?? 15} km
                      </div>
                      <div className="absolute top-2 right-4 text-[10px] text-slate-400 font-mono">
                        Epicenter Dist: {variables["distance"] ?? 25} km
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VOLCANO */}
                {selectedDisasterId === "volcano" && (
                  <div className="relative flex h-full w-full flex-col items-center justify-end">
                    {/* Ash Plume */}
                    <div
                      className={`flex flex-col items-center transition-all ${
                        isSimulating ? "opacity-100 scale-100" : "opacity-30 scale-75"
                      }`}
                    >
                      <div className="h-20 w-44 rounded-full bg-gradient-to-t from-slate-700 via-slate-600 to-transparent blur-md animate-pulse" />
                      <div className="h-10 w-28 rounded-full bg-gradient-to-t from-orange-600 to-slate-700 blur-sm" />
                    </div>

                    {/* Volcano Edifice */}
                    <div className="relative flex w-72 items-end justify-center">
                      <div className="h-32 w-72 border-b-4 border-amber-900 bg-gradient-to-t from-stone-800 to-stone-700 [clip-path:polygon(35%_0%,65%_0%,100%_100%,0%_100%)] flex justify-center">
                        <div className="h-full w-5 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300" />
                      </div>
                    </div>

                    {/* Underground Magma Chamber */}
                    <div className="mt-2 flex h-20 w-52 items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 shadow-2xl shadow-red-600/50">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-yellow-100">
                        Magma Reservoir ({variables["magmaPressure"] ?? 75} MPa)
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. TSUNAMI */}
                {selectedDisasterId === "tsunami" && (
                  <div className="relative flex h-full w-full flex-col justify-between">
                    <div className="text-center text-xs text-slate-400">
                      Open Ocean (High speed ~800 km/h) → Shallow Shoreline (Wave Shoaling & Surge)
                    </div>

                    <div className="relative flex h-52 w-full items-end overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-blue-900/40 to-transparent" />

                      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                        <path
                          d={
                            isSimulating
                              ? `M 0 70 Q 150 ${60 + Math.sin(simulationTick * 0.2) * 8} 300 70 T 500 ${
                                  35 - (variables["seafloorDisplacement"] ?? 12) * 1.5
                                } L 600 200 L 0 200 Z`
                              : "M 0 70 Q 200 70 400 70 T 600 70 L 600 200 L 0 200 Z"
                          }
                          fill="rgba(6, 182, 212, 0.4)"
                        />
                      </svg>

                      <div className="absolute bottom-0 right-0 h-28 w-32 bg-amber-800/80 [clip-path:polygon(0%_100%,100%_0%,100%_100%)] flex items-end justify-end p-2">
                        <span className="text-[9px] font-bold text-amber-200">Coastline</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Seafloor Offset: {variables["seafloorDisplacement"] ?? 12} m</span>
                      <span>Ocean Depth: {variables["oceanDepth"] ?? 4500} m</span>
                    </div>
                  </div>
                )}

                {/* 4. HURRICANE */}
                {selectedDisasterId === "hurricane" && (
                  <div className="relative flex h-full w-full flex-col items-center justify-center">
                    <div
                      className="relative flex h-56 w-56 items-center justify-center rounded-full border border-sky-400/30"
                      style={{
                        transform: isSimulating ? `rotate(${simulationTick * -4}deg)` : "none",
                        transition: "transform 0.05s linear",
                      }}
                    >
                      <div className="absolute inset-2 rounded-full border-4 border-dashed border-sky-300/40" />
                      <div className="absolute inset-6 rounded-full border-4 border-dashed border-sky-400/50" />
                      <div className="absolute inset-12 rounded-full border-4 border-dashed border-sky-200/60" />

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 border-2 border-sky-400/80 shadow-inner">
                        <span className="text-[9px] font-bold text-sky-400">Eye</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-6 text-[10px] font-mono text-slate-400">
                      <span>Sea Temp: {variables["seaTemp"] ?? 29.5}°C</span>
                      <span>Central Pressure: {variables["centralPressure"] ?? 925} hPa</span>
                    </div>
                  </div>
                )}

                {/* 5. FLOOD */}
                {selectedDisasterId === "flood" && (
                  <div className="relative flex h-full w-full flex-col justify-between">
                    <div className="flex justify-around text-sky-400/60">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((drop) => (
                        <div
                          key={drop}
                          className={`h-4 w-0.5 bg-sky-400 rounded-full ${
                            isSimulating ? "animate-bounce" : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="relative h-40 w-full rounded-xl bg-stone-800 overflow-hidden flex items-end">
                      <div
                        className="w-full bg-blue-600/70 transition-all duration-300"
                        style={{
                          height: isSimulating
                            ? `${Math.min(100, 25 + (variables["rainfallIntensity"] ?? 65) * 0.6)}%`
                            : "25%",
                        }}
                      />
                      <div className="absolute bottom-2 left-8 h-8 w-8 bg-amber-700 rounded-t flex items-center justify-center text-[8px] text-white">
                        Home
                      </div>
                      <div className="absolute bottom-2 right-12 h-10 w-12 bg-slate-600 rounded-t flex items-center justify-center text-[8px] text-white">
                        City
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Rain Rate: {variables["rainfallIntensity"] ?? 65} mm/hr</span>
                      <span>Paved Urbanization: {variables["urbanization"] ?? 45}%</span>
                    </div>
                  </div>
                )}

                {/* 6. WILDFIRE */}
                {selectedDisasterId === "wildfire" && (
                  <div className="relative flex h-full w-full flex-col justify-between">
                    <div className="text-center text-xs text-slate-400">
                      Convective Uphill Flame Preheating & Wind-Driven Advance
                    </div>

                    <div className="relative flex h-48 w-full items-end overflow-hidden rounded-xl bg-stone-900">
                      <div className="absolute inset-0 bg-gradient-to-tr from-stone-800 via-amber-950/40 to-stone-900" />

                      <div
                        className="absolute bottom-4 flex items-center gap-1 transition-all"
                        style={{
                          left: isSimulating
                            ? `${Math.min(80, 20 + simulationTick * 0.5)}%`
                            : "20%",
                        }}
                      >
                        <Flame className="h-10 w-10 text-orange-500 animate-bounce fill-orange-500" />
                        <Flame className="h-12 w-12 text-red-500 animate-pulse fill-red-500" />
                        <Flame className="h-8 w-8 text-yellow-400 animate-ping fill-yellow-400" />
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Wind Speed: {variables["windSpeed"] ?? 35} km/h</span>
                      <span>Fuel Moisture: {variables["fuelMoisture"] ?? 8}%</span>
                      <span>Slope: {variables["slopeAngle"] ?? 20}°</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Scientific principle footer banner */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-xs text-foreground/90 space-y-1">
                <span className="font-bold text-amber-500 uppercase tracking-wider text-[11px]">
                  Scientific Principle:
                </span>
                <p className="leading-relaxed">{currentDisaster.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE: EXPLORE / MECHANICS & SAFETY */}
      {(learningStage === "explore" || learningStage === "understand") && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Geological Mechanics & Safety Guidelines: {currentDisaster.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              How natural forces trigger hazards and how communities prepare safely
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
                <BookOpen className="h-4 w-4" />
                <span>Geophysical Progression</span>
              </div>
              <ol className="space-y-2 text-xs text-muted-foreground list-decimal pl-4 leading-relaxed">
                {currentDisaster.mechanism.map((step, idx) => (
                  <li key={idx}>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-500">
                <Shield className="h-4 w-4" />
                <span>Official Safety Protocols</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4 leading-relaxed">
                {currentDisaster.safetyTips.map((tip, idx) => (
                  <li key={idx}>
                    <span className="text-foreground font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Vocabulary Terms */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Key Scientific Vocabulary
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentDisaster.keyTerms.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs"
                >
                  <span className="font-bold text-amber-500">{t.term}:</span>
                  <p className="mt-0.5 text-muted-foreground">{t.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE: QUIZ */}
      {learningStage === "quiz" && (
        <QuizRunner
          labId="disasters"
          labTitle="Natural Disasters"
          questions={DISASTERS_QUIZ}
          onFinish={() => addCompletedStage("quiz")}
        />
      )}
    </div>
  );
};
