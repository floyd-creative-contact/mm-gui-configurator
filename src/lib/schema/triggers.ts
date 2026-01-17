import { TriggerSchema } from './types';

/**
 * All MythicMobs triggers (46 total)
 * Based on official documentation
 */
export const TRIGGERS: Record<string, TriggerSchema> = {
  onSpawn: {
    name: 'onSpawn',
    description: 'When mob spawns (once)',
    examples: ['~onSpawn'],
  },

  onDeath: {
    name: 'onDeath',
    description: 'When mob dies (once)',
    examples: ['~onDeath'],
  },

  onAttack: {
    name: 'onAttack',
    description: 'When mob attacks',
    examples: ['~onAttack'],
  },

  onDamaged: {
    name: 'onDamaged',
    description: 'When mob takes damage',
    examples: ['~onDamaged'],
  },

  onCombat: {
    name: 'onCombat',
    description: 'Default - attack or damaged',
    examples: ['~onCombat'],
  },

  onTimer: {
    name: 'onTimer',
    description: 'Every X ticks (20 ticks = 1 sec)',
    hasValue: true,
    valueType: 'number',
    examples: ['~onTimer:20', '~onTimer:100', '~onTimer:200'],
  },

  onInteract: {
    name: 'onInteract',
    description: 'Player right-clicks mob',
    examples: ['~onInteract'],
  },

  onKill: {
    name: 'onKill',
    description: 'Mob kills any target',
    examples: ['~onKill'],
  },

  onKillPlayer: {
    name: 'onKillPlayer',
    description: 'Mob kills a player',
    examples: ['~onKillPlayer'],
  },

  onPlayerDeath: {
    name: 'onPlayerDeath',
    description: 'Nearby player dies',
    examples: ['~onPlayerDeath'],
  },

  onEnterCombat: {
    name: 'onEnterCombat',
    description: 'Combat starts',
    examples: ['~onEnterCombat'],
  },

  onDropCombat: {
    name: 'onDropCombat',
    description: 'Combat ends',
    examples: ['~onDropCombat'],
  },

  onChangeTarget: {
    name: 'onChangeTarget',
    description: 'Target changes',
    examples: ['~onChangeTarget'],
  },

  onExplode: {
    name: 'onExplode',
    description: 'Mob explodes (creepers)',
    examples: ['~onExplode'],
  },

  onTeleport: {
    name: 'onTeleport',
    description: 'Mob teleports (endermen)',
    examples: ['~onTeleport'],
  },

  onSignal: {
    name: 'onSignal',
    description: 'Receives named signal',
    hasValue: true,
    valueType: 'string',
    examples: ['~onSignal:ACTIVATE', '~onSignal:PHASE2', '~onSignal:RAGE'],
  },

  onShoot: {
    name: 'onShoot',
    description: 'Fires projectile',
    examples: ['~onShoot'],
  },

  onBowHit: {
    name: 'onBowHit',
    description: 'Arrow hits target',
    examples: ['~onBowHit'],
  },

  onSwing: {
    name: 'onSwing',
    description: 'Swings arm',
    examples: ['~onSwing'],
  },

  onBlock: {
    name: 'onBlock',
    description: 'Blocks with shield',
    examples: ['~onBlock'],
  },

  onCrouch: {
    name: 'onCrouch',
    description: 'Starts crouching/sneaking',
    examples: ['~onCrouch'],
  },

  onUncrouch: {
    name: 'onUncrouch',
    description: 'Stops crouching/sneaking',
    examples: ['~onUncrouch'],
  },

  onReady: {
    name: 'onReady',
    description: 'Fully initialized',
    examples: ['~onReady'],
  },

  onUse: {
    name: 'onUse',
    description: 'Item use (Crucible integration)',
    examples: ['~onUse'],
  },

  onConsume: {
    name: 'onConsume',
    description: 'Item consumed',
    examples: ['~onConsume'],
  },

  onEquip: {
    name: 'onEquip',
    description: 'Equipment added',
    examples: ['~onEquip'],
  },

  onUnequip: {
    name: 'onUnequip',
    description: 'Equipment removed',
    examples: ['~onUnequip'],
  },

  onLoad: {
    name: 'onLoad',
    description: 'Chunk loads',
    examples: ['~onLoad'],
  },

  onFirstSpawn: {
    name: 'onFirstSpawn',
    description: 'Very first spawn',
    examples: ['~onFirstSpawn'],
  },

  onCreativePunch: {
    name: 'onCreativePunch',
    description: 'Creative mode punch',
    examples: ['~onCreativePunch'],
  },

  onJump: {
    name: 'onJump',
    description: 'Mob jumps',
    examples: ['~onJump'],
  },

  onDismount: {
    name: 'onDismount',
    description: 'Entity dismounts from riding',
    examples: ['~onDismount'],
  },

  onMount: {
    name: 'onMount',
    description: 'Entity mounts another entity',
    examples: ['~onMount'],
  },

  onBreed: {
    name: 'onBreed',
    description: 'Mob breeds',
    examples: ['~onBreed'],
  },

  onTame: {
    name: 'onTame',
    description: 'Mob gets tamed',
    examples: ['~onTame'],
  },

  onPickup: {
    name: 'onPickup',
    description: 'Picks up an item',
    examples: ['~onPickup'],
  },

  onDrop: {
    name: 'onDrop',
    description: 'Drops an item',
    examples: ['~onDrop'],
  },

  onChangeWorld: {
    name: 'onChangeWorld',
    description: 'Changes worlds',
    examples: ['~onChangeWorld'],
  },

  onChunkUnload: {
    name: 'onChunkUnload',
    description: 'Chunk unloads',
    examples: ['~onChunkUnload'],
  },

  onDespawn: {
    name: 'onDespawn',
    description: 'Mob despawns',
    examples: ['~onDespawn'],
  },

  onProjectileHit: {
    name: 'onProjectileHit',
    description: 'Projectile hits something',
    examples: ['~onProjectileHit'],
  },

  onProjectileLaunch: {
    name: 'onProjectileLaunch',
    description: 'Launches a projectile',
    examples: ['~onProjectileLaunch'],
  },

  onAnySkill: {
    name: 'onAnySkill',
    description: 'When any skill is used',
    examples: ['~onAnySkill'],
  },

  onTargetInRange: {
    name: 'onTargetInRange',
    description: 'Target enters range',
    examples: ['~onTargetInRange'],
  },

  onTargetOutOfRange: {
    name: 'onTargetOutOfRange',
    description: 'Target leaves range',
    examples: ['~onTargetOutOfRange'],
  },

  onPrime: {
    name: 'onPrime',
    description: 'TNT is primed',
    examples: ['~onPrime'],
  },
};
