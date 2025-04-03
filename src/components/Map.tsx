import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSolutionMap } from "../stores/mapStore";
import { useEffect, useRef } from "react";
import { FeatureCollection } from "geojson";

export default function Map() {
  const solutionMap = useSolutionMap();

  return (
    <>
      <MapContainer center={[123, 123]} zoom={14}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFeatures geoJson={solutionMap.collection} />
      </MapContainer>
    </>
  );
}

const MapFeatures = ({ geoJson }: { geoJson: FeatureCollection }) => {
  const map = useMap();
  const geoJsonLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!geoJson || !geoJson.features.length) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const layer = L.geoJSON(geoJson);
    geoJsonLayerRef.current = layer;
    const bounds = layer.getBounds();

    map.addLayer(layer);
    map.setView(bounds.getCenter(), 15);
  }, [geoJson, map]);

  return null;
};
