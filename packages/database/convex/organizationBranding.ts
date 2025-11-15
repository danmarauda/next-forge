import { v } from 'convex/values';
import { entsTableFactory } from 'convex-ents';
import { mutation, query } from './_generated/server';
import { entDefinitions } from './schema';

/**
 * ARA Organization Branding Configurations
 * Maps organization slugs to their branding settings
 */
/**
 * ARA Organization Branding - REAL COLORS FROM ACTUAL LOGOS
 * Colors extracted from official SVG logo files
 * Secondary color #435464 is the dark gray used across all ARA brands
 */
export const ARA_ORG_BRANDING = {
  'ara-group': {
    name: 'ARA Group Platform',
    primaryColor: '#AFCC37', // Lime green (from logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-logo.png',
    subdomain: 'ara',
  },
  'fire-security': {
    name: 'ARA Fire & Security',
    primaryColor: '#64b1bb', // Teal/turquoise (from logo, NOT orange-red!)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-fire-security.svg',
    subdomain: 'fire',
  },
  electrical: {
    name: 'ARA Electrical',
    primaryColor: '#ecaa20', // Orange/gold (from logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-electrical.svg',
    subdomain: 'electrical',
  },
  'building-services': {
    name: 'ARA Building Services',
    primaryColor: '#4169E1', // Royal blue (temporary - needs real logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-logo.png', // Placeholder - needs real logo
    subdomain: 'buildingservices',
  },
  mechanical: {
    name: 'ARA Mechanical Services',
    primaryColor: '#71a087', // Sage green (from logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-mechanical.svg',
    subdomain: 'mechanical',
  },
  'property-services': {
    name: 'ARA Property Services',
    primaryColor: '#afcc37', // Lime green (from logo, same as main ARA)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-property-services.svg',
    subdomain: 'propertyservices',
  },
  products: {
    name: 'ARA Products',
    primaryColor: '#d2466c', // Rose/pink (from logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-products.svg',
    subdomain: 'products',
  },
  manufacturing: {
    name: 'ARA Manufacturing',
    primaryColor: '#708090', // Slate gray (temporary - needs real logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-logo.png', // Placeholder - needs real logo
    subdomain: 'manufacturing',
  },
  marine: {
    name: 'ARA Marine',
    primaryColor: '#1E90FF', // Dodger blue (temporary - needs real logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-logo.png', // Placeholder - needs real logo
    subdomain: 'marine',
  },
  'security-solutions': {
    name: 'ARA Security Solutions',
    primaryColor: '#8B0000', // Dark red (temporary - needs real logo)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-logo.png', // Placeholder - needs real logo
    subdomain: 'security',
  },
  'indigenous-services': {
    name: 'ARA Indigenous Services',
    primaryColor: '#E05D44', // Coral red (from logo - VERIFIED)
    secondaryColor: '#435464', // Dark gray
    logoUrl: '/logos/ara-indigenous-services.png',
    subdomain: 'indigenous',
  },
} as const;

/**
 * Update organization branding
 */
export const updateOrganizationBranding = mutation({
  args: {
    organizationId: v.id('organization'),
    branding: v.object({
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      faviconUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const org = await table('organization').getX(args.organizationId);

    await org.patch({
      primaryColor: args.branding.primaryColor,
      secondaryColor: args.branding.secondaryColor,
      logoUrl: args.branding.logoUrl,
      faviconUrl: args.branding.faviconUrl,
    });

    return { success: true };
  },
});

/**
 * Get organization branding
 */
export const getOrganizationBranding = query({
  args: { organizationId: v.id('organization') },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const org = await table('organization').get(args.organizationId);

    if (!org) return null;

    const doc = org.doc();

    return {
      name: doc.name,
      primaryColor: doc.primaryColor || '#AFCC37',
      secondaryColor: doc.secondaryColor || '#435464',
      logoUrl: doc.logoUrl || '/logos/ara-logo.png',
      faviconUrl: doc.faviconUrl,
      slug: doc.slug,
      subdomain: doc.subdomain,
    };
  },
});

/**
 * Get organization by subdomain
 */
export const getOrganizationBySubdomain = query({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    const table = entsTableFactory(ctx, entDefinitions);
    const orgs = await table('organization')
      .filter((q) => q.eq(q.field('subdomain'), args.subdomain))
      .collect();

    if (orgs.length === 0) return null;

    const org = orgs[0];
    const doc = org.doc();

    return {
      _id: org._id,
      name: doc.name,
      slug: doc.slug,
      primaryColor: doc.primaryColor,
      secondaryColor: doc.secondaryColor,
      logoUrl: doc.logoUrl,
      subdomain: doc.subdomain,
    };
  },
});
