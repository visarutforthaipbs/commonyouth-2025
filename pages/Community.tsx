
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Group } from '../types';
import { Search, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Community: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getGroups().then(setGroups);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-darkGreen mb-4">ทำเนียบเครือข่าย</h1>
        <p className="text-brand-earth max-w-2xl mx-auto">สำรวจเครือข่ายความคิดริเริ่มของเยาวชนที่ขับเคลื่อนการเปลี่ยนแปลงทั่วประเทศ</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative mb-12">
        <input 
            type="text" 
            placeholder="ค้นหาชุมชน..." 
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-brand-darkGreen shadow-retro focus:outline-none focus:shadow-none focus:translate-y-1 transition-all bg-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-earth w-5 h-5" />
      </div>

      {/* Browser Window Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(group => (
          <div key={group.id} className="bg-white rounded-xl border-2 border-brand-darkGreen overflow-hidden hover:shadow-retro transition-shadow duration-300 flex flex-col">
            {/* Browser Header */}
            <div className="bg-brand-cream border-b-2 border-brand-darkGreen p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-salmon border border-brand-darkGreen"></div>
                <div className="w-3 h-3 rounded-full bg-brand-yellow border border-brand-darkGreen"></div>
                <div className="w-3 h-3 rounded-full bg-brand-green border border-brand-darkGreen"></div>
                <div className="ml-auto text-[10px] font-mono text-brand-earth bg-white px-2 rounded border border-brand-gray truncate max-w-[120px]">
                    commons-youth.org/{group.id}
                </div>
            </div>

            {/* Content */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
                <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 bg-brand-darkGreen text-white px-3 py-1 text-xs font-bold rounded-tr-lg">
                    {group.province}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-brand-darkGreen">{group.name}</h3>
                <p className="text-sm text-brand-earth font-ui mb-4 line-clamp-3 flex-grow">
                    {group.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {group.issues.map(tag => (
                        <span key={tag} className="text-xs bg-brand-blue/10 text-brand-blue font-bold px-2 py-1 rounded">
                            #{tag.split(' ')[0]}
                        </span>
                    ))}
                </div>

                <button 
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="w-full py-2 border-2 border-brand-darkGreen rounded-lg font-bold hover:bg-brand-darkGreen hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
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
