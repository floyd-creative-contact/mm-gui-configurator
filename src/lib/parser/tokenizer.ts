import { Token, TokenType } from './types';

/**
 * Tokenizer for MythicMobs skill lines
 * Converts a skill line string into a sequence of tokens
 */
export class SkillLineTokenizer {
  private input: string;
  private position: number = 0;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input;
  }

  /**
   * Tokenize the input string
   */
  tokenize(): Token[] {
    this.tokens = [];
    this.position = 0;

    while (this.position < this.input.length) {
      this.scanToken();
    }

    this.addToken(TokenType.EOF, '');
    return this.tokens;
  }

  /**
   * Scan and add the next token
   */
  private scanToken(): void {
    const char = this.current();

    // Skip whitespace (but we might want to preserve it for formatting)
    if (this.isWhitespace(char)) {
      this.skipWhitespace();
      return;
    }

    // Special characters
    switch (char) {
      case '{':
        this.addToken(TokenType.LEFT_BRACE, char);
        this.advance();
        return;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE, char);
        this.advance();
        return;
      case '[':
        this.addToken(TokenType.LEFT_BRACKET, char);
        this.advance();
        return;
      case ']':
        this.addToken(TokenType.RIGHT_BRACKET, char);
        this.advance();
        return;
      case ';':
        this.addToken(TokenType.SEMICOLON, char);
        this.advance();
        return;
      case '=':
        this.addToken(TokenType.EQUALS, char);
        this.advance();
        return;
      case '@':
        this.addToken(TokenType.AT_SYMBOL, char);
        this.advance();
        return;
      case '~':
        this.addToken(TokenType.TILDE, char);
        this.advance();
        return;
      case '?':
        this.addToken(TokenType.QUESTION, char);
        this.advance();
        return;
      case '<':
        this.addToken(TokenType.LESS_THAN, char);
        this.advance();
        return;
      case '>':
        this.addToken(TokenType.GREATER_THAN, char);
        this.advance();
        return;
    }

    // Numbers (including decimals for chance values)
    if (this.isDigit(char) || (char === '-' && this.isDigit(this.peek()))) {
      this.scanNumber();
      return;
    }

    // Strings (quoted)
    if (char === '"' || char === "'") {
      this.scanString(char);
      return;
    }

    // Identifiers and keywords
    if (this.isAlpha(char)) {
      this.scanIdentifier();
      return;
    }

    // If we can't match anything, skip this character
    this.advance();
  }

  /**
   * Scan a number (integer or decimal)
   */
  private scanNumber(): void {
    const start = this.position;

    // Handle negative numbers
    if (this.current() === '-') {
      this.advance();
    }

    while (this.isDigit(this.current())) {
      this.advance();
    }

    // Handle decimal point
    if (this.current() === '.' && this.isDigit(this.peek())) {
      this.advance(); // consume '.'
      while (this.isDigit(this.current())) {
        this.advance();
      }
    }

    // Handle percentages
    if (this.current() === '%') {
      this.advance();
    }

    const value = this.input.substring(start, this.position);
    this.addToken(TokenType.NUMBER, value);
  }

  /**
   * Scan a quoted string
   */
  private scanString(quote: string): void {
    const start = this.position;
    this.advance(); // consume opening quote

    while (this.current() !== quote && !this.isAtEnd()) {
      // Handle escaped quotes
      if (this.current() === '\\' && this.peek() === quote) {
        this.advance(); // skip backslash
        this.advance(); // skip quote
      } else {
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at position ${start}`);
    }

    this.advance(); // consume closing quote
    const value = this.input.substring(start, this.position);
    this.addToken(TokenType.STRING, value);
  }

  /**
   * Scan an identifier (mechanic name, parameter name, etc.)
   */
  private scanIdentifier(): void {
    const start = this.position;

    while (this.isAlphaNumeric(this.current()) || this.current() === '_' || this.current() === ':' || this.current() === '-') {
      this.advance();
    }

    const value = this.input.substring(start, this.position);
    this.addToken(TokenType.IDENTIFIER, value);
  }

  /**
   * Skip whitespace characters
   */
  private skipWhitespace(): void {
    while (this.isWhitespace(this.current())) {
      this.advance();
    }
  }

  /**
   * Add a token to the list
   */
  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      position: this.position - value.length,
    });
  }

  /**
   * Get current character
   */
  private current(): string {
    if (this.isAtEnd()) return '\0';
    return this.input[this.position];
  }

  /**
   * Get next character without advancing
   */
  private peek(offset: number = 1): string {
    const pos = this.position + offset;
    if (pos >= this.input.length) return '\0';
    return this.input[pos];
  }

  /**
   * Move to next character
   */
  private advance(): void {
    this.position++;
  }

  /**
   * Check if at end of input
   */
  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  /**
   * Check if character is whitespace
   */
  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\r' || char === '\n';
  }

  /**
   * Check if character is a digit
   */
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  /**
   * Check if character is alphabetic
   */
  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }

  /**
   * Check if character is alphanumeric
   */
  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }
}

/**
 * Convenience function to tokenize a skill line
 */
export function tokenize(input: string): Token[] {
  const tokenizer = new SkillLineTokenizer(input);
  return tokenizer.tokenize();
}
