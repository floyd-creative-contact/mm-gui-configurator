/**
 * Custom node components for the skill editor
 */

export { BaseNode } from './BaseNode';
export { TriggerNode } from './TriggerNode';
export { MechanicNode } from './MechanicNode';
export { TargeterNode } from './TargeterNode';
export { ConditionNode } from './ConditionNode';
export { ChanceNode } from './ChanceNode';
export { HealthModNode } from './HealthModNode';

// Node type mapping for ReactFlow
import { TriggerNode } from './TriggerNode';
import { MechanicNode } from './MechanicNode';
import { TargeterNode } from './TargeterNode';
import { ConditionNode } from './ConditionNode';
import { ChanceNode } from './ChanceNode';
import { HealthModNode } from './HealthModNode';

export const nodeTypes = {
  trigger: TriggerNode,
  mechanic: MechanicNode,
  targeter: TargeterNode,
  condition: ConditionNode,
  chance: ChanceNode,
  healthmod: HealthModNode,
};
