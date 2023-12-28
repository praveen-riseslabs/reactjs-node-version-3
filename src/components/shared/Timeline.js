import TimelineMenu from "../timeline/TimelineMenu";
import { CircularProgress, LinearProgress } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Map from "../timeline/Map";
import { useThunk } from "../../hooks/useThunk";
import { sendCoords } from "../../store";
import ErrorSnackBar from "../../components/modals/ErrorSnackBar";
import { useSelector } from "react-redux";

function Timeline() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [permission, setPermission] = useState("");
  // const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [routesResponse, setRoutesResponse] = useState(null);
  const [distance, setDistance] = useState(0);

  const [
    doSendCoords,
    sendingCoordsLoading,
    errorSendingCoords,
    resetErrorSendingCoords,
  ] = useThunk(sendCoords);

  const { coords: markers } = useSelector((state) => state.map);
  const { user } = useSelector((state) => state.user);

  //setting up map api
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  });

  //calculate/ render the directions
  useEffect(() => {
    const renderRoute = async (points) => {
      const directionService = new window.google.maps.DirectionsService();

      const origin = { lat: points[0].latitude, lng: points[0].longitude };
      const destination = {
        lat: points.at(-1).latitude,
        lng: points.at(-1).longitude,
      };

      //setting up service with direction options
      const results = await directionService.route({
        origin,
        destination,
        waypoints: points.slice(1, points.length - 1).map((marker) => ({
          location: { lat: marker.latitude, lng: marker.longitude },
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setRoutesResponse(results);
      setDistance(results?.routes[0]?.legs[0]?.distance?.text);
    };

    Object.keys(markers).length && renderRoute(markers.points);
  }, [markers]);

  //config for watching users current location
  // ..watching position changes
  useEffect(() => {
    // Define an success callback function
    const successHandler = (position) => {
      const { latitude, longitude } = position.coords;
      doSendCoords({ latitude, longitude });
    };

    // Define an error callback function
    const errorHandler = (error) => {
      console.error("Error getting location:", error.message);
    };

    const watchId =
      user.isTrackingEnabled &&
      navigator.geolocation.watchPosition(successHandler, errorHandler, {
        enableHighAccuracy: true,
      });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [doSendCoords, user.isTrackingEnabled]);

  //setting permissions
  useEffect(() => {
    (async () => {
      const status = await navigator.permissions.query({ name: "geolocation" });
      setPermission(status.state);
    })();

    return () => {
      setPermission("");
    };
  }, []);

  //calling the request permission function if not already granted
  if (!permission || permission === "denied" || permission === "prompt") {
    return (
      <div className="position-absolute top-50 start-50 translate-middle text-secondary">
        <p>Location permision is required to access your timeline</p>
      </div>
    );
  }

  //on map loading
  if (!isLoaded) {
    return <LinearProgress sx={{ bgcolor: "#8a2be2" }} />;
  }

  return (
    <div
      className="overflow-auto position-relative scroll-none m-1"
      style={{ height: "45rem" }}
    >
      {loadError ? (
        <span className="fs-5 opacity-25 position-absolute translate-middle start-50 top-50">
          Error loading map
        </span>
      ) : (
        <>
          {/* Menu */}
          <TimelineMenu distance={distance} enabled={user.isTrackingEnabled} />

          {/* google map box */}
          {/* <button onClick={() => map.panTo({ lat: 48.984, lng: 2.297 })}>
            Click me to center the map
          </button> */}
          <Map
            setMap={setMap}
            map={map}
            response={routesResponse}
            points={markers?.points}
          />

          {/* handling loading and errors */}
          <div className="position-absolute end-0 bottom-0 z-3">
            {sendingCoordsLoading && <CircularProgress size={20} />}
            <ErrorSnackBar
              open={errorSendingCoords}
              autoHideDuration={3000}
              onClose={resetErrorSendingCoords}
              note={"there was an error storing coordinates"}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Timeline;
