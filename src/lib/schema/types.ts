/**
 * Schema type definitions for MythicMobs mechanics, targeters, and conditions
 */

/**
 * Parameter types for mechanics and targeters
 */
export type ParameterType = 'string' | 'number' | 'boolean' | 'enum' | 'array';

/**
 * Parameter schema definition
 */
export interface ParameterSchema {
  type: ParameterType;
  required: boolean;
  default?: any;
  description: string;
  values?: string[];  // For enum type
  min?: number;       // For number type
  max?: number;       // For number type
  example?: string;   // Example value
}

/**
 * Mechanic category types
 */
export type MechanicCategory =
  | 'Entity Targeting'
  | 'Location Targeting'
  | 'Meta/Flow Control'
  | 'Aura'
  | 'Sound/Visual'
  | 'AI'
  | 'ModelEngine'
  | 'Variable'
  | 'Other';

/**
 * Target type for mechanics
 */
export type TargetType = 'entity' | 'location' | 'meta';

/**
 * Mechanic schema definition
 */
export interface MechanicSchema {
  name: string;
  aliases?: string[];
  category: MechanicCategory;
  description: string;
  targetType: TargetType;
  parameters: Record<string, ParameterSchema>;
  examples: string[];
  requiresTarget?: boolean;
  deprecated?: boolean;
  premium?: boolean;  // MythicMobs Premium feature
}

/**
 * Targeter category types
 */
export type TargeterCategory = 'Entity' | 'Location' | 'Special';

/**
 * Targeter schema definition
 */
export interface TargeterSchema {
  name: string;
  aliases?: string[];
  category: TargeterCategory;
  description: string;
  targetType: 'entity' | 'location';
  options: Record<string, ParameterSchema>;
  examples: string[];
  deprecated?: boolean;
  premium?: boolean;
}

/**
 * Condition category types
 */
export type ConditionCategory =
  | 'Entity'
  | 'Location'
  | 'Compare'
  | 'Time'
  | 'World'
  | 'Player'
  | 'Other';

/**
 * Condition value types
 */
export type ConditionValueType = 'boolean' | 'number' | 'string' | 'range' | 'none';

/**
 * Condition schema definition
 */
export interface ConditionSchema {
  name: string;
  aliases?: string[];
  category: ConditionCategory;
  description: string;
  valueType: ConditionValueType;
  parameters?: Record<string, ParameterSchema>;
  examples: string[];
  deprecated?: boolean;
  premium?: boolean;
}

/**
 * Trigger schema definition
 */
export interface TriggerSchema {
  name: string;
  aliases?: string[];
  description: string;
  hasValue?: boolean;  // e.g., onTimer needs a value
  valueType?: 'number' | 'string';
  examples: string[];
  deprecated?: boolean;
}

/**
 * Complete schema database
 */
export interface SchemaDatabase {
  mechanics: Record<string, MechanicSchema>;
  targeters: Record<string, TargeterSchema>;
  conditions: Record<string, ConditionSchema>;
  triggers: Record<string, TriggerSchema>;
  version: string;
  lastUpdated: string;
}

/**
 * Schema search result
 */
export interface SchemaSearchResult {
  type: 'mechanic' | 'targeter' | 'condition' | 'trigger';
  name: string;
  schema: MechanicSchema | TargeterSchema | ConditionSchema | TriggerSchema;
  relevance: number;
}
