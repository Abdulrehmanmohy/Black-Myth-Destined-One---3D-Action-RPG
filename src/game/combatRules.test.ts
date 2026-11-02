/**
 * Unit tests for combat rules and calculations
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateComboDamage, calculateHeavyDamage, calculateStaggerBreak } from './combatRules';

test('calculateComboDamage computes progressive combo damage', () => {
  const hit1 = calculateComboDamage(0, false, false);
  const hit2 = calculateComboDamage(1, false, false);
  const hit3 = calculateComboDamage(2, false, false);
  const hit4 = calculateComboDamage(3, false, false);

  assert.equal(hit1.damage, 15);
  assert.equal(hit2.damage, 21);
  assert.equal(hit3.damage, 27);
  assert.equal(hit4.damage, 33);
  assert.equal(hit1.isCrit, false);
});

test('calculateComboDamage handles Cloud Step critical sneak damage multiplier', () => {
  const sneakHit = calculateComboDamage(0, true, false);
  assert.equal(sneakHit.isCrit, true);
  assert.equal(sneakHit.damage, Math.round(15 * 2.5));
});

test('calculateComboDamage handles Red Tides fire transformation multiplier', () => {
  const fireHit = calculateComboDamage(2, false, true);
  assert.equal(fireHit.damage, Math.round(27 * 1.4));
});

test('calculateHeavyDamage scales with Focus points and stances', () => {
  const zeroFocusSmash = calculateHeavyDamage(0, 'smash');
  const threeFocusSmash = calculateHeavyDamage(3, 'smash');

  assert.ok(threeFocusSmash > zeroFocusSmash * 2);
  assert.ok(calculateHeavyDamage(2, 'thrust') > calculateHeavyDamage(2, 'pillar'));
});

test('calculateStaggerBreak triggers posture break at 100', () => {
  const underLimit = calculateStaggerBreak(40, 30);
  assert.equal(underLimit.isBroken, false);
  assert.equal(underLimit.newPosture, 70);

  const overLimit = calculateStaggerBreak(70, 45);
  assert.equal(overLimit.isBroken, true);
  assert.equal(overLimit.newPosture, 0);
});
