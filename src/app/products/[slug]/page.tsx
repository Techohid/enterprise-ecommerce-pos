import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductService } from "@/services/product.service";
import { SEOService } from "@/services/seo.service";
import { formatCurrency } from "@/lib/utils";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Store, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Share2
} from "lucide-react";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return SEOService.getProductMetadata(product);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Generate initial HTML Schema.org JSON-LD
  const productJsonLd = SEOService.generateProductJsonLd(product);
  const breadcrumbJsonLd = SEOService.generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: product.category, url: `/category/${product.categorySlug}` },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      {/* Search Engine Schema.org JSON-LD (Initial HTML) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href={`/category/${product.categorySlug}`} className="hover:text-slate-900 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs">
          <ProductDetailClient product={product} />
        </div>

        {/* Specifications & Vendor Guarantee Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Specifications */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Technical Specifications</h2>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-3 py-3">
                <span className="text-slate-500 font-medium">SKU / Model</span>
                <span className="col-span-2 text-slate-900 font-mono">{product.sku}</span>
              </div>
              <div className="grid grid-cols-3 py-3">
                <span className="text-slate-500 font-medium">Global Barcode (GTIN)</span>
                <span className="col-span-2 text-slate-900 font-mono">{product.barcode || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 py-3">
                <span className="text-slate-500 font-medium">Brand</span>
                <span className="col-span-2 text-slate-900 font-semibold">{product.brand}</span>
              </div>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 py-3">
                  <span className="text-slate-500 font-medium">{key}</span>
                  <span className="col-span-2 text-slate-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Full Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>
            </div>
          </div>

          {/* Seller / Fulfillment Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-sky-600" /> Sold By
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                  {product.vendorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{product.vendorName}</h4>
                  <p className="text-xs text-emerald-600 font-medium">Official Flagship Store</p>
                </div>
              </div>
              <Link
                href={`/store/${product.vendorSlug}`}
                className="w-full block text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                View Vendor Profile & Other Products
              </Link>
            </div>

            {/* Delivery & Warranty Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">Nationwide Delivery</h4>
                  <p className="text-xs text-slate-500">2-3 Days delivery across all 64 districts in Bangladesh.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">7 Days Return Guarantee</h4>
                  <p className="text-xs text-slate-500">Change of mind is not applicable. Return if damaged or defective.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">1 Year Official Warranty</h4>
                  <p className="text-xs text-slate-500">100% authentic brand warranty coverage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
