import React from "react";
import { LandingAttemptResult } from "../../types/science";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Zap,
  Fuel,
  Activity,
} from "lucide-react";

interface MissionComparisonProps {
  currentAttempt: LandingAttemptResult;
  previousAttempt: LandingAttemptResult | null;
}

export const MissionComparison: React.FC<MissionComparisonProps> = ({
  currentAttempt,
  previousAttempt,
}) => {
  if (!previousAttempt) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
        Run at least two flight attempts with adjusted physics variables to unlock the side-by-side
        scientific comparison!
      </div>
    );
  }

  // Calculate physical differences
  const deltaGravity = currentAttempt.gravity - previousAttempt.gravity;
  const deltaMass = currentAttempt.mass - previousAttempt.mass;
  const deltaFuelUsed = currentAttempt.fuelUsed - previousAttempt.fuelUsed;
  const deltaVy = Math.abs(currentAttempt.finalVy) - Math.abs(previousAttempt.finalVy);

  // Generate educational comparison summary
  const getComparisonInsight = () => {
    const insights: string[] = [];

    if (Math.abs(deltaGravity) > 0.1) {
      if (deltaGravity > 0) {
        insights.push(
          `Gravity increased by +${deltaGravity.toFixed(
            2,
          )} m/s². Higher gravitational pull increased the downward weight force (W = m · g), requiring greater continuous thrust and burning ${
            deltaFuelUsed > 0 ? `${deltaFuelUsed.toFixed(1)} kg more fuel` : "more fuel"
          } to arrest descent speed.`,
        );
      } else {
        insights.push(
          `Gravity decreased by ${Math.abs(deltaGravity).toFixed(
            2,
          )} m/s². The weaker gravitational field allowed the lander to decelerate with less engine thrust, significantly easing touchdown.`,
        );
      }
    }

    if (Math.abs(deltaMass) > 50) {
      if (deltaMass > 0) {
        insights.push(
          `Spacecraft mass increased by +${deltaMass.toFixed(
            0,
          )} kg. By Newton's second law (a = F / m), greater inertia reduced the net acceleration produced by the thrusters, requiring earlier ignition.`,
        );
      } else {
        insights.push(
          `Spacecraft mass decreased by ${Math.abs(deltaMass).toFixed(
            0,
          )} kg. The lighter lander accelerated much more rapidly under the same engine thrust, making throttle braking more responsive.`,
        );
      }
    }

    if (insights.length === 0) {
      insights.push(
        `Pilot technique variation: With identical planetary physics, the change in touchdown velocity (${(
          Math.abs(currentAttempt.finalVy) - Math.abs(previousAttempt.finalVy)
        ).toFixed(1)} m/s) was driven primarily by throttle timing and attitude control accuracy.`,
      );
    }

    return insights;
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Perfect Landing
          </span>
        );
      case "rough":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
            <AlertTriangle className="h-3 w-3" /> Rough Touchdown
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-300">
            <XCircle className="h-3 w-3" /> Impact Failure
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-border/80 bg-slate-950 p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Scale className="h-5 w-5 text-cyan-400" />
        <div>
          <h4 className="text-sm font-bold text-slate-100">Flight Comparative Analysis</h4>
          <p className="text-[11px] text-slate-400">
            Attempt #{previousAttempt.attemptNumber} vs Current Attempt #
            {currentAttempt.attemptNumber}
          </p>
        </div>
      </div>

      {/* Side-by-side metric matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Attempt Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Attempt #{previousAttempt.attemptNumber} ({previousAttempt.planetName})
            </span>
            {getOutcomeBadge(previousAttempt.outcome)}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">GRAVITY</span>
              <span className="text-slate-200 font-bold">
                {previousAttempt.gravity.toFixed(2)} m/s²
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">DESCENT VELOCITY</span>
              <span className="text-slate-200 font-bold">
                {Math.abs(previousAttempt.finalVy).toFixed(1)} m/s
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">TOUCHDOWN ANGLE</span>
              <span className="text-slate-200 font-bold">
                {Math.abs(previousAttempt.finalAngle).toFixed(1)}°
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">PROPELLANT CONSUMED</span>
              <span className="text-slate-200 font-bold">
                {previousAttempt.fuelUsed.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {/* Current Attempt Box */}
        <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Attempt #{currentAttempt.attemptNumber} ({currentAttempt.planetName})
            </span>
            {getOutcomeBadge(currentAttempt.outcome)}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">GRAVITY</span>
              <span className="text-cyan-300 font-bold">
                {currentAttempt.gravity.toFixed(2)} m/s²
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">DESCENT VELOCITY</span>
              <span
                className={
                  Math.abs(currentAttempt.finalVy) <= 3.0
                    ? "text-emerald-400 font-bold"
                    : "text-amber-400 font-bold"
                }
              >
                {Math.abs(currentAttempt.finalVy).toFixed(1)} m/s
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">TOUCHDOWN ANGLE</span>
              <span
                className={
                  Math.abs(currentAttempt.finalAngle) <= 10
                    ? "text-emerald-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {Math.abs(currentAttempt.finalAngle).toFixed(1)}°
              </span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-500 block">PROPELLANT CONSUMED</span>
              <span className="text-cyan-300 font-bold">
                {currentAttempt.fuelUsed.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Insight Explanation */}
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs text-slate-300 space-y-1.5">
        <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">
          PHYSICAL IMPACT OF VARIABLE MODIFICATIONS:
        </span>
        {getComparisonInsight().map((text, idx) => (
          <p key={idx} className="text-[11px] text-slate-300 leading-relaxed">
            • {text}
          </p>
        ))}
      </div>
    </div>
  );
};
