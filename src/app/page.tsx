import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductService } from "@/services/product.service";
import { 
  Zap, 
  ArrowRight, 
  MonitorCheck, 
  Store, 
  TrendingUp, 
  Award,
  Sparkles
} from "lucide-react";

export const metadata = {
  title: "NextCommerce | Enterprise Multi-Vendor Marketplace & POS",
  description: "Next-generation multi-vendor e-commerce platform with unified real-time POS, atomic inventory synchronization, and fast delivery in Bangladesh.",
};

export default async function HomePage() {
  const [featuredProducts, categories, vendors] = await Promise.all([
    ProductService.getFeaturedProducts(8),
    ProductService.getCategories(),
    ProductService.getVendors(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-12">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Marketplace & Physical POS Engine
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Enterprise Multi-Vendor Commerce, Engineered for Scale.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Shop authentic gadgets, fashion, and lifestyle essentials from verified flagship vendors.
              Synchronized real-time inventory between web storefront and retail POS terminals.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
              >
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pos"
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-2 border border-slate-700 transition-all"
              >
                <MonitorCheck className="w-4 h-4 text-emerald-400" />
                Launch POS Cashier
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden lg:block pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-sky-500 blur-3xl absolute -top-20 -right-20"></div>
            <div className="w-80 h-80 rounded-full bg-emerald-500 blur-3xl absolute bottom-0 right-32"></div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Featured Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">Browse curated product collections</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <h3 className="font-bold text-lg group-hover:text-sky-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{cat.description}</p>
                  <span className="text-[11px] text-sky-400 font-semibold mt-1">
                    {cat.itemCount}+ products listed
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Deals & Trending */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Today&apos;s Super Deals
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    Limited Stock
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Special seasonal discounts directly from authorized distributors</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-slate-200">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Fast 24-48h Delivery in Dhaka & Chittagong
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* POS & Multi-Channel Banner */}
        <section className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <MonitorCheck className="w-4 h-4" /> Integrated Retail Point of Sale
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Running a Physical Outlet or Pop-up Counter?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Use our built-in POS Terminal with barcode scanner support, split cash/MFS payment calculations,
              cash drawer session balancing, and thermal receipt printing — all synced with your online store.
            </p>
          </div>
          <Link
            href="/pos"
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shrink-0 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            Launch POS Cashier Terminal <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Verified Flagship Vendors */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Verified Flagship Vendors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">Official brand outlets & verified sellers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{vendor.name}</h3>
                    {vendor.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Award className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{vendor.description}</p>
                  <p className="text-xs text-slate-400 pt-1">📍 {vendor.address}</p>
                </div>
                <Link
                  href={`/store/${vendor.slug}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold shrink-0 transition-colors"
                >
                  Visit Store
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
