# ✅ ARA Group Platform - Final WorkOS Configuration

## 🏢 Organization Structure

### Equal Status Model
**All organizations are treated equally** - no parent-child hierarchy. Each organization has equal permissions and access.

### Organizations

1. **ARA Group Platform** (Primary)
   - Domains: `aragroup.com.au`, `arapropertyservices.com.au`, `araproperty.com`, `aragroup.com`
   - Status: Equal

2. **ARA Fire & Security**
   - Domain: `fire.aragroup.com.au`
   - Status: Equal

3. **ARA Electrical**
   - Domain: `electrical.aragroup.com.au`
   - Status: Equal

4. **ARA Building Services**
   - Domain: `buildingservices.aragroup.com.au`
   - Status: Equal
   - Sub-divisions:
     - Mechanical Services (`mechanical.aragroup.com.au`)
     - Property Services (`propertyservices.aragroup.com.au`)

5. **ARA Products**
   - Domain: `manufacture.aragroup.com.au`
   - Status: Equal

---

## 👑 Super Admin Users

The following three users are assigned the **Super Admin** role across all organizations:

### 1. Ed Federman
- **Title:** Co-founder, ARA Group
- **Email:** `ed.federman@aragroup.com.au` (update with actual email)
- **Role:** Super Admin (ARA Group)
- **Access:** Full system access across all organizations
- **Permissions:** All permissions (`*`)

### 2. Mark Brady
- **Title:** Executive
- **Email:** `mark.brady@aliaslabs.ai` (ALIAS Super Admin)
- **Role:** Super Admin (ALIAS)
- **Access:** Full system access across all organizations
- **Permissions:** All permissions (`*`)

### 3. Dan Humphreys
- **Title:** Executive
- **Email:** `dan.humphreys@aliaslabs.ai` (ALIAS Super Admin)
- **Role:** Super Admin (ALIAS)
- **Access:** Full system access across all organizations
- **Permissions:** All permissions (`*`)

---

## 🎨 Branding

- **Primary Color:** `#AFCC37` (Lime Green)
- **Secondary Color:** `#435464` (Navy Blue)
- **Logo:** ARA Property Services Stacked Logo
- **Tagline:** "ARA. Here for you. Here for good."

---

## 🎭 Roles & Permissions

### Super Admin Role
- **Slug:** `super_admin`
- **Assigned To:** Ed Federman, Mark Brady, Dan Humphreys
- **Permissions:** All permissions (`*`)

### Other Roles (8 additional)
- Admin
- Credential Manager
- Credential Viewer
- Manager
- Supervisor
- Operator
- Viewer
- User

---

## 🚀 Setup Commands

### Configure ARA Group Platform
```bash
pnpm run configure:ara-group
```

### Setup Super Admins
```bash
pnpm run setup:ara-super-admins
```

This will:
1. Create/get ARA Group Platform organization
2. Create/get users for Ed Federman, Mark Brady, Dan Humphreys
3. Add users to organization
4. Assign Super Admin role (via dashboard or API)

---

## 📝 Dashboard Configuration Steps

### 1. Assign Super Admin Role

1. Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}
2. Navigate to Members
3. For each Super Admin user:
   - Find user (Ed Federman, Mark Brady, Dan Humphreys)
   - Assign role: `super_admin`
   - Verify access

### 2. Verify Organization Structure

1. Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations
2. Verify all organizations exist
3. Ensure no parent-child relationships
4. Verify all have equal status

---

## ✅ Configuration Summary

| Feature | Status | Details |
|---------|--------|---------|
| **Organizations** | ✅ Equal Status | All organizations treated equally |
| **Super Admins** | ✅ Defined | Ed Federman, Mark Brady, Dan Humphreys |
| **Branding** | ✅ Configured | #AFCC37, #435464 |
| **Roles** | ✅ Defined | 9 roles with Super Admin assigned |

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform
**Structure:** Equal Status (No Hierarchy)

