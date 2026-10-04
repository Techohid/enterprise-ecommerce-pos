export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  brand: string;
  category: string;
  categorySlug: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number;
  comparePrice: number | null;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  isFeatured: boolean;
  images: { url: string; altText: string; isDefault: boolean }[];
  variants: {
    id: string;
    name: string;
    sku: string;
    barcode: string;
    price: number;
    comparePrice: number | null;
    stock: number;
    attributes: Record<string, string>;
  }[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  subcategories: { name: string; slug: string }[];
}

export interface MockVendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviewCount: number;
  commissionRate: number;
  isVerified: boolean;
  phone: string;
  email: string;
  address: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: "cat_electronics",
    name: "Electronics & Gadgets",
    slug: "electronics",
    description: "Smartphones, laptops, audio gear, and modern accessories.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    itemCount: 48,
    subcategories: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Laptops & Computers", slug: "laptops" },
      { name: "Audio & Headphones", slug: "headphones" },
      { name: "Smart Watches", slug: "smart-watches" },
    ],
  },
  {
    id: "cat_fashion",
    name: "Fashion & Lifestyle",
    slug: "fashion",
    description: "Premium clothing, footwear, and artisanal traditional apparel.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
    itemCount: 84,
    subcategories: [
      { name: "Men's Collection", slug: "mens-collection" },
      { name: "Women's Ethnic Wear", slug: "womens-ethnic" },
      { name: "Footwear", slug: "footwear" },
    ],
  },
  {
    id: "cat_appliances",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Quality appliances and aesthetic interior items for contemporary homes.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    itemCount: 32,
    subcategories: [
      { name: "Coffee Makers", slug: "coffee-makers" },
      { name: "Air Fryers", slug: "air-fryers" },
      { name: "Smart Blenders", slug: "blenders" },
    ],
  },
];

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: "ven_star_tech",
    name: "Star Tech Official Store",
    slug: "star-tech",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    description: "Premier authorized distributor of authentic tech products, audio components, and laptops in Bangladesh.",
    rating: 4.8,
    reviewCount: 328,
    commissionRate: 8.5,
    isVerified: true,
    phone: "+880 1711 000001",
    email: "support@startech-mall.bd",
    address: "Multiplan Center, New Elephant Road, Dhaka-1205",
  },
  {
    id: "ven_apex",
    name: "Apex Heritage Outlet",
    slug: "apex-heritage",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    description: "Crafted genuine leather shoes, formal footwear, and daily comfort sneakers.",
    rating: 4.9,
    reviewCount: 412,
    commissionRate: 10.0,
    isVerified: true,
    phone: "+880 1812 000002",
    email: "outlet@apex-store.bd",
    address: "Gulshan-1 Avenue, Dhaka-1212",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod_iphone16_pro",
    name: "iPhone 16 Pro Max 256GB - Titanium Natural",
    slug: "iphone-16-pro-max-titanium",
    sku: "APL-IP16PM-256",
    barcode: "8901234567890",
    brand: "Apple",
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    vendorId: "ven_star_tech",
    vendorName: "Star Tech Official Store",
    vendorSlug: "star-tech",
    shortDescription: "A18 Pro chip, Grade 5 titanium design, 48MP Fusion camera system with 4K 120 fps Dolby Vision.",
    fullDescription: "Experience extraordinary speed, incredible camera depth, and supreme battery efficiency. The aerospace-grade titanium frame brings featherlight durability and sleek contours.",
    basePrice: 178500,
    comparePrice: 185000,
    status: "ACTIVE",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 42,
    specifications: {
      Chipset: "Apple A18 Pro (3nm)",
      Display: "6.9-inch Super Retina XDR OLED 120Hz ProMotion",
      Storage: "256GB NVMe",
      Camera: "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto",
      Battery: "4685 mAh with MagSafe Fast Charge",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
        altText: "iPhone 16 Pro Max Natural Titanium Front & Rear",
        isDefault: true,
      },
      {
        url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
        altText: "iPhone 16 Pro Triple Lens Camera Array",
        isDefault: false,
      },
    ],
    variants: [
      {
        id: "var_ip16pm_nat_256",
        name: "Natural Titanium / 256GB",
        sku: "APL-IP16PM-NAT-256",
        barcode: "8901234567890",
        price: 178500,
        comparePrice: 185000,
        stock: 14,
        attributes: { Color: "Natural Titanium", Storage: "256GB" },
      },
      {
        id: "var_ip16pm_blk_512",
        name: "Black Titanium / 512GB",
        sku: "APL-IP16PM-BLK-512",
        barcode: "8901234567891",
        price: 198500,
        comparePrice: 205000,
        stock: 8,
        attributes: { Color: "Black Titanium", Storage: "512GB" },
      },
    ],
  },
  {
    id: "prod_sony_wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    slug: "sony-wh-1000xm5-noise-cancelling",
    sku: "SNY-WHXM5-BLK",
    barcode: "8901234567892",
    brand: "Sony",
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    vendorId: "ven_star_tech",
    vendorName: "Star Tech Official Store",
    vendorSlug: "star-tech",
    shortDescription: "Industry-leading noise cancellation with two processors and 8 microphones. Hi-Res Audio wireless.",
    fullDescription: "Immerse yourself in crystal clear music. Features Auto NC Optimizer for personalized noise cancellation, Speak-to-Chat, and 30-hour battery life with rapid charging.",
    basePrice: 38500,
    comparePrice: 42000,
    status: "ACTIVE",
    isFeatured: true,
    rating: 4.8,
    reviewCount: 96,
    specifications: {
      BatteryLife: "30 Hours ANC On",
      Bluetooth: "Version 5.2 with LDAC, AAC, SBC",
      Driver: "30mm precision carbon fiber composite",
      Weight: "250g Ultra-Comfort fit",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        altText: "Sony WH-1000XM5 Black Studio View",
        isDefault: true,
      },
    ],
    variants: [
      {
        id: "var_sny_xm5_blk",
        name: "Midnight Black",
        sku: "SNY-WHXM5-BLK",
        barcode: "8901234567892",
        price: 38500,
        comparePrice: 42000,
        stock: 22,
        attributes: { Color: "Midnight Black" },
      },
      {
        id: "var_sny_xm5_slv",
        name: "Silver Platinum",
        sku: "SNY-WHXM5-SLV",
        barcode: "8901234567893",
        price: 38500,
        comparePrice: 42000,
        stock: 11,
        attributes: { Color: "Silver Platinum" },
      },
    ],
  },
  {
    id: "prod_apex_derby_leather",
    name: "Apex Venturini Handcrafted Genuine Leather Derby Shoes",
    slug: "apex-venturini-leather-derby",
    sku: "APX-VENT-DERB-01",
    barcode: "8901234567894",
    brand: "Apex",
    category: "Fashion & Lifestyle",
    categorySlug: "fashion",
    vendorId: "ven_apex",
    vendorName: "Apex Heritage Outlet",
    vendorSlug: "apex-heritage",
    shortDescription: "Full-grain calfskin leather, hand-burnished finish with cushioned ortholite insole for corporate sophistication.",
    fullDescription: "Crafted by master cobblers, the Venturini Derby pairs timeless European silhouette with all-day comfort for formal boardroom assemblies and celebrations.",
    basePrice: 8990,
    comparePrice: 9990,
    status: "ACTIVE",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 78,
    specifications: {
      Material: "100% Genuine Full Grain Leather",
      Sole: "Anti-skid Goodyear Welted Rubber Sole",
      Insole: "Memory Foam Ergonomic Footbed",
      Origin: "Handmade in Bangladesh",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        altText: "Apex Handcrafted Leather Shoe Side Profile",
        isDefault: true,
      },
    ],
    variants: [
      {
        id: "var_apx_derb_41",
        name: "Cognac Brown / EU 41",
        sku: "APX-VENT-BRN-41",
        barcode: "8901234567894",
        price: 8990,
        comparePrice: 9990,
        stock: 15,
        attributes: { Color: "Cognac Brown", Size: "EU 41" },
      },
      {
        id: "var_apx_derb_42",
        name: "Cognac Brown / EU 42",
        sku: "APX-VENT-BRN-42",
        barcode: "8901234567895",
        price: 8990,
        comparePrice: 9990,
        stock: 18,
        attributes: { Color: "Cognac Brown", Size: "EU 42" },
      },
      {
        id: "var_apx_derb_43",
        name: "Cognac Brown / EU 43",
        sku: "APX-VENT-BRN-43",
        barcode: "8901234567896",
        price: 8990,
        comparePrice: 9990,
        stock: 7,
        attributes: { Color: "Cognac Brown", Size: "EU 43" },
      },
    ],
  },
  {
    id: "prod_macbook_pro_m3",
    name: "MacBook Pro 14-inch M3 Pro Chip 18GB / 512GB SSD",
    slug: "macbook-pro-14-m3-pro-space-black",
    sku: "APL-MBP14-M3P",
    barcode: "8901234567897",
    brand: "Apple",
    category: "Electronics & Gadgets",
    categorySlug: "electronics",
    vendorId: "ven_star_tech",
    vendorName: "Star Tech Official Store",
    vendorSlug: "star-tech",
    shortDescription: "Liquid Retina XDR display, up to 18 hours of battery life, hardware-accelerated ray tracing.",
    fullDescription: "The most advanced Mac laptop ever built for pro workflows. Handles high-resolution rendering, code compiling, and machine learning with supreme acoustic silence.",
    basePrice: 245000,
    comparePrice: 255000,
    status: "ACTIVE",
    isFeatured: true,
    rating: 5.0,
    reviewCount: 31,
    specifications: {
      Processor: "Apple M3 Pro (11-core CPU, 14-core GPU)",
      Memory: "18GB Unified Memory",
      Display: "14.2-inch Liquid Retina XDR (3024x1964) 1000 nits sustained",
      Ports: "3x Thunderbolt 4, HDMI, SDXC card slot, MagSafe 3",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        altText: "MacBook Pro 14 Space Black Workspace",
        isDefault: true,
      },
    ],
    variants: [
      {
        id: "var_mbp14_spblk_512",
        name: "Space Black / 18GB / 512GB",
        sku: "APL-MBP14-SPB-512",
        barcode: "8901234567897",
        price: 245000,
        comparePrice: 255000,
        stock: 6,
        attributes: { Color: "Space Black", Storage: "512GB" },
      },
    ],
  },
];

export const MOCK_COUPONS = [
  {
    code: "WELCOME10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minSpend: 2000,
    maxDiscount: 1500,
    isActive: true,
    description: "10% off for first-time shoppers (Min spend ৳2,000, Max discount ৳1,500)",
  },
  {
    code: "EID2026",
    discountType: "FIXED_AMOUNT",
    discountValue: 1000,
    minSpend: 10000,
    maxDiscount: 1000,
    isActive: true,
    description: "Flat ৳1,000 discount on cart value above ৳10,000",
  },
];
