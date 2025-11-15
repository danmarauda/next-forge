# 🌐 ARA Group Platform - Production DNS Configuration

Complete DNS configuration guide for all ARA Group Platform production domains.

---

## 📋 Overview

This document provides DNS configuration instructions for all 11 ARA Group organizations in production.

**Base Domain:** `aragroup.com.au`  
**Demo Domain:** `ara.aliaslabs.ai` (for testing)

---

## 🔧 DNS Configuration

### Vercel DNS Setup

All domains should point to Vercel's DNS servers. Vercel will automatically provision SSL certificates.

### CNAME Records

For each subdomain, add a CNAME record pointing to Vercel:

```
Type: CNAME
Name: [subdomain]
Value: cname.vercel-dns.com
TTL: 3600 (or auto)
```

### A Records (Alternative)

If CNAME is not supported, use A records pointing to Vercel's IP addresses:

```
Type: A
Name: [subdomain]
Value: 76.76.21.21 (Vercel IP - check current IPs)
TTL: 3600
```

---

## 📝 Domain Configuration List

### 1. ARA Group Platform (Primary)

**Domains:**
- `aragroup.com.au` (Primary)
- `arapropertyservices.com.au`
- `araproperty.com`
- `aragroup.com`

**DNS Configuration:**
```
aragroup.com.au              → CNAME → cname.vercel-dns.com
www.aragroup.com.au          → CNAME → cname.vercel-dns.com
arapropertyservices.com.au   → CNAME → cname.vercel-dns.com
www.arapropertyservices.com.au → CNAME → cname.vercel-dns.com
araproperty.com              → CNAME → cname.vercel-dns.com
www.araproperty.com          → CNAME → cname.vercel-dns.com
aragroup.com                 → CNAME → cname.vercel-dns.com
www.aragroup.com             → CNAME → cname.vercel-dns.com
```

**Vercel Configuration:**
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add all domains listed above
3. Follow DNS verification instructions
4. Wait for SSL certificate provisioning (automatic)

---

### 2. ARA Fire & Security

**Domains:**
- `fire.aragroup.com.au`
- `arafireandsecurity.com`

**DNS Configuration:**
```
fire.aragroup.com.au         → CNAME → cname.vercel-dns.com
www.fire.aragroup.com.au     → CNAME → cname.vercel-dns.com
arafireandsecurity.com       → CNAME → cname.vercel-dns.com
www.arafireandsecurity.com   → CNAME → cname.vercel-dns.com
```

---

### 3. ARA Electrical

**Domains:**
- `electrical.aragroup.com.au`

**DNS Configuration:**
```
electrical.aragroup.com.au   → CNAME → cname.vercel-dns.com
www.electrical.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

### 4. ARA Building Services

**Domains:**
- `buildingservices.aragroup.com.au`

**DNS Configuration:**
```
buildingservices.aragroup.com.au → CNAME → cname.vercel-dns.com
www.buildingservices.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

### 5. ARA Mechanical Services

**Domains:**
- `mechanical.aragroup.com.au`

**DNS Configuration:**
```
mechanical.aragroup.com.au   → CNAME → cname.vercel-dns.com
www.mechanical.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

### 6. ARA Property Services

**Domains:**
- `propertyservices.aragroup.com.au`

**DNS Configuration:**
```
propertyservices.aragroup.com.au → CNAME → cname.vercel-dns.com
www.propertyservices.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

### 7. ARA Products

**Domains:**
- `manufacture.aragroup.com.au`

**DNS Configuration:**
```
manufacture.aragroup.com.au  → CNAME → cname.vercel-dns.com
www.manufacture.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

### 8. ARA Manufacturing

**Domains:**
- `manufacturing.aragroup.com.au` (if different from Products)

**DNS Configuration:**
```
manufacturing.aragroup.com.au → CNAME → cname.vercel-dns.com
www.manufacturing.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

### 9. ARA Marine

**Domains:**
- `aramarine.com.au`
- `aramarine.co.nz`

