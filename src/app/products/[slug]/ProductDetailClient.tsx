"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MockProduct } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { 
  Star, 
  ShoppingCart, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Plus,
  Minus
} from "lucide-react";

export function ProductDetailClient({ product }: { product: MockProduct }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = selectedVariant.stock > 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!inStock) return;

    const currentCart = JSON.parse(localStorage.getItem("nc_cart") || "[]");
    const existingIndex = currentCart.findIndex((i: any) => i.variantId === selectedVariant.id);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push({
        variantId: selectedVariant.id,
        quantity: quantity,
      });
    }

    localStorage.setItem("nc_cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cart_updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
          <Image
            src={product.images[activeImageIndex]?.url || product.images[0]?.url}
            alt={product.images[activeImageIndex]?.altText || product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Thumbnail switcher if multiple images exist */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === idx ? "border-sky-600 scale-95" : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt={img.altText} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information & Variants */}
      <div className="space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {formatCurrency(selectedVariant.price)}
              </div>
              {selectedVariant.comparePrice && selectedVariant.comparePrice > selectedVariant.price && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(selectedVariant.comparePrice)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Save {formatCurrency(selectedVariant.comparePrice - selectedVariant.price)}
                  </span>
                </div>
              )}
            </div>

            {/* In-Stock Indicator */}
            <div>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In Stock ({selectedVariant.stock} units)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-600" /> Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select Edition / Variant
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedVariant.id === v.id
                        ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900">{v.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{formatCurrency(v.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quantity
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-slate-100 text-slate-600"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                className="p-2 hover:bg-slate-100 text-slate-600"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              added
                ? "bg-emerald-600 text-white"
                : inStock
                ? "bg-slate-900 hover:bg-slate-800 text-white"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              inStock
                ? "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <Zap className="w-4 h-4" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
