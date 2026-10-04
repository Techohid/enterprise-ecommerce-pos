"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import { formatCurrency } from "@/lib/utils";
import { 
  Store, 
  DollarSign, 
  Package, 
  TrendingUp, 
  ArrowLeft, 
  Plus, 
  Clock, 
  CheckCircle,
  Building,
  Smartphone
} from "lucide-react";

export default function VendorDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("45000");

  useEffect(() => {
    ProductService.getProducts({ vendorSlug: "star-tech", limit: 20 }).then((res) => {
      setProducts(res.products);
    });
  }, []);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Vendor Header */}
      <header className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Storefront
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight leading-none">
                Star Tech Official Store
              </h1>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Verified Flagship Vendor Portal
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Commission Rate: <span className="text-white font-bold">8.5%</span> (Standard Tech Category)
        </div>
      </header>

      {/* Main Vendor Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {/* Vendor Earnings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Withdrawable Balance</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">৳142,500.00</div>
            <div className="text-[11px] text-slate-400">Cleared from completed orders</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending Settlements</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">৳38,200.00</div>
            <div className="text-[11px] text-slate-400">Orders currently in transit</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Store Products</span>
              <Package className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">{products.length} Active</div>
            <div className="text-[11px] text-slate-400">Online & in retail inventory</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Lifetime Vendor Revenue</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">৳1,840,000</div>
            <div className="text-[11px] text-emerald-400">Across 14 months trading</div>
          </div>
        </div>

        {/* Payout Withdrawal & Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Your Store Products</h2>
                <p className="text-xs text-slate-400">Active catalog items and synchronized stock counts</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Product Name</th>
                    <th className="pb-3 font-semibold">SKU</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Total Stock</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => {
                    const variant = p.variants[0];
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-white max-w-xs truncate">{p.name}</td>
                        <td className="py-3 font-mono text-slate-400">{variant?.sku}</td>
                        <td className="py-3 font-bold text-emerald-400">{formatCurrency(p.basePrice)}</td>
                        <td className="py-3 font-mono">{variant?.stock} units</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Withdrawal Form (1 col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Request Earnings Payout
            </h2>

            {payoutRequested ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4" /> Withdrawal Requested Successfully
                </div>
                <p className="text-slate-300">
                  Your request for {formatCurrency(parseFloat(payoutAmount))} will be verified by the finance department within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Withdrawal Amount (৳)</label>
                  <input
                    type="number"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Payout Destination</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white">
                    <option>BRAC Bank Ltd (Account ending in 4102)</option>
                    <option>bKash Merchant Wallet (+880 1711 000001)</option>
                    <option>City Bank Ltd (Account ending in 8890)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md"
                >
                  Submit Payout Request
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
