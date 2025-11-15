import { v } from 'convex/values';
import { z } from 'zod';
import { internalMutation } from './_generated/server';

/**
 * Internal WorkOS mutations
 * These are called from webhook handlers and should not be exposed publicly
 */

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
    // Since we're using Better Auth's organization table, we'll store WorkOS ID in metadata
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
      // Create new organization via Better Auth API
      // Note: We'll need to create it through the auth API or directly insert
      // For now, we'll insert directly but this should ideally go through Better Auth
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
