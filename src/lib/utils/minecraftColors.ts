// Minecraft color code mappings
export const MINECRAFT_COLORS: Record<string, string> = {
  '0': '#000000', // Black
  '1': '#0000AA', // Dark Blue
  '2': '#00AA00', // Dark Green
  '3': '#00AAAA', // Dark Cyan
  '4': '#AA0000', // Dark Red
  '5': '#AA00AA', // Purple
  '6': '#FFAA00', // Gold
  '7': '#AAAAAA', // Gray
  '8': '#555555', // Dark Gray
  '9': '#5555FF', // Blue
  'a': '#55FF55', // Green
  'b': '#55FFFF', // Cyan
  'c': '#FF5555', // Red
  'd': '#FF55FF', // Pink
  'e': '#FFFF55', // Yellow
  'f': '#FFFFFF', // White
};

export const MINECRAFT_FORMATS: Record<string, string> = {
  'l': 'bold',
  'o': 'italic',
  'n': 'underline',
  'm': 'strikethrough',
  'k': 'obfuscated',
  'r': 'reset',
};

export interface MinecraftTextSegment {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

export function parseMinecraftText(text: string): MinecraftTextSegment[] {
  const segments: MinecraftTextSegment[] = [];
  let currentSegment: MinecraftTextSegment = { text: '' };

  let i = 0;
  while (i < text.length) {
    // Check for color code
    if ((text[i] === '&' || text[i] === '§') && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();

      // Save current segment if it has text
      if (currentSegment.text.length > 0) {
        segments.push(currentSegment);
        currentSegment = {
          text: '',
          color: currentSegment.color,
          bold: currentSegment.bold,
          italic: currentSegment.italic,
          underline: currentSegment.underline,
          strikethrough: currentSegment.strikethrough,
          obfuscated: currentSegment.obfuscated,
        };
      }

      // Apply color
      if (MINECRAFT_COLORS[code]) {
        currentSegment.color = MINECRAFT_COLORS[code];
      }

      // Apply formatting
      else if (MINECRAFT_FORMATS[code]) {
        const format = MINECRAFT_FORMATS[code];
        if (format === 'bold') currentSegment.bold = true;
        else if (format === 'italic') currentSegment.italic = true;
        else if (format === 'underline') currentSegment.underline = true;
        else if (format === 'strikethrough') currentSegment.strikethrough = true;
        else if (format === 'obfuscated') currentSegment.obfuscated = true;
        else if (format === 'reset') {
          // Reset all formatting
          currentSegment = { text: '', color: '#FFFFFF' };
        }
      }

      i += 2; // Skip the & and the code
    } else {
      currentSegment.text += text[i];
      i++;
    }
  }

  // Add final segment
  if (currentSegment.text.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

export function getColorName(code: string): string {
  const colorNames: Record<string, string> = {
    '0': 'Black',
    '1': 'Dark Blue',
    '2': 'Dark Green',
    '3': 'Dark Cyan',
    '4': 'Dark Red',
    '5': 'Purple',
    '6': 'Gold',
    '7': 'Gray',
    '8': 'Dark Gray',
    '9': 'Blue',
    'a': 'Green',
    'b': 'Cyan',
    'c': 'Red',
    'd': 'Pink',
    'e': 'Yellow',
    'f': 'White',
  };
  return colorNames[code.toLowerCase()] || 'Unknown';
}
