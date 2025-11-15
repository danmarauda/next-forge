import { v } from 'convex/values';
import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod';
import { internalMutation, internalQuery } from './_generated/server';
import type { Id } from './_generated/dataModel';

/**
 * Internal WorkOS mutations and queries
 * These are called from webhook handlers and auth actions
 */

/**
 * Create user from WorkOS authentication
 */
export const createUserFromWorkOS = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
    image: v.union(v.string(), v.null()),
    emailVerified: v.boolean(),
    role: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create user
    const userId = await ctx.table('user').insert({
      email: args.email,
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
      image: args.image,
      emailVerified: args.emailVerified,
      role: args.role,
      createdAt: now,
      updatedAt: now,
    });

    // Create personal organization
    const orgSlug = args.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const orgId = await ctx.table('organization').insert({
      name: `${args.name}'s Organization`,
      slug: orgSlug,
      monthlyCredits: 0,
      createdAt: now,
    });

    // Add user as owner of personal organization
    await ctx.table('member').insert({
      organizationId: orgId,
      userId: userId,
      role: 'owner',
      createdAt: now,
    });

    // Update user with personal organization
    await ctx.table('user').getX(userId).patch({
      personalOrganizationId: orgId,
      lastActiveOrganizationId: orgId,
    });

    return { userId, organizationId: orgId };
  },
});

/**
 * Update user from WorkOS
 */
export const updateUserFromWorkOS = internalMutation({
  args: {
    userId: v.id('user'),
    name: v.string(),
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
    image: v.union(v.string(), v.null()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.table('user').getX(args.userId).patch({
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
      image: args.image,
      emailVerified: args.emailVerified,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Soft delete user from WorkOS
 */
export const softDeleteUserFromWorkOS = internalMutation({
  args: {
    userId: v.id('user'),
  },
  handler: async (ctx, args) => {
    await ctx.table('user').getX(args.userId).patch({
      deletedAt: Date.now(),
      banned: true,
      banReason: 'User deleted from WorkOS',
    });
  },
});

/**
 * Create session from WorkOS
 */
export const createSessionFromWorkOS = internalMutation({
  args: {
    userId: v.id('user'),
    token: v.string(),
    expiresAt: v.number(),
    activeOrganizationId: v.union(v.id('organization'), v.null()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const sessionId = await ctx.table('session').insert({
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      activeOrganizationId: args.activeOrganizationId,
      createdAt: now,
      updatedAt: now,
    });

    return { sessionId };
  },
});

/**
 * Update session from WorkOS
 */
export const updateSessionFromWorkOS = internalMutation({
  args: {
    sessionId: v.id('session'),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.table('session').getX(args.sessionId).patch({
      token: args.token,
      expiresAt: args.expiresAt,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete session from WorkOS
 */
export const deleteSessionFromWorkOS = internalMutation({
  args: {
    sessionId: v.id('session'),
  },
  handler: async (ctx, args) => {
    await ctx.table('session').getX(args.sessionId).delete();
  },
});

/**
 * Get sessions by token (internal query)
 */
export const getSessionsByTokenInternal = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.table('session').get('token', args.token);
    if (!sessions) return [];
    const sessionArray = Array.isArray(sessions) ? sessions : [sessions];
    return sessionArray.map((s) => ({
      _id: s._id,
      userId: s.userId,
      token: s.token,
      expiresAt: s.expiresAt,
      activeOrganizationId: s.activeOrganizationId,
    }));
  },
});

/**
 * Get sessions by user ID (internal query)
 */
export const getSessionsByUserIdInternal = internalQuery({
  args: {
    userId: v.id('user'),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.table('session').get('userId', args.userId);
    if (!sessions) return [];
    const sessionArray = Array.isArray(sessions) ? sessions : [sessions];
    return sessionArray.map((s) => ({
      _id: s._id,
      userId: s.userId,
      token: s.token,
      expiresAt: s.expiresAt,
      activeOrganizationId: s.activeOrganizationId,
    }));
  },
});

/**
 * Sync organization from WorkOS webhook
 */
export const syncOrganization = internalMutation({
  args: {
    workosOrgId: v.string(),
    name: v.string(),
    domains: v.optional(v.array(v.string())),
    allowProfilesOutsideOrganization: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Generate slug from name
    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if organization already exists by WorkOS ID
    const existingOrgs = await ctx.table('organization').take(1000);
    const existingOrg = existingOrgs.find(
      (org) =>
        org.metadata &&
        JSON.parse(org.metadata).workosOrgId === args.workosOrgId,
    );

    const metadata = JSON.stringify({
      workosOrgId: args.workosOrgId,
      domains: args.domains || [],
      allowProfilesOutsideOrganization:
        args.allowProfilesOutsideOrganization || false,
    });

    if (existingOrg) {
      // Update existing organization
      await ctx.table('organization').getX(existingOrg._id).patch({
        name: args.name,
        slug: slug,
        metadata: metadata,
      });
      return existingOrg._id;
    } else {
      // Create new organization
      const orgId = await ctx.table('organization').insert({
        name: args.name,
        slug: slug,
        metadata: metadata,
        monthlyCredits: 0,
        createdAt: Date.now(),
      });
      return orgId;
    }
  },
});

/**
 * Delete organization from WorkOS webhook
 */
export const deleteOrganization = internalMutation({
  args: {
    workosOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find organization by WorkOS ID
    const existingOrgs = await ctx.table('organization').take(1000);
    const existingOrg = existingOrgs.find(
      (org) =>
        org.metadata &&
        JSON.parse(org.metadata).workosOrgId === args.workosOrgId,
    );

    if (existingOrg) {
      // Delete organization
      await ctx.table('organization').getX(existingOrg._id).delete();
    }
  },
});