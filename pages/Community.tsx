
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../services/authContext';
import { Group } from '../types';
import { Search, Globe, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Community: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getGroups().then(setGroups);
  }, []);

  const handleToggleVisibility = async (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        await apiService.updateGroup(group.id, { isHidden: !group.isHidden });
        setGroups(currentGroups => 
            currentGroups.map(g => g.id === group.id ? { ...g, isHidden: !g.isHidden } : g)
        );
    } catch (error) {
        console.error("Failed to update visibility", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const filteredGroups = groups.filter(g => 
    !g.isHidden || (user?.role === 'admin' || g.ownerId === user?.uid)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO 
        title="เครือข่ายเยาวชน" 
        description="ค้นหาและเชื่อมต่อกับกลุ่มกิจกรรมเพื่อสังคม กลุ่มเยาวชน และองค์กรภาคประชาสังคมทั่วไทย"
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-obsidian mb-4 uppercase">ทำเนียบเครือข่าย</h1>
        <p className="text-brand-earth max-w-2xl mx-auto">สำรวจเครือข่ายความคิดริเริ่มของเยาวชนที่ขับเคลื่อนการเปลี่ยนแปลงทั่วประเทศ</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative mb-12">
        <input 
            type="text" 
            placeholder="ค้นหาชุมชน..." 
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-brand-obsidian shadow-retro focus:outline-none focus:shadow-none focus:translate-y-1 transition-all bg-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-earth w-5 h-5" />
      </div>

      {/* Browser Window Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filteredGroups.map(group => (
          <div key={group.id} className={`bg-white rounded-xl border-2 border-brand-obsidian overflow-hidden hover:shadow-retro transition-shadow duration-300 flex flex-col ${group.isHidden ? 'opacity-75' : ''}`}>
            {/* Browser Header */}
            <div className={`bg-brand-linen border-b-2 border-brand-obsidian p-3 flex items-center gap-2 ${group.isHidden ? 'bg-gray-200' : ''}`}>
                <div className="w-3 h-3 rounded-full bg-brand-orange border border-brand-obsidian"></div>
                <div className="w-3 h-3 rounded-full bg-brand-morning border border-brand-obsidian"></div>
                <div className="w-3 h-3 rounded-full bg-brand-bud border border-brand-obsidian"></div>
                <div className="ml-auto text-[10px] font-mono text-brand-earth bg-white px-2 rounded border border-brand-gray truncate max-w-[120px]">
                    commons-youth.org/{group.id}
                </div>
            </div>

            {/* Content */}
            <div className="relative h-40 overflow-hidden bg-gray-100 group">
                <img src={group.imageUrl} alt={group.name} className={`w-full h-full object-cover ${group.isHidden ? 'grayscale' : ''}`} />
                <div className="absolute bottom-0 left-0 bg-brand-obsidian text-white px-3 py-1 text-xs font-bold rounded-tr-lg z-10">
                    {group.province}
                </div>
                
                {group.isHidden && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-0">
                       <span className="bg-red-500 text-white px-3 py-1 rounded font-bold text-xs border border-white">ส่วนตัว (Hidden)</span>
                   </div>
                )}

                {user?.role === 'admin' && (
                    <button
                        onClick={(e) => handleToggleVisibility(group, e)}
                        className="absolute top-2 right-2 z-20 bg-white/90 p-1.5 rounded-full shadow-md text-brand-obsidian hover:bg-brand-morning transition-colors border-2 border-brand-obsidian"
                        title={group.isHidden ? "แสดงกลุ่มนี้" : "ซ่อนกลุ่มนี้"}
                    >
                        {group.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-brand-obsidian">{group.name} {group.isHidden && <span className="text-red-500 text-xs">(ซ่อน)</span>}</h3>
                <p className="text-sm text-brand-earth mb-4 line-clamp-3 flex-grow">
                    {group.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {group.issues.map(tag => (
                        <span key={tag} className="text-xs bg-brand-ocean/10 text-brand-ocean font-bold font-mono px-2 py-1 rounded">
                            #{tag.split(' ')[0]}
                        </span>
                    ))}
                    {(group.amphoe || group.tambon) && (
                        <span className="text-xs bg-brand-linen text-brand-earth font-bold font-mono px-2 py-1 rounded border border-brand-gray/50">
                            {group.tambon && `${group.tambon}, `}{group.amphoe}
                        </span>
                    )}
                </div>

                <button 
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="w-full py-2 border-2 border-brand-obsidian rounded-lg font-bold hover:bg-brand-obsidian hover:text-brand-linen transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <Globe className="w-4 h-4" /> ดูข้อมูลกลุ่ม
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
