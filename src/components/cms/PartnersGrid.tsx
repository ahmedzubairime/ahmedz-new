"use client";

import { useState, useTransition, useMemo } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { savePartner, deletePartner } from "@/app/actions/homepage-lists";
import { UploadDialog } from "@/components/media/UploadDialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const getPartnerSchema = (locale: string) => z.object({
  name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  website_url: z.string().url(locale === "ar" ? "رابط غير صالح" : "Invalid URL").or(z.literal("")).optional(),
  is_active: z.boolean(),
});

type PartnerFormValues = z.infer<ReturnType<typeof getPartnerSchema>>;

type Props = {
    locale: string;
    partners: any[];
};

export function PartnersGrid({ locale, partners }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = useMemo(() => getPartnerSchema(locale), [locale]);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PartnerFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { is_active: true }
    });

    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoId, setLogoId] = useState<string | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    function openNew() {
        setEditingId(null);
        reset({ name_ar: "", name_en: "", website_url: "", is_active: true });
        setLogoId(null);
        setLogoUrl(null);
        setModalOpen(true);
    }

    function openEdit(p: any) {
        setEditingId(p.id);
        reset({
            name_ar: p.name_ar || "", name_en: p.name_en || "",
            website_url: p.website_url || "", is_active: p.is_active
        });
        setLogoId(p.logo_id || null);
        setLogoUrl(p.logo ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${p.logo.bucket}/${p.logo.storage_path}` : null);
        setModalOpen(true);
    }

    function close() { setModalOpen(false); }

    function onSubmit(data: PartnerFormValues) {
        startTransition(async () => {
            try {
                const payload = { ...data, logo_id: logoId };
                await savePartner(payload, editingId || undefined);
                close();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully", { icon: "🤝" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "متاكد من حذف هذا الشريك؟" : "Are you sure you want to delete this partner?")) return;
        startTransition(async () => {
            try {
                await deletePartner(id);
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch(e) {
                toast.error(locale === "ar" ? "فشل الحذف" : "Delete failed");
            }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-teal-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        {locale === "ar" ? "شركاء النجاح" : "Partners & Clients"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500">
                        <SidebarIcon name="briefcase" className="size-4 text-teal-500" />
                        {locale === "ar" ? "أضف شعارات شركائك التجاريين لعرضها في الرئيسية." : "Add corporate logos and links to showcase trust on your homepage."}
                    </p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-[var(--brand-primary)] hover:!shadow-[var(--brand-primary)]/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "إضافة شريك" : "Add Partner"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {partners.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-500 mb-4 animate-bounce"><SidebarIcon name="building" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا يوجد شركاء بعد" : "No partners added yet"}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-500">{locale === "ar" ? "قم بإبراز عملائك المميزين هنا." : "Highlight your key clients or sponsors here."}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
                    <AnimatePresence>
                        {partners.map((p, i) => {
                            const compiledLogo = p.logo ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${p.logo.bucket}/${p.logo.storage_path}` : null;
                            return (
                                <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900/80 backdrop-blur-md ${p.is_active ? 'border-zinc-200/50 bg-white/80 hover:border-[var(--brand-primary)]/30 hover:shadow-[var(--brand-primary)]/10 dark:border-zinc-800/80' : 'border-zinc-200/50 bg-zinc-50/50 opacity-60 dark:border-zinc-800/50 dark:bg-zinc-900/30'}`}>
                                    
                                    <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <button onClick={() => openEdit(p)} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-600 shadow-md hover:scale-110 hover:bg-[var(--brand-primary)] hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[var(--brand-primary)] transition-all border border-zinc-200 dark:border-zinc-700">
                                            <SidebarIcon name="edit" className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-md hover:scale-110 hover:bg-rose-600 hover:text-white dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-600 transition-all border border-rose-100 dark:border-rose-800">
                                            <SidebarIcon name="trash" className="size-4" />
                                        </button>
                                    </div>

                                    {!p.is_active && (
                                        <div className="absolute top-3 left-3 flex items-center justify-center rounded-full px-2 py-0.5 bg-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest z-20 dark:bg-zinc-800">
                                            Hidden
                                        </div>
                                    )}

                                    <div className="relative mb-6 flex aspect-video w-full items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-6 overflow-hidden border border-zinc-100 dark:border-zinc-800/80 group-hover:bg-white dark:group-hover:bg-zinc-800 shadow-inner">
                                        {compiledLogo ? (
                                            <img src={compiledLogo} alt={p.name_en} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                                        ) : (
                                            <SidebarIcon name="briefcase" className="size-10 text-zinc-300 dark:text-zinc-700" />
                                        )}
                                    </div>

                                    <h3 className="text-center font-black text-zinc-900 dark:text-zinc-100 line-clamp-1 w-full text-sm">
                                        {locale === "ar" ? p.name_ar : p.name_en}
                                    </h3>

                                    {p.website_url && (
                                        <a href={p.website_url} target="_blank" className="mt-2 text-[10px] font-bold text-zinc-400 hover:text-[var(--brand-primary)] uppercase tracking-wider transition-all line-clamp-1 truncate w-full text-center block">
                                            {p.website_url.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isModalOpen} onClose={close} title={editingId ? (locale === "ar" ? "تعديل الشريك" : "Edit Partner") : (locale === "ar" ? "شريك جديد" : "New Partner")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={close}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-[var(--brand-primary)] hover:!bg-[var(--brand-primary)] hover:brightness-110">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            {editingId ? (locale === "ar" ? "حفظ التغييرات" : "Save Changes") : (locale === "ar" ? "إنشاء شريك" : "Create Partner")}
                        </PlayfulButton>
                    </>
                }
            >
                <form id="partner-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Logo Upload Area */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 pl-2">{locale === "ar" ? "شعار الشريك" : "Partner Logo"}</label>
                        {logoUrl ? (
                            <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 h-40 group flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 shadow-inner">
                                <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full p-6 object-contain transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <PlayfulButton type="button" onClick={() => setIsImageDialogOpen(true)} className="!bg-white !text-zinc-900 px-6 hover:scale-105">Replace</PlayfulButton>
                                    <PlayfulButton type="button" onClick={() => { setLogoUrl(null); setLogoId(null); }} className="!bg-rose-600 !text-white px-6 hover:scale-105">Remove</PlayfulButton>
                                </div>
                            </div>
                        ) : (
                            <div onClick={() => setIsImageDialogOpen(true)} className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 py-10 transition-all hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-[var(--brand-primary)]">
                                <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800 group-hover:scale-110 transition-transform group-hover:text-[var(--brand-primary)]">
                                    <SidebarIcon name="image-plus" className="size-6 text-zinc-400 group-hover:text-[var(--brand-primary)]" />
                                </div>
                                <span className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-[var(--brand-primary)]">
                                    Upload SVG or PNG logo
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "English Name"} dir="ltr" {...register("name_en")} error={errors.name_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "الاسم (AR)" : "Arabic Name"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulInput label={locale === "ar" ? "رابط الموقع الإلكتروني" : "Website URL"} type="url" dir="ltr" placeholder="https://company.com" {...register("website_url")} error={errors.website_url?.message} />
                        
                        <Controller name="is_active" control={control} render={({ field }) => (
                            <div className="pt-2 pl-4">
                                <PlayfulSwitch label={locale === "ar" ? "مرئي بالموقع" : "Visible on Site"} checked={field.value} onChange={field.onChange} />
                            </div>
                        )} />
                    </div>
                </form>
            </PlayfulModal>

            {/* Modal for Logo Picker */}
            {isImageDialogOpen && (
                <UploadDialog
                    folders={[]}
                    bucket="images"
                    defaultFolderId="all"
                    locale={locale}
                    onClose={() => setIsImageDialogOpen(false)}
                    onSuccess={(urls) => {
                        setIsImageDialogOpen(false);
                        if (urls && urls[0]) { setLogoUrl(urls[0]); }
                    }}
                />
            )}
        </div>
    );
}
