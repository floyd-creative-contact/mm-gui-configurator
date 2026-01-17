import {
  SchemaDatabase,
  MechanicSchema,
  TargeterSchema,
  ConditionSchema,
  TriggerSchema,
  SchemaSearchResult,
} from './types';
import { MECHANICS } from './mechanics';
import { TARGETERS } from './targeters';
import { CONDITIONS } from './conditions';
import { TRIGGERS } from './triggers';

/**
 * Schema database version
 */
const SCHEMA_VERSION = '1.0.0';

/**
 * Complete schema database
 */
export const SCHEMA_DB: SchemaDatabase = {
  mechanics: MECHANICS,
  targeters: TARGETERS,
  conditions: CONDITIONS,
  triggers: TRIGGERS,
  version: SCHEMA_VERSION,
  lastUpdated: '2026-01-17',
};

/**
 * Get mechanic schema by name (case-insensitive)
 */
export function getMechanic(name: string): MechanicSchema | undefined {
  const lowerName = name.toLowerCase();

  // Try exact match
  if (MECHANICS[lowerName]) {
    return MECHANICS[lowerName];
  }

  // Try aliases
  for (const mechanic of Object.values(MECHANICS)) {
    if (mechanic.aliases?.some(alias => alias.toLowerCase() === lowerName)) {
      return mechanic;
    }
  }

  return undefined;
}

/**
 * Get targeter schema by name (case-insensitive)
 */
export function getTargeter(name: string): TargeterSchema | undefined {
  // Remove @ prefix if present
  const cleanName = name.startsWith('@') ? name.slice(1) : name;
  const lowerName = cleanName.toLowerCase();

  // Try exact match
  if (TARGETERS[lowerName]) {
    return TARGETERS[lowerName];
  }

  // Try aliases
  for (const targeter of Object.values(TARGETERS)) {
    if (targeter.aliases?.some(alias => {
      const cleanAlias = alias.startsWith('@') ? alias.slice(1) : alias;
      return cleanAlias.toLowerCase() === lowerName;
    })) {
      return targeter;
    }
  }

  return undefined;
}

/**
 * Get condition schema by name (case-insensitive)
 */
export function getCondition(name: string): ConditionSchema | undefined {
  const lowerName = name.toLowerCase();

  // Try exact match
  if (CONDITIONS[lowerName]) {
    return CONDITIONS[lowerName];
  }

  // Try aliases
  for (const condition of Object.values(CONDITIONS)) {
    if (condition.aliases?.some(alias => alias.toLowerCase() === lowerName)) {
      return condition;
    }
  }

  return undefined;
}

/**
 * Get trigger schema by name (case-insensitive)
 */
export function getTrigger(name: string): TriggerSchema | undefined {
  // Remove ~ prefix if present
  const cleanName = name.startsWith('~') ? name.slice(1) : name;

  // Split by : for triggers like onTimer:100
  const baseName = cleanName.split(':')[0];

  // Try exact match (case-insensitive)
  for (const [key, trigger] of Object.entries(TRIGGERS)) {
    if (key.toLowerCase() === baseName.toLowerCase()) {
      return trigger;
    }
  }

  // Try aliases
  for (const trigger of Object.values(TRIGGERS)) {
    if (trigger.aliases?.some(alias => alias.toLowerCase() === baseName.toLowerCase())) {
      return trigger;
    }
  }

  return undefined;
}

/**
 * Get all mechanic names
 */
export function getAllMechanicNames(): string[] {
  return Object.keys(MECHANICS);
}

/**
 * Get all targeter names
 */
export function getAllTargeterNames(): string[] {
  return Object.keys(TARGETERS);
}

/**
 * Get all condition names
 */
export function getAllConditionNames(): string[] {
  return Object.keys(CONDITIONS);
}

/**
 * Get all trigger names
 */
export function getAllTriggerNames(): string[] {
  return Object.keys(TRIGGERS);
}

/**
 * Search across all schemas
 */
