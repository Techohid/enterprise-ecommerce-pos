import React from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductService } from "@/services/product.service";
import { SlidersHorizontal, Search, RotateCcw } from "lucide-react";

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    vendor?: string;
    sort?: "relevance" | "price_asc" | "price_desc" | "rating";
  }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { q, category } = await searchParams;
  const title = q
    ? `Search results for "${q}" | NextCommerce`
    : category
    ? `${category} Products | NextCommerce`
    : "Marketplace Catalog & Products | NextCommerce";

  return {
    title,
    description: "Explore authentic products from certified flagship vendors. Enjoy real-time stock and nationwide delivery.",
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const { q, category, vendor, sort } = await searchParams;

  const [catalogResult, categories, vendors] = await Promise.all([
    ProductService.getProducts({
      categorySlug: category,
      vendorSlug: vendor,
      searchQuery: q,
      sortBy: sort,
      limit: 24,
    }),
    ProductService.getCategories(),
    ProductService.getVendors(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {q ? `Search: "${q}"` : "All Products"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {catalogResult.products.length} of {catalogResult.total} available items
            </p>
          </div>

          {/* Quick Sorting Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <Link
                href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), sort: "relevance" })}`}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  !sort || sort === "relevance" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Featured
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), sort: "price_asc" })}`}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  sort === "price_asc" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), sort: "price_desc" })}`}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  sort === "price_desc" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Price: High to Low
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), sort: "rating" })}`}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  sort === "rating" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Top Rated
              </Link>
            </div>
          </div>
        </div>

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Faceted Filter Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filter Catalog</h3>
                {(category || vendor || q) && (
                  <Link href="/shop" className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </Link>
                )}
              </div>

              {/* Categories Filter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h4>
                <div className="space-y-1 text-xs">
                  <Link
                    href="/shop"
                    className={`block py-1.5 px-2.5 rounded-lg transition-colors ${
                      !category ? "bg-sky-50 text-sky-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${c.slug}`}
                      className={`block py-1.5 px-2.5 rounded-lg transition-colors ${
                        category === c.slug ? "bg-sky-50 text-sky-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Vendors Filter */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendors</h4>
                <div className="space-y-1 text-xs">
                  {vendors.map((v) => (
                    <Link
                      key={v.id}
                      href={`/shop?vendor=${v.slug}`}
                      className={`block py-1.5 px-2.5 rounded-lg transition-colors ${
                        vendor === v.slug ? "bg-sky-50 text-sky-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {v.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {catalogResult.products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-base font-bold text-slate-800">No products matched your search or filters.</p>
                <p className="text-xs text-slate-500">Try adjusting your keywords or clearing the category filter.</p>
                <Link
                  href="/shop"
                  className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {catalogResult.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
