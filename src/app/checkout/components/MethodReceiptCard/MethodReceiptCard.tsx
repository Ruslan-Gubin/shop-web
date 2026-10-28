"use client";
import { checkoutStore } from "@/stores/checkout/store";
import type { AddressItem } from "@/stores/checkout/types";
import { BasketInfoCard } from "../BasketInfoCard/BasketInfoCard";
import { CheckoutAddress } from "../CheckoutAddress/CheckoutAddress";
import { SelectMethodReceipt } from "../SelectMethodReceipt/SelectMethodReceipt";

type Props = {
  mapToken: string;
  mapStyle: string;
  pickupAddress: AddressItem[];
  defaultCenter: { lng: number; lat: number };
  fetchForwardAction: (address: string) => Promise<{
    lng: number;
    lat: number;
    name: string;
    place: string;
  }>;
  fetchReverseAction: (
    lng: number,
    lat: number,
  ) => Promise<{
    lng: number;
    lat: number;
    name: string;
    place: string;
  }>;
  isDeliveryCourier: boolean;
  minOrderSum: number;
  address: AddressItem | null;
};

export const MethodReceiptCard = (props: Props) => {
  const method_receipt = checkoutStore((store) => store.method_receipt);

  return (
    <BasketInfoCard title="Способ получения">
      <SelectMethodReceipt
        method_receipt={method_receipt}
        isDeliveryCourier={props.isDeliveryCourier}
        minOrderSum={props.minOrderSum}
      />
      <CheckoutAddress
        address={props.address}
        minOrderSum={props.minOrderSum}
        isDeliveryCourier={props.isDeliveryCourier}
        defaultCenter={props.defaultCenter}
        fetchReverseAction={props.fetchReverseAction}
        fetchForwardAction={props.fetchForwardAction}
        pickupAddress={props.pickupAddress}
        method_receipt={method_receipt}
        mapStyle={props.mapStyle}
        mapToken={props.mapToken}
      />
    </BasketInfoCard>
  );
};
