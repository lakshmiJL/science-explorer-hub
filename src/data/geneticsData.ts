import { GeneticTrait, ParentCreature, QuizQuestion } from "../types/science";

export const GENETIC_TRAITS: GeneticTrait[] = [
  {
    id: "furColor",
    category: "furColor",
    name: "Bioluminescent Coat",
    description: "Determines the glowing chromatic pigment of the creature's coat.",
    geneLocus: "Chromosome 1 • Locus A4",
    dominantAllele: {
      id: "B",
      symbol: "B",
      isDominant: true,
      name: "Nebula Cyan Glow",
      visualValue: "#06b6d4",
    },
    recessiveAllele: {
      id: "b",
      symbol: "b",
      isDominant: false,
      name: "Twilight Violet Glow",
      visualValue: "#a855f7",
    },
  },
  {
    id: "wings",
    category: "wings",
    name: "Aether Wings",
    description: "Determines aerodynamic wing structure and membrane texture.",
    geneLocus: "Chromosome 2 • Locus W1",
    dominantAllele: {
      id: "W",
      symbol: "W",
      isDominant: true,
      name: "Dragonfly Prism Wings",
      visualValue: "prismatic-dragonfly",
    },
    recessiveAllele: {
      id: "w",
      symbol: "w",
      isDominant: false,
      name: "Solar Feathered Plumes",
      visualValue: "feathered-plumes",
    },
  },
  {
    id: "horns",
    category: "horns",
    name: "Resonance Horns",
    description: "Cranial acoustic horns tuned to ambient electromagnetic frequencies.",
    geneLocus: "Chromosome 3 • Locus H2",
    dominantAllele: {
      id: "H",
      symbol: "H",
      isDominant: true,
      name: "Spiral Crystal Horns",
      visualValue: "spiral-crystal",
    },
    recessiveAllele: {
      id: "h",
      symbol: "h",
      isDominant: false,
      name: "Curved Lunar Antlers",
      visualValue: "lunar-antlers",
    },
  },
  {
    id: "tail",
    category: "tail",
    name: "Stellar Tail",
    description: "Balance organ and energy discharge appendage.",
    geneLocus: "Chromosome 4 • Locus T3",
    dominantAllele: {
      id: "T",
      symbol: "T",
      isDominant: true,
      name: "Comet Plume Tail",
      visualValue: "comet-plume",
    },
    recessiveAllele: {
      id: "t",
      symbol: "t",
      isDominant: false,
      name: "Plasma Whip Tail",
      visualValue: "plasma-whip",
    },
  },
  {
    id: "pattern",
    category: "pattern",
    name: "Dermal Markings",
    description: "Optical interference patterns across the epidermal skin layers.",
    geneLocus: "Chromosome 5 • Locus P1",
    dominantAllele: {
      id: "S",
      symbol: "S",
      isDominant: true,
      name: "Starlight Constellations",
      visualValue: "star-spots",
    },
    recessiveAllele: {
      id: "s",
      symbol: "s",
      isDominant: false,
      name: "Aurora Waves",
      visualValue: "aurora-stripes",
    },
  },
  {
    id: "eyeGlow",
    category: "eyeGlow",
    name: "Ocular Spectrum",
    description: "Photoreceptor sensitivity range and iris luminescence.",
    geneLocus: "Chromosome 6 • Locus E7",
    dominantAllele: {
      id: "E",
      symbol: "E",
      isDominant: true,
      name: "Solar Amber Ocelli",
      visualValue: "#f59e0b",
    },
    recessiveAllele: {
      id: "e",
      symbol: "e",
      isDominant: false,
      name: "Emerald Flash Ocelli",
      visualValue: "#10b981",
    },
  },
  {
    id: "bodySize",
    category: "bodySize",
    name: "Body Stature & Scale",
    description: "Metabolic growth factor regulating mass and skeletal size.",
    geneLocus: "Chromosome 7 • Locus G3",
    dominantAllele: {
      id: "G",
      symbol: "G",
      isDominant: true,
      name: "Titan Majestic Stature",
      visualValue: "large",
    },
    recessiveAllele: {
      id: "g",
      symbol: "g",
      isDominant: false,
      name: "Swift Nimble Miniature",
      visualValue: "small",
    },
  },
];

