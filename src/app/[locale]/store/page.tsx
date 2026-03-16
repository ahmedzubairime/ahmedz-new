import { useTranslations } from "next-intl";

export default function StorePage() {
    const t = useTranslations("store");

    const stats = [
        { key: "products", value: "256" },
        { key: "categories", value: "18" },
        { key: "orders", value: "1.2K" },
        { key: "revenue", value: "$48K" },
    ] as const;

    const products = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        price: `$${(Math.random() * 200 + 20).toFixed(0)}`,
        inStock: i !== 3 && i !== 7,
    }));

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {t(`stats.${stat.key}`)}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Product Grid */}
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {t("title")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        {/* Product image placeholder */}
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <div className="size-16 rounded-xl bg-zinc-200 dark:bg-zinc-700 transition-transform group-hover:scale-110" />
                        </div>
                        <div className="p-4">
                            {/* Skeleton title */}
                            <div className="mb-2 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                            {/* Skeleton subtitle */}
                            <div className="mb-4 h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    {product.price}
                                </span>
                                <button
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${product.inStock
                                            ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                            : "cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                                        }`}
                                    disabled={!product.inStock}
                                >
                                    {product.inStock ? t("product.addToCart") : t("product.outOfStock")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
