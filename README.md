# 🐒 Black Myth: Destined One — 3D Action RPG

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Google Play](https://img.shields.io/badge/Google_Play-TWA_Ready-34a853?style=for-the-badge&logo=googleplay&logoColor=white)](https://play.google.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

> *"Five centuries ago, the Havoc in Heaven was nothing but a destined gambit orchestrated by Mount Ling and the Celestial Court. Five centuries later, the Golden Fillet is reborn, setting you on an inevitable path against heaven to seek the truth. Reclaim the name of Wukong that was erased from existence!"*

---

## 📖 Overview

**Black Myth: Destined One** is an immersive, high-octane 3D Action RPG built directly for the modern web with **Three.js**, **React 19**, and **TypeScript**. Players step into the sandals of the **Destined One**, wielding the mythical *Ruyi Jingu Bang*, shifting between three martial stances, unleashing ancient Taoist spells, and challenging fearsome boss trials across dark mythological realms.

The application features full **mobile touch controls**, responsive responsive HUD, high-performance WebGL graphics, and full **Progressive Web App (PWA)** capabilities ready for deployment to the **Google Play Store** via Trusted Web Activities (TWA).

---

## ✨ Key Features

### ⚔️ Deep Combat Mechanics
- **4-Hit Light Attack Combo**: Fluid martial arts sequences with escalating damage scaling.
- **3 Dynamic Staff Stances**:
  - 💥 **Smash Stance**: Overpowering downward overhead strikes.
  - 🏛️ **Pillar Stance**: High-ground evasive staff climbing into a crushing drop.
  - ⚡ **Thrust Stance**: Rapid long-range piercing thrusts.
- **4-Tier Focus Gauge**: Build focus orbs through aggressive engagement to unleash devastating charged heavy attacks.
- **Perfect Dodge (Afterimage Evasion)**: Millisecond-precision dodges leave a translucent spirit decoy behind, grant invulnerability frames, and restore stamina.
- **Stagger & Posture Breakdown**: Relentless assaults deplete the boss's poise bar, triggering a dazed vulnerable state for critical punish damage.
- **Healing Gourd**: Replenish vitality during battle with up to 5 restorative sips.

### 🔮 4 Mystical Taoist Spells
| Spell | Lore | Combat Effect |
| :--- | :--- | :--- |
| **Immobilize** | Golden incantation talisman | Freezes target in time, creating an open window for high-damage stance strikes. |
| **Cloud Step** | Vanish into white mist | Leaves a decoy decoy, grants invisibility, and guarantees a 2.5× critical backstab. |
| **Pluck of Many** | Hair plucked from the Great Sage | Summons golden spirit doppelgängers that swarm the battlefield and pressure the boss. |
| **Red Tides** | Fire Transformation | Transforms into the fiery wolf monk wielding a twin-bladed staff with 1.4× fire damage. |

### 👹 4 Epic Boss Trials
1. **Guangzhi (Monk of the Red Tides)** — Wields a twin-headed flaming spear, dashing across the arena with relentless fire spin combos.
2. **Tiger Vanguard (Guardian of the Blood Pool)** — Ferocious beast monk executing lethal blood claw combos, jumping ground slams, and projectile shockwaves.
3. **Yellow Wind Sage (Master of Samadhi Wind)** — Wields the celestial pitchfork and summons swirling sandstorms and blinding gusts.
4. **White Clothed Noble (Poet of the Marsh)** — Elegant dual-phase aquatic swordsman delivering rapid thrusts and deceptive water reflections.

---

## 🎮 Controls Reference

### 💻 Desktop (Keyboard & Mouse)
| Action | Key / Input |
| :--- | :--- |
| **Movement** | `W`, `A`, `S`, `D` |
| **Light Attack Combo** | `Left Click` or `J` |
| **Heavy Stance Attack** | `Right Click` or `K` |
| **Perfect Dodge** | `Spacebar` |
| **Jump** | `F` |
| **Cycle Stances (Smash / Pillar / Thrust)** | `Z` |
| **Sip Healing Gourd** | `Q` |
| **Cast Spell 1 (Immobilize)** | `1` |
| **Cast Spell 2 (Cloud Step)** | `2` |
| **Cast Spell 3 (Pluck of Many)** | `3` |
| **Cast Spell 4 (Red Tides)** | `4` |

### 📱 Mobile & Tablet (Touch Controls)
- **Virtual Analog Joystick**: Bottom-left thumb area for omnidirectional 360° locomotion.
- **Action Cluster (Bottom-Right)**: Dedicated buttons for Attack, Dodge, Heavy Strike, Jump, and Healing Gourd.
- **Elevated HUD Panel**: Focus orbs and 4 Spells are strategically positioned above the touch cluster to ensure zero thumb occlusion.

---

## 🛠️ Architecture & Tech Stack

```text
├── src/
│   ├── components/            # UI overlay & HUD components
│   │   ├── BossSelector.tsx   # Boss arena selection modal
│   │   ├── CodexModal.tsx     # Shadow God Index & lore encyclopedia
│   │   ├── GameHUD.tsx        # Health, Stamina, Boss bar, Focus orbs, Spells
│   │   ├── PauseModal.tsx     # Game pause & audio volume settings
│   │   ├── TitleScreen.tsx    # Cinematic entry screen & narrative intro
│   │   └── TouchControls.tsx  # Responsive virtual joystick & action buttons
│   ├── game/                  # 3D WebGL engine & game state
│   │   ├── combatRules.ts     # Pure mathematical combat calculation models
│   │   ├── combatRules.test.ts# Node.js automated unit test suite
│   │   ├── threeScene.ts      # Three.js render loop, camera, lighting, arena
│   │   └── entities/          # Player, Boss AI state machines, Spells, Particles
│   ├── types/                 # TypeScript interfaces and enum definitions
│   ├── App.tsx                # Primary game state controller
│   └── main.tsx               # React 19 entry point
├── public/                    # Web App Manifest & App Icons
│   ├── icon.svg               # Golden Fillet & Staff SVG emblem
│   └── manifest.json          # PWA configuration for Android & Stores
└── tests/                     # Test definitions
```

- **Frontend Framework**: React 19 + TypeScript
- **3D Graphics Engine**: Three.js (WebGL rendering with custom shaders, dynamic shadows, volumetric lighting, and particle effects)
- **Styling**: Tailwind CSS v4 (Mobile-first responsive HUD)
- **State Management**: React Hooks + requestAnimationFrame authoritative loop
- **Unit Testing**: Native Node.js test runner (`node:test` via `tsx`)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20 or higher)
- [npm](https://www.npmjs.com/) (version 10 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/black-myth-destined-one.git

# Navigate to the project directory
cd black-myth-destined-one

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to start playing.

### Run Unit Tests
```bash
npm test
```
Executes all automated combat calculations (damage scaling, posture thresholds, perfect dodge timings, and spell cooldowns).

### Production Build
```bash
npm run build
```
Creates an optimized, tree-shaken production bundle in the `dist/` directory.

---

## 📲 Packaging for Google Play Store (TWA)

This game includes a fully compliant `manifest.json` and high-resolution icons ready for **Trusted Web Activity (TWA)** packaging:

1. Visit **[PWABuilder.com](https://www.pwabuilder.com)**.
2. Enter your deployed URL.
3. Select **Package for Stores ➔ Android**.
4. Configure your package name (e.g., `com.blackmyth.destinedone`).
5. Download your signed **`.aab`** file.
6. Upload the `.aab` file to **[Google Play Console](https://play.google.com/console)** to publish worldwide.

---

## 📜 Lore & Mythological Background

Five centuries after Sun Wukong's tragic rebellion against the Heavenly Court, you awaken as the Destined One. Clad in the remnants of the Golden Fillet, you must journey across the Three Realms—from the miasma of **Black Wind Mountain** to the arid dunes of **Yellow Wind Ridge**—confronting former companions and celestial monarchs to reforge the fragmented will of the Great Sage Equal to Heaven.

---

## 📄 License

This project is licensed under the Apache License 2.0. See the `LICENSE` file for details.
