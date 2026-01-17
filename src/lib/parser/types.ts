/**
 * Token types for skill line parsing
 */
export enum TokenType {
  // Mechanic
  MECHANIC = 'MECHANIC',

  // Brackets and delimiters
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  SEMICOLON = 'SEMICOLON',
  EQUALS = 'EQUALS',

  // Identifiers and values
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',

  // Special prefixes
  AT_SYMBOL = '@',          // Targeter prefix
  TILDE = '~',              // Trigger prefix
  QUESTION = '?',           // Inline condition prefix

  // Health modifier operators
  LESS_THAN = '<',
  GREATER_THAN = '>',

  // Other
  WHITESPACE = 'WHITESPACE',
  EOF = 'EOF',
}

/**
 * Token structure
 */
export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

/**
 * Health modifier configuration
 */
export interface HealthModifier {
  operator: '<' | '=' | '>';
  value: string; // e.g., "50%", "100", "30%-50%"
}

/**
 * Targeter configuration
 */
export interface TargeterConfig {
  type: string;              // e.g., "target", "self", "PIR"
  options?: Record<string, any>;
}

/**
 * Condition entry
 */
export interface ConditionEntry {
  condition: string;
  value?: any;
  action?: 'true' | 'false' | 'required' | 'cancel' | string;
}

/**
 * Skill line AST (Abstract Syntax Tree)
 */
export interface SkillLineAST {
  mechanic: string;
  parameters?: Record<string, any>;
  targeter?: TargeterConfig;
  trigger?: string;
  inlineConditions?: string[];     // e.g., ["?day", "?!raining"]
  healthModifier?: HealthModifier;
  chance?: number;
}

/**
 * Parser options
 */
export interface ParserOptions {
  preserveWhitespace?: boolean;
  strict?: boolean;
}

/**
 * Parser result
 */
export interface ParseResult {
  ast: SkillLineAST;
  errors: ParseError[];
  warnings: ParseWarning[];
}

/**
 * Parse error
 */
export interface ParseError {
  message: string;
  position: number;
  token?: Token;
}

/**
 * Parse warning
 */
export interface ParseWarning {
  message: string;
  position: number;
}
