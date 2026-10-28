"use client";
import { useEffect, useMemo, useState } from "react";
import type { CartDiscountModel, ProductModel, PromotionModel } from "@/app/action";
import { BasketOrder } from "@/app/basket/components/BasketOrder/BasketOrder";
import { getDeliveryParams } from "@/shared/helpers/getDeliveryParams";
import { getOrderAddress } from "@/shared/helpers/getOrderAddress";
import { checkoutStore } from "@/stores/checkout/store";
import type { AddressItem } from "@/stores/checkout/types";
import type {
  CheckingBalancePayload,
  CheckingBalanceResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  MapFeatureModel,
} from "../../action";
import { AdditionalInformation } from "../AdditionalInformation/AdditionalInformation";
import { BasketMethodCard } from "../BasketMethodCard/BasketMethodCard";
import { DeliveryDateCard } from "../DeliveryDateCard/DeliveryDateCard";
import { MethodReceiptCard } from "../MethodReceiptCard/MethodReceiptCard";
import styles from "./BasketWrapper.module.css";

type Props = {
  basketProducts: ProductModel[];
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
  pickupAddress: AddressItem[];
  checkingBalanceAction: (payload: CheckingBalancePayload) => Promise<CheckingBalanceResponse>;
  createOrderAction: (payload: CreateOrderPayload) => Promise<CreateOrderResponse>;
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
  mapStyle: string;
  mapToken: string;
  defaultCenter: { lng: number; lat: number };
  isRegister: boolean;
  isDeliveryCourier: boolean;
  sectors: {
    type: string;
    features: MapFeatureModel[];
  };
};

export const CheckoutWrapper = (props: Props) => {
  const [initAddress, setInitAddress] = useState<boolean>(false);
  const method_receipt = checkoutStore((store) => store.method_receipt);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);

  const address = getOrderAddress(
    props.defaultCenter,
    props.pickupAddress,
    courierAddress,
    method_receipt,
    activePickup,
    activeCourier,
  );

  const deliveryParams = useMemo(
    () => getDeliveryParams(method_receipt, address, props.sectors.features),
    [method_receipt, address, props.sectors.features],
  );

  useEffect(() => {
    let timer = null;
    if (!initAddress) {
      timer = setTimeout(() => {
        setInitAddress(true);
      }, 500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [initAddress]);

  return (
    <div className={styles.wrapper}>
      <section className={styles.root}>
        <section className={styles.leftSide}>
          <BasketMethodCard />
          <DeliveryDateCard />
          <MethodReceiptCard
            address={address}
            minOrderSum={deliveryParams.min_sum}
            isDeliveryCourier={props.isDeliveryCourier}
            defaultCenter={props.defaultCenter}
            pickupAddress={props.pickupAddress}
            fetchReverseAction={props.fetchReverseAction}
            fetchForwardAction={props.fetchForwardAction}
            mapStyle={props.mapStyle}
            mapToken={props.mapToken}
          />
          <AdditionalInformation />
        </section>
        <BasketOrder
          delivery_price={deliveryParams.price}
          sectors={props.sectors}
          address={address}
          isAgreed={true}
          minOrderSum={deliveryParams.min_sum}
          isRegister={props.isRegister}
          defaultCenter={props.defaultCenter}
          basketProducts={props.basketProducts}
          cartDiscounts={props.cartDiscounts}
          promotions={props.promotions}
          checkingBalanceAction={props.checkingBalanceAction}
          createOrderAction={props.createOrderAction}
          pickupAddress={props.pickupAddress}
          type={"checkout"}
        />
      </section>
    </div>
  );
};
