import {
  FeatureCollection,
  Feature,
  Polygon,
  GeoJsonProperties,
  MultiPolygon,
} from "geojson";

export type SolutionMap = {
  collection: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
  selectedFeatures: Feature[];
};
