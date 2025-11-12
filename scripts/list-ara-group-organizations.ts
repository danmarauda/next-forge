#!/usr/bin/env tsx

/**
 * ARA Group Platform - List All Organizations
 * 
 * Lists all ARA Group organizations based on research.
 */

// ARA Group Organizations (All Equal Status)
// Using ara.aliaslabs.ai as main domain with subdomains for demo
const ARA_GROUP_ORGANIZATIONS = [
  {
    name: "ARA Group Platform",
    type: "Primary Platform",
    demoDomain: "ara.aliaslabs.ai",
    productionDomains: [
      "aragroup.com.au",
      "arapropertyservices.com.au",
      "araproperty.com",
      "aragroup.com",
    ],
    description: "Main platform organization for ARA Group Limited",
  },
  {
    name: "ARA Fire & Security",
    type: "Division",
    demoDomain: "fire.ara.aliaslabs.ai",
    productionDomains: ["fire.aragroup.com.au", "arafireandsecurity.com"],
    description: "Fire protection, security, and marine safety services",
    history: "Foundations date back to 1993",
  },
  {
    name: "ARA Electrical",
    type: "Division",
    demoDomain: "electrical.ara.aliaslabs.ai",
    productionDomains: ["electrical.aragroup.com.au"],
    description: "Industrial electrical installation and service",
  },
  {
    name: "ARA Building Services",
    type: "Division",
    demoDomain: "buildingservices.ara.aliaslabs.ai",
    productionDomains: ["buildingservices.aragroup.com.au"],
    description: "Building maintenance and repair services",
  },
  {
    name: "ARA Mechanical Services",
    type: "Sub-Division",
    parent: "ARA Building Services",
    demoDomain: "mechanical.ara.aliaslabs.ai",
    productionDomains: ["mechanical.aragroup.com.au"],
    description: "HVAC and mechanical services",
    note: "Part of Building Services but operates as standalone brand",
  },
  {
    name: "ARA Property Services",
    type: "Sub-Division",
    parent: "ARA Building Services",
    demoDomain: "propertyservices.ara.aliaslabs.ai",
    productionDomains: ["propertyservices.aragroup.com.au"],
    description: "Cleaning and property maintenance services",
    history: "Acquired CMC Property Services in 2017",
    location: "Camberwell, Victoria",
  },
  {
    name: "ARA Products",
    type: "Division",
    demoDomain: "products.ara.aliaslabs.ai",
    productionDomains: ["manufacture.aragroup.com.au"],
    description: "Product distribution of electronic security products",
    services: ["Product Distribution"],
  },
  {
    name: "ARA Manufacturing",
    type: "Division",
    demoDomain: "manufacturing.ara.aliaslabs.ai",
    productionDomains: ["manufacture.aragroup.com.au"],
    description: "Manufacturing of high-security products and commercial doors",
    services: ["Manufacturing"],
    note: "Part of Products capability area but operates as standalone brand",
  },
  {
    name: "ARA Marine",
    type: "Division",
    demoDomain: "marine.ara.aliaslabs.ai",
    productionDomains: ["aramarine.com.au", "aramarine.co.nz"],
    description: "Specialty marine safety services and technical services",
    established: "2021",
    note: "Formed when ARA Group acquired two well-known companies",
  },
  {
    name: "ARA Security Solutions",
    type: "Division",
    demoDomain: "security.ara.aliaslabs.ai",
    productionDomains: ["arasecuritysolutions.com.au"],
    description: "Security solutions",
  },
  {
    name: "ARA Indigenous Services",
    type: "Partnership",
    demoDomain: "indigenous.ara.aliaslabs.ai",
    productionDomains: ["indigenous.aragroup.com.au"],
    description: "Majority Indigenous-owned business partnership",
    established: "2017",
    managingDirector: "Michael O'Loughlin",
    note: "Acquired 49% of CMC Indigenous Services",
  },
];

function main() {
  console.log("🏢 ARA Group Platform - Complete Organizations List\n");
  console.log("=".repeat(80));
  console.log(`Total Organizations: ${ARA_GROUP_ORGANIZATIONS.length}`);
  console.log("Structure: All organizations treated equally (no hierarchy)\n");
  console.log("=".repeat(80));

  ARA_GROUP_ORGANIZATIONS.forEach((org, index) => {
    console.log(`\n${index + 1}. ${org.name}`);
    console.log(`   Type: ${org.type}`);
    if (org.parent) {
      console.log(`   Parent: ${org.parent} (but equal status)`);
    }
    console.log(`   Demo Domain: ${org.demoDomain}`);
    if (org.productionDomains && org.productionDomains.length > 0) {
      console.log(`   Production Domains: ${org.productionDomains.join(", ")} (future)`);
    }
    console.log(`   Description: ${org.description}`);
    if (org.history) {
      console.log(`   History: ${org.history}`);
    }
    if (org.location) {
      console.log(`   Location: ${org.location}`);
    }
    if (org.established) {
      console.log(`   Established: ${org.established}`);
    }
    if (org.managingDirector) {
      console.log(`   Managing Director: ${org.managingDirector}`);
    }
    if (org.services) {
      console.log(`   Services: ${org.services.join(", ")}`);
    }
    if (org.note) {
      console.log(`   Note: ${org.note}`);
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log("📊 Summary");
  console.log("=".repeat(80));
  console.log(`\nTotal Organizations: ${ARA_GROUP_ORGANIZATIONS.length}`);
  console.log(`Primary: 1 (ARA Group Platform)`);
  console.log(`Divisions: 6`);
  console.log(`Sub-Divisions: 2 (but treated as equal)`);
  console.log(`Partnerships: 1 (ARA Indigenous Services)`);

  console.log("\n🌐 Domain Summary:");
  console.log(`   Demo Domain Base: ara.aliaslabs.ai`);
  console.log(`   Total Demo Subdomains: ${ARA_GROUP_ORGANIZATIONS.length}`);
  console.log(`\n   Demo Domains:`);
  ARA_GROUP_ORGANIZATIONS.forEach((org) => {
    console.log(`   - ${org.demoDomain}`);
  });
  console.log(`\n   Production Domains (future):`);
  const productionDomains = ARA_GROUP_ORGANIZATIONS.flatMap((org) => 
    org.productionDomains || []
  );
  productionDomains.forEach((domain) => {
    console.log(`   - ${domain}`);
  });

  console.log("\n👑 Super Admin Access:");
  console.log("   All Super Admins have access to all organizations:");
  console.log("   - Ed Federman (ARA Group Super Admin)");
  console.log("   - Mark Brady (ALIAS Super Admin)");
  console.log("   - Dan Humphreys (ALIAS Super Admin)");

  console.log("\n📝 WorkOS Configuration:");
  console.log("   - All organizations should be created as separate WorkOS organizations");
  console.log("   - All have equal permissions and access");
  console.log("   - No parent-child hierarchy");
  console.log("   - Super Admins have access to all");
  console.log("\n");
}

main();

