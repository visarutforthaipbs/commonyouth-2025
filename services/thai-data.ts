
// Type definitions for the Raw JSON structure
interface RawTambon {
  id: number;
  name_th: string;
  zip_code?: number;
  lat?: number;
  long?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

interface RawAmphoe {
  id: number;
  name_th: string;
  tambon: RawTambon[];
}

interface RawProvince {
  id: number;
  name_th: string;
  amphure: RawAmphoe[];
}

// Type definitions for our Application
export interface Tambon {
  name: string;
  coordinates: { lat: number; lng: number };
}

export interface Amphoe {
  name: string;
  coordinates: { lat: number; lng: number };
  tambons: Tambon[];
}

export interface Province {
  name: string;
  coordinates: { lat: number; lng: number };
  amphoes: Amphoe[];
}

// Cache for loaded data
let thaiLocationsCache: Province[] | null = null;

export const loadThaiLocations = async (): Promise<Province[]> => {
  if (thaiLocationsCache) return thaiLocationsCache;

  try {
    const response = await fetch('/thai_province_data.json');
    if (!response.ok) {
        throw new Error('Failed to load Thai location data');
    }
    const rawData = await response.json() as RawProvince[];

    thaiLocationsCache = rawData.map(p => {
      return {
        name: p.name_th,
        coordinates: { lat: 0, lng: 0 },
        amphoes: p.amphure.map(a => {
          return {
            name: a.name_th,
            coordinates: { lat: 0, lng: 0 },
            tambons: a.tambon ? a.tambon.map(t => ({
              name: t.name_th,
              coordinates: { 
                lat: t.lat || 0, 
                lng: t.long || 0 
              }
            })) : []
          };
        })
      };
    });

    return thaiLocationsCache;
  } catch (error) {
    console.error("Error loading Thai locations:", error);
    return [];
  }
};

export const getCoordinates = (locations: Province[], provinceName: string, amphoeName?: string, tambonName?: string): { lat: number, lng: number } => {
    const province = locations.find(p => p.name === provinceName);
    if (!province) return { lat: 13.7563, lng: 100.5018 }; // Default to Bangkok

    let lat = province.coordinates.lat;
    let lng = province.coordinates.lng;
    
    // Fallback coordinates for partial data compatibility
    if (lat === 0 && lng === 0) {
         if (province.name === "กรุงเทพมหานคร") { lat = 13.7563; lng = 100.5018; }
         else if (province.name === "เชียงใหม่") { lat = 18.7883; lng = 98.9853; }
         else if (province.name === "ขอนแก่น") { lat = 16.4322; lng = 102.8236; }
         else if (province.name === "ภูเก็ต") { lat = 7.8804; lng = 98.3923; }
    }

    if (amphoeName) {
        const amphoe = province.amphoes.find(a => a.name === amphoeName);
        if (amphoe) {
            lat = amphoe.coordinates.lat;
            lng = amphoe.coordinates.lng;
            
            if (lat === 0 && lng === 0 && amphoe.tambons.length > 0) {
                 lat = amphoe.tambons[0].coordinates.lat;
                 lng = amphoe.tambons[0].coordinates.lng;
            }

            if (tambonName) {
                const tambon = amphoe.tambons.find(t => t.name === tambonName);
                if (tambon) {
                    lat = tambon.coordinates.lat;
                    lng = tambon.coordinates.lng;
                }
            }
        }
    }
    
    return { lat, lng };
};
