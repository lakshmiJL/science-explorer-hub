import React, { useState } from "react";
import { FlightTelemetryPoint } from "../../types/science";
import { TrendingDown, Activity, Fuel, Layers } from "lucide-react";

interface TelemetryChartsProps {
  telemetry: FlightTelemetryPoint[];
  gravity: number;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ telemetry, gravity }) => {
  const [activeTab, setActiveTab] = useState<"all" | "altitude" | "velocity" | "fuel">("all");

  if (!telemetry || telemetry.length < 2) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-400">
        Flight duration was too short to record detailed telemetry graphs. Run a full descent to
        inspect time-series charts!
      </div>
    );
  }

  const times = telemetry.map((d) => d.time);
  const maxTime = Math.max(...times, 1);

  // SVG Chart Helper
  const chartWidth = 520;
  const chartHeight = 180;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 25;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  // Chart 1: Altitude vs Time
  const maxAlt = Math.max(...telemetry.map((d) => d.altitude), 10);
  const altPoints = telemetry
    .map((d) => {
      const x = padLeft + (d.time / maxTime) * plotW;
      const y = padTop + plotH - (d.altitude / maxAlt) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Chart 2: Velocity vs Time (Vertical descent vy and horizontal vx)
  const minVy = Math.min(...telemetry.map((d) => d.vy), -5);
  const maxVy = Math.max(...telemetry.map((d) => d.vy), 5);
  const vRange = Math.max(Math.abs(minVy), Math.abs(maxVy), 10);

  const vyPoints = telemetry
    .map((d) => {
      const x = padLeft + (d.time / maxTime) * plotW;
      // 0 is centered at padTop + plotH / 2
      const y = padTop + plotH / 2 - (d.vy / vRange) * (plotH / 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const vxPoints = telemetry
    .map((d) => {
      const x = padLeft + (d.time / maxTime) * plotW;
      const y = padTop + plotH / 2 - (d.vx / vRange) * (plotH / 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Safe landing limit line at -3.0 m/s
  const safeVyY = padTop + plotH / 2 - (-3.0 / vRange) * (plotH / 2);

  // Chart 3: Fuel vs Time
  const maxFuel = Math.max(...telemetry.map((d) => d.fuel), 10);
  const fuelPoints = telemetry
    .map((d) => {
      const x = padLeft + (d.time / maxTime) * plotW;
      const y = padTop + plotH - (d.fuel / maxFuel) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="space-y-4 rounded-3xl border border-border/80 bg-slate-950 p-6 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-bold text-slate-100">Flight Telemetry Records</h4>
            <p className="text-[11px] text-slate-400">
              Recorded at 10 Hz throughout descent • Total flight time: {maxTime.toFixed(1)}s
            </p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
              activeTab === "all"
                ? "bg-cyan-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All 3 Graphs
          </button>
          <button
            onClick={() => setActiveTab("altitude")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
              activeTab === "altitude"
                ? "bg-cyan-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Altitude
          </button>
          <button
            onClick={() => setActiveTab("velocity")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
              activeTab === "velocity"
                ? "bg-cyan-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Velocity
          </button>
          <button
            onClick={() => setActiveTab("fuel")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
              activeTab === "fuel"
                ? "bg-cyan-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Fuel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GRAPH 1: Altitude vs Time */}
        {(activeTab === "all" || activeTab === "altitude") && (
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-cyan-400" />
                <span>1. Altitude vs Time</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Initial: {maxAlt.toFixed(0)}m
              </span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Grid Lines */}
              <line
                x1={padLeft}
                y1={padTop}
                x2={chartWidth - padRight}
                y2={padTop}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <line
                x1={padLeft}
                y1={padTop + plotH / 2}
                x2={chartWidth - padRight}
                y2={padTop + plotH / 2}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <line
                x1={padLeft}
                y1={padTop + plotH}
                x2={chartWidth - padRight}
                y2={padTop + plotH}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Y Axis Labels */}
              <text
                x={padLeft - 6}
                y={padTop + 4}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {maxAlt.toFixed(0)}m
              </text>
              <text
                x={padLeft - 6}
                y={padTop + plotH / 2 + 3}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {(maxAlt / 2).toFixed(0)}m
              </text>
              <text
                x={padLeft - 6}
                y={padTop + plotH}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                0m
              </text>

              {/* X Axis Labels */}
              <text
                x={padLeft}
                y={chartHeight - 6}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                0s
              </text>
              <text
                x={chartWidth - padRight}
                y={chartHeight - 6}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {maxTime.toFixed(1)}s
              </text>

              {/* Altitude Trajectory Line */}
              <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={altPoints} />
            </svg>
            <p className="text-[10px] text-slate-400 leading-tight">
              Shows how quickly altitude decreased. A gradual flattening near 0m represents
              successful terminal deceleration.
            </p>
          </div>
        )}

        {/* GRAPH 2: Velocity vs Time */}
        {(activeTab === "all" || activeTab === "velocity") && (
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-amber-400" />
                <span>2. Velocity vs Time</span>
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-amber-400">■ Vy (Vert)</span>
                <span className="text-purple-400">■ Vx (Horiz)</span>
              </div>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Zero line */}
              <line
                x1={padLeft}
                y1={padTop + plotH / 2}
                x2={chartWidth - padRight}
                y2={padTop + plotH / 2}
                stroke="#64748b"
                strokeWidth="1"
              />
              {/* Safe threshold line (-3 m/s) */}
              <line
                x1={padLeft}
                y1={safeVyY}
                x2={chartWidth - padRight}
                y2={safeVyY}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Y Axis Labels */}
              <text
                x={padLeft - 6}
                y={padTop + 4}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                +{vRange.toFixed(0)}
              </text>
              <text
                x={padLeft - 6}
                y={padTop + plotH / 2 + 3}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                0
              </text>
              <text
                x={padLeft - 6}
                y={safeVyY + 3}
                fill="#10b981"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                -3.0
              </text>
              <text
                x={padLeft - 6}
                y={padTop + plotH}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                -{vRange.toFixed(0)}
              </text>

              {/* X Axis Labels */}
              <text
                x={padLeft}
                y={chartHeight - 6}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                0s
              </text>
              <text
                x={chartWidth - padRight}
                y={chartHeight - 6}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {maxTime.toFixed(1)}s
              </text>

              {/* Vy and Vx Lines */}
              <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" points={vyPoints} />
              <polyline
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                points={vxPoints}
              />
            </svg>
            <p className="text-[10px] text-slate-400 leading-tight">
              Vertical velocity (amber) must rise back above the green -3.0 m/s threshold before
              touchdown to avoid structural failure.
            </p>
          </div>
        )}

        {/* GRAPH 3: Fuel vs Time */}
        {(activeTab === "all" || activeTab === "fuel") && (
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-emerald-400" />
                <span>3. Fuel vs Time</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Capacity: {maxFuel.toFixed(0)}kg
              </span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Grid Lines */}
              <line
                x1={padLeft}
                y1={padTop}
                x2={chartWidth - padRight}
                y2={padTop}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <line
                x1={padLeft}
                y1={padTop + plotH / 2}
                x2={chartWidth - padRight}
                y2={padTop + plotH / 2}
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <line
                x1={padLeft}
                y1={padTop + plotH}
                x2={chartWidth - padRight}
                y2={padTop + plotH}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Y Axis Labels */}
              <text
                x={padLeft - 6}
                y={padTop + 4}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {maxFuel.toFixed(0)}kg
              </text>
              <text
                x={padLeft - 6}
                y={padTop + plotH / 2 + 3}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {(maxFuel / 2).toFixed(0)}kg
              </text>
              <text
                x={padLeft - 6}
                y={padTop + plotH}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                0kg
              </text>

              {/* X Axis Labels */}
              <text
                x={padLeft}
                y={chartHeight - 6}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                0s
              </text>
              <text
                x={chartWidth - padRight}
                y={chartHeight - 6}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {maxTime.toFixed(1)}s
              </text>

              {/* Fuel Curve */}
              <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={fuelPoints} />
            </svg>
            <p className="text-[10px] text-slate-400 leading-tight">
              Fuel burn slope. Steep downward drops indicate high-throttle engine burns; flat
              sections indicate zero-fuel coasting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
