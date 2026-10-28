import { redirect } from "next/navigation";

export default function OrdersPurchasesPage() {
  redirect("/orders?purchases");
}
