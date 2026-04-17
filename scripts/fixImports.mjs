import fs from 'fs';
import path from 'path';

const schemaDir = path.join(process.cwd(), 'src/db/schema');
const files = fs.readdirSync(schemaDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(schemaDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix auth.ts duplicate uuid from pg-core
  if (file === 'auth.ts') {
    content = content.replace(/import \{ uuid, (\w+) \} from "drizzle-orm\/pg-core";\nimport \{ uuid \} from "drizzle-orm\/pg-core";/, 'import { uuid, $1 } from "drizzle-orm/pg-core";');
  }

  // Deduplicate all standard imports
  // E.g. we might have: import { accounts } from "./core";
  // And lower down: import { accounts } from "./core";
  // We can just gather them all and place them uniquely
  
  const lines = content.split('\n');
  const uniqueImports = new Set();
  const rest = [];
  
  // also track internal exports like 'export const accounts' so we don't import them
  const exports = new Set();
  for (const line of lines) {
    if (line.startsWith('export const ')) {
      const match = line.match(/^export const (\w+) =/);
      if (match) exports.add(match[1]);
    }
  }

  for (const line of lines) {
    if (line.startsWith('import ')) {
       // if it's identical down to the spacing, we can just use Set
       uniqueImports.add(line);
    } else {
       rest.push(line);
    }
  }
  
  // Actually, some imports might be `import { users }` and another `import { users }`. 
  // The simple `Set` deduplicates exact identical lines.
  // We also have to remove imports that conflict with local exports
  // E.g. if we export `accounts`, we should NOT import `accounts`.
  let finalImports = [];
  for (let imp of uniqueImports) {
     let isConflict = false;
     for (const exp of exports) {
        // e.g. import { accounts } from "./core";
        if (imp.includes(`{ ${exp} }`) || imp.includes(`{${exp}}`) || imp.includes(` ${exp},`) || imp.includes(`, ${exp} `)) {
           isConflict = true;
        }
     }
     if (!isConflict) finalImports.push(imp);
  }

  // For relations.ts we might have `import { users, users } from "./schema"`
  if (file === 'relations.ts') {
    finalImports = finalImports.map(imp => {
      if (imp.includes('from "./schema"')) {
        const match = imp.match(/import \{([^}]+)\} from "\.\/schema"/);
        if (match) {
          const tokens = match[1].split(',').map(s => s.trim()).filter(Boolean);
          const uniqueTokens = [...new Set(tokens)];
          return `import { ${uniqueTokens.join(', ')} } from "./schema";`;
        }
      }
      return imp;
    });
  }

  fs.writeFileSync(filePath, finalImports.join('\n') + '\n' + rest.join('\n'));
}

// Fix seed.ts
const seedPath = path.join(process.cwd(), 'src', 'db', 'seed.ts');
if (fs.existsSync(seedPath)) {
  let content = fs.readFileSync(seedPath, 'utf-8');
  content = content.replace(/const mapDates = \(dataList\) => dataList\.map\(\(item: any\) => \{/g, 'const mapDates = (dataList: any[]) => dataList.map((item: any) => {');
  fs.writeFileSync(seedPath, content);
}

console.log("Fix imports completed!");
