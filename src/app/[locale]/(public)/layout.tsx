import { getContactInfo } from "@/app/actions/cms";
import { getSocialLinks } from "@/app/actions/external-lists";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: {
            template: isAr ? "%s | أحمد الزبيري" : "%s | Ahmed Al-Zubairi",
            default: isAr ? "أحمد الزبيري - محفظة الأعمال" : "Ahmed Al-Zubairi - Professional Portfolio",
        },
        description: isAr 
            ? "المحفظة الرسمية لأحمد الزبيري، خبير استراتيجي في إدارة المشاريع." 
            : "The official portfolio of Ahmed Al-Zubairi, Project Management Consultant.",
    };
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const contactInfo = await getContactInfo();
    const socialLinks = await getSocialLinks();

    return (
        <div className="flex min-h-screen flex-col bg-[#0b1326] text-[#dae2fd]">
            <PublicHeader />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            <PublicFooter info={contactInfo} social={socialLinks} />
        </div>
    );
}
