import { MetadataRoute } from "next";

const host = process.env.NEXT_PUBLIC_SITE_URL || "https://ahmedalzubairi.com"; // Replace with actual domain

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPaths = [
        "",
        "/about",
        "/resume",
        "/portfolio",
        "/blog",
        "/gallery",
        "/contact",
    ];

    const sitemap: MetadataRoute.Sitemap = [];

    staticPaths.forEach((path) => {
        // English Locale
        sitemap.push({
            url: `${host}/en${path}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: path === "" ? 1.0 : 0.8,
        });

        // Arabic Locale
        sitemap.push({
            url: `${host}/ar${path}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: path === "" ? 1.0 : 0.8,
        });
    });

    return sitemap;
}
