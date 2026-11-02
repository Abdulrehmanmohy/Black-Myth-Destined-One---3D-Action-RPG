/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine, BOSS_CONFIGS } from './game/threeScene';
import { BossId, BossStats, GameState, PlayerStats, SpellId, Stance } from './types/game';
import { sound } from './audio/soundEngine';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { PauseModal } from './components/PauseModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { CodexModal } from './components/CodexModal';
import { TouchControls } from './components/TouchControls';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Game UI State
  const [gameState, setGameState] = useState<GameState>('title');
  const [selectedBoss, setSelectedBoss] = useState<BossId>('guangzhi');
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [perfectDodgeFlash, setPerfectDodgeFlash] = useState<boolean>(false);

  // Combat Stats synced with Three.js engine
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    mana: 100,
    maxMana: 100,
    focus: 0,
    maxFocus: 400,
    gourdSips: 4,
    maxGourdSips: 4,
    activeStance: 'smash',
    isTransformed: false,
    transformDuration: 0,
    isCloudStepping: false,
    cloudStepDuration: 0,
  });

  const [bossStats, setBossStats] = useState<BossStats>({
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
  });

  const [spellCooldowns, setSpellCooldowns] = useState<Record<SpellId, { current: number; max: number; mana: number }>>({
    immobilize: { current: 0, max: 14, mana: 35 },
    cloudStep: { current: 0, max: 12, mana: 25 },
    pluckOfMany: { current: 0, max: 28, mana: 60 },
    redTides: { current: 0, max: 32, mana: 40 },
  });

  // Mount Three.js Engine once
  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new GameEngine(mountRef.current, selectedBoss);
    engineRef.current = engine;

    engine.onPlayerStatsUpdate = (stats) => {
      setPlayerStats(stats);
    };

    engine.onBossStatsUpdate = (stats) => {
      setBossStats(stats);
    };

    engine.onSpellCooldownsUpdate = (cds) => {
      setSpellCooldowns({ ...cds });
    };

    engine.onPerfectDodge = () => {
      setPerfectDodgeFlash(true);
      setTimeout(() => setPerfectDodgeFlash(false), 900);
    };

    engine.onVictory = () => {
      setGameState('victory');
    };

    engine.onGameOver = () => {
      setGameState('gameover');
    };

    // Check autostart query parameter on launch
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      engine.setTitleMode(false);
      setGameState('playing');
      sound.startBGM('combat');
    } else {
      sound.startBGM('title');
    }

    return () => {
      sound.stopBGM();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Keyboard shortcut for Escape / Pause and Title start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (isCodexOpen) {
          setIsCodexOpen(false);
          return;
        }
        if (gameState === 'playing') {
          setGameState('paused');
          engineRef.current?.setPaused(true);
        } else if (gameState === 'paused') {
          setGameState('playing');
          engineRef.current?.setPaused(false);
        }
        return;
      }

      if (gameState === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          handleStartGame(selectedBoss);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedBoss, isCodexOpen]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };


  // Game state handlers
  const handleStartGame = (bossId: BossId) => {
    setSelectedBoss(bossId);
    engineRef.current?.loadBoss(bossId);
    engineRef.current?.setTitleMode(false);
    engineRef.current?.setPaused(false);
    setGameState('playing');
    sound.startBGM('combat');
    sound.playTempleBell(140, 3.0);
  };

  const handleResume = () => {
    setGameState('playing');
    engineRef.current?.setPaused(false);
  };

  const handlePause = () => {
    setGameState('paused');
    engineRef.current?.setPaused(true);
  };

  const handleRestart = () => {
    engineRef.current?.loadBoss(selectedBoss);
    engineRef.current?.setTitleMode(false);
    engineRef.current?.setPaused(false);
    setGameState('playing');
    sound.startBGM('combat');
  };

  const handleReturnToTitle = () => {
    setGameState('title');
    engineRef.current?.setTitleMode(true);
    engineRef.current?.setPaused(false);
    sound.startBGM('title');
  };

  const handleNextBoss = () => {
    const bossOrder: BossId[] = ['guangzhi', 'tigerVanguard', 'yellowWind', 'whiteNoble'];
    const currentIdx = bossOrder.indexOf(selectedBoss);
    const nextBoss = bossOrder[(currentIdx + 1) % bossOrder.length];
    setSelectedBoss(nextBoss);
    handleStartGame(nextBoss);
  };

  // Combat Trigger helpers
  const handleSelectStance = (stance: Stance) => {
    engineRef.current?.setStance(stance);
  };

  const handleCastSpell = (spellId: SpellId) => {
    engineRef.current?.castSpell(spellId);
  };

  const handleDrinkGourd = () => {
    engineRef.current?.drinkGourd();
  };

  const handleAttack = () => {
    engineRef.current?.triggerLightAttack();
  };

  const handleHeavy = () => {
    engineRef.current?.triggerHeavyAttack();
  };

  const handleDodge = () => {
    engineRef.current?.triggerDodge();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Isolated Three.js WebGL Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />

      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenCodex={() => setIsCodexOpen(true)}
          selectedBoss={selectedBoss}
          onSelectBoss={(id) => {
            setSelectedBoss(id);
            engineRef.current?.loadBoss(id);
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* In-Game Combat HUD */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <GameHUD
            playerStats={playerStats}
            bossStats={bossStats}
            spellCooldowns={spellCooldowns}
            perfectDodgeFlash={perfectDodgeFlash}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={handlePause}
            onSelectStance={handleSelectStance}
            onCastSpell={handleCastSpell}
            onDrinkGourd={handleDrinkGourd}
            onAttack={handleAttack}
            onHeavy={handleHeavy}
            onDodge={handleDodge}
          />
          <TouchControls
            onMove={(x, y) => engineRef.current?.setVirtualJoystick(x, y)}
            onAttack={handleAttack}
            onHeavy={handleHeavy}
            onDodge={handleDodge}
            onDrinkGourd={handleDrinkGourd}
          />
        </>
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          currentBossId={selectedBoss}
          onResume={handleResume}
          onRestart={handleRestart}
          onReturnToTitle={handleReturnToTitle}
          onOpenCodex={() => setIsCodexOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          bossId={selectedBoss}
          onNextBoss={handleNextBoss}
          onRematch={handleRestart}
          onOpenCodex={() => setIsCodexOpen(true)}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          bossId={selectedBoss}
          onRespawn={handleRestart}
          onReturnToTitle={handleReturnToTitle}
          onOpenCodex={() => setIsCodexOpen(true)}
        />
      )}

      {/* Shadow God Index & Six Roots Codex */}
      {isCodexOpen && (
        <CodexModal onClose={() => setIsCodexOpen(false)} />
      )}
    </div>
  );
}
