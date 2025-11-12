export const GET = () => {
  // Convex cron jobs are handled differently - this is just a health check
  // For actual cron jobs, use Convex scheduled functions in convex/crons.ts

  // Simple health check - no database operation needed
  return new Response("OK", { status: 200 });
};
