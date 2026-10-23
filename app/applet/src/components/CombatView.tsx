import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { COMBAT_DUNGEONS } from '../data/gameData';
import { HeroSkill, Hero } from '../types/game';
import { soundManager } from '../services/audioService';
import confetti from '../utils/confetti';
import {
  Swords,
  Award,
  Skull
} from 'lucide-react';

interface CombatFighter {
  id: string;
  name: string;
  isEnemy: boolean;
  position: number;
  portrait: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  skills: HeroSkill[];
  statusEffects: { type: string; turns: number; power: number }[];
  heroRef?: Hero;
}

interface FloatingText {
  id: number;
  text: string;
  color: string;
  targetId: string;
}

export const CombatView: React.FC = () => {
  const {
    heroes,
    selectedHeroTeam,
    applyCombatVictory,
    activeBuff
  } = useGame();

  const [selectedDungeonId, setSelectedDungeonId] = useState<string>(COMBAT_DUNGEONS[0].id);
  const [inBattle, setInBattle] = useState(false);
  const [allies, setAllies] = useState<CombatFighter[]>([]);
  const [enemies, setEnemies] = useState<CombatFighter[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<HeroSkill | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [attackingUnitId, setAttackingUnitId] = useState<string | null>(null);
  const [targetUnitId, setTargetUnitId] = useState<string | null>(null);

  const activeDungeon = COMBAT_DUNGEONS.find(d => d.id === selectedDungeonId) || COMBAT_DUNGEONS[0];

  const spawnFloatingText = (text: string, color: string, targetId: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color, targetId }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 1200);
  };

  const startBattle = () => {
    soundManager.playSound('/assets/audio/powerup1.wav', 0.9);

    const teamHeroes: Hero[] = [];
    selectedHeroTeam.forEach(hid => {
      const h = heroes.find(hero => hero.id === hid);
      if (h && h.isUnlocked) teamHeroes.push(h);
    });

    if (teamHeroes.length === 0) {
      const unlocked = heroes.filter(h => h.isUnlocked).slice(0, 4);
      teamHeroes.push(...unlocked);
    }

    const initialAllies: CombatFighter[] = teamHeroes.map((h, idx) => {
      const atkMultiplier = activeBuff ? 1 + activeBuff.atkPercent / 100 : 1;
      return {
        id: `ally_${idx}_${h.id}`,
        name: h.name,
        isEnemy: false,
        position: idx,
        portrait: h.portrait,
        maxHp: h.maxHealth,
        currentHp: h.maxHealth,
        attack: Math.round(h.attack * atkMultiplier),
        defense: h.defense,
        skills: h.skills,
        statusEffects: [],
        heroRef: h
      };
    });

    const initialEnemies: CombatFighter[] = activeDungeon.enemies.map((e, idx) => ({
      id: `enemy_${idx}`,
      name: e.name,
      isEnemy: true,
      position: idx,
      portrait: e.portrait,
      maxHp: e.hp,
      currentHp: e.hp,
      attack: e.atk,
      defense: e.def,
      skills: e.skills,
      statusEffects: []
    }));

    setAllies(initialAllies);
    setEnemies(initialEnemies);
    setCurrentTurn(0);
    setSelectedSkill(initialAllies[0]?.skills[0] || null);
    setBattleLog([`¡Comienza la expedición en ${activeDungeon.name}! Prepárate para el combate.`]);
    setBattleResult(null);
    setInBattle(true);
  };

  const aliveAllies = allies.filter(a => a.currentHp > 0);
  const aliveEnemies = enemies.filter(e => e.currentHp > 0);

  useEffect(() => {
    if (!inBattle) return;

    if (aliveEnemies.length === 0 && enemies.length > 0) {
      setBattleResult('victory');
      soundManager.playSSRReveal();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      applyCombatVictory(
        activeDungeon.rewards.gold,
        activeDungeon.rewards.xp,
        activeDungeon.rewards.crystals,
        activeDungeon.rewards.guaranteedItems
      );
    } else if (aliveAllies.length === 0 && allies.length > 0) {
      setBattleResult('defeat');
      soundManager.playSound('/assets/audio/hurt2.wav', 0.8);
    }
  }, [allies, enemies, inBattle]);

  const executeSkill = (target: CombatFighter) => {
    if (!selectedSkill || battleResult) return;

    const currentFighter = aliveAllies[currentTurn % (aliveAllies.length || 1)];
    if (!currentFighter) return;

    if (!selectedSkill.usablePositions.includes(currentFighter.position)) {
      alert(`Esta habilidad solo puede ejecutarse desde las posiciones: ${selectedSkill.usablePositions.map(p => p + 1).join(', ')}`);
      return;
    }

    setAttackingUnitId(currentFighter.id);
    setTargetUnitId(target.id);

    if (selectedSkill.soundFx) {
      soundManager.playSound(selectedSkill.soundFx);
    } else {
      soundManager.playAttack();
    }

    setTimeout(() => {
      if (selectedSkill.targetType === 'single_ally' || selectedSkill.targetType === 'self' || selectedSkill.healAmount) {
        const healAmt = selectedSkill.healAmount || 30;
        setAllies(prev => prev.map(a => {
          if (a.id === target.id) {
            return { ...a, currentHp: Math.min(a.maxHp, a.currentHp + healAmt) };
          }
          return a;
        }));
        spawnFloatingText(`+${healAmt} HP`, 'text-emerald-400', target.id);
        setBattleLog(prev => [`${currentFighter.name} cura a ${target.name} por ${healAmt} puntos de salud.`, ...prev.slice(0, 6)]);
      } else {
        const rawDamage = selectedSkill.baseDamage + currentFighter.attack * selectedSkill.scalingAttack;
        const mitigated = Math.max(5, Math.round(rawDamage - target.defense * 0.5));
        const isCrit = Math.random() < 0.2;
        const finalDamage = isCrit ? Math.round(mitigated * 1.5) : mitigated;

        spawnFloatingText(isCrit ? `¡CRÍTICO! -${finalDamage}` : `-${finalDamage}`, isCrit ? 'text-amber-400 font-black' : 'text-red-400', target.id);
        soundManager.playHurt();

        if (selectedSkill.targetType === 'all_enemies') {
          setEnemies(prev => prev.map(e => ({
            ...e,
            currentHp: Math.max(0, e.currentHp - Math.round(finalDamage * 0.75))
          })));
          setBattleLog(prev => [`${currentFighter.name} ejecuta ${selectedSkill.name} dañando a todas las filas enemigas.`, ...prev.slice(0, 6)]);
        } else {
          setEnemies(prev => prev.map(e => {
            if (e.id === target.id) {
              return { ...e, currentHp: Math.max(0, e.currentHp - finalDamage) };
            }
            return e;
          }));
          setBattleLog(prev => [`${currentFighter.name} usa ${selectedSkill.name} e inflige ${finalDamage} daño a ${target.name}.`, ...prev.slice(0, 6)]);
        }
      }

      setAttackingUnitId(null);
      setTargetUnitId(null);

      setTimeout(() => {
        triggerEnemyTurns();
      }, 700);
    }, 400);
  };

  const triggerEnemyTurns = () => {
    const freshEnemies = enemies.filter(e => e.currentHp > 0);
    const freshAllies = allies.filter(a => a.currentHp > 0);

    if (freshEnemies.length === 0 || freshAllies.length === 0) return;

    const attacker = freshEnemies[Math.floor(Math.random() * freshEnemies.length)];
    const targetAlly = freshAllies[Math.floor(Math.random() * freshAllies.length)];

    setAttackingUnitId(attacker.id);
    setTargetUnitId(targetAlly.id);
    soundManager.playSound('/assets/audio/laser2.wav', 0.7);

    setTimeout(() => {
      const dmg = Math.max(5, Math.round(attacker.attack * 1.2 - targetAlly.defense * 0.5));
      spawnFloatingText(`-${dmg}`, 'text-red-500 font-bold', targetAlly.id);
      soundManager.playHurt();

      setAllies(prev => prev.map(a => {
        if (a.id === targetAlly.id) {
          return { ...a, currentHp: Math.max(0, a.currentHp - dmg) };
        }
        return a;
      }));

      setBattleLog(prev => [`${attacker.name} ataca ferozmente a ${targetAlly.name} por ${dmg} daño.`, ...prev.slice(0, 6)]);

      setAttackingUnitId(null);
      setTargetUnitId(null);

      setCurrentTurn(prev => prev + 1);
      const nextAlly = freshAllies[(currentTurn + 1) % freshAllies.length];
      if (nextAlly) {
        setSelectedSkill(nextAlly.skills[0] || null);
      }
    }, 500);
  };

  const activeAllyFighter = aliveAllies[currentTurn % (aliveAllies.length || 1)];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {!inBattle ? (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-200 font-serif">
              Expedición Táctica Darkest Dungeon
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Despliega tu escuadra de 4 héroes en combate por turnos posicional. Gestiona las líneas de frente y retaguardia para doblegar a monstruos y jefes míticos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMBAT_DUNGEONS.map(dungeon => {
              const isSelected = dungeon.id === selectedDungeonId;

              return (
                <div
                  key={dungeon.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedDungeonId(dungeon.id);
                  }}
                  className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all flex flex-col justify-between bg-stone-900/90 shadow-xl ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]'
                      : 'border-stone-800 hover:border-stone-700 opacity-90'
                  }`}
                >
                  <div
                    className="h-44 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${dungeon.background})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                          dungeon.difficulty === 'Pesadilla'
                            ? 'bg-red-600 text-stone-100'
                            : dungeon.difficulty === 'Media'
                            ? 'bg-amber-600 text-stone-950'
                            : 'bg-emerald-600 text-stone-950'
                        }`}
                      >
                        {dungeon.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-900/90 border border-stone-700 text-stone-300">
                        Nv. {dungeon.recommendedLevel}+
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-amber-200">{dungeon.name}</h3>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                        {dungeon.description}
                      </p>
                    </div>

                    <div className="border-t border-stone-800 pt-3 text-xs space-y-1">
                      <div className="font-semibold text-stone-300">Recompensas de Victoria:</div>
                      <div className="flex items-center justify-between text-amber-400 font-mono text-[11px]">
                        <span>+{dungeon.rewards.gold} Oro</span>
                        <span>+{dungeon.rewards.xp} XP</span>
                        <span className="text-cyan-400">+{dungeon.rewards.crystals} Cristales</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={startBattle}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-700 via-amber-600 to-amber-500 hover:from-red-600 hover:to-amber-400 text-stone-950 font-black text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center gap-3 mx-auto"
            >
              <Swords className="w-6 h-6" />
              <span>ENTRAR EN COMBATE (4v4)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">{activeDungeon.name}</span>
              <span className="text-stone-400">• Dificultad: {activeDungeon.difficulty}</span>
            </div>
            <button
              onClick={() => setInBattle(false)}
              className="text-stone-400 hover:text-red-400 font-semibold"
            >
              Abandonar Combate
            </button>
          </div>

          <div
            className="w-full min-h-[460px] rounded-2xl border-2 border-stone-800 bg-stone-950 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${activeDungeon.background})` }}
          >
            <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[1px]" />

            <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-12 my-auto items-center">
              <div className="flex items-center justify-end gap-2 sm:gap-4 flex-row-reverse">
                {allies.map((unit) => {
                  const isAlive = unit.currentHp > 0;
                  const isActiveTurn = activeAllyFighter?.id === unit.id;
                  const isAttacking = attackingUnitId === unit.id;
                  const isTarget = targetUnitId === unit.id;

                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        if (selectedSkill?.targetType === 'single_ally' || selectedSkill?.targetType === 'self') {
                          executeSkill(unit);
                        }
                      }}
                      className={`relative flex flex-col items-center transition-all duration-200 ${
                        !isAlive ? 'opacity-30 filter grayscale' : ''
                      } ${isAttacking ? 'translate-x-6 scale-110' : ''} ${
                        isTarget ? 'scale-95 ring-2 ring-red-500' : ''
                      }`}
                    >
                      {floatingTexts
                        .filter(ft => ft.targetId === unit.id)
                        .map(ft => (
                          <div
                            key={ft.id}
                            className={`absolute -top-8 text-sm font-black animate-bounce z-30 drop-shadow ${ft.color}`}
                          >
                            {ft.text}
                          </div>
                        ))}

                      {isActiveTurn && isAlive && (
                        <div className="w-3 h-3 bg-amber-400 rotate-45 mb-1 animate-bounce shadow" />
                      )}

                      <div
                        className={`w-14 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 bg-stone-950 shadow-xl relative ${
                          isActiveTurn
                            ? 'border-amber-400 ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                            : 'border-stone-700'
                        }`}
                      >
                        <img
                          src={unit.portrait}
                          alt={unit.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="absolute top-0 left-0 bg-stone-900/80 px-1 text-[9px] font-mono text-stone-300">
                          {unit.position + 1}
                        </div>
                      </div>

                      <div className="w-16 sm:w-22 text-center mt-1">
                        <div className="font-bold text-[10px] sm:text-xs text-stone-200 truncate">
                          {unit.name}
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-700 mt-0.5">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${Math.max(0, (unit.currentHp / unit.maxHp) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[9px] font-mono text-stone-400">
                          {unit.currentHp}/{unit.maxHp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-start gap-2 sm:gap-4">
                {enemies.map((unit) => {
                  const isAlive = unit.currentHp > 0;
                  const isAttacking = attackingUnitId === unit.id;
                  const isTarget = targetUnitId === unit.id;

                  return (
                    <div
                      key={unit.id}
                      onClick={() => {
                        if (isAlive && selectedSkill && selectedSkill.targetType !== 'single_ally' && selectedSkill.targetType !== 'self') {
                          executeSkill(unit);
                        }
                      }}
                      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                        !isAlive ? 'opacity-25 filter grayscale pointer-events-none' : 'hover:scale-105'
                      } ${isAttacking ? '-translate-x-6 scale-110' : ''} ${
                        isTarget ? 'scale-95 ring-2 ring-red-500' : ''
                      }`}
                    >
                      {floatingTexts
                        .filter(ft => ft.targetId === unit.id)
                        .map(ft => (
                          <div
                            key={ft.id}
                            className={`absolute -top-8 text-sm font-black animate-bounce z-30 drop-shadow ${ft.color}`}
                          >
                            {ft.text}
                          </div>
                        ))}

                      {isAlive && (
                        <div className="text-[9px] text-red-400 uppercase font-mono font-bold mb-0.5 opacity-80">
                          ATACAR
                        </div>
                      )}

                      <div className="w-14 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 border-red-700/80 bg-stone-950 shadow-xl relative hover:border-red-400">
                        <img
                          src={unit.portrait}
                          alt={unit.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="absolute top-0 right-0 bg-red-950/80 px-1 text-[9px] font-mono text-red-300">
                          {unit.position + 1}
                        </div>
                      </div>

                      <div className="w-16 sm:w-22 text-center mt-1">
                        <div className="font-bold text-[10px] sm:text-xs text-red-200 truncate">
                          {unit.name}
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-700 mt-0.5">
                          <div
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${Math.max(0, (unit.currentHp / unit.maxHp) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[9px] font-mono text-stone-400">
                          {unit.currentHp}/{unit.maxHp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 mt-4">
              <div className="md:col-span-7 bg-stone-950/90 border border-amber-900/60 rounded-xl p-3 backdrop-blur-md">
                <div className="text-xs font-bold text-amber-300 mb-2 flex items-center justify-between">
                  <span>Turno de: {activeAllyFighter?.name || 'Esperando...'}</span>
                  <span className="text-stone-400 text-[10px]">
                    Selecciona una habilidad y luego haz clic en el enemigo o aliado
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeAllyFighter?.skills.map((skill, skIdx) => {
                    const isSelected = selectedSkill?.name === skill.name;
                    const canUseFromPos = skill.usablePositions.includes(activeAllyFighter.position);

                    return (
                      <button
                        key={skIdx}
                        disabled={!canUseFromPos || !!battleResult}
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedSkill(skill);
                        }}
                        className={`p-2 rounded-lg border text-left flex items-start gap-2 transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/50 text-amber-200 font-bold shadow'
                            : !canUseFromPos
                            ? 'opacity-40 border-stone-850 bg-stone-900/40 text-stone-500 cursor-not-allowed'
                            : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <img
                          src={skill.icon || '/assets/skills/golpe_de_remo.png'}
                          alt=""
                          className="w-7 h-7 object-contain flex-shrink-0 rounded"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs truncate">{skill.name}</div>
                          <div className="text-[10px] text-stone-400 truncate">
                            {skill.baseDamage > 0 ? `${skill.baseDamage} Daño` : skill.healAmount ? `+${skill.healAmount} Cura` : 'Soporte'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-5 bg-stone-950/90 border border-stone-800 rounded-xl p-2.5 backdrop-blur-md flex flex-col justify-between">
                <div className="text-[11px] font-bold text-stone-400 mb-1">Registro de Combate:</div>
                <div className="space-y-1 text-[11px] text-stone-300 font-mono overflow-y-auto max-h-24">
                  {battleLog.map((log, lIdx) => (
                    <div key={lIdx} className="leading-tight opacity-90">
                      • {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {battleResult && (
              <div className="absolute inset-0 z-30 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                {battleResult === 'victory' ? (
                  <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-3xl font-black text-amber-300 font-serif">
                      ¡VICTORIA ÉPICA!
                    </h3>
                    <p className="text-xs text-stone-300">
                      Has derrotado a las fuerzas enemigas en {activeDungeon.name}.
                    </p>
                    <div className="bg-stone-900 border border-amber-600/50 p-3 rounded-xl grid grid-cols-3 gap-2 font-mono text-xs">
                      <div>
                        <div className="text-stone-400 text-[10px]">Oro</div>
                        <div className="text-amber-400 font-bold">+{activeDungeon.rewards.gold}</div>
                      </div>
                      <div>
                        <div className="text-stone-400 text-[10px]">XP Grupo</div>
                        <div className="text-emerald-400 font-bold">+{activeDungeon.rewards.xp}</div>
                      </div>
                      <div>
                        <div className="text-stone-400 text-[10px]">Cristales</div>
                        <div className="text-cyan-400 font-bold">+{activeDungeon.rewards.crystals}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setInBattle(false)}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-lg"
                    >
                      Continuar a la Ciudad
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-700 flex items-center justify-center mx-auto">
                      <Skull className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-3xl font-black text-red-400 font-serif">
                      DERROTA
                    </h3>
                    <p className="text-xs text-stone-400">
                      Tu escuadra ha caído ante la ferocidad enemiga. Mejora tus armas en la forja y sube el nivel de tus héroes.
                    </p>
                    <button
                      onClick={() => setInBattle(false)}
                      className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm border border-stone-700"
                    >
                      Regresar a la Taberna
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
