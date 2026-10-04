import React from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { OrderService } from "@/services/order.service";
import { formatCurrency } from "@/lib/utils";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Printer 
} from "lucide-react";

interface Props {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderNumber } = await searchParams;
  const order = orderNumber ? await OrderService.getOrderByNumber(orderNumber) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full space-y-8">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank you! Your order is placed.
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Order Reference:{" "}
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {orderNumber || "ORD-PENDING"}
            </span>
          </p>
          <p className="text-xs text-slate-400">
            A confirmation SMS with parcel tracking will be dispatched to your phone number shortly.
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 block">Status</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                  {order.status}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block text-right">Payment Method</span>
                <span className="text-xs font-semibold text-slate-800">
                  {order.paymentMethod.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Items ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-100 text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block text-xs">{item.name}</span>
                      <span className="text-slate-400 text-xs">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-900 text-xs">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>{order.shippingAmount === 0 ? "FREE" : formatCurrency(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-sky-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
