import fs from 'fs';
import path from 'path';
const names = new Set();
function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) walk(file);
    else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.matchAll(/<SidebarIcon[^>]*?name=["']([^"']+)["']/g);
      for (const match of matches) {
        names.add(match[1]);
      }
    }
  });
}
walk('./src');
fs.writeFileSync('icon_names.txt', Array.from(names).join('\n'));
