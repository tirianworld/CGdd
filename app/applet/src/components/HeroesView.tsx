import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../services/audioService';
import {
  Star,
  Zap,
  Heart,
  Sword,
  ShieldCheck,
  X,
  Plus,
  Shirt,
  UserCheck
} from 'lucide-react';

export const HeroesView: React.FC = () => {
  const {
    heroes,
    heroCoins,
    gold,
    equipment,
    levelUpHero,
    rankUpHeroStars,
    switchHeroSkin,
    equipItemToHero,
    unequipItemFromHero,
    selectedHeroTeam,
    setHeroTeamSlot,
    inventory
  } = useGame();

  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(heroes[0]?.id || null);
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterAttribute, setFilterAttribute] = useState<string>('all');
  const [filterAlliance, setFilterAlliance] = useState<string>('all');
  const [showEquipModal, setShowEquipModal] = useState<'Arma' | 'Armadura' | 'Accesorio' | null>(null);

  const selectedHero = heroes.find(h => h.id === selectedHeroId) || heroes[0];
  const heroCoinCount = selectedHero ? (heroCoins[selectedHero.id] || 0) : 0;
  const rankUpCost = selectedHero ? (selectedHero.stars + 1) * 20 : 20;
  const levelUpCost = selectedHero ? selectedHero.level * 100 : 100;
  const hasXpPotion = inventory.some(i => i.id === 'frasco_xp' && i.quantity > 0);

  const filteredHeroes = heroes.filter(h => {
    if (filterRarity !== 'all' && h.rarity !== filterRarity) return false;
    if (filterAttribute !== 'all' && h.attribute !== filterAttribute) return false;
    if (filterAlliance !== 'all' && h.alianza !== filterAlliance) return false;
    return true;
  });

  const equippedWeapon = equipment.find(e => e.equippedToHeroId === selectedHero?.id && e.type === 'Arma');
  const equippedArmor = equipment.find(e => e.equippedToHeroId === selectedHero?.id && e.type === 'Armadura');
  const equippedAccessory = equipment.find(e => e.equippedToHeroId === selectedHero?.id && e.type === 'Accesorio');

  const gearAtk = (equippedWeapon?.attack || 0) + (equippedArmor?.attack || 0) + (equippedAccessory?.attack || 0);
  const gearDef = (equippedWeapon?.defense || 0) + (equippedArmor?.defense || 0) + (equippedAccessory?.defense || 0);
  const gearHp = (equippedWeapon?.health || 0) + (equippedArmor?.health || 0) + (equippedAccessory?.health || 0);

  const combatSlotIdx = selectedHero ? selectedHeroTeam.indexOf(selectedHero.id) : -1;

  const handleToggleCombatTeam = (slot: number) => {
    if (!selectedHero) return;
    if (combatSlotIdx === slot) {
      setHeroTeamSlot(slot, null);
    } else {
      setHeroTeamSlot(slot, selectedHero.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div className="bg-stone-900/90 border border-amber-900/60 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base text-amber-200">
              Escuadra de Combate Activa (4v4 Darkest Dungeon)
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            Posiciones: [1: Delantera] a [4: Retaguardia]
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {[0, 1, 2, 3].map(pos => {
            const hId = selectedHeroTeam[pos];
            const heroInSlot = heroes.find(h => h.id === hId);

            return (
              <div
                key={pos}
                onClick={() => {
                  if (heroInSlot) {
                    soundManager.playClick();
                    setSelectedHeroId(heroInSlot.id);
                  }
                }}
                className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center min-h-[90px] relative cursor-pointer ${
                  heroInSlot
                    ? 'border-amber-500/80 bg-stone-950/80 hover:border-amber-400'
                    : 'border-dashed border-stone-700 bg-stone-950/40 text-stone-500'
                }`}
              >
                <div className="absolute top-1 left-2 text-[10px] font-mono font-bold text-amber-500/80">
                  Pos {pos + 1}
                </div>

                {heroInSlot ? (
                  <>
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-500/50 mt-2">
                      <img
                        src={heroInSlot.portrait}
                        alt={heroInSlot.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <span className="font-bold text-xs text-amber-200 mt-1 truncate max-w-full">
                      {heroInSlot.name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Lvl {heroInSlot.level}
                    </span>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <Plus className="w-6 h-6 mx-auto opacity-40 mb-1" />
                    <span className="text-[11px]">Vacío</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400 font-semibold">Rareza:</span>
              {['all', 'SSR', 'SR', 'R'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRarity(r)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                    filterRarity === r
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-400 font-semibold">Atributo:</span>
              {['all', 'Divino', 'Profano', 'Natural', 'Arcano'].map(att => (
                <button
                  key={att}
                  onClick={() => setFilterAttribute(att)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    filterAttribute === att
                      ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {att}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[680px] overflow-y-auto pr-1">
            {filteredHeroes.map(hero => {
              const isSelected = hero.id === selectedHero?.id;
              const isLocked = !hero.isUnlocked;

              return (
                <div
                  key={hero.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedHeroId(hero.id);
                  }}
                  className={`p-2 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-stone-900 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                      : isLocked
                      ? 'border-stone-800/80 bg-stone-950/40 opacity-60 hover:opacity-80'
                      : 'border-stone-850 bg-stone-900/60 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-black font-mono ${
                        hero.rarity === 'SSR'
                          ? 'bg-amber-400 text-stone-950'
                          : hero.rarity === 'SR'
                          ? 'bg-purple-500 text-stone-950'
                          : 'bg-cyan-500 text-stone-950'
                      }`}
                    >
                      {hero.rarity}
                    </span>
                    <div className="flex items-center text-amber-400 text-[10px]">
                      {Array.from({ length: hero.stars }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="w-full aspect-square rounded-lg overflow-hidden border border-stone-800 bg-stone-950 my-1 relative">
                    <img
                      src={hero.portrait}
                      alt={hero.name}
                      className={`w-full h-full object-cover ${isLocked ? 'filter grayscale brightness-50' : ''}`}
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-stone-950/60 text-xs font-bold text-stone-400">
                        BLOQUEADO
                      </div>
                    )}
                  </div>

                  <div className="text-center z-10">
                    <div className="font-bold text-xs text-stone-200 truncate">{hero.name}</div>
                    <div className="text-[10px] text-stone-400">
                      {isLocked ? 'Invocar en Gacha' : `Nv. ${hero.level}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedHero && (
          <div className="lg:col-span-7 bg-stone-900/90 border border-amber-900/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500 bg-stone-950 shadow-lg relative flex-shrink-0">
                  <img
                    src={selectedHero.portrait}
                    alt={selectedHero.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <span
                    className={`absolute bottom-0 right-0 px-1.5 py-0.2 rounded-tl text-[10px] font-black ${
                      selectedHero.rarity === 'SSR' ? 'bg-amber-400 text-stone-950' : 'bg-purple-500 text-stone-950'
                    }`}
                  >
                    {selectedHero.rarity}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-amber-200 font-serif">
                      {selectedHero.name}
                    </h2>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < selectedHero.stars ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-amber-400/90 font-medium">{selectedHero.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {selectedHero.race} ({selectedHero.subRace || 'Puro'}) • {selectedHero.heroClass} • {selectedHero.attribute} •{' '}
                    <span className="text-amber-500">{selectedHero.alianza}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <div className="text-xs font-mono text-stone-300">
                  Monedas de Héroe: <span className="font-bold text-amber-400">{heroCoinCount}</span>
                </div>
                {selectedHero.isUnlocked && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-400">Asignar a puesto:</span>
                    {[0, 1, 2, 3].map(pos => (
                      <button
                        key={pos}
                        onClick={() => handleToggleCombatTeam(pos)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                          combatSlotIdx === pos
                            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow'
                            : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                        }`}
                      >
                        {pos + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Salud Máx</div>
                  <div className="font-mono font-bold text-sm text-stone-100">
                    {selectedHero.maxHealth + gearHp}
                    {gearHp > 0 && <span className="text-emerald-400 text-xs"> (+{gearHp})</span>}
                  </div>
                </div>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
                <Sword className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Ataque</div>
                  <div className="font-mono font-bold text-sm text-stone-100">
                    {selectedHero.attack + gearAtk}
                    {gearAtk > 0 && <span className="text-emerald-400 text-xs"> (+{gearAtk})</span>}
                  </div>
                </div>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Defensa</div>
                  <div className="font-mono font-bold text-sm text-stone-100">
                    {selectedHero.defense + gearDef}
                    {gearDef > 0 && <span className="text-emerald-400 text-xs"> (+{gearDef})</span>}
                  </div>
                </div>
              </div>

              <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Aguante</div>
                  <div className="font-mono font-bold text-sm text-stone-100">
                    {selectedHero.stamina} / {selectedHero.maxStamina}
                  </div>
                </div>
              </div>
            </div>

            {selectedHero.skins && selectedHero.skins.length > 0 && (
              <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-300">
                  <Shirt className="w-4 h-4 text-amber-400" />
                  <span>Vestimentas & Aspectos Desbloqueados</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedHero.skins.map(skin => (
                    <button
                      key={skin.id}
                      onClick={() => switchHeroSkin(selectedHero.id, skin.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedHero.activeSkinId === skin.id || (!selectedHero.activeSkinId && skin.id === 'default')
                          ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-bold'
                          : 'bg-stone-850 border-stone-700 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {skin.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3 space-y-2">
              <div className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Equipamiento Asignado</span>
                <span className="text-[10px] text-stone-400">Toca para cambiar o retirar</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div
                  onClick={() => setShowEquipModal('Arma')}
                  className="p-2 rounded-lg border border-stone-800 bg-stone-900/60 hover:border-amber-600/60 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded bg-stone-950 border border-stone-700 flex items-center justify-center p-1">
                    <img src={equippedWeapon?.icon || '/assets/items/weapons.png'} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-stone-400 uppercase">Arma</div>
                    <div className="text-xs font-bold text-stone-200 truncate">
                      {equippedWeapon ? `${equippedWeapon.name} (+${equippedWeapon.level})` : 'Ninguna'}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setShowEquipModal('Armadura')}
                  className="p-2 rounded-lg border border-stone-800 bg-stone-900/60 hover:border-amber-600/60 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded bg-stone-950 border border-stone-700 flex items-center justify-center p-1">
                    <img src={equippedArmor?.icon || '/assets/items/fragmento_de_quitina.png'} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-stone-400 uppercase">Armadura</div>
                    <div className="text-xs font-bold text-stone-200 truncate">
                      {equippedArmor ? `${equippedArmor.name} (+${equippedArmor.level})` : 'Ninguna'}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setShowEquipModal('Accesorio')}
                  className="p-2 rounded-lg border border-stone-800 bg-stone-900/60 hover:border-amber-600/60 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded bg-stone-950 border border-stone-700 flex items-center justify-center p-1">
                    <img src={equippedAccessory?.icon || '/assets/ui/marco_anillo.png'} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-stone-400 uppercase">Accesorio</div>
                    <div className="text-xs font-bold text-stone-200 truncate">
                      {equippedAccessory ? `${equippedAccessory.name} (+${equippedAccessory.level})` : 'Ninguna'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Habilidades Tácticas de Combate
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedHero.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl border border-stone-800 bg-stone-950/70 flex items-start gap-2.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-stone-900 border border-amber-600/40 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={skill.icon || '/assets/skills/golpe_de_remo.png'}
                        alt={skill.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-amber-300 flex items-center justify-between">
                        <span>{skill.name}</span>
                        {skill.baseDamage > 0 && (
                          <span className="font-mono text-[10px] text-red-400">
                            {skill.baseDamage} DMG
                          </span>
                        )}
                        {skill.healAmount && skill.healAmount > 0 && (
                          <span className="font-mono text-[10px] text-emerald-400">
                            +{skill.healAmount} HP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 leading-tight">
                        {skill.description}
                      </p>
                      <div className="text-[9px] text-stone-500 font-mono">
                        Uso: [pos {skill.usablePositions.map(p => p + 1).join(',')}] → Diana: [pos {skill.targetPositions.map(p => p + 1).join(',')}]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedHero.isUnlocked ? (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => levelUpHero(selectedHero.id, false)}
                  disabled={gold < levelUpCost}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Subir Nivel ({levelUpCost} Oro)</span>
                </button>

                <button
                  onClick={() => levelUpHero(selectedHero.id, true)}
                  disabled={!hasXpPotion}
                  className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-cyan-300 font-semibold text-xs sm:text-sm border border-stone-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Usar Frasco XP</span>
                </button>

                <button
                  onClick={() => rankUpHeroStars(selectedHero.id)}
                  disabled={heroCoinCount < rankUpCost || selectedHero.stars >= 5}
                  className="py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-purple-100 font-bold text-xs sm:text-sm shadow flex items-center gap-2 disabled:opacity-50"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>
                    {selectedHero.stars >= 5
                      ? 'Estrellas Máximas'
                      : `Mejorar Estrella (${heroCoinCount}/${rankUpCost})`}
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-stone-950 border border-dashed border-stone-800 text-center text-xs text-stone-400">
                Este héroe está bloqueado actualmente. ¡Invócalo en el banner correspondiente de la sección de Invocaciones!
              </div>
            )}
          </div>
        )}
      </div>

      {showEquipModal && selectedHero && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-amber-600/60 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-amber-300 text-base">
                Seleccionar {showEquipModal} para {selectedHero.name}
              </h3>
              <button
                onClick={() => setShowEquipModal(null)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              <button
                onClick={() => {
                  unequipItemFromHero(selectedHero.id, showEquipModal);
                  setShowEquipModal(null);
                }}
                className="w-full p-2.5 rounded-lg border border-stone-800 bg-stone-950 text-left text-xs text-stone-400 hover:text-stone-200 hover:border-stone-700"
              >
                Desequipar casilla
              </button>

              {equipment
                .filter(e => e.type === showEquipModal)
                .map(equip => {
                  const isCurrent = equip.equippedToHeroId === selectedHero.id;
                  const isEquippedOther = equip.equippedToHeroId && !isCurrent;

                  return (
                    <div
                      key={equip.instanceId}
                      onClick={() => {
                        equipItemToHero(selectedHero.id, equip.instanceId);
                        setShowEquipModal(null);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-950/30'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={equip.icon} alt="" className="w-8 h-8 object-contain" />
                        <div>
                          <div className="font-bold text-xs text-stone-200">
                            {equip.name} <span className="text-amber-400">+{equip.level}</span>
                          </div>
                          <div className="text-[10px] text-stone-400">
                            +{equip.attack} ATK • +{equip.defense} DEF • +{equip.health} HP
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {isCurrent ? 'Equipado' : isEquippedOther ? 'En otro héroe' : 'Disponible'}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
