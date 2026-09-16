import { COOKIE_NAME } from '@repo/constants';
import { getCookieClient, setCookieClient } from '@repo/utils';
import { useState, useCallback, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  location: LocationData | null;
  error: string | null;
  loading: boolean;
  requestLocation: (options?: PositionOptions) => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestLocation = useCallback((options?: PositionOptions) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    if (location) return;

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationValue = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setLocation(locationValue);
        setLoading(false);

        setCookieClient(COOKIE_NAME.GEO_LOCATION, locationValue, { expiryInSeconds: 60 * 60 });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission was denied.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
        setLoading(false);
      },
      options,
    );
  }, []);

  useEffect(() => {
    const cookieGeoLocation: LocationData | null = getCookieClient(COOKIE_NAME.GEO_LOCATION);
    if (!cookieGeoLocation) return;
    setLocation(cookieGeoLocation);
  }, []);

  return { location, error, loading, requestLocation };
}
