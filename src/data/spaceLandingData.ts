import {
  PlanetConfig,
  PlanetId,
  MissionLevel,
  QuizQuestion,
  SpaceSimulationVariables,
  LandingOutcome,
} from "../types/science";

export const PLANET_CONFIGS: Record<PlanetId, PlanetConfig> = {
  moon: {
    id: "moon",
    name: "The Moon",
    gravity: 1.62,
    atmosphere: false,
    windMax: 0,
    surfaceColor: "#94a3b8",
    skyGradient: ["#020617", "#0f172a"],
    description:
      "Earth's natural satellite. With no atmospheric drag or crosswinds and only 1/6th Earth's gravity, the Moon provides a pristine vacuum for mastering descent control.",
    landingPadWidth: 60,
    atmosphericDensity: 0,
  },
  mars: {
    id: "mars",
    name: "Mars",
    gravity: 3.72,
    atmosphere: true,
    windMax: 15,
    surfaceColor: "#c2410c",
    skyGradient: ["#451a03", "#7c2d12"],
    description:
      "The Red Planet. Exhibits ~38% of Earth's gravity with thin atmospheric dust gusts that produce lateral aerodynamic drift during terminal touchdown.",
    landingPadWidth: 50,
    atmosphericDensity: 0.02,
  },
  earth: {
    id: "earth",
    name: "Earth",
    gravity: 9.81,
    atmosphere: true,
    windMax: 25,
    surfaceColor: "#0284c7",
    skyGradient: ["#0369a1", "#0284c7"],
    description:
      "Home planet with powerful gravitational acceleration. High gravity demands rapid counter-thrust and precise throttle braking before touching down on an ocean drone platform.",
    landingPadWidth: 42,
    atmosphericDensity: 1.225,
  },
  custom: {
    id: "custom",
    name: "Custom Exoplanet",
    gravity: 5.5,
    atmosphere: true,
    windMax: 20,
    surfaceColor: "#8b5cf6",
    skyGradient: ["#1e1b4b", "#4338ca"],
    description:
      "A learner-designed planetary system. Adjust surface gravity, ambient crosswinds, starting fuel, and landing site dimensions to test extreme aerospace scenarios.",
    landingPadWidth: 50,
    atmosphericDensity: 0.5,
  },
};

