# 👑 ARA Group Platform - Super Admin Configuration

## Super Admin Structure

### ARA Group Super Admin
- **Ed Federman**
  - Title: Co-founder, ARA Group
  - Email: `ed.federman@aragroup.com.au`
  - Type: ARA Group Super Admin
  - Access: Full system access across all organizations

### ALIAS Super Admins
- **Mark Brady**
  - Title: Executive
  - Email: `mark.brady@aliaslabs.ai`
  - Type: ALIAS Super Admin
  - Access: Full system access across all organizations

- **Dan Humphreys**
  - Title: Executive
  - Email: `dan.humphreys@aliaslabs.ai`
  - Type: ALIAS Super Admin
  - Access: Full system access across all organizations

---

## Organization Structure

**All organizations are treated equally** - no hierarchy.

- ARA Group Platform
- ARA Fire & Security
- ARA Electrical
- ARA Building Services
- ARA Products

All have equal permissions and access.

---

## Setup Commands

### View Configuration
```bash
pnpm run configure:ara-group
```

### Setup Super Admins
```bash
pnpm run setup:ara-super-admins
```

This will:
1. Create/get ARA Group Platform organization
2. Create/get users:
   - Ed Federman (ARA Group)
   - Mark Brady (ALIAS)
   - Dan Humphreys (ALIAS)
3. Add users to organization
4. Assign Super Admin role

---

## Dashboard Configuration

### Assign Super Admin Role

1. Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}
2. Navigate to Members
3. For each Super Admin:
   - Find user
   - Assign role: `super_admin`
   - Verify access

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform

