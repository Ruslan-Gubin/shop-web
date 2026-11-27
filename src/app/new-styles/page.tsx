import type { Metadata } from "next";
import { Suspense } from "react";
import {
  fetchPopularSearchAction,
  fetchProductsMainPage,
  fetchSuggestionsAction,
} from "@/app/action";
import { PreviewShell } from "./components/PreviewShell/PreviewShell";

export const metadata: Metadata = {
  title: "Предпросмотр нового стиля — Raduga",
};

export default async function NewStylesPage() {
  const [productsData, popular] = await Promise.all([
    fetchProductsMainPage(12),
    fetchPopularSearchAction(),
  ]);

  const popularList = Array.isArray(popular)
    ? popular.map((el) => el.text)
    : [];
  const products = productsData.data?.products || [];

  return (
    <Suspense fallback={null}>
      <PreviewShell
        popular={popularList}
        products={products}
        fetchSuggestionsAction={fetchSuggestionsAction}
      />
    </Suspense>
  );
}
