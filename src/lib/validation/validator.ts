import { MobConfig, MetaskillConfig, SkillLine } from '../../types/mob';
import { getMechanic, getTargeter } from '../schema/schemaLoader';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  field: string;
  message: string;
  severity: ValidationSeverity;
  suggestion?: string;
  path?: string; // e.g., "skills[0].parameters.amount"
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
}

/**
 * Validate a mob configuration
 */
export function validateMob(
  mob: MobConfig,
  allMobs: Map<string, MobConfig>,
  allMetaskills: Map<string, MetaskillConfig>
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Required fields
  if (!mob.internalName || mob.internalName.trim() === '') {
    issues.push({
      field: 'internalName',
      message: 'Internal name is required',
      severity: 'error',
      suggestion: 'Provide a unique identifier for this mob',
    });
  }

  if (!mob.type) {
    issues.push({
      field: 'type',
      message: 'Entity type is required',
      severity: 'error',
      suggestion: 'Select a Minecraft entity type (e.g., ZOMBIE, SKELETON)',
    });
  }

  // Name validation
  if (mob.internalName && /\s/.test(mob.internalName)) {
    issues.push({
      field: 'internalName',
      message: 'Internal name should not contain spaces',
      severity: 'warning',
      suggestion: 'Use underscores instead of spaces (e.g., Fire_Boss)',
    });
  }

  // Stats validation
  if (mob.health !== undefined && mob.health <= 0) {
    issues.push({
      field: 'health',
      message: 'Health must be greater than 0',
      severity: 'error',
      suggestion: 'Set health to at least 1',
    });
  }

  if (mob.health !== undefined && mob.health > 10000) {
    issues.push({
      field: 'health',
      message: 'Health value is extremely high',
      severity: 'info',
      suggestion: 'Consider if this mob really needs more than 10,000 HP (5,000 hearts)',
    });
  }

  if (mob.damage !== undefined && mob.damage < 0) {
    issues.push({
      field: 'damage',
      message: 'Damage cannot be negative',
      severity: 'error',
      suggestion: 'Set damage to 0 or higher',
    });
  }

  if (mob.armor !== undefined && (mob.armor < 0 || mob.armor > 20)) {
    issues.push({
      field: 'armor',
      message: 'Armor should be between 0 and 20',
      severity: 'warning',
      suggestion: 'Minecraft armor values range from 0 to 20',
    });
  }

  // Mount validation
  if (mob.mount && !allMobs.has(mob.mount)) {
    issues.push({
      field: 'mount',
      message: `Referenced mob "${mob.mount}" does not exist`,
      severity: 'error',
      suggestion: 'Create the mount mob first or fix the reference',
    });
  }

  // Self-mounting check
  if (mob.mount === mob.internalName) {
    issues.push({
      field: 'mount',
      message: 'Mob cannot mount itself',
      severity: 'error',
      suggestion: 'Reference a different mob',
    });
  }

  // Skills validation
  if (mob.skills) {
    mob.skills.forEach((skill, index) => {
      const skillIssues = validateSkill(skill, allMetaskills);
      skillIssues.forEach(issue => {
        issues.push({
          ...issue,
          path: `skills[${index}]`,
          field: `skills[${index}].${issue.field}`,
        });
      });
    });
  }

  // Boss bar validation
  if (mob.bossBar?.enabled) {
    if (!mob.bossBar.title && !mob.display && !mob.internalName) {
      issues.push({
        field: 'bossBar.title',
        message: 'Boss bar has no title',
        severity: 'warning',
        suggestion: 'Set a boss bar title or display name',
      });
    }
  }

  // Equipment validation
  if (mob.equipment) {
    mob.equipment.forEach((item, index) => {
      // Basic format check: should be "ITEM_NAME:SLOT" or just "ITEM_NAME"
      if (typeof item === 'string' && !item.includes(':')) {
        issues.push({
          field: `equipment[${index}]`,
          message: 'Equipment item missing slot number',
          severity: 'warning',
          suggestion: 'Format should be ITEM_NAME:SLOT (e.g., DIAMOND_SWORD:0)',
        });
      }
    });
  }

  return categorizeIssues(issues);
}

