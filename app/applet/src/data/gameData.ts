import { Hero, GachaBanner, EquipmentBase, InventoryItem, PatrolMission, CombatDungeon } from '../types/game';

export const INITIAL_HEROES: Hero[] = [
  {
    id: 5,
    name: 'Pepe Loux',
    title: 'El Remero del Abismo',
    race: 'Dwarf',
    subRace: 'Mountain',
    heroClass: 'Guerrero',
    attribute: 'Profano',
    alianza: 'CaldoDeDragón',
    rarity: 'SSR',
    portrait: '/assets/portraits/pepe_loux.png',
    background: '/assets/backgrounds/fondo_pepe_loux.png',
    lore: 'Veterano guerrero enano curtido en las tabernas de Icespear. Experto en propinar golpes contundentes con su confiable remo encantado.',
    level: 1,
    xp: 0,
    stars: 2,
    awakening: 0,
    maxHealth: 160,
    currentHealth: 160,
    attack: 38,
    defense: 24,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: true,
    skins: [
      { id: 'default', name: 'Original', portrait: '/assets/portraits/pepe_loux.png', description: 'Atuendo tradicional de taberna.' },
      { id: 'atleti', name: 'Pepe Loux Atleti', portrait: '/assets/items/pepe_loux_atleti.png', description: 'Con la camiseta rojiblanca de gala.' },
      { id: 'barba', name: 'Pepe Barba de Acero', portrait: '/assets/items/pepe_barba.png', description: 'Barba trenzada para la guerra.' },
      { id: 'quitina', name: 'Pepe Quitina', portrait: '/assets/items/pepe_quitina.png', description: 'Armadura pesada de caparazón de araña.' }
    ],
    skills: [
      {
        name: 'Golpe de Remo',
        description: 'Asesta un tremendo tablazo a corta distancia causando daño físico contundente.',
        icon: '/assets/skills/golpe_de_remo.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 45,
        scalingAttack: 1.3,
        statusEffect: 'stun'
      },
      {
        name: 'Hachazo Enano',
        description: 'Corte demoledor que atraviesa las defensas del enemigo y causa sangrado.',
        icon: '/assets/skills/golpe_hacha.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1, 2],
        targetType: 'single_enemy',
        baseDamage: 55,
        scalingAttack: 1.5,
        statusEffect: 'bleed'
      },
      {
        name: 'Elemental de Aire',
        description: 'Invoca una ráfaga protectora que aumenta la defensa de todos los aliados.',
        icon: '/assets/skills/rezo_divino.png',
        usablePositions: [0, 1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'all_allies',
        baseDamage: 0,
        scalingAttack: 0,
        buffDefense: 15,
        healAmount: 25
      }
    ]
  },
  {
    id: 10,
    name: 'Edacorn',
    title: 'El Ángel Caído',
    race: 'Aasimar',
    subRace: 'Fallen',
    heroClass: 'BlackGuard',
    attribute: 'Profano',
    alianza: 'CaldoDeDragón',
    rarity: 'SSR',
    portrait: '/assets/portraits/edacorn_icono.png',
    background: '/assets/backgrounds/fondo_edacorn.png',
    lore: 'Portador de alas ennegrecidas y una espada envuelta en penumbra. Su poder se nutre del dolor ajeno.',
    level: 1,
    xp: 0,
    stars: 1,
    awakening: 0,
    maxHealth: 140,
    currentHealth: 140,
    attack: 45,
    defense: 16,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: true,
    skins: [
      { id: 'default', name: 'Ángel Sombrío', portrait: '/assets/portraits/edacorn_icono.png', description: 'Forma despierta del vengador caído.' },
      { id: 'c1', name: 'Edacorn C1 Justiciero', portrait: '/assets/portraits/edacorn_c1_icono.png', description: 'Resplandor divino corrompido.' }
    ],
    skills: [
      {
        name: 'Ataque Sorpresa',
        description: 'Se desliza entre las sombras y asesta una estocada letal en puntos vitales.',
        icon: '/assets/skills/golpe_hacha.png',
        usablePositions: [1, 2, 3],
        targetPositions: [1, 2, 3],
        targetType: 'single_enemy',
        baseDamage: 50,
        scalingAttack: 1.4,
        buffAttack: 10
      },
      {
        name: 'Ángel Caído',
        description: 'Desata una tormenta de plumas oscuras que devora a todos los adversarios.',
        icon: '/assets/skills/fragmento_del_dios_oscuro.png',
        usablePositions: [0, 1, 2],
        targetPositions: [0, 1, 2, 3],
        targetType: 'all_enemies',
        baseDamage: 40,
        scalingAttack: 1.2,
        statusEffect: 'burn'
      }
    ]
  },
  {
    id: 11,
    name: 'Magordito',
    title: 'Nigromante de la Buena Mesa',
    race: 'Human',
    subRace: 'Standard',
    heroClass: 'Mago',
    attribute: 'Arcano',
    alianza: 'CaldoDeDragón',
    rarity: 'SSR',
    portrait: '/assets/portraits/magordito.png',
    background: '/assets/backgrounds/fondo_magordito.png',
    lore: 'Mago corpulento obsesionado con banquetes suculentos y hechizos necróticos prohibidos.',
    level: 1,
    xp: 0,
    stars: 1,
    awakening: 0,
    maxHealth: 115,
    currentHealth: 115,
    attack: 52,
    defense: 12,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: true,
    skills: [
      {
        name: 'Rayo Necrótico',
        description: 'Dispara un haz espectral que pudre la carne del objetivo y anula sus curaciones.',
        icon: '/assets/skills/toque_necroitico.png',
        usablePositions: [2, 3],
        targetPositions: [0, 1, 2],
        targetType: 'single_enemy',
        baseDamage: 58,
        scalingAttack: 1.6,
        statusEffect: 'poison',
        soundFx: '/assets/audio/rayo_necrotico.mp3'
      },
      {
        name: 'Drenar Maldiciones',
        description: 'Absorbe los males de un enemigo causándole daño y curando a Magordito.',
        icon: '/assets/skills/fragmento_del_dios_oscuro.png',
        usablePositions: [1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'single_enemy',
        baseDamage: 35,
        scalingAttack: 1.1,
        healAmount: 40
      }
    ]
  },
  {
    id: 14,
    name: 'El Barón',
    title: 'Señor del Mercado Negro',
    race: 'Human',
    subRace: 'Vampiric',
    heroClass: 'Picaro',
    attribute: 'Profano',
    alianza: 'MercadoNegro',
    rarity: 'SSR',
    portrait: '/assets/portraits/el_baron_icono.png',
    background: '/assets/backgrounds/fondo_baron.png',
    lore: 'Elegante y despiadado aristócrata del bajo mundo comercial. Controla los hilos del contrabando en Icespear.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 130,
    currentHealth: 130,
    attack: 50,
    defense: 15,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Banquete de Sangre',
        description: 'Danza con florete que desgarra al adversario absorbiendo su vitalidad.',
        icon: '/assets/skills/toque_necroitico.png',
        usablePositions: [0, 1, 2],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 60,
        scalingAttack: 1.5,
        healAmount: 30,
        statusEffect: 'bleed',
        soundFx: '/assets/audio/baron_intro.wav'
      },
      {
        name: 'Sello del Contrabandista',
        description: 'Maldice al enemigo reduciendo severamente su ataque y precisión.',
        icon: '/assets/skills/mirada_himnotica.png',
        usablePositions: [1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'single_enemy',
        baseDamage: 25,
        scalingAttack: 0.8,
        statusEffect: 'stun'
      }
    ]
  },
  {
    id: 12,
    name: 'Arlem Díaz',
    title: 'Bardo del Destino',
    race: 'Human',
    subRace: 'Variant',
    heroClass: 'Bardo',
    attribute: 'Natural',
    alianza: 'CaldoDeDragón',
    rarity: 'SSR',
    portrait: '/assets/portraits/arlem_diaz_icono.png',
    background: '/assets/backgrounds/fondo_arlem_base.png',
    lore: 'Músico trotamundos cuyas melodías inspiran milagros en sus camaradas y desconciertan a los monstruos.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 120,
    currentHealth: 120,
    attack: 40,
    defense: 18,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skins: [
      { id: 'default', name: 'Bardo Clásico', portrait: '/assets/portraits/arlem_diaz_icono.png', description: 'Túnica y laúd feérico.' },
      { id: 'monje', name: 'Arlem Monje Zen', portrait: '/assets/portraits/arlem_diaz_monje_icono.png', description: 'Senda de la contemplación y los puños.' },
      { id: 'orco', name: 'Arlem Berserker Orco', portrait: '/assets/portraits/arlem_diaz_orco_icono.png', description: 'Canto de guerra salvaje y tambores tribales.' }
    ],
    skills: [
      {
        name: 'Inspiración Bárdica',
        description: 'Toca una pieza épica aumentando drásticamente el ataque y defensa del grupo.',
        icon: '/assets/skills/inspiracion_bardica.png',
        usablePositions: [2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'all_allies',
        baseDamage: 0,
        scalingAttack: 0,
        buffAttack: 20,
        buffDefense: 15,
        soundFx: '/assets/audio/rock_fire_arlem.mp3'
      },
      {
        name: 'Fuego Feérico',
        description: 'Envuelve a los enemigos en llamas luminiscentes reduciendo su defensa.',
        icon: '/assets/skills/ilusion_menor.png',
        usablePositions: [1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'all_enemies',
        baseDamage: 35,
        scalingAttack: 1.1,
        statusEffect: 'burn'
      }
    ]
  },
  {
    id: 1,
    name: 'Kairon',
    title: 'El Martillo Celestial',
    race: 'Tiefling',
    subRace: 'Asmodeus',
    heroClass: 'Paladin',
    attribute: 'Divino',
    alianza: 'CaldoDeDragón',
    rarity: 'SSR',
    portrait: '/assets/portraits/kairon.png',
    background: '/assets/backgrounds/icespear_banner.png',
    lore: 'Paladín con linaje infernal pero devoción inquebrantable a la justicia. Canaliza fuego radiante.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 170,
    currentHealth: 170,
    attack: 46,
    defense: 26,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Smite Celestial',
        description: 'Descarga un castigo sagrado implacable que purifica al infiel.',
        icon: '/assets/skills/smite_celestial.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 65,
        scalingAttack: 1.7,
        statusEffect: 'shock'
      },
      {
        name: 'Rezo Divino',
        description: 'Canaliza luz protectora sanando al aliado más malherido.',
        icon: '/assets/skills/rezo_divino.png',
        usablePositions: [0, 1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'single_ally',
        baseDamage: 0,
        scalingAttack: 0,
        healAmount: 55
      }
    ]
  },
  {
    id: 0,
    name: 'Prometeo',
    title: 'Portador de la Llama',
    race: 'Genasi',
    subRace: 'Fire',
    heroClass: 'Mago',
    attribute: 'Arcano',
    alianza: 'Magor',
    rarity: 'SR',
    portrait: '/assets/portraits/prometeo.png',
    lore: 'Hechicero ígneo que domina las brasas primigenias del volcán Magor.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 110,
    currentHealth: 110,
    attack: 42,
    defense: 10,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Proyectil Mágico',
        description: 'Lanza proyectiles arcanos teledirigidos que nunca fallan el blanco.',
        icon: '/assets/skills/proyectil_magico.png',
        usablePositions: [1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'single_enemy',
        baseDamage: 40,
        scalingAttack: 1.3
      }
    ]
  },
  {
    id: 2,
    name: 'Ragnavaldr',
    title: 'El Terror del Norte',
    race: 'Human',
    subRace: 'Goliath',
    heroClass: 'Barbaro',
    attribute: 'Natural',
    alianza: 'ElTribunal',
    rarity: 'SR',
    portrait: '/assets/portraits/ragnavaldr.png',
    lore: 'Berserker incansable cuyas heridas solo aumentan su furia en la batalla.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 180,
    currentHealth: 180,
    attack: 44,
    defense: 14,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Furia Nórdica',
        description: 'Carga frontal con hacha doble desgarrando las defensas.',
        icon: '/assets/skills/golpe_hacha.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 52,
        scalingAttack: 1.4,
        statusEffect: 'bleed'
      }
    ]
  },
  {
    id: 3,
    name: 'Barled',
    title: 'El Bastión de la Fe',
    race: 'Human',
    subRace: 'Standard',
    heroClass: 'Clerigo',
    attribute: 'Divino',
    alianza: 'ConsejoOmega',
    rarity: 'SR',
    portrait: '/assets/portraits/barled.png',
    lore: 'Clérigo consagrado a mantener la línea defensiva con bendiciones y milagros curativos.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 135,
    currentHealth: 135,
    attack: 30,
    defense: 22,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Palabra de Sanación',
        description: 'Restaura salud a un aliado y disipa efectos negativos.',
        icon: '/assets/skills/rezo_divino.png',
        usablePositions: [1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'single_ally',
        baseDamage: 0,
        scalingAttack: 0,
        healAmount: 48
      }
    ]
  },
  {
    id: 13,
    name: 'Chispo Deez',
    title: 'Ingeniero Balístico',
    race: 'Gnome',
    subRace: 'Hill',
    heroClass: 'Gunslinguer',
    attribute: 'Arcano',
    alianza: 'PortadoresDeMarca',
    rarity: 'SR',
    portrait: '/assets/portraits/chispo_deez_icono.png',
    lore: 'Pistolero gnómico que utiliza municiones infundidas con pólvora arcana y alquimia volátil.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 125,
    currentHealth: 125,
    attack: 43,
    defense: 15,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Disparo Perforante',
        description: 'Disparo de alta velocidad que impacta en la retaguardia enemiga.',
        icon: '/assets/skills/proyectil_magico.png',
        usablePositions: [2, 3],
        targetPositions: [2, 3],
        targetType: 'single_enemy',
        baseDamage: 48,
        scalingAttack: 1.35
      }
    ]
  },
  {
    id: 6,
    name: 'Alma',
    title: 'Druida de los Bosques',
    race: 'Elf',
    heroClass: 'Druida',
    attribute: 'Natural',
    alianza: 'Moonhaven',
    rarity: 'SR',
    portrait: '/assets/portraits/alma_fellas.png',
    lore: 'Guardián espiritual que convoca las fuerzas de la flora y la fauna de Moonhaven.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 130,
    currentHealth: 130,
    attack: 36,
    defense: 18,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Enredo Silvestre',
        description: 'Zarcillos espinosos inmovilizan al enemigo causándole daño persistente.',
        icon: '/assets/skills/inspiracion_bardica.png',
        usablePositions: [1, 2, 3],
        targetPositions: [0, 1, 2],
        targetType: 'single_enemy',
        baseDamage: 38,
        scalingAttack: 1.2,
        statusEffect: 'poison'
      }
    ]
  },
  {
    id: 8,
    name: 'Roxanne',
    title: 'Sombra de la Niebla',
    race: 'Vulpin',
    heroClass: 'Picaro',
    attribute: 'Profano',
    alianza: 'Antiguos',
    rarity: 'SR',
    portrait: '/assets/portraits/roxanne.png',
    lore: 'Espía mortífera que ataca desde los ángulos ciegos con dagas envenenadas.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 120,
    currentHealth: 120,
    attack: 46,
    defense: 14,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Corte Venenoso',
        description: 'Tajo rápido envenenado que debilita con cada segundo que pasa.',
        icon: '/assets/skills/golpe_hacha.png',
        usablePositions: [0, 1, 2],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 44,
        scalingAttack: 1.3,
        statusEffect: 'poison'
      }
    ]
  },
  {
    id: 9,
    name: 'Smurph Draco',
    title: 'Furia de Escamas',
    race: 'Dragonborn',
    subRace: 'Blue',
    heroClass: 'Barbaro',
    attribute: 'Arcano',
    alianza: 'CaldoDeDragón',
    rarity: 'SR',
    portrait: '/assets/portraits/smurph_draco.png',
    lore: 'Feroz guerrero dracónido que desata chispas de electricidad con cada rugido.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 165,
    currentHealth: 165,
    attack: 45,
    defense: 20,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Aliento Relámpago',
        description: 'Exhala una descarga eléctrica que sacude la primera fila enemiga.',
        icon: '/assets/skills/smite_celestial.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 46,
        scalingAttack: 1.35,
        statusEffect: 'shock'
      }
    ]
  },
  {
    id: 15,
    name: 'Giovani Vázquez',
    title: 'El Monje Callejero',
    race: 'Human',
    heroClass: 'Monje',
    attribute: 'Natural',
    alianza: 'VaPorLibre',
    rarity: 'SSR',
    portrait: '/assets/portraits/giovani_vazquez_icono.png',
    background: '/assets/backgrounds/fondo_giovani_vazquez.png',
    lore: 'Filósofo bohemio que fuma su pipa y pelea con una mezcla impredecible de artes marciales e ingenio.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 145,
    currentHealth: 145,
    attack: 48,
    defense: 22,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Pipa del Dragón',
        description: 'Sopla una densa humareda aromática que aturde y confunde al adversario.',
        icon: '/assets/skills/mirada_himnotica.png',
        usablePositions: [0, 1, 2],
        targetPositions: [0, 1, 2],
        targetType: 'single_enemy',
        baseDamage: 52,
        scalingAttack: 1.45,
        statusEffect: 'stun'
      },
      {
        name: 'Trago de Taberna',
        description: 'Bebe un elixir espirituoso recuperando salud y ganando un gran impulso de ataque.',
        icon: '/assets/skills/rezo_divino.png',
        usablePositions: [0, 1, 2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'self',
        baseDamage: 0,
        scalingAttack: 0,
        healAmount: 45,
        buffAttack: 25
      }
    ]
  },
  {
    id: 16,
    name: 'Raxxar',
    title: 'Brujo de Sangre',
    race: 'Leonin',
    heroClass: 'Brujo',
    attribute: 'Profano',
    alianza: 'MercadoNegro',
    rarity: 'SR',
    portrait: '/assets/portraits/raxxar.png',
    lore: 'Porta grimorios prohibidos y pactos demoníacos que convierten el sufrimiento en poder destructivo.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 125,
    currentHealth: 125,
    attack: 45,
    defense: 13,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Grimorio de la Muerte',
        description: 'Libera almas torturadas que azotan a toda la escuadra oponente.',
        icon: '/assets/skills/fragmento_del_dios_oscuro.png',
        usablePositions: [2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'all_enemies',
        baseDamage: 38,
        scalingAttack: 1.15,
        statusEffect: 'bleed'
      }
    ]
  },
  {
    id: 17,
    name: 'Aeliana',
    title: 'Luz de los Cielos',
    race: 'Elf',
    heroClass: 'Clerigo',
    attribute: 'Divino',
    alianza: 'ConsejoOmega',
    rarity: 'SSR',
    portrait: '/assets/portraits/aeliana.png',
    lore: 'Sacerdotisa suprema que ilumina la oscuridad con cánticos de esperanza y milagros celestiales.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 135,
    currentHealth: 135,
    attack: 42,
    defense: 22,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Aura de Redención',
        description: 'Baña al equipo entero en resplandor sanador continuo.',
        icon: '/assets/skills/rezo_divino.png',
        usablePositions: [2, 3],
        targetPositions: [0, 1, 2, 3],
        targetType: 'all_allies',
        baseDamage: 0,
        scalingAttack: 0,
        healAmount: 40,
        buffDefense: 10
      }
    ]
  },
  {
    id: 18,
    name: 'Arthorius',
    title: 'Espada de la Justicia',
    race: 'Human',
    heroClass: 'Paladin',
    attribute: 'Divino',
    alianza: 'CaldoDeDragón',
    rarity: 'SSR',
    portrait: '/assets/portraits/arthorius.png',
    lore: 'El capitán de la guardia de la orden del dragón. Su lealtad y su escudo son inquebrantables.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 175,
    currentHealth: 175,
    attack: 44,
    defense: 28,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Corte Justiciero',
        description: 'Acometida frontal con espada pesada bendecida.',
        icon: '/assets/skills/golpe_hacha.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 55,
        scalingAttack: 1.5,
        buffDefense: 10
      }
    ]
  },
  {
    id: 19,
    name: 'Widow',
    title: 'La Viuda Negra',
    race: 'Human',
    heroClass: 'Picaro',
    attribute: 'Profano',
    alianza: 'MercadoNegro',
    rarity: 'SSR',
    portrait: '/assets/portraits/widow_icono.png',
    lore: 'Asesina contratada por los señores del crimen. Nunca deja un rastro ni una víctima con pulso.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 125,
    currentHealth: 125,
    attack: 54,
    defense: 12,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Aguijón Letal',
        description: 'Inyecta toxinas mortales en los puntos vitales del oponente.',
        icon: '/assets/skills/toque_necroitico.png',
        usablePositions: [1, 2],
        targetPositions: [0, 1, 2],
        targetType: 'single_enemy',
        baseDamage: 62,
        scalingAttack: 1.6,
        statusEffect: 'poison'
      }
    ]
  },
  {
    id: 20,
    name: 'Borroco',
    title: 'Machacador Orco',
    race: 'HalfOrc',
    heroClass: 'Guerrero',
    attribute: 'Natural',
    alianza: 'Compañia',
    rarity: 'R',
    portrait: '/assets/portraits/borroco_icono.png',
    lore: 'Soldado de a pie contundente que solo entiende el lenguaje de la fuerza bruta.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 150,
    currentHealth: 150,
    attack: 34,
    defense: 16,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Mamporrazo',
        description: 'Golpea brutalmente al primer enemigo.',
        icon: '/assets/skills/golpe_de_remo.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 38,
        scalingAttack: 1.15
      }
    ]
  },
  {
    id: 21,
    name: 'Ferton',
    title: 'Navaja de Alquiler',
    race: 'Human',
    heroClass: 'Picaro',
    attribute: 'Profano',
    alianza: 'MercadoNegro',
    rarity: 'R',
    portrait: '/assets/portraits/ferton_icono.png',
    lore: 'Ratero ágil de los callejones oscuros de Icespear.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 110,
    currentHealth: 110,
    attack: 36,
    defense: 10,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Navajazo Rápido',
        description: 'Ataque veloz con daga oxidada.',
        icon: '/assets/skills/golpe_hacha.png',
        usablePositions: [0, 1, 2],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 36,
        scalingAttack: 1.2
      }
    ]
  },
  {
    id: 22,
    name: 'Gromock',
    title: 'Bárbaro de las Colinas',
    race: 'HalfOrc',
    heroClass: 'Barbaro',
    attribute: 'Natural',
    alianza: 'VaPorLibre',
    rarity: 'R',
    portrait: '/assets/portraits/gromock_icono.png',
    lore: 'Guerrero impulsivo con una porra de roble reforzado.',
    level: 1,
    xp: 0,
    stars: 0,
    awakening: 0,
    maxHealth: 155,
    currentHealth: 155,
    attack: 35,
    defense: 14,
    stamina: 100,
    maxStamina: 100,
    isUnlocked: false,
    skills: [
      {
        name: 'Golpe Aplastante',
        description: 'Descarga un mazo demoledor.',
        icon: '/assets/skills/golpe_de_remo.png',
        usablePositions: [0, 1],
        targetPositions: [0, 1],
        targetType: 'single_enemy',
        baseDamage: 37,
        scalingAttack: 1.2
      }
    ]
  }
];

