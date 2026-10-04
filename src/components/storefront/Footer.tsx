import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-16 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800/80 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-slate-400">Fast delivery across 64 districts in Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Authentic Products</h4>
              <p className="text-xs text-slate-400">Directly sourced from authorized brand vendors</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free return policy on verified items</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Secure Payment Gateway</h4>
              <p className="text-xs text-slate-400">Encrypted checkout via bKash, Nagad, Cards & COD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap & Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-base mb-4 tracking-tight">Marketplace</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/category/electronics" className="hover:text-white transition-colors">Electronics & Gadgets</Link></li>
            <li><Link href="/category/fashion" className="hover:text-white transition-colors">Fashion & Apparel</Link></li>
            <li><Link href="/category/home-kitchen" className="hover:text-white transition-colors">Home & Living</Link></li>
            <li><Link href="/deals" className="hover:text-white transition-colors">Flash Deals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-base mb-4 tracking-tight">Enterprise & POS</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/pos" className="hover:text-white transition-colors">Point of Sale (POS) Terminal</Link></li>
            <li><Link href="/dashboard/vendor" className="hover:text-white transition-colors">Sell on NextCommerce (Vendor)</Link></li>
            <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">Super Admin & Operations</Link></li>
            <li><Link href="/api/v1/health" className="hover:text-white transition-colors">System Status & APIs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-base mb-4 tracking-tight">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">Help Center & FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-base mb-4 tracking-tight">Policies & Legal</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery Rates</Link></li>
            <li><Link href="/return-policy" className="hover:text-white transition-colors">Refund & Return Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Payment Badges & Copyright */}
      <div className="border-t border-slate-900 py-6 px-4 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} NextCommerce Technologies. All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px]">bKash</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px]">Nagad</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px]">VISA</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px]">Mastercard</span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px]">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
