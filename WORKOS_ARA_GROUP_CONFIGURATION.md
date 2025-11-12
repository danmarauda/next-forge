# 🏢 ARA Group Platform - WorkOS Configuration

Complete WorkOS configuration based on ARA Group Platform branding, roles, and organizational structure.

---

## 🎨 Branding Configuration

### Brand Identity
- **Company Name:** ARA Group Platform (ARA Group Limited)
- **Tagline:** "ARA. Here for you. Here for good."
- **Website:** https://aragroup.com.au
- **Legal Name:** ARA Group Limited
- **ABN:** 47 074 886 561

### Logo
- **Primary Logo URL:** https://propertyservices.aragroup.com.au/wp-content/uploads/2022/02/ARA-Property-Services-Stacked-Logo-Mono-White.svg
- **Format:** SVG
- **Style:** Stacked layout with geometric pattern
- **Colors:** White on lime green background

### Color Palette

#### Primary Colors
```css
/* Brand Lime Green - Primary */
--ara-primary: #AFCC37;
rgb(175, 204, 55)

/* Navy Blue - Text & Headers */
--ara-navy: #435464;
rgb(67, 84, 100)

/* Slate Blue - Darker variant */
--ara-slate: #33475B;
rgb(51, 71, 91)

/* Medium Blue */
--ara-blue: #425B76;
rgb(66, 91, 118)
```

#### Secondary Colors
```css
/* Cyan/Teal */
--ara-cyan: #0091AE;
rgb(0, 145, 174)

/* Teal Light */
--ara-teal: #63B0BB;
rgb(99, 176, 187)

/* Orange/Amber */
--ara-orange: #EDA920;
rgb(237, 169, 32)

/* Pink/Magenta */
--ara-pink: #D2466C;
rgb(210, 70, 108)
```

#### Neutral Colors
```css
/* White */
--ara-white: #FFFFFF;

/* Light Gray */
--ara-gray-100: #F9FAFB;

/* Light Blue Gray */
--ara-gray-200: #EAEDF0;

/* Medium Gray */
--ara-gray-300: #A6BBCA;
```

### WorkOS Branding Configuration

**Light Mode:**
- **Page Background:** `#FFFFFF` (White)
- **Button Background:** `#AFCC37` (Lime Green - Primary)
- **Button Text:** `#435464` (Navy Blue)
- **Links:** `#0091AE` (Cyan)
- **Logo:** Upload ARA Property Services Stacked Logo

**Dark Mode:**
- **Page Background:** `#33475B` (Slate Blue)
- **Button Background:** `#AFCC37` (Lime Green - Primary)
- **Button Text:** `#33475B` (Slate Blue)
- **Links:** `#63B0BB` (Teal Light)
- **Logo:** Upload ARA Property Services Stacked Logo (white variant)

