"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartService, CalculatedCart } from "@/services/cart.service";
import { OrderService } from "@/services/order.service";
import { PaymentMethodType } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Lock,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<{ variantId: string; quantity: number }[]>([]);
  const [calculated, setCalculated] = useState<CalculatedCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Customer & Shipping Form
  const [fullName, setFullName] = useState("Kazi Mohammad Rahat");
  const [phone, setPhone] = useState("+880 1711 234567");
  const [street, setStreet] = useState("House 42, Road 11, Block D, Banani");
  const [city, setCity] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("1213");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodType.CASH_ON_DELIVERY);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nc_cart") || "[]");
    setCartItems(stored);
    const result = CartService.calculateCart(stored);
    setCalculated(result);
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculated || calculated.items.length === 0) {
      setErrorMsg("Your cart is empty. Please add items before checking out.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await OrderService.createOrder({
        items: cartItems,
        paymentMethod,
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          district,
          postalCode,
        },
      });

      if (response.success && response.order) {
        // Clear customer cart
        localStorage.removeItem("nc_cart");
        window.dispatchEvent(new Event("cart_updated"));
        router.push(`/order-success?orderNumber=${response.order.orderNumber}`);
      } else {
        setErrorMsg(response.error || "Failed to place order. Please review your details.");
      }
    } catch {
      setErrorMsg("An unexpected network error occurred while processing checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Express Secure Checkout</h1>
            <p className="text-xs text-slate-500">Provide delivery coordinates and select payment preference</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Delivery Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" /> 1. Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone (for Courier SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address, House & Road *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City / Area *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" /> 2. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === PaymentMethodType.CASH_ON_DELIVERY
                      ? "border-sky-600 bg-sky-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === PaymentMethodType.CASH_ON_DELIVERY}
                    onChange={() => setPaymentMethod(PaymentMethodType.CASH_ON_DELIVERY)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Pay in cash upon physical receipt & parcel inspection
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === PaymentMethodType.MOBILE_FINANCIAL_SERVICE
                      ? "border-sky-600 bg-sky-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === PaymentMethodType.MOBILE_FINANCIAL_SERVICE}
                    onChange={() => setPaymentMethod(PaymentMethodType.MOBILE_FINANCIAL_SERVICE)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">bKash / Nagad / Rocket</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Instant mobile financial wallet transfer
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === PaymentMethodType.ONLINE_CARD
                      ? "border-sky-600 bg-sky-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === PaymentMethodType.ONLINE_CARD}
                    onChange={() => setPaymentMethod(PaymentMethodType.ONLINE_CARD)}
                    className="mt-1"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Visa / Mastercard / Amex</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Encrypted local & international debit/credit card
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Checkout Review Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Review Items</h3>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                {calculated?.items.map((item) => (
                  <div key={item.variantId} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 block truncate">{item.name}</span>
                      <span className="text-slate-400">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(calculated?.subtotal || 0)}</span>
                </div>
                {calculated?.discountAmount ? (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(calculated.discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-600">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {calculated?.shippingAmount === 0 ? "FREE" : formatCurrency(calculated?.shippingAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-base font-bold text-slate-900 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-sky-600 text-lg font-black">
                    {formatCurrency(calculated?.totalAmount || 0)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !calculated || calculated.items.length === 0}
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:bg-slate-300"
              >
                {loading ? "Confirming Order..." : "Confirm & Place Order"} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Guaranteed safe & PCI-DSS compliant checkout
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
