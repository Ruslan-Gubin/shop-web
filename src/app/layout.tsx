import "./styles/reset.css";
import "./styles/globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/views/Footer/Footer";
import { Header } from "@/views/Header/Header/Header";
import { MenuWrapper } from "@/widgets/menu/MenuWrapper";
import { QuickViewModal } from "@/widgets/modals/quick-view-product/QuickViewModal";
import { NotificationList } from "@/widgets/notification/notifications-result/NotificationsResult";
import { fetchPopularSearchAction, fetchSuggestionsAction } from "./action";
import { Roboto } from "./core/fonts";
import { getMetadata } from "./core/generateMetadata";
import styles from "./styles/Layout.module.css";

export const metadata: Metadata = getMetadata({
  title: "Главная страница",
  description: "Главная страница",
});

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <html lang="ru" className={Roboto.className}>
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      </head>
      <Suspense>
        <body className={styles.layoutWrapper}>
          <NotificationList />
          <QuickViewModal />
          <header className={styles.layoutHeader}>
            <div className={styles.container}>
              <Header
                fetchSuggestionsAction={fetchSuggestionsAction}
                fetchPopularSearchAction={fetchPopularSearchAction}
              />
            </div>
          </header>
          <MenuWrapper />
          <main className={styles.layoutContent}>
            <div className={styles.container}>{props.children}</div>
          </main>
          <footer className={styles.layoutFooter}>
            <div className={styles.container}>
              <Footer />
            </div>
          </footer>
        </body>
      </Suspense>
    </html>
  );
}
