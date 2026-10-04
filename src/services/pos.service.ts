import { PosSessionStatus, PaymentMethodType } from "@prisma/client";
import { ProductService } from "./product.service";
import { OrderService } from "./order.service";
import { generateReceiptNumber } from "@/lib/utils";
import { AuditService } from "./audit.service";

export interface PosSessionData {
  id: string;
  registerId: string;
  registerName: string;
  cashierId: string;
  cashierName: string;
  warehouseId: string;
  openingCash: number;
  closingCash: number | null;
  totalSales: number;
  status: PosSessionStatus;
  openedAt: string;
  closedAt: string | null;
}

export interface PosCartItem {
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface SplitPaymentDetail {
  method: "CASH" | "CARD" | "BKASH" | "NAGAD";
  amount: number;
  transactionRef?: string;
}

// In-memory active session tracking for POS
let activeSession: PosSessionData = {
  id: "session_pos_dhk_01",
  registerId: "reg_01",
  registerName: "Terminal 01 - Main Counter",
  cashierId: "usr_cashier_01",
  cashierName: "Tariqul Islam (Lead Cashier)",
  warehouseId: "wh_main_dhaka",
  openingCash: 5000, // ৳5,000 cash drawer float
  closingCash: null,
  totalSales: 0,
  status: PosSessionStatus.OPEN,
  openedAt: new Date().toISOString(),
  closedAt: null,
};

const heldOrders: { id: string; customerName: string; items: PosCartItem[]; timestamp: string }[] = [];

export class POSService {
  static getActiveSession(): PosSessionData {
    return activeSession;
  }

  static openSession(openingCash: number, cashierName: string): PosSessionData {
    activeSession = {
      id: `session_${Date.now()}`,
      registerId: "reg_01",
      registerName: "Terminal 01 - Main Counter",
      cashierId: "usr_cashier_01",
      cashierName,
      warehouseId: "wh_main_dhaka",
      openingCash,
      closingCash: null,
      totalSales: 0,
      status: PosSessionStatus.OPEN,
      openedAt: new Date().toISOString(),
      closedAt: null,
    };
    return activeSession;
  }

  static closeSession(closingCash: number): PosSessionData {
    activeSession.status = PosSessionStatus.CLOSED;
    activeSession.closingCash = closingCash;
    activeSession.closedAt = new Date().toISOString();
    return activeSession;
  }

  /**
   * Barcode scanner handler. Supports physical USB/Bluetooth hardware scanners
   * emitting standard keyboard characters + Enter key.
   */
  static async scanBarcode(barcode: string): Promise<PosCartItem | null> {
    const match = await ProductService.getProductByBarcode(barcode);
    if (!match || !match.selectedVariant) return null;

    return {
      variantId: match.selectedVariant.id,
      productId: match.product.id,
      name: `${match.product.name} (${match.selectedVariant.name})`,
      sku: match.selectedVariant.sku,
      barcode: match.selectedVariant.barcode,
      unitPrice: match.selectedVariant.price,
      quantity: 1,
      totalPrice: match.selectedVariant.price,
    };
  }

  /**
   * Completes a POS sale, creating the unified order, deducting warehouse stock,
   * handling cash change, and generating an official customer receipt.
   */
  static async checkoutPosSale(params: {
    items: PosCartItem[];
    customerName?: string;
    customerPhone?: string;
    discountAmount?: number;
    tenderedCash?: number;
    splitPayments?: SplitPaymentDetail[];
  }): Promise<{
    success: boolean;
    receipt?: {
      receiptNumber: string;
      orderNumber: string;
      customerName: string;
      subtotal: number;
      discount: number;
      total: number;
      tendered: number;
      change: number;
      items: PosCartItem[];
      cashierName: string;
      timestamp: string;
    };
    error?: string;
  }> {
    if (params.items.length === 0) {
      return { success: false, error: "POS Cart is empty" };
    }

    const orderPayload = {
      items: params.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      paymentMethod: PaymentMethodType.POS_CASH,
      shippingAddress: {
        fullName: params.customerName || "Walk-in Customer",
        phone: params.customerPhone || "N/A",
        street: "POS In-Store Checkout",
        city: "Dhaka",
        district: "Dhaka",
      },
      isPosOrder: true,
    };

    const orderResult = await OrderService.createOrder(orderPayload);
    if (!orderResult.success || !orderResult.order) {
      return { success: false, error: orderResult.error || "POS checkout failed" };
    }

    const receiptNumber = generateReceiptNumber();
    const subtotal = params.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = params.discountAmount || 0;
    const finalTotal = Math.max(0, subtotal - discount);
    const tendered = params.tenderedCash || finalTotal;
    const change = Math.max(0, tendered - finalTotal);

    // Update active register shift total
    activeSession.totalSales += finalTotal;

    await AuditService.record({
      action: "POS_SALE_COMPLETED",
      entity: "PosTransaction",
      entityId: receiptNumber,
      newValues: { total: finalTotal, tendered, change },
    });

    return {
      success: true,
      receipt: {
        receiptNumber,
        orderNumber: orderResult.order.orderNumber,
        customerName: params.customerName || "Walk-in Customer",
        subtotal,
        discount,
        total: finalTotal,
        tendered,
        change,
        items: params.items,
        cashierName: activeSession.cashierName,
        timestamp: new Date().toISOString(),
      },
    };
  }

  static holdOrder(customerName: string, items: PosCartItem[]) {
    const id = `hold_${Date.now()}`;
    heldOrders.push({ id, customerName, items, timestamp: new Date().toISOString() });
    return id;
  }

  static getHeldOrders() {
    return heldOrders;
  }

  static recallHeldOrder(id: string) {
    const idx = heldOrders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const [recalled] = heldOrders.splice(idx, 1);
    return recalled;
  }
}
