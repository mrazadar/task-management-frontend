/**
 * Generic, discriminated response type.
 *
 * Example:
 *   const res: ApiResponse<User> = await fetchUser();
 */
export type ApiResponse<T = unknown, E = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: E; message?: string }