export const MISSION_LEVELS: MissionLevel[] = [
  {
    id: "level-1",
    levelNumber: 1,
    title: "Level 1: Moon Landing",
    targetPlanet: "moon",
    badgeName: "Apollo Aviator",
    briefing:
      "Welcome to flight school, Commander. Guide the Artemis Lander onto Tranquility Pad. There is no air or wind in the lunar vacuum, so only Newton's gravity and your main thrusters dictate your descent.",
    missionGoal: "Touch down with vertical speed < 3.0 m/s and tilt < 10° on the lunar surface.",
    difficulty: "Beginner",
    initialVariables: {
      gravity: 1.62,
      mass: 1200,
      dryMass: 800,
      initialAltitude: 260,
      initialVx: 2,
      initialVy: -6,
      fuelCapacity: 100,
      windStrength: 0,
      landingPadWidth: 65,
      mainThrustMax: 4800,
      rcsTorqueMax: 45,
    },
  },
  {
    id: "level-2",
    levelNumber: 2,
    title: "Level 2: Mars Landing",
    targetPlanet: "mars",
    badgeName: "Jezero Navigator",
    briefing:
      "Entering Jezero Crater. Mars features 3.72 m/s² gravity and unpredictable lateral crosswinds. Counteract the lateral drift with RCS rotation and horizontal thrust bursts.",
    missionGoal: "Overcome wind shear and land safely within the designated landing zone.",
    difficulty: "Intermediate",
    initialVariables: {
      gravity: 3.72,
      mass: 1400,
      dryMass: 900,
      initialAltitude: 300,
      initialVx: -5,
      initialVy: -10,
      fuelCapacity: 130,
      windStrength: 8,
      landingPadWidth: 52,
      mainThrustMax: 8800,
      rcsTorqueMax: 50,
    },
  },
  {
    id: "level-3",
    levelNumber: 3,
    title: "Level 3: Earth Landing",
    targetPlanet: "earth",
    badgeName: "Orbital Booster",
    briefing:
      "High-gravity retrograde recovery! Earth pulls with 9.81 m/s². The spacecraft accelerates downward rapidly, requiring aggressive throttle modulation and a tight landing on the ocean drone platform.",
    missionGoal:
      "Manage rapid gravitational acceleration and land safely on Autonomous Drone Ship.",
    difficulty: "Advanced",
    initialVariables: {
      gravity: 9.81,
      mass: 1600,
      dryMass: 1000,
      initialAltitude: 340,
      initialVx: 4,
      initialVy: -14,
      fuelCapacity: 180,
      windStrength: 12,
      landingPadWidth: 42,
      mainThrustMax: 26000,
      rcsTorqueMax: 60,
    },
  },
  {
    id: "level-4",
    levelNumber: 4,
    title: "Level 4: Emergency Landing",
    targetPlanet: "mars",
    badgeName: "Suicide Burn Survivor",
    briefing:
      "CRITICAL ALERT: Retro-thruster valve malfunction! Propellant is critically low (only 38 kg), and initial descent speed is high. If you fire too early, you run out of fuel; fire too late, and you crash.",
    missionGoal: "Execute a precision 'suicide burn' (hoverslam) with minimal fuel reserves.",
    difficulty: "Expert",
    initialVariables: {
      gravity: 3.72,
      mass: 1100,
      dryMass: 850,
      initialAltitude: 240,
      initialVx: 3,
      initialVy: -22,
      fuelCapacity: 38,
      windStrength: 14,
      landingPadWidth: 45,
      mainThrustMax: 10500,
      rcsTorqueMax: 55,
    },
  },
  {
    id: "level-5",
    levelNumber: 5,
    title: "Level 5: Mission Designer",
    targetPlanet: "custom",
    badgeName: "Aerospace Architect",
    briefing:
      "You are the Lead Flight Director. Configure gravity, spacecraft mass, starting altitude, fuel load, wind velocity, and target pad size to create customized simulation challenges.",
    missionGoal: "Build, calibrate, and simulate your own planetary landing mission.",
    difficulty: "Sandbox",
    initialVariables: {
      gravity: 5.5,
      mass: 1300,
      dryMass: 850,
      initialAltitude: 300,
      initialVx: 0,
      initialVy: -8,
      fuelCapacity: 120,
      windStrength: 6,
      landingPadWidth: 50,
      mainThrustMax: 12000,
      rcsTorqueMax: 50,
    },
  },
];

export interface ScienceConceptCard {
  id: string;
  title: string;
  formula?: string;
  shortSummary: string;
  detailedExplanation: string;
  realWorldAnalogy: string;
  diagramType: "gravity" | "thrust" | "vectors" | "mass" | "fuel" | "angle" | "twr";
}