/**
 * Validate a skill line
 */
export function validateSkill(
  skill: SkillLine,
  allMetaskills: Map<string, MetaskillConfig>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Mechanic validation
  if (!skill.mechanic || skill.mechanic.trim() === '') {
    issues.push({
      field: 'mechanic',
      message: 'Skill has no mechanic',
      severity: 'error',
      suggestion: 'Specify what action this skill performs',
    });
    return issues; // Can't validate further without a mechanic
  }

  const mechanicSchema = getMechanic(skill.mechanic);
  if (!mechanicSchema) {
    issues.push({
      field: 'mechanic',
      message: `Unknown mechanic: ${skill.mechanic}`,
      severity: 'warning',
      suggestion: 'Check the mechanic name or refer to MythicMobs documentation',
    });
  }

  // Parameters validation
  if (mechanicSchema && skill.parameters) {
    // Check required parameters
    Object.entries(mechanicSchema.parameters).forEach(([paramName, paramSchema]) => {
      if (paramSchema.required && !skill.parameters?.[paramName]) {
        issues.push({
          field: `parameters.${paramName}`,
          message: `Required parameter "${paramName}" is missing`,
          severity: 'error',
          suggestion: paramSchema.description || `Add the ${paramName} parameter`,
        });
      }

      // Type validation
      const value = skill.parameters?.[paramName];
      if (value !== undefined && value !== '') {
        if (paramSchema.type === 'number' && isNaN(Number(value))) {
          issues.push({
            field: `parameters.${paramName}`,
            message: `Parameter "${paramName}" should be a number`,
            severity: 'error',
            suggestion: `Current value: "${value}" is not a valid number`,
          });
        }

        if (paramSchema.type === 'enum' && paramSchema.values && !paramSchema.values.includes(String(value))) {
          issues.push({
            field: `parameters.${paramName}`,
            message: `Invalid value for "${paramName}"`,
            severity: 'error',
            suggestion: `Valid values: ${paramSchema.values.join(', ')}`,
          });
        }

        // Range validation
        if (paramSchema.type === 'number') {
          const numValue = Number(value);
          if (paramSchema.min !== undefined && numValue < paramSchema.min) {
            issues.push({
              field: `parameters.${paramName}`,
              message: `Parameter "${paramName}" is below minimum value`,
              severity: 'warning',
              suggestion: `Minimum value is ${paramSchema.min}, you have ${numValue}`,
            });
          }
          if (paramSchema.max !== undefined && numValue > paramSchema.max) {
            issues.push({
              field: `parameters.${paramName}`,
              message: `Parameter "${paramName}" exceeds maximum value`,
              severity: 'warning',
              suggestion: `Maximum value is ${paramSchema.max}, you have ${numValue}`,
            });
          }
        }
      }
    });

    // Check for unknown parameters
    Object.keys(skill.parameters).forEach(paramName => {
      if (mechanicSchema && !mechanicSchema.parameters[paramName]) {
        issues.push({
          field: `parameters.${paramName}`,
          message: `Unknown parameter "${paramName}" for ${skill.mechanic}`,
          severity: 'info',
          suggestion: 'This parameter may not be recognized by the mechanic',
        });
      }
    });
  }

  // Metaskill reference validation
  if (skill.mechanic === 'skill' && skill.parameters?.s) {
    const metaskillName = skill.parameters.s;
    if (!allMetaskills.has(metaskillName)) {
      issues.push({
        field: 'parameters.s',
        message: `Referenced metaskill "${metaskillName}" does not exist`,
        severity: 'error',
        suggestion: 'Create the metaskill or fix the reference',
      });
    }
  }

  // Targeter validation
  if (skill.targeter) {
    const targeterSchema = getTargeter(skill.targeter.type);
    if (!targeterSchema) {
      issues.push({
        field: 'targeter',
        message: `Unknown targeter: ${skill.targeter.type}`,
        severity: 'warning',
        suggestion: 'Check the targeter name or refer to MythicMobs documentation',
      });
    }
  }

  // Chance validation
  if (skill.chance !== undefined) {
    if (skill.chance < 0 || skill.chance > 1) {
      issues.push({
        field: 'chance',
        message: 'Chance should be between 0.0 and 1.0',
        severity: 'error',
        suggestion: 'Use 0.5 for 50% chance, 1.0 for 100% chance',
      });
    }
  }

  return issues;
}

