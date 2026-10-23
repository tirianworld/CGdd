import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PATROL_MISSIONS } from '../data/gameData';
import { PatrolMission } from '../types/game';
import { soundManager } from '../services/audioService';
import {
  Compass,
  Clock,
  Coins,
  CheckCircle,
  Play,
  Gift
} from 'lucide-react';

export const PatrolView: React.FC = () => {
  const {
    heroes,
    activePatrols,
    constantPatrolMeter,
    dispatchPatrol,
    claimPatrolRewards,
    claimConstantPatrol
  } = useGame();

  const [selectedMission, setSelectedMission] = useState<PatrolMission | null>(null);
  const [selectedHeroIds, setSelectedHeroIds] = useState<number[]>([]);

  const handleOpenDispatch = (mission: PatrolMission) => {
    soundManager.playClick();
    setSelectedMission(mission);
    const available = heroes
      .filter(h => h.isUnlocked && h.stamina >= mission.staminaCost)
      .slice(0, mission.requiredHeroes)
      .map(h => h.id);
    setSelectedHeroIds(available);
  };

  const handleToggleHeroSelection = (heroId: number) => {
    soundManager.playClick();
    if (selectedHeroIds.includes(heroId)) {
      setSelectedHeroIds(prev => prev.filter(id => id !== heroId));
    } else {
      if (selectedMission && selectedHeroIds.length >= selectedMission.requiredHeroes) {
        return;
      }
      setSelectedHeroIds(prev => [...prev, heroId]);
    }
  };

  const handleConfirmDispatch = () => {
    if (!selectedMission) return;
    const success = dispatchPatrol(selectedMission, selectedHeroIds);
    if (success) {
      setSelectedMission(null);
      setSelectedHeroIds([]);
    } else {
      alert('No se pudo enviar la patrulla. Verifica que tus héroes tengan suficiente aguante y no superes el límite de 3 patrullas simultáneas.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div className="bg-gradient-to-r from-stone-900 via-stone-900/90 to-amber-950/60 border border-amber-600/60 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-amber-200">
              Patrulla Continua de la Hermandad (Recompensa Inactiva)
            </h3>
          </div>
          <p className="text-xs text-stone-400 max-w-xl">
            Tus centinelas exploran los alrededores de forma constante acumulando oro y gemas del recuerdo cada segundo.
          </p>
          <div className="w-full sm:w-80 h-3 bg-stone-950 rounded-full overflow-hidden border border-stone-700 mt-2">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-300"
              style={{ width: `${Math.round(constantPatrolMeter * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>Progreso: {Math.round(constantPatrolMeter * 100)}%</span>
            <span>
              {constantPatrolMeter >= 0.2 ? '¡Listo para reclamar!' : 'Acumulando...'}
            </span>
          </div>
        </div>

        <button
          onClick={claimConstantPatrol}
          disabled={constantPatrolMeter < 0.2}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Coins className="w-4 h-4" />
          <span>Cobrar Recompensa Inactiva</span>
        </button>
      </div>

      {activePatrols.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Patrullas en Curso ({activePatrols.length}/3)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePatrols.map(patrol => {
              const now = Date.now();
              const isFinished = now >= patrol.endTime;
              const remainingSec = Math.max(0, Math.ceil((patrol.endTime - now) / 1000));
              const totalSec = patrol.mission.durationSeconds;
              const progressPct = Math.min(100, Math.round(((totalSec - remainingSec) / totalSec) * 100));

              return (
                <div
                  key={patrol.slotId}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3 shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-amber-200">
                        {patrol.mission.name}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {isFinished ? '¡COMPLETADA!' : `${remainingSec}s`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">{patrol.mission.location}</p>

                    <div className="w-full h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800 mt-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFinished ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {patrol.assignedHeroIds.map(hid => {
                      const h = heroes.find(hero => hero.id === hid);
                      return (
                        <div
                          key={hid}
                          className="w-8 h-8 rounded-lg overflow-hidden border border-stone-700 bg-stone-950"
                        >
                          {h && <img src={h.portrait} alt="" className="w-full h-full object-cover" />}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => claimPatrolRewards(patrol.slotId)}
                    disabled={!isFinished}
                    className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 ${
                      isFinished
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 shadow'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isFinished ? 'Recoger Botín de Misión' : 'Explorando...'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Misiones de Patrulla Disponibles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PATROL_MISSIONS.map(mission => {
            const isDispatched = activePatrols.some(p => p.mission.id === mission.id);

            return (
              <div
                key={mission.id}
                className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-amber-200">{mission.name}</h4>
                      <p className="text-xs text-amber-500/90 font-medium">{mission.location}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-stone-300 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{mission.durationSeconds}s</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 mt-2">{mission.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs mt-3 bg-stone-950/60 p-2.5 rounded-xl border border-stone-850">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Requisitos:</span>
                      <span className="text-stone-200 font-semibold">
                        {mission.requiredHeroes} Héroes • -{mission.staminaCost} Aguante
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Recompensas Estimadas:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        +{mission.rewardGold} Oro • +{mission.rewardXp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenDispatch(mission)}
                  disabled={isDispatched || activePatrols.length >= 3}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Play className="w-4 h-4" />
                  <span>
                    {isDispatched ? 'Misión ya en curso' : 'Seleccionar Escuadra y Desplegar'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-600/70 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-bold text-amber-300 text-base">
                  Asignar Escuadra a: {selectedMission.name}
                </h3>
                <p className="text-xs text-stone-400">
                  Selecciona {selectedMission.requiredHeroes} héroes con al menos {selectedMission.staminaCost} de aguante.
                </p>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="text-stone-400 hover:text-stone-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
              {heroes
                .filter(h => h.isUnlocked)
                .map(hero => {
                  const isSelected = selectedHeroIds.includes(hero.id);
                  const hasStamina = hero.stamina >= selectedMission.staminaCost;

                  return (
                    <div
                      key={hero.id}
                      onClick={() => {
                        if (hasStamina) handleToggleHeroSelection(hero.id);
                      }}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/40 shadow'
                          : !hasStamina
                          ? 'opacity-40 border-stone-850 bg-stone-950 cursor-not-allowed'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-700 mb-1">
                        <img src={hero.portrait} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-[11px] text-stone-200 truncate w-full text-center">
                        {hero.name}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        ⚡ {hero.stamina}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-300 font-mono">
                Héroes asignados:{' '}
                <strong className="text-amber-400">
                  {selectedHeroIds.length} / {selectedMission.requiredHeroes}
                </strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMission(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDispatch}
                  disabled={selectedHeroIds.length < selectedMission.requiredHeroes}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs disabled:opacity-40"
                >
                  Enviar Patrulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
