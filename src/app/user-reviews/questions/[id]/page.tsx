import { createQuestionAction } from "@/app/catalog/detail/[id]/action";
import { QuestionsForm } from "@/app/questions/[product_id]/components/form/QuestionsForm";
import { QuestionsList } from "@/app/questions/[product_id]/components/list/QuestionsList";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { EMPTY_IMG_SVG } from "@/shared/helpers/listenerImgError";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { ProductInfo } from "@/widgets/product/product-info/ProductInfo";
import { fetchUserProductQuestionsData } from "../../action";
import type { UserReviewsSearchParams } from "../../types";

const limit = 30;

export default async function UserProductQuestionsPage(req: {
  params: Promise<{ id: string }>;
  searchParams: Promise<UserReviewsSearchParams>;
}) {
  const { id } = await req.params;
  const searchParams = await req.searchParams;
  const page = searchParams.page && Number(searchParams.page) > 0 ? searchParams.page : "1";

  const [productData, pricesData, stocksData, questionsData, userData] =
    await fetchUserProductQuestionsData(id, page, limit);

  const product = productData.data;
  const prices = pricesData.data || [];
  const stocks = stocksData.data;
  const questions = questionsData.data?.questions || [];
  const total = questionsData.data?.totalCount || 0;
  const paginationPage = questionsData.data?.paginationPage || 1;
  const phone = userData.data?.phone || "";

  const img = product?.photos[0]?.url || EMPTY_IMG_SVG;
  const inStock = stocks ? stocks.available > 0 || !stocks.accounting : false;
  const available = stocks?.accounting ? stocks.available : null;

  const isLoadMoreDisabled = getIsLoadMoreDisabled(String(paginationPage), total, limit);

  return (
    <section className="page-wrapper">
      {userData?.tokens && <UpdateToken tokens={userData.tokens} />}
      {productData.status === "error" && productData.message && (
        <ErrorAlert message={productData.message} />
      )}
      {pricesData.status === "error" && pricesData.message && (
        <ErrorAlert message={pricesData.message} />
      )}
      {stocksData.status === "error" && stocksData.message && (
        <ErrorAlert message={stocksData.message} />
      )}
      {questionsData.status === "error" && questionsData.message && (
        <ErrorAlert message={questionsData.message} />
      )}
      {userData.status === "error" && userData.message && <ErrorAlert message={userData.message} />}

      {phone.length === 0 ? (
        <NotContent
          title="Войдите, чтобы посмотреть свои вопросы"
          subTitle="Вопросы о товарах доступны после входа в аккаунт."
          href="/sign-in"
          buttonText="Войти"
        />
      ) : (
        <>
          {product && stocks && (
            <ProductInfo
              inStock={inStock}
              available={available}
              img={img}
              product_name={product.name || ""}
              product_id={Number(id)}
              prices={prices}
              description={product.description}
            />
          )}

          <PageHeader
            title="Мои вопросы"
            subtitle={
              total > 0
                ? `${total} ${declOfNum(total, ["вопрос", "вопроса", "вопросов"])}`
                : undefined
            }
          />

          {product && (
            <QuestionsForm
              createQuestionAction={createQuestionAction}
              totalCount={total}
              product_id={id}
              initActive
              isNotClose
            />
          )}

          {total > 0 && (
            <QuestionsList
              questions={questions}
              question_id=""
              patch={`/user-reviews/questions/${id}`}
              searchParams={searchParams}
              isLoadMoreDisabled={isLoadMoreDisabled}
              limit={limit}
              total={total}
              showFullWidth
              variant="list"
            />
          )}
        </>
      )}
    </section>
  );
}
