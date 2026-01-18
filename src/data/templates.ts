import { MobConfig, MetaskillConfig } from '../types/mob';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'boss' | 'utility';
  data: MobConfig | MetaskillConfig;
  type: 'mob' | 'metaskill';
}

export const MOB_TEMPLATES: Template[] = [
  {
    id: 'basic-zombie',
    name: 'Enhanced Zombie',
    description: 'A basic zombie with increased stats and simple attack skills',
    category: 'basic',
    type: 'mob',
    data: {
      internalName: 'EnhancedZombie',
      type: 'ZOMBIE',
      display: '&aEnhanced Zombie',
      health: 40,
      damage: 8,
      armor: 2,
      skills: [
        {
          mechanic: 'damage',
          parameters: { amount: 8 },
          targeter: { type: 'target' },
          trigger: 'onAttack',
          raw: '- damage{amount=8} @target ~onAttack'
        }
      ]
    } as MobConfig
  },
  {
    id: 'fire-boss',
    name: 'Fire Boss',
    description: 'A powerful fire-themed boss with area damage and a boss bar',
    category: 'boss',
    type: 'mob',
    data: {
      internalName: 'FireBoss',
      type: 'BLAZE',
      display: '&c&lFire Lord',
      health: 500,
      damage: 20,
      armor: 10,
      bossBar: {
        enabled: true,
        title: '&c&lFire Lord',
        color: 'RED',
        style: 'SEGMENTED_10'
      },
      skills: [
        {
          mechanic: 'damage',
          parameters: { amount: 15, type: 'fire' },
          targeter: { type: 'PIR', options: { r: 5 } },
          trigger: 'onTimer:100',
          raw: '- damage{amount=15;type=fire} @PIR{r=5} ~onTimer:100'
        },
        {
          mechanic: 'effect:particles',
          parameters: { p: 'flame', a: 50, speed: 0.1 },
          targeter: { type: 'self' },
          trigger: 'onTimer:20',
          raw: '- effect:particles{p=flame;a=50;speed=0.1} @self ~onTimer:20'
        }
      ],
      options: {
        MovementSpeed: 0.3,
        KnockbackResistance: 0.8,
        PreventOtherDrops: true
      }
    } as MobConfig
  },
  {
    id: 'healer-support',
    name: 'Healer Support',
    description: 'A support mob that heals nearby allies',
    category: 'utility',
    type: 'mob',
    data: {
      internalName: 'HealerSupport',
      type: 'VILLAGER',
      display: '&b&lHealer',
      health: 60,
      damage: 2,
      skills: [
        {
          mechanic: 'heal',
          parameters: { amount: 10 },
          targeter: { type: 'MIR', options: { r: 10 } },
          trigger: 'onTimer:60',
          raw: '- heal{amount=10} @MIR{r=10} ~onTimer:60'
        },
        {
          mechanic: 'effect:particles',
          parameters: { p: 'heart', a: 10 },
          targeter: { type: 'MIR', options: { r: 10 } },
          trigger: 'onTimer:60',
          raw: '- effect:particles{p=heart;a=10} @MIR{r=10} ~onTimer:60'
        }
      ]
    } as MobConfig
  },
  {
    id: 'summoner-boss',
    name: 'Summoner Boss',
    description: 'Boss that summons minions when damaged',
    category: 'boss',
    type: 'mob',
    data: {
      internalName: 'SummonerBoss',
      type: 'EVOKER',
      display: '&5&lDark Summoner',
      health: 300,
      damage: 15,
      armor: 8,
      bossBar: {
        enabled: true,
        title: '&5&lDark Summoner',
        color: 'PURPLE',
        style: 'SEGMENTED_12'
      },
      skills: [
        {
          mechanic: 'summon',
          parameters: { type: 'ZOMBIE', amount: 3 },
          targeter: { type: 'self' },
          trigger: 'onDamaged',
          healthModifier: { operator: '<', value: '50%' },
          chance: 0.3,
          raw: '- summon{type=ZOMBIE;amount=3} @self ~onDamaged <50% 0.3'
        },
        {
          mechanic: 'damage',
          parameters: { amount: 20, type: 'magic' },
          targeter: { type: 'target' },
          trigger: 'onAttack',
          raw: '- damage{amount=20;type=magic} @target ~onAttack'
        }
      ]
    } as MobConfig
  }
];

