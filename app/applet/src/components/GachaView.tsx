import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GACHA_BANNERS } from '../data/gameData';
import { GachaPullResult } from '../types/game';
import { soundManager } from '../services/audioService';
import confetti from '../utils/confetti';
import { Sparkles, Info, Gem, X, RotateCcw } from 'lucide-react';

export const GachaView: React.FC = () => {
  const {
    memoryCrystals,
    gachaPity,
    pullGacha,
    addMemoryCrystals
  } = useGame();

  const [activeBannerId, setActiveBannerId] = useState<string>('mercado_negro');
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [pullResults, setPullResults] = useState<GachaPullResult[] | null>(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);

  const activeBanner = GACHA_BANNERS.find(b => b.id === activeBannerId) || GACHA_BANNERS[0];
  const pitySteps = gachaPity[activeBanner.id] || 0;

  const handleSummon = (count: 1 | 11) => {
    const cost = count === 1 ? activeBanner.costSingle : activeBanner.costMulti;
    if (memoryCrystals < cost) {
      alert(`No tienes suficientes Cristales de Memoria (${cost} necesarios). ¡Puedes conseguir más en Patrullas, Combate o la Taberna!`);
      return;
    }

    setIsSummoning(true);
    setFlippedCards(new Array(count).fill(false));

    setTimeout(() => {
      const results = pullGacha(activeBanner.id, count);
      setPullResults(results);
      setIsSummoning(false);

      const hasSSR = results.some(r => r.hero.rarity === 'SSR');
      if (hasSSR) {
        soundManager.playSSRReveal();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        soundManager.playSummonReveal();
      }
    }, 1200);
  };

  const handleFlipCard = (index: number) => {
    if (flippedCards[index]) return;
    soundManager.playClick();
    const updated = [...flippedCards];
    updated[index] = true;
    setFlippedCards(updated);

    if (pullResults && pullResults[index]?.hero.rarity === 'SSR') {
      soundManager.playSSRReveal();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleFlipAll = () => {
    soundManager.playSSRReveal();
    if (pullResults) {
      setFlippedCards(new Array(pullResults.length).fill(true));
      const hasSSR = pullResults.some(r => r.hero.rarity === 'SSR');
      if (hasSSR) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const closeResults = () => {
    soundManager.playClick();
    setPullResults(null);
    setFlippedCards([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Banner Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {GACHA_BANNERS.map(banner => {
          const isSelected = banner.id === activeBannerId;
          const steps = gachaPity[banner.id] || 0;

          return (
            <button
              key={banner.id}
              onClick={() => {
                soundManager.playClick();
                setActiveBannerId(banner.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-amber-500 bg-stone-900/90 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/50'
                  : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 hover:bg-stone-900/40 text-stone-400'
              }`}
            >
              <div
                className="absolute inset-0 opacity-15 bg-cover bg-center transition-transform group-hover:scale-105 pointer-events-none"
                style={{ backgroundImage: `url(${banner.bannerImage})` }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-amber-300' : 'text-stone-300'}`}>
                    {banner.name}
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-950/80 border border-stone-700 text-stone-300">
                    Pity: {steps}/900
                  </span>
                </div>
                <p className="text-xs text-stone-400 line-clamp-1">{banner.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Banner Showcase */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-600/60 shadow-2xl bg-stone-950 min-h-[420px] flex flex-col justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${activeBanner.bannerImage})`,
            filter: 'brightness(0.55)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/30" />

        {/* Top Info Bar */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-300 text-xs font-semibold mb-2 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BANNER DESTACADO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 drop-shadow-md">
              {activeBanner.name}
            </h2>
            <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-xl mt-1 drop-shadow">
              {activeBanner.subtitle}
            </p>
            <p className="text-xs text-stone-300 max-w-lg mt-2 drop-shadow-sm hidden sm:block">
              {activeBanner.description}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowRatesModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/90 border border-stone-700 text-stone-300 hover:text-amber-300 hover:border-amber-500 text-xs transition-all shadow"
          >
            <Info className="w-4 h-4" />
            <span>Probabilidades y Pity</span>
          </button>
        </div>

        {/* Bottom Action Bar */}
        <div className="relative z-10 p-5 sm:p-7 bg-gradient-to-t from-stone-950/95 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pity Progress */}
          <div className="w-full sm:w-auto bg-stone-900/80 border border-amber-900/60 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-stone-300 mb-1 gap-4">
              <span>Pasos acumulados:</span>
              <span className="font-mono font-bold text-amber-400">{pitySteps} / 900</span>
            </div>
            <div className="w-full sm:w-64 h-2.5 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-300"
                style={{ width: `${Math.min(100, (pitySteps / 900) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Soft Pity: 300</span>
              <span>Garantizado: 900</span>
            </div>
          </div>

          {/* Summon Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleSummon(1)}
              disabled={isSummoning}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-900 border border-amber-500/60 hover:bg-stone-800 hover:border-amber-400 text-amber-200 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <span>1x Invocar</span>
              <div className="flex items-center gap-1 text-xs text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/50">
                <Gem className="w-3.5 h-3.5" />
                <span>3</span>
              </div>
            </button>

            <button
              onClick={() => handleSummon(11)}
              disabled={isSummoning}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-base shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>11x Invocar</span>
              <div className="flex items-center gap-1 text-xs text-stone-950 font-bold bg-amber-300/80 px-2 py-0.5 rounded">
                <Gem className="w-3.5 h-3.5" />
                <span>30</span>
              </div>
            </button>
          </div>
        </div>

        {/* Summoning portal animation overlay */}
        {isSummoning && (
          <div className="absolute inset-0 z-30 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
            <p className="mt-4 text-amber-300 font-bold text-lg tracking-wider animate-pulse font-serif">
              CANALIZANDO EL ASTRAL GATE...
            </p>
          </div>
        )}
      </div>

      {/* Bonus crystals button */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
        <span>¿Te has quedado sin cristales? Puedes reclamar una dotación de prueba de la orden para seguir invocando.</span>
        <button
          onClick={() => {
            soundManager.playCoin();
            addMemoryCrystals(30);
          }}
          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-cyan-300 font-semibold border border-cyan-600/40 transition-colors flex items-center gap-1.5"
        >
          <Gem className="w-3.5 h-3.5 text-cyan-400" />
          <span>+30 Cristales de Prueba</span>
        </button>
      </div>

      {/* Modal: Pull Results */}
      {pullResults && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-amber-300 font-serif">
                  Resultado de la Invocación
                </h2>
                <p className="text-xs sm:text-sm text-stone-400">
                  Toca las cartas para revelarlas o presiona &quot;Revelar Todos&quot;
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFlipAll}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow"
                >
                  Revelar Todos
                </button>
                <button
                  onClick={closeResults}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {pullResults.map((res, idx) => {
                const isFlipped = flippedCards[idx];
                const hero = res.hero;

                return (
                  <div
                    key={idx}
                    onClick={() => handleFlipCard(idx)}
                    className={`cursor-pointer aspect-[3/4.2] rounded-xl relative transition-all duration-300 transform perspective-1000 ${
                      !isFlipped ? 'hover:scale-105 active:scale-95' : ''
                    }`}
                  >
                    {!isFlipped ? (
                      <div className="w-full h-full rounded-xl border-2 border-amber-600/70 bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/60 p-2 flex flex-col items-center justify-between shadow-xl">
                        <div className="w-full text-center text-[10px] font-mono text-amber-500/70">
                          CDD GACHA 2
                        </div>
                        <div className="w-14 h-14 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-stone-900/80 shadow-inner">
                          <Sparkles className="w-7 h-7 text-amber-400/80 animate-pulse" />
                        </div>
                        <span className="text-[10px] text-stone-400 font-semibold tracking-wider">
                          TOCAR
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`w-full h-full rounded-xl border-2 p-2 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all ${
                          hero.rarity === 'SSR'
                            ? 'border-amber-400 bg-gradient-to-b from-stone-900 to-amber-950/80 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
                            : hero.rarity === 'SR'
                            ? 'border-purple-500 bg-gradient-to-b from-stone-900 to-purple-950/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'border-cyan-600 bg-gradient-to-b from-stone-900 to-cyan-950/40'
                        }`}
                      >
                        <div className="flex items-center justify-between z-10">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-black font-mono shadow ${
                              hero.rarity === 'SSR'
                                ? 'bg-amber-400 text-stone-950'
                                : hero.rarity === 'SR'
                                ? 'bg-purple-500 text-stone-950'
                                : 'bg-cyan-500 text-stone-950'
                            }`}
                          >
                            {hero.rarity}
                          </span>
                          {res.isNew ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-stone-950 animate-pulse">
                              ¡NUEVO!
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                              DUPLICADO
                            </span>
                          )}
                        </div>

                        <div className="my-auto w-full aspect-square rounded-lg overflow-hidden border border-stone-700/80 bg-stone-950 relative">
                          <img
                            src={hero.portrait}
                            alt={hero.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="z-10 text-center">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-100 truncate">
                            {hero.name}
                          </h4>
                          <p className="text-[10px] text-stone-400 truncate">
                            {hero.heroClass} • {hero.attribute}
                          </p>
                          {!res.isNew && (
                            <div className="text-[9px] text-amber-300 font-mono mt-0.5">
                              +{res.duplicateHeroCoins} Monedas Héroe
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  handleSummon(pullResults.length === 1 ? 1 : 11);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Invocar de Nuevo ({pullResults.length === 1 ? '1x' : '11x'})</span>
              </button>
              <button
                onClick={closeResults}
                className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rates Info */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-600/60 rounded-2xl p-6 space-y-4 shadow-2xl text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-amber-300">Tasas de Invocación y Pity</h3>
              <button
                onClick={() => setShowRatesModal(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <h4 className="font-bold text-amber-400 mb-1">Probabilidades Base:</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-600/40">
                    <div className="font-bold text-amber-300 text-base">3.0%</div>
                    <div className="text-stone-400">SSR</div>
                  </div>
                  <div className="p-2 rounded bg-purple-950/40 border border-purple-600/40">
                    <div className="font-bold text-purple-300 text-base">37.0%</div>
                    <div className="text-stone-400">SR</div>
                  </div>
                  <div className="p-2 rounded bg-cyan-950/40 border border-cyan-600/40">
                    <div className="font-bold text-cyan-300 text-base">60.0%</div>
                    <div className="text-stone-400">R</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300">
                <p>
                  <strong className="text-amber-300">Sistema de Pity (Pasos):</strong> Cada invocación suma 1 paso al contador del banner activo.
                </p>
                <p>
                  <strong className="text-amber-300">Soft Pity (300 pasos):</strong> A partir de 300 pasos sin conseguir un SSR, la probabilidad de SSR aumenta al 15%. A partir de 800 pasos aumenta al 50%.
                </p>
                <p>
                  <strong className="text-amber-300">Hard Pity (900 pasos):</strong> Al alcanzar 900 pasos, la siguiente invocación tiene garantía 100% de otorgar un héroe SSR.
                </p>
                <p>
                  <strong className="text-amber-300">Héroes Duplicados:</strong> Al obtener un personaje que ya tienes desbloqueado, se convertirá automáticamente en <strong>Monedas de Héroe</strong> (para subir estrellas y despertar atributos) y <strong>Fragmentos Astrales</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRatesModal(false)}
              className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