export const INITIAL_PARENTS: { parentA: ParentCreature; parentB: ParentCreature } = {
  parentA: {
    id: "parentA",
    name: "Zephyr the Skyweaver",
    title: "Celestial Gryphon Sire",
    genotypes: {
      furColor: ["B", "B"], // Homozygous dominant (Nebula Cyan)
      wings: ["W", "w"], // Heterozygous (Dragonfly Prism)
      horns: ["H", "H"], // Homozygous dominant (Spiral Crystal)
      tail: ["T", "t"], // Heterozygous (Comet Plume)
      pattern: ["S", "s"], // Heterozygous (Starlight Constellations)
      eyeGlow: ["E", "e"], // Heterozygous (Solar Amber)
    },
  },
  parentB: {
    id: "parentB",
    name: "Nyx the Shadowdancer",
    title: "Twilight Drake Matriarch",
    genotypes: {
      furColor: ["b", "b"], // Homozygous recessive (Twilight Violet)
      wings: ["w", "w"], // Homozygous recessive (Solar Feathered)
      horns: ["H", "h"], // Heterozygous (Spiral Crystal)
      tail: ["t", "t"], // Homozygous recessive (Plasma Whip)
      pattern: ["s", "s"], // Homozygous recessive (Aurora Waves)
      eyeGlow: ["e", "e"], // Homozygous recessive (Emerald Flash)
    },
  },
};

export const CREATURE_NAME_PREFIXES = [
  "Astra",
  "Cosmo",
  "Lumi",
  "Vesper",
  "Sol",
  "Aura",
  "Nova",
  "Zephyr",
  "Echo",
  "Orion",
  "Celeste",
  "Nyx",
];

export const CREATURE_NAME_SUFFIXES = [
  "fluff",
  "wing",
  "tail",
  "shard",
  "spark",
  "glider",
  "whisper",
  "stride",
  "drake",
  "bloom",
];

export const CREATURE_TITLES = [
  "The Prismatic Wanderer",
  "Guardian of the Genome Grove",
  "Bioluminescent Scout",
  "Harbinger of Starlight",
  "Celestial Aetherborn",
  "Aurora Weaver",
  "Crystalline Sentinel",
];

