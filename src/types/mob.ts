// Core MythicMobs configuration types

export type MinecraftEntity =
  | 'ZOMBIE' | 'SKELETON' | 'CREEPER' | 'SPIDER' | 'ENDERMAN'
  | 'WITHER_SKELETON' | 'BLAZE' | 'GHAST' | 'SLIME' | 'MAGMA_CUBE'
  | 'VILLAGER' | 'IRON_GOLEM' | 'ENDER_DRAGON' | 'WITHER'
  | 'WOLF' | 'OCELOT' | 'COW' | 'PIG' | 'CHICKEN' | 'SHEEP'
  | 'HORSE' | 'DONKEY' | 'MULE' | 'BAT' | 'SQUID'
  | 'GUARDIAN' | 'ELDER_GUARDIAN' | 'SHULKER' | 'PHANTOM'
  | 'DROWNED' | 'HUSK' | 'STRAY' | 'VEX' | 'VINDICATOR'
  | 'EVOKER' | 'RAVAGER' | 'PILLAGER' | 'WITCH' | 'PIGLIN'
  | 'ZOMBIFIED_PIGLIN' | 'HOGLIN' | 'ZOGLIN' | 'STRIDER'
  | 'AXOLOTL' | 'GOAT' | 'GLOW_SQUID' | 'ALLAY' | 'FROG'
  | 'WARDEN' | 'BREEZE' | 'ARMADILLO' | string; // Allow custom for extensibility

export interface BossBarConfig {
  enabled: boolean;
  title?: string;
  color?: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'PINK' | 'PURPLE' | 'WHITE';
  style?: 'SOLID' | 'SEGMENTED_6' | 'SEGMENTED_10' | 'SEGMENTED_12' | 'SEGMENTED_20';
}

export interface MobOptions {
  movementSpeed?: number;
  knockbackResistance?: number;
  preventOtherDrops?: boolean;
  despawn?: boolean;
  silent?: boolean;
  followRange?: number;
  alwaysShowName?: boolean;
  [key: string]: any; // For the 50+ other options
}

export interface SkillLine {
  raw?: string; // Original skill line string
  mechanic: string;
  parameters?: Record<string, any>;
  targeter?: TargeterConfig;
  trigger?: string;
  healthModifier?: HealthModifier;
  chance?: number;
}

export interface TargeterConfig {
  type: string;
  options?: Record<string, any>;
}

export interface HealthModifier {
  operator: '<' | '=' | '>';
  value: string; // e.g., "50%", "100", "30%-50%"
}

export interface MobConfig {
  internalName: string;
  type: MinecraftEntity;
  display?: string;
  health?: number;
  damage?: number;
  armor?: number;
  bossBar?: BossBarConfig;
  faction?: string;
  mount?: string;
  options?: MobOptions;
  skills?: SkillLine[];
  // Advanced fields (for later phases)
  aiGoalSelectors?: string[];
  aiTargetSelectors?: string[];
  drops?: string[];
  equipment?: string[];
  levelModifiers?: string[];
}

export interface Project {
  name: string;
  mobs: Map<string, MobConfig>;
  metaskills?: Map<string, any>; // For future use
}
