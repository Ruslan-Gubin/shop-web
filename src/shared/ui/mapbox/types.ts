export type MapBoxFeaturesItem = {
  id: string;
  geometry: { type: string; coordinates: number[] };
  properties: {
    context: {
      address: {
        address_number: string;
        mapbox_id: string;
        name: string;
        street_name: string;
      };
      country: {
        country_code: string;
        country_code_alpha_3: string;
        mapbox_id: string;
        name: string;
        translations: {
          ru: {
            language: string;
            name: string;
          };
        };
        wikidata_id: string;
      };
      place: {
        mapbox_id: string;
        name: string;

        translations: {
          ru: {
            language: string;
            name: string;
          };
        };
        wikidata_id: string;
      };
      postcode: {
        mapbox_id: string;
        name: string;
      };
      region: {
        mapbox_id: string;
        name: string;
        region_code: string;
        region_code_full: string;
        translations: {
          ru: {
            language: string;
            name: string;
          };
        };
        wikidata_id: string;
      };
      street: {
        mapbox_id: string;
        name: string;
      };
    };
    coordinates: {
      accuracy: string;
      latitude: number;
      longitude: number;
    };
    routable_points: {
      latitude: number;
      longitude: number;
      name: string;
    }[];
    mapbox_id: string;
    feature_type: string;
    full_address: string;
    name: string;
    name_preferred: string;
    place_formatted: string;
  };
  type: string;
};
