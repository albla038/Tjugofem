export type QueryErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

// Error code for DAL mutations
export type MutationErrorCode =
  | "NOT_FOUND"
  | "CONFLICT"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";

// Error code for Server Actions
export type ActionErrorCode = MutationErrorCode | "UNAUTHORIZED";
