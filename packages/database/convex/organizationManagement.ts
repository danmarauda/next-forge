import { v } from 'convex/values';
import { entsTableFactory } from 'convex-ents';
import { asyncMap } from 'convex-helpers';
import type { Id } from './_generated/dataModel';
import { action, mutation, query } from './_generated/server';
import { entDefinitions } from './schema';

/**
 * Create organization with full configuration
 */
export const createOrganization = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    subdomain: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    plan: v.optional(v.string()),
    maxUsers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);

    const orgId = await table('organization').insert({
      name: args.name,
      slug: args.slug,
      subdomain: args.subdomain,
      primaryColor: args.primaryColor || '#AFCC37',
      secondaryColor: args.secondaryColor || '#435464',
      logoUrl: args.logoUrl,
      plan: args.plan || 'enterprise',
      maxUsers: args.maxUsers || 1000,
      monthlyCredits: 0,
      createdAt: Date.now(),
      status: 'active',
    });

    return orgId;
  },
});

/**
 * Update organization settings
 */
export const updateOrganizationSettings = mutation({
  args: {
    organizationId: v.id('organization'),
    settings: v.object({
      name: v.optional(v.string()),
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      status: v.optional(v.string()),
      plan: v.optional(v.string()),
      maxUsers: v.optional(v.number()),
      features: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const org = await table('organization').getX(args.organizationId);

    await org.patch({
      name: args.settings.name,
      primaryColor: args.settings.primaryColor,
      secondaryColor: args.settings.secondaryColor,
      logoUrl: args.settings.logoUrl,
      status: args.settings.status,
      plan: args.settings.plan,
      maxUsers: args.settings.maxUsers,
      features: args.settings.features
        ? JSON.stringify(args.settings.features)
        : undefined,
    });

    return { success: true };
  },
});

/**
 * List all organizations with stats
 */
export const listAllOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const orgs = await table('organization').collect();

    // Get member counts for each org
    const orgsWithStats = await asyncMap(orgs, async (org) => {
      const members = await org.edge('members');
      const doc = org.doc();

      return {
        _id: org._id,
        _creationTime: org._creationTime,
        name: doc.name,
        slug: doc.slug,
        subdomain: doc.subdomain,
        primaryColor: doc.primaryColor,
        secondaryColor: doc.secondaryColor,
        logoUrl: doc.logoUrl,
        status: doc.status,
        plan: doc.plan,
        maxUsers: doc.maxUsers,
        memberCount: members.length,
      };
    });

    return orgsWithStats;
  },
});

/**
 * Get organization details with full stats
 */
export const getOrganizationDetails = query({
  args: { organizationId: v.id('organization') },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const org = await table('organization').get(args.organizationId);

    if (!org) return null;

    const members = await org.edge('members');
    const invitations = await org.edge('invitations');
    const doc = org.doc();

    // Get role breakdown
    const roleStats = members.reduce(
      (acc, member) => {
        const role = member.role || 'member';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      _id: org._id,
      _creationTime: org._creationTime,
      name: doc.name,
      slug: doc.slug,
      subdomain: doc.subdomain,
      primaryColor: doc.primaryColor,
      secondaryColor: doc.secondaryColor,
      logoUrl: doc.logoUrl,
      faviconUrl: doc.faviconUrl,
      customDomain: doc.customDomain,
      status: doc.status,
      plan: doc.plan,
      maxUsers: doc.maxUsers,
      monthlyCredits: doc.monthlyCredits,
      features: doc.features ? JSON.parse(doc.features) : [],
      stats: {
        totalMembers: members.length,
        activeInvitations: invitations.filter((i) => i.status === 'pending')
          .length,
        roleBreakdown: roleStats,
      },
    };
  },
});

/**
 * Add user to organization
 */
export const addUserToOrganization = mutation({
  args: {
    organizationId: v.id('organization'),
    userId: v.id('user'),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);

    // Check if membership already exists
    const existingMembers = await table('member')
      .filter((q) =>
        q.and(
          q.eq(q.field('organizationId'), args.organizationId),
          q.eq(q.field('userId'), args.userId),
        ),
      )
      .collect();

    if (existingMembers.length > 0) {
      throw new Error('User is already a member of this organization');
    }

    const memberId = await table('member').insert({
      organizationId: args.organizationId,
      userId: args.userId,
      role: args.role,
      createdAt: Date.now(),
    });

    return memberId;
  },
});

/**
 * Remove user from organization
 */
export const removeUserFromOrganization = mutation({
  args: {
    memberId: v.id('member'),
  },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const member = await table('member').getX(args.memberId);

    await member.delete();

    return { success: true };
  },
});

/**
 * Update user role in organization
 */
export const updateUserRole = mutation({
  args: {
    memberId: v.id('member'),
    newRole: v.string(),
  },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const member = await table('member').getX(args.memberId);

    await member.patch({
      role: args.newRole,
    });

    return { success: true };
  },
});
