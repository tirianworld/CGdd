export type HeroRarity = 'R' | 'SR' | 'SSR' | 'UR';

export type HeroAttribute = 'Divino' | 'Profano' | 'Natural' | 'Arcano';

export type HeroClass =
  | 'Guerrero'
  | 'Paladin'
  | 'Barbaro'
  | 'Clerigo'
  | 'Mago'
  | 'Hechicero'
  | 'Monje'
  | 'Brujo'
  | 'Bardo'
  | 'Chaman'
  | 'Druida'
  | 'BlackGuard'
  | 'Picaro'
  | 'Gunslinguer'
  | 'BloodHunter'
  | 'Explorador';

export type Alianza =
  | 'CaldoDeDragón'
  | 'ConsejoOmega'
  | 'Magor'
  | 'ElTribunal'
  | 'PortadoresDeMarca'
  | 'Moonhaven'
  | 'Antiguos'
  | 'MercadoNegro'
  | 'Compañia'
  | 'VaPorLibre';

export interface HeroSkill {
  name: string;
  description: string;
  icon?: string;
  usablePositions: number[]; // e.g. [0, 1] front, [2, 3] back
  targetPositions: number[]; // which enemy positions it can hit
  targetType: 'single_enemy' | 'all_enemies' | 'single_ally' | 'all_allies' | 'self';
  baseDamage: number;
  scalingAttack: number;
  healAmount?: number;
  buffAttack?: number;
  buffDefense?: number;
  statusEffect?: 'bleed' | 'burn' | 'poison' | 'shock' | 'stun' | 'freeze' | 'petrify';
  soundFx?: string;
}

export interface HeroSkin {
  id: string;
  name: string;
  portrait: string;
  description: string;
}

export interface Hero {
  id: number;
  name: string;
  title: string;
  race: string;
  subRace?: string;
  heroClass: HeroClass;
  attribute: HeroAttribute;
  alianza: Alianza;
  rarity: HeroRarity;
  portrait: string;
  background?: string;
  lore: string;
  skills: HeroSkill[];
  skins?: HeroSkin[];
  activeSkinId?: string;
  // Stats
  level: number;
  xp: number;
  stars: number; // 0 to 5
  awakening: number; // 0 to 3
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  stamina: number;
  maxStamina: number;
  isUnlocked: boolean;
  equippedWeapon?: EquipmentInstance;
  equippedArmor?: EquipmentInstance;
  equippedAccessory?: EquipmentInstance;
}

export type EquipmentType = 'Arma' | 'Armadura' | 'Accesorio';
export type EquipmentRarity = 'Común' | 'Raro' | 'Épico' | 'Legendario';

export interface EquipmentBase {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  icon: string;
  baseAttack: number;
  baseDefense: number;
  baseHealth: number;
  description: string;
}

export interface EquipmentInstance {
  instanceId: string;
  baseId: string;
  name: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  icon: string;
  level: number;
  stars: number;
  attack: number;
  defense: number;
  health: number;
  equippedToHeroId?: number;
}

export type ItemCategory = 'mineral' | 'gema' | 'grimorio' | 'kit' | 'comida' | 'ingrediente' | 'xp' | 'otro';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  rarity: HeroRarity;
  icon: string;
  description: string;
  sellPrice: number;
  effect?: {
    type: 'xp' | 'buff' | 'stamina';
    value: number;
    description: string;
  };
}

export interface GachaBanner {
  id: string;
  name: string;
  subtitle: string;
  costSingle: number; // Crystals
  costMulti: number;
  featuredHeroIds: number[];
  bannerImage: string;
  background: string;
  description: string;
}

export interface GachaPullResult {
  hero: Hero;
  isNew: boolean;
  duplicateHeroCoins: number;
  duplicateAstralShards: number;
}

export interface PatrolMission {
  id: string;
  name: string;
  location: string;
  description: string;
  requiredHeroes: number;
  minStars: number;
  durationSeconds: number;
  rewardGold: number;
  rewardXp: number;
  rewardItems: { itemId: string; amount: number; chance: number }[];
  staminaCost: number;
}

export interface ActivePatrol {
  slotId: number;
  mission: PatrolMission;
  assignedHeroIds: number[];
  startTime: number;
  endTime: number;
}

export interface CombatUnit {
  id: string;
  name: string;
  isEnemy: boolean;
  position: number; // 0, 1, 2, 3
  portrait: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  skills: HeroSkill[];
  statusEffects: { type: string; turns: number; power: number }[];
  heroRef?: Hero;
}

export interface CombatDungeon {
  id: string;
  name: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil' | 'Pesadilla';
  recommendedLevel: number;
  description: string;
  background: string;
  enemies: {
    name: string;
    portrait: string;
    hp: number;
    atk: number;
    def: number;
    skills: HeroSkill[];
  }[];
  rewards: {
    gold: number;
    xp: number;
    crystals: number;
    guaranteedItems: string[];
  };
}
