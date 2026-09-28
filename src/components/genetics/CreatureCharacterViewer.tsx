import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Star, Zap, Info } from "lucide-react";
import { OffspringCreature, ParentCreature } from "../../types/science";

interface CreatureCharacterViewerProps {
  creature: OffspringCreature | ParentCreature;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export const CreatureCharacterViewer: React.FC<CreatureCharacterViewerProps> = ({
  creature,
  size = "md",
  interactive = true,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [tailSway, setTailSway] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180);
      },
      3600 + Math.random() * 2000,
    );

    return () => clearInterval(blinkInterval);
  }, []);

  // Idle tail & wing sway
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setTailSway(Math.sin(frame * 0.1) * 8);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle click on character to interact
  const handlePetCreature = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 900);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHearts((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
    setTimeout(() => {
      setHearts((prev) => prev.slice(1));
    }, 1200);
  };

  // Helper to extract phenotype value
  const getPheno = (category: string, defaultVal: string) => {
    if ("phenotypes" in creature && creature.phenotypes[category]) {
      return creature.phenotypes[category]?.visualValue || defaultVal;
    }
    // For ParentCreature: look at traits
    if ("traits" in creature && (creature.traits as Record<string, string>)[category]) {
      return (creature.traits as Record<string, string>)[category] || defaultVal;
    }
    return defaultVal;
  };

  const getPhenoName = (category: string, defaultVal: string) => {
    if ("phenotypes" in creature && creature.phenotypes[category]) {
      return creature.phenotypes[category]?.name || defaultVal;
    }
    if ("traits" in creature && (creature.traits as Record<string, string>)[category]) {
      return (creature.traits as Record<string, string>)[category] || defaultVal;
    }
    return defaultVal;
  };

  const furColor = getPheno("furColor", "#8b5cf6");
  const eyeColor = getPheno("eyeColor", "#06b6d4");
  const wingType = getPhenoName("wingType", "dragon").toLowerCase();
  const hornType = getPhenoName("hornType", "curved").toLowerCase();
  const tailType = getPhenoName("tailType", "fluffy").toLowerCase();
  const patternType = getPhenoName("pattern", "spots").toLowerCase();
  const bodySizeTrait = getPhenoName("bodySize", "medium").toLowerCase();

  const scaleMultiplier =
    bodySizeTrait.includes("petite") || bodySizeTrait.includes("small")
      ? 0.9
      : bodySizeTrait.includes("large") || bodySizeTrait.includes("majestic")
        ? 1.12
        : 1.0;

  const dimension = size === "sm" ? 140 : size === "lg" ? 280 : 220;

  return (
    <div
      onClick={handlePetCreature}
      className={`group relative flex flex-col items-center justify-center select-none ${
        interactive ? "cursor-pointer" : ""
      }`}
      style={{ width: dimension, height: dimension + 30 }}
      title={interactive ? "Click to interact with creature!" : undefined}
    >
      {/* Floating Hearts / Stars on Pet */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute z-30 pointer-events-none animate-in fade-in zoom-in-50 duration-300"
          style={{
            left: h.x - 12,
            top: h.y - 28,
            animation: "floatUp 1s ease-out forwards",
          }}
        >
          <Heart className="h-6 w-6 text-rose-400 fill-rose-400 drop-shadow-md animate-bounce" />
        </div>
      ))}

      {/* Creature SVG Avatar Stage */}
      <div
        className={`relative transition-transform duration-300 ${
          isHappy ? "scale-110 -translate-y-2" : "hover:scale-105"
        }`}
        style={{ transform: `scale(${scaleMultiplier})` }}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Fur gradient */}
            <radialGradient id="creatureFur" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="30%" stopColor={furColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Wing Gradient */}
            <linearGradient id="creatureWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor={furColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
            </linearGradient>

            {/* Horn Gradient */}
            <linearGradient id="creatureHorn" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            {/* Eye Iris Gradient */}
            <radialGradient id="creatureEye" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor={eyeColor} />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
          </defs>

          {/* 1. WINGS (Behind Body) */}
          {!wingType.includes("none") && (
            <g
              className="transition-transform duration-700"
              style={{
                transform: `rotate(${Math.sin(tailSway * 0.2) * 4}deg)`,
                transformOrigin: "120px 120px",
              }}
            >
              {/* Left Wing */}
              <path
                d="M 90 120 C 50 80, 20 60, 10 90 C 0 120, 40 140, 85 135 Z"
                fill="url(#creatureWing)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.85"
              />
              {/* Wing bones / rib lines */}
              <path
                d="M 90 120 Q 50 90 20 70 M 90 120 Q 55 110 30 110"
                stroke="#bae6fd"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Right Wing */}
              <path
                d="M 150 120 C 190 80, 220 60, 230 90 C 240 120, 200 140, 155 135 Z"
                fill="url(#creatureWing)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <path
                d="M 150 120 Q 190 90 220 70 M 150 120 Q 185 110 210 110"
                stroke="#bae6fd"
                strokeWidth="1"
                opacity="0.6"
              />
            </g>
          )}

          {/* 2. TAIL */}
          <g
            style={{
              transform: `rotate(${tailSway}deg)`,
              transformOrigin: "155px 170px",
            }}
          >
            {tailType.includes("fluffy") ? (
              // Fox / Wolf Fluffy brush tail
              <path
                d="M 150 160 C 190 170, 220 150, 215 125 C 210 100, 180 120, 160 145 Z"
                fill="url(#creatureFur)"
                stroke={furColor}
                strokeWidth="2"
              />
            ) : tailType.includes("spike") || tailType.includes("lizard") ? (
              // Spiked Dragon Tail
              <g>
                <path
                  d="M 150 160 Q 200 170 215 140 L 195 145 L 205 130 L 180 142 Z"
                  fill="url(#creatureFur)"
                  stroke={furColor}
                  strokeWidth="2"
                />
              </g>
            ) : (
              // Tufted Lion / Sleek Tail
              <path
                d="M 150 165 Q 185 180 190 145 Q 195 125 210 130"
                fill="none"
                stroke={furColor}
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* 3. BODY */}
          <ellipse
            cx="120"
            cy="148"
            rx="46"
            ry="42"
            fill="url(#creatureFur)"
            stroke={furColor}
            strokeWidth="2"
          />

          {/* Body Belly Patch */}
          <ellipse cx="120" cy="154" rx="28" ry="25" fill="#ffffff" fillOpacity="0.25" />

          {/* 4. PATTERNS ON BODY */}
          {patternType.includes("spot") ? (
            <g fill="#ffffff" fillOpacity="0.4">
              <circle cx="100" cy="138" r="4.5" />
              <circle cx="138" cy="136" r="3.5" />
              <circle cx="108" cy="162" r="5" />
              <circle cx="132" cy="164" r="4" />
            </g>
          ) : patternType.includes("stripe") ? (
            <g stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 85 145 Q 100 148 105 144" />
              <path d="M 88 158 Q 102 160 108 155" />
              <path d="M 155 145 Q 140 148 135 144" />
              <path d="M 152 158 Q 138 160 132 155" />
            </g>
          ) : patternType.includes("star") || patternType.includes("constell") ? (
            <g fill="#fef08a" opacity="0.8">
              <circle cx="102" cy="140" r="2.5" />
              <circle cx="138" cy="138" r="2.5" />
              <circle cx="120" cy="165" r="2.5" />
              <path
                d="M 102 140 L 120 165 L 138 138"
                stroke="#fef08a"
                strokeWidth="0.8"
                opacity="0.4"
              />
            </g>
          ) : null}

          {/* 5. FEET / PAWS */}
          <ellipse
            cx="96"
            cy="186"
            rx="14"
            ry="9"
            fill="url(#creatureFur)"
            stroke={furColor}
            strokeWidth="1.5"
          />
          <ellipse
            cx="144"
            cy="186"
            rx="14"
            ry="9"
            fill="url(#creatureFur)"
            stroke={furColor}
            strokeWidth="1.5"
          />

          {/* 6. HEAD */}
          <circle
            cx="120"
            cy="92"
            r="38"
            fill="url(#creatureFur)"
            stroke={furColor}
            strokeWidth="2"
          />

          {/* EARS */}
          {/* Left Ear */}
          <polygon
            points="88,72 70,42 100,58"
            fill="url(#creatureFur)"
            stroke={furColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon points="86,68 76,48 94,60" fill="#f43f5e" fillOpacity="0.4" />

          {/* Right Ear */}
          <polygon
            points="152,72 170,42 140,58"
            fill="url(#creatureFur)"
            stroke={furColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon points="154,68 164,48 146,60" fill="#f43f5e" fillOpacity="0.4" />

          {/* 7. HORNS */}
          {!hornType.includes("none") && (
            <g>
              {hornType.includes("spiral") || hornType.includes("ram") ? (
                // Curved Spiral Horns
                <g stroke="url(#creatureHorn)" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 96 66 C 85 50, 75 45, 68 56 C 62 66, 75 75, 82 72" />
                  <path d="M 144 66 C 155 50, 165 45, 172 56 C 178 66, 165 75, 158 72" />
                </g>
              ) : hornType.includes("crystal") || hornType.includes("crown") ? (
                // Crystal Crown Horns
                <g fill="url(#creatureHorn)" stroke="#ca8a04" strokeWidth="1">
                  <polygon points="120,44 114,64 126,64" />
                  <polygon points="106,50 102,68 112,68" />
                  <polygon points="134,50 128,68 138,68" />
                </g>
              ) : (
                // Single Unicorn Celestial Horn
                <polygon
                  points="120,38 114,64 126,64"
                  fill="url(#creatureHorn)"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}

          {/* 8. CUTE EYES */}
          {isBlinking ? (
            // Blinking eye lines
            <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round">
              <path d="M 98 94 Q 106 99 114 94" />
              <path d="M 126 94 Q 134 99 142 94" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <circle cx="106" cy="92" r="10" fill="url(#creatureEye)" />
              <circle cx="104" cy="90" r="3.5" fill="#ffffff" />
              <circle cx="109" cy="94" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="134" cy="92" r="10" fill="url(#creatureEye)" />
              <circle cx="132" cy="90" r="3.5" fill="#ffffff" />
              <circle cx="137" cy="94" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Cheeks Blush */}
          <ellipse cx="94" cy="102" rx="6" ry="3.5" fill="#f43f5e" fillOpacity="0.45" />
          <ellipse cx="146" cy="102" rx="6" ry="3.5" fill="#f43f5e" fillOpacity="0.45" />

          {/* Cute Nose */}
          <polygon points="120,99 117,96 123,96" fill="#0f172a" />

          {/* Happy Mouth */}
          <path
            d={
              isHappy
                ? "M 114 103 Q 120 112 126 103 Z"
                : "M 115 102 Q 118 106 120 102 Q 122 106 125 102"
            }
            fill={isHappy ? "#f43f5e" : "none"}
            stroke="#0f172a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        {/* Ambient Glowing Aura Base */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-28 rounded-full blur-md opacity-70 pointer-events-none"
          style={{ backgroundColor: furColor }}
        />
      </div>

      {/* Creature Name & Expressed Trait Badge */}
      <div className="mt-2 text-center">
        <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
          <span>{creature.name}</span>
          {interactive && (
            <Sparkles className="h-3 w-3 text-purple-400 group-hover:rotate-12 transition-transform" />
          )}
        </div>
        {"rarityScore" in creature && (
          <span className="text-[10px] text-purple-400 font-semibold">{creature.rarityScore}</span>
        )}
      </div>
    </div>
  );
};
