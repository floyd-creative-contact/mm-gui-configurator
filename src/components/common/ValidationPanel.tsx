import { AlertCircle, AlertTriangle, Info, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ValidationResult, ValidationIssue } from '../../lib/validation/validator';

interface ValidationPanelProps {
  result: ValidationResult;
  entityName: string;
  className?: string;
}

export function ValidationPanel({ result, entityName, className = '' }: ValidationPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (result.issues.length === 0) {
    return (
      <div className={`p-3 bg-green-900/20 border border-green-700 rounded flex items-center gap-2 ${className}`}>
        <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        <span className="text-sm text-green-100">
          <strong>{entityName}</strong> has no validation issues
        </span>
      </div>
    );
  }

  const { errors, warnings, info } = result;

  return (
    <div className={`border rounded ${result.valid ? 'border-yellow-700 bg-yellow-900/20' : 'border-red-700 bg-red-900/20'} ${className}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-black/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          {result.valid ? (
            <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          )}
          <div className="text-left">
            <div className="text-sm font-medium">
              <strong>{entityName}</strong> has {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {errors.length > 0 && <span className="text-red-400">{errors.length} error{errors.length !== 1 ? 's' : ''}</span>}
              {errors.length > 0 && warnings.length > 0 && <span>, </span>}
              {warnings.length > 0 && <span className="text-yellow-400">{warnings.length} warning{warnings.length !== 1 ? 's' : ''}</span>}
              {(errors.length > 0 || warnings.length > 0) && info.length > 0 && <span>, </span>}
              {info.length > 0 && <span className="text-blue-400">{info.length} info</span>}
            </div>
          </div>
        </div>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Issues List */}
      {expanded && (
        <div className="border-t border-gray-700 divide-y divide-gray-700">
          {result.issues.map((issue, index) => (
            <ValidationIssueItem key={index} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

function ValidationIssueItem({ issue }: { issue: ValidationIssue }) {
  const icons = {
    error: <AlertCircle size={16} className="text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />,
    info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
  };

  const colors = {
    error: 'text-red-100',
    warning: 'text-yellow-100',
    info: 'text-blue-100',
  };

  return (
    <div className="p-3 text-sm">
      <div className="flex items-start gap-2">
        {icons[issue.severity]}
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${colors[issue.severity]}`}>
            {issue.message}
          </div>
          {issue.path && (
            <div className="text-xs text-gray-400 mt-0.5 font-mono">
              {issue.path}
            </div>
          )}
          {issue.suggestion && (
            <div className="text-xs text-gray-300 mt-1 bg-black/30 rounded px-2 py-1">
              <strong>Suggestion:</strong> {issue.suggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ValidationBadgeProps {
  result: ValidationResult;
  className?: string;
}

export function ValidationBadge({ result, className = '' }: ValidationBadgeProps) {
  if (result.issues.length === 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/30 text-green-400 rounded text-xs ${className}`}>
        <CheckCircle size={12} />
        Valid
      </span>
    );
  }

  if (result.valid) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded text-xs ${className}`}>
        <AlertTriangle size={12} />
        {result.warnings.length + result.info.length} warning{result.warnings.length + result.info.length !== 1 ? 's' : ''}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-red-900/30 text-red-400 rounded text-xs ${className}`}>
      <AlertCircle size={12} />
      {result.errors.length} error{result.errors.length !== 1 ? 's' : ''}
    </span>
  );
}
