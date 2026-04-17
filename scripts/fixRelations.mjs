import fs from 'fs';
import path from 'path';

const inPath = path.join(process.cwd(), 'drizzle-out', 'relations.ts');
if (fs.existsSync(inPath)) {
  let source = fs.readFileSync(inPath, 'utf-8');
  // Replace import { ... } from "./schema" with from "./index"
  source = source.replace(/from\s+"(?:[^"]+schema)"/g, 'from "./index"');
  
  // also add authSchema stub users so the relation doesn't complain
  source = source.replace('import { relations } from "drizzle-orm/relations";', 'import { relations } from "drizzle-orm/relations";\nimport { users } from "./auth";');

  fs.writeFileSync(path.join(process.cwd(), 'src', 'db', 'schema', 'relations.ts'), source);
  
  // Append relations export to index
  const idxPath = path.join(process.cwd(), 'src', 'db', 'schema', 'index.ts');
  let idx = fs.readFileSync(idxPath, 'utf-8');
  idx += 'export * from "./relations";\n';
  fs.writeFileSync(idxPath, idx);
  
  console.log('Fixed relations.ts!');
}
