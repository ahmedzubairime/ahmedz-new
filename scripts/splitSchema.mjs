import fs from 'fs';
import path from 'path';

const source = fs.readFileSync(path.join(process.cwd(), 'drizzle-out', 'schema.ts'), 'utf-8');

// Define table domains
const domains = {
  core: ['accounts', 'roles', 'accountRoles', 'auditLogs', 'rolePagePermissions'],
  cms: [
    'pages', 'pageGroups', 'sections', 'postCategories', 'posts', 'cmsPages', 
    'homepageHero', 'homepageFeatures', 'homepagePartners', 'homepageTestimonials', 
    'homepageSeo', 'homepageStats', 'homepageCta', 'homepageFaq', 
    'aboutHero', 'aboutCompany', 'aboutMission', 'aboutValues', 'aboutTimeline', 
    'aboutTeamMembers', 'aboutStats', 'aboutCertificates', 'aboutSeo', 
    'contactInfo', 'socialLinks', 'newsletterMembers', 'newsletterSubscribers', 'newsletterCampaigns'
  ],
  store: [
    'storeCategories', 'storeProducts', 'storeProductVariants', 'storeProductReviews', 
    'storeOrderStatuses', 'storeOrders', 'storeOrderItems', 'storeOrderReturns', 
    'storeCoupons', 'storeCampaigns', 'storeCampaignProducts', 'storeOffers', 'branches'
  ],
  pms: [
    'pmsProjects', 'pmsProjectMembers', 'pmsTaskStatuses', 'pmsLabels', 'pmsTasks', 
    'pmsTaskLabels', 'pmsTaskComments', 'pmsTaskAttachments', 'pmsTimeEntries', 
    'pmsTeams', 'pmsTeamMembers', 'pmsProjectTeams', 'pmsActivityLogs'
  ],
  services: [
    'servicesCategories', 'services', 'servicesHero', 'servicesSeo', 'servicesCta', 
    'servicesProcess', 'servicesPricing'
  ],
  media: ['mediaFolders', 'media'],
  auth: ['users']
};

const mapTableToDomain = (tableName) => {
  for (const [domain, tables] of Object.entries(domains)) {
    if (tables.includes(tableName)) return domain;
  }
  return 'misc'; // fallback
};

// Regex to capture "export const tableName = pgTable(....);" blocks
const tableBlocks = [];
const tableRegex = /export const (\w+) = pgTable(.*?);\n/gs;
let match;
while ((match = tableRegex.exec(source)) !== null) {
  tableBlocks.push({ name: match[1], body: match[0], domain: mapTableToDomain(match[1]) });
}

// Ensure src/db/schema exists
const outDir = path.join(process.cwd(), 'src', 'db', 'schema');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate auth user schema stub separately since Drizzle omitted it
const authStub = `import { pgSchema, uuid } from "drizzle-orm/pg-core";\nexport const authSchema = pgSchema("auth");\nexport const users = authSchema.table("users", { id: uuid("id").primaryKey() });\n`;
tableBlocks.push({ name: 'users', body: '', domain: 'auth' });

// Get standard imports from original file
const standardImportsMatch = source.match(/import {.*?}.*?;/gs);
const standardImports = standardImportsMatch ? standardImportsMatch.join('\n') : '';

const domainFiles = {};
tableBlocks.forEach(tb => {
  if (!domainFiles[tb.domain]) domainFiles[tb.domain] = { names: [], blocks: [] };
  domainFiles[tb.domain].names.push(tb.name);
  if (tb.body) domainFiles[tb.domain].blocks.push(tb.body);
});

// Create index.ts
let indexContent = '';
Object.keys(domainFiles).forEach(domain => {
  indexContent += `export * from "./${domain}";\n`;
});
fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);

// Add users manually to auth if body is empty
if (domainFiles['auth']) {
    domainFiles['auth'].blocks = [authStub];
}

for (const [domain, data] of Object.entries(domainFiles)) {
  const referencedOtherDomains = new Set();
  const fileImports = [];
  
  // Find external references in the blocks 
  const bodyText = data.blocks.join('\n');
  Object.entries(domainFiles).forEach(([otherDomain, otherData]) => {
    if (otherDomain === domain) return;
    const exportsToImport = [];
    otherData.names.forEach(name => {
      // Check if this table name is used as a foreign key reference or variable 
      // (very loose matching to catch foreignColumns: [users.id])
      const regex = new RegExp(`\\b${name}\\.`, 'g');
      if (regex.test(bodyText) || bodyText.includes(`[${name}.`)) {
        exportsToImport.push(name);
      }
    });
    if (exportsToImport.length > 0) {
      fileImports.push(`import { ${exportsToImport.join(', ')} } from "./${otherDomain}";`);
    }
  });

  const content = `${standardImports}\n\n${fileImports.join('\n')}\n\n${bodyText}`;
  fs.writeFileSync(path.join(outDir, `${domain}.ts`), content);
}

console.log('Successfully split schemas into domain files in src/db/schema!');
