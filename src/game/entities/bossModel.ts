/**
 * Procedural 3D Boss Models for Black Myth: Destined One
 * Guangzhi, Tiger Vanguard, Yellow Wind Sage, and White Clothed Noble
 */

import * as THREE from 'three';
import { BossId } from '../../types/game';

export interface BossMeshGroup extends THREE.Group {
  bossId: BossId;
  bodyGroup: THREE.Group;
  weaponGroup: THREE.Group;
  auraGroup: THREE.Points;
  telegraphRing: THREE.Mesh;
  setTelegraph: (visible: boolean, progress: number) => void;
  updateBossAnimation: (
    time: number,
    isMoving: boolean,
    isAttacking: boolean,
    attackType: string,
    attackProgress: number,
    isStaggered: boolean,
    isImmobilized: boolean,
    isEnraged: boolean
  ) => void;
}

export function createBossModel(id: BossId): BossMeshGroup {
  const root = new THREE.Group() as BossMeshGroup;
  root.bossId = id;

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);
  root.bodyGroup = bodyGroup;

  // Materials based on boss
  let primaryColor = 0xb53525; // Guangzhi / Tiger flame
  let secondaryColor = 0x221a18;
  let accentColor = 0xff7722;

  if (id === 'tigerVanguard') {
    primaryColor = 0xd97724;
    secondaryColor = 0x331c12;
    accentColor = 0x8f1d1d;
  } else if (id === 'yellowWind') {
    primaryColor = 0xc2a649;
    secondaryColor = 0x383020;
    accentColor = 0xe0c867;
  } else if (id === 'whiteNoble') {
    primaryColor = 0xdedede;
    secondaryColor = 0x3a4b56;
    accentColor = 0x38bdf8;
  }

  const primaryMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.5,
    metalness: 0.4,
  });

  const armorMat = new THREE.MeshStandardMaterial({
    color: secondaryColor,
    roughness: 0.35,
    metalness: 0.8,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.2,
    metalness: 0.9,
    emissive: accentColor,
    emissiveIntensity: 0.25,
  });

  // 1. Torso
  const torsoGeo = new THREE.CylinderGeometry(0.55, 0.42, 1.2, 8);
  const torso = new THREE.Mesh(torsoGeo, armorMat);
  torso.position.y = 1.4;
  torso.castShadow = true;
  bodyGroup.add(torso);

  // Muscular Chest / Mantle Plate
  const chestGeo = new THREE.BoxGeometry(0.85, 0.6, 0.45);
  const chest = new THREE.Mesh(chestGeo, primaryMat);
  chest.position.set(0, 1.55, 0.1);
  chest.castShadow = true;
  bodyGroup.add(chest);

  // 2. Head with unique headdress
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.2, 0);
  bodyGroup.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.35, 10, 10);
  headGeo.scale(1, 1.1, 1.2);
  const head = new THREE.Mesh(headGeo, armorMat);
  head.castShadow = true;
  headGroup.add(head);

  // Boss-specific head ornaments
  if (id === 'guangzhi' || id === 'tigerVanguard') {
    // Beast skull / Horns
    const hornGeo = new THREE.ConeGeometry(0.12, 0.6, 6);
    const leftHorn = new THREE.Mesh(hornGeo, accentMat);
    leftHorn.position.set(-0.35, 0.35, -0.1);
    leftHorn.rotation.set(-0.2, 0, 0.5);
    const rightHorn = new THREE.Mesh(hornGeo, accentMat);
    rightHorn.position.set(0.35, 0.35, -0.1);
    rightHorn.rotation.set(-0.2, 0, -0.5);
    headGroup.add(leftHorn, rightHorn);

    // Glowing predator eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1100 });
    const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const le = new THREE.Mesh(eyeGeo, eyeMat);
    le.position.set(-0.16, 0.05, 0.38);
    const re = new THREE.Mesh(eyeGeo, eyeMat);
    re.position.set(0.16, 0.05, 0.38);
    headGroup.add(le, re);
  } else if (id === 'yellowWind') {
    // Saffron cowl and large floating prayer beads
    const cowlGeo = new THREE.TorusGeometry(0.38, 0.12, 8, 16);
    cowlGeo.rotateX(Math.PI / 2);
    const cowl = new THREE.Mesh(cowlGeo, primaryMat);
    cowl.position.y = -0.1;
    headGroup.add(cowl);

    // 8 floating prayer beads around neck
    const beadGeo = new THREE.SphereGeometry(0.12, 8, 8);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bead = new THREE.Mesh(beadGeo, accentMat);
      bead.position.set(Math.cos(angle) * 0.65, -0.4, Math.sin(angle) * 0.65);
      headGroup.add(bead);
    }
  } else {
    // White Clothed Noble: Dragon crest headdress & celestial ribbon
    const crestGeo = new THREE.ConeGeometry(0.1, 0.55, 6);
    const crest = new THREE.Mesh(crestGeo, accentMat);
    crest.position.set(0, 0.45, -0.1);
    crest.rotation.x = -0.3;
    headGroup.add(crest);

    const ribbonGeo = new THREE.TorusGeometry(0.7, 0.04, 6, 24);
    const ribbon = new THREE.Mesh(ribbonGeo, new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    }));
    ribbon.position.set(0, 0, -0.2);
    headGroup.add(ribbon);
  }

  // 3. Spiked Shoulder Pauldrons
  const pauldronGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const leftPauldron = new THREE.Mesh(pauldronGeo, accentMat);
  leftPauldron.position.set(-0.65, 1.8, 0);
  const rightPauldron = new THREE.Mesh(pauldronGeo, accentMat);
  rightPauldron.position.set(0.65, 1.8, 0);
  bodyGroup.add(leftPauldron, rightPauldron);

  // 4. Arms
  const armGeo = new THREE.CylinderGeometry(0.16, 0.13, 0.85, 6);
  armGeo.translate(0, -0.42, 0);
  const leftArm = new THREE.Mesh(armGeo, armorMat);
  leftArm.position.set(-0.65, 1.7, 0);
  const rightArm = new THREE.Mesh(armGeo, armorMat);
  rightArm.position.set(0.65, 1.7, 0);
  bodyGroup.add(leftArm, rightArm);

  // 5. Legs
  const legGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.0, 6);
  legGeo.translate(0, -0.5, 0);
  const leftLeg = new THREE.Mesh(legGeo, armorMat);
  leftLeg.position.set(-0.3, 0.9, 0);
  leftLeg.castShadow = true;
  const rightLeg = new THREE.Mesh(legGeo, armorMat);
  rightLeg.position.set(0.3, 0.9, 0);
  rightLeg.castShadow = true;
  bodyGroup.add(leftLeg, rightLeg);

  // 6. Boss Weapons (Held in right hand)
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0.7, 1.0, 0.3);
  bodyGroup.add(weaponGroup);
  root.weaponGroup = weaponGroup;

  if (id === 'guangzhi') {
    // Twin-bladed Flaming Spear / Red Tides Glaive
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8);
    const shaft = new THREE.Mesh(shaftGeo, armorMat);
    shaft.rotation.x = Math.PI / 2;
    weaponGroup.add(shaft);

    const bladeGeo = new THREE.ConeGeometry(0.14, 0.8, 4);
    const blade1 = new THREE.Mesh(bladeGeo, accentMat);
    blade1.position.set(0, 0, 1.4);
    blade1.rotation.x = Math.PI / 2;

    const blade2 = new THREE.Mesh(bladeGeo, accentMat);
    blade2.position.set(0, 0, -1.4);
    blade2.rotation.x = -Math.PI / 2;

    weaponGroup.add(blade1, blade2);
  } else if (id === 'tigerVanguard') {
    // Giant Heavy Broadsword
    const bladeGeo = new THREE.BoxGeometry(0.28, 2.2, 0.08);
    const blade = new THREE.Mesh(bladeGeo, armorMat);
    blade.position.set(0, 0.8, 0);

    const edgeGeo = new THREE.BoxGeometry(0.32, 2.0, 0.02);
    const edge = new THREE.Mesh(edgeGeo, accentMat);
    edge.position.set(0, 0.8, 0);

    weaponGroup.add(blade, edge);
  } else if (id === 'yellowWind') {
    // Gilded Samadhi Trident Pitchfork
    const shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8);
    const shaft = new THREE.Mesh(shaftGeo, armorMat);
    shaft.position.y = 0.5;
    weaponGroup.add(shaft);

    const prongGeo = new THREE.ConeGeometry(0.08, 0.6, 4);
    for (let p = -1; p <= 1; p++) {
      const prong = new THREE.Mesh(prongGeo, accentMat);
      prong.position.set(p * 0.22, 1.9, 0);
      weaponGroup.add(prong);
    }
  } else {
    // White Clothed Noble: Elegant Double-ended Silver Lance
    const lanceGeo = new THREE.CylinderGeometry(0.035, 0.035, 3.0, 8);
    const lance = new THREE.Mesh(lanceGeo, accentMat);
    lance.rotation.x = Math.PI / 2;
    weaponGroup.add(lance);
  }

  // 7. Ground Telegraph Ring (Shows dangerous AOE or charged attack windup)
  const ringGeo = new THREE.RingGeometry(1.6, 1.85, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff2200,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const telegraphRing = new THREE.Mesh(ringGeo, ringMat);
  telegraphRing.position.y = 0.04;
  root.add(telegraphRing);
  root.telegraphRing = telegraphRing;

  root.setTelegraph = (visible: boolean, progress: number) => {
    telegraphRing.visible = visible;
    (telegraphRing.material as THREE.MeshBasicMaterial).opacity = visible ? 0.3 + progress * 0.6 : 0;
    const scale = 1.0 + progress * 0.3;
    telegraphRing.scale.set(scale, 1, scale);
  };

  // 8. Boss Elemental Aura Particles
  const auraCount = 50;
  const auraGeo = new THREE.BufferGeometry();
  const auraPositions = new Float32Array(auraCount * 3);
  for (let i = 0; i < auraCount; i++) {
    auraPositions[i * 3] = (Math.random() - 0.5) * 1.8;
    auraPositions[i * 3 + 1] = Math.random() * 2.8;
    auraPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
  }
  auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
  const auraMat = new THREE.PointsMaterial({
    color: accentColor,
    size: 0.22,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  const auraPoints = new THREE.Points(auraGeo, auraMat);
  root.add(auraPoints);
  root.auraGroup = auraPoints;

  // Ground contact shadow
  const shadowGeo = new THREE.CircleGeometry(0.9, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.02;
  root.add(shadowMesh);

  // Animation Update
  root.updateBossAnimation = (
    time: number,
    isMoving: boolean,
    isAttacking: boolean,
    attackType: string,
    attackProgress: number,
    isStaggered: boolean,
    isImmobilized: boolean,
    isEnraged: boolean
  ) => {
    // Aura update
    const pos = auraGeo.attributes.position.array as Float32Array;
    const speed = isEnraged ? 0.08 : 0.03;
    for (let i = 0; i < auraCount; i++) {
      pos[i * 3 + 1] += speed;
      if (pos[i * 3 + 1] > 3.0) {
        pos[i * 3 + 1] = 0.2;
        pos[i * 3] = (Math.random() - 0.5) * 1.8;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      }
    }
    auraGeo.attributes.position.needsUpdate = true;

    if (isImmobilized) {
      // Golden talisman freeze (vibrating gently in frozen pose)
      bodyGroup.position.x = (Math.random() - 0.5) * 0.02;
      return;
    }

    if (isStaggered) {
      // Reeling backwards from heavy staff blow
      bodyGroup.position.set(0, 0, -0.4);
      bodyGroup.rotation.x = -0.4;
      headGroup.rotation.x = 0.5;
      rightArm.rotation.x = 0.5;
      leftArm.rotation.x = 0.5;
      return;
    }

    if (isAttacking) {
      if (attackType === 'slash' || attackType === 'spin') {
        const swingCycle = attackProgress * Math.PI;
        bodyGroup.rotation.y = Math.sin(swingCycle) * 2.2;
        weaponGroup.rotation.x = -Math.PI / 2 + Math.sin(swingCycle) * 3.0;
        weaponGroup.position.z = 0.3 + Math.sin(swingCycle) * 0.7;
      } else if (attackType === 'leap' || attackType === 'slam') {
        // High jump and ground slam
        const leapHeight = Math.sin(attackProgress * Math.PI) * 1.8;
        bodyGroup.position.y = leapHeight;
        weaponGroup.rotation.x = -2.5 + attackProgress * 3;
      } else if (attackType === 'roar') {
        headGroup.rotation.x = -0.6;
        bodyGroup.position.y = Math.sin(time * 30) * 0.05;
        leftArm.rotation.x = -1.2;
        rightArm.rotation.x = -1.2;
      }
      return;
    }

    // Default Walk & Idle
    bodyGroup.position.set(0, 0, 0);
    bodyGroup.rotation.set(0, 0, 0);
    weaponGroup.position.set(0.7, 1.0, 0.3);
    weaponGroup.rotation.set(0, 0, 0);

    if (isMoving) {
      const walkSpeed = isEnraged ? 10 : 7;
      const cycle = time * walkSpeed;
      leftLeg.rotation.x = Math.sin(cycle) * 0.6;
      rightLeg.rotation.x = -Math.sin(cycle) * 0.6;
      leftArm.rotation.x = -Math.sin(cycle) * 0.5;
      rightArm.rotation.x = Math.sin(cycle) * 0.5;
      bodyGroup.position.y = Math.abs(Math.sin(cycle * 2)) * 0.1;
    } else {
      const breath = Math.sin(time * 2.0);
      bodyGroup.position.y = breath * 0.05;
      headGroup.rotation.x = breath * 0.04;
      leftLeg.rotation.x = 0;
      rightLeg.rotation.x = 0;
      leftArm.rotation.x = -0.2;
      rightArm.rotation.x = 0.2;
    }
  };

  return root;
}
