import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../services/audioService';
import { useGame } from '../context/GameContext';
import { KeyRound, RotateCw, X, Award, ShieldAlert } from 'lucide-react';
import confetti from '../utils/confetti';

interface LockpickProps {
  onClose: () => void;
}

export const LockpickMinigame: React.FC<LockpickProps> = ({ onClose }) => {
  const { claimLockpickReward } = useGame();

  const [pickAngle, setPickAngle] = useState<number>(0);
  const [cylinderAngle, setCylinderAngle] = useState<number>(0);
  const [sweetSpot, setSweetSpot] = useState<number>(() => Math.floor(Math.random() * 120 - 60));
  const [sweetTolerance] = useState<number>(14);
  const [bobbyPins, setBobbyPins] = useState<number>(3);
  const [isTurning, setIsTurning] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [lockJammed, setLockJammed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTurning || isUnlocked) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    deg = Math.max(-85, Math.min(85, deg + 90));
    setPickAngle(deg);
  };

  useEffect(() => {
    let animFrame: number;

    if (isTurning && !isUnlocked && !lockJammed) {
      const distFromSweetSpot = Math.abs(pickAngle - sweetSpot);
      const maxTurn = Math.max(0, 90 - (distFromSweetSpot / sweetTolerance) * 90);

      setCylinderAngle(prev => {
        const next = prev + 3;
        if (next >= 88 && distFromSweetSpot <= sweetTolerance) {
          setIsUnlocked(true);
          soundManager.playSSRReveal();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          claimLockpickReward(450, [
            { id: 'lingote_oro', amount: 1 },
            { id: 'amatista', amount: 1 },
            { id: 'frasco_xp', amount: 2 }
          ]);
          return 90;
        }

        if (next > maxTurn) {
          setLockJammed(true);
          soundManager.playSound('/assets/audio/hurt3.wav', 0.8);
          setTimeout(() => {
            setBobbyPins(p => p - 1);
            setLockJammed(false);
            setCylinderAngle(0);
            setIsTurning(false);
          }, 400);
          return maxTurn;
        }

        return next;
      });

      animFrame = requestAnimationFrame(() => {});
    } else if (!isTurning && cylinderAngle > 0 && !isUnlocked) {
      setCylinderAngle(prev => Math.max(0, prev - 6));
    }

    return () => cancelAnimationFrame(animFrame);
  }, [isTurning, pickAngle, sweetSpot, sweetTolerance, isUnlocked, lockJammed, claimLockpickReward]);

  const handleStartTurning = () => {
    if (bobbyPins <= 0 || isUnlocked || lockJammed) return;
    soundManager.playSound('/assets/audio/blip2.wav', 0.5);
    setIsTurning(true);
  };

  const handleStopTurning = () => {
    setIsTurning(false);
  };

  const handleNewLock = () => {
    setSweetSpot(Math.floor(Math.random() * 120 - 60));
    setPickAngle(0);
    setCylinderAngle(0);
    setIsUnlocked(false);
    setLockJammed(false);
    setBobbyPins(3);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-stone-900 border-2 border-amber-600/70 rounded-2xl p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-300 font-serif">
              Desvalijar la Mansión Loux
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Mueve el cursor para alinear la ganzúa en el ángulo correcto. Mantén presionado &quot;Girar Cerrojo&quot; para forzar la cerradura. Si la ganzúa tiembla, ¡suelta antes de partirla!
          </p>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="w-full h-72 bg-gradient-to-b from-stone-950 to-stone-900 rounded-xl border border-stone-800 relative flex items-center justify-center overflow-hidden cursor-crosshair select-none"
        >
          <div className="w-48 h-48 rounded-full border-8 border-amber-900/80 bg-stone-900 shadow-2xl flex items-center justify-center relative">
            <div
              className={`w-32 h-32 rounded-full border-4 border-amber-600 bg-stone-950 flex items-center justify-center shadow-inner transition-transform duration-75 relative ${
                lockJammed ? 'animate-shake ring-2 ring-red-500' : ''
              }`}
              style={{ transform: `rotate(${cylinderAngle}deg)` }}
            >
              <div className="w-3.5 h-12 bg-stone-950 border border-stone-700 rounded-sm shadow-inner relative flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-stone-900 border border-stone-700 -mt-1" />
              </div>
            </div>

            <div
              className="absolute pointer-events-none w-1 h-36 origin-bottom -top-12 transition-transform duration-75 flex flex-col items-center"
              style={{
                transform: `rotate(${pickAngle}deg)`,
                left: 'calc(50% - 2px)'
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] -top-1" />
              <div className="w-1 flex-1 bg-gradient-to-b from-amber-400 via-stone-300 to-stone-500 rounded-t" />
            </div>
          </div>

          {lockJammed && (
            <div className="absolute top-4 text-xs font-bold text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-700 flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
              <span>¡GANZÚA ATASCADA!</span>
            </div>
          )}

          {isUnlocked && (
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
              <Award className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
              <h4 className="text-2xl font-black text-amber-300 font-serif">
                ¡CERRADURA ABIERTA!
              </h4>
              <p className="text-xs text-stone-300 mt-1">
                Botín conseguido: +450 Oro, +1 Lingote de Oro, +1 Amatista, +2 Frascos de XP y +3 Cristales de Memoria.
              </p>
              <button
                onClick={handleNewLock}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Forzar Otro Cofre
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-stone-300 font-mono">
            Ganzúas restantes:{' '}
            <span className="font-bold text-amber-400">{bobbyPins} / 3</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onMouseDown={handleStartTurning}
              onMouseUp={handleStopTurning}
              onTouchStart={handleStartTurning}
              onTouchEnd={handleStopTurning}
              disabled={isUnlocked || bobbyPins <= 0}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow flex items-center gap-2 select-none disabled:opacity-40"
            >
              <RotateCw className="w-4 h-4" />
              <span>GIRAR CERROJO (MANTENER)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
