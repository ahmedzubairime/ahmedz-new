import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { getAboutHero, getAboutCompany, getAboutCertificates } from "@/app/actions/about";
import { getExperiences, getSkills } from "@/app/actions/portfolio";
import AboutClient from "./AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "من أنا" : "About Me",
    };
}

export default async function AboutPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";

    const [hero, company, experiences, certificates, skills] = await Promise.all([
        getAboutHero(),
        getAboutCompany(),
        getExperiences(),
        getAboutCertificates(),
        getSkills(),
    ]);

    return (
        <AboutClient
            isAr={isAr}
            hero={hero}
            company={company}
            experiences={experiences}
            certificates={certificates}
            skills={skills}
        />
    );
}
