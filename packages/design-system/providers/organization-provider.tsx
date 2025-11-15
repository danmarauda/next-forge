'use client';

import { api } from '@repo/database/convex/_generated/api';
import type { Id } from '@repo/database/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Organization {
  _id: Id<'organization'>;
  name: string;
  slug: string;
  logo?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  subdomain?: string;
  role: string;
}

interface OrganizationBranding {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl?: string;
  slug: string;
  subdomain?: string;
}

interface OrganizationContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  branding: OrganizationBranding | null;
  switchOrganization: (orgId: Id<'organization'>) => Promise<void>;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export function OrganizationProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}) {
  const [currentOrgId, setCurrentOrgId] = useState<Id<'organization'> | null>(
    null,
  );

  // Fetch user's organizations from Convex
  const organizations =
    useQuery(api.organizationHelpers.listUserOrganizations, {
      userId: userId as Id<'user'>,
    }) || [];

  const currentOrg =
    organizations.find((org) => org._id === currentOrgId) ||
    organizations[0] ||
    null;

  // Fetch branding for current org
  const branding = useQuery(
    api.organizationBranding.getOrganizationBranding,
    currentOrg ? { organizationId: currentOrg._id } : 'skip',
  );

  // Set initial org from subdomain or last active
  useEffect(() => {
    if (organizations.length > 0 && !currentOrgId) {
      // Check for subdomain in URL
      const params = new URLSearchParams(window.location.search);
      const orgFromUrl = params.get('org');

      if (orgFromUrl) {
        const org = organizations.find(
          (o) => o.slug === orgFromUrl || o.subdomain === orgFromUrl,
        );
        if (org) {
          setCurrentOrgId(org._id);
          return;
        }
      }

      // Default to first org
      setCurrentOrgId(organizations[0]._id);
    }
  }, [organizations, currentOrgId]);

  // Apply branding theme
  useEffect(() => {
    if (branding) {
      document.documentElement.style.setProperty(
        '--org-primary',
        branding.primaryColor,
      );
      document.documentElement.style.setProperty(
        '--org-secondary',
        branding.secondaryColor,
      );
    }
  }, [branding]);

  const switchOrganization = async (orgId: Id<'organization'>) => {
    setCurrentOrgId(orgId);
    // TODO: Update user's lastActiveOrganizationId in Convex
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg,
        organizations,
        branding: branding || null,
        switchOrganization,
        isLoading: organizations === undefined,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
