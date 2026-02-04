'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import '../lib/leaflet-fix.css';
import { syriaLocations } from '@/lib/scenes';

// تحميل مكونات Leaflet ديناميكياً مع تعطيل SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

interface SyriaMapProps {
  onLocationSelect?: (locationId: string) => void;
  activeLocationId?: string;
  className?: string;
}

export default function SyriaMap({ 
  onLocationSelect, 
  activeLocationId,
  className = '' 
}: SyriaMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const leafletRef = useRef<any>(null);

  // التأكد من أننا في متصفح العميل
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل Leaflet ديناميكياً
  useEffect(() => {
    if (!isClient) return;

    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        leafletRef.current = L;
        
        // إصلاح أيقونات Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        setLeafletLoaded(true);
        setTimeout(() => setIsMapLoaded(true), 500);
      } catch (error) {
        console.error('فشل تحميل Leaflet:', error);
      }
    };

    loadLeaflet();
  }, [isClient]);

  const syriaCenter: [number, number] = [34.8021, 38.9968];
  const syriaBounds: [[number, number], [number, number]] = [
    [32.3, 35.6],
    [37.3, 42.4]
  ];

  const handleMarkerClick = (locationId: string) => {
    setSelectedLocation(locationId);
    setSelectedImageIndex(0);
    if (onLocationSelect) onLocationSelect(locationId);
  };

  const createCustomIcon = (isActive: boolean, icon: string) => {
    if (!leafletRef.current) return null;
    const L = leafletRef.current;
    return L.divIcon({
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gold ${
            isActive ? 'bg-gradient-to-br from-gold to-yellow-400 animate-pulse shadow-lg' : 'bg-black/50'
          } transition-transform duration-300 hover:scale-110">
            <span class="text-xl">${icon}</span>
          </div>
          ${isActive ? '<div class="w-3 h-3 bg-gold rotate-45 mt-[-6px]"></div>' : ''}
        </div>
      `,
      className: '',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });
  };

  const nextImage = () => {
    const location = syriaLocations.find(loc => loc.id === selectedLocation);
    if (location) setSelectedImageIndex((prev) => (prev + 1) % location.realImages.length);
  };

  const prevImage = () => {
    const location = syriaLocations.find(loc => loc.id === selectedLocation);
    if (location) setSelectedImageIndex((prev) => (prev - 1 + location.realImages.length) % location.realImages.length);
  };

  if (!isClient || !leafletLoaded) {
    return (
      <div className={`relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl ${className}`}>
        <div className="h-[500px] w-full flex items-center justify-center bg-[#0a2919]">
          <div className="text-center text-gold font-bold animate-pulse">جاري تحميل الخريطة...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl ${className}`}>
      <div className="bg-gradient-to-r from-[#0a2919] to-[#0d351f] p-4 border-b border-gold/30 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">الخريطة التفاعلية لسوريا</h3>
        <span className="text-sm text-gold">{syriaLocations.length} موقع حقيقي</span>
      </div>

      <div className="relative h-[500px] w-full">
        <MapContainer
          center={syriaCenter}
          zoom={7}
          minZoom={6}
          maxZoom={12}
          maxBounds={syriaBounds}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom={true}
          dragging={true}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {syriaLocations.map((location) => {
            const isActive = activeLocationId === location.id;
            const customIcon = createCustomIcon(isActive, location.icon);
            if (!customIcon) return null;

            return (
              <Marker
                key={location.id}
                position={location.position}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(location.id),
                }}
              >
                <Popup
                  autoPan={false}
                  className="custom-popup"
                  closeButton={false}
                  autoClose={false}
                  closeOnEscapeKey={true}
                  maxWidth={500}
                  minWidth={300}
                >
                  <div className="p-3 min-w-[300px] max-w-[500px]">
                    <div className="relative mb-4 rounded-xl overflow-hidden">
                      <div className="aspect-video bg-black/20 relative">
                        <img
                          src={location.realImages[selectedImageIndex]}
                          alt={location.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1583160247711-2191776b4b91?w=800&auto=format&fit=crop';
                          }}
                        />
                        {location.realImages.length > 1 && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); prevImage(); }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition">←</button>
                            <button onClick={(e) => { e.stopPropagation(); nextImage(); }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition">→</button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-gradient-to-br from-gold to-yellow-400' : 'bg-gradient-to-br from-[#0a2919] to-[#0d351f] border border-gold/30'}`}>
                        <span className={`text-xl ${isActive ? 'text-black' : 'text-gold'}`}>{location.icon}</span>
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold ${isActive ? 'text-[#0a2919]' : 'text-white'}`}>{location.name}</h4>
                        <p className="text-sm text-gray-300">{location.description}</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
