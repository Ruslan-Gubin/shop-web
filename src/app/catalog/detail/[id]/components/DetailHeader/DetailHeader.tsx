import { BreadCrumbs } from "@/shared/ui/breadcrumbs/BreadCrumbs";
import { CopyButton } from "@/shared/ui/copy-button/CopyButton";
import { ProductFavorites } from "@/widgets/product/ProductCard/components/ProductFavorites/ProductFavorites";
import styles from "./DetailHeader.module.css";

type Props = {
  id: number;
  fullUrl: string;
  inStock: boolean;
  breadcrumbs: { label: string; href: string }[];
};

export const DetailHeader = (props: Props) => {
  return (
    <div className={styles.root}>
      <BreadCrumbs notShowBack={false} breadcrumbs={props.breadcrumbs} />
      <div className={styles.actions}>
        {props.inStock && <ProductFavorites id={props.id} />}
        <CopyButton
          copyValue={props.fullUrl}
          successText="Вы скопировали ссылку"
          errorText="Не удалось скопировали ссылку"
        />
      </div>
    </div>
  );
};
