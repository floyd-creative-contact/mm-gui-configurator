import { Token, TokenType, SkillLineAST, ParseError, ParseWarning, TargeterConfig, HealthModifier } from './types';
import { tokenize } from './tokenizer';

/**
 * Parser for MythicMobs skill lines
 * Converts tokens into a structured AST
 */
export class SkillLineParser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ParseError[] = [];
  private warnings: ParseWarning[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Parse the tokens into a skill line AST
   */
  parse(): SkillLineAST {
    const ast: SkillLineAST = {
      mechanic: '',
    };

    try {
      // Parse mechanic (required)
      ast.mechanic = this.parseMechanic();

      // Parse parameters (optional, inside {})
      if (this.match(TokenType.LEFT_BRACE)) {
        ast.parameters = this.parseParameters();
      }

      // Parse targeter (optional, starts with @)
      if (this.match(TokenType.AT_SYMBOL)) {
        ast.targeter = this.parseTargeter();
      }

      // Parse trigger (optional, starts with ~)
      if (this.match(TokenType.TILDE)) {
        ast.trigger = this.parseTrigger();
      }

      // Parse inline conditions (optional, starts with ?)
      const conditions: string[] = [];
      while (this.match(TokenType.QUESTION)) {
        conditions.push(this.parseInlineCondition());
      }
      if (conditions.length > 0) {
        ast.inlineConditions = conditions;
      }

      // Parse health modifier (optional, <, =, or >)
      if (this.matchHealthModifier()) {
        ast.healthModifier = this.parseHealthModifier();
      }

      // Parse chance (optional, last number 0.0-1.0)
      if (this.peek().type === TokenType.NUMBER && this.isChance(this.peek().value)) {
        ast.chance = this.parseChance();
      }

    } catch (error) {
      this.errors.push({
        message: error instanceof Error ? error.message : 'Unknown parse error',
        position: this.peek().position,
        token: this.peek(),
      });
    }

    return ast;
  }

  /**
   * Get parse errors
   */
  getErrors(): ParseError[] {
    return this.errors;
  }

  /**
   * Get parse warnings
   */
  getWarnings(): ParseWarning[] {
    return this.warnings;
  }

  /**
   * Parse the mechanic name
   */
  private parseMechanic(): string {
    const token = this.consume(TokenType.IDENTIFIER, 'Expected mechanic name');
    return token.value;
  }

  /**
   * Parse parameters inside curly braces
   * Example: {amount=10;type=magic}
   */
  private parseParameters(): Record<string, any> {
    const params: Record<string, any> = {};

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      // Parse key
      const key = this.consume(TokenType.IDENTIFIER, 'Expected parameter name').value;

      // Consume equals sign
      this.consume(TokenType.EQUALS, 'Expected "=" after parameter name');

      // Parse value (could be number, string, identifier, or nested structure)
      const value = this.parseParameterValue();
      params[key] = value;

      // Check for semicolon (parameter separator)
      if (this.check(TokenType.SEMICOLON)) {
        this.advance();
      }
    }

    // Consume closing brace
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after parameters');

    return params;
  }

  /**
   * Parse a parameter value (can be various types)
   */
  private parseParameterValue(): any {
    const token = this.peek();

    // String value
    if (token.type === TokenType.STRING) {
      this.advance();
      // Remove quotes
      return token.value.substring(1, token.value.length - 1);
    }

    // Number value
    if (token.type === TokenType.NUMBER) {
      this.advance();
      const value = token.value;
      // Check if it's a percentage
      if (value.endsWith('%')) {
        return value;
      }
      // Check if it's an integer or float
      if (value.includes('.')) {
        return parseFloat(value);
      }
      return parseInt(value, 10);
    }

    // Boolean or identifier value
    if (token.type === TokenType.IDENTIFIER) {
      this.advance();
      const value = token.value.toLowerCase();
      if (value === 'true') return true;
      if (value === 'false') return false;
      return token.value; // Return as string identifier
    }

    // Nested structure (for inline conditions)
    if (token.type === TokenType.LEFT_BRACKET) {
      return this.parseNestedArray();
    }

    throw new Error(`Unexpected token type: ${token.type} at position ${token.position}`);
  }

  /**
   * Parse a nested array (for inline conditions in targeters)
   */
  private parseNestedArray(): any[] {
    this.consume(TokenType.LEFT_BRACKET, 'Expected "["');
    const items: any[] = [];

    while (!this.check(TokenType.RIGHT_BRACKET) && !this.isAtEnd()) {
      // For now, just collect the raw content
      // Full parsing of inline conditions can be more complex
      let depth = 0;

      while (!this.isAtEnd()) {
        if (this.check(TokenType.LEFT_BRACKET)) depth++;
        if (this.check(TokenType.RIGHT_BRACKET)) {
          if (depth === 0) break;
          depth--;
        }
        items.push(this.advance().value);
      }
    }

    this.consume(TokenType.RIGHT_BRACKET, 'Expected "]"');
    return items;
  }

  /**
   * Parse targeter
   * Example: @target, @PIR{r=5}, @nearestPlayer{r=10}
   */
  private parseTargeter(): TargeterConfig {
    const targeterName = this.consume(TokenType.IDENTIFIER, 'Expected targeter name').value;
    const targeter: TargeterConfig = {
      type: targeterName,
    };

    // Check for targeter options
    if (this.match(TokenType.LEFT_BRACE)) {
      targeter.options = this.parseParameters();
    }

    return targeter;
  }

  /**
   * Parse trigger
   * Example: ~onAttack, ~onTimer:100
   */
  private parseTrigger(): string {
    let trigger = this.consume(TokenType.IDENTIFIER, 'Expected trigger name').value;

    // Check for timer value (e.g., onTimer:100)
    if (this.peek().value === ':') {
      this.advance(); // consume ':'
      const value = this.consume(TokenType.NUMBER, 'Expected number after ":"').value;
      trigger += ':' + value;
    }

    return trigger;
  }

  /**
   * Parse inline condition
   * Example: ?day, ?!raining
   */
  private parseInlineCondition(): string {
    let condition = '';

    // Check for negation
    if (this.peek().value === '!') {
      condition += this.advance().value;
    }

    // Get condition name
    condition += this.consume(TokenType.IDENTIFIER, 'Expected condition name').value;

    // Check for parameters
    if (this.match(TokenType.LEFT_BRACE)) {
      // For now, just collect the parameter tokens as a string
      const start = this.current - 1;
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        this.advance();
      }
      this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
      // Get the raw parameter string
      const paramStr = this.tokens.slice(start, this.current).map(t => t.value).join('');
      condition += paramStr;
    }

    return condition;
  }

  /**
   * Parse health modifier
   * Example: <50%, >100, =30%-50%
   */
  private parseHealthModifier(): HealthModifier {
    let operator: '<' | '=' | '>' = '<';

    // Get operator
    if (this.match(TokenType.LESS_THAN)) {
      operator = '<';
    } else if (this.match(TokenType.GREATER_THAN)) {
      operator = '>';
    } else if (this.match(TokenType.EQUALS)) {
      operator = '=';
    }

    // Get value (could be number with %, or range like 30%-50%)
    let value = '';

    // Handle negative numbers
    if (this.peek().value === '-') {
      value += this.advance().value;
    }

    if (this.check(TokenType.NUMBER)) {
      value += this.advance().value;
    }

    // Handle ranges (e.g., 30%-50%)
    if (this.peek().value === '-' && this.peekAhead(1)?.type === TokenType.NUMBER) {
      value += this.advance().value; // consume '-'
      value += this.advance().value; // consume second number
    }

    return { operator, value };
  }

  /**
   * Parse chance value (0.0 - 1.0)
   */
  private parseChance(): number {
    const token = this.consume(TokenType.NUMBER, 'Expected chance value');
    const value = parseFloat(token.value);

    if (value < 0 || value > 1) {
      this.warnings.push({
        message: `Chance value ${value} should be between 0.0 and 1.0`,
        position: token.position,
      });
    }

    return value;
  }

  /**
   * Check if a value is a valid chance (0.0 - 1.0)
   */
  private isChance(value: string): boolean {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 1 && value.includes('.');
  }

  /**
   * Check if current token matches health modifier operator
   */
  private matchHealthModifier(): boolean {
    return this.check(TokenType.LESS_THAN) ||
           this.check(TokenType.GREATER_THAN) ||
           this.check(TokenType.EQUALS);
  }

  // ===== Helper methods =====

  /**
   * Check if current token matches type (without consuming)
   */
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  /**
   * Check if current token matches type and consume if it does
   */
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * Consume a token of a specific type or throw error
   */
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at position ${this.peek().position}`);
  }

  /**
   * Get current token without advancing
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Get token ahead by offset
   */
  private peekAhead(offset: number): Token | undefined {
    const pos = this.current + offset;
    if (pos >= this.tokens.length) return undefined;
    return this.tokens[pos];
  }

  /**
   * Move to next token and return previous
   */
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  /**
   * Check if at end of tokens
   */
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
}

/**
 * Convenience function to parse a skill line string
 */
export function parseSkillLine(input: string): SkillLineAST {
  const tokens = tokenize(input);
  const parser = new SkillLineParser(tokens);
  const ast = parser.parse();

  const errors = parser.getErrors();
  if (errors.length > 0) {
    console.warn('Parse errors:', errors);
  }

  return ast;
}
