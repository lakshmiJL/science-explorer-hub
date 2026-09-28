export type LabType = "chemistry" | "genetics" | "disasters";

export type LabTab = "explore" | "experiment" | "learn" | "quiz";

// Chemistry types
export interface Compound {
  id: string;
  name: string;
  formula: string;
  state: "solid" | "liquid" | "gas" | "aqueous";
  color: string;
  description: string;
  atoms: { element: string; count: number; color: string }[];
  category: "acid" | "base" | "metal" | "gas" | "salt" | "organic";
  hazardNote?: string;
}

export interface ChemicalReaction {
  id: string;
  name: string;
  type:
    | "Neutralization"
    | "Oxidation"
    | "Combustion / Synthesis"
    | "Acid-Base Gas Evolution"
    | "Single Displacement"
    | "Thermal Decomposition";
  reactants: string[]; // compound ids
  reactantAmounts: { [compoundId: string]: number };
  products: string[]; // compound ids
  productAmounts: { [compoundId: string]: number };
  equation: string;
  wordEquation: string;
  isChemicalChange: boolean;
  changeDescription: string;
  atomRearrangement: string;
  molecularExplanation: string;
  visualEffect: "bubbles" | "fire" | "glow" | "precipitate" | "color-shift" | "steam";
  energyChange: "Exothermic (releases heat)" | "Endothermic (absorbs heat)";
}

// Genetics types
export interface Allele {
  id: string;
  symbol: string;
  isDominant: boolean;
  name: string;
  visualValue: string; // color, style, icon name
}

export interface GeneticTrait {
  id: string;
  category: "furColor" | "wings" | "horns" | "tail" | "pattern" | "eyeGlow";
  name: string;
  description: string;
  dominantAllele: Allele;
  recessiveAllele: Allele;
  geneLocus: string; // e.g. "Chr 1 - Locus A4"
}

export interface ParentCreature {
  id: "parentA" | "parentB";
  name: string;
  title: string;
  genotypes: { [traitCategory: string]: [string, string] }; // e.g. { furColor: ['B', 'b'] }
}

export interface OffspringCreature {
  id: string;
  name: string;
  title: string;
  parents: { parentA: string; parentB: string };
  genotypes: { [traitCategory: string]: [string, string] };
  phenotypes: {
    [traitCategory: string]: { name: string; visualValue: string; inheritedFrom: string };
  };
  dominantCount: number;
  recessiveCount: number;
  rarityScore: string;
  bornTimestamp: number;
}

// Disaster types
export type DisasterType =
  "earthquake" | "volcano" | "tsunami" | "hurricane" | "flood" | "wildfire";

export interface DisasterInfo {
  id: DisasterType;
  name: string;
  subtitle: string;
  tagline: string;
  color: string;
  accentColor: string;
  overview: string;
  mechanism: string[];
  keyTerms: { term: string; definition: string }[];
  safetyTips: string[];
  variables: {
    name: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
    description: string;
  }[];
}

// Quiz types
export interface QuizQuestion {
  id: string;
  labId: LabType;
  type: "multiple-choice" | "true-false" | "predict-outcome" | "concept-match";
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
}

export interface LabProgress {
  chemistryExperimentsCompleted: string[];
  geneticsOffspringCreated: number;
  disastersSimulated: string[];
  quizScores: { [labId in LabType]?: { score: number; total: number; completedAt: string } };
  unlockedBadges: string[];
}
