import { v } from 'convex/values';
import { entsTableFactory } from 'convex-ents';
import { asyncMap } from 'convex-helpers';
import type { Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { mutation, query } from './_generated/server';
import type { AuthCtx } from './functions';

import { entDefinitions } from './schema';

/**
 * List all organizations for a user
 */
export const listUserOrganizations = query({
  args: { userId: v.id('user') },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx as any, entDefinitions);
    const user = await (table as any)('user').get(args.userId);

    if (!user) {
      return [];
    }

    const memberships = await user.edge('members');

    if (!memberships.length) {
      return [];
    }

    return asyncMap(memberships, async (membership: any) => {
      const org = await membership.edgeX('organization');
      const doc = org.doc();

      return {
        _id: org._id,
        _creationTime: org._creationTime,
        name: doc.name,
        slug: doc.slug,
        logo: doc.logo,
        logoUrl: doc.logoUrl,
        primaryColor: doc.primaryColor,
        secondaryColor: doc.secondaryColor,
        subdomain: doc.subdomain,
        role: membership.role || 'member',
      };
    });
  },
});

/**
 * Helper function for internal use
 */
export const listUserOrganizationsHelper = async (
  ctx: AuthCtx<QueryCtx | MutationCtx>,
  userId: Id<'user'>,
) => {
  const table = entsTableFactory(ctx as any, entDefinitions);
  const user = await (table as any)('user').getX(userId);
  const memberships = await user.edge('members');

  if (!memberships.length) {
    return [];
  }

  return asyncMap(memberships, async (membership: any) => {
    const org = await membership.edgeX('organization');

    return {
      ...org.doc(),
      _creationTime: org._creationTime,
      _id: org._id,
      role: membership.role || 'member',
    };
  });
};

export const createPersonalOrganization = async (
  ctx: MutationCtx,
  args: {
    email: string;
    image: string | null;
    name: string;
    userId: Id<'user'>;
  },
) => {
  const table = entsTableFactory(ctx, entDefinitions);
  // Check if user already has any organizations
  const user = await table('user').getX(args.userId);

  if (user.personalOrganizationId) {
    return null;
  }

  // Generate unique slug for personal org
  const slug = `personal-${args.userId.slice(-8)}`;

  const orgId = await table('organization').insert({
    logo: args.image || undefined,
    monthlyCredits: 0,
    name: `${args.name}'s Organization`,
    slug,
    createdAt: Date.now(),
  });
  await table('member').insert({
    createdAt: Date.now(),
    role: 'owner',
    organizationId: orgId,
    userId: args.userId,
  });

  // Update the user's last active organization and personal organization ID for future sessions
  await table('user').getX(args.userId).patch({
    lastActiveOrganizationId: orgId,
    personalOrganizationId: orgId,
  });

  return {
    id: orgId,
    slug,
  };
};
