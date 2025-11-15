'use client';

/**
 * Organization Settings Component
 *
 * Allows organization owners and admins to manage organization settings:
 * - Basic information (name, subdomain)
 * - Branding (logo, colors, favicon)
 * - WorkOS Admin Portal access
 * - Danger zone (delete organization)
 */

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@repo/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Alert, AlertDescription } from '@repo/design-system/components/ui/alert';
import { Separator } from '@repo/design-system/components/ui/separator';
import { ExternalLink, Trash2, AlertTriangle, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface OrganizationSettingsProps {
  organizationId: string;
}

export function OrganizationSettings({ organizationId }: OrganizationSettingsProps) {
  const organization = useQuery(api.organization.getOrganization, { id: organizationId });
  const updateOrganization = useMutation(api.organization.updateOrganization);
  const deleteOrganization = useMutation(api.organization.deleteOrganization);

  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form when org data loads
  useState(() => {
    if (organization) {
      setName(organization.name || '');
      setSubdomain(organization.subdomain || '');
      setCustomDomain(organization.customDomain || '');
      setPrimaryColor(organization.primaryColor || '#000000');
    }
  });

  const handleSave = async () => {
    if (!organization) return;

    setIsSaving(true);
    try {
      await updateOrganization({
        id: organizationId,
        name: name || undefined,
        subdomain: subdomain || undefined,
        customDomain: customDomain || undefined,
        primaryColor: primaryColor || undefined,
      });
      toast.success('Organization settings updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteOrganization({ id: organizationId });
      toast.success('Organization deleted');
      // Redirect to organization list
      window.location.href = '/organizations';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete organization');
      setIsDeleting(false);
    }
  };

  const openAdminPortal = () => {
    // This would generate the WorkOS Admin Portal URL
    // For now, we'll show a placeholder
    toast.info('Opening WorkOS Admin Portal...');
    // TODO: Call API to generate portal URL and redirect
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your organization's basic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ARA Property Services"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex gap-2">
              <Input
                id="subdomain"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="propertyservices"
              />
              <span className="flex items-center text-sm text-muted-foreground">
                .ara.aliaslabs.ai
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your organization will be accessible at {subdomain || 'yourorg'}.ara.aliaslabs.ai
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
            <Input
              id="customDomain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="app.yourcompany.com"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Customize your organization's appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Logo and favicon upload will be available in the next update
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Branding'}
          </Button>
        </CardFooter>
      </Card>

      {/* WorkOS Admin Portal */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Management</CardTitle>
          <CardDescription>
            Configure SSO, Directory Sync, and other advanced features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Use the WorkOS Admin Portal to configure:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            <li>Single Sign-On (SSO) with SAML, OIDC, or OAuth</li>
            <li>Directory Sync (SCIM) for automatic user provisioning</li>
            <li>Domain verification</li>
            <li>Audit logs and security settings</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={openAdminPortal}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Admin Portal
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for this organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Deleting this organization will remove all associated data, members, and settings.
              This action cannot be undone.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Organization'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