export function searchSchemas(query: string): SchemaSearchResult[] {
  const results: SchemaSearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  // Search mechanics
  for (const [name, schema] of Object.entries(MECHANICS)) {
    let relevance = 0;

    if (name.toLowerCase().includes(lowerQuery)) {
      relevance = 10;
    } else if (schema.description.toLowerCase().includes(lowerQuery)) {
      relevance = 5;
    } else if (schema.category.toLowerCase().includes(lowerQuery)) {
      relevance = 3;
    } else if (schema.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))) {
      relevance = 8;
    }

    if (relevance > 0) {
      results.push({
        type: 'mechanic',
        name,
        schema,
        relevance,
      });
    }
  }

  // Search targeters
  for (const [name, schema] of Object.entries(TARGETERS)) {
    let relevance = 0;

    if (name.toLowerCase().includes(lowerQuery)) {
      relevance = 10;
    } else if (schema.description.toLowerCase().includes(lowerQuery)) {
      relevance = 5;
    } else if (schema.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))) {
      relevance = 8;
    }

    if (relevance > 0) {
      results.push({
        type: 'targeter',
        name,
        schema,
        relevance,
      });
    }
  }

  // Search conditions
  for (const [name, schema] of Object.entries(CONDITIONS)) {
    let relevance = 0;

    if (name.toLowerCase().includes(lowerQuery)) {
      relevance = 10;
    } else if (schema.description.toLowerCase().includes(lowerQuery)) {
      relevance = 5;
    } else if (schema.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))) {
      relevance = 8;
    }

    if (relevance > 0) {
      results.push({
        type: 'condition',
        name,
        schema,
        relevance,
      });
    }
  }

  // Search triggers
  for (const [name, schema] of Object.entries(TRIGGERS)) {
    let relevance = 0;

    if (name.toLowerCase().includes(lowerQuery)) {
      relevance = 10;
    } else if (schema.description.toLowerCase().includes(lowerQuery)) {
      relevance = 5;
    }

    if (relevance > 0) {
      results.push({
        type: 'trigger',
        name,
        schema,
        relevance,
      });
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  return results;
}

/**
 * Get mechanics by category
 */
export function getMechanicsByCategory(category: string): MechanicSchema[] {
  return Object.values(MECHANICS).filter(m => m.category === category);
}

/**
 * Get targeters by category
 */
export function getTargetersByCategory(category: string): TargeterSchema[] {
  return Object.values(TARGETERS).filter(t => t.category === category);
}

/**
 * Get conditions by category
 */
export function getConditionsByCategory(category: string): ConditionSchema[] {
  return Object.values(CONDITIONS).filter(c => c.category === category);
}

/**
 * Validate mechanic parameters
 */
export function validateMechanicParameters(
  mechanicName: string,
  parameters: Record<string, any>
): { valid: boolean; errors: string[] } {
  const mechanic = getMechanic(mechanicName);

  if (!mechanic) {
    return {
      valid: false,
      errors: [`Unknown mechanic: ${mechanicName}`],
    };
  }

  const errors: string[] = [];

  // Check required parameters
  for (const [paramName, paramSchema] of Object.entries(mechanic.parameters)) {
    if (paramSchema.required && parameters[paramName] === undefined) {
      // Check if an alias is provided
      const aliases = Object.keys(mechanic.parameters).filter(
        key => mechanic.parameters[key] === paramSchema && key !== paramName
      );
      const hasAlias = aliases.some(alias => parameters[alias] !== undefined);

      if (!hasAlias) {
        errors.push(`Missing required parameter: ${paramName}`);
      }
    }
  }

  // Check parameter types
  for (const [paramName, value] of Object.entries(parameters)) {
    const paramSchema = mechanic.parameters[paramName];

    if (!paramSchema) {
      errors.push(`Unknown parameter: ${paramName}`);
      continue;
    }

    // Type validation
    if (paramSchema.type === 'number' && typeof value !== 'number') {
      errors.push(`Parameter ${paramName} must be a number`);
    } else if (paramSchema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Parameter ${paramName} must be a boolean`);
    } else if (paramSchema.type === 'string' && typeof value !== 'string') {
      errors.push(`Parameter ${paramName} must be a string`);
    } else if (paramSchema.type === 'enum' && !paramSchema.values?.includes(value)) {
      errors.push(`Parameter ${paramName} must be one of: ${paramSchema.values?.join(', ')}`);
    }

    // Range validation for numbers
    if (paramSchema.type === 'number' && typeof value === 'number') {
      if (paramSchema.min !== undefined && value < paramSchema.min) {
        errors.push(`Parameter ${paramName} must be >= ${paramSchema.min}`);
      }
      if (paramSchema.max !== undefined && value > paramSchema.max) {
        errors.push(`Parameter ${paramName} must be <= ${paramSchema.max}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get autocomplete suggestions for a given context
 */
export function getAutocompleteSuggestions(context: 'mechanic' | 'targeter' | 'condition' | 'trigger'): string[] {
  switch (context) {
    case 'mechanic':
      return getAllMechanicNames();
    case 'targeter':
      return getAllTargeterNames().map(n => `@${n}`);
    case 'condition':
      return getAllConditionNames();
    case 'trigger':
      return getAllTriggerNames().map(n => `~${n}`);
    default:
      return [];
  }
}
