"use client";
import type { ProductModel, PromotionModel } from "@/app/action";
import { BasketOrder } from "@/app/basket/components/BasketOrder/BasketOrder";
import type { CartDiscountModel } from "@/app/cart-discounts/action";
import type { AddressItem } from "@/stores/checkout/types";
import type {
  CheckingBalancePayload,
  CheckingBalanceResponse,
  CreateOrderPayload,
  CreateOrderResponse,
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
};

export const CheckoutWrapper = (props: Props) => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.root}>
        <section className={styles.leftSide}>
          <BasketMethodCard />
          <DeliveryDateCard />
          <MethodReceiptCard
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
