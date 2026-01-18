import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import {
  getAllMechanicNames,
  getAllTargeterNames,
  getAllTriggerNames,
  getMechanic,
} from '../../lib/schema/schemaLoader';

interface SkillLineEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

interface Suggestion {
  text: string;
  description?: string;
  category?: string;
}

export function SkillLineEditor({
  value,
  onChange,
  placeholder = '- mechanic{param=value} @targeter ~trigger',
  className = '',
  rows = 3,
}: SkillLineEditorProps) {
  const { metaskills } = useProjectStore();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Detect what context we're in based on cursor position
  const detectContext = (text: string, cursorPos: number): { type: string; query: string; mechanic?: string } => {
    const beforeCursor = text.substring(0, cursorPos);
    const lastLine = beforeCursor.split('\n').pop() || '';

    // Check if we're typing a mechanic (after "- ")
    const mechanicMatch = lastLine.match(/^-\s+([a-zA-Z0-9_:]*)$/);
    if (mechanicMatch) {
      return { type: 'mechanic', query: mechanicMatch[1] };
    }

    // Check if we're typing parameters for a mechanic
    const paramMatch = lastLine.match(/-\s+(\w+)\{([^}]*)$/);
    if (paramMatch) {
      const mechanicName = paramMatch[1];
      const paramText = paramMatch[2];

      // Check if we're typing a metaskill name in skill mechanic
      if (mechanicName.toLowerCase() === 'skill') {
        const skillMatch = paramText.match(/s=([^;]*)$/);
        if (skillMatch) {
          return { type: 'metaskill', query: skillMatch[1] };
        }
      }

      // Otherwise, general parameter context
      const lastParam = paramText.split(';').pop() || '';
      const paramNameMatch = lastParam.match(/^([^=]*)$/);
      if (paramNameMatch) {
        return { type: 'parameter', query: paramNameMatch[1], mechanic: mechanicName };
      }
    }

    // Check if we're typing a targeter (after "@")
    const targeterMatch = lastLine.match(/@([a-zA-Z0-9_]*)$/);
    if (targeterMatch) {
      return { type: 'targeter', query: targeterMatch[1] };
    }

    // Check if we're typing a trigger (after "~")
    const triggerMatch = lastLine.match(/~([a-zA-Z0-9_:]*)$/);
    if (triggerMatch) {
      return { type: 'trigger', query: triggerMatch[1] };
    }

    return { type: 'none', query: '' };
  };

  // Generate suggestions based on context
  const generateSuggestions = (context: { type: string; query: string; mechanic?: string }): Suggestion[] => {
    const query = context.query.toLowerCase();

    switch (context.type) {
      case 'mechanic': {
        const mechanics = getAllMechanicNames()
          .filter(name => name.toLowerCase().includes(query))
          .slice(0, 10)
          .map(name => {
            const schema = getMechanic(name);
            return {
              text: name,
              description: schema?.description,
              category: schema?.category,
            };
          });
        return mechanics;
      }

      case 'targeter': {
        const targeters = getAllTargeterNames()
          .filter(name => name.toLowerCase().includes(query))
          .slice(0, 10)
          .map(name => ({
            text: name,
            category: 'targeter',
          }));
        return targeters;
      }

      case 'trigger': {
        const triggers = getAllTriggerNames()
          .filter(name => name.toLowerCase().includes(query))
          .slice(0, 10)
          .map(name => ({
            text: name,
            category: 'trigger',
          }));
        return triggers;
      }

      case 'metaskill': {
        const metaskillList = Array.from(metaskills.values())
          .filter(ms => ms.internalName.toLowerCase().includes(query))
          .slice(0, 10)
          .map(ms => ({
            text: ms.internalName,
            description: `Metaskill with ${ms.skills?.length || 0} skill(s)`,
            category: 'metaskill',
          }));
        return metaskillList;
      }

      case 'parameter': {
        if (context.mechanic) {
          const mechanicSchema = getMechanic(context.mechanic);
          if (mechanicSchema) {
            const params = Object.keys(mechanicSchema.parameters)
              .filter(name => name.toLowerCase().includes(query))
              .slice(0, 10)
              .map(name => {
                const paramSchema = mechanicSchema.parameters[name];
                return {
                  text: name,
                  description: paramSchema.description,
                  category: `${paramSchema.type}${paramSchema.required ? ' (required)' : ''}`,
                };
              });
            return params;
          }
        }
        return [];
      }

      default:
        return [];
    }
  };

  // Update suggestions when cursor position or value changes
  useEffect(() => {
    if (!textareaRef.current) return;

    const context = detectContext(value, cursorPosition);

    if (context.type !== 'none' && context.query !== undefined) {
      const newSuggestions = generateSuggestions(context);
      if (newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value, cursorPosition]);

  // Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Handle cursor movement
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionStart);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === 'Tab' || e.key === 'Enter') {
      if (suggestions.length > 0) {
        e.preventDefault();
        insertSuggestion(suggestions[selectedIndex]);
        return;
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      return;
    }
  };

  // Insert selected suggestion
  const insertSuggestion = (suggestion: Suggestion) => {
    if (!textareaRef.current) return;

    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);

    // Determine what to replace based on context
    const context = detectContext(value, cursorPosition);
    let newValue = value;
    let newCursorPos = cursorPosition;

    switch (context.type) {
      case 'mechanic': {
        const lastLine = beforeCursor.split('\n').pop() || '';
        const mechanicMatch = lastLine.match(/^-\s+([a-zA-Z0-9_:]*)$/);
        if (mechanicMatch) {
          const replaceStart = beforeCursor.length - mechanicMatch[1].length;
          newValue = value.substring(0, replaceStart) + suggestion.text + '{' + afterCursor;
          newCursorPos = replaceStart + suggestion.text.length + 1;
        }
        break;
      }

      case 'targeter': {
        const lastLine = beforeCursor.split('\n').pop() || '';
        const targeterMatch = lastLine.match(/@([a-zA-Z0-9_]*)$/);
        if (targeterMatch) {
          const replaceStart = beforeCursor.length - targeterMatch[1].length;
          newValue = value.substring(0, replaceStart) + suggestion.text + afterCursor;
          newCursorPos = replaceStart + suggestion.text.length;
        }
        break;
      }

      case 'trigger': {
        const lastLine = beforeCursor.split('\n').pop() || '';
        const triggerMatch = lastLine.match(/~([a-zA-Z0-9_:]*)$/);
        if (triggerMatch) {
          const replaceStart = beforeCursor.length - triggerMatch[1].length;
          newValue = value.substring(0, replaceStart) + suggestion.text + afterCursor;
          newCursorPos = replaceStart + suggestion.text.length;
        }
        break;
      }

      case 'metaskill': {
        const lastLine = beforeCursor.split('\n').pop() || '';
        const skillMatch = lastLine.match(/s=([^;]*)$/);
        if (skillMatch) {
          const replaceStart = beforeCursor.length - skillMatch[1].length;
          newValue = value.substring(0, replaceStart) + suggestion.text + afterCursor;
          newCursorPos = replaceStart + suggestion.text.length;
        }
        break;
      }

      case 'parameter': {
        const lastLine = beforeCursor.split('\n').pop() || '';
        // Find the position within the parameter block
        const paramBlockMatch = lastLine.match(/-\s+(\w+)\{([^}]*)$/);
        if (paramBlockMatch) {
          const paramText = paramBlockMatch[2];
          const lastParam = paramText.split(';').pop() || '';
          const paramNameMatch = lastParam.match(/^([a-zA-Z0-9_]*)$/);
          if (paramNameMatch) {
            const replaceStart = beforeCursor.length - paramNameMatch[1].length;
            newValue = value.substring(0, replaceStart) + suggestion.text + '=' + afterCursor;
            newCursorPos = replaceStart + suggestion.text.length + 1;
          }
        }
        break;
      }
    }

    onChange(newValue);
    setShowSuggestions(false);

    // Set cursor position after React updates
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, showSuggestions]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-primary font-mono text-sm ${className}`}
        rows={rows}
      />

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => insertSuggestion(suggestion)}
              className={`px-3 py-2 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-semibold truncate">{suggestion.text}</div>
                  {suggestion.description && (
                    <div className="text-xs text-gray-400 truncate">{suggestion.description}</div>
                  )}
                </div>
                {suggestion.category && (
                  <div className="text-xs px-2 py-0.5 bg-gray-700 rounded truncate flex-shrink-0">
                    {suggestion.category}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-1 text-xs text-gray-500">
        Start typing: <code>- </code> for mechanics, <code>@</code> for targeters, <code>~</code> for triggers.
        Use <kbd>Tab</kbd> or <kbd>Enter</kbd> to autocomplete.
      </div>
    </div>
  );
}
