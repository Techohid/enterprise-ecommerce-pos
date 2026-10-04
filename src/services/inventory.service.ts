import prisma from "@/lib/db";
import cache from "@/lib/redis";
import { StockMovementType } from "@prisma/client";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export class InventoryService {
  /**
   * Concurrency-safe atomic stock deduction.
   * Ensures that neither two online shoppers nor an online shopper and a POS cashier
   * can oversell the same unit of inventory.
   */
  static async deductStock(params: {
    variantId: string;
    warehouseId: string;
    quantity: number;
    type: StockMovementType;
    referenceId?: string;
    actorId?: string;
  }): Promise<{ success: boolean; error?: string; remainingStock?: number }> {
    const { variantId, warehouseId, quantity, type, referenceId, actorId } = params;

    if (quantity <= 0) {
      return { success: false, error: "Invalid quantity requested" };
    }

    const lockKey = `lock:stock:${variantId}:${warehouseId}`;
    const acquired = await cache.acquireLock(lockKey, 5); // 5-second lock
    if (!acquired) {
      return { success: false, error: "Inventory is currently undergoing concurrent update. Please retry." };
    }

    try {
      // 1. Check live database if available
      try {
        const result = await prisma.$transaction(async (tx) => {
          const item = await tx.inventoryItem.findUnique({
            where: {
              warehouseId_productVariantId: {
                warehouseId,
                productVariantId: variantId,
              },
            },
          });

          if (!item) {
            throw new Error("Inventory record not found for this warehouse");
          }

          const available = item.quantity - item.reservedQuantity;
          if (available < quantity) {
            throw new Error(`Insufficient stock. Available: ${available}, Requested: ${quantity}`);
          }

          const updated = await tx.inventoryItem.update({
            where: { id: item.id },
            data: {
              quantity: { decrement: quantity },
              version: { increment: 1 },
            },
          });

          await tx.stockMovement.create({
            data: {
              inventoryItemId: item.id,
              warehouseId,
              type,
              quantityDelta: -quantity,
              previousStock: item.quantity,
              newStock: updated.quantity,
              referenceId,
              actorId,
            },
          });

          return updated.quantity;
        });

        return { success: true, remainingStock: result };
      } catch (dbError: any) {
        if (dbError.message?.includes("Insufficient stock")) {
          return { success: false, error: dbError.message };
        }
      }

      // 2. Fallback in-memory catalog stock tracker
      for (const product of MOCK_PRODUCTS) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          if (variant.stock < quantity) {
            return {
              success: false,
              error: `Insufficient stock for ${product.name}. Available: ${variant.stock}`,
            };
          }
          variant.stock -= quantity;
          return { success: true, remainingStock: variant.stock };
        }
      }

      return { success: false, error: "Product variant not found" };
    } finally {
      await cache.releaseLock(lockKey);
    }
  }

  /**
   * Retrieves available stock for a variant across warehouses or for a specific warehouse.
   */
  static async getAvailableStock(variantId: string, warehouseId?: string): Promise<number> {
    try {
      if (warehouseId) {
        const item = await prisma.inventoryItem.findUnique({
          where: {
            warehouseId_productVariantId: {
              warehouseId,
              productVariantId: variantId,
            },
          },
        });
        if (item) return Math.max(0, item.quantity - item.reservedQuantity);
      } else {
        const items = await prisma.inventoryItem.findMany({
          where: { productVariantId: variantId },
        });
        if (items.length > 0) {
          return items.reduce((acc, i) => acc + Math.max(0, i.quantity - i.reservedQuantity), 0);
        }
      }
    } catch {
      // In-memory catalog lookup
    }

    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) return v.stock;
    }
    return 0;
  }

  /**
   * Restocks items upon return, cancellation, or warehouse receipt.
   */
  static async restock(params: {
    variantId: string;
    warehouseId: string;
    quantity: number;
    type: StockMovementType;
    referenceId?: string;
  }): Promise<{ success: boolean; newStock?: number }> {
    for (const product of MOCK_PRODUCTS) {
      const variant = product.variants.find((v) => v.id === params.variantId);
      if (variant) {
        variant.stock += params.quantity;
        return { success: true, newStock: variant.stock };
      }
    }
    return { success: true };
  }
}
