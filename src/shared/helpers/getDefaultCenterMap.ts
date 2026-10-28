import type { WarehouseModel } from "@/app/checkout/action";

export const getDefaultCenterMap = (warehouses: WarehouseModel[]) => {
  let lng = 0;
  let lat = 0;

  for (let i = 0; i < warehouses.length; i++) {
    const warehouse = warehouses[i];

    if (
      Object.hasOwn(warehouse, "address") &&
      warehouse.address &&
      warehouse.is_active &&
      warehouse.default_warehouse
    ) {
      lng = warehouse.address.lng;
      lat = warehouse.address.lat;
    }
  }

  return { lng, lat };
};
