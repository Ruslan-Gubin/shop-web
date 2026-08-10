import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CatalogProducts } from "./catalog/Categories/Products/Products";
import { fetchProductsMainPage } from "./product/action";

export default async function HomePage(req: {
  searchParams: Promise<{ page: string; name?: string }>;
}) {
  const patch = "/";
  const limit = 30;
  const searchParams = await req.searchParams;
  const productsData = await fetchProductsMainPage(limit, searchParams.page);
  const paginationPage = productsData.data?.paginationPage;
  const totalCount = productsData.data?.totalCount || 0;
  const products = productsData.data?.products || [];

  const isLoadMoreDisabled = getIsLoadMoreDisabled(paginationPage, totalCount, limit);

  return (
    <section className="page-wrapper">
      {productsData?.tokens && <UpdateToken tokens={productsData.tokens} />}
      {productsData.status === "error" && productsData.message && (
        <ErrorAlert message={productsData.message} />
      )}
      <CatalogProducts
        key={patch}
        limit={limit}
        total={totalCount}
        patch={patch}
        isLoadMoreDisabled={isLoadMoreDisabled}
        searchParams={searchParams}
        products={products}
        showFullWidth={true}
        isHomePage
      />
    </section>
  );
}
