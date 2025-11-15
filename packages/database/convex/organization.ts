// Temporarily disabled for visual testing
// TODO: Fix Zod schema validation issues in convex-helpers

// Minimal stub to prevent compilation errors
export const listOrganizations = () => ({
  canCreateOrganization: true,
  organizations: [],
});
export const createOrganization = () => ({ id: 'stub', slug: 'stub' });
export const updateOrganization = () => null;
export const setActiveOrganization = () => null;
export const acceptInvitation = () => null;
export const rejectInvitation = () => null;
export const removeMember = () => null;
export const leaveOrganization = () => null;
export const updateMemberRole = () => null;
export const deleteOrganization = () => null;
export const getOrganization = () => null;
export const getOrganizationOverview = () => null;
export const listMembers = () => ({ isPersonal: false, members: [] });
export const listPendingInvitations = () => [];
export const inviteMember = () => null;
export const cancelInvitation = () => null;
