import { parseMinecraftText, MinecraftTextSegment } from '../../lib/utils/minecraftColors';
import { useEffect, useState } from 'react';

interface MinecraftTextProps {
  text: string;
  className?: string;
}

export function MinecraftText({ text, className = '' }: MinecraftTextProps) {
  const [segments, setSegments] = useState<MinecraftTextSegment[]>([]);

  useEffect(() => {
    setSegments(parseMinecraftText(text));
  }, [text]);

  return (
    <div className={`font-minecraft inline-flex flex-wrap items-baseline ${className}`}>
      {segments.map((segment, index) => {
        const style: React.CSSProperties = {
          color: segment.color || '#FFFFFF',
          fontWeight: segment.bold ? 'bold' : 'normal',
          fontStyle: segment.italic ? 'italic' : 'normal',
          textDecoration: segment.underline && segment.strikethrough
            ? 'underline line-through'
            : segment.underline
            ? 'underline'
            : segment.strikethrough
            ? 'line-through'
            : 'none',
        };

        // Handle obfuscated text (randomly changing characters)
        if (segment.obfuscated) {
          return (
            <ObfuscatedText
              key={index}
              text={segment.text}
              style={style}
            />
          );
        }

        return (
          <span key={index} style={style}>
            {segment.text}
          </span>
        );
      })}
    </div>
  );
}

// Component for obfuscated text (Minecraft's "magic" effect)
function ObfuscatedText({ text, style }: { text: string; style: React.CSSProperties }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

    const interval = setInterval(() => {
      const newText = text
        .split('')
        .map(char => {
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setDisplayText(newText);
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return <span style={style}>{displayText}</span>;
}

// Preview component with dark background like Minecraft
export function MinecraftTextPreview({ text, showLabel = true }: { text: string; showLabel?: boolean }) {
  if (!text || text.trim() === '') {
    return (
      <div className="p-3 bg-gray-900 rounded border border-gray-700">
        <div className="text-gray-500 text-sm italic">No display name set</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showLabel && <div className="text-xs font-medium text-gray-400">Preview:</div>}
      <div className="p-3 bg-gray-900 rounded border border-gray-700">
        <MinecraftText text={text} className="text-xl drop-shadow-sm" />
      </div>
    </div>
  );
}
