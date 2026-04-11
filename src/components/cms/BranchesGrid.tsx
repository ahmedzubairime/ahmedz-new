"use client";

import { useState, useTransition } from "react";
import { SidebarIcon } from "@/components/SidebarIcon";
import { saveBranch, deleteBranch } from "@/app/actions/external-lists";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlayfulInput, PlayfulTextarea, PlayfulSwitch, PlayfulButton } from "@/components/ui/PlayfulInputs";
import { PlayfulModal } from "@/components/ui/PlayfulModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

const getBranchSchema = (locale: string) => z.object({
  name_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  name_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  address_ar: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  address_en: z.string().min(1, locale === "ar" ? "مطلوب" : "Required"),
  phone: z.string().optional(),
  email: z.string().email(locale === "ar" ? "بريد غير صالح" : "Invalid email").or(z.literal("")).optional(),
  latitude: z.any(),
  longitude: z.any(),
  is_active: z.boolean(),
});

type BranchFormValues = z.infer<ReturnType<typeof getBranchSchema>>;

type Props = { locale: string; branches: any[]; };

export function BranchesGrid({ locale, branches }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const schema = getBranchSchema(locale);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BranchFormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: { is_active: true }
    });

    function openNew() {
        setEditingId(null);
        reset({ name_ar: "", name_en: "", address_ar: "", address_en: "", phone: "", email: "", latitude: "", longitude: "", is_active: true });
        setDrawerOpen(true);
    }

    function openEdit(b: any) {
        setEditingId(b.id);
        reset({
            name_ar: b.name_ar || "", name_en: b.name_en || "", address_ar: b.address_ar || "", address_en: b.address_en || "",
            phone: b.phone || "", email: b.email || "", latitude: b.latitude || "", longitude: b.longitude || "",
            is_active: b.is_active
        });
        setDrawerOpen(true);
    }

    function closeDrawer() { setDrawerOpen(false); }

    function onSubmit(data: any) {
        startTransition(async () => {
            const payload = { ...data };
            
            const latStr = String(payload.latitude);
            const lngStr = String(payload.longitude);
            payload.latitude = latStr.trim() === "" ? null : parseFloat(latStr);
            payload.longitude = lngStr.trim() === "" ? null : parseFloat(lngStr);
            if (Number.isNaN(payload.latitude)) payload.latitude = null;
            if (Number.isNaN(payload.longitude)) payload.longitude = null;

            try {
                await saveBranch(payload, editingId || undefined);
                closeDrawer();
                toast.success(locale === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!", { icon: "🏢" });
            } catch (err) {
                console.error(err);
                toast.error(locale === "ar" ? "فشل الحفظ" : "Save failed");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm(locale === "ar" ? "حذف هذا الفرع؟" : "Delete this branch?")) return;
        startTransition(async () => {
            try { 
                await deleteBranch(id);
                toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
            } catch(e) {
                toast.error("Failed to delete");
            }
        });
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-white/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg shadow-emerald-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/40">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{locale === "ar" ? "إدارة الفروع والمقرات" : "Branch Locations"}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-500"><SidebarIcon name="globe" className="size-4" /> {locale === "ar" ? "أضف فروع شركتك عالمياً لتظهر على الخريطة التفاعلية." : "Manage your physical office locations across the globe."}</p>
                </div>
                <PlayfulButton onClick={openNew} className="!bg-emerald-500 hover:!shadow-emerald-500/30">
                    <SidebarIcon name="plus" className="size-5" />
                    {locale === "ar" ? "فرع جديد" : "Add Branch"}
                </PlayfulButton>
            </motion.div>

            {/* Grid */}
            {branches.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white/20 py-24 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/20">
                    <div className="flex size-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-500 mb-4 dark:bg-emerald-500/10"><SidebarIcon name="map-pin" className="size-10" /></div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{locale === "ar" ? "لا توجد فروع مسجلة" : "No branches configured"}</h3>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {branches.map((b, i) => (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={b.id} className="group relative flex flex-col gap-4 rounded-3xl border-2 border-zinc-200/60 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-4 group-hover:translate-x-0 duration-300">
                                <button onClick={() => openEdit(b)} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm hover:bg-emerald-50 hover:scale-110 dark:bg-zinc-800 dark:text-zinc-300 transition-all"><SidebarIcon name="edit" className="size-4" /></button>
                                <button onClick={() => handleDelete(b.id)} disabled={isPending} className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-100 hover:scale-110 dark:bg-rose-500/10 transition-all"><SidebarIcon name="trash" className="size-4" /></button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                                    <SidebarIcon name="building" className="size-6" />
                                </div>
                                <div className="pr-16">
                                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">{locale === "ar" ? b.name_ar : b.name_en}</h3>
                                    {(b.latitude && b.longitude) ? (
                                        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md w-fit"><SidebarIcon name="map-pin" className="size-3" />{b.latitude.toFixed(3)}, {b.longitude.toFixed(3)}</div>
                                    ) : (<div className="text-xs text-zinc-400 mt-1">No map coords</div>)}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-zinc-50/80 p-4 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex-1">
                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 leading-relaxed">{locale === "ar" ? b.address_ar : b.address_en}</p>
                                <div className="mt-3 flex flex-col gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    {b.phone && <div className="flex items-center gap-2"><SidebarIcon name="phone" className="size-3 text-zinc-400" /> {b.phone}</div>}
                                    {b.email && <div className="flex items-center gap-2"><SidebarIcon name="mail" className="size-3 text-zinc-400" /> {b.email}</div>}
                                </div>
                            </div>

                            <div className="mt-auto pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                                <span className="text-xs font-semibold text-zinc-500 flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5"><span className={`${b.is_active ? 'animate-ping bg-emerald-400' : ''} absolute inline-flex h-full w-full rounded-full opacity-75`}></span><span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${b.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span></span>
                                    {b.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <PlayfulModal isOpen={isDrawerOpen} onClose={closeDrawer} title={editingId ? (locale === "ar" ? "تعديل الفرع" : "Edit Branch") : (locale === "ar" ? "فرع جديد" : "New Branch")}
                footer={
                    <>
                        <PlayfulButton variant="secondary" onClick={closeDrawer}>{locale === "ar" ? "إلغاء" : "Cancel"}</PlayfulButton>
                        <PlayfulButton onClick={handleSubmit(onSubmit)} disabled={isPending} className="!bg-emerald-500 hover:!bg-emerald-600">
                            {isPending && <SidebarIcon name="loader-2" className="size-4 animate-spin" />}
                            Save Branch
                        </PlayfulButton>
                    </>
                }
            >
                <form id="branch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulInput label={locale === "ar" ? "الاسم (EN)" : "English Name"} dir="ltr" placeholder="e.g. Dubai Main Office" {...register("name_en")} error={errors.name_en?.message} />
                        <PlayfulInput label={locale === "ar" ? "اسم المكتب (AR)" : "Arabic Branch Name"} dir="rtl" {...register("name_ar")} error={errors.name_ar?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PlayfulInput label={locale === "ar" ? "رقم الهاتف" : "Contact Phone"} type="tel" dir="ltr" {...register("phone")} error={errors.phone?.message} />
                        <PlayfulInput label={locale === "ar" ? "البريد الإلكتروني" : "Contact Email"} type="email" dir="ltr" {...register("email")} error={errors.email?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <PlayfulTextarea label={locale === "ar" ? "عنوان المقر (EN)" : "English Address"} dir="ltr" rows={3} {...register("address_en")} error={errors.address_en?.message} />
                        <PlayfulTextarea label={locale === "ar" ? "عنوان المقر (AR)" : "Arabic Address"} dir="rtl" rows={3} {...register("address_ar")} error={errors.address_ar?.message} />
                    </div>

                    <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-5 dark:border-blue-500/10">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                            <SidebarIcon name="map" className="size-4" />
                            {locale === "ar" ? "إحداثيات الخريطة (اختياري)" : "Map Coordinates (Optional)"}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <PlayfulInput label="Latitude" type="number" step="any" dir="ltr" placeholder="25.2048" {...register("latitude", { valueAsNumber: true })} />
                            <PlayfulInput label="Longitude" type="number" step="any" dir="ltr" placeholder="55.2708" {...register("longitude", { valueAsNumber: true })} />
                        </div>
                    </div>

                    <Controller name="is_active" control={control} render={({ field }) => (
                        <div className="pt-2">
                            <PlayfulSwitch label={locale === "ar" ? "مقر نشط" : "Active Location"} checked={field.value} onChange={field.onChange} />
                        </div>
                    )} />
                </form>
            </PlayfulModal>
        </div>
    );
}
