import { SkillLineAST } from '../../lib/parser/types';
import { SkillNode, SkillEdge, SkillNodeData } from './types';

/**
 * Converts a skill line AST to ReactFlow nodes and edges
 */
export function skillToGraph(skill: SkillLineAST, skillIndex: number = 0): {
  nodes: SkillNode[];
  edges: SkillEdge[];
} {
  const nodes: SkillNode[] = [];
  const edges: SkillEdge[] = [];
  let nodeIdCounter = 0;

  // Calculate vertical positions (cascade downward)
  const baseY = skillIndex * 400; // Offset for multiple skills
  const xSpacing = 250;
  const ySpacing = 150;

  // Helper to generate unique node IDs
  const getNodeId = () => `node_${skillIndex}_${nodeIdCounter++}`;

  // 1. Create Trigger Node (if present)
  let lastNodeId: string | null = null;

  if (skill.trigger) {
    const triggerId = getNodeId();
    nodes.push({
      id: triggerId,
      type: 'trigger',
      position: { x: 0, y: baseY },
      data: {
        label: skill.trigger,
        nodeType: 'trigger',
        trigger: skill.trigger,
      } as SkillNodeData,
    });
    lastNodeId = triggerId;
  }

  // 2. Create Mechanic Node (required)
  const mechanicId = getNodeId();
  nodes.push({
    id: mechanicId,
    type: 'mechanic',
    position: { x: 0, y: baseY + (lastNodeId ? ySpacing : 0) },
    data: {
      label: skill.mechanic,
      nodeType: 'mechanic',
      mechanic: skill.mechanic,
      parameters: skill.parameters,
    } as SkillNodeData,
  });

  // Connect trigger to mechanic
  if (lastNodeId) {
    edges.push({
      id: `edge_${lastNodeId}_${mechanicId}`,
      source: lastNodeId,
      target: mechanicId,
    });
  }

  lastNodeId = mechanicId;
  let currentY = baseY + (skill.trigger ? ySpacing * 2 : ySpacing);

  // 3. Create Targeter Node (if present)
  if (skill.targeter) {
    const targeterId = getNodeId();
    nodes.push({
      id: targeterId,
      type: 'targeter',
      position: { x: 0, y: currentY },
      data: {
        label: `@${skill.targeter.type}`,
        nodeType: 'targeter',
        targeter: skill.targeter.type,
        options: skill.targeter.options,
      } as SkillNodeData,
    });

    edges.push({
      id: `edge_${lastNodeId}_${targeterId}`,
      source: lastNodeId,
      target: targeterId,
    });

    lastNodeId = targeterId;
    currentY += ySpacing;
  }

  // 4. Create Inline Condition Nodes (if present)
  if (skill.inlineConditions && skill.inlineConditions.length > 0) {
    skill.inlineConditions.forEach((condition, idx) => {
      const conditionId = getNodeId();
      nodes.push({
        id: conditionId,
        type: 'condition',
        position: { x: xSpacing, y: currentY + (idx * ySpacing) },
        data: {
          label: condition,
          nodeType: 'condition',
          condition: condition,
        } as SkillNodeData,
      });

      // Connect from last node to condition
      edges.push({
        id: `edge_${lastNodeId}_${conditionId}`,
        source: lastNodeId!,
        target: conditionId,
        animated: true,
      });
    });
  }

  // 5. Create Health Modifier Node (if present)
  if (skill.healthModifier) {
    const healthModId = getNodeId();
    nodes.push({
      id: healthModId,
      type: 'healthmod',
      position: { x: 0, y: currentY },
      data: {
        label: `${skill.healthModifier.operator}${skill.healthModifier.value}`,
        nodeType: 'healthmod',
        operator: skill.healthModifier.operator,
        value: skill.healthModifier.value,
      } as SkillNodeData,
    });

    edges.push({
      id: `edge_${lastNodeId}_${healthModId}`,
      source: lastNodeId!,
      target: healthModId,
    });

    lastNodeId = healthModId;
    currentY += ySpacing;
  }

  // 6. Create Chance Node (if present)
  if (skill.chance !== undefined) {
    const chanceId = getNodeId();
    nodes.push({
      id: chanceId,
      type: 'chance',
      position: { x: 0, y: currentY },
      data: {
        label: `${skill.chance}`,
        nodeType: 'chance',
        chance: skill.chance,
      } as SkillNodeData,
    });

    edges.push({
      id: `edge_${lastNodeId}_${chanceId}`,
      source: lastNodeId!,
      target: chanceId,
    });
  }

  return { nodes, edges };
}

/**
 * Converts multiple skill lines to a combined graph
 */
export function skillsToGraph(skills: SkillLineAST[]): {
  nodes: SkillNode[];
  edges: SkillEdge[];
} {
  const allNodes: SkillNode[] = [];
  const allEdges: SkillEdge[] = [];

  skills.forEach((skill, index) => {
    const { nodes, edges } = skillToGraph(skill, index);
    allNodes.push(...nodes);
    allEdges.push(...edges);
  });

  return {
    nodes: allNodes,
    edges: allEdges,
  };
}