export const SCIENCE_CONCEPTS: ScienceConceptCard[] = [
  {
    id: "gravity",
    title: "Gravity & Weight",
    formula: "W = m · g",
    shortSummary: "A continuous downward acceleration pulling the lander toward the planet's core.",
    detailedExplanation:
      "Gravity pulls any object with mass toward the planet's center. On the Moon (g = 1.62 m/s²), a 1000 kg lander weighs only 1,620 Newtons. On Earth (g = 9.81 m/s²), the exact same lander weighs 9,810 Newtons! This means Earth requires 6 times more continuous engine force just to prevent falling.",
    realWorldAnalogy:
      "Dropping a basketball on the Moon looks like slow motion; dropping it on Earth happens in a split-second blink.",
    diagramType: "gravity",
  },
  {
    id: "thrust",
    title: "Thrust & Newton's 3rd Law",
    formula: "F_action = -F_reaction",
    shortSummary: "Expelling superheated exhaust gas downward pushes the lander upward.",
    detailedExplanation:
      "Rockets do NOT push against air or the ground to move! According to Newton's Third Law (Action and Reaction), when the rocket engine forcefully accelerates exhaust gas particles out of the nozzle downwards, the gas particles push back on the rocket engine upwards with equal force.",
    realWorldAnalogy:
      "Sitting on a skateboard and throwing a heavy bowling ball forward causes you and the skateboard to roll backward.",
    diagramType: "thrust",
  },
  {
    id: "acceleration",
    title: "Acceleration & Newton's 2nd Law",
    formula: "a = F_net / m",
    shortSummary: "Net force divided by total spacecraft mass determines change in velocity.",
    detailedExplanation:
      "Upward acceleration only occurs when engine Thrust is greater than Gravitational Weight (T > W). The net force F_net = Thrust - Weight. If Thrust equals Weight, the lander hovers with zero acceleration. If Thrust is less than Weight, the lander accelerates downward.",
    realWorldAnalogy:
      "Stepping on the gas pedal in a light sports car vs a heavy cargo truck with the same engine.",
    diagramType: "twr",
  },
  {
    id: "vectors",
    title: "Velocity & Vectors",
    formula: "v_total = √(vx² + vy²)",
    shortSummary: "Motion in 2D is resolved into vertical descent and horizontal drift.",
    detailedExplanation:
      "Descent speed (vy) and horizontal drift (vx) operate independently. Tilting the spacecraft rotates the thrust vector: a portion of engine power slows down vertical fall (T · cos θ), while another portion counteracts horizontal drift or wind (T · sin θ).",
    realWorldAnalogy:
      "Rowing a boat across a river with a strong current: you must aim angled upstream to reach the opposite dock directly.",
    diagramType: "vectors",
  },
  {
    id: "mass",
    title: "Mass, Inertia & Fuel Burn",
    formula: "m(t) = m_dry + m_fuel(t)",
    shortSummary: "As fuel is consumed, the spacecraft becomes lighter and accelerates faster.",
    detailedExplanation:
      "At the start of descent, the spacecraft is heavy because its propellant tanks are full ('wet mass'). As the engines fire, fuel is expelled as exhaust. The remaining spacecraft mass decreases, meaning the exact same engine thrust produces greater acceleration (a = T / m) as time goes on!",
    realWorldAnalogy:
      "Pushing an empty shopping cart feels effortless compared to pushing one filled with 50 kilograms of groceries.",
    diagramType: "mass",
  },
  {
    id: "fuel",
    title: "Fuel & Gravity Drag",
    formula: "Δv_loss = g · t_burn",
    shortSummary:
      "Hovering wastes fuel fighting gravity. The most efficient burn is concise and timed.",
    detailedExplanation:
      "Every second you spend hovering in place, your engine burns propellant just to cancel out gravity without getting you any closer to the ground. This waste is called 'Gravity Drag' (or gravity tax). Aerospace engineers minimize flight duration by delaying the main deceleration burn until the last safe seconds (a 'hoverslam' or 'suicide burn').",
    realWorldAnalogy:
      "Holding a heavy textbook at arm's length: you aren't doing productive work moving it, but your arm muscles tire out quickly.",
    diagramType: "fuel",
  },
  {
    id: "angle",
    title: "Landing Angle & Tip-Over Torque",
    formula: "τ = r · F · sin(θ)",
    shortSummary:
      "Touching down with excessive tilt creates a rotational torque that flips the lander.",
    detailedExplanation:
      "Landing legs provide a stable base polygon. If the spacecraft's Center of Gravity (CoG) is tilted so far that its vertical weight vector falls outside the footprint of the landing legs, gravity creates an unrecoverable overturning torque, causing the spacecraft to roll over and crush its avionics.",
    realWorldAnalogy:
      "Tilting a chair backward on two legs: tilt a few degrees and it snaps back upright; tilt past the tipping point and you tumble backward.",
    diagramType: "angle",
  },
];

