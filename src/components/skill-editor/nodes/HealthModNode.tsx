import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Heart } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { HealthModNodeData } from '../types';

/**
 * Health modifier node - health-based conditions
 */
export const HealthModNode = memo(({ data, selected }: NodeProps<HealthModNodeData>) => {
  return (
    <BaseNode
      data={data}
      selected={selected}
      color="#dc2626"  // red-600
      icon={<Heart size={16} strokeWidth={2} />}
      showSourceHandle={false}
    >
      <div className="space-y-1">
        <div className="text-xs text-gray-400">Health Modifier</div>
        <div className="font-medium text-red-400">
          {data.operator}{data.value}
        </div>
      </div>
    </BaseNode>
  );
});

HealthModNode.displayName = 'HealthModNode';
