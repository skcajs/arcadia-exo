import { FeatureCollection, Feature } from "geojson";

export type SolutionMap = {
  name: string;
  selectedFeatures: Feature[];
  collection: FeatureCollection;
};
