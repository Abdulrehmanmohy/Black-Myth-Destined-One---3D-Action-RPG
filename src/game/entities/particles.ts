/**
 * High-performance pooled particle effects for Black Myth combat
 * Hit sparks, Sanskrit freeze ring, shockwaves, and Cloud Step mist
 */

import * as THREE from 'three';

interface SparkParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
  size: number;
}

export class ParticleManager {
  public group: THREE.Group = new THREE.Group();
  private maxSparks = 200;
  private sparks: SparkParticle[] = [];
  private sparkPoints: THREE.Points;
  private sparkPositions: Float32Array;
  private sparkColors: Float32Array;
  private sparkSizes: Float32Array;

  // Sanskrit Talisman Ring (Immobilize spell)
  private immobilizeRing: THREE.Mesh;
  private shockwaveRing: THREE.Mesh;
  private cloudDecoy: THREE.Group;

  constructor() {
    // 1. Instanced/Buffer Spark System
    const sparkGeo = new THREE.BufferGeometry();
    this.sparkPositions = new Float32Array(this.maxSparks * 3);
    this.sparkColors = new Float32Array(this.maxSparks * 3);
    this.sparkSizes = new Float32Array(this.maxSparks);

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(this.sparkPositions, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(this.sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    this.group.add(this.sparkPoints);

    // 2. Sanskrit Talisman Ring for Immobilize (Ding Shen Shu)
    const ringGeo = new THREE.RingGeometry(1.4, 1.8, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.immobilizeRing = new THREE.Mesh(ringGeo, ringMat);
    this.immobilizeRing.position.y = 1.2;
    this.group.add(this.immobilizeRing);

    // 3. Ground Shockwave Ring for Heavy Jump Slam
    const shockGeo = new THREE.RingGeometry(0.5, 0.9, 32);
    shockGeo.rotateX(-Math.PI / 2);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.shockwaveRing = new THREE.Mesh(shockGeo, shockMat);
    this.shockwaveRing.position.y = 0.05;
    this.group.add(this.shockwaveRing);

    // 4. Cloud Step Phantom Decoy
    this.cloudDecoy = new THREE.Group();
    const decoyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.6, 8);
    const decoyMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0,
      wireframe: true,
    });
    const decoyMesh = new THREE.Mesh(decoyGeo, decoyMat);
    decoyMesh.position.y = 0.8;
    this.cloudDecoy.add(decoyMesh);
    this.group.add(this.cloudDecoy);
  }

  /**
   * Spawn explosive burst of golden combat sparks
   */
  public spawnHitSparks(pos: THREE.Vector3, type: 'light' | 'heavy' | 'critical' | 'fire' = 'light') {
    const count = type === 'critical' ? 35 : type === 'heavy' ? 24 : 14;
    const baseColor =
      type === 'fire'
        ? new THREE.Color(0xff4400)
        : type === 'critical'
        ? new THREE.Color(0xfff088)
        : new THREE.Color(0xffaa22);

    for (let i = 0; i < count; i++) {
      if (this.sparks.length >= this.maxSparks) {
        this.sparks.shift(); // Evict oldest
      }

      const speed = (type === 'critical' ? 7 : 4) * (0.6 + Math.random() * 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.2) * Math.PI;

      const vel = new THREE.Vector3(
        Math.cos(theta) * Math.cos(phi) * speed,
        Math.sin(phi) * speed + 2.0,
        Math.sin(theta) * Math.cos(phi) * speed
      );

      this.sparks.push({
        pos: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3)),
        vel,
        color: baseColor.clone(),
        life: 0,
        maxLife: 0.25 + Math.random() * 0.2,
        size: 0.15 + Math.random() * 0.1,
      });
    }
  }

  /**
   * Trigger Ground Shockwave (Heavy leap slam)
   */
  public triggerShockwave(pos: THREE.Vector3) {
    this.shockwaveRing.position.copy(pos);
    this.shockwaveRing.position.y = 0.08;
    this.shockwaveRing.scale.set(0.2, 0.2, 0.2);
    (this.shockwaveRing.material as THREE.MeshBasicMaterial).opacity = 0.9;
  }

  /**
   * Show Immobilize Sanskrit ring on target
   */
  public showImmobilizeRing(pos: THREE.Vector3, active: boolean) {
    if (active) {
      this.immobilizeRing.position.copy(pos);
      this.immobilizeRing.position.y = 1.3;
      (this.immobilizeRing.material as THREE.MeshBasicMaterial).opacity = 0.85;
    } else {
      (this.immobilizeRing.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  }

  /**
   * Leave Cloud Step Decoy
   */
  public dropCloudDecoy(pos: THREE.Vector3) {
    this.cloudDecoy.position.copy(pos);
    const mat = (this.cloudDecoy.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
    mat.opacity = 0.6;
  }

  public update(dt: number) {
    // 1. Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.life += dt;
      if (sp.life >= sp.maxLife) {
        this.sparks.splice(i, 1);
        continue;
      }

      // Physics
      sp.vel.y -= 14.0 * dt; // Gravity
      sp.pos.addScaledVector(sp.vel, dt);
    }

    // Populate buffers
    for (let i = 0; i < this.maxSparks; i++) {
      if (i < this.sparks.length) {
        const sp = this.sparks[i];
        this.sparkPositions[i * 3] = sp.pos.x;
        this.sparkPositions[i * 3 + 1] = sp.pos.y;
        this.sparkPositions[i * 3 + 2] = sp.pos.z;

        const alpha = 1 - sp.life / sp.maxLife;
        this.sparkColors[i * 3] = sp.color.r * alpha;
        this.sparkColors[i * 3 + 1] = sp.color.g * alpha;
        this.sparkColors[i * 3 + 2] = sp.color.b * alpha;
      } else {
        this.sparkPositions[i * 3] = 0;
        this.sparkPositions[i * 3 + 1] = -999;
        this.sparkPositions[i * 3 + 2] = 0;
      }
    }
    this.sparkPoints.geometry.attributes.position.needsUpdate = true;
    this.sparkPoints.geometry.attributes.color.needsUpdate = true;

    // 2. Animate Sanskrit Ring
    if ((this.immobilizeRing.material as THREE.MeshBasicMaterial).opacity > 0) {
      this.immobilizeRing.rotation.y += dt * 3.5;
    }

    // 3. Animate Shockwave Ring
    const shockMat = this.shockwaveRing.material as THREE.MeshBasicMaterial;
    if (shockMat.opacity > 0.01) {
      shockMat.opacity -= dt * 2.2;
      const s = this.shockwaveRing.scale.x + dt * 14;
      this.shockwaveRing.scale.set(s, s, s);
    } else {
      shockMat.opacity = 0;
    }

    // 4. Animate Decoy Fade
    const decoyMat = (this.cloudDecoy.children[0] as THREE.Mesh)?.material as THREE.MeshBasicMaterial;
    if (decoyMat && decoyMat.opacity > 0) {
      decoyMat.opacity -= dt * 0.4;
      this.cloudDecoy.rotation.y += dt * 2.0;
    }
  }
}
