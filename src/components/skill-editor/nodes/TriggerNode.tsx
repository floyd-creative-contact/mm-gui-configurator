import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TriggerNodeData } from '../types';

/**
 * Trigger node - entry point for skills
 */
export const TriggerNode = memo(({ data, selected }: NodeProps<TriggerNodeData>) => {
  return (
    <BaseNode
      data={data}
      selected={selected}
      color="#10b981"  // green-500
      icon={<Zap size={16} strokeWidth={2} />}
      showTargetHandle={false}
    >
      <div className="space-y-1">
        <div className="text-xs text-gray-400">Trigger</div>
        <div className="font-medium text-green-400">~{data.trigger}</div>
      </div>
    </BaseNode>
  );
});

TriggerNode.displayName = 'TriggerNode';
