import type { MapFeatureModel } from "@/app/checkout/action";
import type { AddressItem } from "@/stores/checkout/types";
import { findMapSector } from "./findMapSector";

export const getIsDisabledDeliveryAddress = (
  method_receipt: "courier" | "pickup",
  address: AddressItem | null,
  features: MapFeatureModel[],
) => {
  let disabled = false;

  if (
    method_receipt === "courier" &&
    address !== null &&
    typeof address.lng === "number" &&
    typeof address.lat === "number"
  ) {
    const sector = findMapSector(features, address.lng, address.lat);
    if (!sector) {
      disabled = true;
    }
  }

  return disabled;
};
