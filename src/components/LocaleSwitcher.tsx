"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { type Locale, locales } from "@/i18n/routing";

export function LocaleSwitcher() {
    const currentLocale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("common.localeSwitcher");

    function handleLocaleChange(newLocale: Locale) {
        // Set cookie for persistence
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
        router.replace(pathname, { locale: newLocale });
    }

    return (
        <div className="flex items-center gap-1" role="group" aria-label={t("label")}>
            {locales.map((locale) => (
                <button
                    key={locale}
                    onClick={() => handleLocaleChange(locale)}
                    disabled={locale === currentLocale}
                    className={`
            rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200
            ${locale === currentLocale
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-default"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                        }
          `}
                    aria-label={t(`locale_${locale}`)}
                    aria-current={locale === currentLocale ? "true" : undefined}
                >
                    {t(`locale_${locale}`)}
                </button>
            ))}
        </div>
    );
}
