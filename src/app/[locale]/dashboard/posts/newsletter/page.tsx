import { getLocale } from "next-intl/server";
import { SidebarIcon } from "@/components/SidebarIcon";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

async function NewsletterWrapper({ locale }: { locale: string }) {
    const supabase = await createClient();

    // Fetch campaigns natively
    const { data: campaigns } = await supabase
        .from("newsletter_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

    if (!campaigns || campaigns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 py-20 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
                    <SidebarIcon name="mail" className="size-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {locale === "ar" ? "لا توجد حملات بعد" : "No campaigns yet"}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                    {locale === "ar" ? "انقر على حملة جديدة لإرسال مقالك الأول للمشتركين" : "Click New Campaign to blast your first article to subscribers"}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map(campaign => (
                <div key={campaign.id} className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 p-5 transition-all hover:-translate-y-1 hover:border-[var(--brand-primary)]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">

                    <div className="flex items-start justify-between">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${campaign.status === 'sent'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400'
                            }`}>
                            {campaign.status.toUpperCase()}
                        </span>

                        <div className="flex items-center gap-1 rounded bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-400 dark:bg-zinc-800/50">
                            <SidebarIcon name="globe" className="size-3" />
                            {campaign.target_locale.toUpperCase()}
                        </div>
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {(locale === "ar" ? campaign.subject_ar : campaign.subject_en) || "Untitled Subject"}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-zinc-500">
                        <span className="flex items-center gap-1">
                            <SidebarIcon name="calendar" className="size-3.5" />
                            {new Date(campaign.created_at).toLocaleDateString(locale)}
                        </span>
                        {campaign.status === 'sent' && campaign.sent_at && (
                            <span className="rounded-full bg-[var(--brand-primary)]/10 px-2 py-1 text-[var(--brand-primary)]">
                                SENT: {new Date(campaign.sent_at).toLocaleDateString(locale)}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default async function NewsletterCampaignsPage() {
    const locale = await getLocale();

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "حملات النشرة الإخبارية" : "Newsletter Campaigns"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أرسل مقالاتك مباشرة إلى المشتركين بنقرة واحدة."
                            : "Broadcast your articles directly to subscribers with one click."}
                    </p>
                </div>
                <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:-translate-y-1 hover:bg-[var(--brand-primary-light)] hover:shadow-xl">
                    <SidebarIcon name="send" className="size-5" />
                    {locale === "ar" ? "حملة جديدة" : "New Campaign"}
                </button>
            </div>

            <Suspense fallback={<TableSkeleton rowCount={4} />}>
                <NewsletterWrapper locale={locale} />
            </Suspense>
        </div>
    );
}
