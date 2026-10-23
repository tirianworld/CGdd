import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TAVERN_DIALOGUES } from '../data/gameData';
import { LockpickMinigame } from './LockpickMinigame';
import { soundManager } from '../services/audioService';
import {
  Flame,
  UtensilsCrossed,
  KeyRound,
  ChevronRight,
  Beer
} from 'lucide-react';

export const TavernView: React.FC = () => {
  const {
    tapBonfire,
    sparks,
    inventory,
    cookDish
  } = useGame();

  const [activeDialogueIdx, setActiveDialogueIdx] = useState<number>(0);
  const [showLockpick, setShowLockpick] = useState<boolean>(false);
  const [showKitchen, setShowKitchen] = useState<boolean>(false);

  const currentDialogue = TAVERN_DIALOGUES[activeDialogueIdx];

  const handleNextDialogue = () => {
    soundManager.playClick();
    setActiveDialogueIdx(prev => (prev + 1) % TAVERN_DIALOGUES.length);
  };

  const panQty = inventory.find(i => i.id === 'pan')?.quantity || 0;
  const ajoQty = inventory.find(i => i.id === 'ajo')?.quantity || 0;
  const quesoQty = inventory.find(i => i.id === 'queso')?.quantity || 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div
        className="relative rounded-2xl overflow-hidden border-2 border-amber-600/70 shadow-2xl bg-stone-950 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-4 sm:p-7 bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/backgrounds/taverna_fondo.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/50" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-300 text-xs font-semibold mb-1 shadow">
              <Beer className="w-3.5 h-3.5 text-amber-400" />
              <span>TABERNA CALDO DE DRAGÓN</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-serif drop-shadow-md">
              Posada de Icespear
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 drop-shadow max-w-lg mt-0.5">
              Refugio de aventureros, mercenarios del Mercado Negro y la ilustre hermandad de Pepe Loux.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowKitchen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900/90 border border-amber-600/60 hover:bg-amber-950/80 text-amber-200 text-xs font-bold transition-all shadow"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Cocina & Banquetes</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowLockpick(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900/90 border border-amber-600/60 hover:bg-amber-950/80 text-amber-200 text-xs font-bold transition-all shadow"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Forzar Mansión Loux</span>
            </button>
          </div>
        </div>

        <div className="relative z-10 my-auto text-center py-4">
          <div
            onClick={tapBonfire}
            className="cursor-pointer inline-flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-24 h-24 rounded-full bg-orange-600/20 border-2 border-orange-500/60 flex items-center justify-center shadow-[0_0_35px_rgba(234,88,12,0.4)] group-hover:border-orange-400 group-hover:bg-orange-600/30">
              <Flame className="w-12 h-12 text-orange-400 animate-pulse group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-bold text-amber-300 mt-2 bg-stone-950/80 px-3 py-1 rounded-full border border-amber-700/60">
              ¡Toca la Hoguera! (+5 Oro & Chispas)
            </span>
            {sparks > 0 && (
              <span className="text-[10px] text-stone-400 font-mono mt-1">
                Chispas acumuladas: {sparks}
              </span>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-stone-950/90 border-2 border-amber-700/60 rounded-xl p-3 sm:p-4 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-amber-500/80 bg-stone-900 flex-shrink-0 shadow">
            <img
              src={currentDialogue.portrait}
              alt={currentDialogue.speaker}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-amber-300 font-serif">
                {currentDialogue.speaker}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {activeDialogueIdx + 1} / {TAVERN_DIALOGUES.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-snug">
              &quot;{currentDialogue.text}&quot;
            </p>
          </div>

          <button
            onClick={handleNextDialogue}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <Beer className="w-4 h-4 text-amber-400" />
          <span>Parroquianos y Clientes Habituales</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/80 flex items-center gap-3 shadow">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-600/50 bg-stone-950 flex-shrink-0">
              <img src="/assets/portraits/pepe_loux.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-200">Pepe Loux</h4>
              <p className="text-[11px] text-stone-400">
                Apurando su jarra en el taburete. Siempre listo para defender la taberna con su remo.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/80 flex items-center gap-3 shadow">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-600/50 bg-stone-950 flex-shrink-0">
              <img src="/assets/portraits/magordito.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-200">Magordito</h4>
              <p className="text-[11px] text-stone-400">
                Saboreando panecillos y consultando grimorios de nigromancia aplicada.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/80 flex items-center gap-3 shadow">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-600/50 bg-stone-950 flex-shrink-0">
              <img src="/assets/portraits/giovani_vazquez_icono.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-200">Giovani Vázquez</h4>
              <p className="text-[11px] text-stone-400">
                Observando a la clientela con su pipa encendida. Conoce los secretos de la ciudadela.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showKitchen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-600/70 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-amber-300 text-lg">Fogones y Cocina de la Taberna</h3>
              </div>
              <button
                onClick={() => setShowKitchen(false)}
                className="text-stone-400 hover:text-stone-200 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Cocina platos sustanciosos con ingredientes para otorgar bendiciones a tus héroes en combate.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-stone-800 bg-stone-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/items/panes_de_ajo.png" alt="" className="w-10 h-10 object-contain" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-amber-200">Pan de Ajo Crujiente</h4>
                    <p className="text-[11px] text-stone-400">+15% Ataque en el siguiente combate.</p>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      Ingredientes: Pan ({panQty}/1), Ajo ({ajoQty}/1)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => cookDish('pan_ajo')}
                  disabled={panQty < 1 || ajoQty < 1}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs disabled:opacity-40"
                >
                  Cocinar
                </button>
              </div>

              <div className="p-3 rounded-xl border border-stone-800 bg-stone-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/items/hamburguesa.png" alt="" className="w-10 h-10 object-contain" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-amber-200">Hamburguesa Loux Deluxe</h4>
                    <p className="text-[11px] text-stone-400">+25% Ataque & +20% Vida Máxima.</p>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      Ingredientes: Pan ({panQty}/2), Queso ({quesoQty}/1)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => cookDish('hamburguesa')}
                  disabled={panQty < 2 || quesoQty < 1}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs disabled:opacity-40"
                >
                  Cocinar
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowKitchen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs"
            >
              Cerrar Fogones
            </button>
          </div>
        </div>
      )}

      {showLockpick && (
        <LockpickMinigame onClose={() => setShowLockpick(false)} />
      )}
    </div>
  );
};
