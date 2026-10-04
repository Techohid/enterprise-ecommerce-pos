"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartService, CalculatedCart } from "@/services/cart.service";
import { formatCurrency } from "@/lib/utils";
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Check, 
  ShieldCheck, 
  Plus, 
  Minus 
} from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<{ variantId: string; quantity: number }[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [calculated, setCalculated] = useState<CalculatedCart | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = JSON.parse(localStorage.getItem("nc_cart") || "[]");
    setCartItems(stored);
  }, []);

  useEffect(() => {
    if (isClient) {
      const result = CartService.calculateCart(cartItems, couponCode);
      setCalculated(result);
    }
  }, [cartItems, couponCode, isClient]);

  const updateQuantity = (variantId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.variantId === variantId) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
    localStorage.setItem("nc_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const removeItem = (variantId: string) => {
    const updated = cartItems.filter((i) => i.variantId !== variantId);
    setCartItems(updated);
    localStorage.setItem("nc_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading shopping cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-sky-600" />
            Shopping Cart
          </h1>
          <span className="text-sm font-semibold text-slate-500">
            {calculated?.items.length || 0} unique item(s)
          </span>
        </div>

        {(!calculated || calculated.items.length === 0) ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your cart is currently empty</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Explore our marketplace products and flash deals to discover authentic tech and lifestyle essentials.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Grouped by Vendor */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(calculated.itemsByVendor).map(([vendorId, vendorGroup]) => (
                <div key={vendorId} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Vendor Header */}
                  <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Package from: {vendorGroup.vendorName}</span>
                    <span className="text-slate-500 font-medium">Subtotal: {formatCurrency(vendorGroup.subtotal)}</span>
                  </div>

                  {/* Items List */}
                  <div className="p-6 divide-y divide-slate-100">
                    {vendorGroup.items.map((item) => (
                      <div key={item.variantId} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{item.variantName}</p>
                          <div className="text-sm font-bold text-slate-900 mt-1">
                            {formatCurrency(item.unitPrice)}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                          <button
                            onClick={() => updateQuantity(item.variantId, -1)}
                            className="p-1.5 text-slate-500 hover:text-slate-900"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, 1)}
                            className="p-1.5 text-slate-500 hover:text-slate-900"
                            aria-label="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total & Remove */}
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            {formatCurrency(item.totalPrice)}
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 mt-1 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Coupon Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Order Summary</h2>

                {/* Coupon Code Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Have a Coupon Code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try WELCOME10 or EID2026"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase font-mono"
                    />
                  </div>
                  {calculated.appliedCoupon && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{calculated.appliedCoupon.description}</span>
                    </div>
                  )}
                </div>

                {/* Costs Breakdown */}
                <div className="divide-y divide-slate-100 text-xs space-y-2 pt-2">
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculated.subtotal)}</span>
                  </div>
                  {calculated.discountAmount > 0 && (
                    <div className="flex justify-between py-1 text-emerald-600 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-{formatCurrency(calculated.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-slate-900">
                      {calculated.shippingAmount === 0 ? "FREE" : formatCurrency(calculated.shippingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 text-base font-bold text-slate-900 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-sky-600 text-xl font-black">{formatCurrency(calculated.totalAmount)}</span>
                  </div>
                </div>

                {/* Proceed CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Bank-Grade 256-bit Encrypted Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
