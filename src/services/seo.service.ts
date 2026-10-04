import { Metadata } from "next";
import { MockProduct, MockCategory } from "@/lib/mock-data";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = "NextCommerce Enterprise";

export class SEOService {
  /**
   * Generates dynamic SEO metadata for product detail pages.
   */
  static getProductMetadata(product: MockProduct): Metadata {
    const title = `${product.name} | Best Price in Bangladesh`;
    const description = product.shortDescription || `${product.name} available at ${SITE_NAME}. Check specifications, warranty, and fast nationwide delivery.`;
    const canonical = `${SITE_URL}/products/${product.slug}`;
    const primaryImage = product.images[0]?.url || `${SITE_URL}/og-default.jpg`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: SITE_NAME,
        images: [
          {
            url: primaryImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [primaryImage],
      },
    };
  }

  /**
   * Generates dynamic SEO metadata for category and subcategory pages.
   * Protects crawl budget: sets robots to noindex if excessive query parameters are present.
   */
  static getCategoryMetadata(category: MockCategory, hasFacetedFilters = false): Metadata {
    const title = `${category.name} Online at Best Price in Bangladesh | ${SITE_NAME}`;
    const description = category.description;
    const canonical = `${SITE_URL}/category/${category.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      robots: hasFacetedFilters
        ? {
            index: false,
            follow: true,
          }
        : {
            index: true,
            follow: true,
          },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: SITE_NAME,
        images: [{ url: category.image, width: 800, height: 600, alt: category.name }],
      },
    };
  }

  /**
   * Generates Google Merchant & Shopping compliant Schema.org JSON-LD structured data.
   */
  static generateProductJsonLd(product: MockProduct) {
    const inStock = product.variants.some((v) => v.stock > 0);

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: product.images.map((img) => img.url),
      description: product.fullDescription || product.shortDescription,
      sku: product.sku,
      gtin: product.barcode,
      mpn: product.sku,
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/products/${product.slug}`,
        priceCurrency: "BDT",
        price: product.basePrice,
        priceValidUntil: "2027-12-31",
        itemCondition: "https://schema.org/NewCondition",
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: product.vendorName,
        },
      },
      aggregateRating: product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    };
  }

  /**
   * Generates BreadcrumbList Schema.org JSON-LD structured data.
   */
  static generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    };
  }
}
