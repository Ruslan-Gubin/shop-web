import type { CartDiscountModel, ProductModel, PromotionModel } from "@/app/action";
import { checkingBalanceAction } from "@/app/checkout/action";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { BasketList } from "./BasketList/BasketList";
import { BasketOrder } from "./BasketOrder/BasketOrder";
import styles from "./BasketWrapper.module.css";

type Props = {
  basketProducts: ProductModel[];
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
};

export const BasketWrapper = (props: Props) => {
  const isHasOrderItems = props.basketProducts.length > 0;

  return (
    <div className={styles.wrapper}>
      {!isHasOrderItems && (
        <NotContent
          title="В корзине пока пусто"
          subTitle="Перейдите на главную и добавьте товары, которые могут вам понравиться."
          href="/"
          buttonText="Перейти на главную"
        />
      )}

      {isHasOrderItems && (
        <section className={styles.root}>
          <section>
            <BasketList products={props.basketProducts} />
          </section>
          <BasketOrder
            defaultCenter={{ lng: 0, lat: 0 }}
            basketProducts={props.basketProducts}
            cartDiscounts={props.cartDiscounts}
            promotions={props.promotions}
            checkingBalanceAction={checkingBalanceAction}
            type="basket"
          />
        </section>
      )}
    </div>
  );
};
