import React, { createContext, useContext, useEffect, useState } from "react";
import { LabProgress, LabType } from "../types/science";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface LabProgressContextType {
  progress: LabProgress;
  markReactionCompleted: (reactionId: string) => void;
  recordOffspringCreated: () => void;
  markDisasterSimulated: (disasterId: string) => void;
  recordQuizScore: (labId: LabType, score: number, total: number) => void;
  resetAllProgress: () => void;
  badges: Badge[];
}

const DEFAULT_PROGRESS: LabProgress = {
  chemistryExperimentsCompleted: [],
  geneticsOffspringCreated: 0,
  disastersSimulated: [],
  quizScores: {},
  unlockedBadges: [],
};

const STORAGE_KEY = "ai_science_lab_progress_v1";

const LabProgressContext = createContext<LabProgressContextType | undefined>(undefined);

export const LabProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<LabProgress>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error("Failed to load progress from localStorage", e);
      }
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (e) {
        console.error("Failed to persist progress to localStorage", e);
      }
    }
  }, [progress]);

  const markReactionCompleted = (reactionId: string) => {
    setProgress((prev) => {
      if (prev.chemistryExperimentsCompleted.includes(reactionId)) return prev;
      return {
        ...prev,
        chemistryExperimentsCompleted: [...prev.chemistryExperimentsCompleted, reactionId],
      };
    });
  };

  const recordOffspringCreated = () => {
    setProgress((prev) => ({
      ...prev,
      geneticsOffspringCreated: prev.geneticsOffspringCreated + 1,
    }));
  };

  const markDisasterSimulated = (disasterId: string) => {
    setProgress((prev) => {
      if (prev.disastersSimulated.includes(disasterId)) return prev;
      return {
        ...prev,
        disastersSimulated: [...prev.disastersSimulated, disasterId],
      };
    });
  };

  const recordQuizScore = (labId: LabType, score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [labId]: { score, total, completedAt: new Date().toISOString() },
      },
    }));
  };

  const resetAllProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Evaluate badge triggers dynamically
  const badges: Badge[] = [
    {
      id: "first-experiment",
      name: "Apprentice Chemist",
      description: "Successfully carried out your first chemical reaction in the Reaction Chamber.",
      icon: "🧪",
      unlocked: progress.chemistryExperimentsCompleted.length >= 1,
    },
    {
      id: "master-chemist",
      name: "Molecular Alchemist",
      description: "Conducted at least 4 unique chemical reactions.",
      icon: "⚗️",
      unlocked: progress.chemistryExperimentsCompleted.length >= 4,
    },
    {
      id: "genetic-creator",
      name: "Genome Explorer",
      description: "Generated your first genetically unique offspring in the Genome Garden.",
      icon: "🧬",
      unlocked: progress.geneticsOffspringCreated >= 1,
    },
    {
      id: "dna-master",
      name: "Genetic Architect",
      description: "Explored allele diversity by generating 3 or more offspring.",
      icon: "✨",
      unlocked: progress.geneticsOffspringCreated >= 3,
    },
    {
      id: "earth-observer",
      name: "Geosphere Watcher",
      description: "Investigated at least 3 planetary natural disaster simulations.",
      icon: "🌍",
      unlocked: progress.disastersSimulated.length >= 3,
    },
    {
      id: "planetary-guardian",
      name: "Master Geoscientist",
      description: "Tested all 6 planetary natural disaster physics models.",
      icon: "🌋",
      unlocked: progress.disastersSimulated.length >= 6,
    },
    {
      id: "quiz-scholar",
      name: "Science Lab Scholar",
      description: "Completed quizzes in at least 2 labs with a passing grade (≥ 70%).",
      icon: "🎓",
      unlocked:
        Object.values(progress.quizScores).filter((qs) => qs && qs.score / qs.total >= 0.7)
          .length >= 2,
    },
  ];

  return (
    <LabProgressContext.Provider
      value={{
        progress,
        markReactionCompleted,
        recordOffspringCreated,
        markDisasterSimulated,
        recordQuizScore,
        resetAllProgress,
        badges,
      }}
    >
      {children}
    </LabProgressContext.Provider>
  );
};

export const useLabProgress = () => {
  const context = useContext(LabProgressContext);
  if (!context) {
    throw new Error("useLabProgress must be used within a LabProgressProvider");
  }
  return context;
};