export const GACHA_BANNERS: GachaBanner[] = [
  {
    id: 'mercado_negro',
    name: 'Banner del Mercado Negro',
    subtitle: '¡Probabilidad aumentada para El Barón & Raxxar!',
    costSingle: 3,
    costMulti: 30,
    featuredHeroIds: [14, 16, 19],
    bannerImage: '/assets/backgrounds/mansion_loux.png',
    background: '/assets/backgrounds/fondo_baron.png',
    description: 'Los señores del bajo mundo se congregan en la mansión. Consigue a El Barón y los oscuros hechiceros del Mercado Negro.'
  },
  {
    id: 'caldo_dragon',
    name: 'Banner Caldo de Dragón',
    subtitle: '¡Pepe Loux, Edacorn, Magordito y Arlem Díaz!',
    costSingle: 3,
    costMulti: 30,
    featuredHeroIds: [5, 10, 11, 12],
    bannerImage: '/assets/backgrounds/taverna_fondo.png',
    background: '/assets/backgrounds/fondo_pepe_loux.png',
    description: 'La mítica cofradía del Caldo de Dragón desata todo su potencial de combate y banquetes épicos.'
  },
  {
    id: 'sagrado_icespear',
    name: 'Banner Sagrado de Icespear',
    subtitle: '¡Kairon, Aeliana & Capitán Arthorius!',
    costSingle: 3,
    costMulti: 30,
    featuredHeroIds: [1, 17, 18],
    bannerImage: '/assets/backgrounds/icespear_banner.png',
    background: '/assets/backgrounds/icespear_combate_guardias.png',
    description: 'La fortaleza helada de Icespear llama a sus paladines y clérigos sagrados para combatir el mal.'
  }
];

