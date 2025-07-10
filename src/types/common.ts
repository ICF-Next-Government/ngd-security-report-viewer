// Common types shared across the application

// File input types
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: unknown;
}

// Pagination types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

// Filter types
export interface FilterState {
  severity: string[];
  file: string;
  search: string;
  tags: string[];
}

// Sort types
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: string;
  direction: SortDirection;
}

// Export types
export interface ExportOptions {
  format: "html" | "pdf";
  includeFilters: boolean;
  includeSummary: boolean;
  includeDetails: boolean;
}

// Theme types
export type Theme = "light" | "dark" | "system";

// Generic result type for operations
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// Async operation state
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Time range for filtering
export interface TimeRange {
  start?: Date;
  end?: Date;
}

// Statistics types
export interface Statistics {
  total: number;
  bySeverity: Record<string, number>;
  byFile: Record<string, number>;
  byRule: Record<string, number>;
  byTag: Record<string, number>;
}

// Configuration types
export interface AppConfig {
  maxFileSize: number;
  enabledFormats: string[];
  defaultTheme: Theme;
  animationDuration: number;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

// Event handler types
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// Component props base types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

export interface BaseFormComponentProps extends BaseComponentProps {
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}
