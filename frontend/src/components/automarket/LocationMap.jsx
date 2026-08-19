import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Approximate coords for Irish counties/locations
const locationCoords = {
  'Dublin': [53.3498, -6.2603],
  'Cork': [51.8985, -8.4756],
  'Galway': [53.2707, -9.0568],
  'Limerick': [52.6638, -8.6267],
  'Waterford': [52.2593, -7.1101],
  'Kilkenny': [52.6541, -7.2448],
  'Mayo': [53.8477, -9.2988],
  'Kerry': [52.1545, -9.5669],
  'Clare': [52.9045, -8.9814],
  'Tipperary': [52.4734, -8.1619],
  'Wexford': [52.3369, -6.4633],
  'Wicklow': [52.9809, -6.0444],
  'Meath': [53.6050, -6.6563],
  'Kildare': [53.1561, -6.9147],
  'Roscommon': [53.6273, -8.1896],
  'Westmeath': [53.5345, -7.4635],
  // Fallback
  'Ireland': [53.1424, -7.6921],
};

function resolveCoords(location) {
  if (!location) return locationCoords['Ireland'];
  const key = Object.keys(locationCoords).find(k =>
    location.toLowerCase().includes(k.toLowerCase())
  );
  return key ? locationCoords[key] : locationCoords['Ireland'];
}

export default function LocationMap({ location }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    setCoords(resolveCoords(location));
  }, [location]);

  if (!coords) return null;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-base font-bold text-foreground">General Location</h2>
      </div>
      <p className="px-5 pb-3 text-sm text-muted-foreground flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-primary/40 border border-primary"></span>
        Showing approximate area — exact address shared on contact
      </p>
      <div className="h-56 w-full">
        <MapContainer
          center={coords}
          zoom={11}
          scrollWheelZoom={false}
          zoomControl={true}
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle
            center={coords}
            radius={4000}
            pathOptions={{ color: 'hsl(213,80%,50%)', fillColor: 'hsl(213,80%,50%)', fillOpacity: 0.15, weight: 2 }}
          >
            <Popup>{location || 'Ireland'}</Popup>
          </Circle>
        </MapContainer>
      </div>
      <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
        📍 {location || 'Ireland'}
      </div>
    </div>
  );
}