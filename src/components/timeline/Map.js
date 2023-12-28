import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect } from "react";

function Map({ map, setMap, points = [], response }) {
  //finding origin and destination
  const origin = points.length && {
    lat: points[0].latitude,
    lng: points[0].longitude,
  };
  const destination = points.length && {
    lat: points.at(-1).latitude,
    lng: points.at(-1).longitude,
  };

  //expanding the map to fix the route
  useEffect(() => {
    if (map && points.length) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((marker) => {
        bounds.extend({ lat: marker.latitude, lng: marker.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [map, points]);

  if (!points.length) {
    return (
      <GoogleMap
        center={{ lat: 0, lng: 0 }}
        zoom={8}
        mapContainerClassName="h-100 w-100 z-1"
        onLoad={(map) => setMap(map)}
        onUnmount={() => setMap(null)}
        options={{
          zoomControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker position={{ lat: 0, lng: 0 }} />
      </GoogleMap>
    );
  }

  return (
    <GoogleMap
      center={points.length ? origin : { lat: 0, lng: 0 }}
      zoom={8}
      mapContainerClassName="h-100 w-100 z-1"
      onLoad={(map) => setMap(map)}
      onUnmount={() => setMap(null)}
      options={{
        zoomControl: false,
        mapTypeControl: false,
      }}
    >
      {/* rendering marker origin and destination */}
      <Marker
        position={origin && origin}
        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
      />
      <Marker
        position={destination && destination}
        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
      />
      {response && (
        <DirectionsRenderer
          directions={response}
          options={{
            suppressMarkers: false,
            markerOptions: {
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              },
            },
          }}
        />
      )}
    </GoogleMap>
  );
}

export default Map;
