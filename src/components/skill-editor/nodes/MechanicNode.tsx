import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Wand2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { MechanicNodeData } from '../types';

/**
 * Mechanic node - represents an action
 */
export const MechanicNode = memo(({ data, selected }: NodeProps<MechanicNodeData>) => {
  const hasParams = data.parameters && Object.keys(data.parameters).length > 0;

  return (
    <BaseNode
      data={data}
      selected={selected}
      color="#9333ea"  // purple-600
      icon={<Wand2 size={16} strokeWidth={2} />}
    >
      <div className="space-y-1">
        <div className="text-xs text-gray-400">Mechanic</div>
        <div className="font-medium text-purple-400">{data.mechanic}</div>
        {hasParams && (
          <div className="text-xs text-gray-500 mt-2 space-y-0.5">
            {Object.entries(data.parameters!).slice(0, 3).map(([key, value]) => (
              <div key={key} className="truncate">
                <span className="text-gray-400">{key}:</span> {String(value)}
              </div>
            ))}
            {Object.keys(data.parameters!).length > 3 && (
              <div className="text-gray-500 italic">
                +{Object.keys(data.parameters!).length - 3} more...
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
});

MechanicNode.displayName = 'MechanicNode';
