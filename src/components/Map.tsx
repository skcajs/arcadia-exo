import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapActions, useSolutionMap } from "../stores/mapStore";
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
  const { addSelectedFeature } = useMapActions();
  const map = useMap();
  const geoJsonLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!geoJson || !geoJson.features.length) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const layer = L.geoJSON(geoJson, {
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          const isAdded = addSelectedFeature(feature);

          if (layer instanceof L.Path) {
            layer.setStyle({
              color: isAdded ? "green" : "#3388ff",
            });
          }
          console.log(feature);
        });
      },
    });

    geoJsonLayerRef.current = layer;
    const bounds = layer.getBounds();

    map.addLayer(layer);
    map.setView(bounds.getCenter(), 15);
  }, [addSelectedFeature, geoJson, map]);

  return null;
};
