import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../services/audioService';
import { Anvil, Hammer, Shield, Sword, Heart } from 'lucide-react';

export const ForgeView: React.FC = () => {
  const {
    equipment,
    upgradeEquipment,
    gold,
    inventory,
    heroes
  } = useGame();

  const [selectedInstanceId, setSelectedInstanceId] = useState<string>(equipment[0]?.instanceId || '');

  const selectedEquip = equipment.find(e => e.instanceId === selectedInstanceId) || equipment[0];
  const goldCost = selectedEquip ? selectedEquip.level * 250 : 250;
  const mineralRequiredId = selectedEquip?.level && selectedEquip.level >= 5 ? 'lingote_plata' : 'lingote_cobre';
  const mineralItem = inventory.find(i => i.id === mineralRequiredId);
  const mineralQty = mineralItem?.quantity || 0;
  const canUpgrade = selectedEquip && selectedEquip.level < 10 && gold >= goldCost && mineralQty >= 1;

  const equippedHero = heroes.find(h => h.id === selectedEquip?.equippedToHeroId);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div
        className="rounded-2xl border-2 border-amber-600/60 overflow-hidden relative p-6 bg-cover bg-center shadow-xl flex flex-col justify-between min-h-[160px]"
        style={{ backgroundImage: `url('/assets/backgrounds/herreria_fondo_icespear.png')` }}
      >
        <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-300 text-xs font-semibold mb-2">
              <Anvil className="w-3.5 h-3.5 text-amber-400" />
              <span>HERRERÍA DE ICESPEAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 font-serif">
              Forja y Refinado de Equipamiento
            </h2>
            <p className="text-xs text-stone-300 max-w-lg mt-1">
              Mejora las hojas, armaduras y sortijas de tu equipo usando lingotes de mineral y monedas de oro.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider">
              Arsenal en Posesión ({equipment.length})
            </h3>
            <span className="text-xs text-stone-400">Selecciona una pieza para mejorar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {equipment.map(item => {
              const isSelected = item.instanceId === selectedEquip?.instanceId;
              const heroHolder = heroes.find(h => h.id === item.equippedToHeroId);

              return (
                <div
                  key={item.instanceId}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedInstanceId(item.instanceId);
                  }}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-stone-900 border border-stone-700 p-1 flex items-center justify-center flex-shrink-0">
                      <img src={item.icon} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-stone-100 flex items-center gap-1.5 truncate">
                        <span>{item.name}</span>
                        <span className="text-amber-400 font-mono text-[11px]">+{item.level}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        +{item.attack} ATK • +{item.defense} DEF • +{item.health} HP
                      </div>
                      <div className="text-[9px] text-amber-500 font-semibold mt-0.5">
                        {heroHolder ? `Equipado: ${heroHolder.name}` : 'En inventario'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedEquip && (
          <div className="lg:col-span-5 bg-stone-900/90 border border-amber-900/60 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-stone-950 border-2 border-amber-500 p-3 shadow-inner flex items-center justify-center mb-3">
                  <img src={selectedEquip.icon} alt="" className="max-w-full max-h-full object-contain" />
                </div>
                <h3 className="font-black text-xl text-amber-200 font-serif">
                  {selectedEquip.name}
                </h3>
                <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">
                  Nivel de Refinado: +{selectedEquip.level} / +10
                </p>
                {equippedHero && (
                  <p className="text-xs text-stone-400 mt-1">
                    Actualmente blandido por <strong>{equippedHero.name}</strong>
                  </p>
                )}
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2 text-xs">
                <div className="font-semibold text-stone-400 text-[10px] uppercase">
                  Incremento de Estadísticas al Siguiente Nivel:
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <Sword className="w-4 h-4 text-amber-400" />
                    <span>Ataque:</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-stone-400">{selectedEquip.attack}</span> →{' '}
                    <span className="text-emerald-400 font-bold">
                      {Math.round(selectedEquip.attack * 1.15)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Defensa:</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-stone-400">{selectedEquip.defense}</span> →{' '}
                    <span className="text-emerald-400 font-bold">
                      {Math.round(selectedEquip.defense * 1.15)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Salud:</span>
                  </div>
                  <div className="font-mono">
                    <span className="text-stone-400">{selectedEquip.health}</span> →{' '}
                    <span className="text-emerald-400 font-bold">
                      {Math.round(selectedEquip.health * 1.15)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-850 space-y-1.5 text-xs">
                <div className="text-stone-400 text-[10px] font-semibold uppercase">
                  Materiales Necesarios para Refinado:
                </div>
                <div className="flex items-center justify-between">
                  <span>Oro requerido:</span>
                  <span className={`font-mono font-bold ${gold >= goldCost ? 'text-amber-400' : 'text-red-400'}`}>
                    {goldCost} / {gold} Oro
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {selectedEquip.level >= 5 ? 'Lingote de Plata' : 'Lingote de Cobre'}:
                  </span>
                  <span className={`font-mono font-bold ${mineralQty >= 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                    1 / {mineralQty} en posesión
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => upgradeEquipment(selectedEquip.instanceId)}
              disabled={!canUpgrade}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-sm shadow flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Hammer className="w-4 h-4" />
              <span>
                {selectedEquip.level >= 10
                  ? 'REFINADO MÁXIMO ALCANZADO (+10)'
                  : `FORJAR MEJORA (+${selectedEquip.level + 1})`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
