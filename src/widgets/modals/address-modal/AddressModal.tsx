import { useEffect, useMemo, useState } from "react";
import type { MapFeatureModel } from "@/app/checkout/action";
import { findMapSector } from "@/shared/helpers/findMapSector";
import { formatterRub } from "@/shared/helpers/formatters";
import { getOrderAddress } from "@/shared/helpers/getOrderAddress";
import { CloseSvg } from "@/shared/svg/CloseSvg";
import { Button } from "@/shared/ui/button-main/Button";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { Input } from "@/shared/ui/input-main/Input";
import { MapBox } from "@/shared/ui/mapbox/MapBox";
import { Modal } from "@/shared/ui/modal/Modal";
import { SelectMethodReceiptModal } from "@/shared/ui/select-method-receipt-modal/SelectMethodReceiptModal";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import type { AddressItem } from "@/stores/checkout/types";
import styles from "./AddressModal.module.css";
import { AddressSearch } from "./components/AddressSearch/AddressSearch";

type Props = {
  defaultCenter: { lng: number; lat: number };
  method_receipt: "pickup" | "courier";
  pickupAddress: AddressItem[];
  courierAddress: AddressItem[];
  active: boolean;
  onClose: () => void;
  activePickup: { lng: number; lat: number } | null;
  activeCourier: { lng: number; lat: number } | null;
  mapToken: string;
  mapStyle: string;
  initCenter: { lng: number; lat: number };
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
  sectors: {
    type: string;
    features: MapFeatureModel[];
  };
  isDeliveryCourier: boolean;
};