**DNS Configuration:**
```
aramarine.com.au             → CNAME → cname.vercel-dns.com
www.aramarine.com.au         → CNAME → cname.vercel-dns.com
aramarine.co.nz              → CNAME → cname.vercel-dns.com
www.aramarine.co.nz          → CNAME → cname.vercel-dns.com
```

---

### 10. ARA Security Solutions

**Domains:**
- `arasecuritysolutions.com.au`

**DNS Configuration:**
```
arasecuritysolutions.com.au  → CNAME → cname.vercel-dns.com
www.arasecuritysolutions.com.au → CNAME → cname.vercel-dns.com
```

---

### 11. ARA Indigenous Services

**Domains:**
- `indigenous.aragroup.com.au`

**DNS Configuration:**
```
indigenous.aragroup.com.au   → CNAME → cname.vercel-dns.com
www.indigenous.aragroup.com.au → CNAME → cname.vercel-dns.com
```

---

## ✅ Verification Steps

### 1. DNS Propagation Check

Use online tools to verify DNS propagation:
- https://dnschecker.org
- https://www.whatsmydns.net

### 2. SSL Certificate Verification

After DNS propagation:
1. Wait 5-10 minutes for Vercel to provision SSL
2. Check SSL status in Vercel Dashboard
3. Verify HTTPS access: `https://[domain]`

### 3. Domain Verification

Test each domain:
```bash
# Check DNS resolution
dig [domain]
nslookup [domain]

# Check HTTPS
curl -I https://[domain]

# Check SSL certificate
openssl s_client -connect [domain]:443 -servername [domain]
```

---

## 🔒 Security Considerations

### SSL/TLS
- Vercel automatically provisions SSL certificates
- Certificates auto-renew
- Supports TLS 1.2 and 1.3

### DNS Security
- Use DNSSEC if supported by your DNS provider
- Enable DNS over HTTPS (DoH) for clients
- Monitor DNS changes for unauthorized modifications

### Domain Security
- Enable domain lock at registrar
- Use two-factor authentication for DNS provider
- Monitor domain expiration dates
- Set up domain expiration alerts

---

## 📊 DNS Provider Instructions

### Common DNS Providers

#### Cloudflare
1. Add domain to Cloudflare
2. Update nameservers to Cloudflare's
3. Add CNAME records as specified above
4. Enable SSL/TLS: Full (strict)

#### AWS Route 53
1. Create hosted zone for domain
2. Update nameservers at registrar
3. Create CNAME records in Route 53
4. Enable DNSSEC signing

#### Google Domains / Squarespace
1. Go to DNS settings
2. Add CNAME records
3. Verify DNS propagation
4. Enable SSL (if available)

#### GoDaddy
1. Go to DNS Management
2. Add CNAME records
3. Save changes
4. Wait for propagation (up to 48 hours)

---

## 🚨 Troubleshooting

### DNS Not Resolving
- Check DNS records are correct
- Verify TTL settings
- Wait for DNS propagation (up to 48 hours)
- Clear DNS cache: `sudo dscacheutil -flushcache` (macOS)

### SSL Certificate Issues
- Verify DNS is pointing to Vercel
- Check domain verification in Vercel Dashboard
- Wait for certificate provisioning (5-10 minutes)
- Contact Vercel support if issues persist

### Domain Not Accessible
- Verify DNS records
- Check Vercel deployment status
- Verify domain is added in Vercel Dashboard
- Check firewall/security settings

---

## 📝 Checklist

### Pre-Deployment
- [ ] All domains registered
- [ ] DNS provider selected
- [ ] Vercel project created
- [ ] Environment variables configured

### DNS Configuration
- [ ] CNAME records added for all domains
- [ ] DNS propagation verified
- [ ] Nameservers updated (if needed)

### Vercel Configuration
- [ ] All domains added in Vercel Dashboard
- [ ] DNS verification completed
- [ ] SSL certificates provisioned
- [ ] Domain routing configured

### Post-Deployment
- [ ] All domains accessible via HTTPS
- [ ] SSL certificates valid
- [ ] DNS propagation complete
- [ ] Monitoring configured

---

**Last Updated:** 2025-01-27  
**Status:** Ready for Production  
**Maintained By:** ARA Group Platform Team


