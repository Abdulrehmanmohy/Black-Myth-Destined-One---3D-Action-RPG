/**
 * Atmospheric 3D Eastern Dark Mythology Arena & Environment
 * Procedural flagstone canvas texture, ancient half-submerged Buddha head,
 * weathered temple gate ruins, and natural cliff barriers.
 */

import * as THREE from 'three';

export interface ArenaEnvironment {
  group: THREE.Group;
  brazierEmbers: THREE.Points[];
  brazierLights: THREE.PointLight[];
  update: (time: number) => void;
}

/**
 * Procedurally generates a cracked dark slate flagstone texture with moss accents
 */
function createFlagstoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark slate base
  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 512, 512);

  // Weathered noise and speckles
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const lum = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${lum}, ${lum + 2}, ${lum + 4})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Flagstone paver mortar grid
  ctx.strokeStyle = '#121418';
  ctx.lineWidth = 4;
  const gridSize = 64;
  for (let x = 0; x <= 512; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + (Math.random() - 0.5) * 4, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 4);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }

  // Moss and damp patches
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const rad = 10 + Math.random() * 25;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grad.addColorStop(0, 'rgba(42, 60, 48, 0.45)');
    grad.addColorStop(1, 'rgba(42, 60, 48, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createDarkMythArena(): ArenaEnvironment {
  const group = new THREE.Group();
  const brazierEmbers: THREE.Points[] = [];
  const brazierLights: THREE.PointLight[] = [];

  const flagstoneTexture = createFlagstoneTexture();

  // PBR Materials
  const stoneMat = new THREE.MeshStandardMaterial({
    map: flagstoneTexture,
    color: 0x5a606d,
    roughness: 0.75,
    metalness: 0.15,
  });

  const mossStoneMat = new THREE.MeshStandardMaterial({
    color: 0x36423a,
    roughness: 0.88,
    metalness: 0.08,
  });

  const ancientWoodMat = new THREE.MeshStandardMaterial({
    color: 0x42291d,
    roughness: 0.7,
    metalness: 0.15,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x8a6a42,
    roughness: 0.28,
    metalness: 0.9,
  });

  const roofTileMat = new THREE.MeshStandardMaterial({
    color: 0x212933,
    roughness: 0.55,
    metalness: 0.35,
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x1f382a,
    roughness: 0.85,
    metalness: 0.05,
  });

  // 1. Expansive Natural Terrain
  const groundGeo = new THREE.PlaneGeometry(130, 130, 36, 36);
  groundGeo.rotateX(-Math.PI / 2);

  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const distFromCenter = Math.sqrt(x * x + z * z);
    if (distFromCenter > 22) {
      const hillHeight = Math.pow((distFromCenter - 22) * 0.18, 1.4) + Math.sin(x * 0.2) * Math.cos(z * 0.2) * 1.8;
      pos.setY(i, hillHeight);
    } else {
      pos.setY(i, Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.06);
    }
  }
  groundGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x191c20,
    roughness: 0.95,
    metalness: 0.05,
  });
  const groundMesh = new THREE.Mesh(groundGeo, terrainMat);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // 2. Center Battle Courtyard (Weathered Octagonal Stone Platform)
  const courtyardGeo = new THREE.CylinderGeometry(20.5, 21.5, 0.3, 16);
  const courtyardMesh = new THREE.Mesh(courtyardGeo, stoneMat);
  courtyardMesh.position.y = 0.15;
  courtyardMesh.receiveShadow = true;
  group.add(courtyardMesh);

  // Outer Dragon / Sanskrit Ring
  const outerRingGeo = new THREE.RingGeometry(19.2, 20.2, 32);
  outerRingGeo.rotateX(-Math.PI / 2);
  const goldBorderMat = new THREE.MeshStandardMaterial({
    color: 0x9e7c3e,
    roughness: 0.35,
    metalness: 0.85,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, goldBorderMat);
  outerRing.position.y = 0.31;
  group.add(outerRing);

  // Inner Focus Ring Pattern
  const ringGeo = new THREE.RingGeometry(8, 8.4, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMesh = new THREE.Mesh(ringGeo, goldBorderMat);
  ringMesh.position.y = 0.31;
  group.add(ringMesh);

  // 3. Ancient Giant Half-Submerged Buddha Head
  const buddhaGroup = new THREE.Group();
  buddhaGroup.position.set(0, 0, -21);
  buddhaGroup.rotation.set(0.12, 0.15, 0.08);
  group.add(buddhaGroup);

  const buddhaHeadGeo = new THREE.SphereGeometry(4.5, 18, 18);
  buddhaHeadGeo.scale(1, 1.25, 0.95);
  const buddhaHead = new THREE.Mesh(buddhaHeadGeo, mossStoneMat);
  buddhaHead.position.y = 2.8;
  buddhaHead.castShadow = true;
  buddhaHead.receiveShadow = true;
  buddhaGroup.add(buddhaHead);

  // Ushnisha
  const ushnishaGeo = new THREE.SphereGeometry(1.8, 14, 14);
  const ushnisha = new THREE.Mesh(ushnishaGeo, mossStoneMat);
  ushnisha.position.set(0, 7.2, -0.2);
  buddhaGroup.add(ushnisha);

  // Third Eye Urna Gold Dot
  const urnaGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const urnaMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0xffaa00,
    emissiveIntensity: 0.5,
  });
  const urna = new THREE.Mesh(urnaGeo, urnaMat);
  urna.position.set(0, 4.2, 3.8);
  buddhaGroup.add(urna);

  // Serene Eyelids
  const eyeLidGeo = new THREE.TorusGeometry(0.85, 0.16, 8, 16, Math.PI);
  const leftLid = new THREE.Mesh(eyeLidGeo, mossStoneMat);
  leftLid.position.set(-1.5, 3.4, 3.6);
  leftLid.rotation.x = 0.25;
  const rightLid = new THREE.Mesh(eyeLidGeo, mossStoneMat);
  rightLid.position.set(1.5, 3.4, 3.6);
  rightLid.rotation.x = 0.25;
  buddhaGroup.add(leftLid, rightLid);

  // Elongated Ear Lobes
  const earGeo = new THREE.CylinderGeometry(0.4, 0.28, 3.5, 8);
  const leftEar = new THREE.Mesh(earGeo, mossStoneMat);
  leftEar.position.set(-4.2, 2.8, 0);
  const rightEar = new THREE.Mesh(earGeo, mossStoneMat);
  rightEar.position.set(4.2, 2.8, 0);
  buddhaGroup.add(leftEar, rightEar);

  // 4. Weathered Temple Gateway (Shanmen Ruins)
  const gateGroup = new THREE.Group();
  gateGroup.position.set(-19, 0, 0);
  gateGroup.rotation.y = Math.PI / 2;
  group.add(gateGroup);

  const pillarGeo = new THREE.CylinderGeometry(0.5, 0.6, 7.5, 8);
  const p1 = new THREE.Mesh(pillarGeo, ancientWoodMat);
  p1.position.set(-3.5, 3.75, 0);
  p1.castShadow = true;
  const p2 = new THREE.Mesh(pillarGeo, ancientWoodMat);
  p2.position.set(3.5, 3.75, 0);
  p2.castShadow = true;
  gateGroup.add(p1, p2);

  const beamGeo = new THREE.BoxGeometry(9.5, 0.7, 1.2);
  const beam = new THREE.Mesh(beamGeo, ancientWoodMat);
  beam.position.set(0, 7.2, 0);
  beam.castShadow = true;
  gateGroup.add(beam);

  const roofGeo = new THREE.ConeGeometry(6.5, 2.2, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.scale(1.4, 0.6, 0.9);
  const roof = new THREE.Mesh(roofGeo, roofTileMat);
  roof.position.set(0, 8.8, 0);
  roof.castShadow = true;
  gateGroup.add(roof);

  // 5. Twisted Ancient Pine Trees
  function createAncientPine(x: number, z: number, scale = 1.0) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);

    const t1Geo = new THREE.CylinderGeometry(0.55, 0.85, 3.8, 7);
    const t1 = new THREE.Mesh(t1Geo, ancientWoodMat);
    t1.position.y = 1.9;
    t1.rotation.z = 0.15;
    t1.castShadow = true;
    tree.add(t1);

    const t2Geo = new THREE.CylinderGeometry(0.35, 0.55, 3.2, 6);
    const t2 = new THREE.Mesh(t2Geo, ancientWoodMat);
    t2.position.set(0.6, 4.6, 0);
    t2.rotation.z = -0.25;
    t2.castShadow = true;
    tree.add(t2);

    const f1Geo = new THREE.ConeGeometry(3.0, 1.5, 7);
    const f1 = new THREE.Mesh(f1Geo, foliageMat);
    f1.position.set(0.5, 5.4, 0);
    f1.castShadow = true;

    const f2Geo = new THREE.ConeGeometry(2.4, 1.3, 6);
    const f2 = new THREE.Mesh(f2Geo, foliageMat);
    f2.position.set(1.0, 6.4, 0);
    f2.castShadow = true;

    const f3Geo = new THREE.ConeGeometry(1.6, 1.1, 5);
    const f3 = new THREE.Mesh(f3Geo, foliageMat);
    f3.position.set(0.3, 7.2, 0);
    f3.castShadow = true;

    tree.add(f1, f2, f3);
    group.add(tree);
  }

  createAncientPine(18, 12, 1.2);
  createAncientPine(15, -16, 1.1);
  createAncientPine(-14, 18, 1.3);
  createAncientPine(-16, -14, 1.0);

  // 6. Bronze Incense Braziers
  function createBrazier(x: number, z: number) {
    const brazier = new THREE.Group();
    brazier.position.set(x, 0, z);

    const legGeo = new THREE.CylinderGeometry(0.09, 0.14, 0.8, 6);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, bronzeMat);
      leg.position.set(Math.cos(a) * 0.45, 0.4, Math.sin(a) * 0.45);
      leg.rotation.z = Math.sin(a) * 0.2;
      leg.castShadow = true;
      brazier.add(leg);
    }

    const bowlGeo = new THREE.CylinderGeometry(0.75, 0.52, 0.85, 8);
    const bowl = new THREE.Mesh(bowlGeo, bronzeMat);
    bowl.position.y = 1.0;
    bowl.castShadow = true;
    brazier.add(bowl);

    const coalGeo = new THREE.CircleGeometry(0.65, 8);
    coalGeo.rotateX(-Math.PI / 2);
    const coalMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const coal = new THREE.Mesh(coalGeo, coalMat);
    coal.position.y = 1.38;
    brazier.add(coal);

    const emberCount = 35;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 0.7;
      emberPos[i * 3 + 1] = 1.38 + Math.random() * 1.6;
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xff6611,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    brazier.add(embers);
    brazierEmbers.push(embers);

    const fireLight = new THREE.PointLight(0xff6622, 1.8, 8);
    fireLight.position.y = 1.7;
    brazier.add(fireLight);
    brazierLights.push(fireLight);

    group.add(brazier);
  }

  createBrazier(8, -8);
  createBrazier(-8, -8);
  createBrazier(8, 8);
  createBrazier(-8, 8);

  // 7. Perimeter Natural Rock Cliffs
  const cliffGeo = new THREE.DodecahedronGeometry(3.6, 1);
  cliffGeo.scale(1.2, 2.6, 1.2);
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 24.5 + (i % 3) * 2;
    const cliff = new THREE.Mesh(cliffGeo, mossStoneMat);
    cliff.position.set(Math.cos(angle) * dist, 2.6 + (i % 2) * 1.5, Math.sin(angle) * dist);
    cliff.rotation.set(angle, angle * 0.5, i * 0.2);
    cliff.castShadow = true;
    cliff.receiveShadow = true;
    group.add(cliff);
  }

  return {
    group,
    brazierEmbers,
    brazierLights,
    update: (time: number) => {
      brazierEmbers.forEach((embers) => {
        const p = embers.geometry.attributes.position.array as Float32Array;
        const count = p.length / 3;
        for (let i = 0; i < count; i++) {
          p[i * 3 + 1] += 0.025;
          p[i * 3] += Math.sin(time * 3 + i) * 0.005;
          if (p[i * 3 + 1] > 3.4) {
            p[i * 3 + 1] = 1.38;
            p[i * 3] = (Math.random() - 0.5) * 0.7;
            p[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
          }
        }
        embers.geometry.attributes.position.needsUpdate = true;
      });

      // Subtle fire flicker
      brazierLights.forEach((light, idx) => {
        light.intensity = 1.8 + Math.sin(time * 8 + idx * 2) * 0.35;
      });
    },
  };
}
