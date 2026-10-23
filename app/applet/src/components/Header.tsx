import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../services/audioService';
import { Volume2, VolumeX, Music, RotateCcw, Sparkles, Coins, Gem } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    playerName,
    gold,
    memoryCrystals,
    astralShards,
    sparks,
    resetGameData,
    activeBuff
  } = useGame();

  const [bgmActive, setBgmActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleBgm = () => {
    const active = soundManager.toggleBGM();
    setBgmActive(active);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <header className="bg-stone-950/90 border-b border-amber-900/60 shadow-lg text-amber-100 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-amber-500/80 bg-stone-900 overflow-hidden shadow-inner flex items-center justify-center p-0.5">
            <img
              src="/assets/portraits/pepe_loux.png"
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-amber-300 tracking-wide">{playerName}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-950/90 border border-amber-600/50 rounded text-amber-200">
                Lvl 12
              </span>
            </div>
            <div className="text-[11px] text-stone-400 font-serif flex items-center gap-1.5">
              <span>Cofradía Caldo de Dragón</span>
              {activeBuff && (
                <span className="text-emerald-400 text-[10px] bg-emerald-950/80 px-1 rounded border border-emerald-700/50">
                  🍖 {activeBuff.name} (+{activeBuff.atkPercent}% ATK)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-sm">
          <div
            title="Oro: para mejoras, forja y subir de nivel"
            className="flex items-center gap-1.5 bg-stone-900/90 border border-amber-600/40 px-2.5 py-1 rounded-md shadow-sm"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-amber-200">{gold.toLocaleString()}</span>
          </div>

          <div
            title="Cristales de Memoria: necesarios para invocar en los banners del Gacha"
            className="flex items-center gap-1.5 bg-stone-900/90 border border-cyan-500/40 px-2.5 py-1 rounded-md shadow-sm"
          >
            <Gem className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-cyan-200">{memoryCrystals.toLocaleString()}</span>
          </div>

          <div
            title="Fragmentos Astrales: moneda premium para ascensión y tienda especial"
            className="flex items-center gap-1.5 bg-stone-900/90 border border-purple-500/40 px-2.5 py-1 rounded-md shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-mono font-bold text-purple-200">{astralShards.toLocaleString()}</span>
          </div>

          {sparks > 0 && (
            <div
              title="Chispas mágicas de la hoguera"
              className="hidden sm:flex items-center gap-1.5 bg-stone-900/90 border border-orange-500/40 px-2.5 py-1 rounded-md shadow-sm"
            >
              <span className="text-orange-400 text-xs">🔥</span>
              <span className="font-mono font-semibold text-orange-200">{sparks}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleBgm}
            title={bgmActive ? 'Pausar música ambiental (Blades of the Astral Gate)' : 'Reproducir música ambiental'}
            className={`p-2 rounded-md border transition-all ${
              bgmActive
                ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Activar efectos de sonido' : 'Silenciar efectos'}
            className={`p-2 rounded-md border transition-all ${
              isMuted
                ? 'bg-red-950/40 border-red-700 text-red-400'
                : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={resetGameData}
            title="Reiniciar datos guardados"
            className="p-2 rounded-md bg-stone-900 border border-stone-700 text-stone-400 hover:text-red-400 hover:border-red-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
