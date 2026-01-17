import { Node, Edge } from 'reactflow';

/**
 * Custom node types for skill editor
 */
export type SkillNodeType = 'trigger' | 'mechanic' | 'targeter' | 'condition' | 'chance' | 'healthmod';

/**
 * Base node data
 */
export interface BaseNodeData {
  label: string;
  nodeType: SkillNodeType;
}

/**
 * Trigger node data
 */
export interface TriggerNodeData extends BaseNodeData {
  nodeType: 'trigger';
  trigger: string;  // e.g., "onAttack", "onTimer:100"
}

/**
 * Mechanic node data
 */
export interface MechanicNodeData extends BaseNodeData {
  nodeType: 'mechanic';
  mechanic: string;  // e.g., "damage", "skill"
  parameters?: Record<string, any>;
}

/**
 * Targeter node data
 */
export interface TargeterNodeData extends BaseNodeData {
  nodeType: 'targeter';
  targeter: string;  // e.g., "target", "PIR"
  options?: Record<string, any>;
}

/**
 * Condition node data
 */
export interface ConditionNodeData extends BaseNodeData {
  nodeType: 'condition';
  condition: string;  // e.g., "health", "distance"
  value?: any;
  action?: string;  // "true", "false", "required", "cancel"
}

/**
 * Chance node data
 */
export interface ChanceNodeData extends BaseNodeData {
  nodeType: 'chance';
  chance: number;  // 0.0 - 1.0
}

/**
 * Health modifier node data
 */
export interface HealthModNodeData extends BaseNodeData {
  nodeType: 'healthmod';
  operator: '<' | '=' | '>';
  value: string;  // e.g., "50%", "100", "30%-50%"
}

/**
 * Union of all node data types
 */
export type SkillNodeData =
  | TriggerNodeData
  | MechanicNodeData
  | TargeterNodeData
  | ConditionNodeData
  | ChanceNodeData
  | HealthModNodeData;

/**
 * Custom node for ReactFlow
 */
export type SkillNode = Node<SkillNodeData>;

/**
 * Custom edge for ReactFlow
 */
export type SkillEdge = Edge;

/**
 * Skill graph structure
 */
export interface SkillGraph {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

/**
 * Node palette item
 */
export interface PaletteItem {
  id: string;
  type: SkillNodeType;
  label: string;
  description: string;
  icon?: string;
  defaultData?: Partial<SkillNodeData>;
}
