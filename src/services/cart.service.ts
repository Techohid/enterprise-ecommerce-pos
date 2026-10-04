import { MOCK_PRODUCTS, MOCK_COUPONS } from "@/lib/mock-data";

export interface CartLineItem {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  sku: string;
  barcode: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  vendorId: string;
  vendorName: string;
}

export interface CalculatedCart {
  items: CartLineItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  appliedCoupon: {
    code: string;
    description: string;
    discountValue: number;
  } | null;
  itemsByVendor: Record<
    string,
    {
      vendorName: string;
      items: CartLineItem[];
      subtotal: number;
    }
  >;
}

export class CartService {
  /**
   * Recalculates cart items completely on the server.
   * Never trusts any price, tax, or discount submitted by the browser.
   */
  static calculateCart(
    rawItems: { variantId: string; quantity: number }[],
    couponCode?: string,
    shippingFee: number = 120 // standard delivery in BDT
  ): CalculatedCart {
    const verifiedItems: CartLineItem[] = [];
    let subtotal = 0;

    for (const raw of rawItems) {
      if (raw.quantity <= 0) continue;

      let foundProduct: (typeof MOCK_PRODUCTS)[0] | undefined;
      let foundVariant: (typeof MOCK_PRODUCTS)[0]["variants"][0] | undefined;

      for (const p of MOCK_PRODUCTS) {
        const v = p.variants.find((v) => v.id === raw.variantId);
        if (v) {
          foundProduct = p;
          foundVariant = v;
          break;
        }
      }

      if (!foundProduct || !foundVariant) continue;

      // Ensure quantity does not exceed available stock
      const safeQty = Math.min(raw.quantity, Math.max(1, foundVariant.stock));
      const lineTotal = foundVariant.price * safeQty;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: foundProduct.id,
        variantId: foundVariant.id,
        name: foundProduct.name,
        variantName: foundVariant.name,
        sku: foundVariant.sku,
        barcode: foundVariant.barcode,
        image: foundProduct.images[0]?.url || "",
        unitPrice: foundVariant.price,
        quantity: safeQty,
        totalPrice: lineTotal,
        vendorId: foundProduct.vendorId,
        vendorName: foundProduct.vendorName,
      });
    }

    // Apply Coupon Verification
    let discountAmount = 0;
    let appliedCoupon: CalculatedCart["appliedCoupon"] = null;

    if (couponCode) {
      const match = MOCK_COUPONS.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
      );

      if (match) {
        if (!match.minSpend || subtotal >= match.minSpend) {
          if (match.discountType === "PERCENTAGE") {
            const rawDiscount = (subtotal * match.discountValue) / 100;
            discountAmount = match.maxDiscount ? Math.min(rawDiscount, match.maxDiscount) : rawDiscount;
          } else {
            discountAmount = Math.min(match.discountValue, subtotal);
          }
          appliedCoupon = {
            code: match.code,
            description: match.description,
            discountValue: discountAmount,
          };
        }
      }
    }

    // Free delivery over ৳50,000 or custom calculation
    const finalShipping = subtotal > 50000 || verifiedItems.length === 0 ? 0 : shippingFee;
    const taxAmount = 0; // standard inclusive tax or calculated
    const totalAmount = Math.max(0, subtotal - discountAmount + finalShipping + taxAmount);

    // Group items by vendor for transparent shipping/vendor breakdown
    const itemsByVendor: CalculatedCart["itemsByVendor"] = {};
    for (const item of verifiedItems) {
      if (!itemsByVendor[item.vendorId]) {
        itemsByVendor[item.vendorId] = {
          vendorName: item.vendorName,
          items: [],
          subtotal: 0,
        };
      }
      itemsByVendor[item.vendorId].items.push(item);
      itemsByVendor[item.vendorId].subtotal += item.totalPrice;
    }

    return {
      items: verifiedItems,
      subtotal,
      discountAmount,
      shippingAmount: finalShipping,
      taxAmount,
      totalAmount,
      appliedCoupon,
      itemsByVendor,
    };
  }
}
