import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotAuthorizedPage() {
    const t = useTranslations("auth.notAuthorized");

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-center">
                <p className="text-8xl font-black text-zinc-200 dark:text-zinc-800">
                    {t("code")}
                </p>
                <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {t("title")}
                </h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {t("message")}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/"
                        className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    >
                        {t("backHome")}
                    </Link>
                    <button className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                        {t("contactAdmin")}
                    </button>
                </div>
            </div>
        </div>
    );
}
