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
  setCurrentSolutionMap: (
    selectedSolutionMap: string,
    solutionMapPath: string
  ) => void;
  updateSelectedFeatures: (selectedFeature: Feature) => boolean;
  intersect: () => void;
  union: () => void;
}

interface MapStore {
  selectedSolutionMap: string;
  solutionMaps: Map<string, SolutionMap>;
  actions: MapActions;
}

const useMapStore = create<MapStore>()((set, get) => ({
  selectedSolutionMap: "default",
  solutionMaps: new Map().set("default", defaultMap),
  actions: {
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
          (feature) => feature === selectedFeature
        ) || false;

      if (
        selectedMap &&
        !isSelected &&
        selectedMap.selectedFeatures.length >= 2
      ) {
        isSelected = !isSelected;
      } else {
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
                              (feature: Feature) => feature !== selectedFeature
                            )
                          : [...map.selectedFeatures, selectedFeature],
                      },
                    ]
                  : [key, map]
            )
          ),
        });
      }

      return !isSelected;
    },
    intersect: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      if (selectedMap && selectedMap.selectedFeatures.length === 2) {
        const coord1 =
          selectedMap.selectedFeatures[0].geometry.type === "Polygon"
            ? selectedMap.selectedFeatures[0].geometry.coordinates
            : null;

        const coord2 =
          selectedMap.selectedFeatures[1].geometry.type === "Polygon"
            ? selectedMap.selectedFeatures[1].geometry.coordinates
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
                            intersection ? [intersection] : []
                          ),
                        },
                      ]
                    : [key, map]
              )
            ),
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
      }
    },
    union: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      if (selectedMap && selectedMap.selectedFeatures.length === 2) {
        const coord1 =
          selectedMap.selectedFeatures[0].geometry.type === "Polygon"
            ? selectedMap.selectedFeatures[0].geometry.coordinates
            : null;

        const coord2 =
          selectedMap.selectedFeatures[1].geometry.type === "Polygon"
            ? selectedMap.selectedFeatures[1].geometry.coordinates
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

export const useSolutionMap = () =>
  useMapStore((state) => state.solutionMaps.get(state.selectedSolutionMap));

export const useMapActions = () => useMapStore((state) => state.actions);

export const useArea = () =>
  useMapStore((state) =>
    (
      state.solutionMaps.get(state.selectedSolutionMap)?.selectedFeatures ?? []
    ).reduce((sum, feature) => sum + turf.area(feature), 0)
  );

export const isSelected = (selectedFeature: Feature): boolean => {
  const { selectedSolutionMap, solutionMaps } = useMapStore.getState();
  const selectedMap = solutionMaps.get(selectedSolutionMap);
  return (
    selectedMap?.selectedFeatures.some(
      (feature) => feature === selectedFeature
    ) || false
  );
};
