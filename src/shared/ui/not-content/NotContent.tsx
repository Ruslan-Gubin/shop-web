import Link from "next/link";
// import { NoContentSvg } from "@/shared/svg/NoContentSvg";
import { Button } from "../button-main/Button";
import styles from "./NotContent.module.css";

type Props = {
  title: string;
  subTitle: string;
  href: string;
  buttonText: string;
};

export const NotContent = (props: Props) => {
  return (
    <section className={styles.root}>
      {/* <NoContentSvg /> */}
      <div className={styles.textContainer}>
        <h3 className={styles.title}>{props.title}</h3>
        <p className={styles.subTitle}>{props.subTitle}</p>
      </div>
      <Link href={props.href}>
        <Button variant="solid" variantColor="violet" size="md">
          {props.buttonText}
        </Button>
      </Link>
    </section>
  );
};
