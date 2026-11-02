/**
 * Full-viewport Title Screen for Black Myth: Destined One
 * 100% Pure English typography, responsive mobile layout, trial selection, and dark myth lore.
 */

import React from 'react';
import { BossId } from '../types/game';
import { BOSS_CONFIGS } from '../game/threeScene';
import { Volume2, VolumeX, BookOpen, Shield, Flame } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: (bossId: BossId) => void;
  onOpenCodex: () => void;
  selectedBoss: BossId;
  onSelectBoss: (id: BossId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenCodex,
  selectedBoss,
  onSelectBoss,
  isMuted,
  onToggleMute,
}) => {
  const currentBoss = BOSS_CONFIGS[selectedBoss];

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 md:p-12 pointer-events-auto bg-gradient-to-b from-black/85 via-black/40 to-black/90 overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-amber-600/50 flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(217,163,62,0.3)]">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] md:text-xs tracking-[0.2em] text-amber-500/80 uppercase font-myth block">
              Dark Eastern Myth · RPG
            </span>
            <div className="text-xs md:text-sm font-semibold tracking-wider text-neutral-300 font-myth hidden sm:block">
              Awaken Destiny · Shatter The Heavens
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCodex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-700/40 bg-black/60 text-amber-200/90 text-[11px] tracking-wider uppercase font-myth hover:border-amber-500 hover:text-amber-100 transition-colors shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Shadow God</span> Index
          </button>

          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded border border-neutral-700/60 bg-black/60 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-600/50 transition-colors cursor-pointer"
            title="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Center Hero Lockup & SVG Title */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-4xl mx-auto space-y-3 md:space-y-6 py-2">
        <div className="relative w-full">
          {/* Ornate Gold Banner SVG Lockup */}
          <svg className="w-full max-w-md md:max-w-2xl h-14 md:h-20 mx-auto filter drop-shadow-[0_0_25px_rgba(217,163,62,0.5)]" viewBox="0 0 680 90" fill="none">
            <path
              d="M 20 45 C 50 20, 80 70, 110 45 C 130 30, 150 30, 170 45"
              stroke="rgba(217, 163, 62, 0.4)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 510 45 C 530 30, 550 30, 570 45 C 600 70, 630 20, 660 45"
              stroke="rgba(217, 163, 62, 0.4)"
              strokeWidth="1.5"
              fill="none"
            />
            <text
              x="340"
              y="48"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-myth font-black tracking-[0.22em] text-xl md:text-3xl"
              fill="url(#goldGradient)"
              stroke="rgba(0,0,0,0.8)"
              strokeWidth="1"
            >
              BLACK MYTH : WUKONG
            </text>
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffea9f" />
                <stop offset="50%" stopColor="#d49b35" />
                <stop offset="100%" stopColor="#875815" />
              </linearGradient>
            </defs>
          </svg>

          <h1 className="text-lg md:text-3xl font-extrabold tracking-[0.3em] uppercase text-neutral-100 font-myth mt-0.5 text-gold-glow">
            THE DESTINED ONE
          </h1>
          <p className="text-[11px] md:text-sm text-neutral-300 tracking-wide max-w-xl mx-auto mt-2 leading-relaxed font-serif px-2">
            Five centuries ago, the Havoc in Heaven was but a destined gambit orchestrated by Mount Ling and the Celestial Court; five centuries later, the Golden Fillet is reborn, setting you on an inevitable path against heaven to seek the truth and reclaim the name of Wukong that was erased from existence.
          </p>
        </div>

        {/* Boss Selection Carousel Cards */}
        <div className="w-full pt-1">
          <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2 font-myth flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-amber-500" />
            <span>Select Tribulation Trial</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-3xl mx-auto">
            {(Object.keys(BOSS_CONFIGS) as BossId[]).map((id) => {
              const b = BOSS_CONFIGS[id];
              const isSelected = b.id === selectedBoss;
              return (
                <button
                  key={id}
                  onClick={() => onSelectBoss(id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/40 shadow-[0_0_15px_rgba(217,163,62,0.3)]'
                      : 'border-neutral-800 bg-black/60 hover:border-neutral-700 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="text-[9px] text-amber-400/80 font-myth tracking-widest uppercase">
                    Trial {id === 'guangzhi' ? 'I' : id === 'tigerVanguard' ? 'II' : id === 'yellowWind' ? 'III' : 'IV'}
                  </div>
                  <div className="text-xs md:text-sm font-bold text-neutral-100 font-myth truncate">
                    {b.name}
                  </div>
                  <div className="text-[9px] text-neutral-400 truncate mt-0.5">
                    {b.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Boss Preview Brief */}
        <div className="p-2 md:p-2.5 px-4 rounded-md border border-neutral-800 bg-black/70 max-w-xl text-center">
          <div className="text-[11px] md:text-xs text-amber-400/90 font-medium font-myth">
            {currentBoss.realmName} · {currentBoss.title}
          </div>
          <p className="text-[10px] md:text-xs text-neutral-400 italic mt-0.5 font-serif truncate">
            "{currentBoss.quote}"
          </p>
        </div>

        {/* Main Start CTA Button */}
        <div className="pt-1 flex flex-col items-center w-full">
          <button
            onClick={() => onStartGame(selectedBoss)}
            className="group relative w-full sm:w-auto px-6 md:px-10 py-3 rounded border border-amber-500 bg-gradient-to-r from-amber-700/80 via-amber-600/90 to-amber-700/80 text-white font-myth font-bold tracking-[0.2em] text-xs md:text-sm uppercase shadow-[0_0_25px_rgba(217,163,62,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              <span>AWAKEN DESTINY</span>
              <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/40 hidden sm:inline">
                SPACE / ENTER
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>

      {/* Flat Control Hint Line */}
      <div className="text-center w-full shrink-0 pt-2">
        <div className="inline-block px-3 py-1 rounded-full border border-neutral-800/80 bg-black/60 text-[10px] text-neutral-400 tracking-wider font-mono">
          <span className="hidden sm:inline">
            <span className="text-neutral-300">WASD</span> Move ·{' '}
            <span className="text-amber-400">J / LMB</span> Light Attack ·{' '}
            <span className="text-amber-400">K / RMB</span> Heavy Smash ·{' '}
          </span>
          <span className="text-amber-400">SPACE</span> Dodge ·{' '}
          <span className="text-amber-400">Q</span> Gourd ·{' '}
          <span className="text-neutral-300">ESC</span> Pause
        </div>
      </div>
    </div>
  );
};
