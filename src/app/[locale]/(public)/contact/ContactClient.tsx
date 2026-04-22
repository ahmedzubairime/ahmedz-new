"use client";

import { useState, useTransition } from "react";
import { saveContactMessage } from "@/app/actions/portfolio";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export default function ContactClient({ isAr, info }: { isAr: boolean; info: any }) {
    const [isPending, startTransition] = useTransition();
    const [sent, setSent] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            try {
                await saveContactMessage({
                    name: fd.get("name") as string,
                    email: fd.get("email") as string,
                    subject: fd.get("subject") as string,
                    message: fd.get("message") as string,
                });
                setSent(true);
            } catch { /* toast error */ }
        });
    }

    const contactInfo = [
        { 
            icon: <Mail className="text-[#d4af37] dark:text-[#e9c176]" size={24} />, 
            label: info?.primary_email || "ahmed@alzubairi.com", 
            sub: isAr ? "أرسل لي رسالة" : "Drop me a line" 
        },
        { 
            icon: <Phone className="text-[#d4af37] dark:text-[#e9c176]" size={24} />, 
            label: info?.primary_phone || "+967 XXX XXX XXX", 
            sub: isAr ? "متاح 9ص - 5م GMT+3" : "Available 9am - 5pm GMT+3" 
        },
        { 
            icon: <MapPin className="text-[#d4af37] dark:text-[#e9c176]" size={24} />, 
            label: info?.address_en || (isAr ? "صنعاء، اليمن" : "Sana'a, Yemen"), 
            sub: isAr ? "مفتوح للتعاون عن بعد" : "Open to remote collaboration" 
        },
    ];

    return (
        <>
            {/* Page Hero */}
            <section className="bg-slate-50 dark:bg-[#0b1326] py-20 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-1/4 h-[300px] w-[300px] bg-[#d4af37]/10 dark:bg-[#312e81]/20 blur-[120px] rounded-full pointer-events-none transition-colors" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <AnimatedSection animation="fade-up">
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#d4af37] dark:text-[#e9c176]">
                            {isAr ? "التواصل" : "Contact"}
                        </span>
                        <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                            {isAr ? "تواصل معي" : "Let's Connect"}
                        </h1>
                        <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-slate-600 dark:text-[#8f9097]">
                            {isAr ? "مرحبًا بفرص التعاون والشراكة والاستشارات." : "Open to collaboration, partnership, and consulting opportunities."}
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="bg-slate-50 dark:bg-[#0b1326] pb-16 transition-colors">
                <AnimatedSection className="mx-auto max-w-7xl px-6 lg:px-8" animation="stagger" delay={0.2}>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {contactInfo.map((item, idx) => (
                            <div key={idx} className="rounded-xl bg-white dark:bg-[#131b2e] p-8 text-center transition-all hover:bg-slate-50 dark:hover:bg-[#171f33] border border-slate-200 dark:border-[#222a3d] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:-translate-y-1">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 dark:bg-[#222a3d]">
                                    {item.icon}
                                </div>
                                <p className="mt-4 font-['Manrope'] text-base font-extrabold text-slate-900 dark:text-[#dae2fd]" dir="ltr">{item.label}</p>
                                <p className="mt-1 font-['Inter'] text-sm text-slate-500 dark:text-[#8f9097]">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* Contact Form */}
            <section className="bg-white dark:bg-[#131b2e] py-24 border-y border-slate-200 dark:border-[#222a3d] transition-colors">
                <AnimatedSection className="mx-auto max-w-3xl px-6 lg:px-8" animation="fade-in" delay={0.3}>
                    {sent ? (
                        <div className="rounded-xl bg-slate-50 dark:bg-[#0b1326] p-16 text-center border border-slate-200 dark:border-[#222a3d] shadow-sm dark:shadow-none">
                            <CheckCircle className="mx-auto text-[#d4af37] dark:text-[#e9c176]" size={48} />
                            <h2 className="mt-4 font-['Manrope'] text-2xl font-extrabold text-slate-900 dark:text-[#dae2fd]">
                                {isAr ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                            </h2>
                            <p className="mt-3 font-['Inter'] text-sm text-slate-600 dark:text-[#8f9097]">
                                {isAr ? "سأعود إليك في أقرب وقت." : "I'll get back to you as soon as possible."}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-50 dark:bg-[#0b1326] p-8 md:p-12 rounded-xl border border-slate-200 dark:border-[#222a3d] shadow-sm dark:shadow-none transition-colors">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div>
                                    <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8f9097]">
                                        {isAr ? "الاسم الكامل" : "Full Name"}
                                    </label>
                                    <input
                                        name="name"
                                        required
                                        className="mt-2 w-full border-b-2 border-slate-300 dark:border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-slate-900 dark:text-[#dae2fd] placeholder:text-slate-400 dark:placeholder:text-[#45474c] focus:border-[#d4af37] dark:focus:border-[#e9c176] focus:outline-none transition-colors"
                                        placeholder={isAr ? "أدخل اسمك" : "Enter your name"}
                                    />
                                </div>
                                <div>
                                    <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8f9097]">
                                        {isAr ? "البريد الإلكتروني" : "Email Address"}
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="mt-2 w-full border-b-2 border-slate-300 dark:border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-slate-900 dark:text-[#dae2fd] placeholder:text-slate-400 dark:placeholder:text-[#45474c] focus:border-[#d4af37] dark:focus:border-[#e9c176] focus:outline-none transition-colors"
                                        placeholder={isAr ? "أدخل بريدك" : "Enter your email"}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8f9097]">
                                    {isAr ? "الموضوع" : "Subject"}
                                </label>
                                <input
                                    name="subject"
                                    required
                                    className="mt-2 w-full border-b-2 border-slate-300 dark:border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-slate-900 dark:text-[#dae2fd] placeholder:text-slate-400 dark:placeholder:text-[#45474c] focus:border-[#d4af37] dark:focus:border-[#e9c176] focus:outline-none transition-colors"
                                    placeholder={isAr ? "موضوع الرسالة" : "What is this about?"}
                                />
                            </div>
                            <div>
                                <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8f9097]">
                                    {isAr ? "الرسالة" : "Message"}
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    className="mt-2 w-full resize-none border-b-2 border-slate-300 dark:border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-slate-900 dark:text-[#dae2fd] placeholder:text-slate-400 dark:placeholder:text-[#45474c] focus:border-[#d4af37] dark:focus:border-[#e9c176] focus:outline-none transition-colors"
                                    placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded bg-gradient-to-r from-[#d4af37] to-[#997a15] dark:from-[#e9c176] dark:to-[#C5A059] px-8 py-4 font-['Inter'] text-sm font-bold text-white dark:text-[#0b1326] transition-all hover:shadow-xl dark:hover:shadow-[#e9c176]/20 disabled:opacity-50"
                            >
                                {isPending
                                    ? (isAr ? "جاري الإرسال..." : "Sending...")
                                    : (isAr ? "إرسال الرسالة" : "Send Message")}
                            </button>
                        </form>
                    )}
                </AnimatedSection>
            </section>
        </>
    );
}
