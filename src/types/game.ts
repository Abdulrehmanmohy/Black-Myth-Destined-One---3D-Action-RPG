/**
 * Game Types and Configurations for Black Myth: Destined One
 * Pure English localization
 */

export type GameState = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';

export type Stance = 'smash' | 'pillar' | 'thrust';

export type SpellId = 'immobilize' | 'cloudStep' | 'pluckOfMany' | 'redTides';

export interface SpellState {
  id: SpellId;
  name: string;
  shortLabel: string;
  key: string;
  cooldown: number; // in seconds
  currentCooldown: number;
  manaCost: number;
  icon: string;
  description: string;
}

export type BossId = 'guangzhi' | 'tigerVanguard' | 'yellowWind' | 'whiteNoble';

export interface BossConfig {
  id: BossId;
  name: string;
  title: string;
  domain: string;
  maxHp: number;
  attackPower: number;
  phase2Threshold: number;
  color: string;
  accentColor: string;
  realmName: string;
  description: string;
  quote: string;
  relicReward: string;
  relicName: string;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  focus: number; // 0 to 400 (4 bars, 100 each)
  maxFocus: number;
  gourdSips: number;
  maxGourdSips: number;
  activeStance: Stance;
  isTransformed: boolean;
  transformDuration: number;
  isCloudStepping: boolean;
  cloudStepDuration: number;
}

export interface BossStats {
  id: BossId;
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  posture: number; // 0 to 100
  isStaggered: boolean;
  isImmobilized: boolean;
  immobilizeTimer: number;
  isEnraged: boolean;
}

export interface RootRelic {
  id: string;
  name: string;
  organ: string;
  obtained: boolean;
  description: string;
  statBonus: string;
}

export interface CodexEntry {
  id: string;
  name: string;
  title: string;
  category: 'protagonist' | 'boss' | 'deity' | 'relic';
  realm: string;
  poem: string;
  lore: string;
  unlocked: boolean;
}
