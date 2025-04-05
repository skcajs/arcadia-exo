import { create } from "zustand";
import { SolutionMap } from "../types/SolutionMap";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import * as turf from "@turf/turf";

const defaultMap: SolutionMap = {
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
  setMode: (mode: string) => void;
  setCurrentSolutionMap: (
    selectedSolutionMap: string,
    solutionMapPath: string
  ) => void;
  updateSelectedFeatures: (selectedFeature: Feature) => boolean;
  maxFeatures: () => boolean;
  intersect: () => void;
  union: () => void;
}

interface MapStore {
  mode: string;
  selectedSolutionMap: string;
  solutionMaps: Map<string, SolutionMap>;
  actions: MapActions;
}

const useMapStore = create<MapStore>()((set, get) => ({
  mode: "light",
  selectedSolutionMap: "default",
  solutionMaps: new Map().set("default", defaultMap),
  actions: {
    setMode: (mode: string) => set({ mode }),
    setCurrentSolutionMap: async (
      selectedSolutionMap: string,
      solutionMapPath: string
    ) => {
      if (!get().solutionMaps.get(selectedSolutionMap)) {
        const res = await fetch(`/data/geojson/${solutionMapPath}`);
        if (!res.ok) return;
        const featureMap = await res.json();
        get().solutionMaps.set(selectedSolutionMap, {
          collection: featureMap,
          selectedFeatures: [],
        });
      }
      set({ selectedSolutionMap });
    },
    updateSelectedFeatures: (selectedFeature: Feature): boolean => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      let isSelected =
        selectedMap?.selectedFeatures.some(
          (featureIndex) =>
            selectedMap.collection.features[featureIndex] === selectedFeature
        ) || false;

      if (
        selectedMap &&
        !isSelected &&
        selectedMap.selectedFeatures.length >= 2
      ) {
        isSelected = !isSelected;
      } else {
        const featureIndex = selectedMap?.collection.features.findIndex(
          (feature) => feature === selectedFeature
        );

        if (featureIndex !== undefined && featureIndex !== -1) {
          set({
            solutionMaps: new Map(
              Array.from(solutionMaps.entries()).map(
                ([key, map]: [string, SolutionMap]) =>
                  key === selectedSolutionMap
                    ? [
                        key,
                        {
                          ...map,
                          selectedFeatures: isSelected
                            ? map.selectedFeatures.filter(
                                (index: number) => index !== featureIndex
                              )
                            : [...map.selectedFeatures, featureIndex],
                        },
                      ]
                    : [key, map]
              )
            ),
          });
        }
      }

      return !isSelected;
    },
    maxFeatures: (): boolean => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      return (
        solutionMaps.get(selectedSolutionMap)?.selectedFeatures.length === 2
      );
    },
    intersect: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      if (selectedMap && selectedMap.selectedFeatures.length === 2) {
        const intersect = turf.intersect(
          turf.featureCollection([
            selectedMap.collection.features[selectedMap.selectedFeatures[0]],
            selectedMap.collection.features[selectedMap.selectedFeatures[1]],
          ])
        );

        if (intersect) {
          set({
            solutionMaps: new Map(
              Array.from(solutionMaps.entries()).map(
                ([key, map]: [string, SolutionMap]) =>
                  key === selectedSolutionMap
                    ? [
                        key,
                        {
                          ...map,
                          selectedFeatures: [],
                          collection: turf.featureCollection(
                            intersect ? [intersect] : []
                          ),
                        },
                      ]
                    : [key, map]
              )
            ),
          });
        }
      }
    },
    union: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      if (selectedMap && selectedMap.selectedFeatures.length === 2) {
        const union = turf.union(
          turf.featureCollection([
            selectedMap.collection.features[selectedMap.selectedFeatures[0]],
            selectedMap.collection.features[selectedMap.selectedFeatures[1]],
          ])
        );

        if (union) {
          set({
            solutionMaps: new Map(
              Array.from(solutionMaps.entries()).map(
                ([key, map]: [string, SolutionMap]) =>
                  key === selectedSolutionMap
                    ? [
                        key,
                        {
                          ...map,
                          selectedFeatures: [],
                          collection: turf.featureCollection(
                            union ? [union] : []
                          ),
                        },
                      ]
                    : [key, map]
              )
            ),
          });
        }
      }
    },
  },
}));

export const useMode = () => useMapStore((state) => state.mode);

export const useSolutionMap = () =>
  useMapStore((state) => state.solutionMaps.get(state.selectedSolutionMap));

export const useMapActions = () => useMapStore((state) => state.actions);

export const useArea = () =>
  useMapStore((state) => {
    const selectedMap = state.solutionMaps.get(state.selectedSolutionMap);
    return (
      selectedMap?.selectedFeatures.reduce(
        (sum, featureIndex) =>
          sum +
          (selectedMap.collection.features[featureIndex]?.geometry.type ===
          "Polygon"
            ? turf.area(
                selectedMap.collection.features[featureIndex] as Feature<
                  Polygon,
                  GeoJsonProperties
                >
              )
            : 0),
        0
      ) ?? 0
    );
  });

export const isSelected = (selectedFeature: Feature): boolean => {
  const { selectedSolutionMap, solutionMaps } = useMapStore.getState();
  const selectedMap = solutionMaps.get(selectedSolutionMap);
  return (
    selectedMap?.selectedFeatures.some(
      (featureIndex) =>
        selectedMap.collection.features[featureIndex] === selectedFeature
    ) || false
  );
};