/**
 * Validate a metaskill configuration
 */
export function validateMetaskill(
  metaskill: MetaskillConfig,
  allMetaskills: Map<string, MetaskillConfig>
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Required fields
  if (!metaskill.internalName || metaskill.internalName.trim() === '') {
    issues.push({
      field: 'internalName',
      message: 'Internal name is required',
      severity: 'error',
      suggestion: 'Provide a unique identifier for this metaskill',
    });
  }

  // Name validation
  if (metaskill.internalName && /\s/.test(metaskill.internalName)) {
    issues.push({
      field: 'internalName',
      message: 'Internal name should not contain spaces',
      severity: 'warning',
      suggestion: 'Use underscores or camelCase (e.g., FireBurst or Fire_Burst)',
    });
  }

  // Cooldown validation
  if (metaskill.cooldown !== undefined && metaskill.cooldown < 0) {
    issues.push({
      field: 'cooldown',
      message: 'Cooldown cannot be negative',
      severity: 'error',
      suggestion: 'Set cooldown to 0 or higher (in seconds)',
    });
  }

  // Skills validation
  if (!metaskill.skills || metaskill.skills.length === 0) {
    issues.push({
      field: 'skills',
      message: 'Metaskill has no skills',
      severity: 'warning',
      suggestion: 'Add at least one skill to this metaskill',
    });
  } else {
    metaskill.skills.forEach((skill, index) => {
      const skillIssues = validateSkill(skill, allMetaskills);
      skillIssues.forEach(issue => {
        issues.push({
          ...issue,
          path: `skills[${index}]`,
          field: `skills[${index}].${issue.field}`,
        });
      });
    });
  }

  // Circular reference check
  if (metaskill.skills) {
    metaskill.skills.forEach((skill, index) => {
      if (skill.mechanic === 'skill' && skill.parameters?.s === metaskill.internalName) {
        issues.push({
          field: `skills[${index}]`,
          message: 'Metaskill calls itself (circular reference)',
          severity: 'error',
          suggestion: 'Remove the self-reference to prevent infinite loops',
        });
      }
    });
  }

  return categorizeIssues(issues);
}

/**
 * Categorize issues by severity
 */
function categorizeIssues(issues: ValidationIssue[]): ValidationResult {
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');

  return {
    valid: errors.length === 0,
    issues,
    errors,
    warnings,
    info,
  };
}

/**
 * Validate entire project before export
 */
export function validateProject(
  mobs: Map<string, MobConfig>,
  metaskills: Map<string, MetaskillConfig>
): { mobs: Map<string, ValidationResult>; metaskills: Map<string, ValidationResult>; canExport: boolean } {
  const mobResults = new Map<string, ValidationResult>();
  const metaskillResults = new Map<string, ValidationResult>();

  mobs.forEach((mob, id) => {
    mobResults.set(id, validateMob(mob, mobs, metaskills));
  });

  metaskills.forEach((metaskill, id) => {
    metaskillResults.set(id, validateMetaskill(metaskill, metaskills));
  });

  const canExport = Array.from(mobResults.values()).every(r => r.valid) &&
                   Array.from(metaskillResults.values()).every(r => r.valid);

  return { mobs: mobResults, metaskills: metaskillResults, canExport };
}
