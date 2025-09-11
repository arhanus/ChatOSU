'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, Libraries } from '@react-google-maps/api';

interface MapProps {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
  overflow: 'hidden',
};

const libraries: Libraries = ['places'];

// Separate map content component
function MapContent({ location }: MapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [directionsRequested, setDirectionsRequested] = useState(false);

  const center = useMemo(() => ({
    lat: location.lat,
    lng: location.lng,
  }), [location.lat, location.lng]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Unable to get your location. Please enable location services.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  const directionsCallback = useCallback((response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status === 'OK' && response) {
      setDirections(response);
      setDirectionsRequested(false);
    }
  }, []);

  const getDirections = () => {
    if (!userLocation) {
      setLocationError("Please allow location access to get directions");
      return;
    }
    setShowDirections(true);
    setDirectionsRequested(true);
  };

  const hideDirections = () => {
    setShowDirections(false);
    setDirections(null);
    setDirectionsRequested(false);
  };

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          gestureHandling: 'cooperative',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <Marker
          position={center}
          title={location.name}
          animation={google.maps.Animation.DROP}
        />
        {userLocation && (
          <Marker
            position={userLocation}
            title="Your Location"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}
        {showDirections && userLocation && directionsRequested && (
          <DirectionsService
            options={{
              origin: userLocation,
              destination: center,
              travelMode: google.maps.TravelMode.WALKING,
            }}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 5,
                strokeOpacity: 0.8
              }
            }}
          />
        )}
      </GoogleMap>
      
      <div className="mt-2 flex justify-between items-center">
        <button
          onClick={getDirections}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Get Directions
        </button>
        {showDirections && (
          <button
            onClick={hideDirections}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Hide Directions
          </button>
        )}
      </div>

      {locationError && (
        <div className="mt-2 text-red-500 text-sm">
          {locationError}
        </div>
      )}
    </div>
  );
}

// Main Map component that handles script loading
export default function Map(props: MapProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
      onLoad={() => setIsScriptLoaded(true)}
      loadingElement={
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading map...</p>
        </div>
      }
    >
      {isScriptLoaded ? (
        <MapContent {...props} />
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}
    </LoadScript>
  );
} 