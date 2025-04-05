import {
  FeatureCollection,
  Polygon,
  GeoJsonProperties,
  MultiPolygon,
} from "geojson";

export type SolutionMap = {
  states: State[];
  version: number;
};

type State = {
  collection: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
  selectedFeatures: number[];
};
