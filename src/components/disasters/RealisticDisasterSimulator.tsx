import React, { useRef, useEffect, useState } from "react";
import { DisasterType } from "../../types/science";
import { Play, Pause, RotateCcw, Activity, ShieldCheck, Info } from "lucide-react";

interface RealisticDisasterSimulatorProps {
  disasterType: DisasterType;
  variables: Record<string, number>;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onReset: () => void;
}

export const RealisticDisasterSimulator: React.FC<RealisticDisasterSimulatorProps> = ({
  disasterType,
  variables,
  isSimulating,
  onToggleSimulate,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Readouts for students
  const [telemetryText, setTelemetryText] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 840;
    const height = 440;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    ctx.scale(dpr, dpr);

    // Dynamic particle arrays
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];

    // Seismograph data buffer
    const seismoHistory: number[] = new Array(80).fill(0);

    const render = () => {
      if (isSimulating) {
        tick++;
      }

      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // 1. EARTHQUAKE (TECTONIC FAULT & SEISMIC WAVES)
      // ==========================================
      if (disasterType === "earthquake") {
        const magnitude = variables["magnitude"] ?? 6.5;
        const depth = variables["depth"] ?? 15;
        const distance = variables["distance"] ?? 25;

        // Ground split / fault geometry
        const groundY = 160;
        const faultX = width * 0.45;
        const hypocenterY = groundY + Math.min(220, depth * 8 + 40);

        // Calculate surface shaking offset
        const shakeAmplitude = isSimulating ? Math.pow(magnitude, 1.4) * 0.9 : 0;
        const surfaceShake = isSimulating
          ? Math.sin(tick * 0.5) * shakeAmplitude * Math.cos(tick * 0.2)
          : 0;

        // Update seismograph trace
        if (isSimulating) {
          seismoHistory.shift();
          seismoHistory.push(surfaceShake * (Math.random() * 0.8 + 0.6));
        }

        // Sky atmosphere
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGrad.addColorStop(0, "#090d16");
        skyGrad.addColorStop(1, "#1e293b");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, groundY);

        // Geological strata layers
        // Layer 1: Soil / Sedimentary (upper)
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, groundY, width, 40);
        // Layer 2: Granitic Continental Crust
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, groundY + 40, width, 110);
        // Layer 3: Dense Basaltic Bedrock / Lithosphere
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, groundY + 150, width, height - (groundY + 150));

        // Strata separation lines
        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, groundY + 40);
        ctx.lineTo(width, groundY + 40);
        ctx.moveTo(0, groundY + 150);
        ctx.lineTo(width, groundY + 150);
        ctx.stroke();

        // Tectonic Fault Line (inclined strike-slip fracture)
        ctx.save();
        ctx.strokeStyle = isSimulating ? "#ef4444" : "#f59e0b";
        ctx.lineWidth = isSimulating ? 3 : 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(faultX + 30, groundY);
        ctx.lineTo(faultX - 50, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tectonic plates stress arrows
        ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
        ctx.font = "bold 10px monospace";
        ctx.fillText("◄ TECTONIC PLATE A", faultX - 140, groundY + 70);
        ctx.fillText("TECTONIC PLATE B ►", faultX + 40, groundY + 70);
        ctx.restore();

        // Hypocenter / Focus (Earthquake origin)
        ctx.save();
        const hypoX = faultX - 15;
        const hypoPulse = Math.sin(tick * 0.3) * 4;

        ctx.beginPath();
        ctx.arc(hypoX, hypocenterY, 8 + (isSimulating ? hypoPulse : 0), 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("HYPOCENTER", hypoX, hypocenterY + 20);
        ctx.restore();

        // Expanding Seismic Shockwaves (P-Waves compressional & S-Waves transverse)
        if (isSimulating) {
          ctx.save();
          for (let i = 1; i <= 4; i++) {
            const waveRadius = ((tick * 4 + i * 55) % 360) + 10;
            const alpha = Math.max(0, 1 - waveRadius / 360);

            // Fast Primary (P) Wave - Amber
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.7})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(hypoX, hypocenterY, waveRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Slower Secondary (S) Shear Wave - Red
            const sRadius = waveRadius * 0.65;
            ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.85})`;
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(hypoX, hypocenterY, sRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();
        }

        // Surface Buildings with resonant sway
        ctx.save();
        const b1X = 140 + surfaceShake * 1.2;
        const b2X = 240 + surfaceShake * 1.6;
        const b3X = 640 + surfaceShake * 0.8;

        // Building 1 (Medium office)
        ctx.fillStyle = "#475569";
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        ctx.fillRect(b1X - 25, groundY - 70, 50, 70);
        ctx.strokeRect(b1X - 25, groundY - 70, 50, 70);
        // Windows
        ctx.fillStyle = "#fef08a";
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 3; col++) {
            ctx.fillRect(b1X - 18 + col * 14, groundY - 62 + row * 15, 6, 8);
          }
        }

        // Building 2 (Tall Skyscraper - heavy sway)
        ctx.fillStyle = "#334155";
        ctx.fillRect(b2X - 30, groundY - 120, 60, 120);
        ctx.strokeRect(b2X - 30, groundY - 120, 60, 120);
        for (let row = 0; row < 7; row++) {
          for (let col = 0; col < 3; col++) {
            ctx.fillRect(b2X - 20 + col * 16, groundY - 112 + row * 16, 8, 9);
          }
        }

        // Building 3 (Residential - distant from epicenter)
        ctx.fillStyle = "#64748b";
        ctx.fillRect(b3X - 20, groundY - 45, 40, 45);
        ctx.strokeRect(b3X - 20, groundY - 45, 40, 45);
        ctx.restore();

        // Seismograph HUD in bottom right corner
        ctx.save();
        const hudX = width - 260;
        const hudY = height - 95;
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, 240, 80, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.fillText("LIVE SEISMIC ACCELEROGRAM", hudX + 12, hudY + 16);

        // Seismo wave line
        ctx.strokeStyle = isSimulating ? "#ef4444" : "#34d399";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        seismoHistory.forEach((val, idx) => {
          const px = hudX + 12 + idx * 2.7;
          const py = hudY + 50 + val;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 2. VOLCANO (STRATOVOLCANO & PLINIAN PLUME)
      // ==========================================
      else if (disasterType === "volcano") {
        const magmaPressure = variables["magmaPressure"] ?? 75;
        const silicaContent = variables["silicaContent"] ?? 65;

        // Ground & Volcano cone geometry
        const groundY = height - 80;
        const craterX = width * 0.5;
        const craterY = 160;
        const craterWidth = 46;

        // Sky backdrop (dark ash twilight)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        skyGrad.addColorStop(0, isSimulating ? "#18181b" : "#0c4a6e");
        skyGrad.addColorStop(1, isSimulating ? "#292524" : "#1e293b");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, groundY);

        // Underground Magma Chamber
        const magmaY = height - 35;
        const magmaGlow = ctx.createRadialGradient(craterX, magmaY, 10, craterX, magmaY, 110);
        magmaGlow.addColorStop(0, "#fef08a");
        magmaGlow.addColorStop(0.3, "#f97316");
        magmaGlow.addColorStop(0.8, "#dc2626");
        magmaGlow.addColorStop(1, "rgba(15, 23, 42, 0.9)");
        ctx.fillStyle = magmaGlow;
        ctx.beginPath();
        ctx.ellipse(craterX, magmaY, 130, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`MAGMA CHAMBER [${magmaPressure} MPa]`, craterX, magmaY + 4);

        // Central Vertical Conduit
        const conduitGrad = ctx.createLinearGradient(craterX - 12, 0, craterX + 12, 0);
        conduitGrad.addColorStop(0, "#dc2626");
        conduitGrad.addColorStop(0.5, "#fef08a");
        conduitGrad.addColorStop(1, "#dc2626");
        ctx.fillStyle = conduitGrad;
        ctx.fillRect(craterX - 12, craterY, 24, groundY - craterY + 20);

        // Stratovolcano Mountain Edifice (Layered Basalt & Ash strata)
        ctx.save();
        ctx.fillStyle = "#292524";
        ctx.beginPath();
        ctx.moveTo(craterX - 260, groundY);
        ctx.lineTo(craterX - craterWidth / 2, craterY);
        ctx.lineTo(craterX + craterWidth / 2, craterY);
        ctx.lineTo(craterX + 260, groundY);
        ctx.closePath();
        ctx.fill();

        // Mountain slopes highlights and snow/rock ribs
        ctx.strokeStyle = "#44403c";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(craterX - 220, groundY);
        ctx.lineTo(craterX - 16, craterY + 10);
        ctx.moveTo(craterX + 220, groundY);
        ctx.lineTo(craterX + 16, craterY + 10);
        ctx.stroke();
        ctx.restore();

        // Eruption Effects when running:
        if (isSimulating) {
          // 1. Spawning Ash & Tephra Particles
          if (Math.random() < 0.8) {
            particles.push({
              x: craterX + (Math.random() * 20 - 10),
              y: craterY,
              vx: (Math.random() - 0.5) * 3,
              vy: -(Math.random() * 5 + 4),
              size: Math.random() * 16 + 8,
              color: Math.random() > 0.3 ? "#57534e" : "#ea580c",
              alpha: 0.8,
              life: 0,
              maxLife: 65,
            });
          }

          // 2. Billowing Pyroclastic Umbrella Cloud at Top
          ctx.save();
          const cloudY = 60;
          for (let i = 0; i < 6; i++) {
            const puffX = craterX + Math.sin(tick * 0.05 + i) * (50 + i * 20);
            const puffY = cloudY + Math.cos(tick * 0.06 + i) * 14;
            const puffRadius = 38 + i * 6;

            ctx.fillStyle = "rgba(87, 83, 78, 0.7)";
            ctx.beginPath();
            ctx.arc(puffX, puffY, puffRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          // Volcanic Lightning discharge
          if (Math.random() < 0.12) {
            ctx.strokeStyle = "#fef08a";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(craterX - 30, cloudY + 20);
            ctx.lineTo(craterX - 10, cloudY + 50);
            ctx.lineTo(craterX - 25, cloudY + 70);
            ctx.lineTo(craterX - 5, cloudY + 95);
            ctx.stroke();
          }
          ctx.restore();

          // 3. Glowing Lava Fountains & Slope Flows
          ctx.save();
          // Crater lava pool
          ctx.fillStyle = "#f97316";
          ctx.fillRect(craterX - craterWidth / 2, craterY - 4, craterWidth, 10);

          // Flow down left flank
          ctx.strokeStyle = "#ea580c";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(craterX - 14, craterY);
          ctx.quadraticCurveTo(craterX - 80, craterY + 60, craterX - 160, groundY);
          ctx.stroke();

          // Flow down right flank
          ctx.strokeStyle = "#f97316";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(craterX + 16, craterY);
          ctx.quadraticCurveTo(craterX + 70, craterY + 50, craterX + 140, groundY);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ==========================================
      // 3. TSUNAMI (OCEAN BASIN, SHOALING & INUNDATION)
      // ==========================================
      else if (disasterType === "tsunami") {
        const seafloorOffset = variables["seafloorDisplacement"] ?? 12;
        const oceanDepth = variables["oceanDepth"] ?? 4500;

        // Coastline bathymetry profile
        const seaLevel = 180;
        const shoreStartX = width * 0.65;

        // Draw Bathymetry Bed (continental slope)
        ctx.save();
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.moveTo(0, height - 40); // Deep ocean floor
        ctx.lineTo(shoreStartX - 80, height - 60);
        ctx.lineTo(shoreStartX, seaLevel + 30); // Continental shelf
        ctx.lineTo(width, seaLevel - 20); // Coastal dry land
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Seafloor Fault Line in deep ocean
        const faultX = 140;
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(faultX, height - 100);
        ctx.lineTo(faultX + 20, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Water Column (Deep Blue to Emerald Cyan near coast)
        ctx.save();
        const oceanGrad = ctx.createLinearGradient(0, seaLevel, shoreStartX, seaLevel);
        oceanGrad.addColorStop(0, "rgba(30, 58, 138, 0.85)"); // Deep abyssal blue
        oceanGrad.addColorStop(0.7, "rgba(6, 182, 212, 0.75)"); // Shallow turquoise
        oceanGrad.addColorStop(1, "rgba(20, 184, 166, 0.85)");

        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.moveTo(0, height - 40);
        ctx.lineTo(shoreStartX - 80, height - 60);
        ctx.lineTo(shoreStartX, seaLevel + 30);
        ctx.lineTo(width, seaLevel - 20);

        // Wave profile from deep to shallow
        if (isSimulating) {
          // Shoaling wave: low amplitude in deep water, massive vertical crest near shore
          const shoalingWaveX = (tick * 3.5) % (shoreStartX + 80);
          const waveHeight = (shoalingWaveX / shoreStartX) * (seafloorOffset * 3.5 + 20);

          ctx.lineTo(width, seaLevel);
          for (let x = width; x >= 0; x -= 10) {
            let y = seaLevel;
            // Wave pulse near current wave position
            const dist = Math.abs(x - shoalingWaveX);
            if (dist < 90) {
              const crest = Math.cos((dist / 90) * (Math.PI / 2)) * waveHeight;
              y -= crest;
            }
            ctx.lineTo(x, y);
          }
        } else {
          ctx.lineTo(width, seaLevel);
          ctx.lineTo(0, seaLevel);
        }

        ctx.closePath();
        ctx.fill();

        // Whitecap Foam on wave crest
        if (isSimulating) {
          const shoalingWaveX = (tick * 3.5) % (shoreStartX + 80);
          const waveHeight = (shoalingWaveX / shoreStartX) * (seafloorOffset * 3.5 + 20);
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(shoalingWaveX, seaLevel - waveHeight + 4, 10, 0, Math.PI * 2);
          ctx.arc(shoalingWaveX - 12, seaLevel - waveHeight + 8, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Coastal buildings & Palm trees
        ctx.save();
        const coastalX = width - 90;
        ctx.fillStyle = "#475569";
        ctx.fillRect(coastalX, seaLevel - 50, 36, 40);
        ctx.strokeRect(coastalX, seaLevel - 50, 36, 40);

        // Palm tree
        ctx.strokeStyle = "#854d0e";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(coastalX - 30, seaLevel - 15);
        ctx.quadraticCurveTo(coastalX - 25, seaLevel - 45, coastalX - 20, seaLevel - 55);
        ctx.stroke();

        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.arc(coastalX - 20, seaLevel - 55, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Telemetry annotations on canvas
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.fillText("DEEP OCEAN (High speed ~800 km/h, low height)", 30, seaLevel - 30);
        ctx.fillText(
          "WAVE SHOALING (Speed slows, height surges!)",
          shoreStartX - 80,
          seaLevel - 80,
        );
      }

      // ==========================================
      // 4. HURRICANE (CORIOLIS SPIRAL & EYE DYNAMICS)
      // ==========================================
      else if (disasterType === "hurricane") {
        const seaTemp = variables["seaTemp"] ?? 29.5;
        const windSpeed = variables["windSpeed"] ?? 185;

        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const eyeRadius = 24;

        // Dark warm ocean background
        const oceanGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, 320);
        oceanGrad.addColorStop(0, "#082f49");
        oceanGrad.addColorStop(1, "#030712");
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, width, height);

        // Rotating Logarithmic Spiral Rainbands
        ctx.save();
        ctx.translate(centerX, centerY);
        const spinAngle = isSimulating ? -tick * 0.04 : 0;
        ctx.rotate(spinAngle);

        const arms = 4;
        for (let a = 0; a < arms; a++) {
          const armOffset = (a * Math.PI * 2) / arms;
          ctx.beginPath();

          for (let theta = 0; theta < Math.PI * 3; theta += 0.1) {
            const r = eyeRadius + 14 * Math.exp(0.3 * theta);
            if (r > 240) break;
            const x = Math.cos(theta + armOffset) * r;
            const y = Math.sin(theta + armOffset) * r;

            if (theta === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Rainband color grading (radar reflectivity: green -> yellow -> red)
          ctx.strokeStyle = a % 2 === 0 ? "rgba(239, 68, 68, 0.6)" : "rgba(34, 197, 94, 0.5)";
          ctx.lineWidth = 14;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Eyewall Ring (Intensest convection)
        ctx.strokeStyle = "rgba(244, 63, 94, 0.85)";
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius + 12, 0, Math.PI * 2);
        ctx.stroke();

        // Eye of the Hurricane (Calm center)
        ctx.fillStyle = "#0c4a6e";
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("EYE", 0, 0);

        ctx.restore();

        // Wind vectors & Speed telemetry
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 11px monospace";
        ctx.fillText(`MAX SUSTAINED WINDS: ${windSpeed} km/h`, 30, 40);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(`SEA SURFACE TEMP: ${seaTemp}°C (Tropical Cyclone Fuel)`, 30, 58);
      }

      // ==========================================
      // 5. FLASH FLOOD (RIVER HYDROGRAPH & LEVEE OVERTOP)
      // ==========================================
      else if (disasterType === "flood") {
        const rainfall = variables["rainfallIntensity"] ?? 65;
        const urbanization = variables["urbanization"] ?? 45;

        // Watershed landscape
        const riverBaseY = height - 120;
        // Rising flood stage proportional to rainfall and urbanization
        const floodStage = isSimulating
          ? Math.min(110, (rainfall * 0.9 + urbanization * 0.4) * (tick / 90))
          : 10;

        // Rain Clouds at top
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.roundRect(40, 20, width - 80, 55, 20);
        ctx.fill();

        // Torrential Rain streaks
        if (isSimulating) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
          ctx.lineWidth = 1.4;
          for (let i = 0; i < 40; i++) {
            const rx = (i * 21 + tick * 8) % width;
            const ry = 75 + ((i * 17 + tick * 14) % (height - 180));
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 4, ry + 16);
            ctx.stroke();
          }
        }

        // River Channel & Levee Banks
        ctx.save();
        ctx.fillStyle = "#1e293b";
        // Left Levee Bank
        ctx.beginPath();
        ctx.moveTo(0, riverBaseY - 30);
        ctx.lineTo(240, riverBaseY - 30);
        ctx.lineTo(310, riverBaseY + 60); // river trough
        ctx.lineTo(530, riverBaseY + 60);
        ctx.lineTo(600, riverBaseY - 30); // right levee bank
        ctx.lineTo(width, riverBaseY - 30);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Flood Waters with turbid brown sediment
        const waterY = riverBaseY + 60 - floodStage;
        const floodGrad = ctx.createLinearGradient(0, waterY, 0, height);
        floodGrad.addColorStop(0, "rgba(59, 130, 246, 0.8)");
        floodGrad.addColorStop(0.5, "rgba(180, 83, 9, 0.85)"); // Muddy runoff
        floodGrad.addColorStop(1, "rgba(120, 53, 15, 0.95)");
        ctx.fillStyle = floodGrad;

        ctx.fillRect(0, waterY, width, height - waterY);

        // Water surface waves & eddies
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 15) {
          const wy = waterY + Math.sin(x * 0.05 + tick * 0.2) * 3;
          if (x === 0) ctx.moveTo(x, wy);
          else ctx.lineTo(x, wy);
        }
        ctx.stroke();
        ctx.restore();

        // Homes on floodplain
        ctx.save();
        const home1X = 120;
        const home2X = width - 140;
        ctx.fillStyle = "#64748b";
        ctx.fillRect(home1X, riverBaseY - 60, 36, 30);
        ctx.fillRect(home2X, riverBaseY - 60, 40, 30);
        ctx.restore();

        // Flood Stage Gauge
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 10px monospace";
        ctx.fillText(
          `RIVER WATER STAGE: ${(floodStage / 10).toFixed(1)} m above datum`,
          30,
          height - 20,
        );
      }

      // ==========================================
      // 6. WILDFIRE (CONVECTIVE CROWN FIRE & EMBERS)
      // ==========================================
      else if (disasterType === "wildfire") {
        const windSpeed = variables["windSpeed"] ?? 45;
        const fuelMoisture = variables["fuelMoisture"] ?? 8;

        const groundY = height - 100;

        // Mountain Slope Terrain
        ctx.save();
        ctx.fillStyle = "#1c1917";
        ctx.beginPath();
        ctx.moveTo(0, groundY + 40);
        ctx.lineTo(width, groundY - 60); // uphill incline
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Pine Trees on slope
        const numTrees = 12;
        const fireFrontX = isSimulating ? Math.min(width - 80, 120 + tick * 3.2) : 140;

        for (let i = 0; i < numTrees; i++) {
          const tx = 60 + i * 65;
          const slopeY = groundY + 40 - (tx / width) * 100;
          const isBurned = tx < fireFrontX - 30;
          const isBurning = Math.abs(tx - fireFrontX) <= 30;

          // Tree trunk
          ctx.fillStyle = isBurned ? "#0c0a09" : "#78350f";
          ctx.fillRect(tx - 3, slopeY - 30, 6, 30);

          // Tree Crown foliage
          ctx.fillStyle = isBurned ? "#1c1917" : isBurning ? "#ea580c" : "#15803d";
          ctx.beginPath();
          ctx.moveTo(tx - 18, slopeY - 30);
          ctx.lineTo(tx, slopeY - 70);
          ctx.lineTo(tx + 18, slopeY - 30);
          ctx.closePath();
          ctx.fill();
        }

        // Active Convective Flame Front
        if (isSimulating) {
          const flameSlopeY = groundY + 40 - (fireFrontX / width) * 100;
          const flameTilt = (windSpeed / 100) * 28;

          // Multi-layer flame tongues
          for (let f = 0; f < 5; f++) {
            const fx = fireFrontX - 15 + f * 8;
            const fy = flameSlopeY - 10;
            const fHeight = 65 + Math.sin(tick * 0.4 + f) * 20;

            const flameGrad = ctx.createLinearGradient(fx, fy, fx + flameTilt, fy - fHeight);
            flameGrad.addColorStop(0, "#fef08a");
            flameGrad.addColorStop(0.3, "#f97316");
            flameGrad.addColorStop(0.8, "#dc2626");
            flameGrad.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.moveTo(fx - 10, fy);
            ctx.quadraticCurveTo(
              fx + flameTilt * 0.6,
              fy - fHeight * 0.6,
              fx + flameTilt,
              fy - fHeight,
            );
            ctx.quadraticCurveTo(fx + flameTilt * 0.4, fy - fHeight * 0.4, fx + 10, fy);
            ctx.closePath();
            ctx.fill();
          }

          // Flying Firebrand Embers
          if (Math.random() < 0.6) {
            particles.push({
              x: fireFrontX + 10,
              y: flameSlopeY - 40,
              vx: (windSpeed / 30) * (Math.random() * 3 + 2),
              vy: -(Math.random() * 3 + 1),
              size: Math.random() * 3 + 1.5,
              color: Math.random() > 0.4 ? "#fef08a" : "#f97316",
              alpha: 0.9,
              life: 0,
              maxLife: 45,
            });
          }
        }
        ctx.restore();
      }

      // 7. PARTICLE UPDATE & DRAW (Volcano ash, Wildfire embers, etc.)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const currentAlpha = p.alpha * (1 - p.life / p.maxLife);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [disasterType, variables, isSimulating]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col rounded-3xl border border-amber-500/40 bg-slate-950 p-5 text-white shadow-2xl space-y-4"
    >
      {/* Simulation Stage Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Multi-Layer Geophysics Simulation
            </span>
            <h3 className="text-sm font-bold text-slate-100 capitalize">
              {disasterType} Dynamic Event Model
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSimulate}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-md ${
              isSimulating
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>Pause Simulation</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Physics Model</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Physical Mechanism Callout */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-slate-300 flex items-start gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-200">Scientific Mechanism:</span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {disasterType === "earthquake" &&
              "Tectonic stress accumulates along lithospheric faults until friction is exceeded, unleashing elastic rebound energy as compressional P-waves and shearing S-waves."}
            {disasterType === "volcano" &&
              "Volatile dissolved gases expand as magma ascends. High silica viscosity traps gas bubbles until explosive overpressure fragments magma into buoyant ash plumes and lava flows."}
            {disasterType === "tsunami" &&
              "Submarine thrust faults displace trillions of liters of water. Wave shoaling compresses wavelength in shallow water, transforming imperceptible deep-sea swell into towering coastal surge walls."}
            {disasterType === "hurricane" &&
              "Warm sea surface waters (>26.5°C) feed massive latent heat into towering convective thunderheads, steered into counter-clockwise spiral vortexes by the Earth's Coriolis effect."}
            {disasterType === "flood" &&
              "Intense precipitation saturates the soil watershed capacity. Excess surface runoff funnels into river basins, overwhelming channel conveyance and inundating floodplains."}
            {disasterType === "wildfire" &&
              "Heat transfers via radiation and convection uphill. Wind tilts the flame front, desiccating and preheating fuel ahead while lofting airborne burning embers into unburned canopies."}
          </p>
        </div>
      </div>
    </div>
  );
};
