import type { Metadata } from "next";

export interface CustomMetadata extends Metadata {
  title: string;
  description: string;
  locale?: string;
  image?: string;
  url?: string;
  siteName?: string;
  og_description?: string;
  og_title?: string;
}

export const getMetadata = ({
  title = "Raduga — интернет‑магазин: всё, что нужно каждый день",
  description = "В Raduga — товары для праздника, дома и сада, игрушки, аксессуары, текстиль, посуда, бытовая химия и хозтовары. Удобный каталог и карточки с подробными характеристиками помогут быстро найти нужное.",
  locale = "ru",
  image = "/assets/logo.png",
  url = "https://shop-admin-lyart.vercel.app/", //TODO change url
  siteName = "Raduga",
  og_description,
  og_title,
}: CustomMetadata): Metadata => {
  const metadata = {
    metadataBase: url,
    openGraph: {
      type: "website",
      url,
      emails: "gubin_ruslan@rambler.ru",
      phoneNumbers: "+7 949 386-57-86",
      siteName,
      locale,
      title: og_title || title,
      description: og_description || description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: url,
      title,
      description: og_description || description,
      images: {
        url: image,
      },
      creator: siteName,
    },
    category: locale === "ru" ? "Торговля" : "Trading",
    alternates: {
      canonical: url,
    },
    manifest: "/manifest.json",
    title,
    description,
    other: {},
  };

  return metadata;
};
