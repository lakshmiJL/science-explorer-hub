import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { LabProgressProvider, useLabProgress } from "../context/LabProgressContext";
import { Header } from "../components/Header";
import { LabAssistant } from "../components/LabAssistant";
import { ChemicalReactionLab } from "../components/chemistry/ChemicalReactionLab";
import { DnaGeneticsLab } from "../components/genetics/DnaGeneticsLab";
import { NaturalDisastersLab } from "../components/disasters/NaturalDisastersLab";
import { SpaceLandingLab } from "../components/space/SpaceLandingLab";
import { ScienceLabHeroAnimation } from "../components/home/ScienceLabHeroAnimation";
import { LabType } from "../types/science";
import {
  Beaker,
  Dna,
  Globe,
  Rocket,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Atom,
  Flame,
  ShieldCheck,
  Compass,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: IndexWrapper,
});

function IndexWrapper() {
  return (
    <LabProgressProvider>
      <ScienceExplorerApp />
    </LabProgressProvider>
  );
}

function ScienceExplorerApp() {
  const [activeLab, setActiveLab] = useState<LabType | "home">("home");
  const { progress, badges } = useLabProgress();

  const totalBadges = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Header */}
      <Header activeLab={activeLab} onSelectLab={setActiveLab} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {activeLab === "home" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 text-center text-white shadow-2xl space-y-8">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI SCIENCE LAB • AGES 11–16</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  Explore. Experiment.{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                    Discover.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  Step inside an interactive virtual science laboratory. Watch atoms collide,
                  synthesize DNA base pairs, and trigger simulated geophysical forces in real-time.
                </p>

                {/* Quick Learning Stats */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>
                      {progress.chemistryExperimentsCompleted.length} Reactions Discovered
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                    <CheckCircle2 className="h-4 w-4 text-purple-400" />
                    <span>{progress.geneticsOffspringCreated} Offspring Bred</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>{progress.disastersSimulated.length} Disasters Modeled</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>{(progress.spaceLandingsCompleted || []).length} Landings Achieved</span>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE SCIENCE LAB ANIMATION STAGE */}
              <div className="relative z-10 max-w-5xl mx-auto text-left">
                <ScienceLabHeroAnimation onSelectLab={setActiveLab} />
              </div>
            </section>

            {/* FOUR LARGE INTERACTIVE LABORATORY ENTRANCES */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Interactive Laboratory Modules
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Select a lab to begin simulated experimentation and test your scientific
                    hypotheses
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* LAB 1: Chemical Reaction Lab */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-emerald-500/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                        <Beaker className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
                        Module 01
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Molecular Alchemy
                      </span>
                      <h3 className="text-xl font-bold text-foreground mt-0.5">
                        Chemical Reaction Lab
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Combine acids, bases, and metals in the Reaction Chamber. Observe animated
                        molecular collisions, bond transformations, and balanced formulas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground font-medium">
                      <Atom className="h-4 w-4 text-emerald-500" />
                      <span>Conservation of Mass • 6 Reactions</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <button
                      onClick={() => setActiveLab("chemistry")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-500 active:scale-95"
                    >
                      <span>Enter Chemical Lab</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* LAB 2: DNA & Genetics Lab */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-500/30 bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-purple-500/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 transition-transform group-hover:scale-110">
                        <Dna className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-400">
                        Module 02
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-purple-500 dark:text-purple-300">
                        Genome Garden
                      </span>
                      <h3 className="text-xl font-bold text-foreground mt-0.5">
                        DNA & Genetics Lab
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Breed magical fictional creatures in a glowing genetic laboratory. Explore
                        Mendelian dominance, Punnett squares, and double helix base pairs.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground font-medium">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span>Punnett Probability • 6 Allele Loci</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <button
                      onClick={() => setActiveLab("genetics")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-purple-500 active:scale-95"
                    >
                      <span>Enter Genetics Lab</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* LAB 3: Natural Disasters Lab */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-amber-500/30 bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-amber-500/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110">
                        <Globe className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-500">
                        Module 03
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        Forces of Nature
                      </span>
                      <h3 className="text-xl font-bold text-foreground mt-0.5">
                        Natural Disasters Lab
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Investigate tectonic faults, volcanic magma pressure, tsunami shoaling,
                        hurricanes, flash floods, and wildfires with real physics variables.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground font-medium">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      <span>Geophysics Models • Safety Protocols</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <button
                      onClick={() => setActiveLab("disasters")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-amber-500 active:scale-95"
                    >
                      <span>Enter Disasters Lab</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* LAB 4: Space Landing Lab */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/30 bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/60 hover:shadow-cyan-500/10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 transition-transform group-hover:scale-110">
                        <Rocket className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400">
                        Module 04
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-cyan-500 dark:text-cyan-400">
                        Planetary Astrodynamics
                      </span>
                      <h3 className="text-xl font-bold text-foreground mt-0.5">
                        Space Landing Lab
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Pilot an Artemis spacecraft to touchdown on the Moon, Mars, Earth, or custom
                        worlds. Manage continuous gravity, thrust, inertia, fuel, and touchdown
                        angle.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground font-medium">
                      <Compass className="h-4 w-4 text-cyan-400" />
                      <span>Orbital Physics • 5 Mission Levels</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <button
                      onClick={() => setActiveLab("space")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-cyan-500 active:scale-95"
                    >
                      <span>Enter Space Lab</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* LEARNING CYCLE SECTION */}
            <section className="rounded-2xl border border-border/80 bg-muted/20 p-8 space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Scientific Discovery Method
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  The AI Science Lab Learning Cycle
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Every lab guides learners through the core scientific inquiry process
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 text-center">
                {[
                  {
                    step: "01",
                    title: "Explore",
                    desc: "Inspect fundamental components and compounds",
                  },
                  {
                    step: "02",
                    title: "Experiment",
                    desc: "Manipulate variables in real-time simulations",
                  },
                  {
                    step: "03",
                    title: "Observe",
                    desc: "Watch physical and molecular transformations",
                  },
                  {
                    step: "04",
                    title: "Understand",
                    desc: "Connect observations to underlying scientific laws",
                  },
                  { step: "05", title: "Quiz", desc: "Assess conceptual reasoning with feedback" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex flex-col items-center rounded-xl border border-border/60 bg-card p-4 shadow-sm"
                  >
                    <span className="text-xs font-black text-primary">{item.step}</span>
                    <h4 className="text-sm font-bold text-foreground mt-1">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* LAB MODULE VIEWS */}
        {activeLab === "chemistry" && <ChemicalReactionLab />}
        {activeLab === "genetics" && <DnaGeneticsLab />}
        {activeLab === "disasters" && <NaturalDisastersLab />}
        {activeLab === "space" && <SpaceLandingLab />}
      </main>

      {/* Floating AI Science Lab Assistant */}
      <LabAssistant currentLab={activeLab === "home" ? undefined : activeLab} />

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">AI Science Lab</span>
            <span>— Virtual Science Explorer Hub</span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Educational simulations for chemistry, genetics, natural disasters & space landings •
            Scientific models for ages 11–16
          </div>
        </div>
      </footer>
    </div>
  );
}
