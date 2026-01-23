import { ReactNode, useState } from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, className = '', side = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 border border-gray-700 rounded shadow-lg whitespace-normal max-w-xs ${sideClasses[side]} ${className}`}
          style={{ pointerEvents: 'none' }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 transform rotate-45 ${
              side === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' :
              side === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' :
              side === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t' :
              'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b'
            }`}
          />
        </div>
      )}
    </div>
  );
}

interface HelpTooltipProps {
  content: ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTooltip({ content, className = '', side = 'top' }: HelpTooltipProps) {
  return (
    <Tooltip content={content} side={side} className={className}>
      <HelpCircle size={16} className="text-gray-400 hover:text-gray-300 transition-colors inline-block" />
    </Tooltip>
  );
}

interface DocLinkProps {
  url: string;
  label?: string;
  className?: string;
}

export function DocLink({ url, label = 'Documentation', className = '' }: DocLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors ${className}`}
    >
      {label}
      <ExternalLink size={14} />
    </a>
  );
}

interface InfoBoxProps {
  title?: string;
  children: ReactNode;
  type?: 'info' | 'warning' | 'success' | 'tip';
  className?: string;
}

export function InfoBox({ title, children, type = 'info', className = '' }: InfoBoxProps) {
  const typeClasses = {
    info: 'bg-blue-900/30 border-blue-700 text-blue-100',
    warning: 'bg-yellow-900/30 border-yellow-700 text-yellow-100',
    success: 'bg-green-900/30 border-green-700 text-green-100',
    tip: 'bg-purple-900/30 border-purple-700 text-purple-100',
  };

  return (
    <div className={`p-3 border rounded text-sm ${typeClasses[type]} ${className}`}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
