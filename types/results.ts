import { ActionErrorCode, MutationErrorCode } from "@/types/error-codes";

// Return type for DAL safe queries
export type QueryResult<Data> =
  | { ok: true; data: Data }
  | { ok: false; error: unknown };

// Return type for DAL mutations
export type MutationResult<Data = void> =
  | { ok: true; data: Data }
  | { ok: false; errorCode: MutationErrorCode };

// Return type for Server Actions
export type ActionResponse<Data = void> =
  | { success: true; data: Data }
  | { success: false; errorCode: ActionErrorCode };
