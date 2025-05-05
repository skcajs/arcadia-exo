import { create } from "zustand";
import { SolutionMap } from "../types/SolutionMap";
import { Feature, GeoJsonProperties, Polygon } from "geojson";
import * as turf from "@turf/turf";

const defaultMap: SolutionMap = {
  states: [
    {
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
    },
  ],
  version: 0,
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
  undo: () => void;
  redo: () => void;
}

interface MapStore {
  mode: string;
  selectedSolutionMap: string;
  solutionMaps: Map<string, SolutionMap>;
  actions: MapActions;
  versionCounter: number; // Added versionCounter to the interface
}

const useMapStore = create<MapStore>()((set, get) => ({
  mode: "light",
  versionCounter: 0,
  selectedSolutionMap: "default",
  solutionMaps: new Map().set("default", defaultMap),
  actions: {
    setMode: (mode: string) => set({ mode }),
    setCurrentSolutionMap: async (
      selectedSolutionMap: string,
      solutionMapPath: string
    ) => {
      try {
        if (!get().solutionMaps.get(selectedSolutionMap)) {
          const res = await fetch(`/data/geojson/${solutionMapPath}`);
          if (!res.ok) {
            console.error(`Failed to fetch solution map: ${res.statusText}`);
            return;
          }
          const featureMap = await res.json();
          get().solutionMaps.set(selectedSolutionMap, {
            states: [{ collection: featureMap, selectedFeatures: [] }],
            version: 0,
          });
        }
      } catch (error) {
        console.error("An error occurred while setting the solution map:", error);
      }
      set({ selectedSolutionMap });
    },
    updateSelectedFeatures: (selectedFeature: Feature): boolean => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      let isSelected =
        selectedMap?.states[selectedMap.version].selectedFeatures.some(
          (featureIndex) =>
            selectedMap.states[selectedMap.version].collection.features[
            featureIndex
            ] === selectedFeature
        ) || false;

      if (
        selectedMap &&
        !isSelected &&
        selectedMap.states[selectedMap.version].selectedFeatures.length >= 2
      ) {
        isSelected = !isSelected;
      } else {
        const featureIndex = selectedMap?.states[
          selectedMap.version
        ].collection.features.findIndex(
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
                        states: [
                          ...map.states.slice(0, map.version + 1),
                          {
                            ...map.states[map.version],
                            selectedFeatures: isSelected
                              ? map.states[
                                map.version
                              ].selectedFeatures.filter(
                                (index: number) => index !== featureIndex
                              )
                              : [
                                ...map.states[map.version].selectedFeatures,
                                featureIndex,
                              ],
                          },
                        ],
                        version: map.version + 1,
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
      const solutionMap = solutionMaps.get(selectedSolutionMap);
      return solutionMap
        ? solutionMap.states[solutionMap.version].selectedFeatures.length === 2
        : false;
    },
    intersect: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);
      if (
        selectedMap &&
        selectedMap.states[selectedMap.version].selectedFeatures.length === 2
      ) {
        const intersect = turf.intersect(
          turf.featureCollection([
            selectedMap.states[selectedMap.version].collection.features[
            selectedMap.states[selectedMap.version].selectedFeatures[0]
            ],
            selectedMap.states[selectedMap.version].collection.features[
            selectedMap.states[selectedMap.version].selectedFeatures[1]
            ],
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
                        states: [
                          ...map.states.slice(0, map.version + 1),
                          {
                            selectedFeatures: [],
                            collection: turf.featureCollection(
                              intersect ? [intersect] : []
                            ),
                          },
                        ],
                        version: map.version + 1,
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
      if (
        selectedMap &&
        selectedMap.states[selectedMap.version].selectedFeatures.length === 2
      ) {
        const union = turf.union(
          turf.featureCollection([
            selectedMap.states[selectedMap.version].collection.features[
            selectedMap.states[selectedMap.version].selectedFeatures[0]
            ],
            selectedMap.states[selectedMap.version].collection.features[
            selectedMap.states[selectedMap.version].selectedFeatures[1]
            ],
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
                        states: [
                          ...map.states.slice(0, map.version + 1),
                          {
                            selectedFeatures: [],
                            collection: turf.featureCollection(
                              union ? [union] : []
                            ),
                          },
                        ],
                        version: map.version + 1,
                      },
                    ]
                    : [key, map]
              )
            ),
          });
        }
      }
    },
    undo: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const { versionCounter } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);

      if (selectedMap && selectedMap.version > 0) {
        set({
          solutionMaps: new Map(
            Array.from(solutionMaps.entries()).map(
              ([key, map]: [string, SolutionMap]) =>
                key === selectedSolutionMap
                  ? [
                    key,
                    {
                      ...map,
                      version: map.version - 1,
                    },
                  ]
                  : [key, map]
            )
          ),
        });

        set({ versionCounter: versionCounter + 1 });
      }
    },
    redo: () => {
      const { selectedSolutionMap } = get();
      const { solutionMaps } = get();
      const { versionCounter } = get();
      const selectedMap = solutionMaps.get(selectedSolutionMap);

      if (selectedMap && selectedMap.version < selectedMap.states.length - 1) {
        set({
          solutionMaps: new Map(
            Array.from(solutionMaps.entries()).map(
              ([key, map]: [string, SolutionMap]) =>
                key === selectedSolutionMap
                  ? [
                    key,
                    {
                      ...map,
                      version: map.version + 1,
                    },
                  ]
                  : [key, map]
            )
          ),
        });
        set({ versionCounter: versionCounter + 1 });
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
      selectedMap?.states[selectedMap.version].selectedFeatures.reduce(
        (sum, featureIndex) =>
          sum +
          (selectedMap.states[selectedMap.version].collection.features[
            featureIndex
          ]?.geometry.type === "Polygon"
            ? turf.area(
              selectedMap.states[selectedMap.version].collection.features[
              featureIndex
              ] as Feature<Polygon, GeoJsonProperties>
            )
            : 0),
        0
      ) ?? 0
    );
  });

export const useVersion = () => {
  return useMapStore(
    (state) => state.solutionMaps.get(state.selectedSolutionMap)?.version
  );
};

export const useHistoryCounter = () => {
  return useMapStore((state) => state.versionCounter);
};

export const isSelected = (selectedFeature: Feature): boolean => {
  const { selectedSolutionMap, solutionMaps } = useMapStore.getState();
  const selectedMap = solutionMaps.get(selectedSolutionMap);
  return (
    selectedMap?.states[selectedMap.version].selectedFeatures.some(
      (featureIndex) =>
        selectedMap.states[selectedMap.version].collection.features[
        featureIndex
        ] === selectedFeature
    ) || false
  );
};

export const getStateLength = (): number => {
  const { selectedSolutionMap, solutionMaps } = useMapStore.getState();
  const selectedMap = solutionMaps.get(selectedSolutionMap);
  return selectedMap ? selectedMap.states.length - 1 : 0;
};