export const GENETICS_QUIZ: QuizQuestion[] = [
  {
    id: "gen-q1",
    labId: "genetics",
    type: "multiple-choice",
    question: "What is the difference between an organism's genotype and its phenotype?",
    options: [
      "Genotype is its genetic code (alleles); Phenotype is the observable physical trait",
      "Genotype is how fast it runs; Phenotype is what it eats",
      "Genotype is inherited only from the father; Phenotype only from the mother",
      "There is no difference; they are exact synonyms",
    ],
    correctIndex: 0,
    explanation:
      "The genotype is the set of alleles an organism possesses (e.g. 'Bb'), while the phenotype is the actual physical characteristic or trait expressed (e.g. Cyan Glow).",
    concept: "Genotype vs Phenotype",
  },
  {
    id: "gen-q2",
    labId: "genetics",
    type: "predict-outcome",
    question:
      "If Parent A has homozygous dominant coat (BB) and Parent B has homozygous recessive coat (bb), what will the offspring's coat color be?",
    options: [
      "100% chance of expressing the dominant Nebula Cyan coat (Genotype: Bb)",
      "50% chance of Violet, 50% chance of Cyan",
      "100% chance of Violet coat",
      "Offspring will have no coat at all",
    ],
    correctIndex: 0,
    explanation:
      "All offspring inherit one 'B' allele from Parent A and one 'b' allele from Parent B (Bb). Because 'B' is dominant, 100% of the offspring show the dominant Cyan phenotype!",
    concept: "Mendelian Dominance",
  },
  {
    id: "gen-q3",
    labId: "genetics",
    type: "multiple-choice",
    question:
      "How many copies of a recessive allele (like 'w' for feathered wings) must an offspring inherit to display the recessive trait?",
    options: [
      "Only one copy is enough",
      "Two copies (one from each parent: ww)",
      "Three copies",
      "Recessive traits can never be displayed",
    ],
    correctIndex: 1,
    explanation:
      "A recessive phenotype is masked whenever a dominant allele is present. It is only visibly expressed when the organism inherits two recessive alleles (homozygous recessive: ww).",
    concept: "Recessive Inheritance",
  },
  {
    id: "gen-q4",
    labId: "genetics",
    type: "concept-match",
    question:
      "Which of the following correctly orders genetic structures from smallest to largest unit?",
    options: [
      "Chromosome → Gene → DNA base pair → Cell",
      "DNA base pair → Gene → Chromosome → Nucleus",
      "Nucleus → DNA base pair → Chromosome → Gene",
      "Gene → DNA base pair → Cell → Chromosome",
    ],
    correctIndex: 1,
    explanation:
      "Individual chemical base pairs (A-T, C-G) form segments called genes. Thousands of genes condense into chromosomes, which reside inside the cell nucleus.",
    concept: "Hierarchical Genetic Organization",
  },
  {
    id: "gen-q5",
    labId: "genetics",
    type: "predict-outcome",
    question:
      "In a cross between two heterozygous parents (Bb × Bb), what is the statistical probability of producing an offspring with the recessive trait (bb)?",
    options: ["100%", "75%", "50%", "25% (1 in 4)"],
    correctIndex: 3,
    explanation:
      "In a monohybrid cross (Bb × Bb), the Punnett square yields: BB (25%), Bb (50%), and bb (25%). Therefore, 25% of offspring display the recessive phenotype.",
    concept: "Punnett Square Probability",
  },
  {
    id: "gen-q6",
    labId: "genetics",
    type: "true-false",
    question: "Siblings with the same two parents always have identical combinations of alleles.",
    options: [
      "True",
      "False - Independent assortment and random fertilization create unique combinations",
    ],
    correctIndex: 1,
    explanation:
      "Each parent contributes a random 50% sample of their genetic alleles via meiosis. Because allele distribution is independent, each offspring receives a distinct combination!",
    concept: "Genetic Variation & Meiosis",
  },
  {
    id: "gen-q7",
    labId: "genetics",
    type: "multiple-choice",
    question:
      "Why do scientists use model organisms and fictional genetics simulations instead of judging human physical traits?",
    options: [
      "Because human traits are not genetic",
      "To focus objectively on biological inheritance rules without subjective beauty standards or biases",
      "Because DNA only exists in fantasy creatures",
      "To make genetics completely random",
    ],
    correctIndex: 1,
    explanation:
      "Using model organisms or creative simulations keeps the learning focused on inheritance mechanisms and avoids subjective judgments or harmful stereotypes regarding human appearances.",
    concept: "Ethics in Genetics Education",
  },
  {
    id: "gen-q8",
    labId: "genetics",
    type: "multiple-choice",
    question:
      "What are the four chemical nitrogenous bases that form the rungs of a real DNA ladder?",
    options: [
      "Adenine (A), Thymine (T), Cytosine (C), Guanine (G)",
      "Carbon, Hydrogen, Oxygen, Nitrogen",
      "Glucose, Fructose, Sucrose, Lactose",
      "Proton, Neutron, Electron, Photon",
    ],
    correctIndex: 0,
    explanation:
      "DNA base pairs always pair specifically: Adenine pairs with Thymine (A-T), and Cytosine pairs with Guanine (C-G) through hydrogen bonds.",
    concept: "DNA Double Helix Structure",
  },
];
