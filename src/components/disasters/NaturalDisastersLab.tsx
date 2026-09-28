import React, { useState, useEffect } from "react";
import { DISASTERS_DATA, DISASTERS_QUIZ } from "../../data/disastersData";
import { DisasterType, DisasterInfo } from "../../types/science";
import { useLabProgress } from "../../context/LabProgressContext";
import { QuizRunner } from "../quiz/QuizRunner";
import { LabLearningCycle, LearningStage } from "../common/LabLearningCycle";
import { RealisticDisasterSimulator } from "./RealisticDisasterSimulator";
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
            <RealisticDisasterSimulator
              disasterType={selectedDisasterId}
              variables={variables}
              isSimulating={isSimulating}
              onToggleSimulate={() =>
                isSimulating ? setIsSimulating(false) : handleStartSimulation()
              }
              onReset={handleResetSimulation}
            />

            {/* Scientific principle footer banner */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-xs text-foreground/90 space-y-1">
              <span className="font-bold text-amber-500 uppercase tracking-wider text-[11px]">
                Scientific Principle:
              </span>
              <p className="leading-relaxed">{currentDisaster.tagline}</p>
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
