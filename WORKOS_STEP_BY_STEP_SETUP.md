# 🎓 WorkOS Step-by-Step Setup with Best Practices

Follow along as we configure each feature with industry best practices.

---

## 🎨 Step 1: Branding Configuration

### Why Branding Matters
**Best Practice:** Consistent branding builds trust. Users should see your brand across all authentication touchpoints.

### Configuration Steps

1. **Navigate to Branding:**
   ```
   https://dashboard.workos.com/branding
   ```

2. **Click "Edit branding"**

3. **Upload Logo (Best Practices):**
   - **Format:** SVG preferred, PNG acceptable (minimum 200x200px)
   - **Background:** Ensure logo works on both light and dark backgrounds
   - **Size:** Optimize file size (< 100KB recommended)
   - **Aspect Ratio:** Maintain consistent aspect ratio
   - **Test:** Preview on both light and dark mode

4. **Set Brand Colors:**
   - **Primary Color:** Your main brand color (e.g., #0066CC)
   - **Secondary Color:** Complementary color
   - **Accessibility:** Ensure contrast ratio meets WCAG AA (4.5:1 minimum)
   - **Test:** Use contrast checker tools

5. **Configure Appearance:**
   - **Appearance:** System (follows user's OS preference)
   - **Font Family:** System (uses user's system font)
   - **Radius:** Medium (balanced, not too rounded)

6. **Light Mode Configuration:**
   - **Page Background:** Light color (#FFFFFF or your brand's light background)
   - **Button Background:** Primary brand color
   - **Button Text:** White or high-contrast color
   - **Links:** Primary brand color

7. **Dark Mode Configuration:**
   - **Page Background:** Dark color (#1A1A1A or your brand's dark background)
   - **Button Background:** Primary brand color (may need adjustment for dark mode)
   - **Button Text:** White or high-contrast color
   - **Links:** Lighter shade of primary color

8. **Email Templates:**
   - Customize Magic Auth email template
   - Customize Password Reset email
   - Customize Welcome email
   - Use your brand voice and colors

### Best Practices Checklist:
- [ ] Logo uploaded (SVG or high-res PNG)
- [ ] Colors meet accessibility standards
- [ ] Tested on both light and dark mode
- [ ] Email templates customized
- [ ] Consistent with main application branding

---

## 🎭 Step 2: Roles & Permissions

### Why Roles Matter
**Best Practice:** Principle of Least Privilege - users should only have access to what they need.

### Configuration Steps

1. **Navigate to Roles & Permissions:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/roles-and-permissions
   ```

2. **Create Permissions First:**
   - Click "Create permission"
   - Define specific permissions (e.g., `users.read`, `users.write`, `organizations.manage`)
   - Use descriptive names
   - Document what each permission allows

3. **Create Roles:**
   - Click "Create role"
   - Define role hierarchy

### Recommended Role Structure:

**Admin Role:**
- Permissions:
  - `users.read`
  - `users.write`
  - `users.delete`
  - `organizations.read`
  - `organizations.write`
  - `organizations.delete`
  - `settings.read`
  - `settings.write`
- Use Case: Full system access

**Manager Role:**
- Permissions:
  - `users.read`
  - `users.write` (limited to own team)
  - `organizations.read`
  - `reports.read`
- Use Case: Team management

**Member Role:**
- Permissions:
  - `users.read` (own profile only)
  - `organizations.read`
- Use Case: Basic access

**Viewer Role:**
- Permissions:
  - `users.read` (own profile only)
  - `organizations.read`
- Use Case: Read-only access

4. **Set Role Priority:**
   - Click "Edit priority"
   - Order roles by hierarchy (Admin > Manager > Member > Viewer)
   - Higher priority roles override lower ones

5. **Configure Role Assignment:**
   - Click "Configure role assignment"
   - Enable role assignment in Admin Portal
   - Map IdP groups to roles (if using SSO)

### Best Practices Checklist:
- [ ] Permissions are granular and specific
- [ ] Roles follow clear hierarchy
- [ ] Role priority configured
- [ ] Role assignment configured
- [ ] Documented in your system

---

## 🛡️ Step 3: Radar Security

### Why Radar Matters
**Best Practice:** Defense in Depth - multiple security layers protect against various attack vectors.

### Configuration Steps

1. **Navigate to Radar:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/radar
   ```

2. **Configure Risk Thresholds:**
   - **Low Risk (0-30):** Allow login
   - **Medium Risk (31-70):** Require additional verification (MFA)
   - **High Risk (71-100):** Block or require admin approval

3. **Enable Device Fingerprinting:**
   - Track device changes
   - Alert on new devices
   - Require verification for new devices

4. **Configure IP Reputation:**
   - Block known malicious IPs (automatic)
   - Allowlist trusted IPs (if needed)
   - Monitor IP changes

5. **Set Up Behavioral Analysis:**
   - Track login patterns
   - Detect anomalies (unusual location, time, device)
   - Set up alerts for suspicious activity

6. **Configure Blocking Rules:**
   - Block after X failed attempts (recommended: 5)
   - Block known bad IPs
   - Block suspicious devices

7. **Set Up Alerts:**
   - Email alerts for high-risk events
   - Dashboard notifications
   - Webhook alerts (optional)

### Best Practices Checklist:
- [ ] Risk thresholds configured appropriately
- [ ] Device fingerprinting enabled
- [ ] IP reputation checks enabled
- [ ] Behavioral analysis configured
- [ ] Blocking rules set up
- [ ] Alerts configured

---

## 🔗 Step 4: IdP Attributes

### Why IdP Attributes Matter
**Best Practice:** Consistent attribute mapping ensures user data flows correctly from identity providers.

### Configuration Steps

1. **Navigate to IdP Attributes:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/identity-provider-attributes
   ```

2. **Map Standard Attributes:**
   - `email` → `email` (required)
   - `given_name` → `firstName`
   - `family_name` → `lastName`
   - `picture` → `image`
   - `sub` → `externalId`

3. **Handle Custom Attributes:**
   - Map organization-specific attributes
   - Handle custom claims from IdP
   - Transform attributes as needed

4. **Set Default Values:**
   - Set defaults for missing attributes
   - Handle null/empty values gracefully
   - Validate attribute values

5. **Test Attribute Mapping:**
   - Test with sample data
   - Verify mappings work correctly
   - Test transformations

### Best Practices Checklist:
- [ ] Standard attributes mapped
- [ ] Custom attributes handled
- [ ] Default values set
- [ ] Transformations tested
- [ ] Documented mappings

---

## 🚩 Step 5: Feature Flags

### Why Feature Flags Matter
**Best Practice:** Gradual rollouts reduce risk by catching issues early and allowing quick rollback.

### Configuration Steps

1. **Navigate to Feature Flags:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/flags
   ```

2. **Create Feature Flags:**
   - Click "Create flag"
   - Define flag key (e.g., `new-auth-flow`)
   - Set default value (usually `false`)
   - Document purpose

3. **Configure Gradual Rollout:**
   - **Day 1:** 10% of users
   - **Day 2:** 25% of users (if no issues)
   - **Day 3:** 50% of users (if no issues)
   - **Day 4:** 100% of users (if no issues)

4. **Set Up Targeting:**
   - Target specific organizations
   - Target specific users
   - Use A/B testing groups

5. **Monitor Usage:**
   - Track flag usage
   - Monitor error rates
   - Watch performance metrics

### Best Practices Checklist:
- [ ] Flags created with clear names
- [ ] Gradual rollout configured
- [ ] Targeting rules set up
- [ ] Monitoring configured
- [ ] Rollback plan documented

---

## 🔌 Step 6: OAuth Providers (Google & Microsoft)

### Why OAuth Matters
**Best Practice:** Secure credential management and proper redirect URI configuration prevent security issues.

### Google OAuth Setup

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://ara.aliaslabs.ai/auth/callback`
   - Copy Client ID and Client Secret

2. **Configure in WorkOS:**
   - Navigate to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication/oauth-providers
   - Click "Enable" on Google
   - Enter Client ID and Client Secret
   - Set redirect URI: `https://ara.aliaslabs.ai/auth/callback`
   - Save

### Microsoft OAuth Setup

1. **Get Microsoft OAuth Credentials:**
   - Go to [Azure Portal](https://portal.azure.com/)
   - Azure Active Directory → App registrations → New registration
   - Name: ARA Group Platform
   - Supported account types: Accounts in any organizational directory
   - Redirect URI: `https://ara.aliaslabs.ai/auth/callback`
   - Register
   - Copy Application (client) ID
   - Certificates & secrets → New client secret → Copy value

2. **Configure in WorkOS:**
   - Navigate to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication/oauth-providers
   - Click "Enable" on Microsoft
   - Enter Client ID (Application ID) and Client Secret
   - Set redirect URI: `https://ara.aliaslabs.ai/auth/callback`
   - Save

### Best Practices Checklist:
- [ ] OAuth credentials stored securely (environment variables)
- [ ] Redirect URIs match exactly
- [ ] HTTPS used in production
- [ ] Credentials rotated regularly
- [ ] Tested in staging first

---

## 🌍 Step 7: Domains

### Why Domains Matter
**Best Practice:** Proper DNS configuration ensures secure and reliable authentication.

### Configuration Steps

1. **Navigate to Domains:**
   ```
   https://dashboard.workos.com/domains
   ```

2. **Add Domain:**
   - Click "Add domain"
   - Enter domain: `ara-group.com`
   - Verify domain ownership

3. **Configure DNS Records:**
   - Add CNAME record (if provided by WorkOS)
   - Set appropriate TTL (recommended: 3600 seconds)
   - Verify DNS propagation

4. **Verify SSL:**
   - WorkOS handles SSL automatically
   - Verify certificate is valid
   - Monitor expiration

### Best Practices Checklist:
- [ ] Domain added and verified
- [ ] DNS records configured correctly
- [ ] SSL certificate valid
- [ ] Monitoring set up

---

## ✅ Final Verification

### Test Each Feature:

1. **Branding:**
   - [ ] Test sign-in page appearance
   - [ ] Test email templates
   - [ ] Verify colors meet accessibility standards

2. **Roles & Permissions:**
   - [ ] Test role assignment
   - [ ] Verify permissions work correctly
   - [ ] Test role hierarchy

3. **Radar:**
   - [ ] Test risk scoring
   - [ ] Verify device fingerprinting
   - [ ] Test blocking rules

4. **IdP Attributes:**
   - [ ] Test attribute mapping
   - [ ] Verify transformations
   - [ ] Test with sample data

5. **Feature Flags:**
   - [ ] Test flag toggling
   - [ ] Verify gradual rollout
   - [ ] Test targeting

6. **OAuth Providers:**
   - [ ] Test Google OAuth flow
   - [ ] Test Microsoft OAuth flow
   - [ ] Verify redirect URIs

7. **Domains:**
   - [ ] Verify domain works
   - [ ] Test SSL certificate
   - [ ] Verify DNS records

---

## 📚 Additional Resources

- **WorkOS Docs:** https://workos.com/docs
- **WorkOS Dashboard:** https://dashboard.workos.com
- **Best Practices Guide:** `WORKOS_BEST_PRACTICES_SETUP.md`

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform

