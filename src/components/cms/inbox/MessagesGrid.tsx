"use client";

import { useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { deleteContactMessage } from "@/app/actions/portfolio";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

type Props = { locale: string; messages: any[] };

export function MessagesGrid({ locale, messages }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) return;
        startTransition(async () => {
            try { await deleteContactMessage(id); toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); }
            catch { toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed"); }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-teal-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "الرسائل المباشرة" : "Inbox Messages"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="mail" className="size-4 text-teal-500" />
                        {locale === "ar" ? "استعرض الرسائل الواردة من نموذج الاتصال." : "View incoming messages from your contact form."}
                    </p>
                </div>
            </motion.div>

            {messages.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-500 mb-4"><SidebarIcon name="inbox" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "البريد فارغ" : "Inbox is empty"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`group relative flex flex-col md:flex-row gap-4 rounded-3xl border-2 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${m.status === 'unread' ? "border-teal-500/30 bg-teal-50/50 dark:bg-teal-900/10" : "border-zinc-200/50 dark:border-zinc-800/50"}`}>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                                {m.name}
                                                {m.status === 'unread' && <span className="flex size-2 rounded-full bg-teal-500 animate-pulse"></span>}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm font-semibold text-zinc-500 mt-1">
                                                <a href={`mailto:${m.email}`} className="hover:text-teal-500 flex items-center gap-1"><SidebarIcon name="mail" className="size-3" /> {m.email}</a>
                                                {m.phone && <a href={`tel:${m.phone}`} className="hover:text-teal-500 flex items-center gap-1"><SidebarIcon name="phone" className="size-3" /> {m.phone}</a>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-zinc-400 font-medium">
                                            {format(new Date(m.createdAt), 'MMM d, yyyy h:mm a')}
                                        </div>
                                    </div>

                                    <div className="bg-white/50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-white dark:border-zinc-800">
                                        {m.subject && <h4 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">{m.subject}</h4>}
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(m.id)} disabled={isPending} className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-500 hover:text-white border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
