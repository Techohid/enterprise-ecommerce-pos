import { MetadataRoute } from "next";
import { ProductService } from "@/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const [catalogResult, categories, vendors] = await Promise.all([
    ProductService.getProducts({ limit: 100 }),
    ProductService.getCategories(),
    ProductService.getVendors(),
  ]);

  const productUrls: MetadataRoute.Sitemap = catalogResult.products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vendorUrls: MetadataRoute.Sitemap = vendors.map((vendor) => ({
    url: `${baseUrl}/store/${vendor.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...productUrls, ...vendorUrls];
}
