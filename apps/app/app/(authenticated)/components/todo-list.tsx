"use client";

import { api } from "@repo/database";
import { useQuery } from "convex/react";

export function TodoList() {
  // This will use the todos query from packages/database/convex/todos.ts
  // For now, we'll just show a placeholder since we need to set up auth first
  
  return (
    <div className="rounded-xl bg-muted/50 p-6">
      <h3 className="text-xl font-semibold mb-4">Todos</h3>
      <p className="text-muted-foreground">
        Todo list will appear here once authentication is configured.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        The Convex backend is ready with todos, projects, tags, and more!
      </p>
    </div>
  );
}

