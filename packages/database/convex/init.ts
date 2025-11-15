// Temporarily disabled for visual testing
// TODO: Fix Zod schema validation issue in convex-helpers

/**
 * Initialize the database on startup. This function runs automatically when
 * starting the dev server with --run init It checks if the database needs
 * seeding and runs the seed function if needed.
 */
export default async () => {
  console.log(
    'Database initialization temporarily disabled for visual testing',
  );
  return null;
};
