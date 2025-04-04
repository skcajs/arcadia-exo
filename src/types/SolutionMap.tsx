import {
  FeatureCollection,
  Polygon,
  GeoJsonProperties,
  MultiPolygon,
} from "geojson";

export type SolutionMap = {
  collection: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
  selectedFeatures: number[];
};
