import { OrderStatus, PaymentStatus, PaymentMethodType, StockMovementType } from "@prisma/client";
import { CartService } from "./cart.service";
import { InventoryService } from "./inventory.service";
import { AuditService } from "./audit.service";
import { generateOrderNumber } from "@/lib/utils";

export interface CreateOrderParams {
  customerId?: string;
  items: { variantId: string; quantity: number }[];
  couponCode?: string;
  paymentMethod: PaymentMethodType;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  notes?: string;
  isPosOrder?: boolean;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  customerId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: any;
  items: any[];
  createdAt: string;
}

// In-memory persistent order registry for dev/testing
const ORDERS_DB: PlacedOrder[] = [];

export class OrderService {
  /**
   * Atomically creates an order, calculates costs on the server,
   * deducts inventory, and records timeline audit events.
   */
  static async createOrder(params: CreateOrderParams): Promise<{
    success: boolean;
    order?: PlacedOrder;
    error?: string;
  }> {
    // 1. Recalculate cart securely on server
    const calculated = CartService.calculateCart(params.items, params.couponCode);

    if (calculated.items.length === 0) {
      return { success: false, error: "Cart contains no valid or in-stock items" };
    }

    const orderNumber = generateOrderNumber();
    const warehouseId = "wh_main_dhaka";

    // 2. Concurrency-safe atomic stock deduction for all line items
    for (const item of calculated.items) {
      const deduction = await InventoryService.deductStock({
        variantId: item.variantId,
        warehouseId,
        quantity: item.quantity,
        type: params.isPosOrder ? StockMovementType.POS_SALE : StockMovementType.ONLINE_SALE,
        referenceId: orderNumber,
        actorId: params.customerId,
      });

      if (!deduction.success) {
        return {
          success: false,
          error: `Stock deduction failed for "${item.name}": ${deduction.error}`,
        };
      }
    }

    // 3. Create Order Record
    const newOrder: PlacedOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerId: params.customerId,
      status: OrderStatus.CONFIRMED,
      paymentStatus:
        params.paymentMethod === PaymentMethodType.CASH_ON_DELIVERY ||
        params.paymentMethod === PaymentMethodType.POS_CASH
          ? PaymentStatus.PENDING
          : PaymentStatus.PAID,
      paymentMethod: params.paymentMethod,
      subtotal: calculated.subtotal,
      discountAmount: calculated.discountAmount,
      shippingAmount: calculated.shippingAmount,
      taxAmount: calculated.taxAmount,
      totalAmount: calculated.totalAmount,
      shippingAddress: params.shippingAddress,
      items: calculated.items.map((i) => ({
        ...i,
        commissionAmount: (i.totalPrice * 10) / 100, // 10% marketplace commission
        vendorEarning: (i.totalPrice * 90) / 100,
      })),
      createdAt: new Date().toISOString(),
    };

    ORDERS_DB.unshift(newOrder);

    // 4. Record Audit Log
    await AuditService.record({
      actorId: params.customerId,
      action: params.isPosOrder ? "POS_ORDER_CREATED" : "ONLINE_ORDER_CREATED",
      entity: "Order",
      entityId: orderNumber,
      newValues: { totalAmount: newOrder.totalAmount, itemsCount: newOrder.items.length },
    });

    return { success: true, order: newOrder };
  }

  static async getOrders(): Promise<PlacedOrder[]> {
    return ORDERS_DB;
  }

  static async getOrderByNumber(orderNumber: string): Promise<PlacedOrder | null> {
    return ORDERS_DB.find((o) => o.orderNumber === orderNumber) || null;
  }

  static async updateOrderStatus(
    orderNumber: string,
    status: OrderStatus,
    actorId?: string
  ): Promise<boolean> {
    const order = ORDERS_DB.find((o) => o.orderNumber === orderNumber);
    if (!order) return false;

    const oldStatus = order.status;
    order.status = status;

    await AuditService.record({
      actorId,
      action: "ORDER_STATUS_UPDATED",
      entity: "Order",
      entityId: orderNumber,
      oldValues: { status: oldStatus },
      newValues: { status },
    });

    return true;
  }
}
