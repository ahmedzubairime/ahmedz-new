import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix Drizzle empty string bug
  content = content.replace(/\.default\('\),/g, ".default(''),");
  content = content.replace(/\.default\('\)\./g, ".default('').");
  content = content.replace(/\.default\('\)\n/g, ".default('')\n");

  fs.writeFileSync(filePath, content);
}

const dbDir = path.join(process.cwd(), 'src', 'db', 'schema');
if (fs.existsSync(dbDir)) {
  const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.ts'));
  files.forEach(f => fixFile(path.join(dbDir, f)));
}

// Optionally fix drizzle-out for the user's sake
const drizzleOutDir = path.join(process.cwd(), 'drizzle-out');
if (fs.existsSync(drizzleOutDir)) {
  const files = fs.readdirSync(drizzleOutDir).filter(f => f.endsWith('.ts'));
  files.forEach(f => fixFile(path.join(drizzleOutDir, f)));
}

// Fix relations.ts specifically for usersInAuth reference
const relFile = path.join(dbDir, 'relations.ts');
if (fs.existsSync(relFile)) {
  let relContent = fs.readFileSync(relFile, 'utf-8');
  relContent = relContent.replace(/usersInAuth/g, 'users');
  fs.writeFileSync(relFile, relContent);
}

const dropRelFile = path.join(drizzleOutDir, 'relations.ts');
if (fs.existsSync(dropRelFile)) {
  let relContent = fs.readFileSync(dropRelFile, 'utf-8');
  relContent = relContent.replace(/usersInAuth/g, 'users');
  fs.writeFileSync(dropRelFile, relContent);
}

console.log('Fixed typescript syntax bugs and relation references.');
