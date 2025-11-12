"use client";

export function SearchResults({ query }: { query: string }) {
  // Search functionality will be implemented once auth is set up
  // Convex has full-text search capabilities built-in
  
  return (
    <div className="rounded-xl bg-muted/50 p-6">
      <h3 className="text-xl font-semibold mb-4">Search Results for "{query}"</h3>
      <p className="text-muted-foreground">
        Search functionality will be available once authentication is configured.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Convex provides powerful full-text search across todos, projects, and more!
      </p>
    </div>
  );
}

