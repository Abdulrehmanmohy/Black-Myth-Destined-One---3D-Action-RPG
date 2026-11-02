/**
 * Game Over Modal for Black Myth: Destined One
 * 100% Pure English localization with shrine respawn and mythic lore verse.
 */

import React from 'react';
import { BossId } from '../types/game';
import { BOSS_CONFIGS } from '../game/threeScene';
import { RotateCcw, Home, Skull, BookOpen } from 'lucide-react';

interface GameOverModalProps {
  bossId: BossId;
  onRespawn: () => void;
  onReturnToTitle: () => void;
  onOpenCodex: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  bossId,
  onRespawn,
  onReturnToTitle,
  onOpenCodex,
}) => {
  const boss = BOSS_CONFIGS[bossId];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 p-4 pointer-events-auto">
      <div className="w-full max-w-lg rounded-xl border border-red-900/60 bg-myth-card p-6 md:p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)] flex flex-col gap-6 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Skull Seal */}
        <div className="mx-auto w-16 h-16 rounded-full border-2 border-red-800 bg-red-950/40 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          <Skull className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-[0.3em] text-red-500 font-myth font-bold">
            Reincarnation Severed · Fallen in Tribulation
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-myth tracking-widest text-neutral-100 text-flame-glow">
            REINCARNATION BROKEN
          </h2>
          <div className="text-xs text-neutral-400 font-serif">
            Slain by: <span className="text-red-400 font-myth font-bold">{boss.name}</span> ({boss.title})
          </div>
        </div>

        {/* Mythic lore encouragement in Pure English */}
        <div className="border-y border-neutral-800 py-3 text-xs text-neutral-300 font-serif italic leading-relaxed">
          "Say not the road ahead is fraught with thorns; the indomitable will of the Great Sage endures in bone. Kindle the three incense sticks anew, don your armor, and wage war against the heavens once more!"
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRespawn}
            className="w-full py-3.5 rounded-lg border border-red-600 bg-gradient-to-r from-red-800 via-rose-700 to-red-800 text-white font-myth font-bold tracking-widest uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESPAWN AT SHRINE</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenCodex}
              className="py-2.5 rounded-lg border border-neutral-700 bg-neutral-900/80 text-neutral-300 text-xs font-myth tracking-wider uppercase hover:border-amber-600 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Review Codex</span>
            </button>

            <button
              onClick={onReturnToTitle}
              className="py-2.5 rounded-lg border border-neutral-700 bg-neutral-900/80 text-neutral-300 text-xs font-myth tracking-wider uppercase hover:border-red-600 hover:text-red-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Title</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
