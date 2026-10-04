import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductService } from "@/services/product.service";
import { SEOService } from "@/services/seo.service";
import { ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await ProductService.getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return SEOService.getCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await ProductService.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const catalogResult = await ProductService.getProducts({
    categorySlug: slug,
    limit: 24,
  });

  const breadcrumbJsonLd = SEOService.generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: category.name, url: `/category/${category.slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{category.name}</h1>
          <p className="text-slate-500 text-sm max-w-2xl">{category.description}</p>

          {/* Subcategories Pills */}
          {category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {category.subcategories.map((sub) => (
                <span
                  key={sub.slug}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Showing {catalogResult.products.length} products</span>
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
