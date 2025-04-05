import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  isSelected,
  useHistoryCounter,
  useMapActions,
  useMode,
  useSolutionMap,
} from "../stores/mapStore";
import { useEffect, useRef } from "react";
import { FeatureCollection } from "geojson";

export default function Map() {
  const solutionMap = useSolutionMap();
  const mode = useMode();

  return (
    <>
      <MapContainer
        center={[0.1276, 51.5072]}
        zoom={14}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://{s}.basemaps.cartocdn.com/${mode}_all/{z}/{x}/{y}{r}.png`}
        />
        {solutionMap && (
          <MapFeatures
            geoJson={solutionMap.states[solutionMap.version].collection}
          />
        )}
      </MapContainer>
    </>
  );
}

const MapFeatures = ({ geoJson }: { geoJson: FeatureCollection }) => {
  const { updateSelectedFeatures, maxFeatures } = useMapActions();
  const historyCounter = useHistoryCounter();
  const map = useMap();
  const geoJsonLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!geoJson || !geoJson.features.length) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const layer = L.geoJSON(geoJson, {
      onEachFeature: (feature, layer) => {
        if (layer instanceof L.Path) {
          layer.setStyle({
            color: isSelected(feature) ? "#008000" : "#3388ff",
          });

          layer.on("click", () => {
            layer.setStyle({
              color: updateSelectedFeatures(feature)
                ? "#008000"
                : maxFeatures()
                ? "#808080"
                : "#3388ff",
            });
          });

          layer.on("mouseover", () => {
            layer.setStyle({
              color: isSelected(feature)
                ? "#3388ff"
                : maxFeatures()
                ? "#808080"
                : "#008000",
            });
          });

          layer.on("mouseout", () => {
            layer.setStyle({
              color: isSelected(feature) ? "#008000" : "#3388ff",
            });
          });
        }
      },
    });

    geoJsonLayerRef.current = layer;
    const bounds = layer.getBounds();

    map.addLayer(layer);
    map.setView(bounds.getCenter(), 15);
  }, [updateSelectedFeatures, maxFeatures, geoJson, map, historyCounter]);

  return null;
};
