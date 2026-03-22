const fs = require('fs');
const path = require('path');

const cmptDir = path.join(__dirname, 'src', 'components', 'cms');
const files = fs.readdirSync(cmptDir).filter(f => f.endsWith('Grid.tsx') || f === 'HeroForm.tsx' || f === 'ContactInfoForm.tsx');

files.forEach(file => {
    let content = fs.readFileSync(path.join(cmptDir, file), 'utf-8');

    // Replace standalone texts inside buttons or specific lines
    // The first previous replace was too fragile. We use robust /g regex matching across whitespace inside tags.
    content = content.replace(/>\s*Cancel\s*</g, '>{locale === "ar" ? "إلغاء" : "Cancel"}<');
    content = content.replace(/>\s*Create Feature\s*</g, '>{editingFeature ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة ميزة" : "Create Feature")}<');
    content = content.replace(/>\s*Create Partner\s*</g, '>{editingPartner ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة شريك" : "Create Partner")}<');
    content = content.replace(/>\s*Create Testimonial\s*</g, '>{editingTestimonial ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة مراجعة" : "Create Testimonial")}<');
    content = content.replace(/>\s*Create Folder\s*</g, '>{editingCategory ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة قسم" : "Create Folder")}<');
    content = content.replace(/>\s*Create Service\s*</g, '>{editingService ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة خدمة" : "Create Service")}<');

    content = content.replace(/>\s*English Description\s*</g, '>{locale === "ar" ? "الوصف (بالإنجليزية)" : "English Description"}<');
    content = content.replace(/>\s*الوصف بالعربية\s*</g, '>{locale === "ar" ? "الوصف (بالعربية)" : "Arabic Description"}<');

    fs.writeFileSync(path.join(cmptDir, file), content);
});

console.log('Translated successfully buttons!');
