"use client";
import { getSelectDeliveryDate } from "@/shared/helpers/getSelectDeliveryDate";
import { SelectDeliveryTime } from "@/shared/ui/select-delivery-time/SelectDeliveryTime";
import { SelectWeekDate } from "@/shared/ui/select-week-date/SelectWeekDate";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import { checkoutStore } from "@/stores/checkout/store";
import { BasketInfoCard } from "../BasketInfoCard/BasketInfoCard";

export const DeliveryDateCard = () => {
  const delivery_date = checkoutStore((store) => store.delivery_date);
  const delivery_time = checkoutStore((store) => store.delivery_time);
  const endWork = 19;

  const nowDate = new Date();
  const selectDeliveryDate = getSelectDeliveryDate(delivery_date);

  const handleChangeDeliveryDate = (value: string) => {
    let updateDate = value === delivery_date ? nowDate.toDateString() : value;

    const isSelectToday = nowDate.toDateString() === updateDate;

    if (isSelectToday) {
      const currentHours = nowDate.getHours();

      if (endWork - currentHours < 3) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        updateDate = nextDay.toDateString();
      } else {
        if (delivery_time && delivery_time < currentHours + 2) {
          checkoutAdapter.setDeliveryTime(currentHours + 2);
        }
      }
    }

    checkoutAdapter.setDeliveryDate(updateDate);
  };

  const handleChangeDeliveryTime = (value: number) => {
    checkoutAdapter.setDeliveryTime(value);
  };

  return (
    <BasketInfoCard title="Дата и время">
      <SelectWeekDate
        todayDate={nowDate}
        date={selectDeliveryDate}
        onChange={handleChangeDeliveryDate}
        countDay={11}
        endWork={endWork}
      />
      <SelectDeliveryTime
        todayDate={nowDate}
        date={selectDeliveryDate}
        onChange={handleChangeDeliveryTime}
        time={delivery_time}
        endWork={endWork}
      />
    </BasketInfoCard>
  );
};