export const SPACE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-space-1",
    lab: "space",
    type: "multiple-choice",
    question: "Why does landing on the Moon require less engine thrust than landing on Earth?",
    options: [
      "The Moon has thicker air that slows the lander down",
      "The Moon's mass is smaller, producing only about 1/6th of Earth's gravitational pull",
      "The Moon's surface repels spacecraft with magnetic levitation",
      "Rocket engines burn hotter in a vacuum",
    ],
    correctIndex: 1,
    explanation:
      "Gravitational acceleration depends directly on the planet's mass (g = G·M/r²). Because the Moon has much less mass than Earth, its gravity is only ~1.62 m/s² compared to Earth's 9.81 m/s².",
    concept: "Planetary Gravitational Fields",
  },
  {
    id: "q-space-2",
    lab: "space",
    type: "predict-outcome",
    question:
      "A 1,000 kg spacecraft fires its main thruster with 5,000 N of upward force on a planet where gravity is 5.0 m/s². What is the net vertical acceleration?",
    options: [
      "0 m/s² (Hovering in place)",
      "5.0 m/s² upward",
      "10.0 m/s² downward",
      "-5.0 m/s² downward",
    ],
    correctIndex: 0,
    explanation:
      "The spacecraft's downward weight is W = m · g = 1000 kg × 5.0 m/s² = 5000 N. Since the upward engine thrust is also 5000 N, the net force is 5000 N - 5000 N = 0 N. By Newton's second law, acceleration is 0 m/s² (steady hover).",
    concept: "Thrust-to-Weight Balance",
  },
  {
    id: "q-space-3",
    lab: "space",
    type: "multiple-choice",
    question:
      "How can a rocket engine produce thrust in the vacuum of deep space where there is no air to push against?",
    options: [
      "It sucks in solar wind to propel itself forward",
      "Newton's 3rd Law: it pushes against its own expelled exhaust gas molecules",
      "It uses quantum friction against dark matter",
      "It can only coast and cannot produce thrust in vacuum",
    ],
    correctIndex: 1,
    explanation:
      "Rockets operate via Newton's Third Law (Action and Reaction). The engine exerts a force on the exhaust gas molecules ejecting them backward, and the gas molecules exert an equal and opposite reaction force pushing the rocket forward. Air is not needed!",
    concept: "Action and Reaction in Vacuum",
  },
  {
    id: "q-space-4",
    lab: "space",
    type: "multiple-choice",
    question:
      "As a spacecraft burns its rocket propellant during descent, what happens to its acceleration if the engine throttle remains constant?",
    options: [
      "Acceleration decreases because the fuel is hotter",
      "Acceleration remains exactly constant",
      "Acceleration increases because the spacecraft's mass decreases (a = F / m)",
      "The spacecraft immediately stops falling",
    ],
    correctIndex: 2,
    explanation:
      "According to Newton's Second Law, a = F_net / m. As fuel burns and exits the nozzles, the spacecraft's total mass (m) drops significantly. With constant thrust (F), dividing by a smaller mass yields a higher acceleration!",
    concept: "Variable Mass Dynamics",
  },
  {
    id: "q-space-5",
    lab: "space",
    type: "multiple-choice",
    question:
      "Why is 'hovering' high above the surface considered a wasteful piloting strategy in space exploration?",
    options: [
      "Hovering causes the spacecraft's heat shields to freeze",
      "Every second spent hovering burns fuel just to fight gravity ('gravity drag') without reducing altitude",
      "Hovering confuses the laser altimeter sensors",
      "Planetary magnetic fields pull fuel out of the tanks",
    ],
    correctIndex: 1,
    explanation:
      "Hovering incurs 'gravity drag' (Δv_loss = g · t). When hovering, 100% of the burned propellant is spent balancing gravity rather than changing orbital velocity or descending safely, draining tanks prematurely.",
    concept: "Gravity Drag and Fuel Economy",
  },
  {
    id: "q-space-6",
    lab: "space",
    type: "true-false",
    question:
      "True or False: If a spacecraft touches down inside the landing pad with zero horizontal speed and low vertical speed, but tilted at a 30° angle, it will land safely.",
    options: [
      "True: Landing gear will absorb any angle automatically",
      "False: The center of mass falls outside the leg base, causing the lander to tip over and crash",
    ],
    correctIndex: 1,
    explanation:
      "False! If the tilt angle exceeds the tip-over threshold (typically ~10° to 14° depending on leg stance width), the center of gravity falls outside the landing gear footprint, causing gravitational torque to topple the spacecraft onto its side.",
    concept: "Tip-Over Torque and Stability",
  },
  {
    id: "q-space-7",
    lab: "space",
    type: "multiple-choice",
    question:
      "If a crosswind on Mars is pushing your spacecraft to the RIGHT at 8 m/s, how should you rotate the lander to counteract the drift?",
    options: [
      "Tilt slightly to the LEFT so a portion of main engine thrust pushes leftward against the wind",
      "Tilt to the RIGHT to ride along with the wind",
      "Turn off all engines and let gravity pull you straight down",
      "Spin continuously at 360 degrees per second",
    ],
    correctIndex: 0,
    explanation:
      "By tilting slightly to the left, the thrust vector angles upward and leftward (T · sin θ to the left). This horizontal thrust component cancels the rightward aerodynamic force of the wind, maintaining zero net lateral drift.",
    concept: "Vector Steering and Drift Compensation",
  },
  {
    id: "q-space-8",
    lab: "space",
    type: "multiple-choice",
    question:
      "Why is kinetic energy (Ek = ½ m v²) critical to monitor when approaching the landing surface?",
    options: [
      "Higher kinetic energy turns the lander into a solar battery",
      "Doubling impact velocity quadruples the kinetic energy, causing catastrophic structural failure",
      "Kinetic energy cancels out gravity automatically",
      "Kinetic energy only matters in nuclear physics, not space landings",
    ],
    correctIndex: 1,
    explanation:
      "Kinetic energy scales with the square of velocity (v²). A landing at 6 m/s carries FOUR TIMES the impact energy of a landing at 3 m/s! Excessive impact energy crushes the landing struts and ruptures propellant tanks.",
    concept: "Impact Kinetic Energy",
  },
];

