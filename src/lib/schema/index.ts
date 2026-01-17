/**
 * MythicMobs Schema Database
 *
 * Provides comprehensive schema definitions for mechanics, targeters,
 * conditions, and triggers with validation and autocomplete support.
 */

// Export types
export * from './types';

// Export schema data
export { MECHANICS } from './mechanics';
export { TARGETERS } from './targeters';
export { CONDITIONS } from './conditions';
export { TRIGGERS } from './triggers';

// Export schema loader utilities
export * from './schemaLoader';
