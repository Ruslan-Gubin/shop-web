import { declOfNum } from "@/shared/helpers/declOfNum";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchUserReviewsData } from "./action";
import { UserReviewsList } from "./components/UserReviewsList/UserReviewsList";
import { UserReviewsTabs } from "./components/UserReviewsTabs/UserReviewsTabs";
import { emptyStates } from "./helpers/emptyStates";
import { getUserReviewsViewFlag } from "./helpers/url";
import type { UserReviewsSearchParams } from "./types";

const limit = 30;

export default async function UserReviewsPage(req: {
  searchParams: Promise<UserReviewsSearchParams>;
}) {
  const searchParams = await req.searchParams;
  const viewFlag = getUserReviewsViewFlag(searchParams);
  const page = searchParams.page && Number(searchParams.page) > 0 ? searchParams.page : "1";

  const { productsData, userData, productsOriginData } = await fetchUserReviewsData(
    viewFlag,
    page,
    limit,
  );

  const products = (productsData.data?.products || []).map((product) => {
    const productOrigin = productsOriginData?.data?.find((item) => item.id === product.id);

    return { ...product, photos: productOrigin?.photos || [] };
  });

  const total = productsData.data?.totalCount || 0;
  const paginationPage = productsData.data?.paginationPage || 1;
  const phone = userData.data?.phone || "";

  const isLoadMoreDisabled = getIsLoadMoreDisabled(String(paginationPage), total, limit);
  const emptyState = emptyStates[viewFlag];

  return (
    <section className="page-wrapper">
      {productsOriginData?.tokens && <UpdateToken tokens={productsOriginData.tokens} />}

      {phone.length === 0 ? (
        <NotContent
          title="Войдите, чтобы посмотреть отзывы и вопросы"
          subTitle="Отзывы и вопросы доступны после входа в аккаунт."
          href="/sign-in"
          buttonText="Войти"
        />
      ) : (
        <section className="page-wrapper">
          <PageHeader
            title="Отзывы и вопросы"
            subtitle={
              total > 0 ? `${total} ${declOfNum(total, ["товар", "товара", "товаров"])}` : undefined
            }
          />
          <UserReviewsTabs viewFlag={viewFlag} />
          <ErrorList errorsList={[productsData, userData]} />

          {products.length > 0 ? (
            <UserReviewsList
              patch="/user-reviews"
              products={products}
              viewFlag={viewFlag}
              limit={limit}
              total={total}
              isLoadMoreDisabled={isLoadMoreDisabled}
              searchParams={searchParams}
            />
          ) : (
            <NotContent
              title={emptyState.title}
              subTitle={emptyState.subTitle}
              href={emptyState.href}
              buttonText={emptyState.buttonText}
            />
          )}
        </section>
      )}
    </section>
  );
}