export function diagnoseLandingOutcome(
  outcome: LandingOutcome,
  finalVy: number,
  finalVx: number,
  finalAngle: number,
  distanceFromCenter: number,
  padHalfWidth: number,
  planetName: string,
  gravity: number,
): { outcomeTitle: string; explanation: string; icon: string } {
  switch (outcome) {
    case "success":
      return {
        outcomeTitle: "TOUCHDOWN CONFIRMED — PERFECT LANDING",
        icon: "🏆",
        explanation: `Flawless terminal guidance on ${planetName}! Touchdown descent rate was a gentle ${Math.abs(
          finalVy,
        ).toFixed(
          1,
        )} m/s (well below the 3.0 m/s structural threshold), lateral drift was ${Math.abs(
          finalVx,
        ).toFixed(1)} m/s, and pitch angle was aligned within ${Math.abs(finalAngle).toFixed(
          1,
        )}° of vertical. All landing gear shock absorbers deployed within nominal design tolerances.`,
      };

    case "rough":
      return {
        outcomeTitle: "ROUGH TOUCHDOWN — STRUCTURAL DAMAGE",
        icon: "⚠️",
        explanation: `The spacecraft survived touchdown, but descent rate was firm at ${Math.abs(
          finalVy,
        ).toFixed(1)} m/s (limit: 3.0 m/s) with a ${Math.abs(finalAngle).toFixed(
          1,
        )}° tilt. Hydraulic struts buckled slightly under high kinetic energy (Ek = ½ m v²), but the crew cabin and fuel tanks remained intact.`,
      };

    case "crash-speed":
      return {
        outcomeTitle: "TERMINAL IMPACT — EXCESSIVE DESCENT VELOCITY",
        icon: "💥",
        explanation: `Catastrophic impact! Touchdown vertical speed was ${Math.abs(finalVy).toFixed(
          1,
        )} m/s, far exceeding the maximum allowable 4.5 m/s threshold. Impact kinetic energy (Ek = ½ m v² = ${(
          0.5 *
          1200 *
          finalVy *
          finalVy
        ).toFixed(
          0,
        )} Joules) overwhelmed the shock-absorbing crush cores, causing structural collapse under ${planetName}'s gravitational acceleration of ${gravity.toFixed(
          2,
        )} m/s².`,
      };

    case "crash-angle":
      return {
        outcomeTitle: "ROLLOVER CRASH — SEVERE TILT ANGLE",
        icon: "🔄",
        explanation: `Touchdown pitch angle was ${Math.abs(finalAngle).toFixed(
          1,
        )}° off vertical (safe threshold: < 12°). Because the center of mass leaned beyond the landing gear footprint, gravity created an unrecoverable overturning torque (τ = r × F), causing the spacecraft to flip over and shear its attitude thrusters.`,
      };

    case "crash-terrain":
      return {
        outcomeTitle: "OFF-TARGET CRASH — UNEVEN TERRAIN",
        icon: "🪨",
        explanation: `The lander touched down ${distanceFromCenter.toFixed(
          1,
        )} meters off center, missing the prepared ${padHalfWidth * 2}m landing zone. The footpads struck unpaved boulders and crater slopes on ${planetName}, inducing asymmetrical shock and landing leg rupture.`,
      };

    case "out-of-fuel":
      return {
        outcomeTitle: "FUEL STARVATION — FREE-FALL TRAJECTORY",
        icon: "⛽",
        explanation: `Propellant tanks were completely exhausted before touchdown! With zero fuel remaining, the main aerospike engines starved out in mid-air. Under ${planetName}'s gravity of ${gravity.toFixed(
          2,
        )} m/s², the spacecraft plummeted in unpowered free-fall. Tip: Avoid continuous hovering to conserve fuel against gravity drag!`,
      };
  }
}
