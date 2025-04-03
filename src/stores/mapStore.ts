import { create } from "zustand";
import { SolutionMap } from "../types/SolutionMap";
import { Feature } from "geojson";
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
  getArea: () => number;
}

interface MapStore {
  solutionMap: SolutionMap;
  actions: MapActions;
}

export const useMapStore = create<MapStore>()((set, get) => ({
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
    getArea: (): number => {
      const { solutionMap } = get();
      let area = 0;

      solutionMap.selectedFeatures.forEach((feature) => {
        area += turf.area(feature);
      });

      return area;
    },
  },
}));

export const useSolutionMap = () => useMapStore((state) => state.solutionMap);

export const useMapActions = () => useMapStore((state) => state.actions);
