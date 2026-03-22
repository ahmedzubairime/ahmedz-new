import { getLocale } from "next-intl/server";
import { SidebarIcon } from "@/components/SidebarIcon";
import { createClient } from "@/lib/supabase/server";

export default async function NewsletterMembersPage() {
    const locale = await getLocale();
    const supabase = await createClient();

    // Fetch members natively
    const { data: subscribers } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "مشتركو النشرة الإخبارية" : "Newsletter Members"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {locale === "ar"
                            ? "أدر قائمة المشتركين الخاصة بك وصدرها لتنفيذ الحملات."
                            : "Manage and export your newsletter subscriber base."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-hover hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/80">
                        <SidebarIcon name="download" className="size-4" />
                        {locale === "ar" ? "تصدير CSV" : "Export CSV"}
                    </button>
                    <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[var(--brand-primary)]/20 transition-all hover:bg-[var(--brand-primary-light)] hover:shadow-xl">
                        <SidebarIcon name="user-plus" className="size-4" />
                        {locale === "ar" ? "إضافة مشترك" : "Add Subscriber"}
                    </button>
                </div>
            </div>

            {/* Subscriber Sub-Nav */}
            <div className="flex items-center gap-4 border-b border-zinc-200 pb-2 dark:border-zinc-800">
                <span className="cursor-pointer border-b-2 border-[var(--brand-primary)] font-bold text-zinc-900 pb-2 dark:text-white">
                    {locale === "ar" ? "نشط (0)" : "Active (0)"}
                </span>
                <span className="cursor-pointer pb-2 text-zinc-500 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {locale === "ar" ? "إلغاء الاشتراك (0)" : "Unsubscribed (0)"}
                </span>
            </div>

            {/* Empty State / Table */}
            {(!subscribers || subscribers.length === 0) ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white dark:bg-zinc-800 mb-4 shadow-sm">
                        <SidebarIcon name="users" className="size-8 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        {locale === "ar" ? "لا يوجد مشتركون" : "No subscribers yet"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        {locale === "ar" ? "شارك الرابط الخاص بنشرتك لجمع المشتركين" : "Share your newsletter link to gather subscribers"}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <table className="min-w-full divide-y divide-zinc-200 text-left dark:divide-zinc-800">
                        <thead className="bg-zinc-50 text-xs font-semibold text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</th>
                                <th className="px-6 py-4">{locale === "ar" ? "اللغة المفضلة" : "Preferred Locale"}</th>
                                <th className="px-6 py-4">{locale === "ar" ? "الحالة" : "Status"}</th>
                                <th className="px-6 py-4">{locale === "ar" ? "تاريخ الانضمام" : "Joined"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm font-medium dark:divide-zinc-800">
                            {subscribers.map(sub => (
                                <tr key={sub.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100">{sub.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="rounded bg-zinc-100 px-2 flex items-center w-max py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            {sub.preferred_locale.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2 py-1 flex w-max items-center text-xs font-bold ${sub.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                            }`}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {new Date(sub.created_at).toLocaleDateString(locale)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
