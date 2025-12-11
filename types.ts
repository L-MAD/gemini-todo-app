export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  createdAt: number;
  dueDate?: string; // ISO Date string YYYY-MM-DD
  estimatedHours: number;
}

export type FilterStatus = 'ALL' | 'ACTIVE' | 'COMPLETED';
export type SortOption = 'DATE_ADDED' | 'DUE_DATE' | 'PRIORITY' | 'EFFORT';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}