export const INITIAL_EQUIPMENT_BASE: EquipmentBase[] = [
  {
    id: 'espada_hierro',
    name: 'Espada de Hierro',
    type: 'Arma',
    rarity: 'Común',
    icon: '/assets/items/weapons.png',
    baseAttack: 15,
    baseDefense: 2,
    baseHealth: 20,
    description: 'Hoja forjada en acero básico pero bien equilibrada.'
  },
  {
    id: 'espada_electrum',
    name: 'Espada de Electrum',
    type: 'Arma',
    rarity: 'Raro',
    icon: '/assets/items/lingote_electrum_app.png',
    baseAttack: 30,
    baseDefense: 5,
    baseHealth: 40,
    description: 'Aleación brillante de oro y plata que canaliza energía mágica.'
  },
  {
    id: 'espada_oro',
    name: 'Espada de Oro',
    type: 'Arma',
    rarity: 'Épico',
    icon: '/assets/items/lingote_oro_app.png',
    baseAttack: 50,
    baseDefense: 8,
    baseHealth: 60,
    description: 'Hoja de oro resplandeciente forjada por maestros artesanos.'
  },
  {
    id: 'espada_quitina',
    name: 'Espada de Quitina',
    type: 'Arma',
    rarity: 'Legendario',
    icon: '/assets/items/fragmento_de_quitina.png',
    baseAttack: 75,
    baseDefense: 15,
    baseHealth: 100,
    description: 'Filo forjado con los colmillos y el exoesqueleto de la Reina Araña.'
  },
  {
    id: 'ropera_hierro',
    name: 'Ropera de Hierro',
    type: 'Arma',
    rarity: 'Común',
    icon: '/assets/items/weapons.png',
    baseAttack: 18,
    baseDefense: 0,
    baseHealth: 10,
    description: 'Arma de estocada ágil para duelistas precisos.'
  },
  {
    id: 'ropera_quitina',
    name: 'Ropera de Quitina',
    type: 'Arma',
    rarity: 'Legendario',
    icon: '/assets/items/fragmento_de_quitina.png',
    baseAttack: 80,
    baseDefense: 10,
    baseHealth: 80,
    description: 'Ropera ligera y letal impregnada de veneno paralizante.'
  },
  {
    id: 'anillo_incrustado',
    name: 'Anillo del Incrustado',
    type: 'Accesorio',
    rarity: 'Raro',
    icon: '/assets/ui/marco_anillo.png',
    baseAttack: 10,
    baseDefense: 12,
    baseHealth: 50,
    description: 'Sortija con incrustaciones de zafiro que fortalece el aura defensiva.'
  },
  {
    id: 'anillo_mis_bolas',
    name: 'Anillo de Mis Bolas',
    type: 'Accesorio',
    rarity: 'Épico',
    icon: '/assets/ui/marco_anillo.png',
    baseAttack: 25,
    baseDefense: 20,
    baseHealth: 120,
    description: 'Poderoso artefacto enano imbuido con la bendición de la taberna Loux.'
  }
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'lingote_cobre',
    name: 'Lingote de Cobre',
    category: 'mineral',
    quantity: 15,
    rarity: 'R',
    icon: '/assets/items/lingote_cobre_app.png',
    description: 'Metal básico para herrería y mejoras de equipo.',
    sellPrice: 20
  },
  {
    id: 'lingote_plata',
    name: 'Lingote de Plata',
    category: 'mineral',
    quantity: 8,
    rarity: 'SR',
    icon: '/assets/items/lingote_plata_app.png',
    description: 'Metal noble utilizado en armas contra aberraciones y magia.',
    sellPrice: 50
  },
  {
    id: 'lingote_oro',
    name: 'Lingote de Oro',
    category: 'mineral',
    quantity: 5,
    rarity: 'SR',
    icon: '/assets/items/lingote_oro_app.png',
    description: 'Oro puro codiciado por mercaderes y forjadores.',
    sellPrice: 100
  },
  {
    id: 'lingote_mithrill',
    name: 'Lingote de Mithrill',
    category: 'mineral',
    quantity: 3,
    rarity: 'SSR',
    icon: '/assets/items/lingote_mithrill_app.png',
    description: 'Metal legendario, ultraligero y más resistente que el acero.',
    sellPrice: 250
  },
  {
    id: 'lingote_netherita',
    name: 'Lingote de Netherita',
    category: 'mineral',
    quantity: 2,
    rarity: 'UR',
    icon: '/assets/items/lingote_netherita_app.png',
    description: 'Sustancia indestructible forjada en las profundidades abisales.',
    sellPrice: 500
  },
  {
    id: 'fragmento_quitina',
    name: 'Fragmento de Quitina',
    category: 'mineral',
    quantity: 6,
    rarity: 'SR',
    icon: '/assets/items/fragmento_de_quitina.png',
    description: 'Placas quitinosas de monstruos gigantes aptas para forjar equipo letal.',
    sellPrice: 75
  },
  {
    id: 'amatista',
    name: 'Amatista',
    category: 'gema',
    quantity: 5,
    rarity: 'SR',
    icon: '/assets/items/amatista_app.png',
    description: 'Gema violeta cargada de afinidad mágica con lo arcano.',
    sellPrice: 80
  },
  {
    id: 'rubi',
    name: 'Rubí',
    category: 'gema',
    quantity: 4,
    rarity: 'SR',
    icon: '/assets/items/rubi_app.png',
    description: 'Gema carmesí con el fulgor ardiente de las llamas.',
    sellPrice: 120
  },
  {
    id: 'zafiro',
    name: 'Zafiro',
    category: 'gema',
    quantity: 4,
    rarity: 'SR',
    icon: '/assets/items/zafiro_app.png',
    description: 'Gema azul profunda que irradia tranquilidad y concentración.',
    sellPrice: 120
  },
  {
    id: 'diamante',
    name: 'Diamante',
    category: 'gema',
    quantity: 2,
    rarity: 'SSR',
    icon: '/assets/items/diamante.png',
    description: 'Piedra preciosa de dureza absoluta para engarces de élite.',
    sellPrice: 300
  },
  {
    id: 'grimorio_luna_oscura',
    name: 'Grimorio de la Luna Oscura',
    category: 'grimorio',
    quantity: 2,
    rarity: 'SR',
    icon: '/assets/items/grimorio_luna_oscura_app.png',
    description: 'Tomo prohibido con cánticos para potenciar hechizos oscuros.',
    sellPrice: 150
  },
  {
    id: 'grimorio_luz_solar',
    name: 'Grimorio de la Luz Solar',
    category: 'grimorio',
    quantity: 2,
    rarity: 'SR',
    icon: '/assets/items/grimorio_luz_solar_app.png',
    description: 'Tratado sagrado de bendiciones radiantes.',
    sellPrice: 150
  },
  {
    id: 'sello_caldo_dragon',
    name: 'Sello Caldo de Dragón',
    category: 'grimorio',
    quantity: 3,
    rarity: 'SSR',
    icon: '/assets/items/sello_caldo_de_dragon.png',
    description: 'Insignia heráldica de la hermandad tabernera más célebre.',
    sellPrice: 200
  },
  {
    id: 'kit_herreria',
    name: 'Kit de Herrería',
    category: 'kit',
    quantity: 5,
    rarity: 'SR',
    icon: '/assets/items/kit_de_herreria_app.png',
    description: 'Herramientas de forja profesionales para refinar espadas y armaduras.',
    sellPrice: 60
  },
  {
    id: 'kit_joyeria',
    name: 'Kit de Joyería',
    category: 'kit',
    quantity: 3,
    rarity: 'SR',
    icon: '/assets/items/kit_de_joyeria_app.png',
    description: 'Pinzas de precisión para engarzar gemas en anillos y collares.',
    sellPrice: 80
  },
  {
    id: 'frasco_xp',
    name: 'Frasco de XP',
    category: 'xp',
    quantity: 12,
    rarity: 'SR',
    icon: '/assets/items/orbe_experiencia.png',
    description: 'Otorga 150 puntos de experiencia al héroe que lo consuma.',
    sellPrice: 30,
    effect: { type: 'xp', value: 150, description: '+150 XP al héroe' }
  },
  {
    id: 'orbe_experiencia',
    name: 'Orbe de Experiencia Mayor',
    category: 'xp',
    quantity: 4,
    rarity: 'SSR',
    icon: '/assets/items/orbe_experiencia.png',
    description: 'Esfera condensada que otorga 600 puntos de XP inmediata.',
    sellPrice: 100,
    effect: { type: 'xp', value: 600, description: '+600 XP al héroe' }
  },
  {
    id: 'pan',
    name: 'Pan Rústico',
    category: 'ingrediente',
    quantity: 10,
    rarity: 'R',
    icon: '/assets/items/pan.png',
    description: 'Miga esponjosa horneada en la taberna.',
    sellPrice: 10
  },
  {
    id: 'queso',
    name: 'Queso Curado',
    category: 'ingrediente',
    quantity: 8,
    rarity: 'R',
    icon: '/assets/items/queso.png',
    description: 'Queso fuerte de cabra de las montañas de Icespear.',
    sellPrice: 15
  },
  {
    id: 'ajo',
    name: 'Ajo Silvestre',
    category: 'ingrediente',
    quantity: 12,
    rarity: 'R',
    icon: '/assets/items/ajo.png',
    description: 'Dientes de ajo aromáticos para condimentar banquetes.',
    sellPrice: 10
  },
  {
    id: 'pan_ajo',
    name: 'Pan de Ajo Crujiente',
    category: 'comida',
    quantity: 3,
    rarity: 'SR',
    icon: '/assets/items/panes_de_ajo.png',
    description: 'Delicioso plato horneado: +15% Ataque en el siguiente combate.',
    sellPrice: 40,
    effect: { type: 'buff', value: 15, description: '+15% Ataque' }
  },
  {
    id: 'hamburguesa',
    name: 'Hamburguesa Loux Deluxe',
    category: 'comida',
    quantity: 2,
    rarity: 'SSR',
    icon: '/assets/items/hamburguesa.png',
    description: 'Banquete calórico: +25% Ataque y +20% Vida Máxima en combate.',
    sellPrice: 80,
    effect: { type: 'buff', value: 25, description: '+25% ATK & +20% HP' }
  },
  {
    id: 'tortilla_patata',
    name: 'Tortilla de Patatas',
    category: 'comida',
    quantity: 3,
    rarity: 'SR',
    icon: '/assets/items/tortilla_patata.png',
    description: 'Receta tradicional que restaura al 100% el aguante de la patrulla.',
    sellPrice: 45,
    effect: { type: 'stamina', value: 100, description: 'Restaura todo el aguante' }
  }
];

