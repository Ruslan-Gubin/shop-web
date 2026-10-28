import type { OrderProductModel, OrderReservation } from "../types";

export const getProblemProductStocks = (products: OrderProductModel[]): number => {
  let left = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    for (let j = 0; j < product.reservations.length; j++) {
      const reservation = product.reservations[j];

      const findShortageStock = product.shortage_stocks.find(
        (el) =>
          el.stock_id === reservation.stock_id && el.warehouse_id === reservation.warehouse_id,
      );

      left +=
        findShortageStock && reservation.quantity > findShortageStock.quantity
          ? findShortageStock.quantity
          : reservation.quantity;
    }
  }

  return left;
};

export const getLeftQuantity = (
  needQuantity: number,
  reservations: OrderReservation[],
  shortage_stocks: OrderReservation[],
): number => {
  let left = needQuantity;

  for (let j = 0; j < reservations.length; j++) {
    const reservation = reservations[j];

    const findShortageStock = shortage_stocks.find(
      (el) =>
        el.stock_id === reservation.stock_id && el.warehouse_id === reservation.warehouse_id,
    );

    if (findShortageStock && reservation.quantity > findShortageStock.quantity) {
      left -= reservation.quantity - findShortageStock.quantity;
    }
  }

  return left;
};
