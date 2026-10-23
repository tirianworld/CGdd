import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Hero,
  EquipmentInstance,
  InventoryItem,
  ActivePatrol,
  PatrolMission,
  GachaPullResult
} from '../types/game';
import {
  INITIAL_HEROES,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_EQUIPMENT_BASE,
  GACHA_BANNERS
} from '../data/gameData';
import { soundManager } from '../services/audioService';

interface GameState {
  playerName: string;
  gold: number;
  memoryCrystals: number;
  astralShards: number;
  heroCoins: Record<number, number>;
  heroes: Hero[];
  inventory: InventoryItem[];
  equipment: EquipmentInstance[];
  activePatrols: ActivePatrol[];
  constantPatrolMeter: number;
  gachaPity: Record<string, number>;
  activeBuff: { name: string; atkPercent: number; defPercent: number; turns: number } | null;
  selectedHeroTeam: number[];
  sparks: number;
}

interface GameContextType extends GameState {
  setPlayerName: (name: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addMemoryCrystals: (amount: number) => void;
  spendMemoryCrystals: (amount: number) => boolean;
  addAstralShards: (amount: number) => void;
  spendAstralShards: (amount: number) => boolean;
  addHeroCoins: (heroId: number, amount: number) => void;
  spendHeroCoins: (heroId: number, amount: number) => boolean;
  addSparks: (amount: number) => void;
  tapBonfire: () => void;
  levelUpHero: (heroId: number, usePotion?: boolean) => boolean;
  rankUpHeroStars: (heroId: number) => boolean;
  switchHeroSkin: (heroId: number, skinId: string) => void;
  equipItemToHero: (heroId: number, equipmentInstanceId: string) => void;
  unequipItemFromHero: (heroId: number, equipmentType: 'Arma' | 'Armadura' | 'Accesorio') => void;
  setHeroTeamSlot: (position: number, heroId: number | null) => void;
  useItem: (itemId: string, targetHeroId?: number) => boolean;
  sellItem: (itemId: string, quantity?: number) => void;
  buyItem: (item: Partial<InventoryItem>, costGold?: number, costShards?: number) => boolean;
  upgradeEquipment: (instanceId: string) => boolean;
  pullGacha: (bannerId: string, count: 1 | 11) => GachaPullResult[];
  dispatchPatrol: (mission: PatrolMission, heroIds: number[]) => boolean;
  claimPatrolRewards: (slotId: number) => void;
  claimConstantPatrol: () => void;
  cookDish: (dishId: string) => boolean;
  claimLockpickReward: (goldReward: number, items: { id: string; amount: number }[]) => void;
  applyCombatVictory: (gold: number, xp: number, crystals: number, itemIds: string[]) => void;
  resetGameData: () => void;
}

const STORAGE_KEY = 'cdd_gacha_v2_save';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            heroes: INITIAL_HEROES.map(initH => {
              const savedH = parsed.heroes?.find((h: Hero) => h.id === initH.id);
              return savedH ? { ...initH, ...savedH } : initH;
            })
          };
        }
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }

    const defaultEquipInstances: EquipmentInstance[] = INITIAL_EQUIPMENT_BASE.map((base, idx) => ({
      instanceId: `inst_${idx}_${Date.now()}`,
      baseId: base.id,
      name: base.name,
      type: base.type,
      rarity: base.rarity,
      icon: base.icon,
      level: 1,
      stars: 0,
      attack: base.baseAttack,
      defense: base.baseDefense,
      health: base.baseHealth,
      equippedToHeroId: idx === 0 ? 5 : undefined
    }));

    return {
      playerName: 'Aventurero Loux',
      gold: 3500,
      memoryCrystals: 42,
      astralShards: 200,
      heroCoins: { 5: 30, 10: 20 },
      heroes: INITIAL_HEROES,
      inventory: INITIAL_INVENTORY_ITEMS,
      equipment: defaultEquipInstances,
      activePatrols: [],
      constantPatrolMeter: 0.25,
      gachaPity: { mercado_negro: 0, caldo_dragon: 0, sagrado_icespear: 0 },
      activeBuff: null,
      selectedHeroTeam: [5, 10, 11, 1],
      sparks: 0
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        constantPatrolMeter: Math.min(1.0, prev.constantPatrolMeter + 0.005)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setPlayerName = (name: string) => {
    setState(prev => ({ ...prev, playerName: name }));
  };

  const addGold = (amount: number) => {
    setState(prev => ({ ...prev, gold: Math.max(0, prev.gold + amount) }));
  };

  const spendGold = (amount: number): boolean => {
    if (state.gold < amount) return false;
    setState(prev => ({ ...prev, gold: prev.gold - amount }));
    return true;
  };

  const addMemoryCrystals = (amount: number) => {
    setState(prev => ({ ...prev, memoryCrystals: Math.max(0, prev.memoryCrystals + amount) }));
  };

  const spendMemoryCrystals = (amount: number): boolean => {
    if (state.memoryCrystals < amount) return false;
    setState(prev => ({ ...prev, memoryCrystals: prev.memoryCrystals - amount }));
    return true;
  };

  const addAstralShards = (amount: number) => {
    setState(prev => ({ ...prev, astralShards: Math.max(0, prev.astralShards + amount) }));
  };

  const spendAstralShards = (amount: number): boolean => {
    if (state.astralShards < amount) return false;
    setState(prev => ({ ...prev, astralShards: prev.astralShards - amount }));
    return true;
  };

  const addHeroCoins = (heroId: number, amount: number) => {
    setState(prev => ({
      ...prev,
      heroCoins: {
        ...prev.heroCoins,
        [heroId]: (prev.heroCoins[heroId] || 0) + amount
      }
    }));
  };

  const spendHeroCoins = (heroId: number, amount: number): boolean => {
    const current = state.heroCoins[heroId] || 0;
    if (current < amount) return false;
    setState(prev => ({
      ...prev,
      heroCoins: {
        ...prev.heroCoins,
        [heroId]: current - amount
      }
    }));
    return true;
  };

  const addSparks = (amount: number) => {
    setState(prev => ({ ...prev, sparks: prev.sparks + amount }));
  };

  const tapBonfire = () => {
    soundManager.playCoin();
    setState(prev => ({
      ...prev,
      sparks: prev.sparks + 1,
      gold: prev.gold + 5,
      memoryCrystals: prev.sparks % 25 === 0 ? prev.memoryCrystals + 1 : prev.memoryCrystals
    }));
  };

  const levelUpHero = (heroId: number, usePotion: boolean = false): boolean => {
    const hero = state.heroes.find(h => h.id === heroId);
    if (!hero) return false;

    const goldCost = hero.level * 100;
    if (!usePotion && state.gold < goldCost) return false;

    if (usePotion) {
      const potion = state.inventory.find(i => i.id === 'frasco_xp' && i.quantity > 0);
      if (!potion) return false;
      setState(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => i.id === 'frasco_xp' ? { ...i, quantity: i.quantity - 1 } : i)
      }));
    } else {
      spendGold(goldCost);
    }

    soundManager.playSound('/assets/audio/powerup2.wav', 0.8);

    setState(prev => ({
      ...prev,
      heroes: prev.heroes.map(h => {
        if (h.id !== heroId) return h;
        const newLevel = h.level + 1;
        return {
          ...h,
          level: newLevel,
          maxHealth: Math.round(h.maxHealth * 1.1),
          currentHealth: Math.round(h.maxHealth * 1.1),
          attack: Math.round(h.attack * 1.08),
          defense: Math.round(h.defense * 1.08)
        };
      })
    }));

    return true;
  };

  const rankUpHeroStars = (heroId: number): boolean => {
    const hero = state.heroes.find(h => h.id === heroId);
    if (!hero || hero.stars >= 5) return false;

    const requiredCoins = (hero.stars + 1) * 20;
    const currentCoins = state.heroCoins[heroId] || 0;

    if (currentCoins < requiredCoins) return false;

    spendHeroCoins(heroId, requiredCoins);
    soundManager.playSound('/assets/audio/powerup3.wav', 0.9);

    setState(prev => ({
      ...prev,
      heroes: prev.heroes.map(h => {
        if (h.id !== heroId) return h;
        return {
          ...h,
          stars: h.stars + 1,
          maxHealth: Math.round(h.maxHealth * 1.15),
          currentHealth: Math.round(h.maxHealth * 1.15),
          attack: Math.round(h.attack * 1.15),
          defense: Math.round(h.defense * 1.15)
        };
      })
    }));

    return true;
  };

  const switchHeroSkin = (heroId: number, skinId: string) => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      heroes: prev.heroes.map(h => {
        if (h.id !== heroId) return h;
        const skin = h.skins?.find(s => s.id === skinId);
        return {
          ...h,
          activeSkinId: skinId,
          portrait: skin?.portrait || h.portrait
        };
      })
    }));
  };

  const equipItemToHero = (heroId: number, equipmentInstanceId: string) => {
    soundManager.playClick();
    setState(prev => {
      const equip = prev.equipment.find(e => e.instanceId === equipmentInstanceId);
      if (!equip) return prev;

      const updatedEquipment = prev.equipment.map(e => {
        if (e.equippedToHeroId === heroId && e.type === equip.type) {
          return { ...e, equippedToHeroId: undefined };
        }
        if (e.instanceId === equipmentInstanceId) {
          return { ...e, equippedToHeroId: heroId };
        }
        return e;
      });

      return {
        ...prev,
        equipment: updatedEquipment
      };
    });
  };

  const unequipItemFromHero = (heroId: number, equipmentType: 'Arma' | 'Armadura' | 'Accesorio') => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      equipment: prev.equipment.map(e => {
        if (e.equippedToHeroId === heroId && e.type === equipmentType) {
          return { ...e, equippedToHeroId: undefined };
        }
        return e;
      })
    }));
  };

  const setHeroTeamSlot = (position: number, heroId: number | null) => {
    soundManager.playClick();
    setState(prev => {
      const newTeam = [...prev.selectedHeroTeam];
      if (heroId === null) {
        newTeam[position] = -1;
      } else {
        const existingIdx = newTeam.indexOf(heroId);
        if (existingIdx !== -1) {
          newTeam[existingIdx] = newTeam[position];
        }
        newTeam[position] = heroId;
      }
      return { ...prev, selectedHeroTeam: newTeam };
    });
  };

  const useItem = (itemId: string, targetHeroId?: number): boolean => {
    const item = state.inventory.find(i => i.id === itemId && i.quantity > 0);
    if (!item) return false;

    if (item.category === 'xp' && targetHeroId) {
      const xpVal = item.effect?.value || 100;
      soundManager.playSound('/assets/audio/powerup1.wav', 0.8);
      setState(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i),
        heroes: prev.heroes.map(h => {
          if (h.id !== targetHeroId) return h;
          const newXp = h.xp + xpVal;
          const xpToLevel = h.level * 100;
          if (newXp >= xpToLevel) {
            return {
              ...h,
              level: h.level + 1,
              xp: newXp - xpToLevel,
              maxHealth: Math.round(h.maxHealth * 1.1),
              attack: Math.round(h.attack * 1.08),
              defense: Math.round(h.defense * 1.08)
            };
          }
          return { ...h, xp: newXp };
        })
      }));
      return true;
    }

    if (item.category === 'comida') {
      soundManager.playCoin();
      const buffVal = item.effect?.value || 15;
      setState(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i),
        activeBuff: {
          name: item.name,
          atkPercent: buffVal,
          defPercent: Math.round(buffVal * 0.7),
          turns: 3
        }
      }));
      return true;
    }

    return false;
  };

  const sellItem = (itemId: string, quantity: number = 1) => {
    const item = state.inventory.find(i => i.id === itemId);
    if (!item || item.quantity < quantity) return;

    const goldEarned = item.sellPrice * quantity;
    soundManager.playCoin();

    setState(prev => ({
      ...prev,
      gold: prev.gold + goldEarned,
      inventory: prev.inventory.map(i => i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i)
    }));
  };

  const buyItem = (itemData: Partial<InventoryItem>, costGold: number = 0, costShards: number = 0): boolean => {
    if (state.gold < costGold || state.astralShards < costShards) return false;

    soundManager.playCoin();

    setState(prev => {
      const existing = prev.inventory.find(i => i.id === itemData.id);
      let newInventory = [...prev.inventory];
      if (existing) {
        newInventory = newInventory.map(i => i.id === itemData.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        newInventory.push({
          id: itemData.id || `item_${Date.now()}`,
          name: itemData.name || 'Objeto',
          category: itemData.category || 'otro',
          quantity: 1,
          rarity: itemData.rarity || 'R',
          icon: itemData.icon || '/assets/items/weapons.png',
          description: itemData.description || '',
          sellPrice: Math.round(costGold * 0.5)
        });
      }

      return {
        ...prev,
        gold: prev.gold - costGold,
        astralShards: prev.astralShards - costShards,
        inventory: newInventory
      };
    });

    return true;
  };

  const upgradeEquipment = (instanceId: string): boolean => {
    const equip = state.equipment.find(e => e.instanceId === instanceId);
    if (!equip || equip.level >= 10) return false;

    const goldCost = equip.level * 250;
    const mineralCost = equip.level >= 5 ? 'lingote_plata' : 'lingote_cobre';
    const mineralItem = state.inventory.find(i => i.id === mineralCost && i.quantity > 0);

    if (state.gold < goldCost || !mineralItem) return false;

    soundManager.playSound('/assets/audio/powerup4.wav', 0.8);

    setState(prev => ({
      ...prev,
      gold: prev.gold - goldCost,
      inventory: prev.inventory.map(i => i.id === mineralCost ? { ...i, quantity: i.quantity - 1 } : i),
      equipment: prev.equipment.map(e => {
        if (e.instanceId !== instanceId) return e;
        return {
          ...e,
          level: e.level + 1,
          attack: Math.round(e.attack * 1.15),
          defense: Math.round(e.defense * 1.15),
          health: Math.round(e.health * 1.15)
        };
      })
    }));

    return true;
  };

  const pullGacha = (bannerId: string, count: 1 | 11): GachaPullResult[] => {
    const banner = GACHA_BANNERS.find(b => b.id === bannerId) || GACHA_BANNERS[0];
    const cost = count === 1 ? banner.costSingle : banner.costMulti;

    if (state.memoryCrystals < cost) return [];

    soundManager.playSummonCharge();

    const currentPity = state.gachaPity[bannerId] || 0;
    const results: GachaPullResult[] = [];
    let updatedPity = currentPity + count;

    const ssrHeroes = state.heroes.filter(h => h.rarity === 'SSR');
    const srHeroes = state.heroes.filter(h => h.rarity === 'SR');
    const rHeroes = state.heroes.filter(h => h.rarity === 'R');

    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      let pulledRarity: 'SSR' | 'SR' | 'R' = 'R';

      const ssrChance = updatedPity >= 300 ? 15.0 : (updatedPity >= 800 ? 50.0 : 3.0);
      const srChance = 37.0;

      if (roll < ssrChance || updatedPity >= 900) {
        pulledRarity = 'SSR';
        updatedPity = 0;
      } else if (roll < ssrChance + srChance) {
        pulledRarity = 'SR';
      } else {
        pulledRarity = 'R';
      }

      let heroPool = pulledRarity === 'SSR' ? ssrHeroes : (pulledRarity === 'SR' ? srHeroes : rHeroes);
      if (heroPool.length === 0) heroPool = state.heroes;

      const featuredInPool = heroPool.filter(h => banner.featuredHeroIds.includes(h.id));
      let selectedHero: Hero;
      if (featuredInPool.length > 0 && Math.random() < 0.5) {
        selectedHero = featuredInPool[Math.floor(Math.random() * featuredInPool.length)];
      } else {
        selectedHero = heroPool[Math.floor(Math.random() * heroPool.length)];
      }

      const isNew = !selectedHero.isUnlocked;
      results.push({
        hero: selectedHero,
        isNew,
        duplicateHeroCoins: isNew ? 0 : (selectedHero.rarity === 'SSR' ? 30 : (selectedHero.rarity === 'SR' ? 15 : 5)),
        duplicateAstralShards: isNew ? 0 : (selectedHero.rarity === 'SSR' ? 50 : 15)
      });
    }

    setState(prev => {
      let newHeroes = [...prev.heroes];
      const newCoins = { ...prev.heroCoins };
      let newShards = prev.astralShards;

      results.forEach(res => {
        if (res.isNew) {
          newHeroes = newHeroes.map(h => h.id === res.hero.id ? { ...h, isUnlocked: true } : h);
        } else {
          newCoins[res.hero.id] = (newCoins[res.hero.id] || 0) + res.duplicateHeroCoins;
          newShards += res.duplicateAstralShards;
        }
      });

      return {
        ...prev,
        memoryCrystals: prev.memoryCrystals - cost,
        heroes: newHeroes,
        heroCoins: newCoins,
        astralShards: newShards,
        gachaPity: {
          ...prev.gachaPity,
          [bannerId]: updatedPity
        }
      };
    });

    return results;
  };

  const dispatchPatrol = (mission: PatrolMission, heroIds: number[]): boolean => {
    if (state.activePatrols.length >= 3) return false;
    if (heroIds.length < mission.requiredHeroes) return false;

    const heroesToDispatch = state.heroes.filter(h => heroIds.includes(h.id));
    const hasEnoughStamina = heroesToDispatch.every(h => h.stamina >= mission.staminaCost);
    if (!hasEnoughStamina) return false;

    soundManager.playSound('/assets/audio/powerup1.wav', 0.8);

    const newPatrol: ActivePatrol = {
      slotId: Date.now(),
      mission,
      assignedHeroIds: heroIds,
      startTime: Date.now(),
      endTime: Date.now() + mission.durationSeconds * 1000
    };

    setState(prev => ({
      ...prev,
      activePatrols: [...prev.activePatrols, newPatrol],
      heroes: prev.heroes.map(h => {
        if (!heroIds.includes(h.id)) return h;
        return {
          ...h,
          stamina: Math.max(0, h.stamina - mission.staminaCost)
        };
      })
    }));

    return true;
  };

  const claimPatrolRewards = (slotId: number) => {
    const patrol = state.activePatrols.find(p => p.slotId === slotId);
    if (!patrol) return;

    soundManager.playCoin();

    const rewardedItems: { id: string; amount: number }[] = [];
    patrol.mission.rewardItems.forEach(rw => {
      if (Math.random() <= rw.chance) {
        rewardedItems.push({ id: rw.itemId, amount: rw.amount });
      }
    });

    setState(prev => {
      let newInventory = [...prev.inventory];
      rewardedItems.forEach(rw => {
        newInventory = newInventory.map(item => {
          if (item.id === rw.id) {
            return { ...item, quantity: item.quantity + rw.amount };
          }
          return item;
        });
      });

      return {
        ...prev,
        gold: prev.gold + patrol.mission.rewardGold,
        activePatrols: prev.activePatrols.filter(p => p.slotId !== slotId),
        inventory: newInventory,
        heroes: prev.heroes.map(h => {
          if (!patrol.assignedHeroIds.includes(h.id)) return h;
          return {
            ...h,
            xp: h.xp + patrol.mission.rewardXp,
            stamina: Math.min(h.maxStamina, h.stamina + 10)
          };
        })
      };
    });
  };

  const claimConstantPatrol = () => {
    if (state.constantPatrolMeter < 0.2) return;

    soundManager.playCoin();
    const goldEarned = Math.round(state.constantPatrolMeter * 400);
    const crystalsEarned = state.constantPatrolMeter >= 0.8 ? 2 : 1;

    setState(prev => ({
      ...prev,
      gold: prev.gold + goldEarned,
      memoryCrystals: prev.memoryCrystals + crystalsEarned,
      constantPatrolMeter: 0
    }));
  };

  const cookDish = (dishId: string): boolean => {
    if (dishId === 'pan_ajo') {
      const pan = state.inventory.find(i => i.id === 'pan' && i.quantity >= 1);
      const ajo = state.inventory.find(i => i.id === 'ajo' && i.quantity >= 1);
      if (!pan || !ajo) return false;

      soundManager.playSound('/assets/audio/powerup2.wav', 0.8);
      setState(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => {
          if (i.id === 'pan' || i.id === 'ajo') return { ...i, quantity: i.quantity - 1 };
          if (i.id === 'pan_ajo') return { ...i, quantity: i.quantity + 1 };
          return i;
        })
      }));
      return true;
    }

    if (dishId === 'hamburguesa') {
      const pan = state.inventory.find(i => i.id === 'pan' && i.quantity >= 2);
      const queso = state.inventory.find(i => i.id === 'queso' && i.quantity >= 1);
      if (!pan || !queso) return false;

      soundManager.playSound('/assets/audio/powerup2.wav', 0.8);
      setState(prev => ({
        ...prev,
        inventory: prev.inventory.map(i => {
          if (i.id === 'pan') return { ...i, quantity: i.quantity - 2 };
          if (i.id === 'queso') return { ...i, quantity: i.quantity - 1 };
          if (i.id === 'hamburguesa') return { ...i, quantity: i.quantity + 1 };
          return i;
        })
      }));
      return true;
    }

    return false;
  };

  const claimLockpickReward = (goldReward: number, items: { id: string; amount: number }[]) => {
    soundManager.playCoin();
    setState(prev => {
      let updatedInv = [...prev.inventory];
      items.forEach(it => {
        updatedInv = updatedInv.map(invItem => {
          if (invItem.id === it.id) {
            return { ...invItem, quantity: invItem.quantity + it.amount };
          }
          return invItem;
        });
      });

      return {
        ...prev,
        gold: prev.gold + goldReward,
        memoryCrystals: prev.memoryCrystals + 3,
        inventory: updatedInv
      };
    });
  };

  const applyCombatVictory = (rewardGold: number, rewardXp: number, rewardCrystals: number, itemIds: string[]) => {
    soundManager.playSSRReveal();
    setState(prev => {
      let updatedInv = [...prev.inventory];
      itemIds.forEach(id => {
        updatedInv = updatedInv.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      });

      const updatedHeroes = prev.heroes.map(h => {
        if (!prev.selectedHeroTeam.includes(h.id)) return h;
        const newXp = h.xp + rewardXp;
        const xpToLevel = h.level * 120;
        if (newXp >= xpToLevel) {
          return {
            ...h,
            level: h.level + 1,
            xp: newXp - xpToLevel,
            maxHealth: Math.round(h.maxHealth * 1.1),
            currentHealth: Math.round(h.maxHealth * 1.1),
            attack: Math.round(h.attack * 1.08),
            defense: Math.round(h.defense * 1.08)
          };
        }
        return { ...h, xp: newXp };
      });

      return {
        ...prev,
        gold: prev.gold + rewardGold,
        memoryCrystals: prev.memoryCrystals + rewardCrystals,
        inventory: updatedInv,
        heroes: updatedHeroes
      };
    });
  };

  const resetGameData = () => {
    if (confirm('¿Deseas reiniciar tu progreso al estado inicial?')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        setPlayerName,
        addGold,
        spendGold,
        addMemoryCrystals,
        spendMemoryCrystals,
        addAstralShards,
        spendAstralShards,
        addHeroCoins,
        spendHeroCoins,
        addSparks,
        tapBonfire,
        levelUpHero,
        rankUpHeroStars,
        switchHeroSkin,
        equipItemToHero,
        unequipItemFromHero,
        setHeroTeamSlot,
        useItem,
        sellItem,
        buyItem,
        upgradeEquipment,
        pullGacha,
        dispatchPatrol,
        claimPatrolRewards,
        claimConstantPatrol,
        cookDish,
        claimLockpickReward,
        applyCombatVictory,
        resetGameData
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
