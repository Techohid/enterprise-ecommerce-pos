import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products/", "/category/", "/brand/", "/store/", "/shop", "/deals"],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/account/",
          "/cart/",
          "/checkout/",
          "/pos/",
          "/api/",
          "/internal/",
          "/order-success/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
