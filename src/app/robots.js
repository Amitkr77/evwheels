export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/order-success/",
          "/profile/",
        ],
      },
    ],
    sitemap: "https://evwheels.in/sitemap.xml",
  };
}
