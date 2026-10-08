import React, { useState } from "react";
import { LabType } from "../types/science";
import { useLabProgress } from "../context/LabProgressContext";
import { Beaker, Dna, Globe, Rocket, Award, Sparkles, X, RotateCcw, Home } from "lucide-react";

interface HeaderProps {
  activeLab: LabType | "home";
  onSelectLab: (lab: LabType | "home") => void;
}

export const Header: React.FC<HeaderProps> = ({ activeLab, onSelectLab }) => {
  const { progress, badges, resetAllProgress } = useLabProgress();
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectLab("home")}
            className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-cyan-400 text-primary-foreground shadow-md shadow-primary/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  AI Science Lab
                </span>
                <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-block">
                  Explorer Hub
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Interactive simulations for chemistry, genetics & earth forces
              </p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectLab("home")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                activeLab === "home"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Home</span>
            </button>

            <button
              onClick={() => onSelectLab("chemistry")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                activeLab === "chemistry"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Beaker className="h-3.5 w-3.5 text-emerald-400" />
              <span>Chemical Lab</span>
            </button>

            <button
              onClick={() => onSelectLab("genetics")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                activeLab === "genetics"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Dna className="h-3.5 w-3.5 text-purple-400" />
              <span>DNA Lab</span>
            </button>

            <button
              onClick={() => onSelectLab("disasters")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                activeLab === "disasters"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>Disasters Lab</span>
            </button>

            <button
              onClick={() => onSelectLab("space")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                activeLab === "space"
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Rocket className="h-3.5 w-3.5 text-cyan-400" />
              <span>Space Lab</span>
            </button>

            {/* Badges / Progress counter */}
            <button
              onClick={() => setShowBadgesModal(true)}
              className="ml-1 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
              title="View your Science Badges & Lab Progress"
            >
              <Award className="h-3.5 w-3.5" />
              <span>
                {unlockedCount}/{badges.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Badges and Progress Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Science Lab Badges & Progress
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Earn achievements by experimenting and testing hypotheses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
                <span className="text-2xl font-bold text-emerald-500">
                  {progress.chemistryExperimentsCompleted.length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Reactions Completed</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
                <span className="text-2xl font-bold text-purple-500">
                  {progress.geneticsOffspringCreated}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Offspring Bred</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
                <span className="text-2xl font-bold text-amber-500">
                  {progress.disastersSimulated.length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Disasters Explored</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
                <span className="text-2xl font-bold text-cyan-400">
                  {(progress.spaceLandingsCompleted || []).length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Celestial Landings</p>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Achievement Badges ({unlockedCount} of {badges.length} Unlocked)
              </span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-h-64 overflow-y-auto pr-1">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      b.unlocked
                        ? "border-primary/40 bg-primary/5 text-foreground"
                        : "border-border/40 bg-muted/10 opacity-50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{b.name}</span>
                        {b.unlocked && (
                          <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                            Earned
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        {b.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <button
                onClick={() => {
                  if (confirm("Reset all experimental progress and badges?")) {
                    resetAllProgress();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Progress
              </button>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
