"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Check } from "lucide-react";
import { MockProduct } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: MockProduct }) {
  const [added, setAdded] = useState(false);
  const primaryVariant = product.variants[0];
  const inStock = product.variants.some((v) => v.stock > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;

    // Persist to local cart state
    const currentCart = JSON.parse(localStorage.getItem("nc_cart") || "[]");
    const existingIndex = currentCart.findIndex((item: any) => item.variantId === primaryVariant.id);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({
        variantId: primaryVariant.id,
        quantity: 1,
      });
    }

    localStorage.setItem("nc_cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cart_updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Product Image & Badges */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-slate-50 overflow-hidden block">
        <Image
          src={product.images[0]?.url || "/placeholder-product.webp"}
          alt={product.images[0]?.altText || product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Brand Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border border-slate-200">
          {product.brand}
        </span>

        {/* Discount Tag */}
        {product.comparePrice && product.comparePrice > product.basePrice && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            -{Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)}%
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-sky-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            Sold by <span className="font-medium text-slate-700">{product.vendorName}</span>
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-slate-900">
              {formatCurrency(product.basePrice)}
            </div>
            {product.comparePrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatCurrency(product.comparePrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : inStock
                ? "bg-slate-900 hover:bg-sky-600 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : inStock ? (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            ) : (
              <span>Out of Stock</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
