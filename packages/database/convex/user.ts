import { zid } from 'convex-helpers/server/zod';
import { z } from 'zod';
import { createAuthMutation, createPublicQuery } from './functions';

// Check if user is authenticated
export const getIsAuthenticated = createPublicQuery({
  publicOnly: true,
})({
  handler: async (ctx) => !!(await ctx.auth.getUserIdentity()),
});

// Get session user (minimal data)
export const getSessionUser = createPublicQuery()({
  handler: async ({ user: userEnt }) => {
    if (!userEnt) {
      return null;
    }

    const { doc, edge, edgeX, ...user } = userEnt;

    return {
      id: user.id,
      activeOrganization: user.activeOrganization,
      image: user.image,
      isAdmin: user.isAdmin,
      name: user.name,
      plan: user.plan,
      personalOrganizationId: user.personalOrganizationId,
    };
  },
});

// Get full user data for the authenticated user
export const getCurrentUser = createPublicQuery()({
  handler: async (ctx) => {
    const { user } = ctx;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      activeOrganization: user.activeOrganization,
      image: user.image,
      isAdmin: user.isAdmin,
      name: user.name,
      plan: user.plan,
      personalOrganizationId: user.personalOrganizationId,
    };
  },
});

// Update user settings
export const updateSettings = createAuthMutation()({
  args: {
    bio: z.string().optional(),
    name: z.string().optional(),
  },
  handler: async (ctx, args) => {
    const { user } = ctx;
    const { bio, name } = args;

    // Build update object
    const updateData: Record<string, any> = {};

    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (name !== undefined) {
      updateData.name = name;
    }

    await user.patch(updateData);

    return { success: true };
  },
});
