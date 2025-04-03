import {
  FeatureCollection,
  Feature,
  Polygon,
  GeoJsonProperties,
  MultiPolygon,
} from "geojson";

export type SolutionMap = {
  name: string;
  selectedFeatures: Feature[];
  collection: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
};
