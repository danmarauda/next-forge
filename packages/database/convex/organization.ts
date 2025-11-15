import { v } from 'convex/values';
import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod';
import type { Id } from './_generated/dataModel';
import { createPublicMutation, createPublicQuery } from './functions';
import { getEnv } from './helpers/getEnv';

/**
 * Organization Management Functions
 * Complete implementation for multi-tenant organization management
 */

/**
 * List all organizations the current user belongs to
 */
export const listOrganizations = createPublicQuery()({
  args: {
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    // Get all memberships for this user
    const memberships = await ctx
      .table('member')
      .get('userId', args.userId);

    if (!memberships || memberships.length === 0) {
      return {
        canCreateOrganization: true,
        organizations: [],
      };
    }

    const memberArray = Array.isArray(memberships) ? memberships : [memberships];

    // Fetch all organizations
    const organizations = await Promise.all(
      memberArray.map(async (member) => {
        const org = await ctx.table('organization').get(member.organizationId);
        if (!org) return null;

        // Count members in this organization
        const allMembers = await ctx
          .table('member')
          .get('organizationId', org._id);
        const memberCount = allMembers
          ? (Array.isArray(allMembers) ? allMembers.length : 1)
          : 0;

        return {
          id: org._id,
          name: org.name,
          slug: org.slug,
          logo: org.logo || null,
          role: member.role,
          memberCount,
          createdAt: org.createdAt,
          // Include branding info
          primaryColor: org.primaryColor || null,
          secondaryColor: org.secondaryColor || null,
          logoUrl: org.logoUrl || null,
          subdomain: org.subdomain || null,
          customDomain: org.customDomain || null,
          status: org.status || 'active',
          plan: org.plan || 'basic',
        };
      })
    );

    // Filter out null values and sort by creation date
    const validOrganizations = organizations
      .filter((org): org is NonNullable<typeof org> => org !== null)
      .sort((a, b) => b.createdAt - a.createdAt);

    return {
      canCreateOrganization: true,
      organizations: validOrganizations,
    };
  },
});

/**
 * Get a single organization by ID or slug
 */
export const getOrganization = createPublicQuery()({
  args: {
    identifier: z.union([zid('organization'), z.string()]),
    userId: zid('user').optional(),
  },
  handler: async (ctx, args) => {
    let org;

    // Try to get by ID first
    try {
      org = await ctx.table('organization').get(args.identifier as Id<'organization'>);
    } catch {
      // If that fails, search by slug
      const orgs = await ctx.table('organization').get('slug', args.identifier as string);
      org = Array.isArray(orgs) ? orgs[0] : orgs;
    }

    if (!org) return null;

    // Get user's role if userId provided
    let role = 'guest';
    if (args.userId) {
      const memberships = await ctx
        .table('member')
        .get('organizationId', org._id);

      const memberArray = memberships
        ? (Array.isArray(memberships) ? memberships : [memberships])
        : [];

      const membership = memberArray.find((m) => m.userId === args.userId);
      role = membership?.role || 'guest';
    }

    // Count members
    const allMembers = await ctx
      .table('member')
      .get('organizationId', org._id);
    const memberCount = allMembers
      ? (Array.isArray(allMembers) ? allMembers.length : 1)
      : 0;

    return {
      id: org._id,
      name: org.name,
      slug: org.slug,
      logo: org.logo || null,
      role,
      memberCount,
      createdAt: org.createdAt,
      monthlyCredits: org.monthlyCredits,
      primaryColor: org.primaryColor || null,
      secondaryColor: org.secondaryColor || null,
      logoUrl: org.logoUrl || null,
      faviconUrl: org.faviconUrl || null,
      subdomain: org.subdomain || null,
      customDomain: org.customDomain || null,
      status: org.status || 'active',
      plan: org.plan || 'basic',
      maxUsers: org.maxUsers || null,
      metadata: org.metadata || null,
    };
  },
});

/**
 * Get organization overview with stats
 */
