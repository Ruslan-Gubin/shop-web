import type { WarehouseModel } from "@/app/checkout/action";
import { fetchService } from "@/shared/fetch-api";

export const fetchContactsWarehouses = async () =>
  fetchService.get<WarehouseModel[]>({
    url: "warehouses/public",
    tags: ["Warehouses"],
  });
