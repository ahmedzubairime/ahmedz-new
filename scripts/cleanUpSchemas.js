const fs = require('fs');
const path = require('path');

const schemaDir = path.join(process.cwd(), 'src/db/schema');
const files = fs.readdirSync(schemaDir).filter(f => f.endsWith('.ts') && f !== 'relations.ts' && f !== 'index.ts');

const mediaPattern = /^export const media = pgTable\("media", \{(?:[\s\S]*?^\}\);$|[\s\S]*?^\}\), \(table\) => \[\n(?:.*?\n)*?\]\);$)/gm;

const mediaFoldersPattern = /^export const mediaFolders = pgTable\("media_folders", \{(?:[\s\S]*?^\}\);$|[\s\S]*?^\}\), \(table\) => \[\n(?:.*?\n)*?\]\);$)/gm;

for (const file of files) {
  const filePath = path.join(schemaDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Strip ALL `media` and `mediaFolders` tables from every file except media.ts
  if (file !== 'media.ts') {
    content = content.replace(/export const media = pgTable\("media"[\s\S]+?\]\);\n/g, '');
    content = content.replace(/export const mediaFolders = pgTable\("media_folders"[\s\S]+?\]\);\n/g, '');
    
    // Also cleanup broken imports injected directly above the duplicated blocks by splitSchema.mjs
    content = content.replace(/import \{.*?media.*?\} from "\.\/media";/g, '');
    content = content.replace(/import \{.*?accounts.*?\} from "\.\/core";/g, '');

    // Dynamically re-inject required imports if they are used!
    let imports = [];
    if (content.includes('accounts.id')) {
        if (file !== 'core.ts') imports.push(`import { accounts } from "./core";`);
    }
    if (content.includes('users.id')) {
        if (file !== 'auth.ts') imports.push(`import { users } from "./auth";`);
    }
    if (content.includes('mediaFolders.id') || content.includes('media.id')) {
        imports.push(`import { media, mediaFolders } from "./media";`);
    }
    // prepend imports
    if (imports.length > 0) {
      content = imports.join('\n') + '\n' + content;
    }
    
    fs.writeFileSync(filePath, content);
  } else {
    // For media.ts, it has EXACT duplicates of `media`. Let's just keep the first one.
    // It's easier if we just remove the second occurrence.
    const parts = content.split('export const media = pgTable("media",');
    if (parts.length > 2) {
      // It occurs twice. parts[0] is imports. parts[1] is the first table up to `);`. parts[2] is the extra stuff + second table.
      // Easiest is to regex replace keeping only first
      let pass = 0;
      content = content.replace(/export const media = pgTable\("media"[\s\S]+?\]\);\n/g, (match) => {
        pass++;
        if (pass === 1) return match;
        return '';
      });
    }
    // Also remove mid-file imports 
    content = content.replace(/import \{.*?accounts.*?\} from "\.\/core";/g, '');
    content = `import { accounts } from "./core";\n` + content;
    
    fs.writeFileSync(filePath, content);
  }
}

// Fix drizzle-out/relations.ts and src/db/schema/relations.ts duplicate 'users'
function fixRelations(relPath) {
  if (fs.existsSync(relPath)) {
    let content = fs.readFileSync(relPath, 'utf-8');
    // Change `import { users, users } from "./schema"` to `import { users } from "./schema"`
    // Or if there's `import { users } from "./schema"; import { users } from "./auth";`
    content = content.replace(/usersInAuth/g, 'users');
    content = content.replace(/import \{ (.*?)\users(.*?)\users(.*?) \} from/g, 'import { $1users$2$3 } from');
    // if duplicate identifier users, just dedup the import
    const importRegex = /import \{([^}]+)\} from "\.\/schema"/;
    content = content.replace(importRegex, (match, p1) => {
       const tokens = p1.split(',').map(s => s.trim()).filter(Boolean);
       const uniqueTokens = [...new Set(tokens)];
       return `import { ${uniqueTokens.join(', ')} } from "./schema"`;
    });
    fs.writeFileSync(relPath, content);
  }
}
fixRelations(path.join(schemaDir, 'relations.ts'));
// fix drizzle-out/schema.ts
const devOut = path.join(process.cwd(), 'drizzle-out', 'schema.ts');
if (fs.existsSync(devOut)) {
  let content = fs.readFileSync(devOut, 'utf-8');
  if (!content.includes('export const users =')) {
     content = `export const users = pgTable("users", { id: uuid("id").primaryKey() });\n` + content;
     fs.writeFileSync(devOut, content);
  }
}

// Fix seed.ts
const seedPath = path.join(process.cwd(), 'src', 'db', 'seed.ts');
if (fs.existsSync(seedPath)) {
  let content = fs.readFileSync(seedPath, 'utf-8');
  content = content.replace(/filename /g, 'filename: string ');
  content = content.replace(/readJsonFile\(filename\)/g, 'readJsonFile(filename: string)');
  content = content.replace(/dataList /g, 'dataList: any[] ');
  content = content.replace(/dataList =>/g, '(dataList: any[]) =>');
  content = content.replace(/item =>/g, '(item: any) =>');
  fs.writeFileSync(seedPath, content);
}

console.log("Cleanup complete!");
