const fs = require('fs');
const path = require('path');
const cmptDir = path.join(__dirname, 'src', 'components', 'cms');
const files = fs.readdirSync(cmptDir).filter(f => f.endsWith('Grid.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(cmptDir, file), 'utf-8');

    // Create Feature
    content = content.replace(/\{editingFeature \? "Save Changes" : "Create Feature"\}/g, '{editingFeature ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة ميزة" : "Create Feature")}');
    // Create Partner
    content = content.replace(/\{editingPartner \? "Save Changes" : "Create Partner"\}/g, '{editingPartner ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة شريك" : "Create Partner")}');
    // Create Testimonial
    content = content.replace(/\{editingTestimonial \? "Save Changes" : "Create Testimonial"\}/g, '{editingTestimonial ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة مراجعة" : "Create Testimonial")}');
    // Create Folder
    content = content.replace(/\{editingCategory \? "Save Changes" : "Create Folder"\}/g, '{editingCategory ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة قسم" : "Create Folder")}');
    // Create Service
    content = content.replace(/\{editingService \? "Save Changes" : "Create Service"\}/g, '{editingService ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة خدمة" : "Create Service")}');

    // Cancel buttons are often bare inside tags: \n            Cancel\n        
    content = content.replace(/>\s*Cancel\s*</g, '>{locale === "ar" ? "إلغاء" : "Cancel"}<');

    // Cancel could also be inside quotes if passed as props or strings
    // but in our grids it's explicitly rendered as text

    // Icon Name
    content = content.replace(/Icon Name/g, '{locale === "ar" ? "اسم الأيقونة" : "Icon Name"}');

    fs.writeFileSync(path.join(cmptDir, file), content);
});
console.log('Ternary strings updated!');
