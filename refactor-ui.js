const fs = require('fs');
const path = require('path');

const cmptDir = path.join(__dirname, 'src', 'components', 'cms');
const files = fs.readdirSync(cmptDir).filter(f => f.endsWith('Grid.tsx'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(cmptDir, file), 'utf-8');

    // ============== MODAL REFACTOR ==============
    // 1. Replace the wrapper Flex layout from justify-end to items-center justify-center p-4
    content = content.replace(
        /className="fixed inset-0 z-50 flex justify-end"/g,
        'className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"'
    );

    // 2. Replace Drawer Panel styling with Centered Modal styling
    // E.g.: relative w-full max-w-xl h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden border-l border-zinc-200 dark:border-zinc-800
    content = content.replace(
        /className="relative w-full max-w-(?:xl|sm) h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300(?: overflow-hidden)? border-l border-zinc-200 dark:border-zinc-800"/g,
        'className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col rounded-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800"'
    );

    // ============== BILINGUAL FIELDS REFACTOR ==============
    // Here we use regex to detect the paired <div className="grid grid-cols-2 gap-4"> containing English and Arabic inputs.
    // We will run a loop or sophisticated replace for ALL grid-cols-2 that have bilingual inputs.

    // The structure is roughly:
    // <div className="grid grid-cols-2 gap-4">
    //     <div className="space-y-2">...English Name...<input dir="ltr"... /></div>
    //     <div className="space-y-2">...الاسم بالعربية...<input dir="rtl"... /></div>
    // </div>

    // Let's do a more generic replace for any grid-cols-2 that contains dir="ltr" and dir="rtl" inputs.
    // We'll replace it with a single grouped container that stacks them.
    const regex = /<div className="grid grid-cols-2 gap-4">[\s\S]*?<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<input(.*?)dir="ltr"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>[\s\S]*?<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<input(.*?)dir="rtl"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;

    content = content.replace(regex, (match, enLabel, in1, in2, valEn, in3, onChEn, in4, classEn, arLabel, ar1, ar2, valAr, ar3, onChAr, ar4, classAr) => {
        return `
                                {/* Bilingual Input Group */}
                                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${arLabel}</label>
                                            <span className="text-[10px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2 py-0.5 rounded tracking-widest">AR</span>
                                        </div>
                                        <input
                                            dir="rtl"
                                            value={${valAr}}
                                            onChange={${onChAr}}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-right"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${enLabel}</label>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded tracking-widest">EN</span>
                                        </div>
                                        <input
                                            dir="ltr"
                                            value={${valEn}}
                                            onChange={${onChEn}}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-left font-sans"
                                            required
                                        />
                                    </div>
                                </div>`;
    });

    // Also do exactly the same for Textareas!
    const regexTextarea = /<div className="grid grid-cols-2 gap-4">[\s\S]*?<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<textarea(.*?)dir="ltr"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>[\s\S]*?<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<textarea(.*?)dir="rtl"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;

    content = content.replace(regexTextarea, (match, enLabel, in1, in2, valEn, in3, onChEn, in4, classEn, arLabel, ar1, ar2, valAr, ar3, onChAr, ar4, classAr) => {
        return `
                                {/* Bilingual Textarea Group */}
                                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${arLabel}</label>
                                            <span className="text-[10px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2 py-0.5 rounded tracking-widest">AR</span>
                                        </div>
                                        <textarea
                                            dir="rtl"
                                            rows={4}
                                            value={${valAr}}
                                            onChange={${onChAr}}
                                            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-right"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${enLabel}</label>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded tracking-widest">EN</span>
                                        </div>
                                        <textarea
                                            dir="ltr"
                                            rows={4}
                                            value={${valEn}}
                                            onChange={${onChEn}}
                                            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-left font-sans"
                                            required
                                        />
                                    </div>
                                </div>`;
    });

    // What if it is not in a grid, but stacked individually?
    // Let's also catch consecutive divs:
    const regexSequential = /<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<input(.*?)dir="ltr"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>[\s\S]*?<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<input(.*?)dir="rtl"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>/g;
    content = content.replace(regexSequential, (match, enLabel, in1, in2, valEn, in3, onChEn, in4, classEn, arLabel, ar1, ar2, valAr, ar3, onChAr, ar4, classAr) => {
        // Prevent matching inside the group we just made
        if (match.includes('Bilingual Input Group')) return match;

        return `
                                {/* Bilingual Input Group */}
                                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${arLabel}</label>
                                            <span className="text-[10px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2 py-0.5 rounded tracking-widest">AR</span>
                                        </div>
                                        <input
                                            dir="rtl"
                                            value={${valAr}}
                                            onChange={${onChAr}}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-right"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${enLabel}</label>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded tracking-widest">EN</span>
                                        </div>
                                        <input
                                            dir="ltr"
                                            value={${valEn}}
                                            onChange={${onChEn}}
                                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-left font-sans"
                                        />
                                    </div>
                                </div>`;
    });

    const regexSequentialTextarea = /<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<textarea(.*?)dir="ltr"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>[\s\S]*?<div className="space-y-2">[\s\S]*?<label.*?>(.*?)<\/label>[\s\S]*?<textarea(.*?)dir="rtl"(.*?)value=\{(.*?)\}(.*?)onChange=\{(.*?)}(.*?)className="(.*?)"\s*\/>[\s\S]*?<\/div>/g;
    content = content.replace(regexSequentialTextarea, (match, enLabel, in1, in2, valEn, in3, onChEn, in4, classEn, arLabel, ar1, ar2, valAr, ar3, onChAr, ar4, classAr) => {
        // Prevent matching inside the group we just made
        if (match.includes('Bilingual Textarea Group')) return match;

        return `
                                {/* Bilingual Textarea Group */}
                                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5 space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${arLabel}</label>
                                            <span className="text-[10px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2 py-0.5 rounded tracking-widest">AR</span>
                                        </div>
                                        <textarea
                                            dir="rtl"
                                            rows={4}
                                            value={${valAr}}
                                            onChange={${onChAr}}
                                            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-right"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${enLabel}</label>
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded tracking-widest">EN</span>
                                        </div>
                                        <textarea
                                            dir="ltr"
                                            rows={4}
                                            value={${valEn}}
                                            onChange={${onChEn}}
                                            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all text-left font-sans"
                                        />
                                    </div>
                                </div>`;
    });

    fs.writeFileSync(path.join(cmptDir, file), content);
});

console.log('Successfully refactored all Drawers to Centered Modals and Bilingual Input Layouts!');
