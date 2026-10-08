export interface AssistantQuestion {
  id: string;
  lab: "all" | "chemistry" | "genetics" | "disasters" | "space";
  question: string;
  answer: string;
  keyTakeaway: string;
}

export const LAB_ASSISTANT_FAQ: AssistantQuestion[] = [
  // Chemistry FAQs
  {
    id: "q-chem-1",
    lab: "chemistry",
    question: "What actually happens to the atoms during a chemical reaction?",
    answer:
      "Atoms are never created or destroyed during a chemical reaction! Instead, the chemical bonds holding the original reactant molecules together are broken by energy, and the individual atoms reorganize into new configurations to create product molecules. The total mass before and after the reaction remains completely unchanged — this is the Law of Conservation of Mass.",
    keyTakeaway: "Conservation of Mass: Bonds break, atoms rearrange, nothing disappears!",
  },
  {
    id: "q-chem-2",
    lab: "chemistry",
    question: "How do I know if something is a chemical reaction or just a physical change?",
    answer:
      "A physical change only changes appearance, shape, or state (like melting ice or tearing paper) — the molecules themselves stay the same. A chemical reaction produces entirely NEW chemical substances with different properties. Common clues of a chemical reaction include: temperature change (exothermic/endothermic), color change, bubbling/gas evolution, or a solid precipitate forming.",
    keyTakeaway:
      "Physical change = same substance, new shape/state. Chemical reaction = brand new substance formed.",
  },
  {
    id: "q-chem-3",
    lab: "chemistry",
    question: "Why does hydrochloric acid neutralize sodium hydroxide?",
    answer:
      "Hydrochloric acid (HCl) has lots of reactive hydrogen ions (H⁺), making its pH very low. Sodium hydroxide (NaOH) has hydroxide ions (OH⁻), making its pH very high. When they mix, the H⁺ and OH⁻ combine to create pure neutral water (H₂O), while the remaining Na⁺ and Cl⁻ form ordinary salt (NaCl). Two dangerous chemicals neutralize each other into harmless saltwater!",
    keyTakeaway: "Acid (H⁺) + Base (OH⁻) → Neutral Water (H₂O) + Salt (NaCl).",
  },
  {
    id: "q-chem-4",
    lab: "chemistry",
    question: "What does 'exothermic' vs 'endothermic' mean in chemistry?",
    answer:
      "It describes heat energy transfer! In exothermic reactions (like burning hydrogen or rusting iron), more energy is released when new bonds form than was needed to break the old bonds, so heat is released into the room. In endothermic reactions (like baking soda and vinegar or heating limestone), the reaction absorbs heat energy from its surroundings, making the mixture feel colder.",
    keyTakeaway: "Exothermic = releases heat to outside. Endothermic = absorbs heat from outside.",
  },

  // Genetics FAQs
  {
    id: "q-gen-1",
    lab: "genetics",
    question: "Why did my offspring inherit some traits and not others?",
    answer:
      "Every offspring receives half of its genetic blueprint from Parent A and half from Parent B. Genes come in different versions called alleles. If an offspring receives at least one 'dominant' allele (like B for Cyan coat), that trait will show up. A 'recessive' trait (like b for Violet coat) only shows up if the offspring receives two recessive copies (bb) with no dominant allele to mask it.",
    keyTakeaway:
      "Dominant alleles mask recessive ones; recessive traits only appear when homozygous (two copies).",
  },
  {
    id: "q-gen-2",
    lab: "genetics",
    question: "What is the relationship between DNA, genes, and chromosomes?",
    answer:
      "Think of a chromosome like a massive cookbook stored in the cell nucleus. The pages of the cookbook are made of long, coiled strands of DNA. Each individual recipe inside that cookbook is a gene — a specific sequence of DNA instructions that codes for a single trait (like eye color or wing structure).",
    keyTakeaway:
      "DNA = the molecular alphabet. Gene = a single instruction recipe. Chromosome = the full instruction manual.",
  },
  {
    id: "q-gen-3",
    lab: "genetics",
    question: "Why do real brothers and sisters look different if they have the same parents?",
    answer:
      "Because when parents create gametes (sperm and egg cells) through meiosis, their gene pairs split up randomly. With thousands of genes, the number of possible random allele combinations is in the trillions! Each sibling receives a unique, one-of-a-kind combination of their parents' genetic material (unless they are identical twins).",
    keyTakeaway:
      "Meiosis and independent assortment shuffle the genetic deck for every new offspring.",
  },
  {
    id: "q-gen-4",
    lab: "genetics",
    question: "How does a Punnett Square work?",
    answer:
      "A Punnett Square is a simple 2x2 grid that geneticists use to calculate probability. You put Parent A's two alleles on top and Parent B's two alleles on the side. Filling in the four inner squares shows every possible combination the offspring could inherit and the statistical percentage chance for each trait!",
    keyTakeaway:
      "A Punnett square calculates mathematical probability of inheriting specific genotypes.",
  },

  // Disasters FAQs
  {
    id: "q-dis-1",
    lab: "disasters",
    question: "What causes tectonic plates to move and trigger earthquakes?",
    answer:
      "Earth's deep mantle is hot and fluid-like. Huge heat convection currents circulate in the mantle, slowly carrying the rigid crustal plates like rafts at speeds of a few centimeters per year. When plates grind together, friction locks their jagged edges while the convection currents keep pushing. When the locked rock suddenly snaps, an earthquake occurs.",
    keyTakeaway:
      "Mantle convection pushes plates; friction locks them; sudden slip releases seismic waves.",
  },
  {
    id: "q-dis-2",
    lab: "disasters",
    question: "Why do some volcanoes erupt peacefully while others explode violently?",
    answer:
      "It comes down to two factors: silica content (viscosity) and trapped gas! Magma with low silica (like Hawaiian basalt) is thin and runny; gases bubble out gently, resulting in calm lava fountains. Magma with high silica is thick, sticky, and traps pressurized gas bubbles like a shaken soda bottle with the cap on. When the pressure breaches, it blasts into catastrophic ash plumes.",
    keyTakeaway:
      "Runny magma + low gas = gentle lava flow. Sticky silica magma + trapped gas = explosive blast!",
  },
  {
    id: "q-dis-3",
    lab: "disasters",
    question: "How can a tsunami travel unnoticed in deep ocean but destroy beaches?",
    answer:
      "In deep ocean waters (4,000+ meters deep), a tsunami wave has an immense wavelength of 100 to 200 kilometers, but its wave height is often less than 1 meter tall! Ships on the open sea don't even feel it pass. But when the wave reaches the shallow coast, the seafloor slows the bottom of the wave. The energy compresses: the wavelength shrinks and the water piles up into a towering wall of water!",
    keyTakeaway:
      "Shoaling effect: Deep ocean = fast & low. Shallow shore = slowed down & piled up tall.",
  },
  {
    id: "q-dis-4",
    lab: "disasters",
    question: "Why are flash floods more dangerous in paved cities than in natural wetlands?",
    answer:
      "Natural soil, trees, and wetlands act like natural sponges with high infiltration capacity — they absorb massive amounts of rain into groundwater. In cities, ground is covered by impervious asphalt and concrete. Rain cannot soak into the ground, so 100% of it rushes immediately into gutters and streets, turning roads into raging rivers within minutes.",
    keyTakeaway:
      "Wetlands absorb rainwater; concrete and asphalt speed up runoff into sudden flash floods.",
  },

  // Space Landing FAQs
  {
    id: "q-space-1",
    lab: "space",
    question: "Why does gravity differ across planets like the Moon, Mars, and Earth?",
    answer:
      "Newton's Universal Gravitation law dictates that surface gravity depends on the celestial body's mass and radius (g = G·M/r²). The Moon has only ~1% of Earth's mass, generating g = 1.62 m/s² (1/6th Earth). Mars is larger than the Moon but smaller than Earth, with g = 3.72 m/s² (~38% Earth). Earth's huge mass pulls down at 9.81 m/s², requiring far greater engine thrust.",
    keyTakeaway: "More planetary mass = stronger gravity = faster descent acceleration.",
  },
  {
    id: "q-space-2",
    lab: "space",
    question: "What is a 'suicide burn' or hoverslam in aerospace engineering?",
    answer:
      "A suicide burn (or hoverslam) is a calculated landing maneuver where the main rocket engines ignite at 100% throttle at the absolute last second before touchdown, decelerating the spacecraft to precisely 0 m/s exactly as the landing legs make contact with the surface. It minimizes fuel lost to 'gravity drag' (holding the craft in the air), but leaves zero room for error if initiated too late.",
    keyTakeaway: "Late, aggressive deceleration saves huge amounts of fuel vs prolonged hovering.",
  },
  {
    id: "q-space-3",
    lab: "space",
    question: "How does spacecraft mass affect engine acceleration?",
    answer:
      "By Newton's Second Law of Motion (a = F / m), acceleration is inversely proportional to mass. When propellant tanks are full ('wet mass'), the heavy lander accelerates slowly. As the engines fire and propellant is expelled as exhaust, the lander becomes lighter ('dry mass'), meaning the same engine thrust produces significantly higher deceleration.",
    keyTakeaway:
      "As fuel burns, total spacecraft mass drops, making engine braking more responsive.",
  },
  {
    id: "q-space-4",
    lab: "space",
    question: "Why does landing at a tilt angle cause the lander to tip over and crash?",
    answer:
      "The landing legs form a support base polygon. If the spacecraft touches down tilted past its critical tip-over angle (usually > 10°–13°), its Center of Mass extends outside the landing legs. Gravity then acts as an overturning torque (τ = r × F), flipping the lander onto its side and crushing the pressurized crew capsule.",
    keyTakeaway:
      "Keep pitch angle near 0°: landing outside the leg stance creates destructive tip-over torque.",
  },
];
