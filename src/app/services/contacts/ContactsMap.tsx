"use client";
import { MapBox } from "@/shared/ui/mapbox/MapBox";
import type { AddressItem } from "@/stores/checkout/types";

type Props = {
  markers: AddressItem[];
  initCenter: { lat: number; lng: number };
  active: { lat: number; lng: number } | null;
  mapboxAccessToken: string;
  mapStyle: string;
};

export const ContactsMap = ({
  markers,
  initCenter,
  active,
  mapboxAccessToken,
  mapStyle,
}: Props) => {
  return (
    <MapBox
      markers={markers}
      onClickMarker={() => {}}
      initCenter={initCenter}
      active={active}
      initZoom={15}
      mapboxAccessToken={mapboxAccessToken}
      mapStyle={mapStyle}
      width="100%"
      height="100%"
    />
  );
};
