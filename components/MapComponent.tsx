import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Group, ISSUES } from '../types';

// Map issues to icon files
const ISSUE_ICONS: Record<string, string> = {
  "ความยุติธรรมทางสภาพอากาศ": "/image/icons/youth-group-icon/Asset 4.svg",
  "การพัฒนาเมือง": "/image/icons/youth-group-icon/Asset 5.svg",
  "สิทธิชนเผ่าพื้นเมือง": "/image/icons/youth-group-icon/Asset 6.svg",
  "ปฏิรูปการศึกษา": "/image/icons/youth-group-icon/Asset 7.svg",
  "ความเท่าเทียมทางเพศ": "/image/icons/youth-group-icon/Asset 8.svg",
  "สิทธิดิจิทัล": "/image/icons/youth-group-icon/Asset 9.svg",
  "ศิลปะและวัฒนธรรม": "/image/icons/youth-group-icon/Asset 4.svg", // Reused
};

interface MapComponentProps {
  groups: Group[];
  selectedProvince?: string | null;
  onProvinceSelect?: (province: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ groups, selectedProvince, onProvinceSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // Fetch Thailand provinces GeoJSON
  useEffect(() => {
    fetch('/thailand-provinces.json')
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  // Count groups per province and determine primary issue
  const groupsByProvince = groups.reduce((acc, group) => {
    const province = group.province;
    if (!acc[province]) {
      acc[province] = [];
    }
    acc[province].push(group);
    return acc;
  }, {} as Record<string, Group[]>);

  // Get primary issue icon for province
  const getProvinceIcon = (provinceName: string): string => {
    const provinceGroups = groupsByProvince[provinceName];
    if (!provinceGroups || provinceGroups.length === 0) return '';
    
    // Simple frequency count for issues
    const issueCounts: Record<string, number> = {};
    provinceGroups.forEach(group => {
      group.issues.forEach(issue => {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
      });
    });
    
    // Find most common issue
    const primaryIssue = Object.keys(issueCounts).reduce((a, b) => issueCounts[a] > issueCounts[b] ? a : b);
    return ISSUE_ICONS[primaryIssue] || ISSUE_ICONS[ISSUES[0]];
  };

  // Extract province name from properties with multiple fallback keys
  const getProvinceName = (properties: any): string => {
    if (!properties) return '';
    return properties.name_th || properties.pro_th || properties.th_name || properties.province_th || 
           properties.name_en || properties.pro_en || properties.en_name || properties.province_en || '';
  };

  // Helper matching function
  const matchProvinceName = (geojsonName: string): string | null => {
    if (!geojsonName) return null;
    
    // Normalize strings to handle potential Thai character encoding differences (NFC vs NFD)
    const normalizedGeoName = geojsonName.normalize('NFC').trim();
    
    // Check direct match
    if (groupsByProvince[normalizedGeoName]) return normalizedGeoName;
    
    // Check keys
    const provincesWithGroups = Object.keys(groupsByProvince);
    for (const province of provincesWithGroups) {
      const normalizedProvince = province.normalize('NFC').trim();
      
      // Try exact match on normalized strings
      if (normalizedGeoName === normalizedProvince) return province;
      
      // Try partial match
      if (normalizedGeoName.includes(normalizedProvince) || normalizedProvince.includes(normalizedGeoName)) {
        return province;
      }
    }
    return null;
  };

  // Debug Data
  useEffect(() => {
    if (groups.length > 0) {
      console.log('MapComponent: Received groups:', groups.length);
      console.log('MapComponent: Groups by province:', Object.keys(groupsByProvince));
    }
    if (geojsonData && geojsonData.features.length > 0) {
      console.log('MapComponent: GeoJSON loaded, features:', geojsonData.features.length);
      const sample = geojsonData.features[0].properties;
      console.log('MapComponent: Sample properties raw:', sample);
      console.log('MapComponent: Resolved name:', getProvinceName(sample));
    }
  }, [groups, geojsonData]);

  // Render Map using D3
  useEffect(() => {
    if (!geojsonData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create projection centered on Thailand
    const projection = d3.geoMercator()
      .center([100.5018, 13.7563]) // Center on Bangkok
      .scale(2500) // Initial scale
      .translate([width / 2, height / 2]);

    // If a province is selected, zoom to it
    if (selectedProvince) {
      const selectedFeature = geojsonData.features.find((f: any) => {
        const pName = getProvinceName(f.properties);
        return matchProvinceName(pName) === selectedProvince;
      });

      if (selectedFeature) {
        const bounds = d3.geoPath().bounds(selectedFeature);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = (bounds[0][0] + bounds[1][0]) / 2;
        const y = (bounds[0][1] + bounds[1][1]) / 2;
        const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
        
        // This calculates new projection settings to center on province
        // Note: For D3 projection zooming, it's often easier to re-center projection
        // or apply transform to a group. Here we adjust projection directly for simplicity.
        projection.fitExtent([[50, 50], [width - 50, height - 50]], selectedFeature);
      }
    } else {
       // Reset to full Thailand view but ensure it fits container better
       projection.fitExtent([[20, 20], [width - 20, height - 20]], geojsonData);
    }
    
    const pathGenerator = d3.geoPath().projection(projection);

    // Render Provinces
    svg.append("g")
      .selectAll("path")
      .data(geojsonData.features as any[])
      .join("path")
      .attr("d", pathGenerator as any)
      .attr("fill", (d: any) => {
        const pName = getProvinceName(d.properties);
        if (selectedProvince && selectedProvince === matchProvinceName(pName)) return '#B5D340'; // Selected
        if (matchProvinceName(pName)) return '#EC6839'; // Has groups
        return '#FAF6E2'; // No groups
      })
      .attr("fill-opacity", (d: any) => {
        const pName = getProvinceName(d.properties);
        // Higher opacity for selected or has-groups
        if (selectedProvince && selectedProvince === matchProvinceName(pName)) return 0.7;
        if (matchProvinceName(pName)) return 0.4;
        return 0.2;
      })
      .attr("stroke", "#161716")
      .attr("stroke-width", (d: any) => {
         const pName = getProvinceName(d.properties);
         return selectedProvince && selectedProvince === matchProvinceName(pName) ? 2 : 1;
      })
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        const pName = getProvinceName(d.properties);
        setHoveredProvince(pName);
        d3.select(this).attr("fill-opacity", 0.8).attr("stroke-width", 2);
      })
      .on("mouseout", function(event, d) {
        setHoveredProvince(null);
        const pName = getProvinceName(d.properties);
        const isMatched = matchProvinceName(pName);
        
        // Restore original opacity
        let opacity = 0.2;
        if (selectedProvince && selectedProvince === isMatched) opacity = 0.7;
        else if (isMatched) opacity = 0.4;
        
        d3.select(this).attr("fill-opacity", opacity)
          .attr("stroke-width", selectedProvince && selectedProvince === isMatched ? 2 : 1);
      })
      .on("click", (event, d) => {
        const pName = getProvinceName(d.properties);
        const matched = matchProvinceName(pName);
        if (onProvinceSelect && matched) {
          onProvinceSelect(matched);
        } else if (onProvinceSelect) {
           // Allow selecting empty provinces too? Or maybe just ignore
           // onProvinceSelect(pName); 
        }
      })
      .append("title") // Simple browser tooltip
      .text((d: any) => {
         const pName = getProvinceName(d.properties);
         const count = groupsByProvince[matchProvinceName(pName) || '']?.length || 0;
         return `${pName}: ${count} groups`;
      });

    // Render Icons for provinces with groups (only if no province selected)
    if (!selectedProvince) {
      geojsonData.features.forEach((feature: any) => {
        const pName = getProvinceName(feature.properties);
        const matched = matchProvinceName(pName);
        
        if (matched && groupsByProvince[matched]?.length > 0) {
          const centroid = pathGenerator.centroid(feature);
          if (centroid[0] && centroid[1]) { // Check for valid numbers
             // Use D3 to append image
             svg.append("image")
                .attr("x", centroid[0] - 20) // Center icon (40px width)
                .attr("y", centroid[1] - 20) // Center icon (40px height)
                .attr("width", 40)
                .attr("height", 40)
                .attr("href", getProvinceIcon(matched))
                .style("cursor", "pointer")
                .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.3))")
                .on("mouseover", function() {
                   d3.select(this)
                     .transition().duration(200)
                     .attr("transform", `translate(${centroid[0]},${centroid[1]}) scale(1.2) translate(${-centroid[0]},${-centroid[1]})`);
                })
                .on("mouseout", function() {
                   d3.select(this)
                     .transition().duration(200)
                     .attr("transform", "scale(1)");
                })
                .on("click", () => {
                   if (onProvinceSelect) onProvinceSelect(matched);
                });
          }
        }
      });
    }

  }, [geojsonData, groups, selectedProvince]); // Re-render when data/selection changes

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border-2 border-brand-obsidian shadow-retro relative z-0 bg-[#A6D1E6]">
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        className="w-full h-full"
        style={{ backgroundColor: '#A6D1E6' }} // Ocean color matching map
      ></svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg border-2 border-brand-obsidian shadow-retro-sm z-[100] max-w-xs">
        <h4 className="font-bold text-xs mb-2 text-brand-obsidian">คำอธิบาย</h4>
        
        {/* Province colors */}
        <div className="space-y-1 text-xs mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-brand-obsidian" style={{ backgroundColor: '#EC6839', opacity: 0.4 }}></div>
            <span>มีกลุ่มเยาวชน</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-brand-obsidian" style={{ backgroundColor: '#FAF6E2', opacity: 0.2 }}></div>
            <span>ยังไม่มีกลุ่ม</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-brand-obsidian" style={{ backgroundColor: '#B5D340', opacity: 0.7 }}></div>
            <span>จังหวัดที่เลือก</span>
          </div>
        </div>

        {/* Issue icons (only show when no province is selected) */}
        {!selectedProvince && (
          <>
            <div className="border-t border-brand-gray pt-2 mt-2">
              <h5 className="font-bold text-xs mb-2 text-brand-obsidian">ประเด็นหลัก</h5>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {ISSUES.slice(0, 6).map((issue, index) => (
                  <div key={issue} className="flex items-center gap-1">
                    <img 
                      src={ISSUE_ICONS[issue]} 
                      alt={issue} 
                      className="w-5 h-5"
                    />
                    <span className="truncate">{issue.split(' ')[0]}...</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;