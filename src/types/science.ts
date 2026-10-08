export type LabType = "chemistry" | "genetics" | "disasters" | "space";

export type LabTab = "explore" | "experiment" | "learn" | "quiz";

// Space Landing types
export type PlanetId = "moon" | "mars" | "earth" | "custom";

export type MissionLevelId = "level-1" | "level-2" | "level-3" | "level-4" | "level-5";

export interface PlanetConfig {
  id: PlanetId;
  name: string;
  gravity: number; // m/s^2
  atmosphere: boolean;
  windMax: number; // m/s
  surfaceColor: string;
  skyGradient: [string, string];
  description: string;
  landingPadWidth: number; // meters in sim scale
  atmosphericDensity: number; // 0 for vacuum, 0.02 Mars, 1.225 Earth
}

export interface SpaceSimulationVariables {
  gravity: number; // m/s^2
  mass: number; // kg total
  dryMass: number; // kg
  initialAltitude: number; // m
  initialVx: number; // m/s
  initialVy: number; // m/s
  fuelCapacity: number; // kg
  windStrength: number; // m/s
  landingPadWidth: number; // m
  mainThrustMax: number; // Newtons
  rcsTorqueMax: number; // deg/s^2
}

export interface FlightTelemetryPoint {
  time: number; // seconds elapsed
  altitude: number; // m
  vx: number; // m/s
  vy: number; // m/s (negative descent)
  fuel: number; // kg
  fuelPercent: number; // %
  angle: number; // degrees off vertical
  thrustPercent: number; // 0 - 100%
  acceleration: number; // m/s^2
}

export type LandingOutcome =
  "success" | "rough" | "crash-speed" | "crash-angle" | "crash-terrain" | "out-of-fuel";

export interface LandingAttemptResult {
  id: string;
  attemptNumber: number;
  outcome: LandingOutcome;
  planetId: PlanetId;
  planetName: string;
  finalAltitude: number;
  finalVy: number; // touchdown descent velocity
  maxVy: number;
  finalVx: number; // touchdown lateral velocity
  finalAngle: number; // degrees
  fuelRemaining: number;
  fuelUsed: number;
  flightTime: number; // seconds
  gravity: number;
  mass: number;
  wind: number;
  distanceFromPadCenter: number; // meters off pad center
  scientificExplanation: string;
  telemetryHistory: FlightTelemetryPoint[];
  timestamp: number;
}

export interface MissionLevel {
  id: MissionLevelId;
  levelNumber: number;
  title: string;
  targetPlanet: PlanetId;
  badgeName: string;
  briefing: string;
  missionGoal: string;
  initialVariables: SpaceSimulationVariables;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Sandbox";
}

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
  spaceLandingsCompleted: string[];
  quizScores: { [labId in LabType]?: { score: number; total: number; completedAt: string } };
  unlockedBadges: string[];
}
