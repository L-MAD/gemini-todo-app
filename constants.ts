// Boundary Value Analysis Constants
// Use these to design your test cases!

export const TODO_TITLE_MIN_LENGTH = 3;
export const TODO_TITLE_MAX_LENGTH = 60;

export const TODO_DESC_MAX_LENGTH = 200;

// New BVA Constants for Numerical Input
export const MIN_ESTIMATED_HOURS = 0;
export const MAX_ESTIMATED_HOURS = 100;

export const ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Title is required.',
  TITLE_TOO_SHORT: `Title must be at least ${TODO_TITLE_MIN_LENGTH} characters.`,
  TITLE_TOO_LONG: `Title cannot exceed ${TODO_TITLE_MAX_LENGTH} characters.`,
  DESC_TOO_LONG: `Description cannot exceed ${TODO_DESC_MAX_LENGTH} characters.`,
  DUE_DATE_PAST: 'Due date cannot be in the past.',
  ESTIMATE_NEGATIVE: `Hours cannot be negative (min ${MIN_ESTIMATED_HOURS}).`,
  ESTIMATE_TOO_HIGH: `Hours cannot exceed ${MAX_ESTIMATED_HOURS}.`,
};