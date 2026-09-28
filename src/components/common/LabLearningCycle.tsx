import React from "react";
import { Check, ArrowRight } from "lucide-react";

export type LearningStage = "explore" | "experiment" | "observe" | "understand" | "quiz";

interface LabLearningCycleProps {
  currentStage: LearningStage;
  onSelectStage: (stage: LearningStage) => void;
  completedStages: LearningStage[];
  colorTheme?: "emerald" | "purple" | "amber";
}

const STAGES: { id: LearningStage; label: string; number: string }[] = [
  { id: "explore", label: "Explore", number: "1" },
  { id: "experiment", label: "Experiment", number: "2" },
  { id: "observe", label: "Observe", number: "3" },
  { id: "understand", label: "Understand", number: "4" },
  { id: "quiz", label: "Quiz", number: "5" },
];

export const LabLearningCycle: React.FC<LabLearningCycleProps> = ({
  currentStage,
  onSelectStage,
  completedStages,
  colorTheme = "emerald",
}) => {
  const activeColorClasses = {
    emerald: "bg-emerald-600 text-white font-semibold shadow-sm",
    purple: "bg-purple-600 text-white font-semibold shadow-sm",
    amber: "bg-amber-600 text-white font-semibold shadow-sm",
  }[colorTheme];

  const checkColorClasses = {
    emerald: "text-emerald-500",
    purple: "text-purple-400",
    amber: "text-amber-500",
  }[colorTheme];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Learning Cycle:</span>
        <span className="hidden sm:inline">Follow the scientific inquiry path</span>
      </div>

      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {STAGES.map((stage, idx) => {
          const isCurrent = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all ${
                  isCurrent
                    ? activeColorClasses
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className={`h-3 w-3 ${isCurrent ? "text-white" : checkColorClasses}`} />
                ) : (
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold ${
                      isCurrent ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stage.number}
                  </span>
                )}
                <span className="capitalize">{stage.label}</span>
              </button>
              {idx < STAGES.length - 1 && (
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/40 hidden md:inline" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
