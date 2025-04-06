import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const RouteMap = ({ routeData }) => {
  const [firstLegCoords, setFirstLegCoords] = useState([]);
  const [secondLegCoords, setSecondLegCoords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [bounds, setBounds] = useState(null);

  const geocodeLocation = async (location) => {
    const apiKey = "5b3ce3597851110001cf6248f6083129c02d4805b29e8f82e8a23494";
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
      location
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.features?.length > 0) {
        return data.features[0].geometry.coordinates.reverse(); // [lat, lng]
      } else {
        console.warn("Location not found:", location);
        return null;
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!routeData?.legs || routeData.legs.length < 2) return;

      const firstLeg =
        polyline.decode(routeData.legs[0]?.routes[0]?.geometry) || [];
      const secondLeg =
        polyline.decode(routeData.legs[1]?.routes[0]?.geometry) || [];

      const [startCoord, pickupCoord, dropoffCoord] = await Promise.all([
        geocodeLocation(routeData.current_location),
        geocodeLocation(routeData.pickup_location),
        geocodeLocation(routeData.dropoff_location),
      ]);

      const allCoords = [...firstLeg, ...secondLeg];
      setBounds(allCoords);

      setFirstLegCoords(firstLeg);
      setSecondLegCoords(secondLeg);

      const newMarkers = [];

      if (startCoord) {
        newMarkers.push({
          position: startCoord,
          label: "Start",
          description: routeData.current_location,
        });
      }

      if (pickupCoord) {
        newMarkers.push({
          position: pickupCoord,
          label: "Pickup",
          description: routeData.pickup_location,
        });
      }

      if (dropoffCoord) {
        newMarkers.push({
          position: dropoffCoord,
          label: "Dropoff",
          description: routeData.dropoff_location,
        });
      }

      setMarkers(newMarkers);
    };

    fetchData();
  }, [routeData]);

  const isReady = markers.length >= 2 && bounds;

  if (!isReady) {
    return <div className="text-gray-500 p-4">Loading route map...</div>;
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        className="w-full h-full"
        center={markers[0].position}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds bounds={bounds} />

        {firstLegCoords.length > 0 && (
          <Polyline
            positions={firstLegCoords}
            pathOptions={{ color: "#3b82f6" }}
          />
        )}
        {secondLegCoords.length > 0 && (
          <Polyline
            positions={secondLegCoords}
            pathOptions={{ color: "#8b5cf6" }}
          />
        )}

        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>
              <strong>{marker.label}</strong>
              <br />
              {marker.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
