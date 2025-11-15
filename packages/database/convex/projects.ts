// Temporarily disabled for visual testing
// TODO: Fix Zod schema validation issues in convex-helpers

// Minimal stub to prevent compilation errors
export const listProjects = () => ({ projects: [], canCreateProject: true });
export const createProject = () => ({ id: 'stub', name: 'stub' });
export const updateProject = () => null;
export const deleteProject = () => null;
export const getProject = () => null;
