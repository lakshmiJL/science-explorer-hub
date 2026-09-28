import React, { useState } from "react";
import {
  GENETIC_TRAITS,
  INITIAL_PARENTS,
  CREATURE_NAME_PREFIXES,
  CREATURE_NAME_SUFFIXES,
  CREATURE_TITLES,
  GENETICS_QUIZ,
} from "../../data/geneticsData";
import { GeneticTrait, ParentCreature, OffspringCreature } from "../../types/science";
import { useLabProgress } from "../../context/LabProgressContext";
import { QuizRunner } from "../quiz/QuizRunner";
import { LabLearningCycle, LearningStage } from "../common/LabLearningCycle";
import {
  Dna,
  Sparkles,
  RotateCcw,
  Layers,
  Shuffle,
  Info,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

export const DnaGeneticsLab: React.FC = () => {
  const { recordOffspringCreated, progress } = useLabProgress();
  const [learningStage, setLearningStage] = useState<LearningStage>("experiment");
  const [completedStages, setCompletedStages] = useState<LearningStage[]>(["explore"]);
  const [parentA, setParentA] = useState<ParentCreature>(INITIAL_PARENTS.parentA);
  const [parentB, setParentB] = useState<ParentCreature>(INITIAL_PARENTS.parentB);
  const [selectedTraitForHighlight, setSelectedTraitForHighlight] = useState<GeneticTrait>(
    GENETIC_TRAITS[0]!,
  );
  const [isBreeding, setIsBreeding] = useState(false);
  const [offspring, setOffspring] = useState<OffspringCreature | null>(null);
  const [selectedBasePair, setSelectedBasePair] = useState<string | null>(null);
  const [showGuidance, setShowGuidance] = useState(true);

  const addCompletedStage = (stage: LearningStage) => {
    setCompletedStages((prev) => (prev.includes(stage) ? prev : [...prev, stage]));
  };

  // Punnett square calculation
  const calculatePunnett = (trait: GeneticTrait) => {
    const pAGen = parentA.genotypes[trait.category] ?? [
      trait.dominantAllele.symbol,
      trait.recessiveAllele.symbol,
    ];
    const pBGen = parentB.genotypes[trait.category] ?? [
      trait.recessiveAllele.symbol,
      trait.recessiveAllele.symbol,
    ];

    const combos = [
      [pAGen[0]!, pBGen[0]!].sort().join(""),
      [pAGen[0]!, pBGen[1]!].sort().join(""),
      [pAGen[1]!, pBGen[0]!].sort().join(""),
      [pAGen[1]!, pBGen[1]!].sort().join(""),
    ];

    const domSymbol = trait.dominantAllele.symbol;
    const recSymbol = trait.recessiveAllele.symbol;
    const recHom = recSymbol + recSymbol;

    const domCount = combos.filter((c) => c.includes(domSymbol)).length;
    const recCount = combos.filter((c) => c === recHom).length;

    return {
      pAGen,
      pBGen,
      combos,
      dominantPct: (domCount / 4) * 100,
      recessivePct: (recCount / 4) * 100,
      domSymbol,
      recSymbol,
    };
  };

  const handleBreedOffspring = () => {
    setIsBreeding(true);
    addCompletedStage("experiment");

    setTimeout(() => {
      const newGenotypes: Record<string, [string, string]> = {};
      const newPhenotypes: Record<
        string,
        { name: string; visualValue: string; inheritedFrom: string }
      > = {};

      let dominantTraitsCount = 0;
      let recessiveTraitsCount = 0;

      GENETIC_TRAITS.forEach((trait) => {
        const allelesA = parentA.genotypes[trait.category] ?? [
          trait.dominantAllele.symbol,
          trait.recessiveAllele.symbol,
        ];
        const allelesB = parentB.genotypes[trait.category] ?? [
          trait.recessiveAllele.symbol,
          trait.recessiveAllele.symbol,
        ];

        const pickedA = allelesA[Math.floor(Math.random() * 2)]!;
        const pickedB = allelesB[Math.floor(Math.random() * 2)]!;

        const pair: [string, string] = [pickedA, pickedB];
        newGenotypes[trait.category] = pair;

        const hasDominant = pair.includes(trait.dominantAllele.symbol);
        if (hasDominant) {
          dominantTraitsCount++;
          const source = pickedA === trait.dominantAllele.symbol ? parentA.name : parentB.name;
          newPhenotypes[trait.category] = {
            name: trait.dominantAllele.name,
            visualValue: trait.dominantAllele.visualValue,
            inheritedFrom: source,
          };
        } else {
          recessiveTraitsCount++;
          newPhenotypes[trait.category] = {
            name: trait.recessiveAllele.name,
            visualValue: trait.recessiveAllele.visualValue,
            inheritedFrom: "Both parents (homozygous recessive)",
          };
        }
      });

      const prefix =
        CREATURE_NAME_PREFIXES[Math.floor(Math.random() * CREATURE_NAME_PREFIXES.length)]!;
      const suffix =
        CREATURE_NAME_SUFFIXES[Math.floor(Math.random() * CREATURE_NAME_SUFFIXES.length)]!;
      const title = CREATURE_TITLES[Math.floor(Math.random() * CREATURE_TITLES.length)]!;

      const createdOffspring: OffspringCreature = {
        id: `offspring-${Date.now()}`,
        name: `${prefix}${suffix}`,
        title,
        parents: { parentA: parentA.name, parentB: parentB.name },
        genotypes: newGenotypes,
        phenotypes: newPhenotypes,
        dominantCount: dominantTraitsCount,
        recessiveCount: recessiveTraitsCount,
        rarityScore:
          recessiveTraitsCount >= 3
            ? "Mythic Recessive"
            : recessiveTraitsCount >= 2
              ? "Rare Hybrida"
              : "Classic Dominant",
        bornTimestamp: Date.now(),
      };

      setOffspring(createdOffspring);
      setIsBreeding(false);
      recordOffspringCreated();
      addCompletedStage("observe");
      addCompletedStage("understand");
    }, 1800);
  };

  const currentPunnett = calculatePunnett(selectedTraitForHighlight);

  const cycleParentAllele = (parentId: "parentA" | "parentB", category: string) => {
    const parent = parentId === "parentA" ? parentA : parentB;
    const trait = GENETIC_TRAITS.find((t) => t.category === category)!;
    const dom = trait.dominantAllele.symbol;
    const rec = trait.recessiveAllele.symbol;

    const current = (parent.genotypes[category] ?? [dom, rec]).join("");
    let next: [string, string];
    if (current === `${dom}${dom}`) {
      next = [dom, rec];
    } else if (current === `${dom}${rec}` || current === `${rec}${dom}`) {
      next = [rec, rec];
    } else {
      next = [dom, dom];
    }

    if (parentId === "parentA") {
      setParentA({
        ...parentA,
        genotypes: { ...parentA.genotypes, [category]: next },
      });
    } else {
      setParentB({
        ...parentB,
        genotypes: { ...parentB.genotypes, [category]: next },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-background to-background p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-purple-400">Module 02</span>
              <span>·</span>
              <span>Ages 11–16</span>
              <span>·</span>
              <span>Mendelian Inheritance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
              DNA & Genetics Lab
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Genome Garden: Create a Living Legacy · Explore alleles, Punnett probability, and
              double helix codons
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
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
          colorTheme="purple"
        />
      </div>

      {/* Guidance Notice */}
      {showGuidance && learningStage === "experiment" && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 text-xs text-foreground/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
            <Info className="h-4 w-4 shrink-0" />
            <span>Genetics Garden Guidance</span>
          </div>
          <p className="leading-relaxed">
            Select traits for fictional creature parents <strong>Parent Alpha</strong> and{" "}
            <strong>Parent Beta</strong>. Click on any trait to track its exact locus on the
            bioluminescent DNA double helix. Click <strong>Create Offspring</strong> to simulate
            meiosis, allele segregation, and fertilization. Try breeding multiple offspring to
            observe sibling phenotypic variation!
          </p>
        </div>
      )}

      {/* STAGE: EXPERIMENT or OBSERVE */}
      {(learningStage === "experiment" || learningStage === "observe") && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Parent Selectors (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            {/* Parent A Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                    A
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{parentA.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{parentA.title}</p>
                  </div>
                </div>
                <span className="text-[10px] rounded-full bg-cyan-500/10 px-2.5 py-0.5 font-mono text-cyan-400 font-semibold">
                  Parent Alpha
                </span>
              </div>

              <div className="space-y-2">
                {GENETIC_TRAITS.map((trait) => {
                  const currentGen = parentA.genotypes[trait.category] ?? [
                    trait.dominantAllele.symbol,
                    trait.recessiveAllele.symbol,
                  ];
                  const isDom = currentGen.includes(trait.dominantAllele.symbol);
                  return (
                    <div
                      key={trait.id}
                      onClick={() => setSelectedTraitForHighlight(trait)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                        selectedTraitForHighlight.id === trait.id
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-border/60 bg-background/50 hover:bg-muted/30"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-foreground">{trait.name}</span>
                        <div className="text-[10px] text-muted-foreground">
                          {isDom ? trait.dominantAllele.name : trait.recessiveAllele.name}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleParentAllele("parentA", trait.category);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 font-mono text-[11px] font-bold text-foreground hover:bg-muted/80"
                        title="Click to cycle alleles: Homozygous Dominant → Heterozygous → Homozygous Recessive"
                      >
                        <span>{currentGen.join("")}</span>
                        <Shuffle className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parent B Card */}
            <div className="rounded-2xl border border-purple-500/30 bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 text-xs font-bold">
                    B
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{parentB.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{parentB.title}</p>
                  </div>
                </div>
                <span className="text-[10px] rounded-full bg-purple-500/10 px-2.5 py-0.5 font-mono text-purple-400 font-semibold">
                  Parent Beta
                </span>
              </div>

              <div className="space-y-2">
                {GENETIC_TRAITS.map((trait) => {
                  const currentGen = parentB.genotypes[trait.category] ?? [
                    trait.recessiveAllele.symbol,
                    trait.recessiveAllele.symbol,
                  ];
                  const isDom = currentGen.includes(trait.dominantAllele.symbol);
                  return (
                    <div
                      key={trait.id}
                      onClick={() => setSelectedTraitForHighlight(trait)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                        selectedTraitForHighlight.id === trait.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-border/60 bg-background/50 hover:bg-muted/30"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-foreground">{trait.name}</span>
                        <div className="text-[10px] text-muted-foreground">
                          {isDom ? trait.dominantAllele.name : trait.recessiveAllele.name}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleParentAllele("parentB", trait.category);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 font-mono text-[11px] font-bold text-foreground hover:bg-muted/80"
                        title="Click to cycle alleles"
                      >
                        <span>{currentGen.join("")}</span>
                        <Shuffle className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Glowing Double Helix & Offspring (7 cols) */}
          <div className="space-y-4 lg:col-span-7">
            {/* Visual Connection Breadcrumb */}
            <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-muted/20 px-4 py-2 text-xs font-semibold text-purple-400">
              <span>DNA Double Helix</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Gene Locus ({selectedTraitForHighlight.geneLocus})</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                Alleles ({selectedTraitForHighlight.dominantAllele.symbol}/
                {selectedTraitForHighlight.recessiveAllele.symbol})
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Expressed Trait ({selectedTraitForHighlight.name})</span>
            </div>

            {/* Glowing Double Helix Visualizer */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-purple-400" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Bioluminescent DNA Double Helix
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Click base pairs to inspect hydrogen bond rules
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                  {selectedTraitForHighlight.name}
                </span>
              </div>

              {/* Animated Double Helix SVG */}
              <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-purple-500/20 bg-slate-950 p-4">
                <div className="flex w-full max-w-lg items-center justify-between gap-1">
                  {[
                    { id: 1, pair: "A-T", locus: false },
                    { id: 2, pair: "C-G", locus: false },
                    { id: 3, pair: "T-A", locus: false },
                    { id: 4, pair: "G-C", locus: false },
                    { id: 5, pair: "A-T", locus: false },
                    { id: 6, pair: "C-G", locus: true }, // Gene locus
                    { id: 7, pair: "T-A", locus: false },
                    { id: 8, pair: "G-C", locus: false },
                    { id: 9, pair: "A-T", locus: false },
                    { id: 10, pair: "C-G", locus: false },
                    { id: 11, pair: "T-A", locus: false },
                    { id: 12, pair: "G-C", locus: false },
                  ].map((rung) => (
                    <div
                      key={rung.id}
                      onClick={() => setSelectedBasePair(rung.pair)}
                      className="group flex cursor-pointer flex-col items-center justify-center gap-1"
                      title={`Base pair ${rung.pair} - Click to inspect`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                          rung.locus
                            ? "bg-purple-400 ring-4 ring-purple-500/50 scale-125 shadow-lg shadow-purple-500/50"
                            : "bg-cyan-400/80 group-hover:bg-cyan-300"
                        }`}
                      />
                      <div
                        className={`w-1 rounded-full transition-all ${
                          rung.locus
                            ? "h-14 bg-gradient-to-b from-purple-400 to-pink-500"
                            : "h-10 bg-slate-700 group-hover:bg-slate-500"
                        }`}
                      />
                      <div
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                          rung.locus
                            ? "bg-pink-400 ring-4 ring-pink-500/50 scale-125 shadow-lg shadow-pink-500/50"
                            : "bg-purple-400/80 group-hover:bg-purple-300"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-2 left-4 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>
                    Highlighted Locus: <strong>{selectedTraitForHighlight.geneLocus}</strong>
                  </span>
                </div>
              </div>

              {/* Base Pair Callout */}
              {selectedBasePair && (
                <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs">
                  <span className="font-semibold text-foreground">
                    Selected Base Pair: {selectedBasePair}
                  </span>
                  <span className="text-muted-foreground">
                    {selectedBasePair.includes("A")
                      ? "Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds"
                      : "Cytosine (C) pairs with Guanine (G) via 3 hydrogen bonds"}
                  </span>
                </div>
              )}

              {/* CREATE OFFSPRING BUTTON */}
              <div className="flex justify-center pt-2">
                <button
                  disabled={isBreeding}
                  onClick={handleBreedOffspring}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isBreeding ? (
                    <>
                      <Dna className="h-5 w-5 animate-spin" />
                      <span>Simulating Meiosis & Fertilization...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Create Offspring</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* OFFSPRING RESULT DISPLAY */}
            {offspring && (
              <div className="rounded-2xl border border-purple-500/30 bg-card p-6 shadow-xl animate-in zoom-in-95 duration-300 space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-foreground">{offspring.name}</h4>
                      <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                        {offspring.rarityScore}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{offspring.title}</p>
                  </div>

                  <button
                    onClick={handleBreedOffspring}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-purple-400" />
                    <span>Try Another Offspring (Sibling)</span>
                  </button>
                </div>

                {/* Creature Visual Representation */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center shadow-inner">
                  <div
                    className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 transition-all duration-500"
                    style={{
                      borderColor: offspring.phenotypes.furColor?.visualValue || "#a855f7",
                      boxShadow: `0 0 35px ${offspring.phenotypes.furColor?.visualValue || "#a855f7"}40`,
                    }}
                  >
                    <Sparkles
                      className="h-12 w-12 transition-transform duration-700"
                      style={{
                        color: offspring.phenotypes.furColor?.visualValue || "#a855f7",
                      }}
                    />
                    <div className="absolute -top-2 rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-[9px] font-bold text-slate-300">
                      {offspring.phenotypes.horns?.name}
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-300 font-medium">
                    Expressed Phenotype: {offspring.dominantCount} Dominant Traits ·{" "}
                    {offspring.recessiveCount} Recessive Traits
                  </div>
                </div>

                {/* Trait Inheritance Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Genotype & Phenotype Inheritance Breakdown
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {GENETIC_TRAITS.map((trait) => {
                      const pheno = offspring.phenotypes[trait.category];
                      const geno = offspring.genotypes[trait.category]?.join("");
                      return (
                        <div
                          key={trait.id}
                          className="rounded-xl border border-border/70 bg-background/60 p-3 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">{trait.name}</span>
                            <span className="font-mono text-[10px] font-bold rounded bg-muted px-1.5 py-0.5">
                              {geno}
                            </span>
                          </div>
                          <div className="text-purple-500 dark:text-purple-300 font-semibold">
                            {pheno?.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Origin: {pheno?.inheritedFrom}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE: EXPLORE / PUNNETT PROBABILITY */}
      {learningStage === "explore" && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Punnett Square Probability Calculator
            </h3>
            <p className="text-xs text-muted-foreground">
              Select any trait category to visualize the 2×2 Mendelian probability grid based on the
              two current parents.
            </p>
          </div>

          {/* Trait Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {GENETIC_TRAITS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTraitForHighlight(t)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  selectedTraitForHighlight.id === t.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* 2x2 Punnett Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-muted/20 p-6">
              <span className="mb-4 text-xs font-semibold text-muted-foreground">
                Parent A ({currentPunnett.pAGen.join("")}) × Parent B (
                {currentPunnett.pBGen.join("")})
              </span>

              <div className="inline-grid grid-cols-3 gap-2 text-center font-mono">
                <div className="flex items-center justify-center p-3 text-xs text-muted-foreground font-bold">
                  P_A \ P_B
                </div>
                <div className="flex items-center justify-center rounded-lg bg-purple-500/10 p-3 font-bold text-purple-400">
                  {currentPunnett.pBGen[0]}
                </div>
                <div className="flex items-center justify-center rounded-lg bg-purple-500/10 p-3 font-bold text-purple-400">
                  {currentPunnett.pBGen[1]}
                </div>

                <div className="flex items-center justify-center rounded-lg bg-cyan-500/10 p-3 font-bold text-cyan-400">
                  {currentPunnett.pAGen[0]}
                </div>
                <div className="rounded-xl border border-purple-500/40 bg-card p-4 text-sm font-black shadow-sm">
                  {currentPunnett.combos[0]}
                </div>
                <div className="rounded-xl border border-purple-500/40 bg-card p-4 text-sm font-black shadow-sm">
                  {currentPunnett.combos[1]}
                </div>

                <div className="flex items-center justify-center rounded-lg bg-cyan-500/10 p-3 font-bold text-cyan-400">
                  {currentPunnett.pAGen[1]}
                </div>
                <div className="rounded-xl border border-purple-500/40 bg-card p-4 text-sm font-black shadow-sm">
                  {currentPunnett.combos[2]}
                </div>
                <div className="rounded-xl border border-purple-500/40 bg-card p-4 text-sm font-black shadow-sm">
                  {currentPunnett.combos[3]}
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-center">
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4">
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Probability of Dominant Phenotype
                </div>
                <div className="text-3xl font-black text-foreground mt-1">
                  {currentPunnett.dominantPct}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Offspring expressing {selectedTraitForHighlight.dominantAllele.name} (has at least
                  one {currentPunnett.domSymbol} allele).
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Probability of Recessive Phenotype
                </div>
                <div className="text-3xl font-black text-foreground mt-1">
                  {currentPunnett.recessivePct}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Offspring expressing {selectedTraitForHighlight.recessiveAllele.name} (homozygous
                  recessive: {currentPunnett.recSymbol}
                  {currentPunnett.recSymbol}).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE: UNDERSTAND (DNA & Inheritance Theory) */}
      {learningStage === "understand" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Principles of Inheritance & Molecular Genetics
              </h3>
              <p className="text-xs text-muted-foreground">
                From DNA double-helix rungs to organism-wide phenotypic traits
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-5 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  01. DNA Structure
                </span>
                <h4 className="font-bold text-sm text-foreground">The Double Helix Ladder</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Deoxyribonucleic acid (DNA) consists of two antiparallel sugar-phosphate backbones
                  connected by complementary nitrogenous base pairs: Adenine (A) always pairs with
                  Thymine (T), and Cytosine (C) pairs with Guanine (G).
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-5 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  02. Genes & Chromosomes
                </span>
                <h4 className="font-bold text-sm text-foreground">Instruction Blueprints</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A gene is a discrete segment of DNA that encodes instructions for synthesizing
                  proteins or specific organism traits. Long continuous strands of DNA coil tightly
                  with histones to form compact chromosomes stored in cell nuclei.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-5 space-y-2">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  03. Alleles & Dominance
                </span>
                <h4 className="font-bold text-sm text-foreground">Mendelian Patterns</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Alleles are variant versions of the same gene. Dominant alleles mask recessive
                  alleles in heterozygous individuals (Bb). Recessive traits require two matching
                  copies (bb) to be physically observed.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-xs text-muted-foreground leading-relaxed">
              <strong>Educational Note on Scientific Models:</strong> This simulation uses a
              simplified single-gene Mendelian model for fictional creatures. In real complex
              organisms, most physical traits are polygenic (influenced by multiple genes working
              together) and also shaped by environmental factors.
            </div>
          </div>
        </div>
      )}

      {/* STAGE: QUIZ */}
      {learningStage === "quiz" && (
        <QuizRunner
          labId="genetics"
          labTitle="DNA & Genetics"
          questions={GENETICS_QUIZ}
          onFinish={() => addCompletedStage("quiz")}
        />
      )}
    </div>
  );
};
