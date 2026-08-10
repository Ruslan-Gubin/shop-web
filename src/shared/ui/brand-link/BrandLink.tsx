import Link from "next/link";
import styles from "./BrandLink.module.css";

type Props = {
  href: string;
  name: string;
};

export const BrandLink = (props: Props) => {
  return (
    <Link className={styles.brandLink} href={props.href}>
      {props.name}
    </Link>
  );
};
