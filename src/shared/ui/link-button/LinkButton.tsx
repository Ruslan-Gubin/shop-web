import Link from "next/link";
import { Button } from "../button-main/Button";
import styles from "./LinkButton.module.css";

type Props = {
  href: string;
  text: string;
};

export const LinkButton = (props: Props) => {
  return (
    <Link href={props.href} className={styles.buttonLinkWrapper}>
      <Button fullWidth customClass={styles.buttonLink} variant="solid" variantColor="violet">
        <p className={styles.btnText}>{props.text}</p>
      </Button>
    </Link>
  );
};