**Appearance Settings:**
- **Appearance:** System (follows user's OS preference)
- **Font Family:** System (DIN preferred, Roboto fallback)
- **Radius:** Medium (8px)

---

## 🎭 Roles & Permissions Configuration

### ARA Group Platform Roles

#### 1. Super Admin
**Slug:** `super_admin`
**Name:** Super Administrator
**Description:** Full system access across all ARA Group divisions
**Permissions:**
- `*` (All permissions)
- `users.*`
- `organizations.*`
- `settings.*`
- `credentials.*`
- `workflows.*`
- `agents.*`
- `mcp.*`
- `chat.*`

**Assigned Users:**
- **Ed Federman** (Co-founder, ARA Group) - ARA Group Super Admin
- **Mark Brady** (Executive) - ALIAS Super Admin
- **Dan Humphreys** (Executive) - ALIAS Super Admin

**Use Case:** System administrators with full access across all organizations

#### 2. Admin
**Slug:** `admin`
**Name:** Administrator
**Description:** Organization administration within assigned division
**Permissions:**
- `users.read`
- `users.write`
- `users.delete`
- `organizations.read`
- `organizations.write`
- `organizations.delete`
- `settings.read`
- `settings.write`
- `credentials.read`
- `credentials.write`
- `workflows.*`
- `agents.*`
- `mcp.*`
- `chat.*`

**Use Case:** Division administrators (Fire & Security, Electrical, Building Services, Products)

#### 3. Credential Manager
**Slug:** `credential_manager`
**Name:** Credential Manager
**Description:** Manage credentials and access controls
**Permissions:**
- `users.read`
- `credentials.read`
- `credentials.write`
- `credentials.delete`
- `workflows.view`
- `workflows.use`
- `agents.view`
- `agents.use`
- `mcp.view`
- `mcp.use`
- `chat.*`

**Use Case:** IT staff managing system credentials

#### 4. Credential Viewer
**Slug:** `credential_viewer`
**Name:** Credential Viewer
**Description:** View-only access to credentials
**Permissions:**
- `users.read`
- `credentials.read`
- `workflows.view`
- `workflows.use`
- `agents.view`
- `agents.use`
- `mcp.view`
- `mcp.use`
- `chat.*`

**Use Case:** Staff who need to view but not modify credentials

#### 5. Manager
**Slug:** `manager`
**Name:** Manager
**Description:** Team management within facility/division
**Permissions:**
- `users.read`
- `users.write` (limited to own team)
- `organizations.read`
- `reports.read`
- `workflows.view`
- `workflows.use`
- `workflows.list`
- `agents.view`
- `agents.use`
- `agents.list`
- `chat.*`

**Use Case:** Facility managers, team leaders

#### 6. Supervisor
**Slug:** `supervisor`
**Name:** Supervisor
**Description:** Operational supervision
**Permissions:**
- `users.read` (own team)
- `organizations.read`
- `reports.read`
- `workflows.view`
- `workflows.use`
- `agents.view`
- `agents.use`
- `chat.*`

**Use Case:** Operational supervisors

#### 7. Operator
**Slug:** `operator`
**Name:** Operator
**Description:** Basic operational access
**Permissions:**
- `users.read` (own profile)
- `organizations.read`
- `workflows.view`
- `workflows.use`
- `agents.view`
- `agents.use`
- `chat.*`

**Use Case:** Field operators, technicians

#### 8. Viewer
**Slug:** `viewer`
**Name:** Viewer
**Description:** Read-only access
**Permissions:**
- `users.read` (own profile)
- `organizations.read`
- `workflows.view`
- `agents.view`
- `chat.read`

**Use Case:** Read-only users, auditors

#### 9. User
**Slug:** `user`
**Name:** User
**Description:** Basic user access
**Permissions:**
- `users.read` (own profile)
- `organizations.read`
- `workflows.view`
- `workflows.use`
- `workflows.list`
- `agents.view`
- `agents.use`
- `agents.list`
- `mcp.view`
- `mcp.use`
- `mcp.list`
- `chat.*`
- `temporaryChat.*`

**Use Case:** Standard platform users

### Role Hierarchy (Priority Order)
1. Super Admin (highest)
2. Admin
3. Credential Manager
4. Credential Viewer
5. Manager
6. Supervisor
7. Operator
8. Viewer
9. User (lowest)

---

## 🏢 Organizations Configuration

### Organization Structure
**All organizations are treated equally** - no hierarchy. Each organization has equal access and permissions.

### Primary Organization
**Name:** ARA Group Platform
**Main Domain:** `ara.aliaslabs.ai` (Demo)
**Domains:**
- `ara.aliaslabs.ai` (Primary - Demo)
- `aragroup.com.au` (Production - future)
- `arapropertyservices.com.au` (Production - future)
- `araproperty.com` (Production - future)
- `aragroup.com` (Production - future)

### Division Organizations (Equal Status)

#### 1. ARA Fire & Security
- **Demo Domain:** `fire.ara.aliaslabs.ai`
- **Production Domain:** `fire.aragroup.com.au` (future)
- **Additional Domains:** `arafireandsecurity.com` (production)
- **Services:** Fire protection, security, and marine safety services
- **Status:** Equal to all other organizations
- **History:** Foundations date back to 1993

#### 2. ARA Electrical
- **Demo Domain:** `electrical.ara.aliaslabs.ai`
- **Production Domain:** `electrical.aragroup.com.au` (future)
- **Services:** Industrial electrical installation and service
- **Status:** Equal to all other organizations

#### 3. ARA Building Services
- **Demo Domain:** `buildingservices.ara.aliaslabs.ai`
- **Production Domain:** `buildingservices.aragroup.com.au` (future)
- **Services:** Building maintenance and repair services
- **Status:** Equal to all other organizations

#### 4. ARA Mechanical Services
- **Demo Domain:** `mechanical.ara.aliaslabs.ai`
- **Production Domain:** `mechanical.aragroup.com.au` (future)
- **Services:** HVAC and mechanical services
- **Status:** Equal to all other organizations
- **Note:** Part of Building Services capability area but operates as standalone brand

#### 5. ARA Property Services
- **Demo Domain:** `propertyservices.ara.aliaslabs.ai`
- **Production Domain:** `propertyservices.aragroup.com.au` (future)
- **Services:** Cleaning and property maintenance services
- **Status:** Equal to all other organizations
- **History:** Acquired CMC Property Services in 2017
- **Location:** Camberwell, Victoria

#### 6. ARA Products
- **Demo Domain:** `products.ara.aliaslabs.ai`
- **Production Domain:** `manufacture.aragroup.com.au` (future)
- **Services:** Product distribution of electronic security products
- **Status:** Equal to all other organizations

#### 7. ARA Manufacturing
- **Demo Domain:** `manufacturing.ara.aliaslabs.ai`
- **Production Domain:** `manufacture.aragroup.com.au` (future)
- **Services:** Manufacturing of high-security products and commercial doors
- **Status:** Equal to all other organizations
- **Note:** Part of Products capability area but operates as standalone brand

#### 8. ARA Marine
- **Demo Domain:** `marine.ara.aliaslabs.ai`
- **Production Domains:** `aramarine.com.au`, `aramarine.co.nz` (future)
- **Services:** Specialty marine safety services and technical services
- **Status:** Equal to all other organizations
- **Established:** 2021 (formed when ARA Group acquired two companies)

#### 9. ARA Security Solutions
- **Demo Domain:** `security.ara.aliaslabs.ai`
- **Production Domain:** `arasecuritysolutions.com.au` (future)
- **Services:** Security solutions
- **Status:** Equal to all other organizations

#### 10. ARA Indigenous Services
- **Demo Domain:** `indigenous.ara.aliaslabs.ai`
- **Production Domain:** `indigenous.aragroup.com.au` (future)
- **Type:** Majority Indigenous-owned business partnership
- **Services:** Cleaning and property maintenance services
- **Status:** Equal to all other organizations
- **Established:** 2017 (acquired 49% of CMC Indigenous Services)
- **Managing Director:** Michael O'Loughlin

### Organization Structure
```
All Organizations (Equal Status - No Hierarchy)
├── ARA Group Platform (Primary)
├── ARA Fire & Security
├── ARA Electrical
├── ARA Building Services
├── ARA Mechanical Services (equal status)
├── ARA Property Services (equal status)
├── ARA Products
├── ARA Manufacturing (equal status)
├── ARA Marine (equal status)
├── ARA Security Solutions
└── ARA Indigenous Services
```

**Total Organizations:** 11

**Important:** 
- All organizations have **equal permissions and access**
- No parent-child hierarchy
- Each organization is independent and equal
- Even though Mechanical Services and Property Services are part of Building Services capability area, they operate as standalone brands and are treated as equal organizations

### Super Admin Users

**Super Admin Role Assignment:**
The following users are assigned the Super Admin role across all organizations:

1. **Ed Federman**
   - Title: Co-founder, ARA Group
   - Email: `ed.federman@aragroup.com.au` (update with actual email)
   - Role: Super Admin (ARA Group)
   - Access: Full system access across all organizations

2. **Mark Brady**
   - Title: Executive
   - Email: `mark.brady@aliaslabs.ai` (update with actual email)
   - Role: Super Admin (ALIAS)
   - Access: Full system access across all organizations

3. **Dan Humphreys**
   - Title: Executive
   - Email: `dan.humphreys@aliaslabs.ai` (update with actual email)
   - Role: Super Admin (ALIAS)
   - Access: Full system access across all organizations

**Setup:** Run `pnpm run setup:ara-super-admins` to create and assign Super Admin users.

---

## 🌐 Domain Configuration (Demo)

### Demo Domain Structure

**Main Domain:** `ara.aliaslabs.ai`

**Subdomains for Each Organization:**
- `ara.aliaslabs.ai` - ARA Group Platform (main)
- `fire.ara.aliaslabs.ai` - ARA Fire & Security
- `electrical.ara.aliaslabs.ai` - ARA Electrical
- `buildingservices.ara.aliaslabs.ai` - ARA Building Services
- `mechanical.ara.aliaslabs.ai` - ARA Mechanical Services
- `propertyservices.ara.aliaslabs.ai` - ARA Property Services
- `products.ara.aliaslabs.ai` - ARA Products
- `manufacturing.ara.aliaslabs.ai` - ARA Manufacturing
- `marine.ara.aliaslabs.ai` - ARA Marine
- `security.ara.aliaslabs.ai` - ARA Security Solutions
- `indigenous.ara.aliaslabs.ai` - ARA Indigenous Services

**Note:** Production domains (`aragroup.com.au`, etc.) will be configured when moving to production.

---

## 🔗 IdP Attributes Mapping

### Standard Attribute Mappings

**From Google Workspace / Microsoft Entra ID:**
- `email` → `email` (required)
- `given_name` → `firstName`
- `family_name` → `lastName`
- `picture` → `image`
- `sub` → `externalId`
- `department` → `department` (custom)
- `jobTitle` → `jobTitle` (custom)
- `officeLocation` → `officeLocation` (custom)

### Custom Attributes
- `ara.division` → Division assignment (Fire & Security, Electrical, etc.)
- `ara.facility` → Facility ID
- `ara.employeeId` → Employee ID
- `ara.accessLevel` → Access level (admin, manager, operator, viewer)

---

## 🛡️ Radar Security Configuration

### Risk Thresholds (ARA Group Specific)
- **Low Risk (0-30):** Allow login
- **Medium Risk (31-70):** Require MFA verification
- **High Risk (71-100):** Block or require admin approval

### Device Fingerprinting
- **Enabled:** Yes
- **Track:** Device changes, new devices
- **Alert:** On new device login

### IP Reputation
- **Block:** Known malicious IPs (automatic)
- **Allowlist:** ARA Group office IPs
- **Monitor:** IP changes, unusual locations

### Behavioral Analysis
- **Track:** Login patterns, unusual times, locations
- **Alert:** Suspicious activity patterns
- **Block:** After 5 failed attempts

---

## 🚩 Feature Flags

### ARA Group Platform Feature Flags

1. **`ara.newAuthFlow`**
   - Description: New authentication flow rollout
   - Default: `false`
   - Rollout: 10% → 25% → 50% → 100%

2. **`ara.credentialManagement`**
   - Description: Enhanced credential management
   - Default: `true`
   - Target: Credential Managers and Admins

3. **`ara.workflowEngine`**
   - Description: Workflow engine features
   - Default: `true`
   - Target: All users

4. **`ara.agentFeatures`**
   - Description: AI agent features
   - Default: `true`
   - Target: All users

---

## 📧 Email Templates

### Magic Auth Email
**Subject:** Your ARA Group Platform sign-in code
**Template:**
```
Hello,

Your sign-in code for ARA Group Platform is: {code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

ARA. Here for you. Here for good.
ARA Group Platform
```

### Welcome Email
**Subject:** Welcome to ARA Group Platform
**Template:**
```
Welcome to ARA Group Platform!

Your account has been created. You can now access the platform at:
https://ara.aliaslabs.ai

Your role: {role}
Your organization: {organization}

If you have any questions, please contact your administrator.

ARA. Here for you. Here for good.
ARA Group Platform
```

---

## 🔌 OAuth Providers

### Google Workspace (Recommended)
- **Use Case:** Primary SSO for ARA Group employees
- **Domain:** `aragroup.com.au`
- **Configuration:** Connect Google Workspace via Directory Sync

### Microsoft Entra ID (Optional)
- **Use Case:** Alternative SSO for enterprise clients
- **Configuration:** Configure if needed for client access

---

## 📊 Implementation Checklist

### Branding
- [ ] Upload ARA Property Services logo
- [ ] Set primary color: #AFCC37 (Lime Green)
- [ ] Set secondary color: #435464 (Navy Blue)
- [ ] Configure light mode colors
- [ ] Configure dark mode colors
- [ ] Customize email templates
- [ ] Test branding on sign-in page

### Roles & Permissions
- [ ] Create Super Admin role
- [ ] Create Admin role
- [ ] Create Credential Manager role
- [ ] Create Credential Viewer role
- [ ] Create Manager role
- [ ] Create Supervisor role
- [ ] Create Operator role
- [ ] Create Viewer role
- [ ] Create User role
- [ ] Set role priorities
- [ ] Configure role assignments

### Organizations
- [ ] Verify ARA Group Platform organization
- [ ] Add domains (aragroup.com.au, etc.)
- [ ] Create division organizations (if needed)
- [ ] Configure organization hierarchy

### IdP Attributes
- [ ] Map standard attributes
- [ ] Configure custom attributes
- [ ] Set default values
- [ ] Test attribute mappings

### Radar Security
- [ ] Set risk thresholds
- [ ] Enable device fingerprinting
- [ ] Configure IP reputation
- [ ] Set up behavioral analysis
- [ ] Configure blocking rules
- [ ] Set up alerts

### Feature Flags
- [ ] Create feature flags
- [ ] Configure gradual rollout
- [ ] Set up targeting rules

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform
**Company:** ARA Group Limited

