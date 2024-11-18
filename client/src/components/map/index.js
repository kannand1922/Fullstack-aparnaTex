import React, { useEffect, useState } from "react";

const MapComponent = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdvrPiFTHPjYFYtioxQ-4WENnMznKeb9g&libraries=places`;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const mapElement = document.getElementById("map");
    if (mapElement) {
      const location = { lat: 11.1676, lng: 77.6042 }; // Coimbatore coordinates

      const mapInstance = new window.google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
      });

      const marker = new window.google.maps.Marker({
        position: location,
        map: mapInstance,
        title: "Coimbatore Location",
      });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.error("Geocoding failed:", status);
        }
      });
    } else {
      console.error("Map container element not found");
    }
  };

  return (
    <div>
      <div id="map" style={{ height: "380px", width: "100%" }}></div>
      <div style={{ marginTop: "20px" }}>
        <strong>Address:</strong> {address}
      </div>
    </div>
  );
};

export default MapComponent;
