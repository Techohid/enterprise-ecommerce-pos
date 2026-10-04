import React from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductService } from "@/services/product.service";
import { Zap, Clock, ShieldCheck, Flame } from "lucide-react";

export const metadata = {
  title: "Flash Deals & Seasonal Offers | NextCommerce",
  description: "Limited-time flash discounts on authentic flagship electronics, shoes, and gadgets. Up to 40% off with nationwide delivery in Bangladesh.",
};

export default async function DealsPage() {
  const products = await ProductService.getFeaturedProducts(12);
  const discounted = products.filter((p) => p.comparePrice && p.comparePrice > p.basePrice);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Deals Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white p-8 md:p-12 border border-rose-900/40 shadow-xl">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Flame className="w-3.5 h-3.5 fill-current" /> Special Campaign Deals
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Exclusive Flash Sale & Instant Savings
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Genuine warranty-backed items with direct supplier price drops. Limited units available across Dhaka and nationwide delivery hubs.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{discounted.length} Active Deals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {discounted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
