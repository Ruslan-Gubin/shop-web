import type { Position } from "geojson";
import type { MapFeatureModel } from "@/app/checkout/action";

const isPointInCoordinates = (coordinates: Position[], lng: number, lat: number) => {
  let isInside = false;

  for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    const [xi, yi] = coordinates[i];
    const [xj, yj] = coordinates[j];
    const isCrossing = yi > lat !== yj > lat;
    const intersectLng = ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (isCrossing && lng < intersectLng) {
      isInside = !isInside;
    }
  }

  return isInside;
};

export const findMapSector = (
  features: MapFeatureModel[],
  lng: number,
  lat: number,
): MapFeatureModel | null => {
  let result: MapFeatureModel | null = null;

  for (let i = 0; i < features.length; i++) {
    const sector = features[i];
    const coordinates = sector.geometry.coordinates[0];

    if (Array.isArray(coordinates) && isPointInCoordinates(coordinates, lng, lat)) {
      if (result === null || (result && sector?.properties?.price < result?.properties?.price)) {
        result = sector;
      }
    }
  }

  return result;
};
