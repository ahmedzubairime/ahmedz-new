const fs = require('fs');
const path = require('path');
const cmptDir = path.join(__dirname, 'src', 'components', 'cms');
const files = fs.readdirSync(cmptDir).filter(f => f.endsWith('Grid.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(cmptDir, file), 'utf-8');

    // Replace the broken ternary: "{locale === "ar" ? "اسم الأيقونة" : "Icon Name"}"
    content = content.replace(/"\{locale === \\"ar\\" \? \\"اسم الأيقونة\\" : \\"Icon Name\\"\}"/g, '"Icon Name"');

    content = content.split('"{locale === "ar" ? "اسم الأيقونة" : "Icon Name"}"').join('"Icon Name"');

    fs.writeFileSync(path.join(cmptDir, file), content);
});
console.log('Fixed syntax!');
