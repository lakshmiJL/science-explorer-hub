import React, { useState } from "react";
import { SpaceSimulationVariables } from "../../types/science";
import {
  Sliders,
  Rocket,
  RotateCcw,
  Sparkles,
  Check,
  Compass,
  Wind,
  Fuel,
  MapPin,
} from "lucide-react";

interface MissionDesignerProps {
  onApplyCustomVariables: (vars: SpaceSimulationVariables) => void;
  initialVariables: SpaceSimulationVariables;
}

export const MissionDesigner: React.FC<MissionDesignerProps> = ({
  onApplyCustomVariables,
  initialVariables,
}) => {
  const [gravity, setGravity] = useState<number>(initialVariables.gravity);
  const [wind, setWind] = useState<number>(initialVariables.windStrength);
  const [altitude, setAltitude] = useState<number>(initialVariables.initialAltitude);
  const [vx, setVx] = useState<number>(initialVariables.initialVx);
  const [vy, setVy] = useState<number>(initialVariables.initialVy);
  const [fuel, setFuel] = useState<number>(initialVariables.fuelCapacity);
  const [padWidth, setPadWidth] = useState<number>(initialVariables.landingPadWidth);
  const [isGenerated, setIsGenerated] = useState(false);

  // Planetary presets
  const applyPreset = (preset: {
    g: number;
    w: number;
    alt: number;
    f: number;
    pad: number;
    name: string;
  }) => {
    setGravity(preset.g);
    setWind(preset.w);
    setAltitude(preset.alt);
    setFuel(preset.f);
    setPadWidth(preset.pad);
  };

  const handleGenerate = () => {
    onApplyCustomVariables({
      ...initialVariables,
      gravity,
      windStrength: wind,
      initialAltitude: altitude,
      initialVx: vx,
      initialVy: vy,
      fuelCapacity: fuel,
      landingPadWidth: padWidth,
    });
    setIsGenerated(true);
    setTimeout(() => setIsGenerated(false), 2000);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 text-white shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Mission Designer Sandbox</h3>
            <p className="text-xs text-slate-400">
              Configure planetary environmental variables and generate custom aerospace flight
              challenges
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => applyPreset({ g: 1.35, w: 0, alt: 220, f: 90, pad: 55, name: "Titan" })}
            className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
          >
            Titan (1.35 m/s²)
          </button>
          <button
            onClick={() =>
              applyPreset({ g: 3.72, w: 16, alt: 320, f: 120, pad: 45, name: "Mars Gale" })
            }
            className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
          >
            Mars Dust Storm
          </button>
          <button
            onClick={() =>
              applyPreset({ g: 14.5, w: 22, alt: 420, f: 220, pad: 35, name: "Super Earth" })
            }
            className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:text-white"
          >
            Super-Earth (14.5 m/s²)
          </button>
        </div>
      </div>

      {/* Grid of Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Gravity */}
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Surface Gravity (g)</span>
            <span className="font-mono text-cyan-400 font-bold">{gravity.toFixed(2)} m/s²</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="25.0"
            step="0.1"
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.5 m/s² (Asteroid)</span>
            <span>25.0 m/s² (Jupiter)</span>
          </div>
        </div>

        {/* 2. Wind Strength */}
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Lateral Wind Strength</span>
            <span className="font-mono text-amber-400 font-bold">{wind.toFixed(0)} m/s</span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="1"
            value={wind}
            onChange={(e) => setWind(parseInt(e.target.value))}
            className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-25 m/s (West)</span>
            <span>0</span>
            <span>+25 m/s (East)</span>
          </div>
        </div>

        {/* 3. Starting Altitude */}
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Initial Altitude</span>
            <span className="font-mono text-cyan-400 font-bold">{altitude} m</span>
          </div>
          <input
            type="range"
            min="120"
            max="500"
            step="10"
            value={altitude}
            onChange={(e) => setAltitude(parseInt(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>120 m (Low)</span>
            <span>500 m (High Orbit)</span>
          </div>
        </div>

        {/* 4. Initial Velocities */}
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Initial Descent Speed (Vy)</span>
            <span className="font-mono text-red-400 font-bold">{vy} m/s</span>
          </div>
          <input
            type="range"
            min="-30"
            max="0"
            step="1"
            value={vy}
            onChange={(e) => setVy(parseInt(e.target.value))}
            className="w-full accent-red-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-30 m/s (High Speed)</span>
            <span>0 m/s (Stationary)</span>
          </div>
        </div>

        {/* 5. Fuel Capacity */}
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Propellant Load</span>
            <span className="font-mono text-emerald-400 font-bold">{fuel} kg</span>
          </div>
          <input
            type="range"
            min="30"
            max="250"
            step="5"
            value={fuel}
            onChange={(e) => setFuel(parseInt(e.target.value))}
            className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30 kg (Emergency Low)</span>
            <span>250 kg (Ample Reserves)</span>
          </div>
        </div>

        {/* 6. Landing Pad Size */}
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Landing-Zone Size</span>
            <span className="font-mono text-purple-400 font-bold">{padWidth} m</span>
          </div>
          <input
            type="range"
            min="25"
            max="80"
            step="2"
            value={padWidth}
            onChange={(e) => setPadWidth(parseInt(e.target.value))}
            className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>25 m (Precision Target)</span>
            <span>80 m (Wide Spaceport)</span>
          </div>
        </div>
      </div>

      {/* Generation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
        <div className="text-xs text-slate-400">
          Once generated, the simulation canvas switches to these custom parameters immediately.
        </div>

        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold px-5 py-2.5 text-xs uppercase tracking-wider transition-all shadow-lg"
        >
          {isGenerated ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Mission Generated!</span>
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              <span>Generate & Launch Challenge</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
