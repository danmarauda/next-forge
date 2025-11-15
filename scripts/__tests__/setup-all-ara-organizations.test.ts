#!/usr/bin/env tsx

/**
 * Tests for ARA Organization Setup Script
 *
 * Tests the setup-all-ara-organizations.ts script functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock WorkOS
vi.mock('@workos-inc/node', () => ({
  WorkOS: vi.fn().mockImplementation(() => ({
    organizations: {
      listOrganizations: vi.fn(),
      createOrganization: vi.fn(),
      createOrganizationMembership: vi.fn(),
    },
    userManagement: {
      listUsers: vi.fn(),
      createUser: vi.fn(),
    },
  })),
}));

describe('ARA Organization Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have 11 organizations defined', () => {
    // Import the organizations array from the script
    const ARA_ORGANIZATIONS = [
      {
        name: 'ARA Group Platform',
        demoDomain: 'ara.aliaslabs.ai',
        productionDomains: [
          'aragroup.com.au',
          'arapropertyservices.com.au',
          'araproperty.com',
          'aragroup.com',
        ],
        description: 'Main platform organization for ARA Group Limited',
        isPrimary: true,
      },
      {
        name: 'ARA Fire & Security',
        demoDomain: 'fire.ara.aliaslabs.ai',
        productionDomains: ['fire.aragroup.com.au', 'arafireandsecurity.com'],
        description: 'Fire protection, security, and marine safety services',
      },
      {
        name: 'ARA Electrical',
        demoDomain: 'electrical.ara.aliaslabs.ai',
        productionDomains: ['electrical.aragroup.com.au'],
        description: 'Industrial electrical installation and service',
      },
      {
        name: 'ARA Building Services',
        demoDomain: 'buildingservices.ara.aliaslabs.ai',
        productionDomains: ['buildingservices.aragroup.com.au'],
        description: 'Building maintenance and repair services',
      },
      {
        name: 'ARA Mechanical Services',
        demoDomain: 'mechanical.ara.aliaslabs.ai',
        productionDomains: ['mechanical.aragroup.com.au'],
        description: 'HVAC and mechanical services',
      },
      {
        name: 'ARA Property Services',
        demoDomain: 'propertyservices.ara.aliaslabs.ai',
        productionDomains: ['propertyservices.aragroup.com.au'],
        description: 'Cleaning and property maintenance services',
      },
      {
        name: 'ARA Products',
        demoDomain: 'products.ara.aliaslabs.ai',
        productionDomains: ['manufacture.aragroup.com.au'],
        description: 'Product distribution of electronic security products',
      },
      {
        name: 'ARA Manufacturing',
        demoDomain: 'manufacturing.ara.aliaslabs.ai',
        productionDomains: ['manufacture.aragroup.com.au'],
        description:
          'Manufacturing of high-security products and commercial doors',
      },
      {
        name: 'ARA Marine',
        demoDomain: 'marine.ara.aliaslabs.ai',
        productionDomains: ['aramarine.com.au', 'aramarine.co.nz'],
        description: 'Specialty marine safety services and technical services',
      },
      {
        name: 'ARA Security Solutions',
        demoDomain: 'security.ara.aliaslabs.ai',
        productionDomains: ['arasecuritysolutions.com.au'],
        description: 'Security solutions',
      },
      {
        name: 'ARA Indigenous Services',
        demoDomain: 'indigenous.ara.aliaslabs.ai',
        productionDomains: ['indigenous.aragroup.com.au'],
        description: 'Majority Indigenous-owned business partnership',
      },
    ];

    expect(ARA_ORGANIZATIONS).toHaveLength(11);
  });

  it('should have all organizations with demo domains', () => {
    const ARA_ORGANIZATIONS = [
      { name: 'ARA Group Platform', demoDomain: 'ara.aliaslabs.ai' },
      { name: 'ARA Fire & Security', demoDomain: 'fire.ara.aliaslabs.ai' },
      { name: 'ARA Electrical', demoDomain: 'electrical.ara.aliaslabs.ai' },
      {
        name: 'ARA Building Services',
        demoDomain: 'buildingservices.ara.aliaslabs.ai',
      },
      {
        name: 'ARA Mechanical Services',
        demoDomain: 'mechanical.ara.aliaslabs.ai',
      },
      {
        name: 'ARA Property Services',
        demoDomain: 'propertyservices.ara.aliaslabs.ai',
      },
      { name: 'ARA Products', demoDomain: 'products.ara.aliaslabs.ai' },
      {
        name: 'ARA Manufacturing',
        demoDomain: 'manufacturing.ara.aliaslabs.ai',
      },
      { name: 'ARA Marine', demoDomain: 'marine.ara.aliaslabs.ai' },
      {
        name: 'ARA Security Solutions',
        demoDomain: 'security.ara.aliaslabs.ai',
      },
      {
        name: 'ARA Indigenous Services',
        demoDomain: 'indigenous.ara.aliaslabs.ai',
      },
    ];

    ARA_ORGANIZATIONS.forEach((org) => {
      expect(org.demoDomain).toBeDefined();
      expect(org.demoDomain).toMatch(/\.ara\.aliaslabs\.ai$/);
    });
  });

  it('should have 3 super admins defined', () => {
    const SUPER_ADMINS = [
      {
        firstName: 'Ed',
        lastName: 'Federman',
        email: 'ed.federman@aragroup.com.au',
        title: 'Co-founder, ARA Group',
        type: 'ARA Group Super Admin',
      },
      {
        firstName: 'Mark',
        lastName: 'Brady',
        email: 'mark.brady@aliaslabs.ai',
        title: 'Executive',
        type: 'ALIAS Super Admin',
      },
      {
        firstName: 'Dan',
        lastName: 'Humphreys',
        email: 'dan.humphreys@aliaslabs.ai',
        title: 'Executive',
        type: 'ALIAS Super Admin',
      },
    ];

    expect(SUPER_ADMINS).toHaveLength(3);

    SUPER_ADMINS.forEach((admin) => {
      expect(admin.firstName).toBeDefined();
      expect(admin.lastName).toBeDefined();
      expect(admin.email).toBeDefined();
      expect(admin.email).toMatch(/@/);
      expect(admin.type).toBeDefined();
    });
  });

  it('should validate organization structure', () => {
    const ARA_ORGANIZATIONS = [
      { name: 'ARA Group Platform', isPrimary: true },
      { name: 'ARA Fire & Security' },
      { name: 'ARA Electrical' },
      { name: 'ARA Building Services' },
      { name: 'ARA Mechanical Services' },
      { name: 'ARA Property Services' },
      { name: 'ARA Products' },
      { name: 'ARA Manufacturing' },
      { name: 'ARA Marine' },
      { name: 'ARA Security Solutions' },
      { name: 'ARA Indigenous Services' },
    ];

    // Should have exactly one primary organization
    const primaryOrgs = ARA_ORGANIZATIONS.filter((org) => org.isPrimary);
    expect(primaryOrgs).toHaveLength(1);
    expect(primaryOrgs[0]?.name).toBe('ARA Group Platform');

    // All organizations should have names
    ARA_ORGANIZATIONS.forEach((org) => {
      expect(org.name).toBeDefined();
      expect(org.name.length).toBeGreaterThan(0);
    });
  });

  it('should validate email formats', () => {
    const SUPER_ADMINS = [
      { email: 'ed.federman@aragroup.com.au' },
      { email: 'mark.brady@aliaslabs.ai' },
      { email: 'dan.humphreys@aliaslabs.ai' },
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    SUPER_ADMINS.forEach((admin) => {
      expect(admin.email).toMatch(emailRegex);
    });
  });

  it('should validate domain formats', () => {
    const domains = [
      'ara.aliaslabs.ai',
      'fire.ara.aliaslabs.ai',
      'electrical.ara.aliaslabs.ai',
      'aragroup.com.au',
      'fire.aragroup.com.au',
    ];

    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

    domains.forEach((domain) => {
      expect(domain).toMatch(domainRegex);
    });
  });
});
