// Common types shared across multiple domains
export interface APIResponse<T> {
  status: {
    code: number;
    message: string;
  };
  groups: T[];
  // Remove Game type reference to avoid circular dependency
  games?: any[]; // This will be properly typed when used with generics
}