export const AddressModal = (props: Props) => {
  const [methodReceipt, setMethodReceipt] = useState<"pickup" | "courier">("courier");
  const [selectPickup, setSelectPickup] = useState<{ lng: number; lat: number } | null>(null);
  const [selectCourier, setSelectCourier] = useState<AddressItem | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleChangeMethod = (value: "pickup" | "courier") => {
    setMethodReceipt(value);
    if (value === "pickup") {
      setSelectCourier(null);
      setSearch("");
    }
  };

  const handleSelectAddress = (lng: number, lat: number) => {
    if (methodReceipt === "pickup" && lng && lat) {
      setSelectPickup({ lng, lat });
    }
  };

  useEffect(() => {
    if (props.active) {
      if (selectPickup === null && props.activePickup) {
        setSelectPickup(props.activePickup);
      }
    } else {
      setSelectPickup(null);
      setMethodReceipt("courier");
    }
  }, [props.active, selectPickup, props.activePickup]);

  const getIsActiveAddress = (lng: number, lat: number) => {
    let isActive = false;

    if (
      methodReceipt === "pickup" &&
      selectPickup &&
      lng === selectPickup.lng &&
      lat === selectPickup.lat
    ) {
      isActive = true;
    } else if (
      methodReceipt === "pickup" &&
      !selectPickup &&
      lng === props.defaultCenter.lng &&
      lat === props.defaultCenter.lat
    ) {
      isActive = true;
    } else if (
      methodReceipt === "courier" &&
      selectCourier &&
      lng === selectCourier.lng &&
      lat === selectCourier.lat
    ) {
      isActive = true;
    }

    return isActive;
  };

  const handleClickMap = (lng: number, lat: number) => {
    if (methodReceipt === "courier" && lng && lat) {
      props.fetchReverseAction(lng, lat).then((response) => {
        if (response.place.length > 0 && response.name.length > 0) {
          setSearch(`${response.place}, ${response.name}`);
        }

        setSelectCourier({
          ...response,
          entrance: "",
          flat: "",
          floor: "",
          intercom: "",
          type: "courier",
        });
      });
    }
  };

  const handleClickMarker = (lng: number, lat: number) => {
    if (methodReceipt === "pickup" && lng && lat) {
      setSelectPickup({ lng, lat });
    } else if (methodReceipt === "courier" && selectCourier) {
      setSelectCourier((prev) => (prev ? { ...prev, lng: lng, lat: lat } : null));
    }
  };

  const zone = useMemo(
    () =>
      selectCourier
        ? findMapSector(props.sectors.features, selectCourier.lng, selectCourier.lat)
        : null,
    [selectCourier, props.sectors.features],
  );

  const isOutOfZone = methodReceipt === "courier" && selectCourier !== null && zone === null;
  const deliveryPrice = zone?.properties.price || 0;
  const minOrderSum = zone?.properties.min_sum || 0;

  const activeAddress = getOrderAddress(
    methodReceipt === "courier" && props.activeCourier ? props.activeCourier : props.defaultCenter,
    props.pickupAddress,
    selectCourier ? [...props.courierAddress, selectCourier] : props.courierAddress,
    methodReceipt,
    selectPickup,
    methodReceipt === "courier" ? (selectCourier ? selectCourier : props.activeCourier) : null,
  );

  const handleSubmitModal = () => {
    checkoutAdapter.setMethodReceipt(methodReceipt);
    if (methodReceipt === "pickup" && selectPickup) {
      checkoutAdapter.setActiveAddress(selectPickup.lng, selectPickup.lat);
    } else if (methodReceipt === "courier" && selectCourier && !isOutOfZone) {
      checkoutAdapter.addAddress(selectCourier);
      checkoutAdapter.setActiveAddress(selectCourier.lng, selectCourier.lat);
      setSelectCourier(null);
    }
    props.onClose();
  };

  const isSubmitDisabled =
    (methodReceipt === "pickup" && !selectPickup) ||
    (methodReceipt === "courier" && (!selectCourier || isOutOfZone));

  const handleChangeValues = (value: string, key: string) => {
    setSelectCourier((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleClearCourierSelect = () => {
    setSelectCourier(null);
    setSearch("");
  };

  return (
    <Modal
      classContainer={styles.modalContent}
      active={props.active}
      handleCloseAction={props.onClose}
    >
      <section className={styles.formSide}>
        <header className={styles.formHeader}>
          <div className={styles.headerTitleLine}>
            <h2 className={styles.headerTitle}>
              {methodReceipt === "courier" && selectCourier && selectCourier.name
                ? selectCourier.name
                : "Способ доставки"}
            </h2>
            <h2>{methodReceipt === "courier"}</h2>
            {selectCourier && (
              <button
                className={styles.headerCloseButton}
                type="button"
                onClick={handleClearCourierSelect}
              >
                <CloseSvg />
              </button>
            )}
          </div>
          {methodReceipt === "courier" && selectCourier?.place && (
            <p className={styles.headerPlace}>{selectCourier.place}</p>
          )}
        </header>
        <SelectMethodReceiptModal
          isDeliveryCourier={props.isDeliveryCourier}
          methodReceipt={methodReceipt}
          onChangeMethod={handleChangeMethod}
        />
        <div className={styles.formContent}>
          {methodReceipt === "courier" && (
            <div className={styles.searchInputContainer}>
              <AddressSearch
                search={search}
                onChangeSearch={setSearch}
                fetchForwardAction={props.fetchForwardAction}
                onSelectCourier={setSelectCourier}
                mapToken={props.mapToken}
              />
              {!selectCourier && (
                <>
                  <p className={styles.subTitle}>Куда доставить заказ?</p>
                  <p className={styles.inputLabel}>Укажите адрес на карте или используйте поиск</p>
                </>
              )}
            </div>
          )}

          {methodReceipt === "courier" && isOutOfZone && (
            <p className={styles.outOfZoneText}>По этому адресу доставка не осуществляется.</p>
          )}

          {methodReceipt === "courier" && selectCourier && !isOutOfZone && minOrderSum > 0 && (
            <p className={styles.minOrderSumText}>
              Минимальная сумма заказа {formatterRub.format(minOrderSum)}.
            </p>
          )}

          {methodReceipt === "courier" && selectCourier && (
            <ul className={styles.formInputs}>
              <div className={styles.formInputsLine}>
                <li className={styles.formInputsItem}>
                  <span className={styles.inputLabel}>Квартира</span>
                  <Input
                    value={selectCourier ? selectCourier.flat : ""}
                    onChange={(e) => handleChangeValues(e.target.value, "flat")}
                    placeholder="Номер"
                    variantSize="md"
                    variant="outlined"
                    autoComplete="off"
                    maxLength={10}
                    inputMode="tel"
                  />
                </li>
                <li className={styles.formInputsItem}>
                  <span className={styles.inputLabel}>Подъезд</span>
                  <Input
                    value={selectCourier ? selectCourier.entrance : ""}
                    onChange={(e) => handleChangeValues(e.target.value, "entrance")}
                    placeholder="Номер"
                    variantSize="md"
                    variant="outlined"
                    autoComplete="off"
                    maxLength={20}
                    inputMode="tel"
                  />
                </li>
              </div>

              <div className={styles.formInputsLine}>
                <li className={styles.formInputsItem}>
                  <span className={styles.inputLabel}>Домофон</span>
                  <Input
                    value={selectCourier ? selectCourier.intercom : ""}
                    onChange={(e) => handleChangeValues(e.target.value, "intercom")}
                    placeholder="Номер"
                    variantSize="md"
                    variant="outlined"
                    autoComplete="off"
                    maxLength={20}
                    inputMode="tel"
                  />
                </li>
                <li className={styles.formInputsItem}>
                  <span className={styles.inputLabel}>Этаж</span>
                  <Input
                    value={selectCourier ? selectCourier.floor : ""}
                    onChange={(e) => handleChangeValues(e.target.value, "floor")}
                    placeholder="Номер"
                    variantSize="md"
                    variant="outlined"
                    autoComplete="off"
                    maxLength={10}
                    inputMode="tel"
                  />
                </li>
              </div>
            </ul>
          )}

          {methodReceipt === "pickup" && (
            <ul className={styles.pickupList}>
              {props.pickupAddress.map((marker) => (
                <li key={`${marker.lng}_${marker.lat}_${marker.type}_${marker.name}`}>
                  <Checkbox
                    checked={getIsActiveAddress(marker.lng, marker.lat)}
                    onChange={() => handleSelectAddress(marker.lng, marker.lat)}
                    isRect
                    labelText={marker.name}
                  />
                  <button
                    onClick={() => handleSelectAddress(marker.lng, marker.lat)}
                    type="button"
                    className={styles.pickupItemSubTitle}
                  >
                    Пункт выдачи бесплатно
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className={styles.formFooter}>
          <Button
            fullWidth
            size="lg"
            variant="solid"
            variantColor="violet"
            onClick={handleSubmitModal}
            disabled={isSubmitDisabled}
          >
            {methodReceipt === "courier" ? "Доставить сюда" : "Заберу отсюда"}
          </Button>
        </footer>
      </section>
      <section className={styles.mapSide}>
        {methodReceipt === "courier" && selectCourier && !isOutOfZone && (
          <div className={styles.deliveryPrice}>
            {deliveryPrice > 0 ? (
              <>
                <span>Доставка</span>
                <span className={styles.deliveryPriceValue}>
                  {formatterRub.format(deliveryPrice)}
                </span>
              </>
            ) : (
              <span className={styles.deliveryPriceFree}>Бесплатно</span>
            )}
          </div>
        )}
        {activeAddress && props.active && (
          <MapBox
            onClickMap={handleClickMap}
            onClickMarker={handleClickMarker}
            active={activeAddress}
            initCenter={activeAddress}
            markers={
              methodReceipt === "pickup"
                ? props.pickupAddress
                : selectCourier
                  ? [selectCourier]
                  : []
            }
            initZoom={15}
            mapboxAccessToken={props.mapToken}
            mapStyle={props.mapStyle}
            width={"100%"}
            height={"100%"}
            zones={methodReceipt === "courier" ? props.sectors : undefined}
          />
        )}
      </section>
      <button type="button" onClick={props.onClose} className={styles.closeButtonSvg}>
        <CloseSvg />
      </button>
    </Modal>
  );
};