export const METASKILL_TEMPLATES: Template[] = [
  {
    id: 'aoe-damage',
    name: 'AOE Damage Burst',
    description: 'Area of effect damage with visual effects',
    category: 'basic',
    type: 'metaskill',
    data: {
      internalName: 'AOEBurst',
      cooldown: 5,
      skills: [
        {
          mechanic: 'damage',
          parameters: { amount: '<skill.damage>' },
          targeter: { type: 'PIR', options: { r: '<skill.radius>' } },
          raw: '- damage{amount=<skill.damage>} @PIR{r=<skill.radius>}'
        },
        {
          mechanic: 'effect:particles',
          parameters: { p: 'explosion', a: 30 },
          targeter: { type: 'self' },
          raw: '- effect:particles{p=explosion;a=30} @self'
        },
        {
          mechanic: 'sound',
          parameters: { s: 'ENTITY_GENERIC_EXPLODE' },
          targeter: { type: 'self' },
          raw: '- sound{s=ENTITY_GENERIC_EXPLODE} @self'
        }
      ]
    } as MetaskillConfig
  },
  {
    id: 'heal-allies',
    name: 'Heal Nearby Allies',
    description: 'Heals all nearby friendly mobs',
    category: 'utility',
    type: 'metaskill',
    data: {
      internalName: 'HealAllies',
      cooldown: 10,
      skills: [
        {
          mechanic: 'heal',
          parameters: { amount: '<skill.healAmount>' },
          targeter: { type: 'MIR', options: { r: 10 } },
          raw: '- heal{amount=<skill.healAmount>} @MIR{r=10}'
        },
        {
          mechanic: 'effect:particles',
          parameters: { p: 'heart', a: 15 },
          targeter: { type: 'MIR', options: { r: 10 } },
          raw: '- effect:particles{p=heart;a=15} @MIR{r=10}'
        },
        {
          mechanic: 'message',
          parameters: { m: '&aHealed nearby allies!' },
          targeter: { type: 'trigger' },
          raw: '- message{m="&aHealed nearby allies!"} @trigger'
        }
      ]
    } as MetaskillConfig
  },
  {
    id: 'lightning-strike',
    name: 'Lightning Strike',
    description: 'Strikes target with lightning and deals damage',
    category: 'basic',
    type: 'metaskill',
    data: {
      internalName: 'LightningStrike',
      cooldown: 8,
      skills: [
        {
          mechanic: 'lightning',
          targeter: { type: 'target' },
          raw: '- lightning @target'
        },
        {
          mechanic: 'damage',
          parameters: { amount: 25, type: 'lightning' },
          targeter: { type: 'target' },
          raw: '- damage{amount=25;type=lightning} @target'
        },
        {
          mechanic: 'throw',
          parameters: { velocity: 5, velocityY: 2 },
          targeter: { type: 'target' },
          raw: '- throw{velocity=5;velocityY=2} @target'
        }
      ]
    } as MetaskillConfig
  },
  {
    id: 'teleport-behind',
    name: 'Teleport Behind Target',
    description: 'Teleports behind the target for a surprise attack',
    category: 'utility',
    type: 'metaskill',
    data: {
      internalName: 'TeleportBehind',
      cooldown: 15,
      skills: [
        {
          mechanic: 'teleport',
          targeter: { type: 'targetlocation' },
          raw: '- teleport @targetlocation'
        },
        {
          mechanic: 'damage',
          parameters: { amount: 30 },
          targeter: { type: 'target' },
          raw: '- damage{amount=30} @target'
        },
        {
          mechanic: 'effect:particles',
          parameters: { p: 'portal', a: 20 },
          targeter: { type: 'self' },
          raw: '- effect:particles{p=portal;a=20} @self'
        }
      ]
    } as MetaskillConfig
  }
];

export const ALL_TEMPLATES = [...MOB_TEMPLATES, ...METASKILL_TEMPLATES];

export function getTemplatesByType(type: 'mob' | 'metaskill'): Template[] {
  return ALL_TEMPLATES.filter(t => t.type === type);
}

export function getTemplatesByCategory(category: 'basic' | 'boss' | 'utility'): Template[] {
  return ALL_TEMPLATES.filter(t => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return ALL_TEMPLATES.find(t => t.id === id);
}
