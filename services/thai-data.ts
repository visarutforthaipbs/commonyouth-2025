export interface Province {
  name: string;
  coordinates: { lat: number, lng: number };
  amphoes: Amphoe[];
}

export interface Amphoe {
  name: string;
  coordinates: { lat: number, lng: number };
  tambons: Tambon[];
}

export interface Tambon {
  name: string;
  coordinates: { lat: number, lng: number };
}

// Simplified Thai Location Data (Mock for demonstration)
export const THAI_LOCATIONS: Province[] = [
  {
    name: "กรุงเทพมหานคร",
    coordinates: { lat: 13.7563, lng: 100.5018 },
    amphoes: [
      {
        name: "พระนคร",
        coordinates: { lat: 13.7648, lng: 100.4992 },
        tambons: [
           { name: "พระบรมมหาราชวัง", coordinates: { lat: 13.7500, lng: 100.4913 } },
           { name: "วังบูรพาภิรมย์", coordinates: { lat: 13.7447, lng: 100.5029 } }
        ]
      },
      {
        name: "ปทุมวัน",
        coordinates: { lat: 13.7449, lng: 100.5293 },
        tambons: [
            { name: "รองเมือง", coordinates: { lat: 13.7437, lng: 100.5168 } },
            { name: "ลุมพินี", coordinates: { lat: 13.7317, lng: 100.5413 } }
        ]
      }
    ]
  },
  {
    name: "เชียงใหม่",
    coordinates: { lat: 18.7883, lng: 98.9853 },
    amphoes: [
      {
        name: "เมืองเชียงใหม่",
        coordinates: { lat: 18.7904, lng: 98.9847 },
        tambons: [
            { name: "ศรีภูมิ", coordinates: { lat: 18.7937, lng: 98.9872 } },
            { name: "ช้างม่อย", coordinates: { lat: 18.7900, lng: 98.9950 } }
        ]
      },
      {
        name: "แม่ริม",
        coordinates: { lat: 18.9135, lng: 98.9405 },
        tambons: [
            { name: "ริมใต้", coordinates: { lat: 18.9135, lng: 98.9405 } },
            { name: "ริมเหนือ", coordinates: { lat: 18.9472, lng: 98.9558 } }
        ]
      }
    ]
  },
  {
    name: "ขอนแก่น",
    coordinates: { lat: 16.4322, lng: 102.8236 },
    amphoes: [
      {
        name: "เมืองขอนแก่น",
        coordinates: { lat: 16.4255, lng: 102.8353 },
        tambons: [
            { name: "ในเมือง", coordinates: { lat: 16.4255, lng: 102.8353 } },
            { name: "เมืองเก่า", coordinates: { lat: 16.3980, lng: 102.8090 } }
        ]
      }
    ]
  }
];

export const getCoordinates = (provinceName: string, amphoeName?: string, tambonName?: string): { lat: number, lng: number } => {
    const province = THAI_LOCATIONS.find(p => p.name === provinceName);
    if (!province) return { lat: 13.7563, lng: 100.5018 }; // Default to Bangkok

    let lat = province.coordinates.lat;
    let lng = province.coordinates.lng;

    if (amphoeName) {
        const amphoe = province.amphoes.find(a => a.name === amphoeName);
        if (amphoe) {
            lat = amphoe.coordinates.lat;
            lng = amphoe.coordinates.lng;

            if (tambonName) {
                const tambon = amphoe.tambons.find(t => t.name === tambonName);
                if (tambon) {
                    lat = tambon.coordinates.lat;
                    lng = tambon.coordinates.lng;
                }
            }
        }
    }
    
    // Add small random jitter to prevent stacked markers if exact same location
    return {
        lat: lat + (Math.random() - 0.5) * 0.005,
        lng: lng + (Math.random() - 0.5) * 0.005
    };
};
