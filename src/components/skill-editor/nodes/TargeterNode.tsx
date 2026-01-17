import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Target } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TargeterNodeData } from '../types';

/**
 * Targeter node - specifies who/what to affect
 */
export const TargeterNode = memo(({ data, selected }: NodeProps<TargeterNodeData>) => {
  const hasOptions = data.options && Object.keys(data.options).length > 0;

  return (
    <BaseNode
      data={data}
      selected={selected}
      color="#0891b2"  // cyan-600
      icon={<Target size={16} strokeWidth={2} />}
    >
      <div className="space-y-1">
        <div className="text-xs text-gray-400">Targeter</div>
        <div className="font-medium text-cyan-400">@{data.targeter}</div>
        {hasOptions && (
          <div className="text-xs text-gray-500 mt-2 space-y-0.5">
            {Object.entries(data.options!).slice(0, 2).map(([key, value]) => (
              <div key={key} className="truncate">
                <span className="text-gray-400">{key}:</span> {String(value)}
              </div>
            ))}
            {Object.keys(data.options!).length > 2 && (
              <div className="text-gray-500 italic">
                +{Object.keys(data.options!).length - 2} more...
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
});

TargeterNode.displayName = 'TargeterNode';
