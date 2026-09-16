// 1. Regex parser for Google Maps embed URLs
export function extractCoordsFromIframeUrl(
  iframeUrl: string,
): { latitude: number; longitude: number } | null {
  const latMatch = iframeUrl.match(/!3d(-?\d+\.\d+)/);
  const lngMatch = iframeUrl.match(/!2d(-?\d+\.\d+)/);

  const lat = latMatch?.[1];
  const lng = lngMatch?.[1];

  if (lat !== undefined && lng !== undefined) {
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    };
  }

  return null;
}

// 2. Distance calculation in kilometers (Haversine formula)
export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
