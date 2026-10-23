import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { TavernView } from './components/TavernView';
import { GachaView } from './components/GachaView';
import { CombatView } from './components/CombatView';
import { HeroesView } from './components/HeroesView';
import { PatrolView } from './components/PatrolView';
import { ForgeView } from './components/ForgeView';
import { InventoryView } from './components/InventoryView';
import { ShopView } from './components/ShopView';

function GameContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('taberna');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      <Header />
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1 pb-16">
        {currentTab === 'taberna' && <TavernView />}
        {currentTab === 'gacha' && <GachaView />}
        {currentTab === 'combate' && <CombatView />}
        {currentTab === 'heroes' && <HeroesView />}
        {currentTab === 'patrullas' && <PatrolView />}
        {currentTab === 'herreria' && <ForgeView />}
        {currentTab === 'inventario' && <InventoryView />}
        {currentTab === 'tienda' && <ShopView />}
      </main>

      <footer className="bg-stone-950 border-t border-stone-850 py-3 text-center text-[11px] text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>CDD Gacha 2 • Cofradía Caldo de Dragón & Icespear</span>
          <span className="font-mono text-amber-500/70">Dark Fantasy RPG Engine</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