export const getOrganizationOverview = createPublicQuery()({
  args: {
    organizationId: zid('organization'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const org = await ctx.table('organization').get(args.organizationId);
    if (!org) return null;

    // Verify user is a member
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const membership = memberArray.find((m) => m.userId === args.userId);
    if (!membership) return null;

    // Get all members with user details
    const members = await Promise.all(
      memberArray.map(async (member) => {
        const user = await ctx.table('user').get(member.userId);
        return {
          id: member._id,
          userId: member.userId,
          role: member.role,
          createdAt: member.createdAt,
          user: user
            ? {
                name: user.name,
                email: user.email,
                image: user.image || null,
              }
            : null,
        };
      })
    );

    // Get pending invitations
    const invitations = await ctx
      .table('invitation')
      .get('organizationId', args.organizationId);

    const invitationArray = invitations
      ? (Array.isArray(invitations) ? invitations : [invitations])
      : [];

    const pendingInvitations = invitationArray.filter((inv) => inv.status === 'pending');

    return {
      organization: {
        id: org._id,
        name: org.name,
        slug: org.slug,
        logo: org.logo || null,
        createdAt: org.createdAt,
        monthlyCredits: org.monthlyCredits,
        status: org.status || 'active',
        plan: org.plan || 'basic',
      },
      userRole: membership.role,
      memberCount: members.length,
      invitationCount: pendingInvitations.length,
      members: members.filter((m) => m.user !== null),
    };
  },
});

/**
 * Create a new organization
 */
export const createOrganization = createPublicMutation()({
  args: {
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if slug is already taken
    const existingOrg = await ctx.table('organization').get('slug', args.slug);
    if (existingOrg) {
      throw new Error('Organization slug already exists');
    }

    // Create organization
    const orgId = await ctx.table('organization').insert({
      name: args.name,
      slug: args.slug,
      monthlyCredits: 0,
      createdAt: now,
      status: 'active',
      plan: 'basic',
    });

    // Add creator as owner
    await ctx.table('member').insert({
      organizationId: orgId,
      userId: args.userId,
      role: 'owner',
      createdAt: now,
    });

    return { id: orgId, slug: args.slug };
  },
});

/**
 * Update organization settings
 */
export const updateOrganization = createPublicMutation()({
  args: {
    organizationId: zid('organization'),
    userId: zid('user'),
    name: z.string().min(1).max(100).optional(),
    logo: z.string().nullable().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    logoUrl: z.string().optional(),
    faviconUrl: z.string().optional(),
    subdomain: z.string().optional(),
    customDomain: z.string().optional(),
  },
  handler: async (ctx, args) => {
    // Verify user is owner or admin
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const membership = memberArray.find((m) => m.userId === args.userId);

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Update organization
    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.logo !== undefined) updates.logo = args.logo;
    if (args.primaryColor !== undefined) updates.primaryColor = args.primaryColor;
    if (args.secondaryColor !== undefined) updates.secondaryColor = args.secondaryColor;
    if (args.logoUrl !== undefined) updates.logoUrl = args.logoUrl;
    if (args.faviconUrl !== undefined) updates.faviconUrl = args.faviconUrl;
    if (args.subdomain !== undefined) updates.subdomain = args.subdomain;
    if (args.customDomain !== undefined) updates.customDomain = args.customDomain;

    await ctx.table('organization').getX(args.organizationId).patch(updates);

    return { success: true };
  },
});

/**
 * Set user's active organization
 */
export const setActiveOrganization = createPublicMutation()({
  args: {
    userId: zid('user'),
    organizationId: zid('organization'),
  },
  handler: async (ctx, args) => {
    // Verify user is a member
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const isMember = memberArray.some((m) => m.userId === args.userId);

    if (!isMember) {
      throw new Error('User is not a member of this organization');
    }

    // Update user's last active organization
    await ctx.table('user').getX(args.userId).patch({
      lastActiveOrganizationId: args.organizationId,
    });

    return { success: true };
  },
});

/**
 * List organization members
 */
export const listMembers = createPublicQuery()({
  args: {
    organizationId: zid('organization'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    // Verify user is a member
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);
    if (!userMembership) {
      throw new Error('User is not a member of this organization');
    }

    // Get organization to check if it's personal
    const org = await ctx.table('organization').get(args.organizationId);
    const user = await ctx.table('user').get(args.userId);
    const isPersonal = org && user && org._id === user.personalOrganizationId;

    // Get all members with user details
    const members = await Promise.all(
      memberArray.map(async (member) => {
        const memberUser = await ctx.table('user').get(member.userId);
        return {
          id: member._id,
          userId: member.userId,
          role: member.role,
          createdAt: member.createdAt,
          user: memberUser
            ? {
                name: memberUser.name,
                email: memberUser.email,
                image: memberUser.image || null,
              }
            : null,
        };
      })
    );

    return {
      isPersonal,
      members: members.filter((m) => m.user !== null),
    };
  },
});

