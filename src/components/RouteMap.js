import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

const RouteMap = ({ routeData }) => {
  const [mapData, setMapData] = useState({
    firstLegLayer: null,
    secondLegLayer: null,
    markers: [],
    bounds: null,
  });

  useEffect(() => {
    if (!routeData || !routeData.legs || routeData.legs.length < 2) return;

    const addLegLayer = (geometry, color) => {
      if (!geometry || geometry.length === 0) return null;
      const latLngs = geometry.map((coord) => [coord[1], coord[0]]);
      const polyline = L.polyline(latLngs, { color, weight: 5 });
      return polyline;
    };

    const addMarker = (coordinates, color, label, description) => {
      if (!coordinates || coordinates.length === 0) return null;
      const marker = L.marker([coordinates[1], coordinates[0]], {
        icon: L.divIcon({
          className: "leaflet-div-icon",
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
        }),
      });

      marker.bindPopup(`
        <h3>${label}</h3>
        <p>${description}</p>
      `);
      return marker;
    };

    const firstLeg = routeData.legs[0]?.routes[0]?.geometry?.coordinates;
    const secondLeg = routeData.legs[1]?.routes[0]?.geometry?.coordinates;

    const startCoordinates = routeData.current_location
      ?.split(",")
      ?.map((loc) => loc.trim());
    const pickupCoordinates = routeData.pickup_location
      ?.split(",")
      ?.map((loc) => loc.trim());
    const dropoffCoordinates = routeData.dropoff_location
      ?.split(",")
      ?.map((loc) => loc.trim());

    if (
      !firstLeg ||
      !secondLeg ||
      !startCoordinates ||
      !pickupCoordinates ||
      !dropoffCoordinates
    )
      return;

    const bounds = L.latLngBounds([
      ...firstLeg.map((coord) => [coord[1], coord[0]]),
      ...secondLeg.map((coord) => [coord[1], coord[0]]),
    ]);

    const firstLegLayer = addLegLayer(firstLeg, "#3b82f6");
    const secondLegLayer = addLegLayer(secondLeg, "#8b5cf6");

    const markers = [
      addMarker(
        startCoordinates,
        "#10b981",
        "Start",
        routeData.current_location
      ),
      addMarker(
        pickupCoordinates,
        "#f59e0b",
        "Pickup",
        routeData.pickup_location
      ),
      addMarker(
        dropoffCoordinates,
        "#ef4444",
        "Dropoff",
        routeData.dropoff_location
      ),
    ];

    setMapData({
      firstLegLayer,
      secondLegLayer,
      markers,
      bounds,
    });
  }, [routeData]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        className="w-full h-full"
        center={routeData?.current_location ? [51.505, -0.09] : [51.505, -0.09]}
        zoom={5}
        bounds={mapData.bounds}
        whenCreated={(map) => {
          if (mapData.bounds) {
            map.fitBounds(mapData.bounds, { padding: [50, 50] });
          }
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mapData.firstLegLayer}
        {mapData.secondLegLayer}
        {mapData.markers.map(
          (marker, index) =>
            marker && (
              <Marker key={index} position={marker.getLatLng()}>
                {marker.getPopup()}
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
