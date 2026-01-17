import yaml from 'js-yaml';
import { MobConfig } from '../../types/mob';

/**
 * Converts a MobConfig object to YAML format matching MythicMobs syntax
 */
export function mobConfigToYAML(mob: MobConfig): object {
  const yamlObj: any = {
    Type: mob.type,
  };

  // Add optional fields only if they exist
  if (mob.display) {
    yamlObj.Display = mob.display;
  }

  if (mob.health !== undefined && mob.health !== 20) {
    yamlObj.Health = mob.health;
  }

  if (mob.damage !== undefined && mob.damage !== 1) {
    yamlObj.Damage = mob.damage;
  }

  if (mob.armor !== undefined && mob.armor !== 0) {
    yamlObj.Armor = mob.armor;
  }

  if (mob.faction) {
    yamlObj.Faction = mob.faction;
  }

  if (mob.mount) {
    yamlObj.Mount = mob.mount;
  }

  if (mob.bossBar) {
    yamlObj.BossBar = {
      Enabled: mob.bossBar.enabled,
      ...(mob.bossBar.title && { Title: mob.bossBar.title }),
      ...(mob.bossBar.color && { Color: mob.bossBar.color }),
      ...(mob.bossBar.style && { Style: mob.bossBar.style }),
    };
  }

  if (mob.options && Object.keys(mob.options).length > 0) {
    yamlObj.Options = mob.options;
  }

  if (mob.skills && mob.skills.length > 0) {
    yamlObj.Skills = mob.skills.map(skill => skill.raw || skill.mechanic);
  }

  if (mob.aiGoalSelectors && mob.aiGoalSelectors.length > 0) {
    yamlObj.AIGoalSelectors = mob.aiGoalSelectors;
  }

  if (mob.aiTargetSelectors && mob.aiTargetSelectors.length > 0) {
    yamlObj.AITargetSelectors = mob.aiTargetSelectors;
  }

  if (mob.drops && mob.drops.length > 0) {
    yamlObj.Drops = mob.drops;
  }

  if (mob.equipment && mob.equipment.length > 0) {
    yamlObj.Equipment = mob.equipment;
  }

  if (mob.levelModifiers && mob.levelModifiers.length > 0) {
    yamlObj.LevelModifiers = mob.levelModifiers;
  }

  return yamlObj;
}

/**
 * Exports multiple mobs to a YAML string
 */
export function exportMobsToYAML(mobs: Map<string, MobConfig>): string {
  if (mobs.size === 0) {
    return '';
  }

  const yamlData: any = {};

  mobs.forEach((mob, internalName) => {
    yamlData[internalName] = mobConfigToYAML(mob);
  });

  return yaml.dump(yamlData, {
    indent: 2,
    lineWidth: -1, // Don't wrap lines
    noRefs: true,  // Don't use YAML references
    quotingType: "'", // Use single quotes
    forceQuotes: false, // Only quote when necessary
  });
}
