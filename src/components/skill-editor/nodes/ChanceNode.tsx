import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Percent } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { ChanceNodeData } from '../types';

/**
 * Chance node - probability modifier
 */
export const ChanceNode = memo(({ data, selected }: NodeProps<ChanceNodeData>) => {
  const percentage = (data.chance * 100).toFixed(0);

  return (
    <BaseNode
      data={data}
      selected={selected}
      color="#ca8a04"  // yellow-600
      icon={<Percent size={16} strokeWidth={2} />}
      showSourceHandle={false}
    >
      <div className="space-y-1">
        <div className="text-xs text-gray-400">Chance</div>
        <div className="font-medium text-yellow-400">
          {data.chance} ({percentage}%)
        </div>
      </div>
    </BaseNode>
  );
});

ChanceNode.displayName = 'ChanceNode';
