import { redirect } from "next/navigation";

export default function OrdersWaitingPage() {
  redirect("/orders?waiting");
}
