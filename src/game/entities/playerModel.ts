/**
 * Procedural 3D Model for the Destined One (天命人 / Wukong)
 * Composite multi-part character hierarchy with Ruyi Jingu Bang
 */

import * as THREE from 'three';

export interface PlayerMeshGroup extends THREE.Group {
  staffMesh: THREE.Group;
  staffGlowMesh: THREE.Mesh;
  bodyMesh: THREE.Group;
  headMesh: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  filletMesh: THREE.Mesh;
  fireAura: THREE.Points;
  updateAnimation: (time: number, isMoving: boolean, attackState: string, comboIndex: number, stance: string, isTransformed: boolean) => void;
  setStaffCharge: (charge01: number) => void;
}

export function createPlayerModel(): PlayerMeshGroup {
  const root = new THREE.Group() as PlayerMeshGroup;

  // Materials
  const furMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3220,
    roughness: 0.85,
    metalness: 0.1,
  });

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0x734b32,
    roughness: 0.7,
    metalness: 0.05,
  });

  const goldFilletMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.18,
    emissive: 0x664400,
    emissiveIntensity: 0.3,
  });

  const armorDarkMaterial = new THREE.MeshStandardMaterial({
    color: 0x24272c,
    roughness: 0.4,
    metalness: 0.75,
  });

  const tigerPeltMaterial = new THREE.MeshStandardMaterial({
    color: 0xb56327,
    roughness: 0.8,
    metalness: 0.1,
  });

  const clothRedMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a2020,
    roughness: 0.7,
    metalness: 0.2,
  });

  // Body container (for bouncing/tilting)
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);
  root.bodyMesh = bodyGroup;

  // 1. Torso (Lower & Upper Cuirass)
  const torsoGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.7, 8);
  const torso = new THREE.Mesh(torsoGeo, armorDarkMaterial);
  torso.position.y = 1.05;
  torso.castShadow = true;
  torso.receiveShadow = true;
  bodyGroup.add(torso);

  // Chest bronze plate accent
  const chestPlateGeo = new THREE.BoxGeometry(0.38, 0.35, 0.12);
  const chestPlate = new THREE.Mesh(chestPlateGeo, goldFilletMaterial);
  chestPlate.position.set(0, 1.15, 0.15);
  chestPlate.castShadow = true;
  bodyGroup.add(chestPlate);

  // Tiger pelt sash around waist
  const sashGeo = new THREE.CylinderGeometry(0.34, 0.38, 0.35, 8);
  const sash = new THREE.Mesh(sashGeo, tigerPeltMaterial);
  sash.position.y = 0.78;
  sash.castShadow = true;
  bodyGroup.add(sash);

  // Split battle skirt hanging down
  const skirtFrontGeo = new THREE.BoxGeometry(0.28, 0.45, 0.05);
  const skirtFront = new THREE.Mesh(skirtFrontGeo, clothRedMaterial);
  skirtFront.position.set(0, 0.55, 0.2);
  skirtFront.rotation.x = 0.15;
  bodyGroup.add(skirtFront);

  // 2. Head & Golden Fillet
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.55, 0);
  bodyGroup.add(headGroup);
  root.headMesh = headGroup;

  // Head base (Ape skull)
  const headGeo = new THREE.SphereGeometry(0.23, 12, 10);
  headGeo.scale(1, 1.15, 1);
  const head = new THREE.Mesh(headGeo, furMaterial);
  head.castShadow = true;
  headGroup.add(head);

  // Ape face / muzzle
  const snoutGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.16, 8);
  snoutGeo.rotateX(Math.PI / 2);
  const snout = new THREE.Mesh(snoutGeo, skinMaterial);
  snout.position.set(0, -0.04, 0.18);
  headGroup.add(snout);

  // Glowing eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const eyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.08, 0.05, 0.2);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.08, 0.05, 0.2);
  headGroup.add(leftEye, rightEye);

  // Golden Fillet (Tight circlet on brow with curl)
  const filletTorus = new THREE.TorusGeometry(0.24, 0.035, 8, 24);
  filletTorus.rotateX(Math.PI / 2);
  const fillet = new THREE.Mesh(filletTorus, goldFilletMaterial);
  fillet.position.y = 0.08;
  fillet.castShadow = true;
  headGroup.add(fillet);
  root.filletMesh = fillet;

  // Fillet front crescent curl motif
  const curlGeo = new THREE.TorusGeometry(0.06, 0.02, 6, 12, Math.PI * 1.5);
  const curl = new THREE.Mesh(curlGeo, goldFilletMaterial);
  curl.position.set(0, 0.1, 0.23);
  curl.rotation.z = Math.PI;
  headGroup.add(curl);

  // Ape ear tufts
  const earGeo = new THREE.ConeGeometry(0.06, 0.12, 5);
  const leftEar = new THREE.Mesh(earGeo, furMaterial);
  leftEar.position.set(-0.24, 0.08, 0);
  leftEar.rotation.z = 0.6;
  const rightEar = new THREE.Mesh(earGeo, furMaterial);
  rightEar.position.set(0.24, 0.08, 0);
  rightEar.rotation.z = -0.6;
  headGroup.add(leftEar, rightEar);

  // 3. Arms
  // Left arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.38, 1.35, 0);
  bodyGroup.add(leftArmGroup);
  root.leftArm = leftArmGroup;

  const shoulderPadGeo = new THREE.SphereGeometry(0.14, 8, 8);
  const leftShoulder = new THREE.Mesh(shoulderPadGeo, armorDarkMaterial);
  leftArmGroup.add(leftShoulder);

  const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.5, 6);
  armGeo.translate(0, -0.25, 0);
  const leftUpperArm = new THREE.Mesh(armGeo, furMaterial);
  leftArmGroup.add(leftUpperArm);

  const bracerGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.25, 6);
  bracerGeo.translate(0, -0.4, 0);
  const leftBracer = new THREE.Mesh(bracerGeo, goldFilletMaterial);
  leftArmGroup.add(leftBracer);

  // Right arm (Holding staff)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.38, 1.35, 0);
  bodyGroup.add(rightArmGroup);
  root.rightArm = rightArmGroup;

  const rightShoulder = new THREE.Mesh(shoulderPadGeo, armorDarkMaterial);
  rightArmGroup.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(armGeo, furMaterial);
  rightArmGroup.add(rightUpperArm);

  const rightBracer = new THREE.Mesh(bracerGeo, goldFilletMaterial);
  rightArmGroup.add(rightBracer);

  // 4. Legs
  // Left Leg
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.16, 0.7, 0);
  bodyGroup.add(leftLegGroup);
  root.leftLeg = leftLegGroup;

  const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.7, 6);
  legGeo.translate(0, -0.35, 0);
  const leftLeg = new THREE.Mesh(legGeo, armorDarkMaterial);
  leftLeg.castShadow = true;
  leftLegGroup.add(leftLeg);

  // Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.16, 0.7, 0);
  bodyGroup.add(rightLegGroup);
  root.rightLeg = rightLegGroup;

  const rightLeg = new THREE.Mesh(legGeo, armorDarkMaterial);
  rightLeg.castShadow = true;
  rightLegGroup.add(rightLeg);

  // 5. The Ruyi Jingu Bang (如意金箍棒)
  const staffGroup = new THREE.Group();
  root.staffMesh = staffGroup;
  rightArmGroup.add(staffGroup);
  staffGroup.position.set(0.05, -0.45, 0.15);
  staffGroup.rotation.x = Math.PI / 2;

  // Staff Central Shaft (Deep blackened iron with crimson tint)
  const shaftMat = new THREE.MeshStandardMaterial({
    color: 0x1d1414,
    roughness: 0.35,
    metalness: 0.85,
  });
  const shaftGeo = new THREE.CylinderGeometry(0.038, 0.038, 2.2, 12);
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.castShadow = true;
  staffGroup.add(shaft);

  // Gold Banded Ends (Golden Hoops at both ends)
  const goldHoopGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.32, 12);
  const topHoop = new THREE.Mesh(goldHoopGeo, goldFilletMaterial);
  topHoop.position.y = 0.95;
  topHoop.castShadow = true;
  const bottomHoop = new THREE.Mesh(goldHoopGeo, goldFilletMaterial);
  bottomHoop.position.y = -0.95;
  bottomHoop.castShadow = true;
  staffGroup.add(topHoop, bottomHoop);

  // Inner Glow Core for Heavy Attacks / Stances
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffaa22,
    transparent: true,
    opacity: 0.0,
  });
  const glowGeo = new THREE.CylinderGeometry(0.058, 0.058, 2.3, 12);
  const staffGlow = new THREE.Mesh(glowGeo, glowMat);
  staffGroup.add(staffGlow);
  root.staffGlowMesh = staffGlow;

  // 6. Transformation Fire Aura (Wolf Mode)
  const auraCount = 80;
  const auraGeo = new THREE.BufferGeometry();
  const auraPos = new Float32Array(auraCount * 3);
  for (let i = 0; i < auraCount; i++) {
    auraPos[i * 3] = (Math.random() - 0.5) * 1.2;
    auraPos[i * 3 + 1] = Math.random() * 2.2;
    auraPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
  }
  auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPos, 3));
  const auraMat = new THREE.PointsMaterial({
    color: 0xff4411,
    size: 0.16,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const fireAura = new THREE.Points(auraGeo, auraMat);
  root.add(fireAura);
  root.fireAura = fireAura;

  // Ground shadow contact disc
  const shadowGeo = new THREE.CircleGeometry(0.65, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.02;
  root.add(shadowMesh);

  // Public Methods
  root.setStaffCharge = (charge01: number) => {
    (staffGlow.material as THREE.MeshBasicMaterial).opacity = charge01 * 0.85;
    const scaleFactor = 1 + charge01 * 0.45;
    staffGroup.scale.set(scaleFactor, 1 + charge01 * 0.55, scaleFactor);
  };

  root.updateAnimation = (
    time: number,
    isMoving: boolean,
    attackState: string,
    comboIndex: number,
    stance: string,
    isTransformed: boolean
  ) => {
    // Transform Fire Aura Update
    if (isTransformed) {
      auraMat.opacity = 0.85;
      const pos = auraGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < auraCount; i++) {
        pos[i * 3 + 1] += 0.04;
        if (pos[i * 3 + 1] > 2.5) {
          pos[i * 3 + 1] = 0.2;
          pos[i * 3] = (Math.random() - 0.5) * 1.2;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      auraGeo.attributes.position.needsUpdate = true;
    } else {
      auraMat.opacity = 0;
    }

    // Attack Animations
    if (attackState === 'light') {
      const swingSpeed = 16;
      const progress = (time * swingSpeed) % Math.PI;

      if (comboIndex === 0) {
        // Horizontal staff sweep
        bodyGroup.rotation.y = Math.sin(progress) * 1.4;
        rightArmGroup.rotation.x = -0.5 + Math.cos(progress) * 1.5;
        rightArmGroup.rotation.z = 0.8;
        staffGroup.rotation.z = Math.sin(progress) * 2;
      } else if (comboIndex === 1) {
        // Thrust forward
        bodyGroup.position.z = Math.sin(progress) * 0.3;
        rightArmGroup.rotation.x = -1.5;
        staffGroup.position.z = 0.4 + Math.sin(progress) * 0.5;
      } else if (comboIndex === 2) {
        // Rapid 360 spin
        bodyGroup.rotation.y = time * 20;
        rightArmGroup.rotation.x = -1.2;
        staffGroup.rotation.y = time * 25;
      } else {
        // Leaping overhead slam
        bodyGroup.position.y = Math.sin(progress) * 0.8;
        rightArmGroup.rotation.x = -2.8 + Math.sin(progress) * 2.5;
        staffGroup.rotation.x = 0;
      }
      return;
    }

    if (attackState === 'heavy') {
      // Leap and crush slam
      bodyGroup.position.y = 0.8;
      rightArmGroup.rotation.x = -2.8;
      staffGroup.rotation.x = 0.2;
      return;
    }

    if (attackState === 'pillar') {
      // Vault on top of the staff
      bodyGroup.position.y = 2.0;
      staffGroup.position.set(0, -1.8, 0);
      staffGroup.rotation.set(0, 0, 0);
      rightArmGroup.rotation.x = -3.0;
      return;
    }

    // Reset base positions
    staffGroup.position.set(0.05, -0.45, 0.15);
    staffGroup.rotation.set(Math.PI / 2, 0, 0);
    bodyGroup.position.set(0, 0, 0);
    bodyGroup.rotation.set(0, 0, 0);

    // Idle & Running cycles
    if (isMoving) {
      const runSpeed = 12;
      const cycle = time * runSpeed;

      // Legs swing
      leftLegGroup.rotation.x = Math.sin(cycle) * 0.8;
      rightLegGroup.rotation.x = -Math.sin(cycle) * 0.8;

      // Arms swing
      leftArmGroup.rotation.x = -Math.sin(cycle) * 0.7;
      rightArmGroup.rotation.x = Math.sin(cycle) * 0.6 - 0.2;

      // Subtle body bob
      bodyGroup.position.y = Math.abs(Math.sin(cycle * 2)) * 0.12;
      bodyGroup.rotation.y = Math.sin(cycle) * 0.1;
    } else {
      // Breathing idle
      const breath = Math.sin(time * 2.5);
      bodyGroup.position.y = breath * 0.03;
      headGroup.rotation.x = breath * 0.05;
      leftArmGroup.rotation.x = -0.1 + breath * 0.04;
      rightArmGroup.rotation.x = -0.3 + breath * 0.04;

      leftLegGroup.rotation.x = 0;
      rightLegGroup.rotation.x = 0;

      // Stance idle nuances
      if (stance === 'pillar') {
        rightArmGroup.rotation.x = -0.8;
        staffGroup.rotation.x = Math.PI / 2.8;
      } else if (stance === 'thrust') {
        rightArmGroup.rotation.x = -1.2;
        staffGroup.rotation.x = Math.PI / 2.2;
      }
    }
  };

  return root;
}
