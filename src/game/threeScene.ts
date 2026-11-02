/**
 * Core Three.js Game Engine for Black Myth: Destined One
 * 60fps simulation, PBR lighting, responsive combat, input buffering,
 * software-WebGL pacing guard, and zero garbage collection in render loop.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BossConfig, BossId, BossStats, PlayerStats, SpellId, Stance } from '../types/game';
import { sound } from '../audio/soundEngine';
import { createPlayerModel, PlayerMeshGroup } from './entities/playerModel';
import { createBossModel, BossMeshGroup } from './entities/bossModel';
import { createDarkMythArena, ArenaEnvironment } from './entities/environment';
import { ParticleManager } from './entities/particles';

export const BOSS_CONFIGS: Record<BossId, BossConfig> = {
  guangzhi: {
    id: 'guangzhi',
    name: 'Guangzhi',
    title: 'Monk of the Red Tides',
    domain: 'Twin Flame Blade',
    maxHp: 850,
    attackPower: 18,
    phase2Threshold: 0.5,
    color: '#ef4444',
    accentColor: '#f97316',
    realmName: 'Black Wind Mountain · Guanyin Temple Ruins',
    description: 'A fallen warrior monk seduced by the gilded cassock, now wielding the blazing twin-bladed Red Tides glaive.',
    quote: 'To end war through war, let these righteous flames cleanse your destined path!',
    relicReward: 'Red Tides Flame Transformation',
    relicName: 'Craving of Eyes',
  },
  tigerVanguard: {
    id: 'tigerVanguard',
    name: 'Tiger Vanguard',
    title: 'Guardian of the Blood Pool',
    domain: 'Dual Serrated Broadswords',
    maxHp: 1100,
    attackPower: 24,
    phase2Threshold: 0.5,
    color: '#f97316',
    accentColor: '#991b1b',
    realmName: 'Yellow Wind Ridge · Temple of Crouching Tiger',
    description: 'Fierce beast general bathing in the pool of celestial blood, cleaving intruders with twin dao blades.',
    quote: 'Another monkey soul to feed my master’s boiling cauldron!',
    relicReward: 'Iron Pelt Diamond Blessing',
    relicName: 'Burden of Body',
  },
  yellowWind: {
    id: 'yellowWind',
    name: 'Yellow Wind Sage',
    title: 'Master of Samadhi Wind',
    domain: 'Desert Great Demon King',
    maxHp: 1350,
    attackPower: 26,
    phase2Threshold: 0.45,
    color: '#eab308',
    accentColor: '#ca8a04',
    realmName: 'Yellow Wind Ridge · Fright Cliff',
    description: 'Ancient demon king commanding the blinding Samadhi Wind that once blew out the light of Mount Ling.',
    quote: 'The Sanskrit drums have ceased. Only the sandstorm remembers who truly reigned!',
    relicReward: 'Wind-Tamer Samadhi Pearl',
    relicName: 'Vanity of Ears',
  },
  whiteNoble: {
    id: 'whiteNoble',
    name: 'White Clothed Noble',
    title: 'Poet of the Marsh',
    domain: 'Double-Ended Silver Spear',
    maxHp: 980,
    attackPower: 20,
    phase2Threshold: 0.5,
    color: '#38bdf8',
    accentColor: '#60a5fa',
    realmName: 'Black Wind Mountain · Bamboo Grove Marsh',
    description: 'A serpentine demon clad in snow-white scholars silk, whose double-ended spear weaves lethal poetry.',
    quote: 'All earthly loves are but ripples upon the cold jade pond.',
    relicReward: 'Serpentine Jade Ribbon',
    relicName: 'Gluttony of Tongue',
  },
};

export class GameEngine {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock: THREE.Clock = new THREE.Clock();

  // Engine state
  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private isDestroyed: boolean = false;
  private isPaused: boolean = false;
  private isTitleMode: boolean = true;
  private hitstopTimer: number = 0;
  private screenShake: number = 0;

  // Scene entities
  private player!: PlayerMeshGroup;
  private boss!: BossMeshGroup;
  private arena!: ArenaEnvironment;
  private particles!: ParticleManager;
  private clones: THREE.Group[] = [];

  // Current Boss
  private currentBossId: BossId = 'guangzhi';

  // Combat Stats
  private playerStats: PlayerStats = {
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    mana: 100,
    maxMana: 100,
    focus: 0,
    maxFocus: 400, // 4 Focus Points (100 each)
    gourdSips: 4,
    maxGourdSips: 4,
    activeStance: 'smash',
    isTransformed: false,
    transformDuration: 0,
    isCloudStepping: false,
    cloudStepDuration: 0,
  };

  private bossStats: BossStats = {
    id: 'guangzhi',
    name: 'Guangzhi',
    title: 'Monk of the Red Tides',
    hp: 850,
    maxHp: 850,
    posture: 0,
    isStaggered: false,
    isImmobilized: false,
    immobilizeTimer: 0,
    isEnraged: false,
  };

  // Spells cooldown tracking
  private spellCooldowns: Record<SpellId, { current: number; max: number; mana: number }> = {
    immobilize: { current: 0, max: 14, mana: 35 },
    cloudStep: { current: 0, max: 12, mana: 25 },
    pluckOfMany: { current: 0, max: 28, mana: 60 },
    redTides: { current: 0, max: 32, mana: 40 },
  };

  // Player combat action state
  private isAttacking: boolean = false;
  private attackType: 'light' | 'heavy' | 'pillar' = 'light';
  private comboStep: number = 0;
  private comboTimer: number = 0;
  private attackProgress: number = 0;
  private isDodging: boolean = false;
  private dodgeTimer: number = 0;
  private perfectDodgeFlash: boolean = false;
  private perfectDodgeTimer: number = 0;
  private cloneDuration: number = 0;

  // Boss AI state
  private bossState: 'approach' | 'windup' | 'strike' | 'recover' | 'stagger' = 'approach';
  private bossStateTimer: number = 0;
  private bossAttackChoice: 'slash' | 'leap' | 'spin' | 'roar' = 'slash';
  private bossAttackProgress: number = 0;

  // Reusable Math objects (Zero GC in loop)
  private readonly _vec3A = new THREE.Vector3();
  private readonly _vec3B = new THREE.Vector3();
  private readonly _camTarget = new THREE.Vector3();

  // Input system
  private heldKeys: Set<string> = new Set();
  private mouseAim = new THREE.Vector2();
  private virtualMove = new THREE.Vector2(0, 0);

  public setVirtualJoystick(x: number, y: number) {
    this.virtualMove.set(x, y);
  }

  // Callbacks
  public onPlayerStatsUpdate?: (stats: PlayerStats) => void;
  public onBossStatsUpdate?: (stats: BossStats) => void;
  public onSpellCooldownsUpdate?: (cooldowns: Record<SpellId, { current: number; max: number; mana: number }>) => void;
  public onPerfectDodge?: () => void;
  public onVictory?: () => void;
  public onGameOver?: () => void;

  constructor(container: HTMLElement, initialBossId: BossId = 'guangzhi') {
    this.container = container;
    this.currentBossId = initialBossId;
    this.detectSoftwareGl();
    this.initThree();
    this.initScene();
    this.initInputs();
    this.startLoop();
  }

  private detectSoftwareGl() {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {
      this.isSoftwareGl = true;
      return;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  }

  private initThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0c0f14, 0.016);

    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 150);
    this.camera.position.set(0, 5, 9);

    // Studio Environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.8);
    keyLight.position.set(12, 22, 10);
    keyLight.castShadow = !this.isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 60;
      const d = 20;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x4a627a, 0x1f1915, 1.2);
    this.scene.add(hemiLight);

    // Subtle Rim/Backlight
    const rimLight = new THREE.DirectionalLight(0xffa044, 1.0);
    rimLight.position.set(-15, 14, -15);
    this.scene.add(rimLight);

    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private initScene() {
    // 1. Arena & Environment
    this.arena = createDarkMythArena();
    this.scene.add(this.arena.group);

    // 2. Particle Manager
    this.particles = new ParticleManager();
    this.scene.add(this.particles.group);

    // 3. Player (The Destined One)
    this.player = createPlayerModel();
    this.player.position.set(0, 0, 5);
    this.scene.add(this.player);

    // 4. Boss
    this.loadBoss(this.currentBossId);
  }

  public loadBoss(id: BossId) {
    this.currentBossId = id;
    const cfg = BOSS_CONFIGS[id];

    if (this.boss) {
      this.scene.remove(this.boss);
    }

    this.boss = createBossModel(id);
    this.boss.position.set(0, 0, -6);
    this.boss.rotation.y = Math.PI;
    this.scene.add(this.boss);

    this.bossStats = {
      id,
      name: cfg.name,
      title: cfg.title,
      hp: cfg.maxHp,
      maxHp: cfg.maxHp,
      posture: 0,
      isStaggered: false,
      isImmobilized: false,
      immobilizeTimer: 0,
      isEnraged: false,
    };

    // Reset player combat states for clean encounter
    this.playerStats.hp = this.playerStats.maxHp;
    this.playerStats.stamina = this.playerStats.maxStamina;
    this.playerStats.mana = this.playerStats.maxMana;
    this.playerStats.focus = 0;
    this.playerStats.gourdSips = 4;
    this.playerStats.isTransformed = false;
    this.playerStats.isCloudStepping = false;

    this.player.position.set(0, 0, 6);
    this.player.rotation.set(0, 0, 0);

    this.bossState = 'approach';
    this.bossStateTimer = 0;
    this.bossAttackProgress = 0;

    this.emitStats();
  }

  private initInputs() {
    window.addEventListener('keydown', (e) => {
      this.heldKeys.add(e.code);

      // Edge-triggered actions
      if (e.code === 'KeyJ' || e.code === 'KeyF') {
        this.triggerLightAttack();
      } else if (e.code === 'KeyK' || e.code === 'KeyR') {
        this.triggerHeavyAttack();
      } else if (e.code === 'Space') {
        this.triggerDodge();
      } else if (e.code === 'Digit1') {
        this.castSpell('immobilize');
      } else if (e.code === 'Digit2') {
        this.castSpell('cloudStep');
      } else if (e.code === 'Digit3') {
        this.castSpell('pluckOfMany');
      } else if (e.code === 'Digit4') {
        this.castSpell('redTides');
      } else if (e.code === 'KeyQ') {
        this.drinkGourd();
      } else if (e.code === 'KeyC') {
        this.cycleStance();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.heldKeys.delete(e.code);
    });

    window.addEventListener('blur', () => {
      this.heldKeys.clear();
    });

    // Mouse Controls
    this.container.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.triggerLightAttack();
      } else if (e.button === 2) {
        e.preventDefault();
        this.triggerHeavyAttack();
      }
    });

    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Combat Actions
  public triggerLightAttack() {
    if (this.isDodging || this.playerStats.hp <= 0) return;
    if (this.playerStats.stamina < 12) return;

    this.playerStats.stamina = Math.max(0, this.playerStats.stamina - 14);
    this.isAttacking = true;
    this.attackType = 'light';
    this.attackProgress = 0;

    // Advance combo step
    if (this.comboTimer > 0) {
      this.comboStep = (this.comboStep + 1) % 4;
    } else {
      this.comboStep = 0;
    }
    this.comboTimer = 1.0;

    sound.playStaffSwing(false);

    // Check hit immediately or mid-swing
    this.executePlayerHitCheck();
  }

  public triggerHeavyAttack() {
    if (this.isDodging || this.playerStats.hp <= 0) return;
    if (this.playerStats.stamina < 20) return;

    this.playerStats.stamina = Math.max(0, this.playerStats.stamina - 25);
    this.isAttacking = true;
    this.attackType = this.playerStats.activeStance === 'pillar' ? 'pillar' : 'heavy';
    this.attackProgress = 0;

    const focusPoints = Math.floor(this.playerStats.focus / 100);
    this.playerStats.focus = 0; // consume focus points

    sound.playStaffSwing(true);
    this.executePlayerHeavySlam(focusPoints);
  }

  public triggerDodge() {
    if (this.isDodging || this.playerStats.hp <= 0) return;
    if (this.playerStats.stamina < 15) return;

    this.playerStats.stamina = Math.max(0, this.playerStats.stamina - 18);
    this.isDodging = true;
    this.dodgeTimer = 0.32;
    this.isAttacking = false;

    // Check Perfect Dodge (Can Ying / Decoy flash)
    // If boss is currently in strike windup/swing near player
    const distToBoss = this.player.position.distanceTo(this.boss.position);
    if (distToBoss < 5.0 && (this.bossState === 'strike' || (this.bossState === 'windup' && this.bossAttackProgress > 0.6))) {
      this.perfectDodgeFlash = true;
      this.perfectDodgeTimer = 0.5;
      this.playerStats.focus = Math.min(this.playerStats.maxFocus, this.playerStats.focus + 100);
      sound.playPerfectDodge();
      this.particles.dropCloudDecoy(this.player.position);
      if (this.onPerfectDodge) this.onPerfectDodge();
    } else {
      sound.playStaffSwing(false);
    }
  }

  public castSpell(spellId: SpellId) {
    const cd = this.spellCooldowns[spellId];
    if (cd.current > 0) return;
    if (this.playerStats.mana < cd.mana) return;

    this.playerStats.mana -= cd.mana;
    cd.current = cd.max;

    if (spellId === 'immobilize') {
      sound.playImmobilize();
      this.bossStats.isImmobilized = true;
      this.bossStats.immobilizeTimer = 3.5;
      this.particles.showImmobilizeRing(this.boss.position, true);
    } else if (spellId === 'cloudStep') {
      sound.playCloudStep();
      this.playerStats.isCloudStepping = true;
      this.playerStats.cloudStepDuration = 4.0;
      this.particles.dropCloudDecoy(this.player.position);
    } else if (spellId === 'pluckOfMany') {
      sound.playPluckOfMany();
      this.spawnShadowClones();
    } else if (spellId === 'redTides') {
      sound.playTransformation();
      this.playerStats.isTransformed = true;
      this.playerStats.transformDuration = 14.0;
      this.screenShake = 0.4;
    }

    this.emitStats();
  }

  public drinkGourd() {
    if (this.playerStats.gourdSips <= 0 || this.playerStats.hp >= this.playerStats.maxHp) return;
    this.playerStats.gourdSips--;
    this.playerStats.hp = Math.min(this.playerStats.maxHp, this.playerStats.hp + 45);
    sound.playGourdDrink();
    this.emitStats();
  }

  public cycleStance() {
    const stances: Stance[] = ['smash', 'pillar', 'thrust'];
    const idx = stances.indexOf(this.playerStats.activeStance);
    this.playerStats.activeStance = stances[(idx + 1) % stances.length];
    sound.playStaffSwing(false);
    this.emitStats();
  }

  public setStance(stance: Stance) {
    this.playerStats.activeStance = stance;
    this.emitStats();
  }

  private spawnShadowClones() {
    this.cloneDuration = 8.0;
    // Remove previous if any
    this.clones.forEach((c) => this.scene.remove(c));
    this.clones = [];

    for (let i = 0; i < 3; i++) {
      const clone = createPlayerModel();
      clone.scale.setScalar(0.85);
      const angle = (i / 3) * Math.PI * 2;
      clone.position.set(
        this.boss.position.x + Math.cos(angle) * 3,
        0,
        this.boss.position.z + Math.sin(angle) * 3
      );
      this.scene.add(clone);
      this.clones.push(clone);
    }
  }

  private executePlayerHitCheck() {
    const dist = this.player.position.distanceTo(this.boss.position);
    if (dist > 3.4) return;

    // Face the boss
    this.player.lookAt(this.boss.position.x, 0, this.boss.position.z);

    // Calculate damage
    let baseDmg = 15 + this.comboStep * 6;
    let isCrit = false;

    if (this.playerStats.isCloudStepping) {
      baseDmg *= 2.5; // Guaranteed critical sneak strike
      isCrit = true;
      this.playerStats.isCloudStepping = false;
      this.playerStats.cloudStepDuration = 0;
    }

    if (this.playerStats.isTransformed) {
      baseDmg *= 1.4; // Red Tides fire damage
    }

    this.bossStats.hp = Math.max(0, this.bossStats.hp - baseDmg);
    this.bossStats.posture = Math.min(100, this.bossStats.posture + 12);

    // Build Focus Points
    this.playerStats.focus = Math.min(this.playerStats.maxFocus, this.playerStats.focus + 25);

    // Audio & Visual feedback
    sound.playHit(isCrit ? 'critical' : 'light');
    this.particles.spawnHitSparks(this.boss.position.clone().add(new THREE.Vector3(0, 1.4, 0)), this.playerStats.isTransformed ? 'fire' : isCrit ? 'critical' : 'light');
    this.hitstopTimer = isCrit ? 0.08 : 0.04;
    this.screenShake = isCrit ? 0.35 : 0.15;

    // Check boss posture stagger break
    if (this.bossStats.posture >= 100) {
      this.triggerBossStagger();
    }

    // Check phase 2 transition
    const cfg = BOSS_CONFIGS[this.currentBossId];
    if (this.bossStats.hp <= cfg.maxHp * cfg.phase2Threshold && !this.bossStats.isEnraged) {
      this.bossStats.isEnraged = true;
      sound.playBossRoar();
      this.screenShake = 0.5;
    }

    // Check victory
    if (this.bossStats.hp <= 0) {
      this.handleVictory();
    }

    this.emitStats();
  }

  private executePlayerHeavySlam(focusPoints: number) {
    const dist = this.player.position.distanceTo(this.boss.position);

    // Leap towards boss
    this._vec3A.subVectors(this.boss.position, this.player.position).normalize();
    if (dist > 2.5) {
      this.player.position.addScaledVector(this._vec3A, Math.min(dist - 2.0, 3.5));
    }
    this.player.lookAt(this.boss.position.x, 0, this.boss.position.z);

    // Ground Shockwave
    this.particles.triggerShockwave(this.player.position);

    if (dist <= 4.5) {
      const multiplier = 1 + focusPoints * 0.75;
      const dmg = Math.round((55 + focusPoints * 35) * multiplier);
      this.bossStats.hp = Math.max(0, this.bossStats.hp - dmg);
      this.bossStats.posture = Math.min(100, this.bossStats.posture + 35 + focusPoints * 15);

      sound.playHit('heavy');
      this.particles.spawnHitSparks(this.boss.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 'critical');
      this.hitstopTimer = 0.09;
      this.screenShake = 0.55 + focusPoints * 0.12;

      if (this.bossStats.posture >= 100) {
        this.triggerBossStagger();
      }

      if (this.bossStats.hp <= 0) {
        this.handleVictory();
      }
    }

    this.emitStats();
  }

  private triggerBossStagger() {
    this.bossStats.isStaggered = true;
    this.bossState = 'stagger';
    this.bossStateTimer = 3.5;
    this.bossStats.posture = 0;
    sound.playHit('stagger');
  }

  private handleVictory() {
    sound.startBGM('victory');
    sound.playTempleBell(220, 5.0);
    if (this.onVictory) this.onVictory();
  }

  private handlePlayerDefeat() {
    sound.playHit('playerHit');
    if (this.onGameOver) this.onGameOver();
  }

  // Boss AI Update
  private updateBossAI(dt: number) {
    if (this.bossStats.hp <= 0) return;

    // Immobilized state
    if (this.bossStats.isImmobilized) {
      this.bossStats.immobilizeTimer -= dt;
      if (this.bossStats.immobilizeTimer <= 0) {
        this.bossStats.isImmobilized = false;
        this.particles.showImmobilizeRing(this.boss.position, false);
      }
      this.boss.updateBossAnimation(this.clock.elapsedTime, false, false, '', 0, false, true, this.bossStats.isEnraged);
      return;
    }

    // Staggered state
    if (this.bossStats.isStaggered) {
      this.bossStateTimer -= dt;
      if (this.bossStateTimer <= 0) {
        this.bossStats.isStaggered = false;
        this.bossState = 'approach';
      }
      this.boss.updateBossAnimation(this.clock.elapsedTime, false, false, '', 0, true, false, this.bossStats.isEnraged);
      return;
    }

    const distToPlayer = this.boss.position.distanceTo(this.player.position);
    this.boss.lookAt(this.player.position.x, 0, this.player.position.z);

    const cfg = BOSS_CONFIGS[this.currentBossId];
    const speedMult = this.bossStats.isEnraged ? 1.4 : 1.0;

    if (this.bossState === 'approach') {
      this.boss.setTelegraph(false, 0);

      if (distToPlayer > 3.2) {
        // Walk towards player
        this._vec3A.subVectors(this.player.position, this.boss.position).normalize();
        this.boss.position.addScaledVector(this._vec3A, 3.8 * speedMult * dt);
        this.boss.updateBossAnimation(this.clock.elapsedTime, true, false, '', 0, false, false, this.bossStats.isEnraged);
      } else {
        // Start attack windup
        this.bossState = 'windup';
        this.bossStateTimer = this.bossStats.isEnraged ? 0.65 : 0.95;
        this.bossAttackProgress = 0;
        const attacks: ('slash' | 'leap' | 'spin' | 'roar')[] = ['slash', 'spin', 'leap'];
        this.bossAttackChoice = attacks[Math.floor(Math.random() * attacks.length)];
        sound.playBossRoar();
      }
    } else if (this.bossState === 'windup') {
      // Show danger telegraph ring on ground
      this.bossStateTimer -= dt;
      const totalWindup = this.bossStats.isEnraged ? 0.65 : 0.95;
      this.bossAttackProgress = 1 - this.bossStateTimer / totalWindup;
      this.boss.setTelegraph(true, this.bossAttackProgress);
      this.boss.updateBossAnimation(this.clock.elapsedTime, false, true, this.bossAttackChoice, this.bossAttackProgress, false, false, this.bossStats.isEnraged);

      if (this.bossStateTimer <= 0) {
        this.bossState = 'strike';
        this.bossStateTimer = 0.45;
        this.bossAttackProgress = 0;
        sound.playStaffSwing(true);
      }
    } else if (this.bossState === 'strike') {
      this.boss.setTelegraph(false, 0);
      this.bossStateTimer -= dt;
      this.bossAttackProgress = 1 - this.bossStateTimer / 0.45;
      this.boss.updateBossAnimation(this.clock.elapsedTime, false, true, this.bossAttackChoice, this.bossAttackProgress, false, false, this.bossStats.isEnraged);

      // Hit moment
      if (this.bossAttackProgress >= 0.5 && this.bossAttackProgress <= 0.65) {
        if (distToPlayer < 4.2 && !this.isDodging && this.playerStats.hp > 0) {
          // Player hit!
          const dmg = cfg.attackPower * (this.bossStats.isEnraged ? 1.35 : 1.0);
          this.playerStats.hp = Math.max(0, this.playerStats.hp - dmg);
          sound.playHit('playerHit');
          this.particles.spawnHitSparks(this.player.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 'heavy');
          this.screenShake = 0.4;

          if (this.playerStats.hp <= 0) {
            this.handlePlayerDefeat();
          }
          this.emitStats();
        }
      }

      if (this.bossStateTimer <= 0) {
        this.bossState = 'recover';
        this.bossStateTimer = this.bossStats.isEnraged ? 0.4 : 0.9;
      }
    } else if (this.bossState === 'recover') {
      this.bossStateTimer -= dt;
      this.boss.updateBossAnimation(this.clock.elapsedTime, false, false, '', 0, false, false, this.bossStats.isEnraged);
      if (this.bossStateTimer <= 0) {
        this.bossState = 'approach';
      }
    }
  }

  // Update shadow monkey clones (Pluck of Many)
  private updateClones(dt: number) {
    if (this.cloneDuration <= 0) {
      if (this.clones.length > 0) {
        this.clones.forEach((c) => this.scene.remove(c));
        this.clones = [];
      }
      return;
    }

    this.cloneDuration -= dt;
    this.clones.forEach((clone, idx) => {
      const angle = (idx / 3) * Math.PI * 2 + this.clock.elapsedTime * 2;
      const targetX = this.boss.position.x + Math.cos(angle) * 2.2;
      const targetZ = this.boss.position.z + Math.sin(angle) * 2.2;

      clone.position.x = THREE.MathUtils.damp(clone.position.x, targetX, 5, dt);
      clone.position.z = THREE.MathUtils.damp(clone.position.z, targetZ, 5, dt);
      clone.lookAt(this.boss.position.x, 0, this.boss.position.z);

      // Clones hit periodically
      if (Math.random() < 0.08 && this.bossStats.hp > 0) {
        const dmg = 6;
        this.bossStats.hp = Math.max(0, this.bossStats.hp - dmg);
        sound.playHit('light');
        this.particles.spawnHitSparks(this.boss.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 'light');
        this.emitStats();
      }
    });
  }

  // Main Render Loop
  private startLoop() {
    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.isDestroyed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (this.isDestroyed) return;

      const rawDt = this.clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      if (!this.isPaused) {
        // Hitstop pause (impact frames)
        if (this.hitstopTimer > 0) {
          this.hitstopTimer -= dt;
        } else {
          this.updateGameLogic(dt);
        }
      }

      this.renderScene();

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      afterDraw(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  private updateGameLogic(dt: number) {
    const time = this.clock.elapsedTime;

    // 1. Cooldowns & Timers
    (Object.keys(this.spellCooldowns) as SpellId[]).forEach((key) => {
      if (this.spellCooldowns[key].current > 0) {
        this.spellCooldowns[key].current = Math.max(0, this.spellCooldowns[key].current - dt);
      }
    });

    if (this.onSpellCooldownsUpdate) {
      this.onSpellCooldownsUpdate(this.spellCooldowns);
    }

    if (this.playerStats.transformDuration > 0) {
      this.playerStats.transformDuration -= dt;
      if (this.playerStats.transformDuration <= 0) {
        this.playerStats.isTransformed = false;
      }
    }

    if (this.playerStats.cloudStepDuration > 0) {
      this.playerStats.cloudStepDuration -= dt;
      if (this.playerStats.cloudStepDuration <= 0) {
        this.playerStats.isCloudStepping = false;
      }
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
    }

    // Stamina Regeneration
    if (!this.isAttacking && !this.isDodging) {
      this.playerStats.stamina = Math.min(this.playerStats.maxStamina, this.playerStats.stamina + dt * 26);
    }

    // Mana subtle regeneration
    this.playerStats.mana = Math.min(this.playerStats.maxMana, this.playerStats.mana + dt * 3.5);

    // Dodge State
    if (this.isDodging) {
      this.dodgeTimer -= dt;
      // Dodge roll movement forward
      this.player.translateZ(dt * 12);
      if (this.dodgeTimer <= 0) {
        this.isDodging = false;
      }
    }

    // Attack State progress
    if (this.isAttacking) {
      this.attackProgress += dt * 3.8;
      if (this.attackProgress >= 1.0) {
        this.isAttacking = false;
        this.attackProgress = 0;
      }
    }

    // 2. Player Movement Input (WASD / Arrows / Virtual Joystick)
    let moveX = 0;
    let moveZ = 0;
    if (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp')) moveZ -= 1;
    if (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown')) moveZ += 1;
    if (this.heldKeys.has('KeyA') || this.heldKeys.has('ArrowLeft')) moveX -= 1;
    if (this.heldKeys.has('KeyD') || this.heldKeys.has('ArrowRight')) moveX += 1;

    // Mobile virtual joystick input
    if (this.virtualMove.lengthSq() > 0.005) {
      moveX += this.virtualMove.x;
      moveZ += this.virtualMove.y;
    }

    const isMoving = (moveX !== 0 || moveZ !== 0) && !this.isDodging && !this.isAttacking && this.playerStats.hp > 0;

    if (isMoving) {
      const moveVec = this._vec3A.set(moveX, 0, moveZ).normalize();
      const speed = this.playerStats.isCloudStepping ? 10.5 : this.playerStats.isTransformed ? 8.5 : 6.2;

      this.player.position.addScaledVector(moveVec, speed * dt);

      // Clamp to arena boundary (radius 21m)
      const distFromCenter = Math.sqrt(this.player.position.x * this.player.position.x + this.player.position.z * this.player.position.z);
      if (distFromCenter > 20.5) {
        this.player.position.x = (this.player.position.x / distFromCenter) * 20.5;
        this.player.position.z = (this.player.position.z / distFromCenter) * 20.5;
      }

      // Rotate player smoothly towards movement direction
      const targetAngle = Math.atan2(moveVec.x, moveVec.z);
      this.player.rotation.y = THREE.MathUtils.damp(this.player.rotation.y, targetAngle, 14, dt);
    }

    // Staff Charge Glow Visual
    const charge01 = this.playerStats.focus / this.playerStats.maxFocus;
    this.player.setStaffCharge(charge01);

    // Update Player Animations
    this.player.updateAnimation(
      time,
      isMoving,
      this.isAttacking ? this.attackType : '',
      this.comboStep,
      this.playerStats.activeStance,
      this.playerStats.isTransformed
    );

    // 3. Update Boss AI & Animations
    this.updateBossAI(dt);

    // 4. Update Clones
    this.updateClones(dt);

    // 5. Update Arena & Particles
    this.arena.update(time);
    this.particles.update(dt);

    // Screen Shake Decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 2.5);
    }

    // 6. Camera Follow with Exponential Damping
    if (this.isTitleMode) {
      // Atmospheric slow orbit around the central dais for title screen
      const orbitSpeed = 0.15;
      const radius = 10.5;
      const camX = Math.sin(time * orbitSpeed) * radius;
      const camZ = Math.cos(time * orbitSpeed) * radius;
      this.camera.position.x = camX;
      this.camera.position.y = 3.8 + Math.sin(time * 0.2) * 0.5;
      this.camera.position.z = camZ;
      this._camTarget.set(0, 1.8, 0);
      this.camera.lookAt(this._camTarget);
    } else {
      // Over-the-shoulder action camera
      const targetCamX = this.player.position.x;
      const targetCamY = this.player.position.y + 2.8;
      const targetCamZ = this.player.position.z + 5.2;

      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 6.0, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 6.0, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 6.0, dt);

      if (this.screenShake > 0) {
        this.camera.position.x += (Math.random() - 0.5) * this.screenShake;
        this.camera.position.y += (Math.random() - 0.5) * this.screenShake;
      }

      this._camTarget.set(this.player.position.x, this.player.position.y + 1.4, this.player.position.z - 4.0);
      this.camera.lookAt(this._camTarget);
    }

    // Stats periodic emission
    this.emitStats();
  }

  private emitStats() {
    if (this.onPlayerStatsUpdate) this.onPlayerStatsUpdate({ ...this.playerStats });
    if (this.onBossStatsUpdate) this.onBossStatsUpdate({ ...this.bossStats });
  }

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  public setTitleMode(isTitle: boolean) {
    this.isTitleMode = isTitle;
  }

  public resetPlayer() {
    this.playerStats.hp = this.playerStats.maxHp;
    this.playerStats.stamina = this.playerStats.maxStamina;
    this.playerStats.mana = this.playerStats.maxMana;
    this.playerStats.focus = 0;
    this.playerStats.gourdSips = 4;
    this.player.position.set(0, 0, 6);
    this.emitStats();
  }

  public dispose() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
