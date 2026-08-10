import type { ProductModel } from "@/app/action";
import { BasketDeleteModal } from "../BasketDeleteModal/BasketDeleteModal";
import { BasketListCheckboxAll } from "../BasketListCheckboxAll/BasketListCheckboxAll";
import { BasketListDelete } from "../BasketListDelete/BasketListDelete";
import { BasketListFavorites } from "../BasketListFavorites/BasketListFavorites";
import { BasketListTotal } from "../BasketListTotal/BasketListTotal";
import { ProductCardBasket } from "../ProductCardBasket/ProductCardBasket";
import styles from "./BasketList.module.css";

type Props = {
  products: ProductModel[];
};

export const BasketList = (props: Props) => {
  return (
    <>
      <BasketDeleteModal />
      <section className={styles.root}>
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>Корзина</h2>
          <BasketListTotal />
        </header>
        <section className={styles.headerActionContainer}>
          <BasketListCheckboxAll />
          <div className={styles.headerActionButtons}>
            <BasketListFavorites />
            <BasketListDelete />
          </div>
        </section>
        <ul className={styles.basketList}>
          {props.products.map((product) => (
            <ProductCardBasket key={product.id} product={product} />
          ))}
        </ul>
      </section>
    </>
  );
};
