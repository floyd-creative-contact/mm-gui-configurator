import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './nodes';
import { SkillNode, SkillEdge, SkillNodeData } from './types';

interface SkillCanvasProps {
  initialNodes?: SkillNode[];
  initialEdges?: SkillEdge[];
  onNodesChange?: (nodes: SkillNode[]) => void;
  onEdgesChange?: (edges: SkillEdge[]) => void;
}

/**
 * Main skill editor canvas using ReactFlow
 */
export function SkillCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
}: SkillCanvasProps) {
  const [nodes, , onNodesChangeInternal] = useNodesState<SkillNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));

      // Notify parent
      if (onEdgesChange) {
        onEdgesChange(edges);
      }
    },
    [setEdges, edges, onEdgesChange]
  );

  // Handle node changes
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeInternal(changes);

      // Notify parent
      if (onNodesChange) {
        onNodesChange(nodes);
      }
    },
    [onNodesChangeInternal, onNodesChange, nodes]
  );

  // Handle edge changes
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeInternal(changes);

      // Notify parent
      if (onEdgesChange) {
        onEdgesChange(edges);
      }
    },
    [onEdgesChangeInternal, onEdgesChange, edges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background color="#334155" gap={16} />
        <Controls className="bg-surface border border-gray-700" />
        <MiniMap
          className="bg-surface border border-gray-700"
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger':
                return '#10b981';
              case 'mechanic':
                return '#9333ea';
              case 'targeter':
                return '#0891b2';
              case 'condition':
                return '#ea580c';
              case 'chance':
                return '#ca8a04';
              case 'healthmod':
                return '#dc2626';
              default:
                return '#6b7280';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
