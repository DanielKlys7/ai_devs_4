export const getCoordinates = async ({
  city,
}: {
  city: string;
}): Promise<{ lat: number; lon: number } | { error: string }> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&countrycodes=pl&format=json&limit=1`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'ai-agent/1.0' },
  });

  if (!res.ok) {
    return { error: `Nominatim error: ${res.status} ${res.statusText}` };
  }

  const data = await res.json();

  if (!data.length) {
    return { error: `No coordinates found for city: ${city}` };
  }

  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
};
