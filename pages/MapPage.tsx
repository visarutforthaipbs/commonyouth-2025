
import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { Group, ISSUES } from '../types';
import MapComponent from '../components/MapComponent';
import { Filter, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const MapPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterIssue, setFilterIssue] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  
  // Refs for scrolling to list items
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    apiService.getGroups().then(setGroups);
  }, []);

  // Handle navigation from Detail page with pre-selected group
  useEffect(() => {
    if (location.state && location.state.selectedGroupId) {
      setSelectedId(location.state.selectedGroupId);
    }
  }, [location]);

  // Scroll to selected item when selectedId changes or groups load
  useEffect(() => {
    if (selectedId && itemRefs.current[selectedId]) {
      itemRefs.current[selectedId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedId, groups]);

  const filteredGroups = groups.filter(group => {
    const matchesIssue = filterIssue === 'All' || group.issues.includes(filterIssue);
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          group.province.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesIssue && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <span className="w-8 h-8 bg-brand-salmon rounded-full inline-block mr-3"></span>
        แผนที่พลังเยาวชน
      </h1>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border-2 border-brand-gray mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center w-full md:w-auto bg-brand-cream rounded-lg px-3 py-2 border border-brand-gray">
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
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterIssue === 'All' ? 'bg-brand-darkGreen text-white' : 'bg-brand-cream text-brand-darkGreen hover:bg-brand-gray'}`}
            >
                ประเด็นทั้งหมด
            </button>
            {ISSUES.map(issue => (
                <button 
                    key={issue}
                    onClick={() => setFilterIssue(issue)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterIssue === issue ? 'bg-brand-green text-white' : 'bg-brand-cream text-brand-darkGreen hover:bg-brand-gray'}`}
                >
                    {issue}
                </button>
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
        {/* Group List (Sidebar) */}
        <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-4 h-full scroll-smooth">
            <p className="text-sm text-brand-earth font-bold mb-2">พบ {filteredGroups.length} กลุ่ม</p>
            {filteredGroups.map(group => (
                <div 
                    key={group.id} 
                    ref={(el) => { if (el) itemRefs.current[group.id] = el; }}
                    onClick={() => setSelectedId(group.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedId === group.id 
                        ? 'border-brand-green bg-brand-green/10 shadow-[0_0_15px_rgba(122,168,116,0.3)] scale-[1.02] ring-1 ring-brand-green z-10' 
                        : 'border-brand-gray bg-white hover:border-brand-blue hover:shadow-md'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{group.name}</h3>
                        <span className="text-xs bg-brand-yellow/30 text-brand-darkGreen px-2 py-0.5 rounded border border-brand-yellow/50">{group.province}</span>
                    </div>
                    <p className="text-xs text-brand-earth mb-3 line-clamp-2">{group.description}</p>
                    <div className="flex flex-wrap gap-1">
                        {group.issues.map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wide bg-brand-cream px-2 py-1 rounded text-brand-darkGreen font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
            {filteredGroups.length === 0 && (
                <div className="text-center py-10 text-brand-earth bg-white rounded-xl border border-brand-gray border-dashed">
                    ไม่พบกลุ่มที่ตรงกับเงื่อนไขการค้นหา
                </div>
            )}
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 h-full min-h-[400px]">
            <MapComponent groups={filteredGroups} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
