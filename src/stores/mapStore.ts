import { create } from "zustand";
import { SolutionMap } from "../types/SolutionMap";

const defaultMap: SolutionMap = {
  solutionName: "default",
  collection: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[[2.2919046878814697, 48.85770582708133]]],
        },
      },
    ],
  },
};

interface MapActions {
  setSolutionMap: (geoMap: SolutionMap) => void;
}

interface MapStore {
  solutionMap: SolutionMap;
  actions: MapActions;
}

const useMapStore = create<MapStore>()((set) => ({
  solutionMap: defaultMap,
  actions: {
    setSolutionMap: (solutionMap: SolutionMap) => set({ solutionMap }),
  },
}));

export const useSolutionMap = () => useMapStore((state) => state.solutionMap);

export const useMapActions = () => useMapStore((state) => state.actions);
