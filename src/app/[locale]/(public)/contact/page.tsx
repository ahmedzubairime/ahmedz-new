"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { saveContactMessage } from "@/app/actions/portfolio";

export default function ContactPage() {
    const locale = useLocale();
    const isAr = locale === "ar";
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
        { icon: "mail", label: "ahmed@alzubairi.com", sub: isAr ? "أرسل لي رسالة" : "Drop me a line" },
        { icon: "phone", label: "+967 XXX XXX XXX", sub: isAr ? "متاح 9ص - 5م GMT+3" : "Available 9am - 5pm GMT+3" },
        { icon: "location_on", label: isAr ? "صنعاء، اليمن" : "Sana'a, Yemen", sub: isAr ? "مفتوح للتعاون عن بعد" : "Open to remote collaboration" },
    ];

    return (
        <>
            {/* Page Hero */}
            <section className="bg-[#0b1326] py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                        {isAr ? "التواصل" : "Contact"}
                    </span>
                    <h1 className="mt-3 font-['Manrope'] text-5xl font-extrabold tracking-tight text-[#dae2fd]" style={{ letterSpacing: "-0.02em" }}>
                        {isAr ? "تواصل معي" : "Let's Connect"}
                    </h1>
                    <p className="mt-4 max-w-2xl font-['Inter'] text-lg text-[#8f9097]">
                        {isAr ? "مرحبًا بفرص التعاون والشراكة والاستشارات." : "Open to collaboration, partnership, and consulting opportunities."}
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="bg-[#0b1326] pb-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-3">
                        {contactInfo.map((info) => (
                            <div key={info.icon} className="rounded-xl bg-[#131b2e] p-8 text-center transition-all hover:bg-[#171f33]">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#222a3d]">
                                    <span className="material-symbols-outlined text-xl text-[#e9c176]">{info.icon}</span>
                                </div>
                                <p className="mt-4 font-['Manrope'] text-base font-extrabold text-[#dae2fd]">{info.label}</p>
                                <p className="mt-1 font-['Inter'] text-sm text-[#8f9097]">{info.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-[#131b2e] py-24">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    {sent ? (
                        <div className="rounded-xl bg-[#0b1326] p-16 text-center">
                            <span className="material-symbols-outlined text-5xl text-[#e9c176]">check_circle</span>
                            <h2 className="mt-4 font-['Manrope'] text-2xl font-extrabold text-[#dae2fd]">
                                {isAr ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                            </h2>
                            <p className="mt-3 font-['Inter'] text-sm text-[#8f9097]">
                                {isAr ? "سأعود إليك في أقرب وقت." : "I'll get back to you as soon as possible."}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div>
                                    <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#8f9097]">
                                        {isAr ? "الاسم الكامل" : "Full Name"}
                                    </label>
                                    <input
                                        name="name"
                                        required
                                        className="mt-2 w-full border-b-2 border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-[#dae2fd] placeholder:text-[#45474c] focus:border-[#e9c176] focus:outline-none transition-colors"
                                        placeholder={isAr ? "أدخل اسمك" : "Enter your name"}
                                    />
                                </div>
                                <div>
                                    <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#8f9097]">
                                        {isAr ? "البريد الإلكتروني" : "Email Address"}
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="mt-2 w-full border-b-2 border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-[#dae2fd] placeholder:text-[#45474c] focus:border-[#e9c176] focus:outline-none transition-colors"
                                        placeholder={isAr ? "أدخل بريدك" : "Enter your email"}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#8f9097]">
                                    {isAr ? "الموضوع" : "Subject"}
                                </label>
                                <input
                                    name="subject"
                                    required
                                    className="mt-2 w-full border-b-2 border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-[#dae2fd] placeholder:text-[#45474c] focus:border-[#e9c176] focus:outline-none transition-colors"
                                    placeholder={isAr ? "موضوع الرسالة" : "What is this about?"}
                                />
                            </div>
                            <div>
                                <label className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#8f9097]">
                                    {isAr ? "الرسالة" : "Message"}
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    className="mt-2 w-full resize-none border-b-2 border-[#45474c]/30 bg-transparent pb-3 font-['Inter'] text-sm text-[#dae2fd] placeholder:text-[#45474c] focus:border-[#e9c176] focus:outline-none transition-colors"
                                    placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded bg-gradient-to-r from-[#e9c176] to-[#C5A059] px-8 py-4 font-['Inter'] text-sm font-bold text-[#0b1326] transition-all hover:shadow-xl hover:shadow-[#e9c176]/20 disabled:opacity-50"
                            >
                                {isPending
                                    ? (isAr ? "جاري الإرسال..." : "Sending...")
                                    : (isAr ? "إرسال الرسالة" : "Send Message")}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* Social Links */}
            <section className="bg-[#0b1326] py-16">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-6 lg:px-8">
                    {["LinkedIn", "Twitter/X", "GitHub"].map((name) => (
                        <a
                            key={name}
                            href="#"
                            className="flex items-center gap-2 rounded-lg bg-[#131b2e] px-6 py-3 font-['Inter'] text-sm font-medium text-[#8f9097] transition-all hover:bg-[#222a3d] hover:text-[#e9c176]"
                        >
                            {name}
                        </a>
                    ))}
                </div>
            </section>
        </>
    );
}
