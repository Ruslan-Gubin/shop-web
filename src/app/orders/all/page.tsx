import { redirect } from "next/navigation";

export default function OrdersAllPage() {
  redirect("/orders?all");
}
