/**
 * Responsive Mobile Touch Controls for Black Myth: Destined One
 * Features a dynamic virtual joystick for 360-degree movement,
 * and ergonomic touch buttons for Light Strike, Heavy Smash, Dodge, and Gourd.
 */

import React, { useRef, useState, useEffect } from 'react';

interface TouchControlsProps {
  onMove: (x: number, y: number) => void;
  onAttack: () => void;
  onHeavy: () => void;
  onDodge: () => void;
  onDrinkGourd: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onAttack,
  onHeavy,
  onDodge,
  onDrinkGourd,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMove(0, 0);
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(dy, dx);

    const targetX = Math.cos(angle) * clampedDist;
    const targetY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: targetX, y: targetY });

    // Normalized vector (-1 to 1) for 3D world movement
    const normX = targetX / maxRadius;
    const normZ = targetY / maxRadius;
    onMove(normX, normZ);
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none md:hidden flex justify-between items-end p-3 pb-3 select-none">
      {/* Left side: Virtual Joystick */}
      <div className="pointer-events-auto flex flex-col items-center ml-1 mb-1">
        <div
          ref={joystickRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={`relative w-26 h-26 rounded-full border-2 flex items-center justify-center transition-colors shadow-lg ${
            isActive
              ? 'border-amber-400 bg-black/70 shadow-[0_0_20px_rgba(217,163,62,0.4)]'
              : 'border-amber-700/50 bg-black/50'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Outer compass lines */}
          <div className="absolute inset-2 rounded-full border border-neutral-700/50 pointer-events-none" />

          {/* Central Thumb Knob */}
          <div
            className={`w-11 h-11 rounded-full border-2 border-amber-400 flex items-center justify-center shadow-md transition-transform pointer-events-none ${
              isActive
                ? 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_0_15px_rgba(234,179,8,0.7)]'
                : 'bg-neutral-900/90 border-amber-600/70'
            }`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-200/80" />
          </div>
        </div>
        <span className="text-[9px] text-neutral-400 tracking-widest uppercase font-mono mt-1 pointer-events-none">
          MOVE
        </span>
      </div>

      {/* Right side: Action Buttons Cluster */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto mr-1 mb-1">
        <div className="flex items-center gap-2">
          {/* Gourd Sip */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDrinkGourd();
            }}
            className="w-11 h-11 rounded-full border border-amber-600 bg-black/85 flex flex-col items-center justify-center text-amber-400 font-bold text-[10px] shadow-lg active:scale-90"
          >
            <span>Q</span>
            <span className="text-[7px] text-emerald-400">SIP</span>
          </button>

          {/* Dodge */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onDodge();
            }}
            className="w-13 h-13 rounded-full border border-sky-400 bg-sky-950/85 flex items-center justify-center text-sky-200 font-myth font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.4)] active:scale-90"
          >
            DODGE
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Heavy Attack */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onHeavy();
            }}
            className="w-14 h-14 rounded-full border-2 border-amber-500 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-myth font-black text-xs shadow-[0_0_20px_rgba(217,163,62,0.6)] active:scale-90"
          >
            SMASH
          </button>

          {/* Light Attack Combo */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onAttack();
            }}
            className="w-18 h-18 rounded-full border-2 border-amber-400 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center text-black font-myth font-black text-xs shadow-[0_0_25px_rgba(217,163,62,0.8)] active:scale-90"
          >
            STRIKE
          </button>
        </div>
      </div>
    </div>
  );
};
