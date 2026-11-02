import { StoreGet } from '@repo/constants';
import { extractCoordsFromIframeUrl, getDistanceInKm } from '@repo/utils';

export interface StoreWithDistance extends StoreGet {
  distanceKm: number;
  latitude?: number;
  longitude?: number;
}

export function getStoresSortedByProximity(
  userLat: number,
  userLng: number,
  storeList: StoreGet[],
): StoreWithDistance[] {
  return storeList
    .map((store) => {
      const coords = extractCoordsFromIframeUrl(store.iframe);

      if (!coords) {
        return { ...store, distanceKm: Infinity };
      }

      const distanceKm = getDistanceInKm(userLat, userLng, coords.latitude, coords.longitude);

      return {
        ...store,
        distanceKm,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
