"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { PlayfulInput } from "./PlayfulInputs";
import { PlayfulModal } from "./PlayfulModal";
import { SidebarIcon } from "@/components/SidebarIcon";

function toKebabCase(str: string): string {
    return str
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])(\d)/g, '$1-$2')
      .toLowerCase();
}

const iconKeys = Object.keys(LucideIcons).filter(
    (key) => key !== "createLucideIcon" && /^[A-Z]/.test(key) && !key.endsWith("Icon")
);

interface PlayfulIconPickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    locale?: string;
}

export function PlayfulIconPicker({ value, onChange, label, error, locale = "en" }: PlayfulIconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredIcons = useMemo(() => {
        if (!search) return iconKeys.slice(0, 100);
        return iconKeys
            .filter((key) => key.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 100);
    }, [search]);

    return (
        <div className="relative">
            <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
                <PlayfulInput 
                    label={label || (locale === "ar" ? "اختر أيقونة" : "Select Icon")} 
                    value={value || ""} 
                    readOnly 
                    error={error} 
                    style={{ paddingLeft: '3rem', cursor: 'pointer' }}
                    placeholder={locale === "ar" ? "اضغط لاختيار أيقونة..." : "Click to select..."}
                />
                <div className="absolute left-4 top-[38px] flex size-6 items-center justify-center rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm pointer-events-none">
                    {value ? <SidebarIcon name={value} className="size-4" /> : <SidebarIcon name="star" className="size-4 opacity-50" />}
                </div>
            </div>

            <PlayfulModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={locale === "ar" ? "مكتبة الأيقونات" : "Icon Library"}
            >
                <div className="space-y-4">
                    <input 
                        type="search"
                        placeholder={locale === "ar" ? "ابحث عن أيقونة (باللغة الإنجليزية)..." : "Search icons..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-3 outline-none transition-all focus:border-[var(--brand-primary)] dark:border-zinc-800 dark:bg-zinc-900"
                    />
                    
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[50vh] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                        {filteredIcons.map((key) => {
                            const IconComponent = (LucideIcons as any)[key] as React.ElementType;
                            const kebabName = toKebabCase(key);
                            
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        onChange(kebabName);
                                        setIsOpen(false);
                                    }}
                                    className={`flex aspect-square flex-col flex-wrap items-center justify-center gap-1 rounded-xl border-2 p-2 transition-all hover:scale-105 ${
                                        value === kebabName 
                                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm" 
                                        : "border-transparent bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                    }`}
                                    title={kebabName}
                                >
                                    <IconComponent className="size-5" />
                                    <span className="text-[10px] w-full mt-auto block truncate opacity-70 px-1 font-medium text-center">{kebabName}</span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-center text-xs text-zinc-500 font-medium pb-2">
                        {locale === "ar" 
                            ? (search && filteredIcons.length === 100 ? "يتم عرض أول 100 نتيجة. خصص البحث للمزيد." : "")
                            : (search && filteredIcons.length === 100 ? "Showing top 100 results. Refine search for more." : "")
                        }
                        {!search && (locale === "ar" ? "يتم عرض 100 أيقونة فقط. استخدم البحث لوصول أسرع." : "Showing 100 common icons. Use search to find more.")}
                    </p>
                </div>
            </PlayfulModal>
        </div>
    );
}
