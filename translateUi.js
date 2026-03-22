const fs = require('fs');
const path = require('path');

const cmptDir = path.join(__dirname, 'src', 'components', 'cms');
// Get only Grid files plus Forms
const files = fs.readdirSync(cmptDir).filter(f => f.endsWith('Grid.tsx') || f === 'HeroForm.tsx' || f === 'ContactInfoForm.tsx');

const dictionary = [
    // Buttons
    ['>Cancel<', '>{locale === "ar" ? "إلغاء" : "Cancel"}<'],
    ['>Create Feature<', '>{editingFeature ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة ميزة" : "Create Feature")}<'],
    ['>Create Partner<', '>{editingPartner ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة شريك" : "Create Partner")}<'],
    ['>Create Testimonial<', '>{editingTestimonial ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة مراجعة" : "Create Testimonial")}<'],
    ['>Create Folder<', '>{editingCategory ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة قسم" : "Create Folder")}<'],
    ['>Create Service<', '>{editingService ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إضافة خدمة" : "Create Service")}<'],
    ['>Save Network\n<', '>{isPending ? (locale === "ar" ? "جاري الحفظ..." : "Processing...") : locale === "ar" ? "حفظ الرابط" : "Save Network"}\n<'],
    ['>Save Branch\n<', '>{isPending ? (locale === "ar" ? "جاري الحفظ..." : "Processing...") : locale === "ar" ? "حفظ الفرع" : "Save Branch"}\n<'],

    // Modals & Media
    ['>Replace<', '>{locale === "ar" ? "استبدال" : "Replace"}<'],
    ['>Remove<', '>{locale === "ar" ? "إزالة" : "Remove"}<'],
    ['>Change<', '>{locale === "ar" ? "تغيير" : "Change"}<'],
    ['>Replace Image<', '>{locale === "ar" ? "استبدال الصورة" : "Replace Image"}<'],
    ['>Upload SVG or PNG logo<', '>{locale === "ar" ? "رفع شعار بصيغة SVG أو PNG" : "Upload SVG or PNG logo"}<'],
    ['>Select amazing cover photo<', '>{locale === "ar" ? "اختر صورة غلاف جذابة" : "Select amazing cover photo"}<'],
    ['>Partner Logo<', '>{locale === "ar" ? "شعار الشريك" : "Partner Logo"}<'],
    ['>Author Avatar<', '>{locale === "ar" ? "الصورة الشخصية" : "Author Avatar"}<'],
    ['>Service Cover Image<', '>{locale === "ar" ? "صورة الغلاف للخدمة" : "Service Cover Image"}<'],

    // Form Labels
    ['>العنوان بالعربية<', '>{locale === "ar" ? "العنوان (بالعربية)" : "Arabic Title"}<'],
    ['>English Title<', '>{locale === "ar" ? "العنوان (بالإنجليزية)" : "English Title"}<'],
    ['>الوصف بالعربية<', '>{locale === "ar" ? "الوصف (بالعربية)" : "Arabic Description"}<'],
    ['>English Description<', '>{locale === "ar" ? "الوصف (بالإنجليزية)" : "English Description"}<'],
    ['>الاسم بالعربية<', '>{locale === "ar" ? "الاسم (بالعربية)" : "Arabic Name"}<'],
    ['>English Name<', '>{locale === "ar" ? "الاسم (بالإنجليزية)" : "English Name"}<'],
    ['>المنصب بالعربية<', '>{locale === "ar" ? "المنصب (بالعربية)" : "Arabic Role"}<'],
    ['>English Role (Company)<', '>{locale === "ar" ? "المنصب (بالإنجليزية)" : "English Role (Company)"}<'],
    ['>نص المراجعة بالعربية<', '>{locale === "ar" ? "نص المراجعة (بالعربية)" : "Arabic Testimonial"}<'],
    ['>English Testimonial<', '>{locale === "ar" ? "نص المراجعة (بالإنجليزية)" : "English Testimonial"}<'],
    ['>اسم المكتب بالعربية<', '>{locale === "ar" ? "اسم المكتب (بالعربية)" : "Arabic Branch Name"}<'],
    ['>العنوان الفيزيائي بالعربية<', '>{locale === "ar" ? "عنوان المقر (بالعربية)" : "Arabic Physical Address"}<'],
    ['>English Physical Address<', '>{locale === "ar" ? "عنوان المقر (بالإنجليزية)" : "English Physical Address"}<'],

    // Other inputs fields
    ['>Website URL<', '>{locale === "ar" ? "رابط الموقع الإلكتروني" : "Website URL"}<'],
    ['>Icon Name<', '>{locale === "ar" ? "اسم الأيقونة (Lucide)" : "Icon Name"}<'],
    ['>URL Slug (Unique identifier)<', '>{locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug (Unique identifier)"}<'],
    ['>URL Slug<', '>{locale === "ar" ? "الرابط اللطيف (Slug)" : "URL Slug"}<'],
    ['>Category Mapping<', '>{locale === "ar" ? "التصنيف التابع" : "Category Mapping"}<'],
    ['>Platform Network<', '>{locale === "ar" ? "منصة التواصل الاجتماعي" : "Platform Network"}<'],
    ['>Profile URL<', '>{locale === "ar" ? "رابط الحساب" : "Profile URL"}<'],
    ['>Contact Phone<', '>{locale === "ar" ? "رقم الهاتف" : "Contact Phone"}<'],
    ['>Contact Email<', '>{locale === "ar" ? "البريد الإلكتروني" : "Contact Email"}<'],
    ['>Latitude<', '>{locale === "ar" ? "خط العرض (Latitude)" : "Latitude"}<'],
    ['>Longitude<', '>{locale === "ar" ? "خط الطول (Longitude)" : "Longitude"}<'],
    ['>Map Coordinates (Optional)<', '>{locale === "ar" ? "إحداثيات الخريطة (اختياري)" : "Map Coordinates (Optional)"}<'],

    // Toggles
    ['>Visible on Site<', '>{locale === "ar" ? "مرئي بالموقع" : "Visible on Site"}<'],
    ['>Active Listing<', '>{locale === "ar" ? "مفعل بالموقع" : "Active Listing"}<'],
    ['>Active Location<', '>{locale === "ar" ? "مقر نشط" : "Active Location"}<'],
    ['>Active<', '>{locale === "ar" ? "نشط" : "Active"}<'],
    ['>-- No Category --<', '>{locale === "ar" ? "-- بدون تصنيف --" : "-- No Category --"}<'],

    // Empty states
    ['>Upload SVG or PNG logo<', '>{locale === "ar" ? "رفع شعار بصيغة SVG أو PNG" : "Upload SVG or PNG logo"}<'],
    ['>Select amazing cover photo<', '>{locale === "ar" ? "اختر صورة غلاف جذابة" : "Select amazing cover photo"}<']
];

files.forEach(file => {
    let content = fs.readFileSync(path.join(cmptDir, file), 'utf-8');

    // Iterate and replace safely
    for (const [key, val] of dictionary) {
        content = content.replace(key, val);
        // Because some buttons might have \n instead of >text< directly, let's use global replace smartly
        // Actually using simple replace on exactly >Cancel< is perfect. But we need a global replace.
        content = content.split(key).join(val);
    }

    fs.writeFileSync(path.join(cmptDir, file), content);
});

console.log('Translated successfully!');
