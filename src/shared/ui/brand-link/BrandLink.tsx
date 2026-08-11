import Link from "next/link";
import styles from "./BrandLink.module.css";

type Props = {
  href: string;
  name: string;
  onCLick?: () => void;
};

export const BrandLink = (props: Props) => {
  return (
    <Link onClick={props.onCLick} className={styles.brandLink} href={props.href}>
      {props.name}
    </Link>
  );
};