export const PATROL_MISSIONS: PatrolMission[] = [
  {
    id: 'patrol_icespear',
    name: 'Ronda de Guardia en Icespear',
    location: 'Murallas de Icespear',
    description: 'Vigila las inmediaciones de la ciudadela y repele bandidos menores.',
    requiredHeroes: 2,
    minStars: 0,
    durationSeconds: 30,
    rewardGold: 180,
    rewardXp: 80,
    staminaCost: 15,
    rewardItems: [
      { itemId: 'lingote_cobre', amount: 2, chance: 0.9 },
      { itemId: 'frasco_xp', amount: 1, chance: 0.7 },
      { itemId: 'pan', amount: 2, chance: 0.6 }
    ]
  },
  {
    id: 'patrol_moonhaven',
    name: 'Expedición a las Arboledas de Moonhaven',
    location: 'Bosques de Moonhaven',
    description: 'Recolecta hierbas raras y gemas en las profundidades del bosque feérico.',
    requiredHeroes: 3,
    minStars: 1,
    durationSeconds: 90,
    rewardGold: 450,
    rewardXp: 220,
    staminaCost: 25,
    rewardItems: [
      { itemId: 'amatista', amount: 1, chance: 0.75 },
      { itemId: 'lingote_plata', amount: 2, chance: 0.8 },
      { itemId: 'frasco_xp', amount: 2, chance: 0.85 }
    ]
  },
  {
    id: 'patrol_ruinas_omega',
    name: 'Incursión a las Ruinas Omega',
    location: 'Antiguo Templo Subterráneo',
    description: 'Adéntrate en las ruinas mecánicas olvidadas para recuperar metales arcanos.',
    requiredHeroes: 4,
    minStars: 1,
    durationSeconds: 180,
    rewardGold: 850,
    rewardXp: 450,
    staminaCost: 35,
    rewardItems: [
      { itemId: 'lingote_mithrill', amount: 1, chance: 0.6 },
      { itemId: 'zafiro', amount: 1, chance: 0.7 },
      { itemId: 'orbe_experiencia', amount: 1, chance: 0.5 }
    ]
  },
  {
    id: 'patrol_mercado_negro',
    name: 'Emboscada en los Callejones del Mercado Negro',
    location: 'Bajos Fondos de Icespear',
    description: 'Interrumpe una entrega clandestina y confisca tesoros y joyas preciosas.',
    requiredHeroes: 4,
    minStars: 2,
    durationSeconds: 300,
    rewardGold: 1600,
    rewardXp: 800,
    staminaCost: 45,
    rewardItems: [
      { itemId: 'diamante', amount: 1, chance: 0.5 },
      { itemId: 'lingote_netherita', amount: 1, chance: 0.35 },
      { itemId: 'orbe_experiencia', amount: 2, chance: 0.7 }
    ]
  }
];

