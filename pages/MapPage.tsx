
import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../services/authContext';
import { Group, ISSUES } from '../types';
import MapComponent from '../components/MapComponent';
import { Filter, Search } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const MapPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [filterIssue, setFilterIssue] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  const location = useLocation();
  
  // Refs for scrolling to list items
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    apiService.getGroups().then(setGroups);
  }, []);

  // Handle navigation from Detail page with pre-selected group
  useEffect(() => {
    if (location.state && location.state.selectedGroupId) {
      const group = groups.find(g => g.id === location.state.selectedGroupId);
      if (group) {
        setSelectedProvince(group.province);
      }
    }
  }, [location, groups]);

  // Scroll to selected province groups when selectedProvince changes
  useEffect(() => {
    if (selectedProvince && provinceGroupsInView.length > 0) {
      const firstGroupId = provinceGroupsInView[0].id;
      itemRefs.current[firstGroupId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedProvince]);

  const filteredGroups = groups.filter(group => {
    const matchesIssue = filterIssue === 'All' || group.issues.includes(filterIssue);
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          group.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = !group.isHidden || (user?.role === 'admin' || group.ownerId === user?.uid);
    
    return matchesIssue && matchesSearch && matchesVisibility;
  });

  // Get groups to display in the list (all if no province selected, or province-specific)
  const provinceGroupsInView = selectedProvince 
    ? filteredGroups.filter(g => g.province === selectedProvince)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
      <SEO 
        title="แผนที่พลังเยาวชน" 
        description="แผนที่แสดงตำแหน่งเครือข่ายกลุ่มกิจกรรมเยาวชนทั่วประเทศ"
      />
      <h1 className="text-3xl font-bold mb-6 flex items-center uppercase">
        <span className="w-8 h-8 bg-brand-orange rounded-full inline-block mr-3"></span>
        แผนที่พลังเยาวชน
      </h1>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border-2 border-brand-obsidian mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-retro-sm">
        <div className="flex items-center w-full md:w-auto bg-brand-linen rounded-lg px-3 py-2 border border-brand-gray">
            <Search className="w-4 h-4 text-brand-earth mr-2" />
            <input 
                type="text" 
                placeholder="ค้นหากลุ่มหรือจังหวัด..." 
                className="bg-transparent outline-none text-sm w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-brand-earth flex-shrink-0" />
            <button 
                onClick={() => setFilterIssue('All')}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterIssue === 'All' ? 'bg-brand-obsidian text-brand-linen' : 'bg-brand-linen text-brand-obsidian hover:bg-brand-gray'}`}
            >
                ประเด็นทั้งหมด
            </button>
            {ISSUES.map(issue => (
                <button 
                    key={issue}
                    onClick={() => setFilterIssue(issue)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterIssue === issue ? 'bg-brand-bud text-brand-obsidian' : 'bg-brand-linen text-brand-obsidian hover:bg-brand-gray'}`}
                >
                    {issue}
                </button>
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-8 h-auto lg:h-[600px]">
        {/* Group List (Sidebar) */}
        <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-4 max-h-[400px] lg:max-h-full lg:h-full scroll-smooth order-2 lg:order-1">
            {selectedProvince ? (
              <>
                <div className="sticky top-0 bg-brand-linen p-3 rounded-lg border-2 border-brand-bud mb-4 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-brand-obsidian">จังหวัด{selectedProvince}</h3>
                      <p className="text-xs text-brand-earth">พบ {provinceGroupsInView.length} กลุ่ม</p>
                    </div>
                    <button
                      onClick={() => setSelectedProvince(null)}
                      className="text-xs bg-brand-obsidian text-brand-linen px-3 py-1 rounded hover:bg-brand-earth transition-colors"
                    >
                      ดูทุกจังหวัด
                    </button>
                  </div>
                </div>
                
                {provinceGroupsInView.map(group => (
                  <div 
                      key={group.id} 
                      ref={(el) => { if (el) itemRefs.current[group.id] = el; }}
                      className="p-4 rounded-xl border-2 border-brand-gray bg-white hover:border-brand-ocean hover:shadow-md transition-all"
                  >
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{group.name}</h3>
                      </div>
                      <p className="text-xs text-brand-earth mb-3 line-clamp-2">{group.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                          {group.issues.map(tag => (
                              <span key={tag} className="text-[10px] uppercase tracking-wide bg-brand-linen px-2 py-1 rounded text-brand-obsidian font-medium">
                                  {tag}
                              </span>
                          ))}
                      </div>
                      <Link 
                        to={`/groups/${group.id}`}
                        className="block text-center text-sm bg-brand-orange text-white py-2 px-4 rounded hover:bg-brand-earth transition-colors"
                      >
                        ดูรายละเอียด
                      </Link>
                  </div>
                ))}
                {provinceGroupsInView.length === 0 && (
                    <div className="text-center py-10 text-brand-earth bg-white rounded-xl border border-brand-gray border-dashed">
                        ไม่พบกลุ่มในจังหวัดนี้
                    </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-brand-earth bg-white rounded-xl border-2 border-brand-gray">
                <p className="text-lg font-bold mb-2">คลิกที่จังหวัดบนแผนที่</p>
                <p className="text-sm mb-3">เพื่อดูกลุ่มเยาวชนในจังหวัดนั้น</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img 
                    src="/image/icons/youth-group-icon/Asset 4.svg" 
                    alt="Icon" 
                    className="w-8 h-8"
                  />
                  <span className="text-xs text-brand-obsidian">= มีกลุ่มเยาวชนในจังหวัด</span>
                </div>
                <div className="mt-4 text-xs text-brand-orange bg-brand-orange/10 p-3 rounded-lg mx-8">
                  🔒 เพื่อความปลอดภัย เราไม่แสดงพิกัดที่แน่นอนของกลุ่ม<br/>
                  ไอคอนแสดงประเด็นหลักของกลุ่มในแต่ละจังหวัด
                </div>
              </div>
            )}
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 h-full min-h-[400px]">
            <MapComponent 
              groups={filteredGroups} 
              selectedProvince={selectedProvince} 
              onProvinceSelect={setSelectedProvince} 
            />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
