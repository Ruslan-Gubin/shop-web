"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CartDiscountModel } from "@/app/cart-discounts/action";
import type {
  CheckingBalancePayload,
  CheckingBalanceResponse,
  CreateOrderPayload,
  CreateOrderResponse,
} from "@/app/checkout/action";
import type { ProductModel } from "@/app/product/action";
import type { PromotionModel } from "@/app/promotions/action";
import { calcBasketInfo } from "@/shared/helpers/calcBasketInfo";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { formatterRub } from "@/shared/helpers/formatters";
import { getDateFromAndDateTo } from "@/shared/helpers/getDateFromAndDateTo";
import { getDeliveryTimeDisplay } from "@/shared/helpers/getDeliveryTimeDisplay";
import { getOrderAddress } from "@/shared/helpers/getOrderAddress";
import { getSelectDeliveryDate } from "@/shared/helpers/getSelectDeliveryDate";
import { Button } from "@/shared/ui/button-main/Button";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import { checkoutStore } from "@/stores/checkout/store";
import type { AddressItem } from "@/stores/checkout/types";
import { notificationAdapter } from "@/stores/notification/adapter";
import { StockWarningModal } from "../StockWarningModal/StockWarningModal";
import { SuccessOrderModal } from "../SuccessOrderModal/SuccessOrderModal";
import styles from "./BasketOrder.module.css";

type Props = {
  defaultCenter: { lng: number; lat: number };
  cartDiscounts: CartDiscountModel[];
  promotions: PromotionModel[];
  basketProducts: ProductModel[];
  type: "checkout" | "basket";
  pickupAddress?: AddressItem[];
  checkingBalanceAction: (payload: CheckingBalancePayload) => Promise<CheckingBalanceResponse>;
  createOrderAction?: (payload: CreateOrderPayload) => Promise<CreateOrderResponse>;
};

