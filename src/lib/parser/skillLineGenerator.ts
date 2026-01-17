import { SkillLineAST } from './types';

/**
 * Generates a skill line string from an AST
 * This enables round-trip conversion: string -> AST -> string
 */
export class SkillLineGenerator {
  /**
   * Generate a skill line string from an AST
   */
  generate(ast: SkillLineAST): string {
    const parts: string[] = [];

    // Mechanic (required)
    parts.push(ast.mechanic);

    // Parameters (optional)
    if (ast.parameters && Object.keys(ast.parameters).length > 0) {
      parts.push(this.generateParameters(ast.parameters));
    }

    // Targeter (optional)
    if (ast.targeter) {
      parts.push(this.generateTargeter(ast.targeter));
    }

    // Trigger (optional)
    if (ast.trigger) {
      parts.push(this.generateTrigger(ast.trigger));
    }

    // Inline conditions (optional)
    if (ast.inlineConditions && ast.inlineConditions.length > 0) {
      parts.push(...ast.inlineConditions.map(c => `?${c}`));
    }

    // Health modifier (optional)
    if (ast.healthModifier) {
      parts.push(this.generateHealthModifier(ast.healthModifier));
    }

    // Chance (optional)
    if (ast.chance !== undefined) {
      parts.push(ast.chance.toString());
    }

    return parts.join(' ');
  }

  /**
   * Generate parameters string
   * Example: {amount=10;type=magic}
   */
  private generateParameters(params: Record<string, any>): string {
    const entries = Object.entries(params);
    const paramStrings = entries.map(([key, value]) => {
      return `${key}=${this.generateParameterValue(value)}`;
    });

    return `{${paramStrings.join(';')}}`;
  }

  /**
   * Generate parameter value (handles different types)
   */
  private generateParameterValue(value: any): string {
    // Boolean
    if (typeof value === 'boolean') {
      return value.toString();
    }

    // Number
    if (typeof value === 'number') {
      return value.toString();
    }

    // String (check if needs quotes)
    if (typeof value === 'string') {
      // If string contains special characters, quote it
      if (this.needsQuoting(value)) {
        return `"${value}"`;
      }
      return value;
    }

    // Array (for inline conditions)
    if (Array.isArray(value)) {
      return `[${value.join(' ')}]`;
    }

    // Object (nested structure)
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Check if a string value needs to be quoted
   */
  private needsQuoting(value: string): boolean {
    // Quote if contains spaces, special chars, or starts with number
    return /[\s;{}@~<>=]/.test(value) || /^\d/.test(value);
  }

  /**
   * Generate targeter string
   * Example: @target, @PIR{r=5}
   */
  private generateTargeter(targeter: { type: string; options?: Record<string, any> }): string {
    let result = `@${targeter.type}`;

    if (targeter.options && Object.keys(targeter.options).length > 0) {
      result += this.generateParameters(targeter.options);
    }

    return result;
  }

  /**
   * Generate trigger string
   * Example: ~onAttack, ~onTimer:100
   */
  private generateTrigger(trigger: string): string {
    return `~${trigger}`;
  }

  /**
   * Generate health modifier string
   * Example: <50%, >100, =30%-50%
   */
  private generateHealthModifier(modifier: { operator: string; value: string }): string {
    return `${modifier.operator}${modifier.value}`;
  }
}

/**
 * Convenience function to generate a skill line from an AST
 */
export function generateSkillLine(ast: SkillLineAST): string {
  const generator = new SkillLineGenerator();
  return generator.generate(ast);
}
