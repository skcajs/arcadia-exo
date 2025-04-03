import { create } from "zustand";
import { SolutionMap } from "../types/SolutionMap";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import * as turf from "@turf/turf";

const defaultMap: SolutionMap = {
  name: "default",
  selectedFeatures: [],
  collection: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[[0.1276, 51.5072]]],
        },
      },
    ],
  },
};

interface MapActions {
  setSolutionMap: (solutionMap: SolutionMap) => void;
  updateSelectedFeatures: (selectedFeature: Feature) => boolean;
  intersect: () => void;
  union: () => void;
}

interface MapStore {
  solutionMap: SolutionMap;
  actions: MapActions;
}

const useMapStore = create<MapStore>()((set, get) => ({
  solutionMap: defaultMap,
  actions: {
    setSolutionMap: (solutionMap: SolutionMap) => set({ solutionMap }),
    updateSelectedFeatures: (selectedFeature: Feature): boolean => {
      const { solutionMap } = get();
      let isSelected = solutionMap.selectedFeatures.some(
        (feature) => feature === selectedFeature
      );

      if (!isSelected && solutionMap.selectedFeatures.length >= 2) {
        isSelected = !isSelected;
      } else {
        set({
          solutionMap: {
            ...solutionMap,
            selectedFeatures: isSelected
              ? solutionMap.selectedFeatures.filter(
                  (feature) => feature !== selectedFeature
                )
              : [...solutionMap.selectedFeatures, selectedFeature],
          },
        });
      }

      console.log(solutionMap.selectedFeatures);

      return !isSelected;
    },
    intersect: () => {
      const { solutionMap } = get();
      const coord1 =
        solutionMap.selectedFeatures[0].geometry.type === "Polygon"
          ? solutionMap.selectedFeatures[0].geometry.coordinates
          : null;

      const coord2 =
        solutionMap.selectedFeatures[1].geometry.type === "Polygon"
          ? solutionMap.selectedFeatures[1].geometry.coordinates
          : null;

      let poly1: Feature<Polygon, GeoJsonProperties> | null = coord1
        ? turf.polygon(coord1)
        : null;
      let poly2: Feature<Polygon, GeoJsonProperties> | null = coord2
        ? turf.polygon(coord2)
        : null;
      if (coord1 && coord2) {
        poly1 = turf.polygon(coord1);
        poly2 = turf.polygon(coord2);
      }

      const intersection =
        poly1 && poly2
          ? turf.intersect(turf.featureCollection([poly1, poly2]))
          : null;

      if (intersection) {
        set({
          solutionMap: {
            ...solutionMap,
            selectedFeatures: [],
            collection: turf.featureCollection(
              intersection ? [intersection] : []
            ),
          },
        });
      }

      //   const features: FeatureCollection<
      //     Polygon | MultiPolygon,
      //     GeoJsonProperties
      //   > = solutionMap.collection;
      //   const featureMap = turf.intersect(features);
      //   if (featureMap) {
      //     set({
      //       solutionMap: {
      //         ...solutionMap,
      //         selectedFeatures: [],
      //         collection: turf.featureCollection(featureMap ? [featureMap] : []),
      //       },
      //     });
      //   }
    },
    union: () => {
      const { solutionMap } = get();
      const coord1 =
        solutionMap.selectedFeatures[0].geometry.type === "Polygon"
          ? solutionMap.selectedFeatures[0].geometry.coordinates
          : null;

      const coord2 =
        solutionMap.selectedFeatures[1].geometry.type === "Polygon"
          ? solutionMap.selectedFeatures[1].geometry.coordinates
          : null;

      let poly1: Feature<Polygon, GeoJsonProperties> | null = coord1
        ? turf.polygon(coord1)
        : null;
      let poly2: Feature<Polygon, GeoJsonProperties> | null = coord2
        ? turf.polygon(coord2)
        : null;
      if (coord1 && coord2) {
        poly1 = turf.polygon(coord1);
        poly2 = turf.polygon(coord2);
      }

      const union =
        poly1 && poly2
          ? turf.union(turf.featureCollection([poly1, poly2]))
          : null;

      if (union) {
        set({
          solutionMap: {
            ...solutionMap,
            selectedFeatures: [],
            collection: turf.featureCollection(union ? [union] : []),
          },
        });
      }
    },
  },
}));

export const useSolutionMap = () => useMapStore((state) => state.solutionMap);

export const useMapActions = () => useMapStore((state) => state.actions);

export const useArea = () =>
  useMapStore((state) =>
    state.solutionMap.selectedFeatures.reduce(
      (sum, feature) => sum + turf.area(feature),
      0
    )
  );
