"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
    const t = useTranslations("auth.forgotPassword");

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-50 text-2xl dark:bg-amber-950">
                    🔑
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {t("title")}
                </h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {t("subtitle")}
                </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t("email")}
                    </label>
                    <input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                    {t("submit")}
                </button>
            </form>

            <p className="mt-6 text-center">
                <Link href="/login" className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                    ← {t("backToLogin")}
                </Link>
            </p>
        </div>
    );
}
