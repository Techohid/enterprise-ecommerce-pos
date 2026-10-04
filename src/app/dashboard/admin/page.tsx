"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OrderService, PlacedOrder } from "@/services/order.service";
import { ProductService } from "@/services/product.service";
import { AuditService } from "@/services/audit.service";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { 
  ShieldCheck, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Store, 
  AlertTriangle, 
  MonitorCheck,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [fetchedOrders, catalogResult] = await Promise.all([
      OrderService.getOrders(),
      ProductService.getProducts({ limit: 50 }),
    ]);
    setOrders(fetchedOrders);
    setProducts(catalogResult.products);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    await OrderService.updateOrderStatus(orderNumber, newStatus, "usr_admin_01");
    fetchData();
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 485000); // base simulated historical revenue
  const totalOrders = orders.length + 38;
  const lowStockProducts = products.filter((p) => p.variants.some((v: any) => v.stock < 10));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation */}
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
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight leading-none">
                Super Admin Operations Portal
              </h1>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Live Multi-Vendor & POS Synchronizer
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pos"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <MonitorCheck className="w-3.5 h-3.5" /> Launch POS Terminal
          </Link>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Gross Sales (Online + POS)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</div>
            <div className="text-[11px] text-emerald-400 font-medium">↑ 18.4% vs last period</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Processed Orders</span>
              <ShoppingBag className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalOrders}</div>
            <div className="text-[11px] text-slate-400 font-medium">Across all fulfillment channels</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Verified Vendors</span>
              <Store className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">2 Flagship Stores</div>
            <div className="text-[11px] text-slate-400 font-medium">Star Tech & Apex Heritage</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Low-Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{lowStockProducts.length} Items</div>
            <div className="text-[11px] text-slate-400 font-medium">Requires replenishment</div>
          </div>
        </div>

        {/* Orders Fulfillment State Machine Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Recent Customer & POS Orders</h2>
              <p className="text-xs text-slate-400">Manage fulfillment transitions with audit tracking</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No orders placed in current session yet. Place a test order via storefront checkout or POS terminal.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Order Number</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Current Status</th>
                    <th className="pb-3 font-semibold text-right">Update Lifecycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-sky-400">{order.orderNumber}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          order.paymentMethod === "POS_CASH" ? "bg-emerald-500/20 text-emerald-300" : "bg-sky-500/20 text-sky-300"
                        }`}>
                          {order.paymentMethod === "POS_CASH" ? "Retail POS" : "Online Web"}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-white">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3 text-slate-300">{order.paymentMethod.replace(/_/g, " ")}</td>
                      <td className="py-3">
                        <span className="font-semibold text-emerald-400">{order.status}</span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderNumber, e.target.value as OrderStatus)}
                          className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock & Warehouse Inventory Monitoring */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Central Warehouse Stock Snapshot (Dhaka Central Distribution)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {products.slice(0, 4).map((p) => {
              const v = p.variants[0];
              return (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 font-mono">SKU: {v.sku}</div>
                  <div className="font-bold text-white truncate">{p.name}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Available:</span>
                    <span className={`font-mono font-black text-sm ${v.stock < 10 ? "text-amber-400" : "text-emerald-400"}`}>
                      {v.stock} units
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
