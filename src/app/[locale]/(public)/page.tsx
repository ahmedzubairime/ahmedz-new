import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
        </>
    );
}

function HeroSection() {
    const t = useTranslations("public.hero");

    return (
        <section className="relative overflow-hidden bg-zinc-950 text-white dark:bg-zinc-950">
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />

            {/* Accent orbs */}
            <div className="absolute top-20 start-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px]" />
            <div className="absolute bottom-20 end-1/4 h-72 w-72 rounded-full bg-amber-500/20 blur-[100px]" />

            <div className="relative mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-4 py-32 text-center">
                <span className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-sm">
                    ✦ {t("badge")}
                </span>
                <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
                    {t("title")}
                </h1>
                <p className="mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl">
                    {t("subtitle")}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                        href="/register"
                        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-200 hover:scale-105 active:scale-100"
                    >
                        {t("cta")}
                    </Link>
                    <Link
                        href="/dashboard"
                        className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-100"
                    >
                        {t("secondaryCta")}
                    </Link>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const t = useTranslations("public.features");

    const features = [
        {
            icon: "◈",
            title: t("cms.title"),
            description: t("cms.description"),
            gradient: "from-emerald-500 to-teal-600",
        },
        {
            icon: "△",
            title: t("pms.title"),
            description: t("pms.description"),
            gradient: "from-blue-500 to-cyan-600",
        },
        {
            icon: "✦",
            title: t("store.title"),
            description: t("store.description"),
            gradient: "from-amber-500 to-orange-600",
        },
    ];

    return (
        <section className="bg-white py-24 dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                    {t("title")}
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <div className={`mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-xl text-white`}>
                                {feature.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                            {/* Hover glow effect */}
                            <div className={`absolute -bottom-20 -end-20 size-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