/**
 * Invite a new member to the organization
 */
export const inviteMember = createPublicMutation()({
  args: {
    organizationId: zid('organization'),
    email: z.string().email(),
    role: z.enum(['owner', 'admin', 'member']),
    inviterId: zid('user'),
  },
  handler: async (ctx, args) => {
    // Verify inviter is owner or admin
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const inviterMembership = memberArray.find((m) => m.userId === args.inviterId);

    if (!inviterMembership || !['owner', 'admin'].includes(inviterMembership.role)) {
      throw new Error('Insufficient permissions to invite members');
    }

    // Check if user is already a member
    const existingUser = await ctx.table('user').get('email', args.email);
    if (existingUser) {
      const isMember = memberArray.some((m) => m.userId === existingUser._id);
      if (isMember) {
        throw new Error('User is already a member of this organization');
      }
    }

    // Check for existing pending invitation
    const existingInvitations = await ctx
      .table('invitation')
      .get('email', args.email);

    const invitationArray = existingInvitations
      ? (Array.isArray(existingInvitations) ? existingInvitations : [existingInvitations])
      : [];

    const pendingInvitation = invitationArray.find(
      (inv) => inv.organizationId === args.organizationId && inv.status === 'pending'
    );

    if (pendingInvitation) {
      throw new Error('Invitation already sent to this email');
    }

    // Create invitation
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const invitationId = await ctx.table('invitation').insert({
      organizationId: args.organizationId,
      email: args.email,
      role: args.role,
      inviterId: args.inviterId,
      status: 'pending',
      expiresAt,
    });

    return { invitationId, expiresAt };
  },
});

/**
 * List pending invitations for an organization
 */
export const listPendingInvitations = createPublicQuery()({
  args: {
    organizationId: zid('organization'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    // Verify user is owner or admin
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);

    if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Get all invitations for this organization
    const invitations = await ctx
      .table('invitation')
      .get('organizationId', args.organizationId);

    const invitationArray = invitations
      ? (Array.isArray(invitations) ? invitations : [invitations])
      : [];

    // Filter pending and get inviter details
    const pendingInvitations = await Promise.all(
      invitationArray
        .filter((inv) => inv.status === 'pending' && inv.expiresAt > Date.now())
        .map(async (invitation) => {
          const inviter = await ctx.table('user').get(invitation.inviterId);
          return {
            id: invitation._id,
            email: invitation.email,
            role: invitation.role || 'member',
            expiresAt: invitation.expiresAt,
            inviter: inviter
              ? {
                  name: inviter.name,
                  email: inviter.email,
                }
              : null,
          };
        })
    );

    return pendingInvitations;
  },
});

/**
 * Accept an invitation
 */
