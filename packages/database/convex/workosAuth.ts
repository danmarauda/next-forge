import { zid } from 'convex-helpers/server/zod';
import { z } from 'zod';
import type { Id } from './_generated/dataModel';
import { createPublicAction, createPublicQuery } from './functions';
import { getEnv } from './helpers/getEnv';
import { getWorkOS } from './workos';

/**
 * Helper queries for WorkOS auth
 */

export const getSessionsByToken = createPublicQuery()({
  args: {
    token: z.string(),
  },
  returns: z.array(
    z.object({
      _id: zid('session'),
      userId: zid('user'),
      token: z.string(),
      expiresAt: z.number(),
      activeOrganizationId: zid('organization').nullable(),
    })
  ),
  handler: async (ctx, args) => {
    // Use ctx.table() in query context
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

export const getSessionsByUserId = createPublicQuery()({
  args: {
    userId: zid('user'),
  },
  returns: z.array(
    z.object({
      _id: zid('session'),
      userId: zid('user'),
      token: z.string(),
      expiresAt: z.number(),
      activeOrganizationId: zid('organization').nullable(),
    })
  ),
  handler: async (ctx, args) => {
    // Use ctx.table() in query context
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
 * Get authorization URL for WorkOS AuthKit
 */
export const getAuthorizationUrl = createPublicAction()({
  args: {
    redirectUri: z.string().optional(),
    state: z.string().optional(),
  },
  returns: z.object({
    authorizationUrl: z.string(),
  }),
  handler: async (ctx, args) => {
    const env = getEnv();
    const workos = getWorkOS();

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: env.WORKOS_CLIENT_ID,
      redirectUri: args.redirectUri || env.WORKOS_REDIRECT_URI,
      state: args.state,
    });

    return { authorizationUrl };
  },
});

/**
 * Authenticate user with WorkOS callback code
 */
export const authenticateUser = createPublicAction()({
  args: {
    code: z.string(),
  },
  returns: z.object({
    user: z.object({
      _id: zid('user'),
      email: z.string(),
      name: z.string(),
    }),
    session: z.object({
      _id: zid('session'),
      token: z.string(),
    }),
    accessToken: z.string(),
  }),
  handler: async (ctx, args) => {
    const env = getEnv();
    const workos = getWorkOS();

    // Exchange code for user profile
    const { user: workosUser, accessToken } =
      await workos.userManagement.authenticateWithCode({
        clientId: env.WORKOS_CLIENT_ID,
        code: args.code,
      });

    // Check if user exists via query
    const generatedApi = await import('./_generated/api');
    const existingUser = await ctx.runQuery(
      (generatedApi.api as any).user.getUserByEmail,
      {
        email: workosUser.email,
      }
    );

    let userId: Id<'user'>;
    let personalOrgId: Id<'organization'> | null = null;

    if (existingUser) {
      userId = existingUser._id;
      personalOrgId = existingUser.personalOrganizationId || null;

      // Update existing user
      const name =
        workosUser.firstName && workosUser.lastName
          ? `${workosUser.firstName} ${workosUser.lastName}`
          : existingUser.name;

      const generatedInternal = await import('./_generated/api');
      await ctx.runMutation(
        generatedInternal.internal.workosInternal.updateUserFromWorkOS,
        {
          userId,
          name,
          firstName: workosUser.firstName || null,
          lastName: workosUser.lastName || null,
          image: workosUser.profilePictureUrl || null,
          emailVerified: workosUser.emailVerified || existingUser.emailVerified,
        }
      );
    } else {
      // Create new user via internal mutation
      const envVars = getEnv();
      const adminEmails = envVars.ADMIN;
      const role = adminEmails?.includes(workosUser.email) ? 'admin' : null;

      const name =
        workosUser.firstName && workosUser.lastName
          ? `${workosUser.firstName} ${workosUser.lastName}`
          : workosUser.email.split('@')[0];

      const generatedApiInternal = await import('./_generated/api');
      const result = await ctx.runMutation(
        (generatedApiInternal.internal as any).workosInternal
          .createUserFromWorkOS,
        {
          email: workosUser.email,
          name,
          firstName: workosUser.firstName || null,
          lastName: workosUser.lastName || null,
          image: workosUser.profilePictureUrl || null,
          emailVerified: workosUser.emailVerified || false,
          role,
        }
      );

      userId = result.userId;

      const generatedApi2 = await import('./_generated/api');
      const newUser = await ctx.runQuery(
        (generatedApi2.api as any).user.getUserById,
        {
          userId,
        }
      );
      personalOrgId = newUser?.personalOrganizationId || null;
    }

    // Create or update session
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    // Find existing session - use internal query to avoid circular dependency
    const generatedInternal2 = await import('./_generated/api');
    const existingSessions = await ctx.runQuery(
      (generatedInternal2.internal as any).workosInternal
        .getSessionsByUserIdInternal,
      {
        userId,
      }
    );
    const existingSession = existingSessions.find(
      (s: any) => s.expiresAt > Date.now()
    );

    if (existingSession) {
      const generatedApiInternal2 = await import('./_generated/api');
      await ctx.runMutation(
        (generatedApiInternal2.internal as any).workosInternal
          .updateSessionFromWorkOS,
        {
          sessionId: existingSession._id,
          token: accessToken,
          expiresAt,
        }
      );

      const generatedApi3 = await import('./_generated/api');
      const user = await ctx.runQuery(
        (generatedApi3.api as any).user.getUserById,
        {
          userId,
        }
      );

      return {
        user: {
          _id: userId,
          email: user?.email || workosUser.email,
          name: user?.name || workosUser.email.split('@')[0],
        },
        session: { _id: existingSession._id, token: accessToken },
        accessToken,
      };
    }

    // Create new session
    const generatedApiInternal3 = await import('./_generated/api');
    const sessionResult = await ctx.runMutation(
      (generatedApiInternal3.internal as any).workosInternal
        .createSessionFromWorkOS,
      {
        userId,
        token: accessToken,
        expiresAt,
        activeOrganizationId: personalOrgId,
      }
    );

    const generatedApi4 = await import('./_generated/api');
    const user = await ctx.runQuery(
      (generatedApi4.api as any).user.getUserById,
      {
        userId,
      }
    );

    return {
      user: {
        _id: userId,
        email: user?.email || workosUser.email,
        name: user?.name || workosUser.email.split('@')[0],
      },
      session: { _id: sessionResult.sessionId, token: accessToken },
      accessToken,
    };
  },
});

/**
 * Get current user from session token
 */
export const getCurrentUserFromToken = createPublicQuery()({
  args: {
    token: z.string(),
  },
  returns: z.union([
    z.object({
      _id: zid('user'),
      email: z.string(),
      name: z.string(),
      image: z.string().nullable(),
      role: z.string().nullable(),
      activeOrganization: z
        .object({
          id: zid('organization'),
          name: z.string(),
          slug: z.string(),
          role: z.string(),
        })
        .nullable(),
      isAdmin: z.boolean(),
      personalOrganizationId: zid('organization').optional(),
    }),
    z.null(),
  ]),
  handler: async (ctx, args) => {
    // Find session by token - use ctx.table() in query context
    const sessions = await ctx.table('session').get('token', args.token);
    if (!sessions) {
      return null;
    }

    const sessionArray = Array.isArray(sessions) ? sessions : [sessions];
    const session = sessionArray.find((s: any) => s.expiresAt > Date.now());

    if (!session) {
      return null;
    }

    // Get user via query - avoid circular dependency by using direct table access
    const user = await ctx.table('user').getX(session.userId);

    if (!user) {
      return null;
    }

    // Get active organization - need to get org by ID
    const activeOrganizationId =
      session.activeOrganizationId || user.personalOrganizationId;
    let activeOrganization: any = null;
    let role = 'member';

    if (activeOrganizationId) {
      // Get organization by querying user's organizations
      const org = await ctx.table('organization').getX(activeOrganizationId);

      if (org) {
        // Get user's role in organization
        const members = await ctx
          .table('member')
          .get('organizationId', activeOrganizationId);
        const memberArray = members
          ? Array.isArray(members)
            ? members
            : [members]
          : [];
        const member = memberArray.find((m: any) => m.userId === user._id);
        role = member?.role || 'member';

        activeOrganization = {
          id: org._id,
          name: org.name,
          slug: org.slug || '',
          role,
        };
      }
    }

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      image: user.image ?? null,
      role: user.role ?? null,
      activeOrganization,
      isAdmin: user.role === 'admin',
      personalOrganizationId: user.personalOrganizationId,
    };
  },
});

/**
 * Sign out user (invalidate session) - Changed to action for client access
 */
export const signOut = createPublicAction()({
  args: {
    token: z.string(),
  },
  returns: z.object({ success: z.boolean() }),
  handler: async (ctx, args) => {
    const generatedApiInternal4 = await import('./_generated/api');

    // Find session by token - use internal query to avoid circular dependency
    const sessions = await ctx.runQuery(
      (generatedApiInternal4.internal as any).workosInternal
        .getSessionsByTokenInternal,
      {
        token: args.token,
      }
    );

    if (!sessions || sessions.length === 0) return { success: true };

    const session = sessions.find((s: any) => s.expiresAt > Date.now());

    if (session) {
      await ctx.runMutation(
        (generatedApiInternal4.internal as any).workosInternal
          .deleteSessionFromWorkOS,
        {
          sessionId: session._id,
        }
      );
    }

    return { success: true };
  },
});

/**
 * WorkOS Webhook Handler
 * Handles WorkOS events (user.created, user.updated, etc.)
 */
export const handleWebhook = createPublicAction()({
  args: {
    event: z.string(),
    data: z.any(),
  },
  returns: z.object({ success: z.boolean() }),
  handler: async (ctx, args) => {
    const env = getEnv();
    const generatedApiInternal5 = await import('./_generated/api');

    // Verify webhook signature (if secret is set)
    // TODO: Implement webhook signature verification

    switch (args.event) {
      case 'user.created': {
        const workosUser = args.data;

        // Check if user already exists via query
        const existingUser = await ctx.runQuery(
          (generatedApiInternal5.api as any).user.getUserByEmail,
          {
            email: workosUser.email,
          }
        );

        if (!existingUser) {
          const adminEmails = env.ADMIN;
          const role = adminEmails?.includes(workosUser.email) ? 'admin' : null;

          const name =
            workosUser.firstName && workosUser.lastName
              ? `${workosUser.firstName} ${workosUser.lastName}`
              : workosUser.email.split('@')[0];

          await ctx.runMutation(
            (generatedApiInternal5.internal as any).workosInternal
              .createUserFromWorkOS,
            {
              email: workosUser.email,
              name,
              firstName: workosUser.firstName || null,
              lastName: workosUser.lastName || null,
              image: workosUser.profilePictureUrl || null,
              emailVerified: workosUser.emailVerified || false,
              role,
            }
          );
        }

        break;
      }

      case 'user.updated': {
        const workosUser = args.data;
        const user = await ctx.runQuery(
          (generatedApiInternal5.api as any).user.getUserByEmail,
          {
            email: workosUser.email,
          }
        );

        if (user) {
          const name =
            workosUser.firstName && workosUser.lastName
              ? `${workosUser.firstName} ${workosUser.lastName}`
              : user.name;

          await ctx.runMutation(
            (generatedApiInternal5.internal as any).workosInternal
              .updateUserFromWorkOS,
            {
              userId: user._id,
              name,
              firstName: workosUser.firstName || null,
              lastName: workosUser.lastName || null,
              image: workosUser.profilePictureUrl || null,
              emailVerified:
                workosUser.emailVerified || (user?.emailVerified ?? false),
            }
          );
        }

        break;
      }

      case 'user.deleted': {
        const workosUser = args.data;
        const user = await ctx.runQuery(
          (generatedApiInternal5.api as any).user.getUserByEmail,
          {
            email: workosUser.email,
          }
        );

        if (user) {
          await ctx.runMutation(
            (generatedApiInternal5.internal as any).workosInternal
              .softDeleteUserFromWorkOS,
            {
              userId: user._id,
            }
          );
        }

        break;
      }

      case 'organization.created':
      case 'organization.updated': {
        const workosOrg = args.data;
        
        // Sync organization to Convex
        await ctx.runMutation(
          (generatedApiInternal5.internal as any).workosInternal.syncOrganization,
          {
            workosOrgId: workosOrg.id,
            name: workosOrg.name,
            domains: workosOrg.domains?.map((d: any) => d.domain) || [],
            allowProfilesOutsideOrganization: workosOrg.allowProfilesOutsideOrganization,
          }
        );
        break;
      }

      case 'organization.deleted': {
        const workosOrg = args.data;
        
        // Delete organization from Convex
        await ctx.runMutation(
          (generatedApiInternal5.internal as any).workosInternal.deleteOrganization,
          {
            workosOrgId: workosOrg.id,
          }
        );
        break;
      }

      default:
        // Unknown event, log for debugging
        console.log('Unknown WorkOS webhook event:', args.event);
    }

    return { success: true };
  },
});