export const COMBAT_DUNGEONS: CombatDungeon[] = [
  {
    id: 'dungeon_guardias',
    name: 'Pabellón de Guardias de Icespear',
    difficulty: 'Fácil',
    recommendedLevel: 1,
    description: 'Enfrentamiento de entrenamiento contra la guarnición armada de la ciudadela.',
    background: '/assets/backgrounds/icespear_combate_guardias.png',
    enemies: [
      {
        name: 'Guardia Escudero',
        portrait: '/assets/portraits/borroco_icono.png',
        hp: 120,
        atk: 22,
        def: 12,
        skills: [{
          name: 'Golpe de Escudo',
          description: 'Embate que aturde al objetivo.',
          usablePositions: [0, 1],
          targetPositions: [0, 1],
          targetType: 'single_enemy',
          baseDamage: 24,
          scalingAttack: 1.0,
          statusEffect: 'stun'
        }]
      },
      {
        name: 'Ballestero de Icespear',
        portrait: '/assets/portraits/ferton_icono.png',
        hp: 95,
        atk: 28,
        def: 8,
        skills: [{
          name: 'Virote Pesado',
          description: 'Disparo a distancia certero.',
          usablePositions: [2, 3],
          targetPositions: [0, 1, 2, 3],
          targetType: 'single_enemy',
          baseDamage: 30,
          scalingAttack: 1.1
        }]
      },
      {
        name: 'Capitán de Patrulla',
        portrait: '/assets/portraits/gromock_icono.png',
        hp: 160,
        atk: 32,
        def: 16,
        skills: [{
          name: 'Tajo Furioso',
          description: 'Ataque pesado que causa sangrado.',
          usablePositions: [0, 1],
          targetPositions: [0, 1],
          targetType: 'single_enemy',
          baseDamage: 36,
          scalingAttack: 1.2,
          statusEffect: 'bleed'
        }]
      }
    ],
    rewards: {
      gold: 350,
      xp: 150,
      crystals: 5,
      guaranteedItems: ['lingote_cobre', 'frasco_xp']
    }
  },
  {
    id: 'dungeon_cripta',
    name: 'Cripta del Nigromante Olvidado',
    difficulty: 'Media',
    recommendedLevel: 5,
    description: 'Catacumbas infestadas de aberraciones no-muertas y venenos mágicos.',
    background: '/assets/backgrounds/mazmorra_taverna_icespear.png',
    enemies: [
      {
        name: 'Esqueleto Acorazado',
        portrait: '/assets/portraits/raxxar.png',
        hp: 180,
        atk: 36,
        def: 20,
        skills: [{
          name: 'Espadazo Decrépito',
          description: 'Golpe de hueso y hierro.',
          usablePositions: [0, 1],
          targetPositions: [0, 1],
          targetType: 'single_enemy',
          baseDamage: 40,
          scalingAttack: 1.2
        }]
      },
      {
        name: 'Hechicero de las Sombras',
        portrait: '/assets/portraits/magordito.png',
        hp: 140,
        atk: 45,
        def: 12,
        skills: [{
          name: 'Danza de Almas',
          description: 'Descarga mágica a dos objetivos.',
          usablePositions: [2, 3],
          targetPositions: [0, 1, 2, 3],
          targetType: 'all_enemies',
          baseDamage: 32,
          scalingAttack: 1.1,
          statusEffect: 'burn'
        }]
      },
      {
        name: 'Sombra Necrótica',
        portrait: '/assets/portraits/widow_icono.png',
        hp: 130,
        atk: 48,
        def: 14,
        skills: [{
          name: 'Toque de Ultratumba',
          description: 'Pudre la energía vital del objetivo.',
          usablePositions: [1, 2],
          targetPositions: [0, 1],
          targetType: 'single_enemy',
          baseDamage: 45,
          scalingAttack: 1.3,
          statusEffect: 'poison'
        }]
      }
    ],
    rewards: {
      gold: 800,
      xp: 350,
      crystals: 8,
      guaranteedItems: ['lingote_plata', 'amatista', 'frasco_xp']
    }
  },
  {
    id: 'dungeon_cryovain',
    name: 'Pico Nevado: Cryovain el Tirano de Hielo',
    difficulty: 'Pesadilla',
    recommendedLevel: 10,
    description: '¡Jefe Legendario! El dragón blanco ancestral Cryovain congela la cumbre con su aliento glacial.',
    background: '/assets/backgrounds/cuevas_de_icespear.png',
    enemies: [
      {
        name: 'Gólem de Escarcha',
        portrait: '/assets/portraits/ragnavaldr.png',
        hp: 280,
        atk: 40,
        def: 30,
        skills: [{
          name: 'Pisada Glacial',
          description: 'Terremoto de hielo que golpea a todos los héroes.',
          usablePositions: [0, 1],
          targetPositions: [0, 1, 2, 3],
          targetType: 'all_enemies',
          baseDamage: 35,
          scalingAttack: 1.0,
          statusEffect: 'freeze'
        }]
      },
      {
        name: 'Cryovain, El Dragón Blanco',
        portrait: '/assets/portraits/smurph_draco.png',
        hp: 550,
        atk: 65,
        def: 35,
        skills: [
          {
            name: 'Ventisca Cero Absoluto',
            description: 'Tormenta helada que congela y diezma a todo el grupo.',
            usablePositions: [0, 1, 2, 3],
            targetPositions: [0, 1, 2, 3],
            targetType: 'all_enemies',
            baseDamage: 55,
            scalingAttack: 1.4,
            statusEffect: 'freeze'
          },
          {
            name: 'Dentellada Titánica',
            description: 'Mordisco colosal que aplasta huesos.',
            usablePositions: [0, 1],
            targetPositions: [0, 1],
            targetType: 'single_enemy',
            baseDamage: 80,
            scalingAttack: 1.6,
            statusEffect: 'bleed'
          }
        ]
      }
    ],
    rewards: {
      gold: 2500,
      xp: 1200,
      crystals: 25,
      guaranteedItems: ['lingote_mithrill', 'lingote_netherita', 'diamante', 'orbe_experiencia']
    }
  }
];

