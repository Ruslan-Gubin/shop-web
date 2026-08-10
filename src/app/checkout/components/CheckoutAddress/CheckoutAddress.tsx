import { useState } from "react";
import { getActiveAddress } from "@/shared/helpers/getActiveAddress";
import { getFullAddressItem } from "@/shared/helpers/getFullAddressItem";
import { getInitCenter } from "@/shared/helpers/getInitCenter";
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
};

export const CheckoutAddress = (props: Props) => {
  const [selectModal, setSelectModal] = useState<boolean>(false);
  const [selectAddressModal, setSelectAddressModal] = useState<boolean>(false);
  const activePickup = checkoutStore((store) => store.activePickup);
  const activeCourier = checkoutStore((store) => store.activeCourier);
  const courierAddress = checkoutStore((store) => store.courierAddress);

  const initCenter = getInitCenter(
    props.defaultCenter,
    props.pickupAddress,
    courierAddress,
    activePickup,
    activeCourier,
    props.method_receipt,
  );

  const filterAddress = props.method_receipt === "pickup" ? props.pickupAddress : courierAddress;

  const handleClickMarker = (lng: number, lat: number) => {
    checkoutAdapter.setActiveAddress(lng, lat);
  };

  const activeAddress = getActiveAddress(
    props.pickupAddress,
    courierAddress,
    props.defaultCenter,
    props.method_receipt,
    activePickup,
    activeCourier,
  );

  const selectAddress = activeAddress
    ? filterAddress.find((el) => el.lng === activeAddress.lng && el.lat === activeAddress.lat)
    : null;

  const handleClickAddAddress = () => {
    setSelectModal(false);
    setSelectAddressModal(true);
  };

  return (
    <>
      <ModalSelectAddress
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
        initCenter={initCenter}
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
                <span className={styles.activeMarkerAddressText}>
                  Минимальная сумма заказа {props.method_receipt === "courier" ? 5000 : 0} ₽.
                </span>
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
            active={activeAddress}
            initCenter={activeAddress || props.defaultCenter}
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
