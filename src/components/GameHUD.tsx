/**
 * World-Matched, Low-Occlusion Combat HUD for Black Myth: Destined One
 * Responsive mobile layout: player bars positioned to never overlap the virtual joystick,
 * tabular-nums readouts, 85% unobstructed playfield.
 */

import React from 'react';
import { BossStats, PlayerStats, SpellId, Stance } from '../types/game';
import { Volume2, VolumeX, Pause, Sparkles, Flame, Wind, Eye } from 'lucide-react';

interface GameHUDProps {
  playerStats: PlayerStats;
  bossStats: BossStats;
  spellCooldowns: Record<SpellId, { current: number; max: number; mana: number }>;
  perfectDodgeFlash: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onSelectStance: (s: Stance) => void;
  onCastSpell: (s: SpellId) => void;
  onDrinkGourd: () => void;
  onAttack: () => void;
  onHeavy: () => void;
  onDodge: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  playerStats,
  bossStats,
  spellCooldowns,
  perfectDodgeFlash,
  isMuted,
  onToggleMute,
  onPause,
  onSelectStance,
  onCastSpell,
  onDrinkGourd,
}) => {
  const bossHpPercent = Math.max(0, Math.min(100, (bossStats.hp / bossStats.maxHp) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (playerStats.hp / playerStats.maxHp) * 100));
  const staminaPercent = Math.max(0, Math.min(100, (playerStats.stamina / playerStats.maxStamina) * 100));
  const manaPercent = Math.max(0, Math.min(100, (playerStats.mana / playerStats.maxMana) * 100));

  const focusPoints = Math.floor(playerStats.focus / 100);
  const currentBarProgress = playerStats.focus % 100;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 md:p-8 select-none">
      {/* 1. TOP CLUSTER: Boss Health Bar & Stage Seal */}
      <div className="w-full flex flex-col items-center max-w-xl md:max-w-2xl mx-auto pt-1">
        <div className="flex items-center justify-between w-full px-2 mb-1">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-myth font-bold truncate max-w-[180px] sm:max-w-none">
              {bossStats.title}
            </span>
            {bossStats.isEnraged && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-950/80 border border-red-600 text-red-400 font-bold tracking-widest uppercase">
                ENRAGED
              </span>
            )}
            {bossStats.isImmobilized && (
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-950/80 border border-amber-500 text-amber-300 font-bold tracking-widest uppercase">
                FREEZE
              </span>
            )}
          </div>
          <div className="text-xs md:text-sm font-bold tracking-wider text-neutral-200 font-myth shrink-0">
            {bossStats.name.toUpperCase()}
          </div>
        </div>

        {/* Main Boss Health Gauge */}
        <div className="w-full h-2.5 md:h-3 bg-neutral-950/90 border border-neutral-800 rounded-sm overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          <div
            className={`h-full transition-all duration-150 ${
              bossStats.isEnraged
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600'
                : 'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-600'
            }`}
            style={{ width: `${bossHpPercent}%` }}
          />
          <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
            <div className="w-0.5 h-full bg-black/40" />
            <div className="w-0.5 h-full bg-black/40" />
            <div className="w-0.5 h-full bg-black/40" />
          </div>
        </div>

        {/* Boss Posture Gauge */}
        <div className="w-1/2 h-1 bg-neutral-900 border-x border-b border-neutral-800 rounded-b mt-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neutral-500 via-amber-300 to-amber-500 transition-all duration-100"
            style={{ width: `${bossStats.posture}%` }}
          />
        </div>

        <div className="text-[9px] text-neutral-500 tracking-widest uppercase font-mono tabular-nums mt-0.5">
          {Math.round(bossStats.hp)} / {bossStats.maxHp} HP
        </div>

        {/* Mobile Top-Bar Mini Player Status (Visible only on mobile to avoid joystick overlap) */}
        <div className="w-full flex md:hidden items-center justify-between gap-2 mt-1.5 px-1 pointer-events-auto">
          {/* Health mini bar */}
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="flex justify-between text-[9px] font-mono tabular-nums text-neutral-300">
              <span className="text-amber-500 font-bold uppercase font-myth">HP</span>
              <span>{Math.round(playerStats.hp)}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-rose-500"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>
          {/* Stamina mini bar */}
          <div className="w-20 flex flex-col gap-0.5">
            <div className="flex justify-between text-[9px] font-mono tabular-nums text-neutral-400">
              <span className="text-emerald-500 font-bold font-myth">STA</span>
              <span>{Math.round(playerStats.stamina)}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400"
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
          </div>
          {/* Qi mini bar */}
          <div className="w-16 flex flex-col gap-0.5">
            <div className="flex justify-between text-[9px] font-mono tabular-nums text-neutral-400">
              <span className="text-sky-400 font-bold font-myth">QI</span>
              <span>{Math.round(playerStats.mana)}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-400"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top-Right Audio & Pause Buttons */}
      <div className="absolute top-3 right-3 md:top-8 md:right-8 flex items-center gap-1.5 md:gap-2 pointer-events-auto">
        <button
          onClick={onToggleMute}
          className="w-7 h-7 md:w-8 md:h-8 rounded border border-neutral-800 bg-neutral-950/80 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-600 transition-colors cursor-pointer"
          title="Toggle Mute"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />}
        </button>
        <button
          onClick={onPause}
          className="w-7 h-7 md:w-8 md:h-8 rounded border border-neutral-800 bg-neutral-950/80 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-600 transition-colors cursor-pointer"
          title="Pause Game (ESC)"
        >
          <Pause className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Center Screen: Perfect Dodge Flash Banner */}
      {perfectDodgeFlash && (
        <div className="mx-auto my-auto text-center animate-bounce">
          <div className="inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-amber-400 bg-black/85 shadow-[0_0_20px_rgba(217,163,62,0.8)]">
            <span className="text-amber-300 font-bold text-xs md:text-sm tracking-[0.25em] uppercase font-myth">
              AFTERIMAGE EVASION (+1 FOCUS)
            </span>
          </div>
        </div>
      )}

      {/* 2. BOTTOM CLUSTERS */}
      <div className="w-full flex items-end justify-between">
        {/* Desktop Bottom-Left Cluster (Hidden on mobile to preserve clear joystick space) */}
        <div className="hidden md:flex flex-col gap-2 max-w-xs w-full pointer-events-auto">
          {/* Health Bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-neutral-300">
              <span className="text-amber-500 font-bold uppercase tracking-wider font-myth">Health</span>
              <span>{Math.round(playerStats.hp)} / {playerStats.maxHp}</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950/90 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 via-rose-600 to-red-500 transition-all duration-100"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center text-[10px] font-mono tabular-nums text-neutral-400">
              <span className="text-emerald-500 font-medium uppercase tracking-wider font-myth">Stamina</span>
              <span>{Math.round(playerStats.stamina)} / {playerStats.maxStamina}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950/90 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-75"
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
          </div>

          {/* Mana / Qi Bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center text-[10px] font-mono tabular-nums text-neutral-400">
              <span className="text-sky-400 font-medium uppercase tracking-wider font-myth">Qi / Mana</span>
              <span>{Math.round(playerStats.mana)} / {playerStats.maxMana}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-950/90 border border-neutral-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-100"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
          </div>

          {/* Healing Gourd Sips Cluster */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onDrinkGourd}
              className="group flex items-center gap-2 px-3 py-1.5 rounded border border-amber-700/50 bg-black/80 hover:border-amber-500 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Drink Gourd [Q] (Restore 45 HP)"
            >
              <svg className="w-5 h-6 fill-amber-500" viewBox="0 0 24 32">
                <path d="M 12 2 C 10 2 9 4 9 6 C 9 8 10 10 8 12 C 5 15 5 22 8 26 C 10 29 14 29 16 26 C 19 22 19 15 16 12 C 14 10 15 8 15 6 C 15 4 14 2 12 2 Z" />
              </svg>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-amber-400 uppercase font-myth tracking-wider font-bold">
                  Gourd [Q]
                </span>
                <div className="flex gap-1 mt-0.5">
                  {Array.from({ length: playerStats.maxGourdSips }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full border border-emerald-400/60 ${
                        i < playerStats.gourdSips ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-neutral-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </button>

            {playerStats.isTransformed && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/90 border border-red-500 text-red-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>RED TIDES ({Math.ceil(playerStats.transformDuration)}s)</span>
              </div>
            )}
            {playerStats.isCloudStepping && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-950/90 border border-sky-400 text-sky-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>CLOUD STEP ({Math.ceil(playerStats.cloudStepDuration)}s)</span>
              </div>
            )}
          </div>
        </div>

        {/* Stances & Focus Point Ring: Elevated above joystick on mobile, centered at bottom on desktop */}
        <div className="absolute bottom-[182px] left-3 md:static md:bottom-auto md:left-auto flex flex-col items-start md:items-center gap-1 md:gap-2 pointer-events-auto z-20">
          {/* Stance Selector Pills */}
          <div className="flex items-center gap-1 p-0.5 md:p-1 rounded-full border border-neutral-800 bg-black/85">
            {(['smash', 'pillar', 'thrust'] as Stance[]).map((s) => {
              const isActive = playerStats.activeStance === s;
              const nameMap: Record<Stance, string> = {
                smash: 'SMASH',
                pillar: 'PILLAR',
                thrust: 'THRUST',
              };
              return (
                <button
                  key={s}
                  onClick={() => onSelectStance(s)}
                  className={`px-2 md:px-3.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-myth tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white font-bold shadow-[0_0_12px_rgba(217,163,62,0.6)]'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {nameMap[s]}
                </button>
              );
            })}
          </div>

          {/* 4 Focus Point Orbs */}
          <div className="flex items-center gap-1 md:gap-2.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-neutral-800/80 bg-black/70">
            <span className="text-[8px] md:text-[10px] tracking-widest uppercase text-amber-500/80 font-myth font-bold">
              Focus
            </span>
            <div className="flex items-center gap-1.5 md:gap-2">
              {[0, 1, 2, 3].map((idx) => {
                const isFull = focusPoints > idx;
                const isCharging = focusPoints === idx;
                const chargeProgress = isCharging ? currentBarProgress : 0;
                return (
                  <div
                    key={idx}
                    className="relative w-3.5 h-3.5 md:w-6 md:h-6 rounded-full border border-amber-600/40 bg-neutral-950 flex items-center justify-center overflow-hidden"
                  >
                    {isFull && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                    )}
                    {isCharging && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-amber-500/70 transition-all"
                        style={{ height: `${chargeProgress}%` }}
                      />
                    )}
                    <span className="relative z-10 text-[7px] md:text-[10px] font-bold font-mono text-neutral-100">
                      {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Spells Cluster: Elevated above action buttons on mobile, at bottom-right on desktop */}
        <div className="absolute bottom-[182px] right-2 md:static md:bottom-auto md:right-auto flex items-center gap-1 md:gap-2 pointer-events-auto z-20">
          <SpellButton
            id="immobilize"
            shortcut="1"
            name="Immobilize"
            shortLabel="FREEZE"
            icon={<Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />}
            cd={spellCooldowns.immobilize}
            onCast={() => onCastSpell('immobilize')}
          />
          <SpellButton
            id="cloudStep"
            shortcut="2"
            name="Cloud Step"
            shortLabel="MIST"
            icon={<Wind className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400" />}
            cd={spellCooldowns.cloudStep}
            onCast={() => onCastSpell('cloudStep')}
          />
          <SpellButton
            id="pluckOfMany"
            shortcut="3"
            name="Pluck of Many"
            shortLabel="CLONES"
            icon={<Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />}
            cd={spellCooldowns.pluckOfMany}
            onCast={() => onCastSpell('pluckOfMany')}
          />
          <SpellButton
            id="redTides"
            shortcut="4"
            name="Red Tides"
            shortLabel="FIRE"
            icon={<Flame className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />}
            cd={spellCooldowns.redTides}
            onCast={() => onCastSpell('redTides')}
          />
        </div>
      </div>
    </div>
  );
};

interface SpellButtonProps {
  id: SpellId;
  shortcut: string;
  name: string;
  shortLabel: string;
  icon: React.ReactNode;
  cd: { current: number; max: number; mana: number };
  onCast: () => void;
}

const SpellButton: React.FC<SpellButtonProps> = ({ shortcut, name, shortLabel, icon, cd, onCast }) => {
  const isOnCooldown = cd.current > 0;
  const cdPercent = isOnCooldown ? (cd.current / cd.max) * 100 : 0;

  return (
    <button
      onClick={onCast}
      disabled={isOnCooldown}
      className={`group relative w-10 h-10 md:w-14 md:h-14 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
        isOnCooldown
          ? 'border-neutral-800 bg-neutral-950/80 cursor-not-allowed'
          : 'border-amber-600/50 bg-black/80 hover:border-amber-400 hover:shadow-[0_0_12px_rgba(217,163,62,0.4)] active:scale-95'
      }`}
      title={`${name} - Mana Cost: ${cd.mana} [Key ${shortcut}]`}
    >
      <div className="relative z-10">{icon}</div>
      <span className="relative z-10 text-[8px] md:text-[9px] font-myth text-neutral-300 font-bold tracking-wider">
        {shortLabel}
      </span>

      <div className="absolute top-0.5 right-1 text-[8px] md:text-[9px] font-mono text-neutral-400 group-hover:text-amber-300">
        {shortcut}
      </div>

      {isOnCooldown && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
          style={{ height: `${cdPercent}%`, top: `${100 - cdPercent}%` }}
        >
          <span className="text-[10px] md:text-xs font-mono font-bold text-amber-300">
            {Math.ceil(cd.current)}
          </span>
        </div>
      )}
    </button>
  );
};
