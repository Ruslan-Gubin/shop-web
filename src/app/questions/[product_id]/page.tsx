import { createQuestionAction } from "@/app/catalog/detail/[id]/action";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { EMPTY_IMG_SVG } from "@/shared/helpers/listenerImgError";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { ProductInfo } from "@/widgets/product/product-info/ProductInfo";
import { fetchQuestionsData } from "./action";
import { QuestionsForm } from "./components/form/QuestionsForm";
import { QuestionsList } from "./components/list/QuestionsList";

export default async function QuestionsPage(req: {
  params: Promise<{ product_id: string }>;
  searchParams: Promise<{ page: string; question_id?: string }>;
}) {
  const limit = 30;
  const params = await req.params;
  const searchParams = await req.searchParams;
  const product_id = params.product_id;
  const question_id = searchParams.question_id;
  const patch = `/questions/${product_id}`;

  const [stocksData, pricesData, productData, questionData] = await fetchQuestionsData(
    product_id,
    limit,
    searchParams.page,
  );

  const product = productData.data;
  const questions = questionData.data?.questions || [];
  const totalCount = questionData.data?.totalCount || 0;
  const paginationPage = questionData.data?.paginationPage || 1;

  const isLoadMoreDisabled = getIsLoadMoreDisabled(String(paginationPage), totalCount, limit);

  const img = product?.photos[0]?.url || EMPTY_IMG_SVG;

  const inStock = stocksData.data
    ? stocksData.data?.available > 0 || !stocksData.data?.accounting
    : false;
  const available = stocksData.data?.accounting ? stocksData.data?.available : null;

  return (
    <section className="page-wrapper">
      {questionData?.tokens && <UpdateToken tokens={questionData.tokens} />}
      {stocksData.status === "error" && stocksData.message && (
        <ErrorAlert message={stocksData.message} />
      )}
      {pricesData.status === "error" && pricesData.message && (
        <ErrorAlert message={pricesData.message} />
      )}
      {productData.status === "error" && productData.message && (
        <ErrorAlert message={productData.message} />
      )}
      {questionData.status === "error" && questionData.message && (
        <ErrorAlert message={questionData.message} />
      )}

      {product && pricesData && stocksData && (
        <ProductInfo
          inStock={inStock}
          available={available}
          img={img}
          product_name={product.name || ""}
          product_id={Number(product_id)}
          prices={pricesData.data || []}
          description={product?.description}
        />
      )}
      <QuestionsForm
        createQuestionAction={createQuestionAction}
        totalCount={totalCount}
        product_id={product_id}
      />
      <QuestionsList
        question_id={question_id || ""}
        questions={questions}
        searchParams={searchParams}
        isLoadMoreDisabled={isLoadMoreDisabled}
        limit={limit}
        patch={patch}
        total={totalCount}
        isHomePage
        showFullWidth
      />
    </section>
  );
}
