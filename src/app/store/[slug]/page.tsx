import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductService } from "@/services/product.service";
import { 
  Store, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Award 
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const vendor = await ProductService.getVendorBySlug(slug);
  if (!vendor) return { title: "Store Not Found" };

  return {
    title: `${vendor.name} - Official Flagship Store | NextCommerce`,
    description: vendor.description,
  };
}

export default async function VendorStorePage({ params }: Props) {
  const { slug } = await params;
  const vendor = await ProductService.getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const catalogResult = await ProductService.getProducts({
    vendorSlug: slug,
    limit: 24,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Vendor Banner & Profile Header */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="relative h-48 md:h-64 w-full bg-slate-900">
            <Image src={vendor.banner} alt={vendor.name} fill className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 -mt-16 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-xl shrink-0">
                <Image src={vendor.logo} alt={vendor.name} fill className="object-cover" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{vendor.name}</h1>
                  {vendor.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Award className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-800">{vendor.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({vendor.reviewCount} store reviews)</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {vendor.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-600" /> {vendor.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-600" /> {vendor.email}
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Products Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Store Catalog ({catalogResult.products.length} products listed)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catalogResult.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
