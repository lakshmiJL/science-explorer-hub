import React, { useState } from "react";
import { COMPOUNDS, REACTIONS, CHEMISTRY_QUIZ } from "../../data/chemistryData";
import { Compound, ChemicalReaction } from "../../types/science";
import { useLabProgress } from "../../context/LabProgressContext";
import { QuizRunner } from "../quiz/QuizRunner";
import { LabLearningCycle, LearningStage } from "../common/LabLearningCycle";
import { Molecule3DViewer } from "./Molecule3DViewer";
import { ChemicalBondingSimulator } from "./ChemicalBondingSimulator";
import {
  Beaker,
  Flame,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Play,
  Atom,
  Eye,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Move,
  Layers,
  Info,
  Zap,
} from "lucide-react";

export const ChemicalReactionLab: React.FC = () => {
  const { markReactionCompleted, progress } = useLabProgress();
  const [learningStage, setLearningStage] = useState<LearningStage>("experiment");
  const [completedStages, setCompletedStages] = useState<LearningStage[]>(["explore"]);
  const [selectedReactants, setSelectedReactants] = useState<string[]>([]);
  const [applyHeat, setApplyHeat] = useState(false);
  const [reactionState, setReactionState] = useState<"idle" | "reacting" | "completed">("idle");
  const [matchedReaction, setMatchedReaction] = useState<ChemicalReaction | null>(null);
  const [viewMode, setViewMode] = useState<"simple" | "molecular">("simple");
  const [showBondingAnimation, setShowBondingAnimation] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inspectedCompound, setInspectedCompound] = useState<Compound | null>(null);
  const [showWhatAmISeeing, setShowWhatAmISeeing] = useState(true);

  const addCompletedStage = (stage: LearningStage) => {
    setCompletedStages((prev) => (prev.includes(stage) ? prev : [...prev, stage]));
  };

  // Helper to add/remove a reactant
  const toggleReactant = (compoundId: string) => {
    if (reactionState === "reacting") return;
    setReactionState("idle");
    setMatchedReaction(null);

    setSelectedReactants((prev) => {
      if (prev.includes(compoundId)) {
        return prev.filter((id) => id !== compoundId);
      } else {
        if (prev.length >= 2) {
          return [prev[0]!, compoundId];
        }
        return [...prev, compoundId];
      }
    });
    addCompletedStage("experiment");
  };

  const handleDragStart = (e: React.DragEvent, compoundId: string) => {
    e.dataTransfer.setData("text/plain", compoundId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const compoundId = e.dataTransfer.getData("text/plain");
    if (compoundId && COMPOUNDS[compoundId]) {
      if (!selectedReactants.includes(compoundId)) {
        toggleReactant(compoundId);
      }
    }
  };

  const handleClearChamber = () => {
    setSelectedReactants([]);
    setReactionState("idle");
    setMatchedReaction(null);
    setShowBondingAnimation(false);
  };

  const findMatchingReaction = () => {
    return REACTIONS.find((rx) => {
      if (rx.id === "thermal-decomposition-carbonate") {
        return selectedReactants.length === 1 && selectedReactants[0] === "caco3" && applyHeat;
      }
      if (rx.reactants.length !== selectedReactants.length) return false;
      return rx.reactants.every((r) => selectedReactants.includes(r));
    });
  };

  const handleStartReaction = () => {
    const rx = findMatchingReaction();
    if (!rx) return;

    setReactionState("reacting");
    setMatchedReaction(rx);
    setShowBondingAnimation(true);
    addCompletedStage("experiment");

    setTimeout(() => {
      setReactionState("completed");
      markReactionCompleted(rx.id);
      addCompletedStage("observe");
      addCompletedStage("understand");
    }, 2800);
  };

  const potentialMatch = findMatchingReaction();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-background to-background p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-500">Module 01</span>
              <span>·</span>
              <span>Ages 11–16</span>
              <span>·</span>
              <span>Conservation of Mass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
              Chemical Reaction Lab
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Molecular Alchemy: From Reactants to Products · Combine compounds and observe chemical
              change
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhatAmISeeing(!showWhatAmISeeing)}
              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>{showWhatAmISeeing ? "Hide Guidance" : "What Am I Seeing?"}</span>
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
          colorTheme="emerald"
        />
      </div>

      {/* "What Am I Seeing?" Contextual Guidance Box */}
      {showWhatAmISeeing && learningStage === "experiment" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-foreground/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
            <Info className="h-4 w-4 shrink-0" />
            <span>Virtual Lab Experiment Instructions</span>
          </div>
          <p className="leading-relaxed">
            Drag and drop or click up to <strong>two reactants</strong> from the left shelf into the
            central chamber. If the compounds undergo a chemical reaction (such as Hydrochloric Acid
            + Sodium Hydroxide, or Iron + Oxygen), the <strong>Initiate Reaction</strong> button
            will become active. Watch bonds break and atoms rearrange into brand new product
            substances!
          </p>
        </div>
      )}

      {/* STAGE: EXPERIMENT or OBSERVE */}
      {(learningStage === "experiment" || learningStage === "observe") && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Reactant Shelf (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-bold text-sm text-foreground">Reactant Chemical Shelf</h3>
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Move className="h-3 w-3" /> Drag or Click
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                {Object.values(COMPOUNDS)
                  .filter((c) =>
                    [
                      "hcl",
                      "naoh",
                      "fe",
                      "o2",
                      "h2",
                      "nahco3",
                      "ch3cooh",
                      "cuso4",
                      "zn",
                      "caco3",
                    ].includes(c.id),
                  )
                  .map((compound) => {
                    const isSelected = selectedReactants.includes(compound.id);
                    return (
                      <div
                        key={compound.id}
                        draggable={reactionState !== "reacting"}
                        onDragStart={(e) => handleDragStart(e, compound.id)}
                        onClick={() => toggleReactant(compound.id)}
                        className={`group relative flex cursor-grab active:cursor-grabbing flex-col items-start rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/50"
                            : "border-border/70 bg-background/80 hover:border-emerald-500/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
                            {compound.formula}
                          </span>
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: compound.color }}
                          />
                        </div>
                        <span className="mt-2 text-xs font-semibold text-foreground line-clamp-1">
                          {compound.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {compound.category} · {compound.state}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-emerald-500">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Bunsen Heat Source Toggle */}
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame
                      className={`h-4 w-4 ${applyHeat ? "text-orange-500 animate-pulse" : "text-muted-foreground"}`}
                    />
                    <div>
                      <span className="text-xs font-semibold text-foreground">
                        Bunsen Heat Source
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Thermal energy for endothermic decomposition
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setApplyHeat(!applyHeat)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      applyHeat
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {applyHeat ? "Heat ON" : "Heat OFF"}
                  </button>
                </div>
              </div>

              {/* Virtual Safety Notice */}
              <div className="flex items-start gap-2 rounded-xl border border-border/70 bg-muted/20 p-3 text-[11px] text-muted-foreground">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <span>
                  <strong>Virtual Laboratory Safety:</strong> This digital simulator is designed
                  strictly for educational experimentation and conceptual learning. Never mix real
                  household chemicals or acids without professional laboratory facilities and
                  certified instruction.
                </span>
              </div>
            </div>

            {/* Quick 3D Molecule Inspector */}
            {inspectedCompound && <Molecule3DViewer compound={inspectedCompound} />}
          </div>

          {/* Right: Central Reaction Chamber (8 cols) */}
          <div className="space-y-4 lg:col-span-8">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Atom className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Central Reaction Chamber
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedReactants.length === 0
                        ? "Chamber is empty — drag or click compounds from the shelf"
                        : `${selectedReactants.length} reactant(s) loaded`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Molecule 3D View Toggle */}
                  <button
                    onClick={() => setViewMode(viewMode === "simple" ? "molecular" : "simple")}
                    className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{viewMode === "simple" ? "3D Structure View" : "Simple View"}</span>
                  </button>

                  {/* Element Bonding View Toggle */}
                  {(matchedReaction || potentialMatch) && (
                    <button
                      onClick={() => setShowBondingAnimation(!showBondingAnimation)}
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                        showBondingAnimation
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                          : "border-border/80 bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{showBondingAnimation ? "Chamber View" : "Element Bonding View"}</span>
                    </button>
                  )}

                  <button
                    onClick={handleClearChamber}
                    className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-red-500 hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Chamber</span>
                  </button>
                </div>
              </div>

              {/* Central Viewport with Drag-and-Drop Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-2xl border transition-all duration-200 bg-slate-950 p-6 text-white shadow-inner ${
                  isDragOver
                    ? "border-emerald-400 bg-emerald-950/20 ring-4 ring-emerald-500/30"
                    : "border-emerald-500/20"
                }`}
              >
                {/* Background grid */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Flame effect */}
                {applyHeat && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 pointer-events-none">
                    <div className="h-10 w-12 rounded-t-full bg-gradient-to-t from-orange-600 via-amber-400 to-transparent blur-sm animate-pulse" />
                    <div className="h-14 w-14 rounded-t-full bg-gradient-to-t from-red-600 via-yellow-300 to-transparent blur-sm animate-ping opacity-75" />
                    <div className="h-10 w-12 rounded-t-full bg-gradient-to-t from-orange-600 via-amber-400 to-transparent blur-sm animate-pulse" />
                  </div>
                )}

                {/* Empty Chamber */}
                {selectedReactants.length === 0 && reactionState === "idle" && (
                  <div className="z-10 flex flex-col items-center text-center p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-3">
                      <Beaker className="h-8 w-8" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-200">
                      Reaction Chamber Awaiting Compounds
                    </h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-400">
                      Drag and drop chemicals here or click on the shelf items to load them into the
                      reaction beaker.
                    </p>
                  </div>
                )}

                {/* Element Bonding Simulator View */}
                {showBondingAnimation && (matchedReaction || potentialMatch) ? (
                  <div className="z-10 w-full animate-in zoom-in-95 duration-300">
                    <ChemicalBondingSimulator
                      reaction={matchedReaction || potentialMatch!}
                      onClose={() => setShowBondingAnimation(false)}
                    />
                  </div>
                ) : (
                  <>
                    {/* Loaded Reactants */}
                    {selectedReactants.length > 0 && reactionState === "idle" && (
                      <div className="z-10 flex w-full flex-col items-center justify-center space-y-6">
                        <div className="flex flex-wrap items-center justify-center gap-6">
                          {selectedReactants.map((rId) => {
                            const comp = COMPOUNDS[rId]!;
                            return (
                              <div
                                key={rId}
                                onClick={() => setInspectedCompound(comp)}
                                className="flex cursor-pointer flex-col items-center rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 backdrop-blur-md transition-all hover:scale-105 hover:border-emerald-400"
                                title="Click to inspect 3D molecule"
                              >
                                <span className="font-mono text-3xl font-black text-emerald-400">
                                  {comp.formula}
                                </span>
                                <span className="mt-1 text-xs font-semibold text-slate-200">
                                  {comp.name}
                                </span>
                                <span className="text-[10px] text-slate-400 capitalize">
                                  ({comp.state})
                                </span>

                                {/* Atom preview dots */}
                                <div className="mt-3 flex items-center gap-1">
                                  {comp.atoms.map((at, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-0.5 rounded-full border border-white/20 px-1.5 py-0.5 text-[9px]"
                                    >
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: at.color }}
                                      />
                                      <span>
                                        {at.element}
                                        {at.count > 1 ? at.count : ""}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Compatibility feedback */}
                        <div className="text-center">
                          {potentialMatch ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-300">
                                Compatible Reaction Identified: {potentialMatch.name}
                              </span>
                              <button
                                onClick={handleStartReaction}
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
                              >
                                <Play className="h-4 w-4 fill-current" />
                                Initiate Reaction
                              </button>
                            </div>
                          ) : (
                            <div className="max-w-md rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                              {selectedReactants.length === 1 &&
                              selectedReactants[0] === "caco3" &&
                              !applyHeat ? (
                                <span>
                                  Calcium carbonate requires heat! Turn on the{" "}
                                  <strong>Bunsen Heat Source</strong>.
                                </span>
                              ) : selectedReactants.length === 1 ? (
                                <span>
                                  Add another compound to form a complete reaction mixture.
                                </span>
                              ) : (
                                <span>
                                  These two compounds do not readily react under standard
                                  conditions. Try HCl + NaOH, Fe + O₂, or CuSO₄ + Zn.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* State: Reacting */}
                    {reactionState === "reacting" && (
                      <div className="z-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative flex h-24 w-24 items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                          <Atom className="h-12 w-12 text-emerald-400 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-emerald-300">
                            Molecular Bonds Severing & Recombining...
                          </h4>
                          <p className="text-xs text-slate-400 max-w-sm">
                            Molecules collide with activation energy. Old chemical bonds break and
                            new bonds form!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* State: Completed Products */}
                    {reactionState === "completed" && matchedReaction && (
                      <div className="z-10 flex w-full flex-col items-center justify-center space-y-5 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                          <Sparkles className="h-3.5 w-3.5" /> Reaction Complete:{" "}
                          {matchedReaction.type}
                        </div>

                        {/* Product Cards */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          {matchedReaction.products.map((pId) => {
                            const productComp = COMPOUNDS[pId]!;
                            return (
                              <div
                                key={pId}
                                onClick={() => setInspectedCompound(productComp)}
                                className="flex cursor-pointer flex-col items-center rounded-2xl border border-emerald-400/50 bg-slate-900/90 p-4 shadow-lg backdrop-blur-md transition-all hover:scale-105"
                                title="Click to inspect 3D molecule"
                              >
                                <span className="font-mono text-3xl font-black text-emerald-300">
                                  {productComp.formula}
                                </span>
                                <span className="mt-1 text-xs font-bold text-slate-100">
                                  {productComp.name}
                                </span>
                                <span className="text-[10px] text-slate-400 capitalize">
                                  ({productComp.state})
                                </span>

                                <div className="mt-3 flex items-center gap-1">
                                  {productComp.atoms.map((at, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-0.5 rounded-full border border-white/20 px-1.5 py-0.5 text-[9px]"
                                    >
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: at.color }}
                                      />
                                      <span>
                                        {at.element}
                                        {at.count > 1 ? at.count : ""}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Balanced Chemical Equation */}
                        <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 px-5 py-2.5 text-center">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Balanced Chemical Equation:
                          </span>
                          <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono tracking-wide mt-0.5">
                            {matchedReaction.equation}
                          </div>
                          <div className="text-xs text-slate-300 mt-1">
                            {matchedReaction.wordEquation}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={() => setShowBondingAnimation(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all active:scale-95"
                          >
                            <Zap className="h-3.5 w-3.5 text-emerald-400" /> View Element Bonding
                          </button>
                          <button
                            onClick={handleStartReaction}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Replay Reaction
                          </button>
                          <button
                            onClick={handleClearChamber}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all"
                          >
                            Try Another Reaction
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* COMPLETE LEARNING PANEL (What are the reactants? What happens? etc.) */}
              {matchedReaction && reactionState === "completed" && (
                <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-emerald-500" />
                      <h3 className="font-bold text-sm text-foreground">
                        Scientific Learning Panel: {matchedReaction.name}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500">
                      Law of Conservation of Mass
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        What are the reactants?
                      </span>
                      <p className="text-xs text-foreground font-medium">
                        {matchedReaction.reactants
                          .map((rId) => `${COMPOUNDS[rId]?.name} (${COMPOUNDS[rId]?.formula})`)
                          .join(" and ")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        What are the products?
                      </span>
                      <p className="text-xs text-foreground font-medium">
                        {matchedReaction.products
                          .map((pId) => `${COMPOUNDS[pId]?.name} (${COMPOUNDS[pId]?.formula})`)
                          .join(" and ")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        What happens to the atoms?
                      </span>
                      <p className="text-xs text-foreground leading-relaxed">
                        {matchedReaction.atomRearrangement}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        Physical or Chemical Change?
                      </span>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        True Chemical Change. Old chemical bonds broke, new chemical bonds formed,
                        and the original substances cannot be separated by physical filtering.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE: EXPLORE */}
      {learningStage === "explore" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border/80 bg-card p-6">
            <h3 className="text-lg font-bold text-foreground">Catalog of Chemical Reactions</h3>
            <p className="text-xs text-muted-foreground">
              Explore the library of supported chemical transformations to inspect their balanced
              equations, reactants, and energy profiles.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REACTIONS.map((rx) => {
                const isCompleted = progress.chemistryExperimentsCompleted.includes(rx.id);
                return (
                  <div
                    key={rx.id}
                    className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background/80 p-5 transition-all hover:border-emerald-500/50 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                          {rx.type}
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                            <CheckCircle className="h-3 w-3" /> Tested
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 text-base font-bold text-foreground">{rx.name}</h4>
                      <div className="mt-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        {rx.equation}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {rx.changeDescription}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedReactants(rx.reactants);
                        if (rx.id === "thermal-decomposition-carbonate") setApplyHeat(true);
                        setLearningStage("experiment");
                        addCompletedStage("experiment");
                      }}
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    >
                      Load into Chamber <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STAGE: UNDERSTAND (Molecular Theory) */}
      {learningStage === "understand" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Chemical Change vs. Physical Change
              </h3>
              <p className="text-xs text-muted-foreground">
                How scientists distinguish a true molecular reaction from simple mixing or state
                changes
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle className="h-5 w-5" />
                  <span>Chemical Reaction</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  Chemical bonds between atoms are severed and reformed into entirely new substances
                  with distinct chemical and physical properties.
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="font-semibold text-foreground">Key Indicators:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Spontaneous temperature change (exothermic or endothermic)</li>
                    <li>Irreversible color transformation (e.g. oxidation of iron)</li>
                    <li>Gas effervescence / bubbling (e.g. CO₂ release)</li>
                    <li>Formation of an insoluble precipitate solid</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <Layers className="h-5 w-5" />
                  <span>Physical Change</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  The matter changes appearance, state, or volume, but the molecular chemical
                  identity remains unaltered.
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="font-semibold text-foreground">Everyday Examples:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Melting ice into liquid water (H₂O solid → H₂O liquid)</li>
                    <li>Dissolving sugar or salt in water</li>
                    <li>Chopping wood or shattering glass</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conservation of Mass callout */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
              <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Law of Conservation of Mass (Antoine Lavoisier)
              </h4>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                In any closed chemical reaction, matter is neither created nor destroyed. The total
                mass of all reactants equals the total mass of all products. Every single atom
                present at the start exists at the end — they have simply broken old bonds and
                formed new partnerships!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE: QUIZ */}
      {learningStage === "quiz" && (
        <QuizRunner
          labId="chemistry"
          labTitle="Chemical Reactions"
          questions={CHEMISTRY_QUIZ}
          onFinish={() => addCompletedStage("quiz")}
        />
      )}
    </div>
  );
};