export const BasketOrder = (props: Props) => {
  const router = useRouter();
  const basket = basketStore((store) => store.items);
  const payment_method = checkoutStore((store) => store.payment_method);
  const delivery_date = checkoutStore((store) => store.delivery_date);
  const delivery_time = checkoutStore((store) => store.delivery_time);
  const method_receipt = checkoutStore((store) => store.method_receipt);
  const courierAddress = checkoutStore((store) => store.courierAddress);
  const selected = basketStore((store) => store.selected);
  const delivery_price = props.type === "checkout" && method_receipt === "courier" ? 100 : 0;
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const comment = checkoutStore((store) => store.comment);
  const recipient_name = checkoutStore((store) => store.recipient_name);
  const phone = checkoutStore((store) => store.phone);
  const [stocksWarning, setStocksWarning] = useState<
    { product_id: number; available: number; name: string }[]
  >([]);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    email: string;
    order_id: number;
    orderNumber: string;
  }>({ isOpen: false, email: "", order_id: 0, orderNumber: "" });

  const [isShowStickySubmit, setIsShowStickySubmit] = useState<boolean>(true);
  const refSubmitBtn = useRef<HTMLDivElement | null>(null);

  const orderInfo = useMemo(
    () =>
      calcBasketInfo(selected, basket, props.basketProducts, props.cartDiscounts, props.promotions),
    [selected, basket, props.basketProducts, props.cartDiscounts, props.promotions],
  );

  const decString = declOfNum(orderInfo.productCount, ["товар", "товара", "товаров"]);

  useEffect(() => {
    if (!refSubmitBtn.current || typeof window === "undefined") return;

    const scrolling = () => {
      if (!refSubmitBtn.current || window.innerWidth > 880) return;

      const rect = refSubmitBtn.current.getBoundingClientRect();
      const triggerY = rect.top - window.innerHeight + 65 + 52;

      if (triggerY <= 0 && isShowStickySubmit) {
        setIsShowStickySubmit(false);
      }

      if (triggerY > 0 && !isShowStickySubmit) {
        setIsShowStickySubmit(true);
      }
    };

    window.addEventListener("scroll", scrolling);

    return () => {
      window.removeEventListener("scroll", scrolling);
    };
  }, [isShowStickySubmit]);

  const isCheckout = props.type === "checkout";
  const isBasket = props.type === "basket";

  const selectDeliveryDate = getSelectDeliveryDate(delivery_date);
  const deliveryTimeDisplay = getDeliveryTimeDisplay(delivery_date, delivery_time, 10, 19);

  const dateFormatter = new Intl.DateTimeFormat("ru", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });

  const address = props.pickupAddress
    ? getOrderAddress(
        props.defaultCenter,
        props.pickupAddress,
        courierAddress,
        method_receipt,
        activePickup,
        activeCourier,
      )
    : null;

  const createOrder = (selectedProducts: { product_id: number; quantity: number }[]) => {
    const { date_from, date_to } = getDateFromAndDateTo(delivery_date, delivery_time, 10, 19);

    const payload: CreateOrderPayload = {
      payment_method,
      date_from,
      date_to,
      method_receipt,
      comment,
      phone: phone.replace(/\D/g, ""),
      phoneCode: phone ? "+7" : "",
      recipient_name,
      address,
      products: selectedProducts,
    };

    if (typeof props.createOrderAction === "function") {
      props.createOrderAction(payload).then((response) => {
        let notification: { status: "error" | "success"; message: string } | null = null;

        if (response.status === "success" && response.data) {
          const order_id = response.data.id;

          for (let i = 0; i < selectedProducts.length; i++) {
            basketAdapter.delete(selectedProducts[i].product_id);
          }

          checkoutAdapter.changeAdditionalInfoInputs("", "recipient_name");
          checkoutAdapter.changeAdditionalInfoInputs("", "comment");
          checkoutAdapter.changeAdditionalInfoInputs("", "phone");

          notification = {
            status: "success",
            message: "Заказ удачно создан",
          };

          setSuccessModal({ isOpen: true, orderNumber: String(order_id), order_id, email: "" });
        } else {
          Object.entries(response.errors).forEach(([key, error]) => {
            if (error.length > 0) {
              if (notification === null) {
                notification = {
                  status: "error",
                  message: error,
                };
              }

              if (key === "phone") {
                checkoutAdapter.activeErrorAdditionalInfoInputs(error, "phone_error");
              }

              if (key === "comment") {
                checkoutAdapter.activeErrorAdditionalInfoInputs(error, "comment_error");
              }

              if (key === "recipient_name") {
                checkoutAdapter.activeErrorAdditionalInfoInputs(error, "recipient_name_error");
              }
            }
          });

          if (response.status === "error" && response.message && notification === null) {
            notification = {
              status: "error",
              message: response.message,
            };
          }
        }

        if (
          notification !== null &&
          typeof notification.status === "string" &&
          typeof notification.message === "string"
        ) {
          notificationAdapter.add(notification.message, notification.status);
        }
      });
    }
  };

  const handleSubmitOrder = () => {
    const selectedProducts: { product_id: number; quantity: number }[] = [];

    for (const key in basket) {
      if (selected.includes(Number(key)) && basket[key] > 0) {
        selectedProducts.push({ product_id: Number(key), quantity: basket[key] });
      }
    }

    props.checkingBalanceAction(selectedProducts).then((response) => {
      if (Array.isArray(response.data) && response.data.length > 0) {
        setStocksWarning(
          response.data.map((el) => ({
            ...el,
            name: `product name: ${el.product_id}`,
          })),
        );
      } else if (Array.isArray(response.data) && response.data.length === 0) {
        if (props.type === "basket") {
          router.push("/checkout");
        } else {
          createOrder(selectedProducts);
        }
      }
    });
  };

  const onNavigateSuccessModal = (order_id?: number) => {
    setSuccessModal({ isOpen: false, email: "", orderNumber: "", order_id: 0 });
    router.push(order_id ? `/orders/${order_id}` : "/");
  };

  const disabledSubmit =
    props.type === "checkout" ? orderInfo.total === 0 || address === null : orderInfo.total === 0;

  return (
    <>
      <SuccessOrderModal
        order_id={successModal.order_id}
        active={props.type === "checkout" && successModal.isOpen}
        email={successModal.email}
        number={successModal.orderNumber}
        onNavigate={onNavigateSuccessModal}
      />
      <StockWarningModal
        type={props.type}
        disabled={orderInfo.total === 0}
        basket={basket}
        active={stocksWarning.length > 0}
        items={stocksWarning}
        onClose={() => setStocksWarning([])}
        onSubmit={handleSubmitOrder}
      />

      <div className={styles.basketOrder}>
        <li className={styles.line}>
          <h3 className={styles.totalText}>Ваш заказ</h3>
          <span className={styles.textInfo}>
            {orderInfo.productCount} {decString}
          </span>
        </li>

        <ul className={styles.infoContainer}>
          <li className={styles.line}>
            <span className={styles.textInfo}>Товары, {orderInfo.productCount} шт.</span>
            <span className={styles.textInfo}>
              {orderInfo.total > 0
                ? formatterRub.format(orderInfo.total + orderInfo.totalDiscount)
                : ""}{" "}
            </span>
          </li>

          {orderInfo.quantityDiscount > 0 && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Скидка за количество</span>
              <span className={styles.textInfo}>
                - {formatterRub.format(orderInfo.quantityDiscount)}
              </span>
            </li>
          )}

          {orderInfo.cartDiscount > 0 && (
            <li className={styles.line}>
              <span className={styles.textInfo}>
                {orderInfo.cartDiscountName || "Скидка на корзину"}
              </span>
              <span className={styles.textInfo}>
                - {formatterRub.format(orderInfo.cartDiscount)}
              </span>
            </li>
          )}

          {orderInfo.promotionDiscount > 0 && (
            <li className={styles.line}>
              <span className={styles.textInfo}>
                {orderInfo.promotionName ? `Акция «${orderInfo.promotionName}»` : "Акция"}
              </span>
              <span className={styles.textInfo}>
                - {formatterRub.format(orderInfo.promotionDiscount)}
              </span>
            </li>
          )}

          {isCheckout && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Стоимость доставки</span>
              <span className={styles.textInfo}>{formatterRub.format(delivery_price)}</span>
            </li>
          )}
          {isBasket && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Доставка и сервисы</span>
              <span className={styles.textInfo}>при оформлении</span>
            </li>
          )}
          {isCheckout && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Способ оплаты</span>
              <span className={styles.textInfo}>
                {payment_method === "cash" ? "Наличными" : "Банковской картой"}
              </span>
            </li>
          )}
          {isCheckout && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Способ получения</span>
              <span className={styles.textInfo}>
                {method_receipt === "courier" ? "Курьером" : "Самовывоз"}
              </span>
            </li>
          )}

          {isCheckout && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Адрес</span>
              <span className={styles.textInfo}>{address ? address.name : "не выбран"}</span>
            </li>
          )}

          {isCheckout && (
            <li className={styles.line}>
              <span className={styles.textInfo}>
                {method_receipt === "courier" ? "Привезет курьер" : "Выдача заказа"}
              </span>
              <span className={styles.textInfo}>
                {dateFormatter.format(new Date(selectDeliveryDate))}
              </span>
            </li>
          )}

          {isCheckout && (
            <li className={styles.line}>
              <span className={styles.textInfo}>Время</span>
              <span className={styles.textInfo}>{deliveryTimeDisplay}</span>
            </li>
          )}
        </ul>
        <div className={styles.line}>
          <h3 className={styles.totalText}>Итого</h3>
          <h3 className={styles.totalText}>
            {formatterRub.format(orderInfo.total + delivery_price)}
          </h3>
        </div>
        <div ref={refSubmitBtn}>
          <Button
            variantColor="violet"
            size="lg"
            fullWidth
            variant="solid"
            disabled={disabledSubmit}
            onClick={handleSubmitOrder}
          >
            {props.type === "checkout" ? "Оформить" : "Перейти к оформлению"}
          </Button>
        </div>

        {isShowStickySubmit && (
          <div className={styles.orderButtonStickyContainer}>
            <Button
              variantColor="violet"
              size="lg"
              fullWidth
              variant="solid"
              disabled={disabledSubmit}
              onClick={handleSubmitOrder}
            >
              {props.type === "checkout" ? "Оформить" : "Перейти к оформлению"}
            </Button>
          </div>
        )}
        {props.type === "checkout" && (
          <div className={styles.access}>
            <Checkbox checked readOnly />
            <span>
              Соглашаюсь с <Link href={"/"}>правилами пользования торговой площадкой</Link> и{" "}
              <Link href={"/"}>возврата.</Link>
            </span>
          </div>
        )}
      </div>
    </>
  );
};
