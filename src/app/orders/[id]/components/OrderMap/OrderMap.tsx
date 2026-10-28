"use client";
import { MapBox } from "@/shared/ui/mapbox/MapBox";
import type { AddressItem } from "@/stores/checkout/types";

type Props = {
  address: AddressItem;
  mapboxAccessToken: string;
  mapStyle: string;
};

export const OrderMap = (props: Props) => {
  const active = { lat: props.address.lat, lng: props.address.lng };

  return (
    <MapBox
      markers={[props.address]}
      onClickMarker={() => {}}
      initCenter={active}
      active={active}
      initZoom={15}
      mapboxAccessToken={props.mapboxAccessToken}
      mapStyle={props.mapStyle}
      width="100%"
      height="100%"
    />
  );
};
