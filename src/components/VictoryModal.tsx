/**
 * Victory Modal for Black Myth: Destined One
 * 100% Pure English localization with Six Roots Relic acquisition & mythological verse
 */

import React from 'react';
import { BossId } from '../types/game';
import { BOSS_CONFIGS } from '../game/threeScene';
import { Sparkles, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';

interface VictoryModalProps {
  bossId: BossId;
  onNextBoss: () => void;
  onRematch: () => void;
  onOpenCodex: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  bossId,
  onNextBoss,
  onRematch,
  onOpenCodex,
}) => {
  const boss = BOSS_CONFIGS[bossId];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 p-4 pointer-events-auto">
      <div className="w-full max-w-lg rounded-xl border border-amber-500 bg-myth-card p-6 md:p-8 shadow-[0_0_50px_rgba(217,163,62,0.4)] flex flex-col gap-6 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Golden Lotus Seal */}
        <div className="mx-auto w-16 h-16 rounded-full border-2 border-amber-400 bg-amber-950/60 flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.6)]">
          <Sparkles className="w-8 h-8 text-amber-300" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-500 font-myth font-bold">
            Destiny Fulfilled · Tribulation Shattered
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-myth tracking-widest text-neutral-100 text-gold-glow">
            DESTINY FULFILLED
          </h2>
          <div className="text-xs text-neutral-400 font-serif">
            Adversary Defeated: <span className="text-amber-400 font-myth font-bold">{boss.name}</span> ({boss.title})
          </div>
        </div>

        {/* Six Roots Relic Award Card */}
        <div className="rounded-lg border border-amber-700/60 bg-amber-950/30 p-4 text-left flex items-start gap-3">
          <div className="w-10 h-10 rounded border border-amber-500 bg-black/60 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-myth font-bold text-xs">RELIC</span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-amber-400 uppercase tracking-wider font-myth font-bold">
              Six Roots Relic Absorbed
            </div>
            <div className="text-sm font-bold text-neutral-100 font-myth">
              {boss.relicName} · {boss.relicReward}
            </div>
            <p className="text-[11px] text-neutral-400 font-serif italic">
              "Gathering the fragmented will of the Great Sage, one step closer to shattering heaven's decree."
            </p>
          </div>
        </div>

        {/* Mythological Verse in Pure English */}
        <div className="border-y border-neutral-800 py-3 text-xs text-neutral-300 font-serif italic leading-relaxed">
          "Though you wear out iron shoes searching the Three Realms, truth was hidden beneath the masks of gods. Beneath the whistling staff strikes, no corruption shall endure!"
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onNextBoss}
            className="w-full py-3.5 rounded-lg border border-amber-500 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white font-myth font-bold tracking-widest uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(217,163,62,0.5)] active:scale-95"
          >
            <span>NEXT TRIBULATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRematch}
              className="py-2.5 rounded-lg border border-neutral-700 bg-neutral-900/80 text-neutral-300 text-xs font-myth tracking-wider uppercase hover:border-amber-600 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rematch Duel</span>
            </button>

            <button
              onClick={onOpenCodex}
              className="py-2.5 rounded-lg border border-neutral-700 bg-neutral-900/80 text-neutral-300 text-xs font-myth tracking-wider uppercase hover:border-amber-600 hover:text-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Shadow God Index</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
