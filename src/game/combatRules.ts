/**
 * Pure combat calculations and rules for Black Myth: Destined One
 */

import { Stance } from '../types/game';

export function calculateComboDamage(
  step: number,
  isCloudStepping: boolean,
  isTransformed: boolean
): { damage: number; isCrit: boolean } {
  let base = 15 + step * 6;
  let isCrit = false;

  if (isCloudStepping) {
    base *= 2.5;
    isCrit = true;
  }

  if (isTransformed) {
    base *= 1.4;
  }

  return { damage: Math.round(base), isCrit };
}

export function calculateHeavyDamage(
  focusPoints: number,
  stance: Stance
): number {
  const stanceMultiplier = stance === 'thrust' ? 1.25 : stance === 'smash' ? 1.15 : 1.0;
  const multiplier = 1 + focusPoints * 0.75;
  const baseDmg = 55 + focusPoints * 35;
  return Math.round(baseDmg * multiplier * stanceMultiplier);
}

export function calculateStaggerBreak(
  currentPosture: number,
  addedPosture: number
): { newPosture: number; isBroken: boolean } {
  const sum = currentPosture + addedPosture;
  if (sum >= 100) {
    return { newPosture: 0, isBroken: true };
  }
  return { newPosture: sum, isBroken: false };
}
