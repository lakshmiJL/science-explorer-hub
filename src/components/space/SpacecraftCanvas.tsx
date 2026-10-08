import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  SpaceSimulationVariables,
  PlanetConfig,
  FlightTelemetryPoint,
  LandingAttemptResult,
  LandingOutcome,
} from "../../types/science";
import { diagnoseLandingOutcome } from "../../data/spaceLandingData";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Flame,
  Wind,
  Navigation,
  Compass,
  Gauge,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface SpacecraftCanvasProps {
  planet: PlanetConfig;
  variables: SpaceSimulationVariables;
  onFinishFlight: (result: LandingAttemptResult) => void;
  attemptCount: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export const SpacecraftCanvas: React.FC<SpacecraftCanvasProps> = ({
  planet,
  variables,
  onFinishFlight,
  attemptCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Flight simulation state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [flightStatus, setFlightStatus] = useState<"flying" | "landed" | "crashed">("flying");

  // Live telemetry for React HUD overlay
  const [hudTelemetry, setHudTelemetry] = useState({
    altitude: variables.initialAltitude,
    vx: variables.initialVx,
    vy: variables.initialVy,
    fuel: variables.fuelCapacity,
    fuelPercent: 100,
    angle: 0,
    thrustPercent: 0,
    gForce: 1.0,
    flightTime: 0,
  });

  // Physical flight variables stored in mutable refs for smooth 60fps canvas loop
  const simState = useRef({
    // Coordinates: x = 0 is pad center, y = altitude (meters)
    x: 0,
    y: variables.initialAltitude,
    vx: variables.initialVx,
    vy: variables.initialVy,
    angle: 0, // degrees: 0 = straight up, positive = tilted right, negative = tilted left
    omega: 0, // angular velocity in deg/s
    fuel: variables.fuelCapacity,
    maxFuel: variables.fuelCapacity,
    mass: variables.mass,
    throttle: 0, // 0 to 1
    rcsLeft: false, // rotate counter-clockwise (left)
    rcsRight: false, // rotate clockwise (right)
    flightTime: 0,
    maxVy: Math.abs(variables.initialVy),
    history: [] as FlightTelemetryPoint[],
    isFinished: false,
  });

  // Particle systems
  const particles = useRef<DustParticle[]>([]);
  const stars = useRef<Star[]>([]);

  // Generate stars once
  useEffect(() => {
    const s: Star[] = [];
    for (let i = 0; i < 90; i++) {
      s.push({
        x: Math.random() * 850,
        y: Math.random() * 320,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
    stars.current = s;
  }, []);

  // Reset simulation function
  const resetSimulation = useCallback(() => {
    simState.current = {
      x: (Math.random() - 0.5) * 40, // slightly off-center start
      y: variables.initialAltitude,
      vx: variables.initialVx,
      vy: variables.initialVy,
      angle: (Math.random() - 0.5) * 6, // slight initial tilt
      omega: 0,
      fuel: variables.fuelCapacity,
      maxFuel: variables.fuelCapacity,
      mass: variables.mass,
      throttle: 0,
      rcsLeft: false,
      rcsRight: false,
      flightTime: 0,
      maxVy: Math.abs(variables.initialVy),
      history: [],
      isFinished: false,
    };
    particles.current = [];
    setFlightStatus("flying");
    setIsRunning(true);
    setIsPaused(false);
  }, [variables]);

  // Re-initialize when variables or planet change
  useEffect(() => {
    resetSimulation();
  }, [resetSimulation, planet.id]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (simState.current.isFinished) return;

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
        e.preventDefault();
        simState.current.throttle = 1.0;
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        simState.current.rcsLeft = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        simState.current.rcsRight = true;
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        simState.current.throttle = 0;
      }
      if (e.key === "p" || e.key === "P") {
        setIsPaused((prev) => !prev);
      }
      if (e.key === "r" || e.key === "R") {
        resetSimulation();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
        simState.current.throttle = 0;
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        simState.current.rcsLeft = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        simState.current.rcsRight = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [resetSimulation]);

  // Main 60 FPS physics and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let telemetryRecordTimer = 0;

    const width = 850;
    const height = 480;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    ctx.scale(dpr, dpr);

    const groundY = height - 60; // pixel coordinate of the ground line
    const pixelsPerMeter = (groundY - 70) / (variables.initialAltitude * 1.15); // dynamically scale view

    const loop = (currentTime: number) => {
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const state = simState.current;

      // 1. PHYSICAL NUMERICAL INTEGRATION (if running & not paused & not finished)
      if (isRunning && !isPaused && !state.isFinished) {
        state.flightTime += dt;

        // Effective total mass: dry mass + fuel
        const currentMass = variables.dryMass + state.fuel;
        state.mass = currentMass;

        // Thrust force
        let thrust = 0;
        if (state.fuel > 0 && state.throttle > 0) {
          thrust = variables.mainThrustMax * state.throttle;
          // Fuel burn rate: burn proportional to throttle
          // e.g. at 100% throttle, burns approx 8 kg/s
          const fuelBurnRate = (variables.mainThrustMax / 3200) * state.throttle;
          const fuelConsumed = fuelBurnRate * dt;
          state.fuel = Math.max(0, state.fuel - fuelConsumed);
        } else {
          state.throttle = 0;
        }

        // Attitude RCS rotation
        const rcsTorque = variables.rcsTorqueMax;
        if (state.rcsLeft && !state.rcsRight) {
          state.omega -= rcsTorque * dt;
        } else if (state.rcsRight && !state.rcsLeft) {
          state.omega += rcsTorque * dt;
        } else {
          // slight rotational dampening
          state.omega *= 0.96;
        }
        state.angle += state.omega * dt;

        // Thrust vector components (angle in radians: 0 = straight up)
        const rad = (state.angle * Math.PI) / 180;
        const thrustX = thrust * Math.sin(rad); // pushes in tilt direction
        const thrustY = thrust * Math.cos(rad); // pushes upward along ship axis

        // Gravity pull (downward is negative vy)
        const gravityForceY = -currentMass * variables.gravity;

        // Wind force (affects horizontal vx if atmosphere enabled)
        let windForceX = 0;
        if (planet.atmosphere && variables.windStrength !== 0) {
          const relWindVx = variables.windStrength - state.vx;
          windForceX = 0.5 * planet.atmosphericDensity * 4.5 * relWindVx * Math.abs(relWindVx);
        }

        // Net accelerations (Newton's 2nd Law: a = F / m)
        const ax = (thrustX + windForceX) / currentMass;
        const ay = (thrustY + gravityForceY) / currentMass;

        // Update velocities
        state.vx += ax * dt;
        state.vy += ay * dt;

        // Update positions
        state.x += state.vx * dt;
        state.y += state.vy * dt;

        // Track peak descent velocity
        if (Math.abs(state.vy) > state.maxVy) {
          state.maxVy = Math.abs(state.vy);
        }

        // Record telemetry point every 0.1s
        telemetryRecordTimer += dt;
        if (telemetryRecordTimer >= 0.1) {
          telemetryRecordTimer = 0;
          state.history.push({
            time: +state.flightTime.toFixed(1),
            altitude: Math.max(0, +state.y.toFixed(1)),
            vx: +state.vx.toFixed(2),
            vy: +state.vy.toFixed(2),
            fuel: +state.fuel.toFixed(1),
            fuelPercent: Math.round((state.fuel / state.maxFuel) * 100),
            angle: +state.angle.toFixed(1),
            thrustPercent: Math.round(state.throttle * 100),
            acceleration: +Math.sqrt(ax * ax + ay * ay).toFixed(2),
          });

          // Update HUD state
          setHudTelemetry({
            altitude: Math.max(0, +state.y.toFixed(1)),
            vx: +state.vx.toFixed(2),
            vy: +state.vy.toFixed(2),
            fuel: +state.fuel.toFixed(1),
            fuelPercent: Math.round((state.fuel / state.maxFuel) * 100),
            angle: +state.angle.toFixed(1),
            thrustPercent: Math.round(state.throttle * 100),
            gForce: +(Math.sqrt(ax * ax + ay * ay) / 9.81).toFixed(2),
            flightTime: +state.flightTime.toFixed(1),
          });
        }

        // 2. TOUCHDOWN / CRASH DETECTION
        if (state.y <= 0) {
          state.y = 0;
          state.isFinished = true;

          // Determine outcome criteria
          const padHalfWidth = variables.landingPadWidth / 2;
          const isInsidePad = Math.abs(state.x) <= padHalfWidth;
          const descentSpeed = Math.abs(state.vy);
          const lateralSpeed = Math.abs(state.vx);
          const tiltAngle = Math.abs(state.angle);

          let outcome: LandingOutcome = "success";

          if (state.fuel <= 0 && descentSpeed > 4.5) {
            outcome = "out-of-fuel";
            setFlightStatus("crashed");
          } else if (!isInsidePad) {
            outcome = "crash-terrain";
            setFlightStatus("crashed");
          } else if (tiltAngle > 13.5) {
            outcome = "crash-angle";
            setFlightStatus("crashed");
          } else if (descentSpeed > 4.5) {
            outcome = "crash-speed";
            setFlightStatus("crashed");
          } else if (descentSpeed > 3.0 || lateralSpeed > 2.2 || tiltAngle > 9.0) {
            outcome = "rough";
            setFlightStatus("landed");
          } else {
            outcome = "success";
            setFlightStatus("landed");
          }

          // Diagnostic explanation
          const diagnosis = diagnoseLandingOutcome(
            outcome,
            state.vy,
            state.vx,
            state.angle,
            Math.abs(state.x),
            padHalfWidth,
            planet.name,
            variables.gravity,
          );

          // Spawn ground impact dust/debris particles
          for (let p = 0; p < 45; p++) {
            particles.current.push({
              x: width / 2 + state.x * pixelsPerMeter,
              y: groundY - 8,
              vx: (Math.random() - 0.5) * (outcome === "success" ? 8 : 16),
              vy: -Math.random() * (outcome === "success" ? 5 : 12),
              size: Math.random() * 5 + 2,
              alpha: 0.9,
              color: outcome === "success" ? planet.surfaceColor : "#ef4444",
              life: 0,
              maxLife: 40 + Math.random() * 30,
            });
          }

          // Dispatch flight completion to parent
          onFinishFlight({
            id: `flight-${Date.now()}`,
            attemptNumber: attemptCount + 1,
            outcome,
            planetId: planet.id,
            planetName: planet.name,
            finalAltitude: 0,
            finalVy: +state.vy.toFixed(2),
            maxVy: +state.maxVy.toFixed(2),
            finalVx: +state.vx.toFixed(2),
            finalAngle: +state.angle.toFixed(1),
            fuelRemaining: +state.fuel.toFixed(1),
            fuelUsed: +(state.maxFuel - state.fuel).toFixed(1),
            flightTime: +state.flightTime.toFixed(1),
            gravity: variables.gravity,
            mass: variables.mass,
            wind: variables.windStrength,
            distanceFromPadCenter: +Math.abs(state.x).toFixed(1),
            scientificExplanation: diagnosis.explanation,
            telemetryHistory: state.history,
            timestamp: Date.now(),
          });
        }
      }

      // ==========================================
      // CANVAS RENDERING
      // ==========================================
      ctx.clearRect(0, 0, width, height);

      // 1. SKY GRADIENT
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, planet.skyGradient[0]);
      skyGrad.addColorStop(1, planet.skyGradient[1]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars in space/vacuum
      if (!planet.atmosphere || planet.id === "moon") {
        stars.current.forEach((st) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Wind dust clouds (Mars / Earth)
      if (planet.atmosphere && variables.windStrength !== 0) {
        ctx.fillStyle =
          planet.id === "mars" ? "rgba(194, 65, 12, 0.15)" : "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < 6; i++) {
          const wx =
            ((state.flightTime * variables.windStrength * 25 + i * 160) % (width + 200)) - 100;
          const wy = 80 + i * 40;
          ctx.beginPath();
          ctx.ellipse(wx, wy, 80, 20, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. PLANETARY SURFACE & CRATERS / TERRAIN
      ctx.save();
      ctx.fillStyle = planet.surfaceColor;
      ctx.fillRect(0, groundY, width, height - groundY);

      // Surface texture & craters
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      [80, 220, 310, 560, 720].forEach((cx, idx) => {
        ctx.beginPath();
        ctx.ellipse(cx, groundY + 15 + idx * 4, 30 + idx * 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. DESIGNATED LANDING PAD
      const padCenterPixX = width / 2;
      const padHalfPixWidth = (variables.landingPadWidth * pixelsPerMeter) / 2;

      // Pad foundation slab
      const padGrad = ctx.createLinearGradient(0, groundY - 8, 0, groundY);
      padGrad.addColorStop(0, "#334155");
      padGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = padGrad;
      ctx.fillRect(padCenterPixX - padHalfPixWidth, groundY - 8, padHalfPixWidth * 2, 8);

      // Hazard stripes on landing pad surface
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 3;
      ctx.strokeRect(padCenterPixX - padHalfPixWidth, groundY - 8, padHalfPixWidth * 2, 8);

      // Target bulls-eye crosshair in pad center
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(padCenterPixX, groundY - 4, 18, 0, Math.PI * 2);
      ctx.moveTo(padCenterPixX - 25, groundY - 4);
      ctx.lineTo(padCenterPixX + 25, groundY - 4);
      ctx.stroke();

      // Blinking Green/Cyan Laser Beacons on Pad Edges
      const beaconGlow = Math.sin(state.flightTime * 6) > 0 ? "#10b981" : "#059669";
      ctx.fillStyle = beaconGlow;
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 10;
      // Left beacon tower
      ctx.fillRect(padCenterPixX - padHalfPixWidth - 4, groundY - 24, 6, 20);
      ctx.beginPath();
      ctx.arc(padCenterPixX - padHalfPixWidth - 1, groundY - 26, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Right beacon tower
      ctx.fillRect(padCenterPixX + padHalfPixWidth - 2, groundY - 24, 6, 20);
      ctx.beginPath();
      ctx.arc(padCenterPixX + padHalfPixWidth + 1, groundY - 26, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 4. SPACECRAFT POSITION & RENDERING
      const shipPixX = width / 2 + state.x * pixelsPerMeter;
      const shipPixY = groundY - state.y * pixelsPerMeter - 24; // lander footpads touch ground at y=0

      ctx.save();
      ctx.translate(shipPixX, shipPixY);
      ctx.rotate((state.angle * Math.PI) / 180);

      // MAIN ENGINE EXHAUST FLAME (when firing)
      if (state.throttle > 0 && state.fuel > 0) {
        ctx.save();
        const flameLength = 35 + Math.sin(state.flightTime * 30) * 10 * state.throttle;
        const flameWidth = 14 * state.throttle;

        // Outer Flame gradient (Orange-Red)
        const outerGrad = ctx.createLinearGradient(0, 18, 0, 18 + flameLength);
        outerGrad.addColorStop(0, "#38bdf8");
        outerGrad.addColorStop(0.3, "#f97316");
        outerGrad.addColorStop(0.8, "#dc2626");
        outerGrad.addColorStop(1, "rgba(220, 38, 38, 0)");

        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.moveTo(-flameWidth, 18);
        ctx.quadraticCurveTo(0, 18 + flameLength * 1.2, flameWidth, 18);
        ctx.quadraticCurveTo(0, 18 + flameLength * 0.7, -flameWidth, 18);
        ctx.fill();

        // Inner Core Flame (Supersonic Mach Diamonds / Cyan-White)
        const innerGrad = ctx.createLinearGradient(0, 18, 0, 18 + flameLength * 0.6);
        innerGrad.addColorStop(0, "#ffffff");
        innerGrad.addColorStop(0.5, "#38bdf8");
        innerGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.moveTo(-flameWidth * 0.45, 18);
        ctx.lineTo(0, 18 + flameLength * 0.6);
        ctx.lineTo(flameWidth * 0.45, 18);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Ground dust blast particles when lander is close to surface
        if (state.y < 35) {
          for (let d = 0; d < 3; d++) {
            particles.current.push({
              x: shipPixX + (Math.random() - 0.5) * 20,
              y: groundY - 2,
              vx: (Math.random() - 0.5) * 12,
              vy: -Math.random() * 3,
              size: Math.random() * 4 + 1.5,
              alpha: 0.7,
              color: planet.surfaceColor,
              life: 0,
              maxLife: 25,
            });
          }
        }
      }

      // RCS LATERAL PUFFS (when rotating)
      if (state.rcsLeft) {
        // Puff out right nozzle
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(18, -6, 4 + Math.random() * 3, 0, Math.PI * 2);
        ctx.arc(26, -6, 6 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (state.rcsRight) {
        // Puff out left nozzle
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(-18, -6, 4 + Math.random() * 3, 0, Math.PI * 2);
        ctx.arc(-26, -6, 6 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // SPACECRAFT GEOMETRY
      // 1. Landing Legs & Footpads
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Left leg strut
      ctx.moveTo(-14, 8);
      ctx.lineTo(-24, 24);
      // Left footpad
      ctx.moveTo(-28, 24);
      ctx.lineTo(-20, 24);

      // Right leg strut
      ctx.moveTo(14, 8);
      ctx.lineTo(24, 24);
      // Right footpad
      ctx.moveTo(20, 24);
      ctx.lineTo(28, 24);
      ctx.stroke();

      // Shock absorber cylinders
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-10, 4);
      ctx.lineTo(-20, 20);
      ctx.moveTo(10, 4);
      ctx.lineTo(20, 20);
      ctx.stroke();

      // 2. Main Engine Bell
      ctx.fillStyle = "#475569";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, 12);
      ctx.lineTo(-10, 18);
      ctx.lineTo(10, 18);
      ctx.lineTo(6, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3. Central Service Module (Fuel Tanks)
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-16, -6, 32, 20, 4);
      ctx.fill();
      ctx.stroke();

      // Spherical Gold foil propellant tank
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(0, 4, 7, 0, Math.PI * 2);
      ctx.fill();

      // 4. Command Capsule (Upper Aerodynamic Nose)
      ctx.fillStyle = "#f8fafc";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -6);
      ctx.lineTo(-6, -26);
      ctx.lineTo(6, -26);
      ctx.lineTo(14, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Capsule Visor Glass
      ctx.fillStyle = "#06b6d4";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(-6, -20, 12, 7, 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Status indicator on capsule nose
      ctx.fillStyle = state.isFinished
        ? flightStatus === "landed"
          ? "#10b981"
          : "#ef4444"
        : "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, -28, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 5. UPDATE AND DRAW PARTICLES (Dust / Explosions)
      for (let p = particles.current.length - 1; p >= 0; p--) {
        const part = particles.current[p]!;
        part.life++;
        part.x += part.vx;
        part.y += part.vy;

        const alpha = part.alpha * (1 - part.life / part.maxLife);
        ctx.fillStyle = part.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (part.life >= part.maxLife) {
          particles.current.splice(p, 1);
        }
      }

      // 6. ON-CANVAS MINI TELEMETRY HUD (Top corners)
      ctx.save();
      // Left: Altimeter & Speed vectors
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(16, 16, 190, 88, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("RADAR ALTIMETER", 26, 32);

      ctx.font = "bold 15px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${Math.max(0, state.y).toFixed(1)} m`, 26, 52);

      // Descent speed indicator with color safety code
      const vSafe = Math.abs(state.vy) <= 3.0;
      const vWarn = Math.abs(state.vy) <= 4.5;
      ctx.font = "11px monospace";
      ctx.fillStyle = vSafe ? "#34d399" : vWarn ? "#facc15" : "#f87171";
      ctx.fillText(`DESCENT (Vy): ${state.vy.toFixed(1)} m/s`, 26, 72);

      ctx.fillStyle = Math.abs(state.vx) <= 2.0 ? "#94a3b8" : "#facc15";
      ctx.fillText(`DRIFT (Vx): ${state.vx.toFixed(1)} m/s`, 26, 88);

      // Right: Fuel & Attitude
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width - 206, 16, 190, 88, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("PROPELLANT TANKS", width - 196, 32);

      // Fuel Bar
      const fuelPct = Math.max(0, state.fuel / state.maxFuel);
      ctx.fillStyle = "#334155";
      ctx.fillRect(width - 196, 42, 170, 10);
      ctx.fillStyle = fuelPct > 0.25 ? "#38bdf8" : "#ef4444";
      ctx.fillRect(width - 196, 42, 170 * fuelPct, 10);

      ctx.font = "11px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${state.fuel.toFixed(1)} kg (${Math.round(fuelPct * 100)}%)`, width - 196, 70);

      const tiltSafe = Math.abs(state.angle) <= 10;
      ctx.fillStyle = tiltSafe ? "#34d399" : "#f87171";
      ctx.fillText(`PITCH ANGLE: ${state.angle.toFixed(1)}°`, width - 196, 88);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [isRunning, isPaused, planet, variables, onFinishFlight, attemptCount, flightStatus]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col rounded-3xl border border-cyan-500/30 bg-slate-950 p-4 sm:p-5 text-white shadow-2xl space-y-4"
    >
      {/* Simulation Header & Flight State Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {planet.name} Descent Phase
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                g = {variables.gravity.toFixed(2)} m/s²
              </span>
              {planet.atmosphere && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  <Wind className="h-3 w-3" />
                  <span>Wind: {variables.windStrength} m/s</span>
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-100">
              Artemis-Class Lunar/Planetary Lander Simulator
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={simState.current.isFinished}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            {isPaused ? (
              <Play className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Flight</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Stage */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="block w-full" />

        {/* Flight Status Banner on Completion */}
        {flightStatus !== "flying" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-xs p-6 text-center animate-in fade-in zoom-in-95 duration-300 pointer-events-none">
            {flightStatus === "landed" ? (
              <div className="rounded-2xl border border-emerald-500/60 bg-emerald-950/90 p-5 shadow-2xl max-w-md space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-base font-black text-white">TOUCHDOWN SUCCESSFUL!</h4>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Safe landing inside target coordinates. Check the Mission Analysis below for full
                  telemetry breakdown.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-500/60 bg-red-950/90 p-5 shadow-2xl max-w-md space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h4 className="text-base font-black text-white">LANDING FAILURE / CRASH</h4>
                <p className="text-xs text-red-200 leading-relaxed">
                  Impact exceeded structural tolerances. Review the diagnostic report below to
                  diagnose the physics cause!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Flight Controls Cockpit Tray */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4">
        {/* Throttle & Engine Ignition */}
        <div className="flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>Main Thruster Ignition</span>
            </span>
            <span className="font-mono text-cyan-400">{hudTelemetry.thrustPercent}%</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onMouseDown={() => (simState.current.throttle = 1.0)}
              onMouseUp={() => (simState.current.throttle = 0)}
              onTouchStart={() => (simState.current.throttle = 1.0)}
              onTouchEnd={() => (simState.current.throttle = 0)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold py-3 text-xs uppercase tracking-wider transition-all shadow-md select-none"
            >
              <ArrowUp className="h-4 w-4 stroke-[3]" />
              <span>Hold for Full Thrust</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400">
            Keyboard: Hold <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">W</kbd>,{" "}
            <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">↑</kbd>, or{" "}
            <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">Spacebar</kbd>
          </span>
        </div>

        {/* Attitude RCS Steering Controls */}
        <div className="flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-purple-400" />
              <span>Attitude / RCS Thrusters</span>
            </span>
            <span className="font-mono text-purple-300">{hudTelemetry.angle}° tilt</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onMouseDown={() => (simState.current.rcsLeft = true)}
              onMouseUp={() => (simState.current.rcsLeft = false)}
              onTouchStart={() => (simState.current.rcsLeft = true)}
              onTouchEnd={() => (simState.current.rcsLeft = false)}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold py-2.5 text-xs transition-all select-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Rotate Left</span>
            </button>

            <button
              onMouseDown={() => (simState.current.rcsRight = true)}
              onMouseUp={() => (simState.current.rcsRight = false)}
              onTouchStart={() => (simState.current.rcsRight = true)}
              onTouchEnd={() => (simState.current.rcsRight = false)}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold py-2.5 text-xs transition-all select-none"
            >
              <span>Rotate Right</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-400">
            Keyboard: Hold <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">A</kbd> /{" "}
            <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">D</kbd> or{" "}
            <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">←</kbd> /{" "}
            <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">→</kbd>
          </span>
        </div>

        {/* Live Safety Tolerances HUD */}
        <div className="flex flex-col justify-between space-y-1 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs font-mono">
          <div className="text-[11px] font-bold text-slate-300">LANDING SAFETY CRITERIA:</div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Max Vertical Speed:</span>
            <span
              className={
                Math.abs(hudTelemetry.vy) <= 3.0 ? "text-emerald-400 font-bold" : "text-amber-400"
              }
            >
              ≤ 3.0 m/s (Current: {Math.abs(hudTelemetry.vy).toFixed(1)})
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Max Horizontal Drift:</span>
            <span
              className={
                Math.abs(hudTelemetry.vx) <= 2.0 ? "text-emerald-400 font-bold" : "text-amber-400"
              }
            >
              ≤ 2.0 m/s (Current: {Math.abs(hudTelemetry.vx).toFixed(1)})
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Max Tilt Angle:</span>
            <span
              className={
                Math.abs(hudTelemetry.angle) <= 10 ? "text-emerald-400 font-bold" : "text-red-400"
              }
            >
              ≤ 10.0° (Current: {Math.abs(hudTelemetry.angle).toFixed(1)}°)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