export const acceptInvitation = createPublicMutation()({
  args: {
    invitationId: zid('invitation'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.table('invitation').get(args.invitationId);

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    if (invitation.expiresAt < Date.now()) {
      throw new Error('Invitation has expired');
    }

    // Verify user's email matches invitation
    const user = await ctx.table('user').get(args.userId);
    if (!user || user.email !== invitation.email) {
      throw new Error('Email does not match invitation');
    }

    // Check if already a member
    const memberships = await ctx
      .table('member')
      .get('organizationId', invitation.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const existingMembership = memberArray.find((m) => m.userId === args.userId);

    if (existingMembership) {
      throw new Error('Already a member of this organization');
    }

    // Add user as member
    await ctx.table('member').insert({
      organizationId: invitation.organizationId,
      userId: args.userId,
      role: invitation.role || 'member',
      createdAt: Date.now(),
    });

    // Mark invitation as accepted
    await ctx.table('invitation').getX(args.invitationId).patch({
      status: 'accepted',
    });

    return { success: true, organizationId: invitation.organizationId };
  },
});

/**
 * Reject an invitation
 */
export const rejectInvitation = createPublicMutation()({
  args: {
    invitationId: zid('invitation'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.table('invitation').get(args.invitationId);

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Verify user's email matches invitation
    const user = await ctx.table('user').get(args.userId);
    if (!user || user.email !== invitation.email) {
      throw new Error('Email does not match invitation');
    }

    // Mark invitation as rejected
    await ctx.table('invitation').getX(args.invitationId).patch({
      status: 'rejected',
    });

    return { success: true };
  },
});

/**
 * Cancel a pending invitation (by owner/admin)
 */
export const cancelInvitation = createPublicMutation()({
  args: {
    invitationId: zid('invitation'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.table('invitation').get(args.invitationId);

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Verify user is owner or admin of the organization
    const memberships = await ctx
      .table('member')
      .get('organizationId', invitation.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);

    if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Mark invitation as cancelled
    await ctx.table('invitation').getX(args.invitationId).patch({
      status: 'cancelled',
    });

    return { success: true };
  },
});

/**
 * Remove a member from the organization
 */
export const removeMember = createPublicMutation()({
  args: {
    memberId: zid('member'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const member = await ctx.table('member').get(args.memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    // Verify user is owner or admin
    const memberships = await ctx
      .table('member')
      .get('organizationId', member.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);

    if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Prevent removing the last owner
    if (member.role === 'owner') {
      const ownerCount = memberArray.filter((m) => m.role === 'owner').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot remove the last owner');
      }
    }

    // Prevent removing yourself if you're the last owner
    if (member.userId === args.userId && member.role === 'owner') {
      const ownerCount = memberArray.filter((m) => m.role === 'owner').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot remove yourself as the last owner');
      }
    }

    // Remove member
    await ctx.table('member').getX(args.memberId).delete();

    return { success: true };
  },
});

/**
 * Leave an organization
 */
export const leaveOrganization = createPublicMutation()({
  args: {
    organizationId: zid('organization'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    // Get user's membership
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);

    if (!userMembership) {
      throw new Error('Not a member of this organization');
    }

    // Prevent leaving if you're the last owner
    if (userMembership.role === 'owner') {
      const ownerCount = memberArray.filter((m) => m.role === 'owner').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot leave as the last owner. Transfer ownership first.');
      }
    }

    // Check if this is their personal organization
    const user = await ctx.table('user').get(args.userId);
    if (user?.personalOrganizationId === args.organizationId) {
      throw new Error('Cannot leave your personal organization');
    }

    // Remove membership
    await ctx.table('member').getX(userMembership._id).delete();

    // If this was their active organization, switch to personal org
    if (user?.lastActiveOrganizationId === args.organizationId) {
      await ctx.table('user').getX(args.userId).patch({
        lastActiveOrganizationId: user.personalOrganizationId,
      });
    }

    return { success: true };
  },
});

/**
 * Update member role
 */
export const updateMemberRole = createPublicMutation()({
  args: {
    memberId: zid('member'),
    newRole: z.enum(['owner', 'admin', 'member']),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    const member = await ctx.table('member').get(args.memberId);

    if (!member) {
      throw new Error('Member not found');
    }

    // Verify user is owner
    const memberships = await ctx
      .table('member')
      .get('organizationId', member.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);

    if (!userMembership || userMembership.role !== 'owner') {
      throw new Error('Only owners can change member roles');
    }

    // Prevent demoting the last owner
    if (member.role === 'owner' && args.newRole !== 'owner') {
      const ownerCount = memberArray.filter((m) => m.role === 'owner').length;
      if (ownerCount <= 1) {
        throw new Error('Cannot demote the last owner');
      }
    }

    // Update role
    await ctx.table('member').getX(args.memberId).patch({
      role: args.newRole,
    });

    return { success: true };
  },
});

/**
 * Delete an organization (soft delete)
 */
export const deleteOrganization = createPublicMutation()({
  args: {
    organizationId: zid('organization'),
    userId: zid('user'),
  },
  handler: async (ctx, args) => {
    // Verify user is owner
    const memberships = await ctx
      .table('member')
      .get('organizationId', args.organizationId);

    const memberArray = memberships
      ? (Array.isArray(memberships) ? memberships : [memberships])
      : [];

    const userMembership = memberArray.find((m) => m.userId === args.userId);

    if (!userMembership || userMembership.role !== 'owner') {
      throw new Error('Only owners can delete organizations');
    }

    // Check if this is a personal organization
    const user = await ctx.table('user').get(args.userId);
    if (user?.personalOrganizationId === args.organizationId) {
      throw new Error('Cannot delete your personal organization');
    }

    // Mark organization as deleted (status = 'deleted')
    await ctx.table('organization').getX(args.organizationId).patch({
      status: 'deleted',
    });

    // If this was the user's active org, switch to personal org
    if (user?.lastActiveOrganizationId === args.organizationId) {
      await ctx.table('user').getX(args.userId).patch({
        lastActiveOrganizationId: user.personalOrganizationId,
      });
    }

    return { success: true };
  },
});
