import { getLocale } from "next-intl/server";
import { getTestimonials, getHomepageStats, getLatestPosts, getLatestProjects, getHomepageSkills, getHomepageCertificates } from "@/app/actions/homepage-lists";
import { getHomepageHero, getHomepageCta } from "@/app/actions/cms";
import HomeClient from "./HomeClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "الرئيسية" : "Home",
    };
}

export default async function HomePage() {
    const locale = await getLocale();
    const isAr = locale === "ar";

    const [hero, testimonials, stats, latestPosts, latestProjects, cta, skills, certificates] = await Promise.all([
        getHomepageHero(),
        getTestimonials(),
        getHomepageStats(),
        getLatestPosts(3),
        getLatestProjects(3),
        getHomepageCta(),
        getHomepageSkills(),
        getHomepageCertificates(),
    ]);

    return (
        <HomeClient
            isAr={isAr}
            hero={hero}
            testimonials={testimonials}
            stats={stats}
            latestPosts={latestPosts}
            latestProjects={latestProjects}
            cta={cta}
            skills={skills}
            certificates={certificates}
        />
    );
}
