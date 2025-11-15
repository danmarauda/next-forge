// Temporarily disabled for visual testing
// TODO: Fix Zod schema validation issues in convex-helpers

// Minimal stub to prevent compilation errors
export const listTodosInternal = () => ({ todos: [] });
export const createTodoInternal = () => ({ id: 'stub', title: 'stub' });
export const updateTodoInternal = () => null;
export const deleteTodoInternal = () => null;
