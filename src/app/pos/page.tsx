"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { POSService, PosCartItem, PosSessionData } from "@/services/pos.service";
import { ProductService } from "@/services/product.service";
import { MockProduct } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { 
  Barcode, 
  Search, 
  Trash2, 
  Printer, 
  PauseCircle, 
  PlayCircle, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  X,
  Plus,
  Minus
} from "lucide-react";

export default function PosTerminalPage() {
  const [session, setSession] = useState<PosSessionData>(POSService.getActiveSession());
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogProducts, setCatalogProducts] = useState<MockProduct[]>([]);
  const [tenderedCash, setTenderedCash] = useState<number>(0);
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [heldOrdersCount, setHeldOrdersCount] = useState(0);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ProductService.getProducts({ limit: 50 }).then((res) => {
      setCatalogProducts(res.products);
    });
    setHeldOrdersCount(POSService.getHeldOrders().length);
  }, []);

  // Keep barcode input ready for physical scanners
  const focusScanner = () => {
    barcodeInputRef.current?.focus();
  };

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setErrorMsg("");
    const matched = await POSService.scanBarcode(barcodeInput.trim());
    if (matched) {
      addItemToCart(matched);
      setBarcodeInput("");
    } else {
      setErrorMsg(`Barcode "${barcodeInput}" not recognized.`);
    }
  };

  const addItemToCart = (item: PosCartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.variantId === item.variantId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        copy[idx].totalPrice = copy[idx].quantity * copy[idx].unitPrice;
        return copy;
      }
      return [...prev, item];
    });
  };

  const updateCartQty = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.variantId === variantId) {
            const newQty = Math.max(0, i.quantity + delta);
            return { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalAmount = Math.max(0, subtotal - discountAmount);
  const change = Math.max(0, tenderedCash - totalAmount);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setErrorMsg("");

    const result = await POSService.checkoutPosSale({
      items: cart,
      customerName,
      customerPhone,
      discountAmount,
      tenderedCash: tenderedCash > 0 ? tenderedCash : totalAmount,
    });

    if (result.success && result.receipt) {
      setActiveReceipt(result.receipt);
      setCart([]);
      setTenderedCash(0);
      setDiscountAmount(0);
      setSession(POSService.getActiveSession());
    } else {
      setErrorMsg(result.error || "POS Transaction failed.");
    }
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    POSService.holdOrder(customerName, cart);
    setCart([]);
    setHeldOrdersCount(POSService.getHeldOrders().length);
  };

  const handleRecallOrder = () => {
    const held = POSService.getHeldOrders();
    if (held.length > 0) {
      const recalled = POSService.recallHeldOrder(held[0].id);
      if (recalled) {
        setCart(recalled.items);
        setCustomerName(recalled.customerName);
        setHeldOrdersCount(POSService.getHeldOrders().length);
      }
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* POS Top Terminal Header */}
      <header className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Storefront
          </Link>
          <span className="text-slate-700">|</span>
          <span className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {session.registerName}
          </span>
          <span className="text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded text-[11px]">
            {session.cashierName}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Shift Opening Float:</span>
            <span className="font-semibold text-white">{formatCurrency(session.openingCash)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Session Sales:</span>
            <span className="font-bold text-emerald-400">{formatCurrency(session.totalSales)}</span>
          </div>
          {heldOrdersCount > 0 && (
            <button
              onClick={handleRecallOrder}
              className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 font-semibold"
            >
              <PlayCircle className="w-3.5 h-3.5" /> Recall Held ({heldOrdersCount})
            </button>
          )}
        </div>
      </header>

      {/* Main Terminal Workspace */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Column: Fast Product Lookup & Visual Grid (7 cols) */}
        <div className="col-span-7 p-4 border-r border-slate-800 flex flex-col gap-4 overflow-hidden">
          {/* Barcode Scanner & Search Bar */}
          <div className="grid grid-cols-2 gap-3">
            <form onSubmit={handleBarcodeSubmit} className="relative">
              <input
                ref={barcodeInputRef}
                type="text"
                placeholder="Scan Barcode (USB/Bluetooth)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
              />
              <Barcode className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div className="relative">
              <input
                type="text"
                placeholder="Search catalog by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Quick Selection Product Cards */}
          <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pr-1">
            {catalogProducts
              .filter(
                (p) =>
                  !searchQuery ||
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.sku.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product) => {
                const variant = product.variants[0];
                return (
                  <button
                    key={product.id}
                    onClick={() =>
                      addItemToCart({
                        variantId: variant.id,
                        productId: product.id,
                        name: product.name,
                        sku: variant.sku,
                        barcode: variant.barcode,
                        unitPrice: variant.price,
                        quantity: 1,
                        totalPrice: variant.price,
                      })
                    }
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all flex flex-col justify-between hover:border-sky-500 active:scale-98"
                  >
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">
                        {product.brand}
                      </div>
                      <div className="text-xs font-semibold text-white line-clamp-2 mt-0.5">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        BAR: {variant.barcode}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-2">
                      <span className="text-xs font-bold text-emerald-400">
                        {formatCurrency(variant.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Stock: {variant.stock}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Column: POS Cart, Customer Details, Payment & Cash Change (5 cols) */}
        <div className="col-span-5 bg-slate-950/70 p-5 flex flex-col justify-between overflow-hidden">
          {/* Cart Table Header */}
          <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                Current Register Cart ({cart.length})
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={handleHoldOrder}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                >
                  <PauseCircle className="w-3.5 h-3.5" /> Hold Order
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {cart.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                  <Barcode className="w-8 h-8 opacity-40" />
                  <span>Scan barcode or click items to build invoice</span>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {formatCurrency(item.unitPrice)} each
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQty(item.variantId, -1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold w-5 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.variantId, 1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        {formatCurrency(item.totalPrice)}
                      </div>
                      <button
                        onClick={() => updateCartQty(item.variantId, -item.quantity)}
                        className="text-[10px] text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Customer, Tendered Cash & Settlement Footer */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <input
                type="tel"
                placeholder="Phone (SMS receipt)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            {/* Quick Tendered Cash Calculation */}
            <div className="grid grid-cols-2 gap-3 items-center bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Tendered Cash (৳)</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={tenderedCash || ""}
                  onChange={(e) => setTenderedCash(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono text-white font-bold"
                />
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Change Returned</span>
                <span className={`text-base font-black font-mono block mt-1 ${change > 0 ? "text-amber-400" : "text-slate-400"}`}>
                  {formatCurrency(change)}
                </span>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex items-center justify-between text-sm py-1">
              <span className="font-semibold text-slate-300">Total Payable:</span>
              <span className="text-2xl font-black text-emerald-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-99 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              Confirm Sale & Print Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Official 80mm POS Thermal Receipt Modal & Print Area */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white text-black p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Thermal Print Target Container */}
            <div id="pos-receipt-print-area" className="space-y-3 font-mono text-xs">
              <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
                <h3 className="font-black text-base uppercase">NextCommerce Retail</h3>
                <p className="text-[10px]">Outlet: Multiplan Center, Dhaka</p>
                <p className="text-[10px]">VAT Reg: 001293847-0101</p>
                <p className="text-[10px]">Receipt #: {activeReceipt.receiptNumber}</p>
                <p className="text-[10px]">{new Date(activeReceipt.timestamp).toLocaleString("en-BD")}</p>
              </div>

              <div className="space-y-1.5 border-b border-dashed border-slate-400 pb-3">
                <div className="text-[10px] font-bold">Customer: {activeReceipt.customerName}</div>
                <div className="text-[10px]">Cashier: {activeReceipt.cashierName}</div>
              </div>

              <div className="space-y-1 divide-y divide-dotted divide-slate-300 border-b border-dashed border-slate-400 pb-3">
                {activeReceipt.items.map((item: any, i: number) => (
                  <div key={i} className="pt-1 flex justify-between">
                    <div>
                      <div>{item.name}</div>
                      <div className="text-[10px] text-slate-600">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </div>
                    </div>
                    <div className="font-bold">{formatCurrency(item.totalPrice)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1 text-right text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(activeReceipt.subtotal)}</span>
                </div>
                {activeReceipt.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(activeReceipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm border-t border-slate-300 pt-1">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(activeReceipt.total)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Tendered:</span>
                  <span>{formatCurrency(activeReceipt.tendered)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span>Change:</span>
                  <span>{formatCurrency(activeReceipt.change)}</span>
                </div>
              </div>

              <div className="text-center pt-3 text-[10px] text-slate-500 border-t border-dashed border-slate-400">
                <p>Thank you for shopping with us!</p>
                <p>Stock synchronized online in real-time.</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-2 pt-2 print:hidden">
              <button
                onClick={printReceipt}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800"
              >
                <Printer className="w-4 h-4" /> Print Thermal Receipt
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
