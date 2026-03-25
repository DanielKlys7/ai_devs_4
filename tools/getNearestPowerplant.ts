const coordsCache = new Map<string, { lat: number; lon: number } | null>();

const fetchCoords = async (
  city: string
): Promise<{ lat: number; lon: number } | null> => {
  if (coordsCache.has(city)) return coordsCache.get(city)!;

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(city)}&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ai-agent/1.0' } });
  if (!res.ok) {
    coordsCache.set(city, null);
    return null;
  }
  const data = await res.json();
  const feature = data?.features?.[0];
  const result = feature
    ? { lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] }
    : null;
  coordsCache.set(city, result);
  return result;
};

const haversineKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getNearestPowerplant = async ({
  sightings,
  powerPlants,
}: {
  sightings: { latitude: number; longitude: number }[];
  powerPlants: { city: string; code: string }[];
}): Promise<
  | { city: string; code: string; distanceKm: number; nearestSighting: { latitude: number; longitude: number } }
  | { error: string }
> => {
  let best: {
    city: string;
    code: string;
    distanceKm: number;
    nearestSighting: { latitude: number; longitude: number };
  } | null = null;

  for (const plant of powerPlants) {
    const coords = await fetchCoords(plant.city);
    if (!coords) {
      console.warn(`[getNearestPowerplant] Could not resolve coords for: ${plant.city}`);
      continue;
    }

    for (const s of sightings) {
      const dist = haversineKm(s.latitude, s.longitude, coords.lat, coords.lon);
      if (!best || dist < best.distanceKm) {
        best = {
          city: plant.city,
          code: plant.code,
          distanceKm: Math.round(dist * 100) / 100,
          nearestSighting: s,
        };
      }
    }
  }

  if (!best) {
    return { error: 'Could not resolve coordinates for any of the provided power plant cities.' };
  }

  return best;
};
