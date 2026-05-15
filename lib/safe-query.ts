import { QueryResult } from "@/types/results";

export async function safeQuery<T>(
  query: () => Promise<T>
): Promise<QueryResult<T>> {
  try {
    const data = await query();
    return { ok: true, data };
  } catch (error) {
    console.log("Error in safeQuery:", error);
    return { ok: false, error };
  }
}
