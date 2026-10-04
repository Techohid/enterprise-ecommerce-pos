"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  Store, 
  MonitorCheck, 
  ShieldCheck, 
  Menu, 
  X,
  PhoneCall,
  MapPin
} from "lucide-react";

export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Hotline: +880 9612 000 000 (9am - 10pm)
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Express Delivery across all 64 Districts
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/pos" 
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MonitorCheck className="w-3.5 h-3.5" />
              POS Terminal
            </Link>
            <span className="text-slate-600">|</span>
            <Link 
              href="/dashboard/vendor" 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              Vendor Portal
            </Link>
            <span className="text-slate-600">|</span>
            <Link 
              href="/dashboard/admin" 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Operations & Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
            NC
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              Next<span className="text-sky-600">Commerce</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold block">
              Multi-Vendor & POS Platform
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search 10,000+ products by title, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-sky-600 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Actions & Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-sky-600 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="hidden md:block bg-white border-t border-slate-100 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-8 py-2.5 text-slate-700">
          <Link href="/shop" className="hover:text-sky-600 transition-colors">
            All Products
          </Link>
          <Link href="/category/electronics" className="hover:text-sky-600 transition-colors">
            Electronics & Gadgets
          </Link>
          <Link href="/category/fashion" className="hover:text-sky-600 transition-colors">
            Fashion & Lifestyle
          </Link>
          <Link href="/category/home-kitchen" className="hover:text-sky-600 transition-colors">
            Home & Kitchen
          </Link>
          <Link href="/deals" className="text-rose-600 font-semibold hover:text-rose-700 transition-colors">
            ⚡ Flash Deals
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="mb-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </form>
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
            <Link href="/category/electronics" onClick={() => setMobileMenuOpen(false)}>Electronics & Gadgets</Link>
            <Link href="/category/fashion" onClick={() => setMobileMenuOpen(false)}>Fashion & Lifestyle</Link>
            <Link href="/category/home-kitchen" onClick={() => setMobileMenuOpen(false)}>Home & Kitchen</Link>
            <Link href="/deals" className="text-rose-600" onClick={() => setMobileMenuOpen(false)}>⚡ Flash Deals</Link>
            <hr className="my-2 border-slate-200" />
            <Link href="/pos" className="text-emerald-600 flex items-center gap-2">
              <MonitorCheck className="w-4 h-4" /> POS Cashier Terminal
            </Link>
            <Link href="/dashboard/vendor" className="text-slate-700 flex items-center gap-2">
              <Store className="w-4 h-4" /> Vendor Dashboard
            </Link>
            <Link href="/dashboard/admin" className="text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Super Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
