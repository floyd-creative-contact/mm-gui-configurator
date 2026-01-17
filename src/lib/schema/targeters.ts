import { TargeterSchema } from './types';

/**
 * Top 10 most commonly used MythicMobs targeters
 */
export const TARGETERS: Record<string, TargeterSchema> = {
  self: {
    name: 'self',
    aliases: ['@self'],
    category: 'Entity',
    description: 'Targets the caster itself',
    targetType: 'entity',
    options: {},
    examples: [
      '@self',
    ],
  },

  target: {
    name: 'target',
    aliases: ['@target'],
    category: 'Entity',
    description: 'Targets the caster\'s current target',
    targetType: 'entity',
    options: {},
    examples: [
      '@target',
    ],
  },

  trigger: {
    name: 'trigger',
    aliases: ['@trigger'],
    category: 'Entity',
    description: 'Targets the entity that triggered the skill',
    targetType: 'entity',
    options: {},
    examples: [
      '@trigger',
    ],
  },

  PIR: {
    name: 'PIR',
    aliases: ['playersInRadius', '@PIR', '@playersInRadius'],
    category: 'Entity',
    description: 'Targets all players within a radius',
    targetType: 'entity',
    options: {
      radius: {
        type: 'number',
        required: true,
        default: 5,
        description: 'Radius to search for players',
        min: 0,
        example: '10',
      },
      r: {
        type: 'number',
        required: false,
        description: 'Alias for radius',
        min: 0,
        example: '10',
      },
    },
    examples: [
      '@PIR{r=5}',
      '@playersInRadius{radius=10}',
      '@PIR{r=20}',
    ],
  },

  EIR: {
    name: 'EIR',
    aliases: ['entitiesInRadius', '@EIR', '@entitiesInRadius'],
    category: 'Entity',
    description: 'Targets all entities within a radius',
    targetType: 'entity',
    options: {
      radius: {
        type: 'number',
        required: true,
        default: 5,
        description: 'Radius to search for entities',
        min: 0,
        example: '10',
      },
      r: {
        type: 'number',
        required: false,
        description: 'Alias for radius',
        min: 0,
        example: '10',
      },
      type: {
        type: 'string',
        required: false,
        description: 'Entity type filter (e.g., ZOMBIE, SKELETON)',
        example: 'ZOMBIE',
      },
    },
    examples: [
      '@EIR{r=5}',
      '@entitiesInRadius{radius=10;type=ZOMBIE}',
      '@EIR{r=15}',
    ],
  },

  MIR: {
    name: 'MIR',
    aliases: ['mobsInRadius', '@MIR', '@mobsInRadius'],
    category: 'Entity',
    description: 'Targets all MythicMobs within a radius',
    targetType: 'entity',
    options: {
      radius: {
        type: 'number',
        required: true,
        default: 5,
        description: 'Radius to search for mobs',
        min: 0,
        example: '10',
      },
      r: {
        type: 'number',
        required: false,
        description: 'Alias for radius',
        min: 0,
        example: '10',
      },
      type: {
        type: 'string',
        required: false,
        description: 'MythicMob type filter',
        example: 'SkeletonKing',
      },
    },
    examples: [
      '@MIR{r=5}',
      '@mobsInRadius{radius=10}',
      '@MIR{r=20;type=SkeletonKing}',
    ],
  },

  LIR: {
    name: 'LIR',
    aliases: ['livingInRadius', '@LIR', '@livingInRadius'],
    category: 'Entity',
    description: 'Targets all living entities within a radius',
    targetType: 'entity',
    options: {
      radius: {
        type: 'number',
        required: true,
        default: 5,
        description: 'Radius to search for living entities',
        min: 0,
        example: '10',
      },
      r: {
        type: 'number',
        required: false,
        description: 'Alias for radius',
        min: 0,
        example: '10',
      },
      conditions: {
        type: 'array',
        required: false,
        description: 'Inline target conditions',
        example: '[ - hasaura{aura=Burning} true ]',
      },
    },
    examples: [
      '@LIR{r=5}',
      '@livingInRadius{radius=10}',
      '@LIR{r=3;conditions=[ - hasaura{aura=Burning} true ]}',
    ],
  },

  nearestPlayer: {
    name: 'nearestPlayer',
    aliases: ['@nearestPlayer', '@nearestplayer'],
    category: 'Entity',
    description: 'Targets the nearest player',
    targetType: 'entity',
    options: {
      radius: {
        type: 'number',
        required: false,
        default: 64,
        description: 'Maximum search radius',
        min: 0,
        example: '20',
      },
      r: {
        type: 'number',
        required: false,
        description: 'Alias for radius',
        min: 0,
        example: '20',
      },
    },
    examples: [
      '@nearestPlayer',
      '@nearestPlayer{r=20}',
      '@nearestplayer{radius=15}',
    ],
  },

  selflocation: {
    name: 'selflocation',
    aliases: ['@selflocation', '@selfLocation'],
    category: 'Location',
    description: 'Targets the caster\'s current location',
    targetType: 'location',
    options: {},
    examples: [
      '@selflocation',
    ],
  },

  targetlocation: {
    name: 'targetlocation',
    aliases: ['@targetlocation', '@targetLocation'],
    category: 'Location',
    description: 'Targets the current target\'s location',
    targetType: 'location',
    options: {},
    examples: [
      '@targetlocation',
    ],
  },

  forward: {
    name: 'forward',
    aliases: ['@forward'],
    category: 'Location',
    description: 'Targets a location forward from the caster\'s facing direction',
    targetType: 'location',
    options: {
      forward: {
        type: 'number',
        required: false,
        default: 5,
        description: 'Distance forward',
        min: 0,
        example: '10',
      },
      f: {
        type: 'number',
        required: false,
        description: 'Alias for forward',
        min: 0,
        example: '10',
      },
      sideoffset: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Horizontal offset (left/right)',
        example: '2',
      },
      so: {
        type: 'number',
        required: false,
        description: 'Alias for sideoffset',
        example: '2',
      },
      yoffset: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Vertical offset (up/down)',
        example: '1',
      },
      yo: {
        type: 'number',
        required: false,
        description: 'Alias for yoffset',
        example: '1',
      },
    },
    examples: [
      '@forward{f=5}',
      '@forward{forward=10;yoffset=2}',
      '@forward{f=7;so=2;yo=1}',
    ],
  },

  randomlocationInRadius: {
    name: 'randomlocationInRadius',
    aliases: ['@randomlocationInRadius', '@RLIR'],
    category: 'Location',
    description: 'Targets a random location within a radius',
    targetType: 'location',
    options: {
      radius: {
        type: 'number',
        required: true,
        default: 5,
        description: 'Radius to search for random location',
        min: 0,
        example: '10',
      },
      r: {
        type: 'number',
        required: false,
        description: 'Alias for radius',
        min: 0,
        example: '10',
      },
      minradius: {
        type: 'number',
        required: false,
        default: 0,
        description: 'Minimum radius (creates donut shape)',
        min: 0,
        example: '3',
      },
    },
    examples: [
      '@randomlocationInRadius{r=10}',
      '@RLIR{radius=15}',
      '@randomlocationInRadius{r=20;minradius=5}',
    ],
  },
};
