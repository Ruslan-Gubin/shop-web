import { useEffect, useState } from "react";
import { getFullAddressItem } from "@/shared/helpers/getFullAddressItem";
import { DeleteSvg } from "@/shared/svg/DeleteSvg";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { SelectMethodReceiptModal } from "@/shared/ui/select-method-receipt-modal/SelectMethodReceiptModal";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import type { AddressItem } from "@/stores/checkout/types";
import styles from "./ModalSelectAddress.module.css";

type Props = {
  method_receipt: "pickup" | "courier";
  pickupAddress: AddressItem[];
  courierAddress: AddressItem[];
  active: boolean;
  onClose: () => void;
  onAddAddress: () => void;
  activePickup: { lng: number; lat: number } | null;
  activeCourier: { lng: number; lat: number } | null;
  defaultCenter: { lng: number; lat: number };
};

export const ModalSelectAddress = (props: Props) => {
  const [methodReceipt, setMethodReceipt] = useState<"pickup" | "courier">("pickup");
  const [selectPickup, setSelectPickup] = useState<{ lng: number; lat: number } | null>(null);
  const [selectCourier, setSelectCourier] = useState<{ lng: number; lat: number } | null>(null);

  const handleChangeMethod = (value: "pickup" | "courier") => {
    setMethodReceipt(value);
  };

  const handleSelectAddress = (lng: number, lat: number) => {
    if (lng && lat) {
      if (methodReceipt === "pickup") {
        setSelectPickup({ lng, lat });
      } else if (methodReceipt === "courier") {
        setSelectCourier({ lng, lat });
      }
    }
  };

  const handleDeleteAddress = (lng: number, lat: number, name: string) => {
    if (lng && lat && name) {
      checkoutAdapter.deleteAddress(lng, lat, name);

      if (selectCourier?.lng === lng && selectCourier?.lat === lat) {
        if (props.activeCourier) {
          setSelectCourier(props.activeCourier);
        } else if (Array.isArray(props.courierAddress) && props.courierAddress[0]) {
          setSelectCourier({ lng: props.courierAddress[0].lng, lat: props.courierAddress[0].lat });
        }
      }
    }
  };

  const onSubmitAddress = () => {
    checkoutAdapter.setMethodReceipt(methodReceipt);
    if (methodReceipt === "pickup" && selectPickup) {
      checkoutAdapter.setActiveAddress(selectPickup.lng, selectPickup.lat);
    } else if (methodReceipt === "courier" && selectCourier) {
      checkoutAdapter.setActiveAddress(selectCourier.lng, selectCourier.lat);
    }
    props.onClose();
  };

  useEffect(() => {
    if (props.active) {
      if (selectPickup === null && props.activePickup) {
        setSelectPickup(props.activePickup);
      }

      if (selectCourier === null && props.activeCourier) {
        setSelectCourier(props.activeCourier);
      }
    } else {
      setSelectPickup(null);
      setSelectCourier(null);
    }
  }, [props.active, selectPickup, selectCourier, props.activeCourier, props.activePickup]);

  useEffect(() => {
    if (props.active && methodReceipt !== props.method_receipt) {
      setMethodReceipt(props.method_receipt);
    }
  }, [props.active, props.method_receipt]);

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

  const filterAddress = methodReceipt === "pickup" ? props.pickupAddress : props.courierAddress;

  return (
    <Modal active={props.active} handleCloseAction={props.onClose}>
      <ModalContent>
        <ModalHeader title={"Способ доставки"} onClose={props.onClose} />
        <ModalBody className={styles.modalBody}>
          <section className={styles.selectTypeRoot}>
            <SelectMethodReceiptModal
              methodReceipt={methodReceipt}
              onChangeMethod={handleChangeMethod}
            />
          </section>
          <ul className={styles.addressList}>
            {filterAddress.map((address) => (
              <li
                className={styles.addressItem}
                key={`${address.lng}_${address.lat}_${address.type}_${address.name}`}
              >
                <Checkbox
                  checked={getIsActiveAddress(address.lng, address.lat)}
                  onChange={() => handleSelectAddress(address.lng, address.lat)}
                  isRect
                  labelText={getFullAddressItem(address)}
                />
                {methodReceipt === "courier" && (
                  <button
                    disabled={
                      props.activeCourier !== null &&
                      props.activeCourier.lng === address.lng &&
                      props.activeCourier.lat === address.lat
                    }
                    onClick={() => handleDeleteAddress(address.lng, address.lat, address.name)}
                    className={styles.deleteButton}
                    type="button"
                  >
                    <DeleteSvg />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter
          addAction={
            methodReceipt === "courier"
              ? {
                  disabled: false,
                  action: props.onAddAddress,
                  variant: "solid",
                  variantColor: "violet",
                  text: "Добавить",
                  size: "sm",
                }
              : undefined
          }
          submitAction={{
            action: onSubmitAddress,
            disabled:
              (methodReceipt === "pickup" && !selectPickup) ||
              (methodReceipt === "courier" && !selectCourier),
            variant: "solid",
            variantColor: "violet",
            text: methodReceipt === "courier" ? "Доставить сюда" : "Заберу отсюда",
            size: "sm",
          }}
        />
      </ModalContent>
    </Modal>
  );
};
