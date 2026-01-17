import yaml from 'js-yaml';
import { MobConfig, MinecraftEntity, SkillLine } from '../../types/mob';

/**
 * Parses a YAML object into a MobConfig
 */
export function yamlToMobConfig(internalName: string, yamlObj: any): MobConfig {
  const mob: MobConfig = {
    internalName,
    type: (yamlObj.Type || 'ZOMBIE') as MinecraftEntity,
  };

  // Parse optional basic fields
  if (yamlObj.Display) {
    mob.display = yamlObj.Display;
  }

  if (yamlObj.Health !== undefined) {
    mob.health = parseFloat(yamlObj.Health);
  }

  if (yamlObj.Damage !== undefined) {
    mob.damage = parseFloat(yamlObj.Damage);
  }

  if (yamlObj.Armor !== undefined) {
    mob.armor = parseFloat(yamlObj.Armor);
  }

  if (yamlObj.Faction) {
    mob.faction = yamlObj.Faction;
  }

  if (yamlObj.Mount) {
    mob.mount = yamlObj.Mount;
  }

  // Parse BossBar
  if (yamlObj.BossBar) {
    mob.bossBar = {
      enabled: yamlObj.BossBar.Enabled !== false,
      title: yamlObj.BossBar.Title,
      color: yamlObj.BossBar.Color,
      style: yamlObj.BossBar.Style,
    };
  }

  // Parse Options
  if (yamlObj.Options && typeof yamlObj.Options === 'object') {
    mob.options = yamlObj.Options;
  }

  // Parse Skills (basic parsing for now)
  if (yamlObj.Skills && Array.isArray(yamlObj.Skills)) {
    mob.skills = yamlObj.Skills.map((skillStr: string): SkillLine => {
      // For now, just store the raw string
      // Full parsing will be implemented in Phase 2
      return {
        raw: skillStr,
        mechanic: skillStr.split(/[{@~\s]/)[0] || 'unknown',
      };
    });
  }

  // Parse AI Selectors
  if (yamlObj.AIGoalSelectors && Array.isArray(yamlObj.AIGoalSelectors)) {
    mob.aiGoalSelectors = yamlObj.AIGoalSelectors;
  }

  if (yamlObj.AITargetSelectors && Array.isArray(yamlObj.AITargetSelectors)) {
    mob.aiTargetSelectors = yamlObj.AITargetSelectors;
  }

  // Parse other arrays
  if (yamlObj.Drops && Array.isArray(yamlObj.Drops)) {
    mob.drops = yamlObj.Drops;
  }

  if (yamlObj.Equipment && Array.isArray(yamlObj.Equipment)) {
    mob.equipment = yamlObj.Equipment;
  }

  if (yamlObj.LevelModifiers && Array.isArray(yamlObj.LevelModifiers)) {
    mob.levelModifiers = yamlObj.LevelModifiers;
  }

  return mob;
}

/**
 * Imports YAML string and returns a map of mobs
 */
export function importYAMLToMobs(yamlString: string): Map<string, MobConfig> {
  const mobs = new Map<string, MobConfig>();

  try {
    const parsed = yaml.load(yamlString) as any;

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid YAML format');
    }

    // Iterate through each mob in the YAML
    Object.entries(parsed).forEach(([internalName, mobData]) => {
      if (typeof mobData === 'object' && mobData !== null) {
        const mob = yamlToMobConfig(internalName, mobData);
        mobs.set(internalName, mob);
      }
    });

    return mobs;
  } catch (error) {
    console.error('Failed to parse YAML:', error);
    throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
