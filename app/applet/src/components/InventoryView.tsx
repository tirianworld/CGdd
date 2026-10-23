import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { InventoryItem } from '../types/game';
import { soundManager } from '../services/audioService';
import { Briefcase, Coins, X } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    useItem,
    sellItem,
    heroes
  } = useGame();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedHeroForXp, setSelectedHeroForXp] = useState<number>(heroes[0]?.id || 5);

  const filteredItems = inventory.filter(item => {
    if (item.quantity <= 0) return false;
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'mineral' && item.category === 'mineral') return true;
    if (categoryFilter === 'gema' && item.category === 'gema') return true;
    if (categoryFilter === 'grimorio' && item.category === 'grimorio') return true;
    if (categoryFilter === 'consumible' && (item.category === 'comida' || item.category === 'xp' || item.category === 'ingrediente')) return true;
    if (categoryFilter === 'kit' && item.category === 'kit') return true;
    return false;
  });

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'mineral', label: 'Minerales' },
    { id: 'gema', label: 'Gemas' },
    { id: 'grimorio', label: 'Grimorios' },
    { id: 'consumible', label: 'Comidas y XP' },
    { id: 'kit', label: 'Kits Forja' }
  ];

  const handleUseItem = (item: InventoryItem) => {
    const success = useItem(item.id, selectedHeroForXp);
    if (success) {
      if (item.quantity <= 1) {
        setSelectedItem(null);
      }
    } else {
      alert('Este objeto no se puede consumir en este momento.');
    }
  };

  const handleSell = (item: InventoryItem) => {
    sellItem(item.id, 1);
    if (item.quantity <= 1) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div
        className="rounded-2xl border-2 border-amber-600/60 overflow-hidden relative p-6 bg-cover bg-center shadow-xl flex flex-col justify-between min-h-[140px]"
        style={{ backgroundImage: `url('/assets/backgrounds/fondo_inventario_app.png')` }}
      >
        <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-300 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>MOCHILA DE VIAJE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 font-serif">
              Inventario de Objetos y Botín
            </h2>
            <p className="text-xs text-stone-300 max-w-lg mt-1">
              Guarda tus gemas, lingotes de refinado, grimorios arcanos y suministros culinarios recolectados en tus viajes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              soundManager.playClick();
              setCategoryFilter(cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat.id
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredItems.map(item => {
          return (
            <div
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedItem(item);
              }}
              className="p-3 rounded-xl border border-stone-800 bg-stone-900/80 hover:border-amber-600/60 cursor-pointer flex flex-col justify-between aspect-square transition-all shadow hover:scale-[1.02] relative group"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-950 text-amber-400 border border-stone-800">
                  x{item.quantity}
                </span>
                <span className="text-[10px] font-bold text-stone-500 font-mono">
                  {item.rarity}
                </span>
              </div>

              <div className="w-14 h-14 mx-auto flex items-center justify-center p-1">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>

              <div className="text-center">
                <div className="font-bold text-xs text-stone-200 truncate">{item.name}</div>
                <div className="text-[10px] text-stone-400 font-mono">{item.sellPrice} Oro</div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-amber-600/70 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-amber-300 text-base">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-stone-950 border border-stone-800 p-2 flex items-center justify-center shadow-inner flex-shrink-0">
                <img src={selectedItem.icon} alt="" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  Cantidad en posesión:{' '}
                  <strong className="text-amber-400 font-mono">{selectedItem.quantity}</strong>
                </div>
                <div>
                  Categoría:{' '}
                  <span className="capitalize text-stone-300">{selectedItem.category}</span>
                </div>
                <div>
                  Precio de venta:{' '}
                  <span className="text-amber-400 font-mono">{selectedItem.sellPrice} Oro</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-850 leading-relaxed">
              {selectedItem.description}
            </p>

            {selectedItem.category === 'xp' && (
              <div className="space-y-1 text-xs">
                <label className="text-stone-400">Aplicar experiencia al héroe:</label>
                <select
                  value={selectedHeroForXp}
                  onChange={(e) => setSelectedHeroForXp(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-200 text-xs font-semibold"
                >
                  {heroes
                    .filter(h => h.isUnlocked)
                    .map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} (Nv. {h.level})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {(selectedItem.category === 'xp' || selectedItem.category === 'comida') && (
                <button
                  onClick={() => handleUseItem(selectedItem)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs sm:text-sm shadow"
                >
                  Consumir / Usar
                </button>
              )}

              <button
                onClick={() => handleSell(selectedItem)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 font-semibold text-xs sm:text-sm border border-stone-700 flex items-center justify-center gap-1.5"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Vender (+{selectedItem.sellPrice} Oro)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
