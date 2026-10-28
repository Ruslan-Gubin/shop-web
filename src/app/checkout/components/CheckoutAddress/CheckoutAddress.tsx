import { useState } from "react";
import { formatterRub } from "@/shared/helpers/formatters";
import { getFullAddressItem } from "@/shared/helpers/getFullAddressItem";
import { PinAddressSvg } from "@/shared/svg/PinAddressSvg";
import { Button } from "@/shared/ui/button-main/Button";
import { MapBox } from "@/shared/ui/mapbox/MapBox";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import { checkoutStore } from "@/stores/checkout/store";
import type { AddressItem } from "@/stores/checkout/types";
import { AddressModal } from "@/widgets/modals/address-modal/AddressModal";
import { ModalSelectAddress } from "@/widgets/modals/modal-select-address/ModalSelectAddress";
import styles from "./CheckoutAddress.module.css";

type Props = {
  method_receipt: "pickup" | "courier";
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

export const CheckoutAddress = (props: Props) => {
  const [selectModal, setSelectModal] = useState<boolean>(false);
  const [selectAddressModal, setSelectAddressModal] = useState<boolean>(false);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);

  const filterAddress = props.method_receipt === "pickup" ? props.pickupAddress : courierAddress;

  const handleClickMarker = (lng: number, lat: number) => {
    checkoutAdapter.setActiveAddress(lng, lat);
  };

  const selectAddress = props.address
    ? (filterAddress.find(
        (el) => props.address && el.lng === props.address.lng && el.lat === props.address.lat,
      ) ?? null)
    : null;

  const handleClickAddAddress = () => {
    setSelectModal(false);
    setSelectAddressModal(true);
  };

  return (
    <>
      <ModalSelectAddress
        isDeliveryCourier={props.isDeliveryCourier}
        defaultCenter={props.defaultCenter}
        method_receipt={props.method_receipt}
        pickupAddress={props.pickupAddress}
        courierAddress={courierAddress}
        active={selectModal}
        onClose={() => setSelectModal(false)}
        onAddAddress={handleClickAddAddress}
        activePickup={activePickup}
        activeCourier={activeCourier}
      />
      <AddressModal
        defaultCenter={props.defaultCenter}
        fetchReverseAction={props.fetchReverseAction}
        fetchForwardAction={props.fetchForwardAction}
        initCenter={props.defaultCenter}
        courierAddress={courierAddress}
        mapStyle={props.mapStyle}
        mapToken={props.mapToken}
        method_receipt={props.method_receipt}
        pickupAddress={props.pickupAddress}
        active={selectAddressModal}
        onClose={() => setSelectAddressModal(false)}
        activePickup={activePickup}
        activeCourier={activeCourier}
      />

      <ul className={styles.methodList}>
        <li className={styles.leftSide}>
          {selectAddress && (
            <div className={styles.activeMarker}>
              <div className={styles.activeMarkerPinSvg}>
                <PinAddressSvg />
              </div>
              <div className={styles.activeMarkerInfo}>
                <p className={styles.leftSideTitle}>
                  {selectAddress.type === "courier" ? "Курьером по адресу:" : "Адрес самовывоза:"}
                </p>
                <span className={styles.activeMarkerAddressText}>
                  {getFullAddressItem(selectAddress)}
                </span>
                {props.minOrderSum > 0 && (
                  <span className={styles.activeMarkerAddressText}>
                    Минимальная сумма заказа {formatterRub.format(props.minOrderSum)}.
                  </span>
                )}
                <span className={styles.activeMarkerAddressText}>
                  Способ оплаты: наличными или оплата картой по терминалу.
                </span>
              </div>
            </div>
          )}
          <div className={styles.leftSideFooter}>
            <Button variantColor="violet" size="xs" onClick={() => setSelectModal(true)}>
              {(props.method_receipt === "courier" && activeCourier) ||
              (props.method_receipt === "pickup" && activePickup)
                ? "Изменить адрес"
                : "Выбрать адрес"}
            </Button>
          </div>
        </li>
        <li className={styles.mapSide}>
          <MapBox
            onClickMarker={handleClickMarker}
            active={{
              lng: props.address?.lng || props.defaultCenter.lng,
              lat: props.address?.lat || props.defaultCenter.lat,
            }}
            initCenter={props.defaultCenter}
            markers={filterAddress}
            initZoom={15}
            mapboxAccessToken={props.mapToken}
            mapStyle={props.mapStyle}
            width={"100%"}
            height={"100%"}
            hasFullScreen
          />
        </li>
      </ul>
    </>
  );
};
