# ARA Group Organization Branding - Verified Colors

**Last Updated**: November 14, 2025
**Status**: 7 of 11 organizations have verified brand colors from official logos

## Verified Brand Colors (Extracted from Official Logos)

### 1. ARA Group Platform ✅
- **Primary Color**: `#AFCC37` (Lime Green)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-logo.png` ✅
- **Subdomain**: `ara.aliaslabs.ai`
- **Source**: Main ARA Group logo
- **Status**: VERIFIED

### 2. ARA Property Services ✅
- **Primary Color**: `#afcc37` (Lime Green - same as main ARA)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-property-services.svg` ✅
- **Subdomain**: `propertyservices.ara.aliaslabs.ai`
- **Source**: Property-Services-Full-Colour-Logo.svg
- **Status**: VERIFIED from SVG

### 3. ARA Electrical ✅
- **Primary Color**: `#ecaa20` (Orange/Gold)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-electrical.svg` ✅
- **Subdomain**: `electrical.ara.aliaslabs.ai`
- **Source**: ARA-Electrical-Full-Colour-Logo.svg (extracted via grep)
- **Status**: VERIFIED from SVG

### 4. ARA Fire & Security ✅
- **Primary Color**: `#64b1bb` (Teal/Turquoise)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-fire-security.svg` ✅
- **Subdomain**: `fire.ara.aliaslabs.ai`
- **Source**: ARA-Fire-Security-Logo-FullColour.svg (extracted via grep)
- **Status**: VERIFIED from SVG
- **Note**: NOT orange-red (#DC143C from UI) - real brand is teal!

### 5. ARA Mechanical Services ✅
- **Primary Color**: `#71a087` (Sage Green)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-mechanical.svg` ✅
- **Subdomain**: `mechanical.ara.aliaslabs.ai`
- **Source**: ARA-Mechanical-Full-Colour-Logo.svg (extracted via grep)
- **Status**: VERIFIED from SVG
- **Note**: NOT royal blue (#4169E1 from UI) - real brand is sage green!

### 6. ARA Products ✅
- **Primary Color**: `#d2466c` (Rose/Pink)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-products.svg` ✅
- **Subdomain**: `products.ara.aliaslabs.ai`
- **Source**: ARA-Products-Full-Colour-Logo.svg (extracted via grep)
- **Status**: VERIFIED from SVG
- **Note**: NOT purple (#9B59B6 from UI) - real brand is rose/pink!

### 7. ARA Indigenous Services ✅
- **Primary Color**: `#E05D44` (Coral Red)
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-indigenous-services.png` ✅
- **Subdomain**: `indigenous.ara.aliaslabs.ai`
- **Source**: ARA-IS-Full-Colour-Light-Logo.png + Auth08.tsx UI code
- **Status**: VERIFIED from PNG logo visual inspection
- **Note**: NOT chocolate (#D2691E) - real brand is coral red!

---

## Placeholder Organizations (Missing Official Logos)

### 8. ARA Building Services ⚠️
- **Primary Color**: `#4169E1` (Royal Blue) - **TEMPORARY**
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-logo.png` (using main ARA placeholder)
- **Subdomain**: `buildingservices.ara.aliaslabs.ai`
- **Status**: ⚠️ NEEDS REAL LOGO AND BRAND COLOR

### 9. ARA Manufacturing ⚠️
- **Primary Color**: `#708090` (Slate Gray) - **TEMPORARY**
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-logo.png` (using main ARA placeholder)
- **Subdomain**: `manufacturing.ara.aliaslabs.ai`
- **Status**: ⚠️ NEEDS REAL LOGO AND BRAND COLOR

### 10. ARA Marine ⚠️
- **Primary Color**: `#1E90FF` (Dodger Blue) - **TEMPORARY**
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-logo.png` (using main ARA placeholder)
- **Subdomain**: `marine.ara.aliaslabs.ai`
- **Status**: ⚠️ NEEDS REAL LOGO AND BRAND COLOR

### 11. ARA Security Solutions ⚠️
- **Primary Color**: `#8B0000` (Dark Red) - **TEMPORARY**
- **Secondary Color**: `#435464` (Dark Gray)
- **Logo**: `/logos/ara-logo.png` (using main ARA placeholder)
- **Subdomain**: `security.ara.aliaslabs.ai`
- **Status**: ⚠️ NEEDS REAL LOGO AND BRAND COLOR

---

## Color Extraction Methodology

### Verified Colors (SVG Logos)
Colors were extracted using grep pattern matching from official SVG logo files:
```bash
grep -o 'fill="#[0-9A-Fa-f]\{6\}"' logo.svg | head -n1
```

Files analyzed:
- `/Users/alias/Clients/ARAGroup/media/ara-departments/ara-electrical/ARA-Electrical-Full-Colour-Logo.svg`
- `/Users/alias/Clients/ARAGroup/media/ara-departments/ara-fireandsecurity/ARA-Fire-Security-Logo-FullColour.svg`
- `/Users/alias/Clients/ARAGroup/media/ara-departments/ara-mechanical/ARA-Mechanical-Full-Colour-Logo.svg`
- `/Users/alias/Clients/ARAGroup/media/ara-departments/ara-property-services/Property-Services-Full-Colour-Logo.svg`
- `/Users/alias/Clients/ARAGroup/media/ara-departments/ara-products/ARA-Products-Full-Colour-Logo.svg`

### Verified Colors (PNG Logo)
- Indigenous Services: Visual inspection of PNG logo + verification against Auth08.tsx UI code (#E05D44)

### Secondary Color Source
The dark gray color `#435464` (or `#3D4D61` - very similar) appears consistently across:
- ara-departments-login app UI gradients
- Auth08.tsx component styling
- Multiple component files as secondary/accent color

---

## Important Notes

### ⚠️ UI Button Colors vs. Brand Colors
**WARNING**: The Auth08.tsx component uses different colors for UI buttons that DO NOT match the official brand colors:

| Organization | UI Button Color | Real Brand Color | Match? |
|-------------|-----------------|------------------|--------|
| Property Services | #A4D321 (lime) | #afcc37 (lime) | ✅ Close |
| Indigenous Services | #E05D44 (coral red) | #E05D44 (coral red) | ✅ Match |
| Electrical | #FFA500 (orange) | #ecaa20 (orange/gold) | ❌ Different |
| Fire & Security | #DC143C (crimson) | #64b1bb (teal) | ❌ VERY Different! |
| Mechanical | #4169E1 (royal blue) | #71a087 (sage green) | ❌ VERY Different! |
| Products | #9B59B6 (purple) | #d2466c (rose/pink) | ❌ Different |

**Use the Brand Colors (right column)** for official branding, not the UI button colors!

---

## Implementation

All verified colors are configured in:
```
/Users/alias/Clients/ARAGroup-Platform/packages/database/convex/organizationBranding.ts
```

See `ARA_ORG_BRANDING` constant for complete configuration.

---

## Next Steps

1. **Obtain missing logos** for:
   - Building Services
   - Manufacturing
   - Marine
   - Security Solutions

2. **Extract brand colors** from those logos when available

3. **Update organizationBranding.ts** with real colors once obtained

4. **Copy logo files** to `/apps/app/public/logos/` directory

---

**Generated**: November 14, 2025
**Platform**: ARA Group Platform (next-forge 5.2.1)
**Database**: Convex 1.29.0
**Author**: Claude Code Analysis
