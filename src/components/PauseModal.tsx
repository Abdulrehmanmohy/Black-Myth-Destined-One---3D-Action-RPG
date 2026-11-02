/**
 * Pause Modal for Black Myth: Destined One
 * 100% Pure English localization with martial controls and navigation.
 */

import React from 'react';
import { Volume2, VolumeX, Play, RotateCcw, BookOpen, Home } from 'lucide-react';
import { BossId } from '../types/game';
import { BOSS_CONFIGS } from '../game/threeScene';

interface PauseModalProps {
  currentBossId: BossId;
  onResume: () => void;
  onRestart: () => void;
  onReturnToTitle: () => void;
  onOpenCodex: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  currentBossId,
  onResume,
  onRestart,
  onReturnToTitle,
  onOpenCodex,
  isMuted,
  onToggleMute,
}) => {
  const boss = BOSS_CONFIGS[currentBossId];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-none p-4 pointer-events-auto">
      <div className="w-full max-w-lg rounded-xl border border-amber-600/50 bg-myth-card p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col gap-6 text-center">
        {/* Header */}
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-500 font-myth font-bold">
            Meditation at the Shrine
          </div>
          <h2 className="text-2xl font-bold font-myth tracking-widest text-neutral-100">
            TRIAL PAUSED
          </h2>
          <div className="text-xs text-neutral-400 font-serif">
            Current Adversary: <span className="text-amber-400 font-myth font-bold">{boss.name}</span> ({boss.title}) · {boss.realmName}
          </div>
        </div>

        {/* Controls Cheatsheet */}
        <div className="rounded-lg border border-neutral-800 bg-black/60 p-4 text-left space-y-2 text-xs">
          <div className="text-[11px] uppercase tracking-wider text-amber-500/80 font-myth font-bold mb-2">
            Martial Mastery & Controls:
          </div>
          <div className="grid grid-cols-2 gap-2 text-neutral-300">
            <div><span className="text-amber-400 font-mono font-bold">W A S D</span> — Move & Dash</div>
            <div><span className="text-amber-400 font-mono font-bold">J / LMB</span> — 4-Hit Light Combo</div>
            <div><span className="text-amber-400 font-mono font-bold">K / RMB</span> — Heavy Staff Smash</div>
            <div><span className="text-amber-400 font-mono font-bold">SPACE</span> — Dodge & Afterimage</div>
            <div><span className="text-amber-400 font-mono font-bold">Q</span> — Drink Gourd (+45 HP)</div>
            <div><span className="text-amber-400 font-mono font-bold">C</span> — Cycle Staff Stances</div>
            <div><span className="text-amber-400 font-mono font-bold">1</span> — Immobilize (Freeze Foe)</div>
            <div><span className="text-amber-400 font-mono font-bold">2</span> — Cloud Step (Mist Flank)</div>
            <div><span className="text-amber-400 font-mono font-bold">3</span> — Pluck of Many (Clones)</div>
            <div><span className="text-amber-400 font-mono font-bold">4</span> — Red Tides (Fire Form)</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 rounded-lg border border-amber-500 bg-amber-700/80 text-white font-myth font-bold tracking-widest uppercase hover:bg-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(217,163,62,0.4)]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RESUME TRIAL</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRestart}
              className="py-2.5 rounded-lg border border-neutral-700 bg-neutral-900/80 text-neutral-200 text-xs font-myth tracking-wider uppercase hover:border-amber-600 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Duel</span>
            </button>

            <button
              onClick={onOpenCodex}
              className="py-2.5 rounded-lg border border-neutral-700 bg-neutral-900/80 text-neutral-200 text-xs font-myth tracking-wider uppercase hover:border-amber-600 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Shadow God Index</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <button
              onClick={onToggleMute}
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
            </button>

            <button
              onClick={onReturnToTitle}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Title Screen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