export const TAVERN_DIALOGUES = [
  {
    speaker: 'Pepe Loux',
    portrait: '/assets/portraits/pepe_loux.png',
    text: '¡Salud, camarada! En esta taberna servimos cerveza enana y el mejor caldo de dragón del continente. ¡Coge asiento antes de que Magordito se coma la última bandeja de pan de ajo!'
  },
  {
    speaker: 'Magordito',
    portrait: '/assets/portraits/magordito.png',
    text: 'Dicen que la nigromancia desgasta el alma, pero lo que de verdad desgasta es no merendar cada dos horas. ¿Has probado las hamburguesas de la posada? ¡Resucitan a un muerto!'
  },
  {
    speaker: 'Giovani Vázquez',
    portrait: '/assets/portraits/giovani_vazquez_icono.png',
    text: 'Pasa, pasa. Entre bocanada y bocanada de tabaco miro las estrellas. El Mercado Negro trama algo gordo con El Barón en la mansión noble... si tienes agallas, sus cofres tienen oro a raudales.'
  },
  {
    speaker: 'Arlem Díaz',
    portrait: '/assets/portraits/arlem_diaz_icono.png',
    text: 'Las canciones recuerdan lo que las espadas olvidan. ¿Escuchas ese ritmo en el fuego? ¡Es el pulso del Caldo de Dragón!'
  }
];
