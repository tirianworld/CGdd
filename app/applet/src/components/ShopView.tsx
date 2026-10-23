import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../services/audioService';
import { Store, Coins, Sparkles, ShoppingBag } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  category: string;
  costGold: number;
  costShards: number;
  icon: string;
  description: string;
}

export const ShopView: React.FC = () => {
  const {
    gold,
    astralShards,
    buyItem,
    addMemoryCrystals,
    spendGold
  } = useGame();

  const [activeTab, setActiveTab] = useState<'materiales' | 'gemas' | 'recursos' | 'grimorios'>('recursos');

  const shopCatalog: ShopItem[] = [
    {
      id: 'pack_cristales_10',
      name: 'Lote de 10 Cristales de Memoria',
      category: 'recursos',
      costGold: 1200,
      costShards: 0,
      icon: '/assets/items/orbe_experiencia.png',
      description: 'Cristales mágicos para invocar en los banners del Gacha.'
    },
    {
      id: 'pack_cristales_30',
      name: 'Gran Lote de 30 Cristales (1 Multi)',
      category: 'recursos',
      costGold: 3200,
      costShards: 0,
      icon: '/assets/items/orbe_experiencia.png',
      description: 'Suficiente para una tirada múltiple de 11 invocaciones.'
    },
    {
      id: 'frasco_xp',
      name: 'Frasco de XP',
      category: 'recursos',
      costGold: 80,
      costShards: 0,
      icon: '/assets/items/orbe_experiencia.png',
      description: 'Otorga 150 puntos de experiencia inmediata a un héroe.'
    },
    {
      id: 'orbe_experiencia',
      name: 'Orbe de Experiencia Mayor',
      category: 'recursos',
      costGold: 250,
      costShards: 0,
      icon: '/assets/items/orbe_experiencia.png',
      description: 'Otorga 600 puntos de XP inmediata a un héroe.'
    },
    {
      id: 'lingote_cobre',
      name: 'Lingote de Cobre',
      category: 'materiales',
      costGold: 50,
      costShards: 0,
      icon: '/assets/items/lingote_cobre_app.png',
      description: 'Metal básico para refinado inicial en la forja.'
    },
    {
      id: 'lingote_plata',
      name: 'Lingote de Plata',
      category: 'materiales',
      costGold: 140,
      costShards: 0,
      icon: '/assets/items/lingote_plata_app.png',
      description: 'Metal noble para equipo de nivel 5 o superior.'
    },
    {
      id: 'lingote_oro',
      name: 'Lingote de Oro',
      category: 'materiales',
      costGold: 280,
      costShards: 0,
      icon: '/assets/items/lingote_oro_app.png',
      description: 'Aleación dorada para forjar armas de élite.'
    },
    {
      id: 'lingote_mithrill',
      name: 'Lingote de Mithrill',
      category: 'materiales',
      costGold: 650,
      costShards: 50,
      icon: '/assets/items/lingote_mithrill_app.png',
      description: 'Metal legendario de resistencia incomparable.'
    },
    {
      id: 'lingote_netherita',
      name: 'Lingote de Netherita',
      category: 'materiales',
      costGold: 1200,
      costShards: 100,
      icon: '/assets/items/lingote_netherita_app.png',
      description: 'Sustancia abisal prácticamente indestructible.'
    },
    {
      id: 'kit_herreria',
      name: 'Kit de Herrería Profesional',
      category: 'materiales',
      costGold: 150,
      costShards: 0,
      icon: '/assets/items/kit_de_herreria_app.png',
      description: 'Herramientas indispensables para forjadores.'
    },
    {
      id: 'amatista',
      name: 'Amatista Pulida',
      category: 'gemas',
      costGold: 180,
      costShards: 0,
      icon: '/assets/items/amatista_app.png',
      description: 'Gema con resonancia arcana para engarces.'
    },
    {
      id: 'rubi',
      name: 'Rubí Carmesí',
      category: 'gemas',
      costGold: 240,
      costShards: 0,
      icon: '/assets/items/rubi_app.png',
      description: 'Piedra imbuida con fuego y pasión combativa.'
    },
    {
      id: 'zafiro',
      name: 'Zafiro Océano',
      category: 'gemas',
      costGold: 240,
      costShards: 0,
      icon: '/assets/items/zafiro_app.png',
      description: 'Gema cristalina de gran pureza mágica.'
    },
    {
      id: 'diamante',
      name: 'Diamante Supremo',
      category: 'gemas',
      costGold: 700,
      costShards: 60,
      icon: '/assets/items/diamante.png',
      description: 'La gema más valiosa y resistente del reino.'
    },
    {
      id: 'grimorio_luna_oscura',
      name: 'Grimorio de la Luna Oscura',
      category: 'grimorios',
      costGold: 350,
      costShards: 20,
      icon: '/assets/items/grimorio_luna_oscura_app.png',
      description: 'Encantos oscuros para despertar atributos profanos.'
    },
    {
      id: 'grimorio_luz_solar',
      name: 'Grimorio de la Luz Solar',
      category: 'grimorios',
      costGold: 350,
      costShards: 20,
      icon: '/assets/items/grimorio_luz_solar_app.png',
      description: 'Plegarias solares para potenciar habilidades divinas.'
    },
    {
      id: 'sello_caldo_dragon',
      name: 'Sello Caldo de Dragón',
      category: 'grimorios',
      costGold: 500,
      costShards: 40,
      icon: '/assets/items/sello_caldo_de_dragon.png',
      description: 'Cresta insignia de la hermandad tabernera.'
    }
  ];

  const handlePurchase = (item: ShopItem) => {
    if (item.id === 'pack_cristales_10') {
      if (spendGold(item.costGold)) {
        soundManager.playCoin();
        addMemoryCrystals(10);
      } else {
        alert('Oro insuficiente.');
      }
      return;
    }

    if (item.id === 'pack_cristales_30') {
      if (spendGold(item.costGold)) {
        soundManager.playCoin();
        addMemoryCrystals(30);
      } else {
        alert('Oro insuficiente.');
      }
      return;
    }

    const categoryMap: Record<string, 'mineral' | 'gema' | 'otro'> = {
      materiales: 'mineral',
      gemas: 'gema'
    };

    const success = buyItem(
      {
        id: item.id,
        name: item.name,
        category: categoryMap[item.category] || 'otro',
        icon: item.icon,
        description: item.description,
        sellPrice: Math.round(item.costGold * 0.5)
      },
      item.costGold,
      item.costShards
    );

    if (!success) {
      alert('Recursos insuficientes para comprar este producto.');
    }
  };

  const filteredCatalog = shopCatalog.filter(i => i.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div
        className="rounded-2xl border-2 border-amber-600/60 overflow-hidden relative p-6 bg-cover bg-center shadow-xl flex flex-col justify-between min-h-[140px]"
        style={{ backgroundImage: `url('/assets/backgrounds/fondo_tienda.png')` }}
      >
        <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-300 text-xs font-semibold mb-2">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>MERCADO CENTRAL DE ICESPEAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 font-serif">
              Tienda de Abastecimiento y Comercio
            </h2>
            <p className="text-xs text-stone-300 max-w-lg mt-1">
              Adquiere suministros mineros, gemas preciosas, cristales de memoria y artefactos de facción.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        {[
          { id: 'recursos', label: 'Cristales & Pociones' },
          { id: 'materiales', label: 'Lingotes & Forja' },
          { id: 'gemas', label: 'Gemas Preciosas' },
          { id: 'grimorios', label: 'Grimorios & Sellos' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              soundManager.playClick();
              setActiveTab(t.id as any);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map(product => {
          const canAfford = gold >= product.costGold && astralShards >= product.costShards;

          return (
            <div
              key={product.id}
              className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 hover:border-amber-600/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-stone-950 border border-stone-700 p-2 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <img src={product.icon} alt="" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-100">{product.name}</h4>
                  <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-stone-800/80 pt-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  {product.costGold > 0 && (
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{product.costGold}</span>
                    </div>
                  )}
                  {product.costShards > 0 && (
                    <div className="flex items-center gap-1 text-purple-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{product.costShards}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(product)}
                  disabled={!canAfford}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow flex items-center gap-1.5 disabled:opacity-40"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
