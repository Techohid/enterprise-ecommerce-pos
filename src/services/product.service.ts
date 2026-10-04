import prisma, { isDatabaseReachable } from "@/lib/db";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_VENDORS, MockProduct } from "@/lib/mock-data";

export interface ProductFilterOptions {
  categorySlug?: string;
  vendorSlug?: string;
  brandSlug?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Retrieves featured products for the storefront home page and banners.
   */
  static async getFeaturedProducts(limit = 8): Promise<MockProduct[]> {
    if (await isDatabaseReachable()) {
      try {
        const dbProducts = await prisma.product.findMany({
          where: { isFeatured: true, status: "ACTIVE" },
          take: limit,
          include: {
            images: true,
            variants: true,
            category: true,
            vendor: true,
            brand: true,
          },
        });

        if (dbProducts && dbProducts.length > 0) {
          return dbProducts.map((p) => this.mapDbProductToDto(p));
        }
      } catch {
        // Fallback
      }
    }

    return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  }

  /**
   * Dynamic catalog search with filters and sorting for category/shop pages.
   */
  static async getProducts(options: ProductFilterOptions = {}): Promise<{
    products: MockProduct[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 12;

    if (await isDatabaseReachable()) {
      try {
        const whereClause: any = { status: "ACTIVE" };
        if (options.categorySlug) {
          whereClause.category = { slug: options.categorySlug };
        }
        if (options.vendorSlug) {
          whereClause.vendor = { slug: options.vendorSlug };
        }
        if (options.searchQuery) {
          whereClause.OR = [
            { name: { contains: options.searchQuery, mode: "insensitive" } },
            { sku: { contains: options.searchQuery, mode: "insensitive" } },
            { barcode: { contains: options.searchQuery, mode: "insensitive" } },
          ];
        }

        const total = await prisma.product.count({ where: whereClause });
        const dbProducts = await prisma.product.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            images: true,
            variants: true,
            category: true,
            vendor: true,
            brand: true,
          },
        });

        if (dbProducts && dbProducts.length > 0) {
          return {
            products: dbProducts.map((p) => this.mapDbProductToDto(p)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
          };
        }
      } catch {
        // Fallback
      }
    }

    let filtered = [...MOCK_PRODUCTS];

    if (options.categorySlug) {
      filtered = filtered.filter((p) => p.categorySlug === options.categorySlug);
    }
    if (options.vendorSlug) {
      filtered = filtered.filter((p) => p.vendorSlug === options.vendorSlug);
    }
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (options.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.basePrice <= options.maxPrice!);
    }

    if (options.sortBy === "price_asc") {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (options.sortBy === "price_desc") {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (options.sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves single product by its clean SEO slug.
   */
  static async getProductBySlug(slug: string): Promise<MockProduct | null> {
    if (await isDatabaseReachable()) {
      try {
        const dbProduct = await prisma.product.findUnique({
          where: { slug },
          include: {
            images: true,
            variants: true,
            category: true,
            vendor: true,
            brand: true,
          },
        });

        if (dbProduct) {
          return this.mapDbProductToDto(dbProduct);
        }
      } catch {
        // Fallback
      }
    }

    const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return found || null;
  }

  /**
   * High-speed barcode lookup designed for POS hardware scanners.
   */
  static async getProductByBarcode(barcode: string): Promise<{
    product: MockProduct;
    selectedVariant?: MockProduct["variants"][0];
  } | null> {
    const trimmed = barcode.trim();
    for (const product of MOCK_PRODUCTS) {
      if (product.barcode === trimmed) {
        return { product, selectedVariant: product.variants[0] };
      }
      const matchedVariant = product.variants.find((v) => v.barcode === trimmed);
      if (matchedVariant) {
        return { product, selectedVariant: matchedVariant };
      }
    }
    return null;
  }

  static async getCategories() {
    return MOCK_CATEGORIES;
  }

  static async getCategoryBySlug(slug: string) {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
  }

  static async getVendors() {
    return MOCK_VENDORS;
  }

  static async getVendorBySlug(slug: string) {
    return MOCK_VENDORS.find((v) => v.slug === slug) || null;
  }

  private static mapDbProductToDto(p: any): MockProduct {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      barcode: p.barcode || "",
      brand: p.brand?.name || "Generic",
      category: p.category?.name || "Uncategorized",
      categorySlug: p.category?.slug || "general",
      vendorId: p.vendorId,
      vendorName: p.vendor?.storeName || "Marketplace",
      vendorSlug: p.vendor?.slug || "store",
      shortDescription: p.shortDescription || "",
      fullDescription: p.fullDescription || "",
      basePrice: Number(p.basePrice),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      status: p.status,
      isFeatured: p.isFeatured,
      rating: Number(p.rating || 5.0),
      reviewCount: p.reviewCount || 0,
      specifications: (p.specifications as Record<string, string>) || {},
      images: p.images?.length
        ? p.images.map((img: any) => ({
            url: img.url,
            altText: img.altText || p.name,
            isDefault: img.isDefault,
          }))
        : [{ url: "/placeholder-product.webp", altText: p.name, isDefault: true }],
      variants: p.variants?.length
        ? p.variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            barcode: v.barcode || "",
            price: Number(v.price),
            comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
            stock: 10,
            attributes: (v.attributes as Record<string, string>) || {},
          }))
        : [
            {
              id: `${p.id}_std`,
              name: "Standard",
              sku: p.sku,
              barcode: p.barcode || "",
              price: Number(p.basePrice),
              comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
              stock: 10,
              attributes: {},
            },
          ],
    };
  }
}
