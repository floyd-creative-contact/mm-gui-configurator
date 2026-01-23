import yaml from 'js-yaml';
import { MobConfig, MetaskillConfig } from '../../types/mob';
import { mobConfigToYAML } from './yamlGenerator';

export interface ExportFile {
  path: string; // e.g., "Mobs/MyBoss.yml" or "Skills/FireballAttack.yml"
  content: string;
}

/**
 * Convert a metaskill to YAML format
 */
export function metaskillConfigToYAML(metaskill: MetaskillConfig): object {
  const yamlObj: any = {};

  if (metaskill.cooldown !== undefined) {
    yamlObj.Cooldown = metaskill.cooldown;
  }

  if (metaskill.conditions && metaskill.conditions.length > 0) {
    yamlObj.Conditions = metaskill.conditions;
  }

  if (metaskill.targetConditions && metaskill.targetConditions.length > 0) {
    yamlObj.TargetConditions = metaskill.targetConditions;
  }

  if (metaskill.triggerConditions && metaskill.triggerConditions.length > 0) {
    yamlObj.TriggerConditions = metaskill.triggerConditions;
  }

  if (metaskill.skills && metaskill.skills.length > 0) {
    yamlObj.Skills = metaskill.skills.map(skill => skill.raw || skill.mechanic);
  }

  return yamlObj;
}

/**
 * Export mobs and metaskills as separate files
 */
export function exportToMultipleFiles(
  mobs: Map<string, MobConfig>,
  metaskills: Map<string, MetaskillConfig>
): ExportFile[] {
  const files: ExportFile[] = [];

  // Export each mob to its own file
  mobs.forEach((mob, internalName) => {
    const yamlData = { [internalName]: mobConfigToYAML(mob) };
    const content = yaml.dump(yamlData, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: "'",
      forceQuotes: false,
    });

    files.push({
      path: `Mobs/${internalName}.yml`,
      content,
    });
  });

  // Export each metaskill to its own file
  metaskills.forEach((metaskill, internalName) => {
    const yamlData = { [internalName]: metaskillConfigToYAML(metaskill) };
    const content = yaml.dump(yamlData, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: "'",
      forceQuotes: false,
    });

    files.push({
      path: `Skills/${internalName}.yml`,
      content,
    });
  });

  return files;
}

/**
 * Download files as a zip archive
 * Requires JSZip library
 */
export async function downloadAsZip(files: ExportFile[], zipName: string = 'mythicmobs-config.zip') {
  // Dynamically import JSZip only when needed
  const JSZip = (await import('jszip')).default;

  const zip = new JSZip();

  files.forEach(file => {
    zip.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export combined single file (legacy format)
 */
export function exportToSingleFile(
  mobs: Map<string, MobConfig>,
  metaskills: Map<string, MetaskillConfig>
): string {
  const yamlData: any = {};

  // Add all mobs
  mobs.forEach((mob, internalName) => {
    yamlData[internalName] = mobConfigToYAML(mob);
  });

  // Add all metaskills
  metaskills.forEach((metaskill, internalName) => {
    yamlData[internalName] = metaskillConfigToYAML(metaskill);
  });

  return yaml.dump(yamlData, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
  });
}
