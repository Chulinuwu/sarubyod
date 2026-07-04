export function dbErrorResponse(e: unknown): Response {
  const notConfigured = (e as Error).message === "supabase_not_configured";
  return Response.json(
    { error: notConfigured ? "supabase_not_configured" : "save_failed" },
    { status: notConfigured ? 503 : 500 },
  );
}
