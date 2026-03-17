"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn } from "@/app/actions/auth";
import { useState, useTransition } from "react";

export default function LoginPage() {
    const t = useTranslations("auth.login");
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await signIn(formData);
            if (!result.success) {
                setError(result.error || t("errorInvalid"));
            } else if (result.redirectTo) {
                router.push(result.redirectTo);
            }
        });
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("subtitle")}</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {t("email")}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder={t("emailPlaceholder")}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                            disabled={isPending}
                        />
                    </div>

                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {t("password")}
                            </label>
                            <Link href="/forgot-password" className="text-xs text-sky-600 hover:text-sky-500 dark:text-sky-400">
                                {t("forgotPassword")}
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder={t("passwordPlaceholder")}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                            disabled={isPending}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-600"
                    >
                        {isPending ? t("submitting") : t("submit")}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {t("noAccount")}{" "}
                    <Link href="/register" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400">
                        {t("register")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
