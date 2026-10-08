import React, { useState } from "react";
import {
  PlanetId,
  MissionLevelId,
  SpaceSimulationVariables,
  LandingAttemptResult,
} from "../../types/science";
import { PLANET_CONFIGS, MISSION_LEVELS, SPACE_QUIZ_QUESTIONS } from "../../data/spaceLandingData";
import { useLabProgress } from "../../context/LabProgressContext";
import { LabLearningCycle, LearningStage } from "../common/LabLearningCycle";
import { SpacecraftCanvas } from "./SpacecraftCanvas";
import { TelemetryCharts } from "./TelemetryCharts";
import { MissionComparison } from "./MissionComparison";
import { SpaceTheoryViewer } from "./SpaceTheoryViewer";
import { MissionDesigner } from "./MissionDesigner";
import { QuizRunner } from "../quiz/QuizRunner";
import {
  Rocket,
  Globe,
  Sliders,
  Award,
  BookOpen,
  Activity,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Compass,
} from "lucide-react";

export const SpaceLandingLab: React.FC = () => {
  const { markSpaceLandingCompleted } = useLabProgress();

  // Navigation & Learning cycle state
  const [activeStage, setActiveStage] = useState<LearningStage>("experiment");
  const [completedStages, setCompletedStages] = useState<LearningStage[]>([]);

  // Planet & Level state
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId>("moon");
  const [selectedLevelId, setSelectedLevelId] = useState<MissionLevelId>("level-1");
  const [activeSubTab, setActiveSubTab] = useState<"flight" | "experiment" | "designer">("flight");

  // Flight history & attempts
  const [currentResult, setCurrentResult] = useState<LandingAttemptResult | null>(null);
  const [previousResult, setPreviousResult] = useState<LandingAttemptResult | null>(null);
  const [flightCount, setFlightCount] = useState<number>(0);

  // Active simulation variables
  const currentLevel = MISSION_LEVELS.find((l) => l.id === selectedLevelId) || MISSION_LEVELS[0]!;
  const [simVariables, setSimVariables] = useState<SpaceSimulationVariables>(
    currentLevel.initialVariables,
  );

  const activePlanet = PLANET_CONFIGS[selectedPlanetId];

  // Helper to complete stage
  const addCompletedStage = (stage: LearningStage) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages((prev) => [...prev, stage]);
    }
  };

  // Switch mission level
  const handleSelectLevel = (levelId: MissionLevelId) => {
    const lvl = MISSION_LEVELS.find((l) => l.id === levelId);
    if (!lvl) return;
    setSelectedLevelId(levelId);
    setSelectedPlanetId(lvl.targetPlanet);
    setSimVariables(lvl.initialVariables);
    if (levelId === "level-5") {
      setActiveSubTab("designer");
    } else {
      setActiveSubTab("flight");
    }
  };

  // Switch planet directly
  const handleSelectPlanet = (planetId: PlanetId) => {
    setSelectedPlanetId(planetId);
    const p = PLANET_CONFIGS[planetId];
    setSimVariables((prev) => ({
      ...prev,
      gravity: p.gravity,
      windStrength: planetId === "moon" ? 0 : prev.windStrength,
      landingPadWidth: p.landingPadWidth,
    }));
  };

  // Flight finished handler from Canvas
  const handleFlightFinished = (result: LandingAttemptResult) => {
    setPreviousResult(currentResult);
    setCurrentResult(result);
    setFlightCount((prev) => prev + 1);

    addCompletedStage("experiment");
    addCompletedStage("observe");

    if (result.outcome === "success" || result.outcome === "rough") {
      markSpaceLandingCompleted(result.planetId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 5-Step Scientific Learning Cycle Header */}
      <LabLearningCycle
        labId="space"
        activeStage={activeStage}
        completedStages={completedStages}
        onSelectStage={(stage) => setActiveStage(stage)}
      />

      {/* STAGE 1: EXPLORE (Inspect Spacecraft Systems & Celestial Gravity) */}
      {activeStage === "explore" && (
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
              Spacecraft Anatomy & Planetary Profiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Explore the Artemis-Class Planetary Lander
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Examine the critical engineering subsystems required to survive descent through
              planetary gravity wells and turbulent atmospheres.
            </p>
          </div>

          {/* Spacecraft Anatomy Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AeroSpike Main Thruster",
                subtitle: "Throttle range: 20% to 100%",
                desc: "Expels supersonic cryogenic gas downward at 3,200 m/s. Generates counter-thrust (F = T) to arrest downward gravitational velocity.",
                icon: "🔥",
                color: "border-orange-500/40 bg-orange-950/20",
              },
              {
                title: "RCS Attitude Quads",
                subtitle: "Cold-gas orientation thrusters",
                desc: "Reaction Control System thrusters mounted on 4 corners. Produce rotational torque (τ = r × F) to keep the spacecraft aligned with the vertical axis.",
                icon: "💨",
                color: "border-purple-500/40 bg-purple-950/20",
              },
              {
                title: "Hydraulic Shock Struts",
                subtitle: "Crushable aluminum honeycomb core",
                desc: "Wide-stance landing legs dissipate up to 4.5 m/s of impact kinetic energy (Ek = ½ m v²), preventing structural damage on touchdown.",
                icon: "🦿",
                color: "border-cyan-500/40 bg-cyan-950/20",
              },
              {
                title: "Cryogenic Propellant Tanks",
                subtitle: "Liquid Methane (CH₄) & Liquid Oxygen (LOX)",
                desc: "Propellant mass accounts for up to 50% of the spacecraft's starting weight. As fuel burns, total mass decreases, increasing net acceleration.",
                icon: "⛽",
                color: "border-emerald-500/40 bg-emerald-950/20",
              },
              {
                title: "Avionics & Laser Altimeter",
                subtitle: "LiDAR terminal guidance computer",
                desc: "Scans surface elevation at 100 Hz. Computes real-time time-to-impact (TTI) and suicide-burn ignition altitudes.",
                icon: "📡",
                color: "border-blue-500/40 bg-blue-950/20",
              },
              {
                title: "Pressurized Command Capsule",
                subtitle: "Life-support & cockpit telemetry",
                desc: "Aerodynamic nose cone housing the crew cabin, artificial horizon attitude indicator, and manual fly-by-wire override stick.",
                icon: "👨‍🚀",
                color: "border-slate-500/40 bg-slate-900/40",
              },
            ].map((subsystem, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-5 space-y-2 shadow-sm transition-all hover:-translate-y-1 ${subsystem.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{subsystem.icon}</span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    Subsystem 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">{subsystem.title}</h3>
                <span className="text-[11px] font-mono text-cyan-400 block">
                  {subsystem.subtitle}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">{subsystem.desc}</p>
              </div>
            ))}
          </div>

          {/* Planetary Comparison Table */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Celestial Gravity Comparison</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.values(PLANET_CONFIGS)
                .filter((p) => p.id !== "custom")
                .map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2 text-left"
                  >
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {p.name}
                    </span>
                    <div className="text-2xl font-black font-mono text-foreground">
                      {p.gravity.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">m/s²</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                    <button
                      onClick={() => {
                        handleSelectPlanet(p.id);
                        setActiveStage("experiment");
                      }}
                      className="w-full rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 py-1.5 text-xs font-bold hover:bg-cyan-600 hover:text-white transition-all mt-2"
                    >
                      Fly on {p.name}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: EXPERIMENT (2D Spacecraft Flight Simulation Canvas) */}
      {activeStage === "experiment" && (
        <div className="space-y-6">
          {/* Mission Level & Navigation Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/70 pb-4">
            {/* Level Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/30 p-1.5 rounded-2xl border border-border/60">
              {MISSION_LEVELS.map((lvl) => {
                const isSelected = selectedLevelId === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => handleSelectLevel(lvl.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{lvl.title.split(":")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Experiment Mode / Sub-Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab("flight")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === "flight"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Rocket className="h-3.5 w-3.5 text-cyan-400" />
                <span>Flight Cockpit</span>
              </button>

              <button
                onClick={() => setActiveSubTab("experiment")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === "experiment"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Scale className="h-3.5 w-3.5 text-amber-400" />
                <span>Experiment Variables</span>
              </button>

              <button
                onClick={() => setActiveSubTab("designer")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  activeSubTab === "designer"
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Sliders className="h-3.5 w-3.5 text-purple-400" />
                <span>Mission Designer</span>
              </button>
            </div>
          </div>

          {/* Current Mission Briefing Ribbon */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                {currentLevel.title} • {currentLevel.difficulty} Difficulty
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">{currentLevel.briefing}</p>
            </div>
            <div className="shrink-0 font-mono text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
              🎯 {currentLevel.missionGoal}
            </div>
          </div>

          {/* SUB-TAB 1: Flight Cockpit */}
          {activeSubTab === "flight" && (
            <div className="space-y-6">
              <SpacecraftCanvas
                planet={activePlanet}
                variables={simVariables}
                onFinishFlight={handleFlightFinished}
                attemptCount={flightCount}
              />
            </div>
          )}

          {/* SUB-TAB 2: Experiment Mode (Adjust physics variables & compare) */}
          {activeSubTab === "experiment" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Interactive Flight Simulation with live variables (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <SpacecraftCanvas
                    planet={activePlanet}
                    variables={simVariables}
                    onFinishFlight={handleFlightFinished}
                    attemptCount={flightCount}
                  />
                </div>

                {/* Right: Physics Variable Sliders Panel (4 cols) */}
                <div className="lg:col-span-4 rounded-3xl border border-border/80 bg-card p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Scale className="h-4 w-4 text-amber-500" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Variable Controls</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Change parameters to test physics effects
                      </p>
                    </div>
                  </div>

                  {/* 1. Gravity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Gravity:</span>
                      <span className="font-mono text-cyan-500 font-bold">
                        {simVariables.gravity.toFixed(2)} m/s²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="15.0"
                      step="0.1"
                      value={simVariables.gravity}
                      onChange={(e) =>
                        setSimVariables((prev) => ({
                          ...prev,
                          gravity: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-cyan-500 bg-muted h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* 2. Spacecraft Mass */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Total Mass:</span>
                      <span className="font-mono text-purple-500 font-bold">
                        {simVariables.mass} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="800"
                      max="2500"
                      step="50"
                      value={simVariables.mass}
                      onChange={(e) =>
                        setSimVariables((prev) => ({
                          ...prev,
                          mass: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-purple-500 bg-muted h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* 3. Fuel Capacity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Fuel Load:</span>
                      <span className="font-mono text-emerald-500 font-bold">
                        {simVariables.fuelCapacity} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="250"
                      step="5"
                      value={simVariables.fuelCapacity}
                      onChange={(e) =>
                        setSimVariables((prev) => ({
                          ...prev,
                          fuelCapacity: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-emerald-500 bg-muted h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* 4. Wind Strength */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">Wind Strength:</span>
                      <span className="font-mono text-amber-500 font-bold">
                        {simVariables.windStrength} m/s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="1"
                      value={simVariables.windStrength}
                      onChange={(e) =>
                        setSimVariables((prev) => ({
                          ...prev,
                          windStrength: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-amber-500 bg-muted h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Quick Reset to Level Defaults */}
                  <button
                    onClick={() => setSimVariables(currentLevel.initialVariables)}
                    className="w-full rounded-xl border border-border bg-muted/40 py-2 text-xs font-medium text-foreground hover:bg-muted transition-all"
                  >
                    Reset Variables to Level Defaults
                  </button>
                </div>
              </div>

              {/* Side-by-Side Attempt Comparison */}
              {currentResult && (
                <MissionComparison
                  currentAttempt={currentResult}
                  previousAttempt={previousResult}
                />
              )}
            </div>
          )}

          {/* SUB-TAB 3: Mission Designer */}
          {activeSubTab === "designer" && (
            <div className="space-y-6">
              <MissionDesigner
                initialVariables={simVariables}
                onApplyCustomVariables={(vars) => {
                  setSelectedPlanetId("custom");
                  setSimVariables(vars);
                  setActiveSubTab("flight");
                }}
              />
            </div>
          )}

          {/* Post-Flight Mission Analysis & Telemetry Charts (Displays automatically after each attempt) */}
          {currentResult && (
            <div className="space-y-6 border-t border-border/80 pt-6">
              <div className="rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h3 className="text-base font-bold text-slate-100">
                        Mission Analysis — Attempt #{currentResult.attemptNumber}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        Touchdown Target: {currentResult.planetName} (g ={" "}
                        {currentResult.gravity.toFixed(2)} m/s²)
                      </span>
                    </div>
                  </div>

                  {/* Outcome Badge */}
                  <div className="flex items-center gap-2">
                    {currentResult.outcome === "success" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-1 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" /> SUCCESSFUL TOUCHDOWN
                      </span>
                    ) : currentResult.outcome === "rough" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 px-3.5 py-1 text-xs font-bold text-amber-300">
                        <AlertTriangle className="h-4 w-4" /> ROUGH TOUCHDOWN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/50 px-3.5 py-1 text-xs font-bold text-red-300">
                        <AlertTriangle className="h-4 w-4" /> CRASH / IMPACT FAILURE
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">DESCENT SPEED</span>
                    <span
                      className={`text-sm font-bold ${
                        Math.abs(currentResult.finalVy) <= 3.0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {Math.abs(currentResult.finalVy).toFixed(1)} m/s
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">MAX DESCENT SPEED</span>
                    <span className="text-sm font-bold text-slate-200">
                      {currentResult.maxVy.toFixed(1)} m/s
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">LATERAL DRIFT</span>
                    <span
                      className={`text-sm font-bold ${
                        Math.abs(currentResult.finalVx) <= 2.0
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {Math.abs(currentResult.finalVx).toFixed(1)} m/s
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">PITCH ANGLE</span>
                    <span
                      className={`text-sm font-bold ${
                        Math.abs(currentResult.finalAngle) <= 10
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {Math.abs(currentResult.finalAngle).toFixed(1)}°
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">FUEL REMAINING</span>
                    <span className="text-sm font-bold text-cyan-300">
                      {currentResult.fuelRemaining.toFixed(1)} kg
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">FLIGHT TIME</span>
                    <span className="text-sm font-bold text-slate-200">
                      {currentResult.flightTime.toFixed(1)} s
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                    <span className="text-[10px] text-slate-400 block">SURFACE GRAVITY</span>
                    <span className="text-sm font-bold text-purple-300">
                      {currentResult.gravity.toFixed(2)} m/s²
                    </span>
                  </div>
                </div>

                {/* Scientific Explanation Callout */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">
                    Scientific Flight Diagnosis:
                  </span>
                  <p className="leading-relaxed text-slate-300 text-xs">
                    {currentResult.scientificExplanation}
                  </p>
                </div>
              </div>

              {/* Telemetry Charts (Altitude vs Time, Velocity vs Time, Fuel vs Time) */}
              <TelemetryCharts
                telemetry={currentResult.telemetryHistory}
                gravity={currentResult.gravity}
              />
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: OBSERVE (Review Flight History & Data Analysis) */}
      {activeStage === "observe" && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
              Observation & Flight Telemetry Records
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Descent Kinematics & Data Evaluation
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Analyze the mathematical relationships between gravitational pull, engine burns, and
              landing impact kinetic energy.
            </p>
          </div>

          {currentResult ? (
            <div className="space-y-6">
              <TelemetryCharts
                telemetry={currentResult.telemetryHistory}
                gravity={currentResult.gravity}
              />

              <MissionComparison currentAttempt={currentResult} previousAttempt={previousResult} />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No Completed Flights Yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Head to the Experiment Stage to pilot a landing on the Moon, Mars, or Earth. Flight
                data and curves will be automatically plotted here.
              </p>
              <button
                onClick={() => setActiveStage("experiment")}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-cyan-500 transition-all"
              >
                Launch Simulation Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: UNDERSTAND / LEARN (Orbital Mechanics & Flight Principles) */}
      {activeStage === "understand" && (
        <div className="space-y-6">
          <SpaceTheoryViewer />
        </div>
      )}

      {/* STAGE 5: QUIZ (8 Conceptual Multiple-Choice Questions) */}
      {activeStage === "quiz" && (
        <div className="space-y-6">
          <QuizRunner
            labId="space"
            labTitle="Space Landing Lab: Newton's Laws & Planetary Descent"
            questions={SPACE_QUIZ_QUESTIONS}
            onFinish={() => addCompletedStage("quiz")}
          />
        </div>
      )}
    </div>
  );
};
