import { ConditionSchema } from './types';

/**
 * Top 20 most commonly used MythicMobs conditions
 */
export const CONDITIONS: Record<string, ConditionSchema> = {
  health: {
    name: 'health',
    aliases: ['hp'],
    category: 'Entity',
    description: 'Checks entity health value',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Health value to compare',
        example: '50',
      },
    },
    examples: [
      'health >50',
      'hp <20',
      'health >100',
    ],
  },

  healthpercent: {
    name: 'healthpercent',
    aliases: ['hppercent'],
    category: 'Entity',
    description: 'Checks entity health as percentage of max health',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Health percentage to compare (0-100)',
        min: 0,
        max: 100,
        example: '50',
      },
    },
    examples: [
      'healthpercent <50',
      'hppercent >75',
      'healthpercent =100',
    ],
  },

  incombat: {
    name: 'incombat',
    category: 'Entity',
    description: 'Checks if entity is in combat',
    valueType: 'boolean',
    examples: [
      'incombat true',
      'incombat false',
    ],
  },

  distance: {
    name: 'distance',
    aliases: ['d'],
    category: 'Compare',
    description: 'Checks distance between caster and target',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Distance to compare',
        min: 0,
        example: '10',
      },
    },
    examples: [
      'distance <10',
      'd >20',
      'distance =5',
    ],
  },

  day: {
    name: 'day',
    category: 'Time',
    description: 'Checks if it is daytime',
    valueType: 'boolean',
    examples: [
      'day true',
      'day false',
    ],
  },

  night: {
    name: 'night',
    category: 'Time',
    description: 'Checks if it is nighttime',
    valueType: 'boolean',
    examples: [
      'night true',
      'night false',
    ],
  },

  raining: {
    name: 'raining',
    category: 'World',
    description: 'Checks if it is raining in the world',
    valueType: 'boolean',
    examples: [
      'raining true',
      'raining false',
    ],
  },

  thundering: {
    name: 'thundering',
    category: 'World',
    description: 'Checks if there is a thunderstorm',
    valueType: 'boolean',
    examples: [
      'thundering true',
      'thundering false',
    ],
  },

  biome: {
    name: 'biome',
    category: 'Location',
    description: 'Checks the biome at target location',
    valueType: 'string',
    parameters: {
      value: {
        type: 'enum',
        required: true,
        description: 'Biome type',
        values: ['PLAINS', 'DESERT', 'FOREST', 'TAIGA', 'SWAMP', 'RIVER', 'OCEAN', 'MOUNTAINS', 'JUNGLE', 'NETHER', 'THE_END'],
        example: 'DESERT',
      },
    },
    examples: [
      'biome DESERT',
      'biome FOREST',
      'biome NETHER',
    ],
  },

  world: {
    name: 'world',
    aliases: ['w'],
    category: 'Location',
    description: 'Checks the world name',
    valueType: 'string',
    parameters: {
      value: {
        type: 'string',
        required: true,
        description: 'World name',
        example: 'world_nether',
      },
    },
    examples: [
      'world world_nether',
      'w world_the_end',
      'world my_custom_world',
    ],
  },

  hasaura: {
    name: 'hasaura',
    category: 'Entity',
    description: 'Checks if entity has a specific aura',
    valueType: 'boolean',
    parameters: {
      aura: {
        type: 'string',
        required: true,
        description: 'Aura name',
        example: 'Burning',
      },
    },
    examples: [
      'hasaura{aura=Burning} true',
      'hasaura{aura=Frozen} false',
    ],
  },

  haspotioneffect: {
    name: 'haspotioneffect',
    aliases: ['haspotion'],
    category: 'Entity',
    description: 'Checks if entity has a specific potion effect',
    valueType: 'boolean',
    parameters: {
      type: {
        type: 'enum',
        required: true,
        description: 'Potion effect type',
        values: ['POISON', 'SLOWNESS', 'SPEED', 'WEAKNESS', 'STRENGTH', 'REGENERATION', 'BLINDNESS', 'WITHER', 'GLOWING'],
        example: 'POISON',
      },
    },
    examples: [
      'haspotioneffect{type=POISON} true',
      'haspotion{type=SPEED} false',
    ],
  },

  lightlevel: {
    name: 'lightlevel',
    aliases: ['ll'],
    category: 'Location',
    description: 'Checks the light level at target location',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Light level (0-15)',
        min: 0,
        max: 15,
        example: '7',
      },
    },
    examples: [
      'lightlevel <7',
      'll >10',
      'lightlevel =0',
    ],
  },

  height: {
    name: 'height',
    aliases: ['y'],
    category: 'Location',
    description: 'Checks the Y coordinate',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Y coordinate',
        example: '64',
      },
    },
    examples: [
      'height >64',
      'y <0',
      'height =100',
    ],
  },

  mobtype: {
    name: 'mobtype',
    aliases: ['entitytype'],
    category: 'Entity',
    description: 'Checks entity type',
    valueType: 'string',
    parameters: {
      value: {
        type: 'string',
        required: true,
        description: 'Entity type (e.g., ZOMBIE, SKELETON)',
        example: 'ZOMBIE',
      },
    },
    examples: [
      'mobtype ZOMBIE',
      'entitytype SKELETON',
      'mobtype CREEPER',
    ],
  },

  mythicmobtype: {
    name: 'mythicmobtype',
    aliases: ['mmtype'],
    category: 'Entity',
    description: 'Checks MythicMob internal name',
    valueType: 'string',
    parameters: {
      value: {
        type: 'string',
        required: true,
        description: 'MythicMob internal name',
        example: 'SkeletonKing',
      },
    },
    examples: [
      'mythicmobtype SkeletonKing',
      'mmtype FireElemental',
      'mythicmobtype BossMinion',
    ],
  },

  isburning: {
    name: 'isburning',
    aliases: ['onfire'],
    category: 'Entity',
    description: 'Checks if entity is on fire',
    valueType: 'boolean',
    examples: [
      'isburning true',
      'onfire false',
    ],
  },

  lineofsight: {
    name: 'lineofsight',
    aliases: ['los'],
    category: 'Compare',
    description: 'Checks if caster has line of sight to target',
    valueType: 'boolean',
    examples: [
      'lineofsight true',
      'los false',
    ],
  },

  playerwithin: {
    name: 'playerwithin',
    aliases: ['pw'],
    category: 'Compare',
    description: 'Checks if any player is within a radius',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Radius to check',
        min: 0,
        example: '10',
      },
    },
    examples: [
      'playerwithin 10',
      'pw 20',
      'playerwithin 5',
    ],
  },

  level: {
    name: 'level',
    aliases: ['l'],
    category: 'Entity',
    description: 'Checks entity level',
    valueType: 'number',
    parameters: {
      value: {
        type: 'number',
        required: true,
        description: 'Level to compare',
        min: 0,
        example: '5',
      },
    },
    examples: [
      'level >5',
      'l <10',
      'level =1',
    ],
  },
};
