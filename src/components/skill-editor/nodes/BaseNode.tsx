import { Handle, Position } from 'reactflow';
import { SkillNodeData } from '../types';

interface BaseNodeProps {
  data: SkillNodeData;
  selected?: boolean;
  color: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
}

/**
 * Base node component used by all skill nodes
 */
export function BaseNode({
  data,
  selected,
  color,
  icon,
  children,
  showSourceHandle = true,
  showTargetHandle = true,
}: BaseNodeProps) {
  return (
    <div
      className={`
        relative rounded-lg border-2 bg-surface min-w-[180px]
        ${selected ? 'border-primary shadow-lg' : 'border-gray-600'}
        transition-all duration-200
      `}
    >
      {/* Target handle (input) */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gray-400 !w-3 !h-3"
        />
      )}

      {/* Header */}
      <div
        className={`px-3 py-2 rounded-t-md flex items-center gap-2`}
        style={{ backgroundColor: color }}
      >
        {icon && <div className="text-white">{icon}</div>}
        <div className="text-sm font-semibold text-white truncate">
          {data.label}
        </div>
      </div>

      {/* Content */}
      {children && (
        <div className="px-3 py-2 text-sm">
          {children}
        </div>
      )}

      {/* Source handle (output) */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-gray-400 !w-3 !h-3"
        />
      )}
    </div>
  );
}
