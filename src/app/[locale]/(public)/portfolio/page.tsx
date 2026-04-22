import { getLocale } from "next-intl/server";
import { Metadata } from "next";
import { getProjects, getCaseStudies } from "@/app/actions/portfolio";
import PortfolioClient from "./PortfolioClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "الأعمال والمشاريع" : "Portfolio",
    };
}

export default async function PortfolioPage() {
    const locale = await getLocale();
    const isAr = locale === "ar";

    const [projects, caseStudies] = await Promise.all([
        getProjects(),
        getCaseStudies(),
    ]);

    return (
        <PortfolioClient
            isAr={isAr}
            projects={projects}
            caseStudies={caseStudies}
        />
    );
}
