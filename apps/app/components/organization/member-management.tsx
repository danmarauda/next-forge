'use client';

/**
 * Member Management Component
 *
 * Allows organization admins to:
 * - View all members
 * - Invite new members
 * - Update member roles
 * - Remove members
 * - Manage pending invitations
 */

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@repo/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { Badge } from '@repo/design-system/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@repo/design-system/components/ui/dialog';
import { MoreVertical, UserPlus, Mail, Trash2, Crown, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

interface MemberManagementProps {
  organizationId: string;
}

const ROLES = [
  { value: 'owner', label: 'Owner', icon: Crown },
  { value: 'admin', label: 'Admin', icon: Shield },
  { value: 'member', label: 'Member', icon: User },
];

export function MemberManagement({ organizationId }: MemberManagementProps) {
  const members = useQuery(api.organization.listMembers, { organizationId });
  const invitations = useQuery(api.organization.listPendingInvitations, { organizationId });
  const inviteMember = useMutation(api.organization.inviteMember);
  const updateMemberRole = useMutation(api.organization.updateMemberRole);
  const removeMember = useMutation(api.organization.removeMember);
  const cancelInvitation = useMutation(api.organization.cancelInvitation);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setIsInviting(true);
    try {
      await inviteMember({
        organizationId,
        email: inviteEmail,
        role: inviteRole,
      });
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'owner' | 'admin' | 'member') => {
    try {
      await updateMemberRole({
        organizationId,
        userId,
        role: newRole,
      });
      toast.success('Member role updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      await removeMember({ organizationId, userId });
      toast.success('Member removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove member');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation({ invitationId });
      toast.success('Invitation cancelled');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel invitation');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = ROLES.find((r) => r.value === role);
    if (!roleConfig) return null;

    const Icon = roleConfig.icon;
    return (
      <Badge variant={role === 'owner' ? 'default' : role === 'admin' ? 'secondary' : 'outline'}>
        <Icon className="w-3 h-3 mr-1" />
        {roleConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {members?.length || 0} {members?.length === 1 ? 'member' : 'members'}
              </CardDescription>
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join this organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInvite} disabled={isInviting}>
                    {isInviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member: any) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user?.image} />
                        <AvatarFallback>
                          {member.user?.name?.[0] || member.user?.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.user?.name || 'Unknown User'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.user?.email}</TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>
                    {new Date(member._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdateRole(member.userId, 'owner')}>
                          Make Owner
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateRole(member.userId, 'admin')}>
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateRole(member.userId, 'member')}>
                          Make Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleRemoveMember(member.userId)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              {invitations.length} pending {invitations.length === 1 ? 'invitation' : 'invitations'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation: any) => (
                  <TableRow key={invitation._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {invitation.email}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                    <TableCell>
                      {new Date(invitation._creationTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
