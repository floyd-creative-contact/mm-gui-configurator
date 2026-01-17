import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Filter } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { ConditionNodeData } from '../types';

/**
 * Condition node - filters/gates execution
 */
export const ConditionNode = memo(({ data, selected }: NodeProps<ConditionNodeData>) => {
  return (
    <BaseNode
      data={data}
      selected={selected}
      color="#ea580c"  // orange-600
      icon={<Filter size={16} strokeWidth={2} />}
    >
      <div className="space-y-1">
        <div className="text-xs text-gray-400">Condition</div>
        <div className="font-medium text-orange-400">{data.condition}</div>
        {data.value !== undefined && (
          <div className="text-xs text-gray-500">
            Value: <span className="text-gray-300">{String(data.value)}</span>
          </div>
        )}
        {data.action && (
          <div className="text-xs text-gray-500">
            Action: <span className="text-gray-300">{data.action}</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
});

ConditionNode.displayName = 'ConditionNode';
