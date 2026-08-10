import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2 style={{ paddingBottom: "var(--padding-content-block)" }}>
        По Вашему запросу ничего не найдено
      </h2>
      <Link
        style={{
          position: "relative",
          top: "14px",
          width: "200px",
          paddingInline: "16px",
          paddingBlock: "12px",
          backgroundColor: "#A73AFD",
          borderRadius: "12px",
          color: "white",
        }}
        href="/"
      >
        На главную
      </Link>
    </div>
  );
}
