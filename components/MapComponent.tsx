import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Group } from '../types';
import L from 'leaflet';

// Fix for default marker icon in webpack/production/browser environments
// We cannot import images directly as modules in this environment
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

fixLeafletIcon();

// Custom Pin Icon using HTML Div Icon to match brand
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: #7AA874;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

interface MapComponentProps {
  groups: Group[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

// New component to handle map view updates (FlyTo or FitBounds)
const MapController = ({ groups, selectedGroup }: { groups: Group[], selectedGroup?: Group }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedGroup) {
      // Focus on specific selected group
      map.flyTo([selectedGroup.coordinates.lat, selectedGroup.coordinates.lng], 12, {
        animate: true,
        duration: 1.5
      });
    } else if (groups.length > 0) {
      // Fit bounds to show all visible groups
      const bounds = L.latLngBounds(groups.map(g => [g.coordinates.lat, g.coordinates.lng]));
      
      // Check if bounds are valid (e.g., if all points are the same, it creates a 0-size bound)
      if (bounds.isValid()) {
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 10,
          animate: true,
          duration: 1.5
        });
      } else {
        // Fallback if single point or invalid bounds
        map.setView(bounds.getCenter(), 10);
      }
    }
  }, [groups, selectedGroup, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ groups, selectedId, onSelect }) => {
  const defaultCenter: [number, number] = [13.7563, 100.5018]; // Bangkok
  
  const selectedGroup = groups.find(g => g.id === selectedId);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border-2 border-brand-darkGreen shadow-retro relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController groups={groups} selectedGroup={selectedGroup} />

        {groups.map(group => (
          <Marker 
            key={group.id} 
            position={[group.coordinates.lat, group.coordinates.lng]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => onSelect && onSelect(group.id),
            }}
          >
            <Popup className="font-sans">
              <div className="min-w-[150px]">
                <h3 className="font-bold text-brand-darkGreen">{group.name}</h3>
                <p className="text-xs text-brand-earth">{group.province}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {group.issues.slice(0,2).map(i => (
                    <span key={i} className="text-[10px] bg-brand-cream px-1 rounded border border-brand-gray">{i}</span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;