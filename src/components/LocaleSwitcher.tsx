"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { SidebarIcon } from "@/components/SidebarIcon";

export function LocaleSwitcher() {
    const currentLocale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();

    const nextLocale: Locale = currentLocale === "ar" ? "en" : "ar";
    // const label = currentLocale === "ar" ? "EN" : "ع";
    const ariaLabel = currentLocale === "ar" ? "Switch to English" : "التبديل إلى العربية";

    function handleToggle() {
        document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax`;
        router.replace(pathname, { locale: nextLocale });
    }

    return (
        <button
            onClick={handleToggle}
            className="topbar-action-btn flex size-9 cursor-pointer items-center justify-center gap-1 rounded-xl text-zinc-500 transition-all hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            // aria-label={ariaLabel}
            title={ariaLabel}
        >
            <SidebarIcon name="globe" className="size-[18px]" />
            {/* <span className="text-[10px] font-bold leading-none">{label}</span> */}
        </button>
    );
}
